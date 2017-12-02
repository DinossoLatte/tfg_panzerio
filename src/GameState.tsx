import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { store, saveState } from './Store';
import { Map } from './Map';
import { Pair, Cubic, cubic_directions, myIndexOf, myIndexOfCubic} from './Utils';
import { Unit } from './Unit';

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

    static generateMove(unit_id: number) : Redux.AnyAction {
        //ESte estado es el de mantener la unidad seleccionada
        return {
            type: "MOVE",
            unit_id: unit_id
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
    enemyposition: [new Pair (4,0), new Pair(4,1), new Pair (3,1)],
    obstacles: [new Pair (2,1), new Pair (2,1)],
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
                    enemyposition: state.enemyposition,
                    obstacles: state.obstacles,
                    map: state.map,
                    selectedUnit: action.selectedUnit,
                    cursorPosition: state.cursorPosition,
                    type: "SET_LISTENER"
                };
            case "MOVE":
                return {
                    position: state.position,
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
