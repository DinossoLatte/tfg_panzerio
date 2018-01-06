import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { store, saveState } from './Store';
import { Map } from './Map';
import { Pair, Cubic, cubic_directions, myIndexOf, myIndexOfCubic, Pathfinding} from './Utils';
import { Unit, Infantry, Tank, General } from './Unit';
import { Terrain, Plains, ImpassableMountain, Hills, Forest } from './Terrains';

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

    static attack( defendingUnitId: number, player: boolean, selectedUnit: number) : Redux.AnyAction {
        //Este estado se envía la unidad a atacar (se eliminará del array) y si es del jugador o no
        return {
            type: "ATTACK",
            defendingUnitId: defendingUnitId,
            selectedUnit: selectedUnit,
            player: player
        }
    }

    // Se le pasa el mapa porque es necesario, en caso contrario no se podría reiniciar correctamente.
    static finish() : Redux.AnyAction {
        //Este estado por ahora simplemente hace que no se pueda jugar hasta que se reinicie la partida
        return {
            type: "FINISH"
        }
    }

    static nextTurn() : Redux.AnyAction{
        return {
            type: "NEXT_TURN"
        }
    }

    static nextAction(selectedUnit: number) : Redux.AnyAction{
        return {
            selectedUnit: selectedUnit,
            type: "NEXT_ACTION"
        }
    }
}

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

// Esta función se encargará de devolver el estado inicial, es la única forma de ofrecer un objeto inmutable:
function getInitialState(): State {
    return {
        turn: 0,
        actualState: 0,
        units: [General.create(new Pair (0,0), true), Infantry.create(new Pair(1,2), true), Tank.create(new Pair (1,0), true), General.create(new Pair (0,4), false)
        , Infantry.create(new Pair(1,4), false), Tank.create(new Pair (0,3), false)],
        visitables: null,
        terrains: [ImpassableMountain.create(new Pair(2, 2)), ImpassableMountain.create(new Pair(3,2)), Hills.create(new Pair(2,3)), Forest.create(new Pair(3,3))],
        cursorPosition: new Pair(0,0),
        map: null,
        selectedUnit: null,
        type: "SET_LISTENER"
    };
}

//El estado inicial será este (selectedUnit es el valor del indice en la lista de unidades(position) de la unidad seleccionada)
export const InitialState: State = getInitialState();

