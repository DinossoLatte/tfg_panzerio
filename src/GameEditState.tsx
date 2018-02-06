import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';

import { EditMap } from './EditMap';
import { Pair } from './Utils';
import { Terrain } from './Terrains';
//Funciona igual que GameState solo que tiene acciones de edición
export class EditActions {
    static selected(map: EditMap, evt: string) : Redux.AnyAction {
        return {
            map: map,
            selected: evt,
            type: "SELECTED"
        };
    }

    static onClickCreateTerrain(map: EditMap) : Redux.AnyAction {
        return {
            map: map,
            type: "CREATE_TERRAIN"
        };
    }

    static generateSetListener(map: EditMap) : Redux.AnyAction {
        return {
            map: map,
            type: "SET_LISTENER"
        }
    }

    static saveState(map: EditMap, terrains: Array<Terrain>, cursorPosition: Pair, selected: string, type: string) : Redux.AnyAction{
        return {
            map: map,
            terrains: terrains,
            cursorPosition: cursorPosition,
            selected: selected,
            type: "SAVE"
        };
    }

    static generateChangeCursor(newCursorPosition: Pair): Redux.AnyAction {
        return {
            cursorPosition: newCursorPosition,
            type: "CHANGE_CURSOR"
        }
    }

    static generateChangeTerrain(newTerrains: Array<Terrain>): Redux.AnyAction {
        return {
            terrains: newTerrains,
            type: "CHANGE_TERRAIN"
        }
    }
}

//Este es el estado de la edición
export type StateEdit = {
    readonly map: EditMap,
    readonly terrains: Array<Terrain>,
    readonly cursorPosition: Pair,
    readonly selected: string,
    readonly type: number // Será 0 para estado inicial, 1 para colocación de terreno y 2 para eliminación de terrenos
}

function getInitialStateEdit(): StateEdit {
    return {
        map: null,
        terrains: [],
        cursorPosition: new Pair(0,0),
        selected: null,
        type: 0
    };
}

export const InitialStateEdit: StateEdit = getInitialStateEdit();

//Se actualizan cada uno de los estados, está puesto un forceUpdate ya que no se actualizaba
export const ReducerEdit : Redux.Reducer<StateEdit> =
    (state: StateEdit = InitialStateEdit, action: Redux.AnyAction) => {
        switch(action.type) {
            case "SELECTED":
                action.map.forceUpdate();
                return{
                    map: action.map,
                    terrains: state.terrains,
                    cursorPosition: state.cursorPosition,
                    selected: action.selected,
                    type: 1
                };
            case "CREATE_TERRAIN":
                action.map.forceUpdate();
                return{
                    map: action.map,
                    terrains: state.terrains,
                    cursorPosition: state.cursorPosition,
                    selected: state.selected,
                    type: 1
                };
            case "SAVE":
                action.map.forceUpdate();
                return{
                    map: action.map,
                    terrains: action.terrains,
                    cursorPosition: action.cursorPosition,
                    selected: action.selected,
                    type: 0
                };
            case "SET_LISTENER":
                action.map.forceUpdate();
                return{
                    map: action.map,
                    terrains: state.terrains,
                    cursorPosition: state.cursorPosition,
                    selected: state.selected,
                    type: 0
                };
            case "CHANGE_CURSOR":
                state.map.forceUpdate();
                return {
                    map: state.map,
                    terrains: state.terrains,
                    cursorPosition: action.cursorPosition,
                    selected: state.selected,
                    type: state.type
                }
            case "CHANGE_TERRAIN": 
                state.map.forceUpdate();
                return {
                    map: state.map,
                    terrains: action.terrains,
                    cursorPosition: state.cursorPosition,
                    selected: state.selected,
                    type: 1
                }
            default:
                return state;
        }
    }
