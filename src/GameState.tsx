import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { store, saveState } from './Store';
import { Map } from './Map';
import { Pair, Cubic, cubic_directions, myIndexOf, myIndexOfCubic} from './Utils';
import { Unit, InitialStats } from './Unit';

export class Actions {
    //Estos son los estados posibles
    static generateChangeUnitPos(unit_id: number, new_position: Pair, selectedUnit: number) : Redux.AnyAction {
        //Este estado es el de cambiar la posición (justo cuando hace clic de a donde quiere ir)
        return {
            type: "CHANGE_UNIT_POS",
            unit_id: unit_id,
            new_position: new_position,
            selectedUnit: selectedUnit
        };
    }

    static generateChangeUnitPosEnemy(unit_id: number, new_position: Pair, selectedUnit: number) : Redux.AnyAction {
        //Este estado es el de cambiar la posición (justo cuando hace clic de a donde quiere ir)
        return {
            type: "CHANGE_UNIT_POS_ENEMY",
            unit_id: unit_id,
            new_position: new_position,
            selectedUnit: selectedUnit
        };
    }

    static generateMove(unit_id: number, isAlly : boolean) : Redux.AnyAction {
        //ESte estado es el de mantener la unidad seleccionada
        return {
            type: "MOVE",
            unit_id: unit_id,
            isAlly: isAlly
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

    static attack(unit_id: number, player: boolean) : Redux.AnyAction {
        //Este estado se envía la unidad a atacar (se eliminará del array) y si es del jugador o no
        return {
            type: "ATTACK",
            unit_id: unit_id,
            player: player
        }
    }

    static finish() : Redux.AnyAction{
        //Este estado por ahora simplemente hace que no se pueda jugar hasta que se reinicie la partida
        return {
            type: "FINISH"
        }
    }
}

//Aquí declaramos las variables del estado
export type State = {
    readonly position: Array<Pair>,
    readonly visitables: Array<Pair>,
    readonly enemyposition: Array<Pair>,
    readonly obstacles: Array<Pair>,
    readonly cursorPosition: Pair,
    readonly map: Map,
    readonly selectedUnit: number,
    readonly type: string
}

//El estado inicial será este (selectedUnit es el valor del indice en la lista de unidades(position) de la unidad seleccionada)
export const InitialState: State = {
    position: [new Pair (0,0), new Pair(0,1), new Pair (1,0)],
    visitables: null,
    enemyposition: [new Pair (4,0), new Pair(4,1), new Pair (3,1)],
    obstacles: [new Pair (2,1), new Pair (2,2), new Pair(3,1), new Pair(4,2)],
    cursorPosition: new Pair(0,0),
    map: null,
    selectedUnit: null,
    type: "SET_LISTENER"
}

//Y aquí se producirá el cambio
export const Reducer : Redux.Reducer<State> =
    (state: State = InitialState, action: Redux.AnyAction) => {
        //Dependiendo del tipo se cambiarán las variables del estado
        switch(action.type) {
            case "CHANGE_UNIT_POS":
                state.position[action.unit_id] = action.new_position;
                return {
                    position: state.position,
                    visitables: state.visitables,
                    enemyposition: state.enemyposition,
                    obstacles: state.obstacles,
                    map: state.map,
                    selectedUnit: action.selectedUnit,
                    cursorPosition: state.cursorPosition,
                    type: "SET_LISTENER"
                };
            //Simplemente se añade un nuevo estado que corresponde al cambio de posición en caso de ser unidad enemiga
            case "CHANGE_UNIT_POS_ENEMY":
                state.enemyposition[action.unit_id] = action.new_position;
                return {
                    position: state.position,
                    visitables: state.visitables,
                    enemyposition: state.enemyposition,
                    obstacles: state.obstacles,
                    map: state.map,
                    selectedUnit: action.selectedUnit,
                    cursorPosition: state.cursorPosition,
                    type: "SET_LISTENER"
                };
            case "MOVE":
                // Para reducir los cálculos del movimiento, vamos a realizar en este punto el cálculo de las celdas visitables
                var visitables_cubic : Array<Cubic> = [new Cubic(action.isAlly?state.position[action.unit_id]:state.enemyposition[action.unit_id])];
                var movements : number = InitialStats.movement;
                var neighbours : Array<Cubic> = [];
                // Primero, iteraremos desde 0 hasta el número de movimientos
                for(var i = 0 ; i <= movements ; i++) {
                    // Primero, filtramos de los vecinos los que sean obstáculos
                    neighbours.filter(possible_cubic => myIndexOf(state.obstacles, possible_cubic.getPair()) == -1);
                    // Añadimos los vecinos que queden, son celdas visitables:
                    visitables_cubic = visitables_cubic.concat(neighbours);
                    // Calculamos los próximos vecinos:
                    var new_neighbours: Array<Cubic> = [];
                    for(var index_directions = 0; index_directions < cubic_directions.length; index_directions++) {
                        console.log(index_directions);
                        visitables_cubic.forEach(cubic => {
                            var new_cubic = cubic.add(cubic_directions[index_directions]);
                            if(myIndexOf(state.obstacles, new_cubic.getPair()) == -1 && myIndexOfCubic(visitables_cubic, new_cubic)
                                && myIndexOf(action.isAlly?state.position:state.enemyposition, new_cubic.getPair()) == -1) {
                                new_neighbours.push(new_cubic);
                            }
                        });
                    }
                    neighbours = new_neighbours;
                }

                // Finalmente convertimos el resultado a Pair:
                var visitables_pair : Array<Pair> = visitables_cubic.map(cubic => cubic.getPair());

                return {
                    position: state.position,
                    visitables: visitables_pair,
                    enemyposition: state.enemyposition,
                    obstacles: state.obstacles,
                    map: state.map,
                    selectedUnit: action.unit_id,
                    cursorPosition: state.cursorPosition,
                    type: "MOVE"
                };
            case "SET_LISTENER":
                return {
                    position: state.position,
                    visitables: state.visitables,
                    enemyposition: state.enemyposition,
                    obstacles: state.obstacles,
                    map: action.map,
                    selectedUnit: state.selectedUnit,
                    cursorPosition: state.cursorPosition,
                    type: "SET_LISTENER"
                };
            case "CURSOR_MOVE":
                return {
                    position: state.position,
                    visitables: state.visitables,
                    enemyposition: state.enemyposition,
                    obstacles: state.obstacles,
                    map: state.map,
                    cursorPosition: action.position,
                    selectedUnit: state.selectedUnit,
                    type: state.type
                };
            case "ATTACK":
                action.player%2==0?state.position.splice(action.unit_id, 1):state.enemyposition.splice(action.unit_id, 1);
                return {
                    position: state.position,
                    visitables: state.visitables,
                    enemyposition: state.enemyposition,
                    obstacles: state.obstacles,
                    map: state.map,
                    cursorPosition: state.cursorPosition,
                    selectedUnit: state.selectedUnit,
                    type: "MOVE"
                }
            case "FINISH":
                return state;
            default:
                return state;
        }
    }
