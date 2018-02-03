import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { Map } from './Map';
import { EditMap } from './EditMap';
import { ReducerEdit, StateEdit } from './GameEditState';
import { Pair, Cubic } from './Utils';
import { Unit } from './Unit';
import { Terrain } from './Terrains';

//Igual que Store pero con el estado de edición
export interface StoreEdit extends Redux.Store<StateEdit> {
    dispatch: Redux.Dispatch<StateEdit>
}

export var storeEdit = Redux.createStore<StateEdit>(ReducerEdit);

export function saveState(act: Redux.AnyAction) {
    storeEdit.dispatch(act);
    // Refresca el mapa y el resto de variables del estado
    var map: EditMap = storeEdit.getState().map;
    var side: boolean = storeEdit.getState().side;
    var terrains: Array<Terrain> = storeEdit.getState().terrains;
    var selected: string = storeEdit.getState().selected;
    var cursorPosition: Pair = storeEdit.getState().cursorPosition;
    var type: string = storeEdit.getState().type;
}
