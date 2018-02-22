import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { store, saveState } from './Store';
import { Map } from './Map';
import { Pair, Cubic, CUBIC_DIRECTIONS, myIndexOf, myIndexOfCubic, Pathfinding, Network } from './Utils';
import { Unit, Infantry, Tank, General } from './Unit';
import { Terrain, Plains, ImpassableMountain, Hills, Forest } from './Terrains';

//Aquí declaramos las variables del estado
export type State = {
    readonly turn: number,
    readonly actualState: number,
    readonly units: Array<Unit>,
    readonly visitables: Array<Pair>,
    readonly terrains: Array<Terrain>,
    readonly cursorPosition: Pair,
    readonly map: Map,
    readonly selectedUnit: number,
    readonly type: string
}

//El estado inicial será este (selectedUnit es el valor del indice en la lista de unidades(position) de la unidad seleccionada)
export var InitialState: State = undefined;

// Esta función se encargará de devolver el estado inicial, es la única forma de ofrecer un objeto inmutable:
export function getInitialState(callback: () => void) {
    // Creamos la petición al servidor
    var connection = new WebSocket("ws://localhost:8080/");
    console.log("Connection established with server");
    // Establecemos la conexión
    connection.onmessage = function(event: MessageEvent) {
        console.log("Receiving data ...");
        console.log("Message: "+event.data);
        if(event.data == "Command not understood") {
            // Enviamos un error, algo ha pasado con el servidor
            throw new Error;
        }
        // Obtenemos el estado
        InitialState = Network.parseStateFromServer(event.data);
        // Una vez tengamos el estado, llamamos al callback aportado, que permitirá saber con certeza que el estado está disponible
        callback();
    };
    connection.onopen = function() {
        console.log("Connection available for sending action");
        // Enviamos la solicitud de estado inicial (se ha modificado a tipo para hacer el menor número de cambios posibles al código)
        // La variable tipo indica el tipo de la acción
        connection.send(JSON.stringify({
            tipo: "getInitialState"
        }));
        console.log("Action sent.");
    }
}

export class Actions {
    //Estos son los estados posibles

    static selectUnit(selectedUnit: number): Redux.AnyAction {
        //Este estado es el de cambiar la posición (justo cuando hace clic de a donde quiere ir)
        return {
            tipo: "SAVE_MAP",
            type: "SELECT",
            selectedUnit: selectedUnit
        };
    }

    static generateChangeUnitPos(unit_id: number, new_position: Pair, selectedUnit: number, player:boolean) : Redux.AnyAction {
        //Este estado es el de cambiar la posición (justo cuando hace clic de a donde quiere ir)
        return {
            tipo: "SAVE_MAP",
            type: "CHANGE_UNIT_POS",
            unit_id: unit_id,
            new_position: new_position,
            selectedUnit: selectedUnit,
            player: player
        };
    }

    static generateMove(unit_id: number,player: boolean) : Redux.AnyAction {
        //ESte estado es el de mantener la unidad seleccionada
        return {
            tipo: "SAVE_MAP",
            type: "MOVE",
            unit_id: unit_id,
            player: player
        };
    }

    static generateCursorMovement(new_position: Pair) : Redux.AnyAction {
        return {
            tipo: "SAVE_MAP",
            type: "CURSOR_MOVE",
            position: new_position
        }
    }

    static generateSetListener(map: Map) : Redux.AnyAction {
        //Este es el estado de espera para seleccionar una unidad
        return {
            tipo: "SAVE_MAP",
            type: "SET_LISTENER",
            map: map
        };
    }

    static generateAttack( defendingUnitId: number, player: boolean, selectedUnit: number) : Redux.AnyAction {
        //Este estado se envía la unidad a atacar (se eliminará del array) y si es del jugador o no
        return {
            tipo: "SAVE_MAP",
            type: "ATTACK",
            defendingUnitId: defendingUnitId,
            selectedUnit: selectedUnit,
            player: player
        }
    }

