import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { Map } from './Map';
import { EditMap } from './EditMap';
import { Reducer, State } from './GameState';
import { Pair, Cubic } from './Utils';
import { Unit } from './Unit';
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

    static saveState(map: EditMap, side: boolean, terrains: Array<Terrain>, cursorPosition: Pair, selected: string, type: string) : Redux.AnyAction{
        return {
            map: map,
            side: side,
            terrains: terrains,
            cursorPosition: cursorPosition,
            selected: selected,
            type: "SAVE"
        };
    }
}

//Este es el estado de la edición
export type StateEdit = {
    readonly map: EditMap,
    readonly side: boolean,
    readonly terrains: Array<Terrain>,
    readonly cursorPosition: Pair,
    readonly selected: string,
    readonly type: string
}

function getInitialStateEdit(): StateEdit {
    return {
        map: null,
        side: true,
        terrains: new Array<Terrain>(),
        cursorPosition: new Pair(0,0),
        selected: null,
        type: "SET_LISTENER"
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
                    side: state.side,
                    terrains: state.terrains,
                    cursorPosition: state.cursorPosition,
                    selected: action.selected,
                    type: state.type
                };
            case "CREATE_TERRAIN":
                action.map.forceUpdate();
                return{
                    map: action.map,
                    side: state.side,
                    terrains: state.terrains,
                    cursorPosition: state.cursorPosition,
                    selected: state.selected,
                    type: action.type
                };
            case "SAVE":
                action.map.forceUpdate();
                return{
                    map: action.map,
                    side: action.side,
                    terrains: action.terrains,
                    cursorPosition: action.cursorPosition,
                    selected: action.selected,
                    type: state.type
                };
            case "SET_LISTENER":
                action.map.forceUpdate();
                return{
                    map: action.map,
                    side: state.side,
                    terrains: state.terrains,
                    cursorPosition: state.cursorPosition,
                    selected: state.selected,
                    type: action.type
                };
            default:
                return state;
        }
    }
