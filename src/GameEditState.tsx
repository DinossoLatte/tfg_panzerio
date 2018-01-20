import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { Map } from './Map';
import { EditMap } from './EditMap';
import { Reducer, State } from './GameState';
import { Pair, Cubic } from './Utils';
import { Unit } from './Unit';
import { Terrain } from './Terrains';

export class EditActions {

    static selected(map: EditMap, evt: string) : Redux.AnyAction {
        return {
            map: map,
            selected: evt,
            type: "SELECTED"
        };
    }

    static onClickCreateUnit(map: EditMap) :Redux.AnyAction {
        console.log("entra en action");
        return {
            map: map,
            type: "CREATE_UNIT"
        };
    }

    static onClickSide(map: EditMap) : Redux.AnyAction{
        return {
            map: map,
            type: "SIDE"
        };
    }

    static onClickCreateTerrain(map: EditMap) : Redux.AnyAction {
        return {
            map: map,
            type: "CREATE_TERRAIN"
        };
    }

    static onClickDelete(map: EditMap) : Redux.AnyAction {
        return {
            map: map,
            type: "DELETE"
        };
    }

    static generateSetListener(map: EditMap) : Redux.AnyAction {
        return {
            map: map,
            type: "SET_LISTENER"
        }
    }

    static saveState(map: EditMap, side: boolean, units: Array<Unit>, terrains: Array<Terrain>, cursorPosition: Pair, selected: string, type: string) : Redux.AnyAction{
        return {
            map: map,
            side: side,
            units: units,
            terrains: terrains,
            cursorPosition: cursorPosition,
            selected: selected,
            type: "SAVE"
        };
    }
}

export type StateEdit = {
    readonly map: EditMap;
    readonly side: boolean,
    readonly units: Array<Unit>,
    readonly terrains: Array<Terrain>,
    readonly cursorPosition: Pair,
    readonly selected: string,
    readonly type: string
}

function getInitialStateEdit(): StateEdit {
    return {
        map: null,
        side: true,
        units: new Array<Unit>(),
        terrains: new Array<Terrain>(),
        cursorPosition: new Pair(0,0),
        selected: null,
        type: "SET_LISTENER"
    };
}

//El estado inicial será este (selectedUnit es el valor del indice en la lista de unidades(position) de la unidad seleccionada)
export const InitialStateEdit: StateEdit = getInitialStateEdit();

export const ReducerEdit : Redux.Reducer<StateEdit> =
    (state: StateEdit = InitialStateEdit, action: Redux.AnyAction) => {
        switch(action.type) {
            case "SELECTED":
                return{
                    map: action.map,
                    side: state.side,
                    units: state.units,
                    terrains: state.terrains,
                    cursorPosition: state.cursorPosition,
                    selected: action.evt,
                    type: state.type
                };
            case "CREATE_UNIT":
                console.log("valor del action de type: "+action.type);
                console.log("entra en reducer");
                return{
                    map: action.map,
                    side: state.side,
                    units: state.units,
                    terrains: state.terrains,
                    cursorPosition: state.cursorPosition,
                    selected: state.selected,
                    type: action.type
                };
            case "SIDE":
                return{
                    map: action.map,
                    side: !state.side,
                    units: state.units,
                    terrains: state.terrains,
                    cursorPosition: state.cursorPosition,
                    selected: state.selected,
                    type: state.type
                };
            case "CREATE_TERRAIN":
                return{
                    map: action.map,
                    side: state.side,
                    units: state.units,
                    terrains: state.terrains,
                    cursorPosition: state.cursorPosition,
                    selected: state.selected,
                    type: action.type
                };
            case "DELETE":
                return{
                    map: action.map,
                    side: state.side,
                    units: state.units,
                    terrains: state.terrains,
                    cursorPosition: state.cursorPosition,
                    selected: state.selected,
                    type: action.type
                };
            case "SAVE":
                return{
                    map: action.map,
                    side: action.side,
                    units: action.units,
                    terrains: action.terrains,
                    cursorPosition: action.cursorPosition,
                    selected: action.selected,
                    type: state.type
                };
            case "SET_LISTENER":
                return{
                    map: action.map,
                    side: state.side,
                    units: state.units,
                    terrains: state.terrains,
                    cursorPosition: state.cursorPosition,
                    selected: state.selected,
                    type: action.type
                };
            default:
                return state;
        }
    }