//Y aquí se producirá el cambio
export const Reducer : Redux.Reducer<State> =
    (state: State = InitialState, action: Redux.AnyAction) => {
        //Dependiendo del tipo se cambiarán las variables del estado
        switch(action.type) {
            case "CHANGE_UNIT_POS":
                let visitables = state.visitables;
                //Si es una unidad del jugador actual y no es la misma posición, actualiza su uso y su posición, sino el movimiento se considera cancelado
                if(action.player==state.units[action.unit_id].player && !state.units[action.unit_id].position.equals(action.new_position)){
                    state.units[action.unit_id].position = action.new_position;
                    //state.units[action.unit_id].used = true;
                    state.units[action.unit_id].action = 1;
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
                // Para reducir los cálculos del movimiento, vamos a realizar en este punto el cálculo de las celdas visitables
                var visitables_cubic : Array<Cubic> = [new Cubic(state.units[action.unit_id].position)];
                var movements : number = state.units[action.unit_id].movement;
                // Los vecinos estarán compuestos por la posición cúbica y el número de movimientos para pasar la posición
                var neighbours : [Cubic, number][] = new Array<[Cubic, number]>();
                // En esta variable se guardarán las posiciones de las unidades atacables, que deben separarse porque no se pueden considerar como atravesables.
                var enemyUnits : Cubic[] = new Array<Cubic>();
                // Primero, iteraremos desde 0 hasta el número de movimientos
                for(var i = 0 ; i <= movements ; i++) {
                    // Calculamos los próximos vecinos:
                    var new_neighbours: [Cubic, number][] = [];
                    visitables_cubic = visitables_cubic.concat(neighbours.filter(possible_tuple => possible_tuple[1] == 0).map(x => x[0]));

                    for(var index_directions = 0; index_directions < cubic_directions.length; index_directions++) {
                        visitables_cubic.forEach(cubic => {
                            var new_cubic = cubic.add(cubic_directions[index_directions]);
                            // Siempre que la nueva casilla no esté en la lista de visitables ni sea una posición no alcanzable.
                            if(myIndexOfCubic(visitables_cubic, new_cubic) == -1) {
                                var indexOfNeighbours = myIndexOfCubic(neighbours.map(x => x[0]), new_cubic);
                                // Para añadir la posición, comprobamos primero que no esté la posición:
                                if(indexOfNeighbours == -1) {
                                    // Si es el caso, debemos comprobar que la posición no esté ocupada por una de las unidades del jugador
                                    var positionIndex = state.units
                                        .filter(x => x.player==action.player) // Si debe estar ocupada por una unidad, que sea únicamente la enemigas
                                        .map(y => y.position);
                                    if(myIndexOf(positionIndex, new_cubic.getPair()) == -1) {
                                        // Primero, comprobamos que se trate de una unidad enemiga, simplemente comprobando si está en la lista es suficiente
                                        let indexUnit = myIndexOf(state.units.map(x => x.position), new_cubic.getPair());
                                        // En el caso en el que esté, la añadimos a la lista de atacables y acabamos
                                        if(indexUnit != -1) {
                                            // Añadimos a lista de atacables, sólo si no está en la lista y ésta iteración es el alcance del ataque más uno.
                                            myIndexOfCubic(enemyUnits, new_cubic) == -1 && i < state.units[action.unit_id].range?enemyUnits.push(new_cubic):false;
                                        } else { // En caso contrario, es una posición sin unidades
                                            // Obtenemos el índice del obstáculo, si es que está.
                                            let indexOfObstacle = myIndexOf(state.terrains.map(x => x.position), new_cubic.getPair());
                                            // Si se admite, añadimos la posición y la cantidad de movimientos para pasar por la casilla
                                            // Por ahora se comprueba si está en la lista de obstáculos, en cuyo caso coge la cantidad. En caso contrario, asumimos Plains
                                            new_neighbours.push([new_cubic, indexOfObstacle > -1?state.terrains[indexOfObstacle].movement_penalty-1:0]);
                                        }
                                    }
                                } else { // Si no, esta casilla ya la tenemos en vecinos, pero tiene un movimiento != 0, por lo que reducimos el movimiento de la casilla
                                    // Actualizamos el movimiento de la unidad, si es el caso.
                                    var cell = neighbours[indexOfNeighbours];
                                    // Siempre que sea reducible
                                    if (cell[1] > 0) {
                                        // Obtenemos el índice de la iteración actual
                                        var index = myIndexOfCubic(new_neighbours.map(x => x[0]), cell[0]);
                                        // Si no está en nuestra lista de vecinos
                                        if (index == -1) {
                                            // Lo añadimos y le reducimos el peso
                                            new_neighbours.push([new_cubic, cell[1] - 1]);
                                        } else {
                                            // Si ya está en nuestra lista de vecinos, accedemos y lo reemplazamos reducciendo en uno
                                            new_neighbours[index] = [new_cubic, cell[1] - 1];
                                        }
                                    }
                                }
                            }
                        });
                        neighbours = new_neighbours;
                    }
                }
                var visitables_pair : Array<Pair>;
                if(state.units[action.unit_id].action==0){
                    visitables_pair = visitables_cubic.map(cubic => cubic.getPair());
                }else{
                    visitables_pair = enemyUnits.map(x => x.getPair());
                }
                // Finalmente convertimos el resultado a Pair:
                //var visitables_pair : Array<Pair> = visitables_cubic.map(cubic => cubic.getPair());
                // Sin olvidar las unidades atacables!
                //visitables_pair = visitables_pair.concat(enemyUnits.map(x => x.getPair()));

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
                    selectedUnit: state.selectedUnit,
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
                // Después, calculamos la cantidad de vida a eliminar
                let healthRemoved = attackingUnit.calculateAttack(defendingUnit);
                // Comprobamos que la unidad defendiendo le queden todavía vida
                if (defendingUnit.health - healthRemoved > 0) {
                    // Si es el caso, le cambiamos la cantidad de vida
                    defendingUnit.health -= healthRemoved;
                } else {
                    // Esta unidad ha dejado de existir
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
                // Asignamos de nuevo el estado usando la función de estado inicial
                var newState = getInitialState();
                // Retornamos el estado, asignamos el mapa porque algunas funciones dependen de éste.
                return {
                    turn: newState.turn,
                    actualState: newState.actualState,
                    units: newState.units,
                    visitables: newState.visitables,
                    terrains: newState.terrains,
                    map: newState.map,
                    cursorPosition: newState.cursorPosition,
                    selectedUnit: newState.selectedUnit,
                    type: newState.type
                }
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
            default:
                return state;
        }
    }