    // Se le pasa el mapa porque es necesario, en caso contrario no se podría reiniciar correctamente.
    static generateFinish() : Redux.AnyAction {
        //Este estado por ahora simplemente hace que no se pueda jugar hasta que se reinicie la partida
        return {
            tipo: "SAVE_MAP",
            type: "FINISH"
        }
    }

    static generateNextTurn() : Redux.AnyAction{
        return {
            tipo: "SAVE_MAP",
            type: "NEXT_TURN"
        }
    }

    static generateNextAction(selectedUnit: number) : Redux.AnyAction{
        return {
            tipo: "SAVE_MAP",
            selectedUnit: selectedUnit,
            type: "NEXT_ACTION"
        }
    }

    static generatePreGameConfiguration(terrains: Terrain[], units: Unit[]) : Redux.AnyAction {
        return {
            // Como es pre juego, el estado debe sincronizarse con el servidor
            tipo: "SYNC_STATE",
            // Introducimos todo el estado dentro del envío al servidor
            state: {
                turn: 0,
                actualState: store.getState().actualState,
                visitables: store.getState().visitables,
                cursorPosition: store.getState().cursorPosition,
                map: store.getState().map,
                selectedUnit: store.getState().selectedUnit,
                type: store.getState().type,
                terrains: terrains,
                units: units,
            },
            type: "PRE_GAME_CONFIGURATION"
        };
    }

    static generateNewStateFromServer(state: State) : Redux.AnyAction {
        return {
            type: "NEW_STATE_FROM_SERVER",
            state: state
        };
    }
}

