import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { store, storeStats, saveState } from './Store';
import { Map } from './Map';
import { Pair, Cubic, cubic_directions, myIndexOf, myIndexOfCubic} from './Utils';

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

    static generateMove(unit_id: number) : Redux.AnyAction {
        //ESte estado es el de mantener la unidad seleccionada
        return {
            type: "MOVE",
            unit_id: unit_id
        };
    }

    static generateSetListener(map: Map) : Redux.AnyAction {
        //Este es el estado de espera para seleccionar una unidad
        return {
            type: "SET_LISTENER",
            map: map
        };
    }
}

//Aquí declaramos las variables del estado
export type State = {
    readonly position: Array<Pair>,
    readonly obstacles: Array<Pair>,
    readonly validPositions: Array<Array<Cubic>>,
    readonly map: Map,
    readonly selectedUnit: number,
    readonly type: string
}

//El estado inicial será este (selectedUnit es el valor del indice en la lista de unidades(position) de la unidad seleccionada)
export const InitialState: State = {
    position: [new Pair (0,0), new Pair(0,1), new Pair (1,0)],
    obstacles: [new Pair (2,2), new Pair (2,1)],
    validPositions: getValid([new Pair (0,0), new Pair(0,1), new Pair (1,0)]),
    map: null,
    selectedUnit: null,
    type: "SET_LISTENER"
}

export function getValidPosition(actual: Cubic){
    let valid: Array<Cubic> = [];
    let last: Cubic = actual;
    let pos: Cubic;
    var row = [];
    for(var k = 1; k <= storeStats.getState().movement; k++) {
        row[k] = [];
        for(var j = 0; k-1==0?j<1:j < row[k-1].length; j++){
            if(k-1!=0){
                last = row[k-1][j];
            }
            console.log("last: "+last.x+","+last.y+","+last.z);
            for (var i = 0; i < cubic_directions.length; i++) {
                pos = last;
                pos.sum(cubic_directions[i]);
                console.log("pos: "+pos.getPair().x+","+pos.getPair().y);
                if(myIndexOf(store.getState().obstacles,pos.getPair())==-1 && myIndexOfCubic(valid,pos)==-1){
                    row[k].push(pos);
                    valid.push(pos);
                    console.log("introduce "+valid[0].x+","+valid[0].y+","+valid[0].z);
                }
            }
        }
    }
    return valid;
}

export function getValid(actual: Pair[]){
    var valid = [];
    for(var k = 0; k<actual.length; k++){
        valid[k]=getValidPosition(new Cubic(actual[k]));
    }
    return valid;
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
                    obstacles: state.obstacles,
                    validPositions: getValid(state.position),
                    map: state.map,
                    selectedUnit: action.selectedUnit,
                    type: "SET_LISTENER"
                };
            case "MOVE":
                return {
                    position: state.position,
                    obstacles: state.obstacles,
                    validPositions: state.validPositions,
                    map: state.map,
                    selectedUnit: action.unit_id,
                    type: "MOVE"
                };
            case "SET_LISTENER":
                return {
                    position: state.position,
                    obstacles: state.obstacles,
                    validPositions: state.validPositions,
                    map: action.map,
                    selectedUnit: state.selectedUnit,
                    type: "SET_LISTENER"
                };
            default:
                return state;
        }
    }
