import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { Map } from './Map';
import { InitialState, Reducer, State } from './GameState';
import { Pair, Cubic } from './Utils';
import { Unit } from './Unit';
import { Terrain } from './Terrains';

export interface Store extends Redux.Store<State> {
    dispatch: Redux.Dispatch<State>
}

export var store = Redux.createStore<State>(Reducer);

export function saveState(action: Redux.AnyAction) {
    store.dispatch(action);
    // Refresca el mapa y el resto de variables del estado
    var map: Map = store.getState().map;
    var position: Array<Unit> = store.getState().position;
    var enemyposition: Array<Unit> = store.getState().enemyposition;
    var terrains: Array<Terrain> = store.getState().terrains;
    var selectedUnit: number = store.getState().selectedUnit;
    var cursorPosition: Pair = store.getState().cursorPosition;
    var type: string = store.getState().type;
    map.setState({});
}