//Y aquí se producirá el cambio
export const Reducer : Redux.Reducer<State> =
    (state: State = InitialState, action: Redux.AnyAction) => {
        //Dependiendo del tipo se cambiarán las variables del estado
        switch(action.type) {
            case "CHANGE_UNIT_POS":
                let visitables = state.visitables;
                // Si la unidad la tiene el jugador
                if(action.player==state.units[action.unit_id].player){
                    let lastPosition = state.units[action.unit_id].position;
                    // Actualiza la posición
                    state.units[action.unit_id].position = action.new_position;
                    // En el caso de estar fuera de la fase de pre juego, donde posicionamos las unidades sin causar turnos
                    if(state.turn >= 2) {
                        //Si es paracaidista pasa directamente a estado usado
                        if(state.units[action.unit_id].name=="Paratrooper" && !lastPosition.equals(action.new_position)){
                            state.units[action.unit_id].used = true;
                            state.units[action.unit_id].hasAttacked = true;
                            state.units[action.unit_id].action = 2;
                        }else{
                            state.units[action.unit_id].action = 1;
                        }
                    }else{
                        state.units[action.unit_id].action = 2;
                        state.units[action.unit_id].used = true;
                        state.units[action.unit_id].hasAttacked = true;
                    }

                }
                // Si la unidad tiene posiblidad de atacar
                if(!state.units[action.unit_id].hasAttacked && state.units[action.unit_id].action==1) {
                    // Regeneramos los visitables, pero esta vez sólo obteniendo la distancia absoluta para los enemigos
                    visitables = Pathfinding.getAttackableUnits(state.units[action.unit_id]);
                }
                return {
                    turn: state.turn,
                    actualState: state.actualState,
                    units: state.units,
                    visitables: [],
                    terrains: state.terrains,
                    map: state.map,
                    selectedUnit: action.selectedUnit,
                    cursorPosition: state.cursorPosition,
                    type: "SET_LISTENER"
                };
            case "MOVE":
                // Casillas disponibles
                let visitables_pair: Array<Pair> = [];
                // Si la unidad actual está en fase de ataque.
                if(state.units[action.unit_id].action == 1) {
                    // Ejecutamos el método para encontrar unidades enemigas atacables
                    visitables_pair = Pathfinding.getAttackableUnits(state.units[action.unit_id]);
                } else { // En caso contrario
                    // Ejecutamos el método para encontrar casillas movibles
                    visitables_pair = Pathfinding.getMovableCells(state, action.unit_id, action.player);
                }

                return {
                    turn: state.turn,
                    actualState: state.actualState,
                    units: state.units,
                    visitables: visitables_pair,
                    terrains: state.terrains,
                    map: state.map,
                    selectedUnit: action.unit_id,
                    cursorPosition: state.cursorPosition,
                    type: "MOVE"
                };
            case "SET_LISTENER":
                return {
                    turn: state.turn,
                    actualState: state.actualState,
                    units: state.units,
                    visitables: state.visitables,
                    terrains: state.terrains,
                    map: action.map,
                    selectedUnit: null,
                    cursorPosition: state.cursorPosition,
                    type: "SET_LISTENER"
                };
            case "CURSOR_MOVE":
                return {
                    turn: state.turn,
                    actualState: state.actualState,
                    units: state.units,
                    visitables: state.visitables,
                    terrains: state.terrains,
                    map: state.map,
                    cursorPosition: action.position,
                    selectedUnit: state.selectedUnit,
                    type: state.type
                };
            case "ATTACK":
                // Lógica de ataque
                // Primero, obtenemos la unidad atacando y defendiendo
                let defendingUnit = state.units[action.defendingUnitId];
                let attackingUnit = state.units[state.selectedUnit];
                // Necesitamos externalizar también el índice de la unidad actual, porque será útil al eliminar la unidad
                let selectedUnit = action.selectedUnit;
                // Obtenemos también el terreno de la unidad a atacar, para obtener la defensa
                // Obtenemos el índice de la casilla del defensor
                let defendingTerrainIndex = myIndexOf(
                    // Convertimos el array de terrenos a sus posiciones
                    state.terrains.map(terrain => terrain.position), defendingUnit.position)
                // Obtenemos el terreno del defensor, teniendo en cuenta que cuando no exista, será Plains
                let defendingTerrain = defendingTerrainIndex > -1?state.terrains[defendingTerrainIndex]:null;
                // Con el mismo procedimiento, encontraremos la posición del atacante
                let attackingTerrainIndex = myIndexOf(
                    // Convertimos el array de terrenos a sus posiciones
                    state.terrains.map(terrain => terrain.position), attackingUnit.position);
                let attackingTerrain = attackingTerrainIndex > -1?state.terrains[attackingTerrainIndex]:null;
                // Después, calculamos la cantidad de vida a eliminar
                let healthRemoved = attackingUnit.calculateAttack(defendingUnit,
                     defendingTerrain?defendingTerrain.defenseWeak:0, defendingTerrain?defendingTerrain.defenseStrong:0,
                     attackingTerrain?attackingTerrain.attackWeak:0, attackingTerrain?attackingTerrain.attackStrong:0);
                // Comprobamos que la unidad defendiendo le queden todavía vida
                if (defendingUnit.health - healthRemoved > 0) {
                    // Si es el caso, le cambiamos la cantidad de vida
                    defendingUnit.health -= healthRemoved;
                } else {
                    // Esta unidad ha dejado de existir (no se puede de la otra forma porque no se borra correctamente)
                    state.units.splice(action.defendingUnitId, 1);
                    // Y por lo tanto no podemos estar apuntandole como seleccionada
                    if (action.selectedUnit > action.defendingUnitId) {
                        selectedUnit -= 1;
                    }
                }
                // Debemos actualizar el estado de la unidad, al realizarse un movimiento
                attackingUnit.used = true;
                // También actualizamos el estado para avisar que ha atacado
                attackingUnit.hasAttacked = true;
                attackingUnit.action = 2;
                var actualstate = state.actualState;
                //Si no está el general del jugador entonces se considerará victoria o derrota (esto ya incluye también que no queden más unidades)
                if(state.units.filter(x => !x.player && x.name=="General").length==0){
                    actualstate=1;
                }else if(state.units.filter(x => x.player && x.name=="General").length==0){
                    actualstate=2;
                }
                return {
                    turn: state.turn,
                    actualState: actualstate,
                    units: state.units,
                    visitables: [],
                    terrains: state.terrains,
                    map: state.map,
                    cursorPosition: state.cursorPosition,
                    selectedUnit: selectedUnit,
                    type: "SET_LISTENER"
                }
            case "FINISH":
                // En este caso retornamos el objeto inicial InitialState.
                return InitialState;
            case "NEXT_TURN":
                // Comprobamos el tipo de turno, si es pre juego o no
                if(state.turn < 1) {
                    // Si es pre juego, simplemente recargaremos las unidades
                    for(var i = 0 ; i < state.units.length ; i++) {
                        state.units[i].used = false;
                        state.units[i].hasAttacked = false;
                        state.units[i].action = 0;
                    }
                }
                // Primero, bloqueamos las unidades del jugador, para evitar que haga movimientos durante la espera del turno
                // Ahora iteramos por éstas y le activaremos el usado
                for(let unitIndex = 0; unitIndex < store.getState().units.length; unitIndex++) {
                    // Debido al hecho de que si asignamos la unidad a una variable, ésta no cambiará la unidad en el array,
                    // se utilizará directamente la unidad del array
                    if(store.getState().units[unitIndex].player) {
                        // Si la unidad es del jugador, se desactivará
                        store.getState().units[unitIndex].used = true;
                        store.getState().units[unitIndex].hasAttacked = true;
                        store.getState().units[unitIndex].action = 2;
                    }
                }
                // Ahora, teniendo el control del jugador desactivado, se llamará a la espera del turno del otro jugador
                Network.sendWaitTurn((statusCode) => {
                    // Comprobamos el resultado
                    if(statusCode.status) {
                        // Si ha salido bien, llamaremos al nuevo estado
                        store.dispatch(Actions.generateNewStateFromServer(statusCode.state));
                    } else {
                        // En caso contrario avisaremos al cliente
                        console.log(statusCode.error);
                        // Y indicaremos que la conexión ha fallado y que debe reiniciar la pestaña
                        window.alert("No se ha podido enviar la información al servidor, por favor, recargue esta pestaña para continuar");
                    }
                    // Finalmente, aseguramos que las unidades del jugador son seleccionables
                    for(var i = 0 ; i < state.units.length ; i++) {
                        state.units[i].used = false;
                        state.units[i].hasAttacked = false;
                        state.units[i].action = 0;
                    }
                })
                return {
                    turn: state.turn+1,
                    actualState: state.actualState,
                    units: state.units,
                    visitables: null,
                    terrains: state.terrains,
                    map: state.map,
                    cursorPosition: state.cursorPosition,
                    selectedUnit: null,
                    type: "SET_LISTENER"
                }
            case "NEXT_ACTION":
                state.units[action.selectedUnit].action++;
                if(state.units[action.selectedUnit].action>=2){
                    state.units[action.selectedUnit].used = true;
                    state.units[action.selectedUnit].hasAttacked = true;
                }
                return {
                    turn: state.turn,
                    actualState: state.actualState,
                    units: state.units,
                    visitables: null,
                    terrains: state.terrains,
                    map: state.map,
                    cursorPosition: state.cursorPosition,
                    selectedUnit: null,
                    type: "SET_LISTENER"
                }
            case "PRE_GAME_CONFIGURATION":
                // Si se quiere importar un mapa, se cambiará los terrenos y las unidades
                return {
                    turn: state.turn,
                    actualState: state.actualState,
                    units: action.state.units,
                    visitables: state.visitables,
                    terrains: action.state.terrains,
                    map: state.map,
                    cursorPosition: state.cursorPosition,
                    selectedUnit: state.selectedUnit,
                    type: state.type
                }
            case "SELECT":
                state.units[action.selectedUnit].action = 0;
                state.units[action.selectedUnit].used = false;
                state.units[action.selectedUnit].hasAttacked = false;
                //Simplemente se modificará la unidad seleccionada
                return {
                    turn: state.turn,
                    actualState: state.actualState,
                    units: state.units,
                    visitables: state.visitables,
                    terrains: state.terrains,
                    map: state.map,
                    cursorPosition: state.cursorPosition,
                    selectedUnit: action.selectedUnit,
                    type: "SET_LISTENER"
                }
            case "NEW_STATE_FROM_SERVER":
                // Reemplazamos el estado obtenido por la acción
                InitialState = action.state;
                // Y retornamos el estado de la acción
                return action.state;
            default:
                return state;
        }
    }
