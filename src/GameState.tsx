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
        // Enviamos la solicitud de estado inicial
        connection.send(JSON.stringify({
            type: "getInitialState"
        }));
        console.log("Action sent.");
    }
}

export class Actions {
    //Estos son los estados posibles
    static generateChangeUnitPos(unit_id: number, new_position: Pair, selectedUnit: number, player:boolean) : Redux.AnyAction {
        //Este estado es el de cambiar la posición (justo cuando hace clic de a donde quiere ir)
        return {
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
            type: "MOVE",
            unit_id: unit_id,
            player: player
        };
    }

    static generateCursorMovement(new_position: Pair) : Redux.AnyAction {
        return {
            type: "CURSOR_MOVE",
            position: new_position
        }
    }

    static generateSetListener(map: Map) : Redux.AnyAction {
        //Este es el estado de espera para seleccionar una unidad
        return {
            type: "SET_LISTENER",
            map: map
        };
    }

    static generateAttack( defendingUnitId: number, player: boolean, selectedUnit: number) : Redux.AnyAction {
        //Este estado se envía la unidad a atacar (se eliminará del array) y si es del jugador o no
        return {
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
            type: "FINISH"
        }
    }

    static generateNextTurn() : Redux.AnyAction{
        return {
            type: "NEXT_TURN"
        }
    }

    static generateNextAction(selectedUnit: number) : Redux.AnyAction{
        return {
            selectedUnit: selectedUnit,
            type: "NEXT_ACTION"
        }
    }

    static generateCustomMap(terrains: Terrain[]) : Redux.AnyAction {
        return {
            terrains: terrains,
            type: "CUSTOM_MAP_INIT"
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
                    // Actualiza la posición
                    state.units[action.unit_id].position = action.new_position;
                    // En el caso de estar fuera de la fase de pre juego, donde posicionamos las unidades sin causar turnos
                    if(state.turn >= 2) {
                        state.units[action.unit_id].action = 1;
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
                // Obtenemos el índice de la casilla
                let terrainIndex = myIndexOf(
                    // Convertimos el array de terrenos a sus posiciones
                    state.terrains.map(terrain => terrain.position), defendingUnit.position)
                let terrain = terrainIndex > -1?state.terrains[terrainIndex]:null;
                // Después, calculamos la cantidad de vida a eliminar
                let healthRemoved = attackingUnit.calculateAttack(defendingUnit, terrain?terrain.defenseWeak:0, terrain?terrain.defenseStrong:0);
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
                //Se actualizan los used
                for(var i = 0 ; i < state.units.length ; i++) {
                    state.units[i].used = false;
                    // Actualizamos también el estado de ataque
                    state.units[i].hasAttacked = false;
                    state.units[i].action = 0;
                }
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
            case "CUSTOM_MAP_INIT":
                // Si se quiere importar un mapa, se cambiará los terrenos
                return {
                    turn: state.turn,
                    actualState: state.actualState,
                    units: state.units,
                    visitables: state.visitables,
                    terrains: action.terrains,
                    map: state.map,
                    cursorPosition: state.cursorPosition,
                    selectedUnit: state.selectedUnit,
                    type: state.type
                }
            default:
                return state;
        }
    }
