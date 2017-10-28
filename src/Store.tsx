import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { Map } from './Map';
import { InitialState, Reducer, State } from './GameState';
import { Pair, Cubic } from './Utils';
import { Unit, Stats, ReducerStats } from './Unit';

export interface Store extends Redux.Store<State> {
    dispatch: Redux.Dispatch<State>
}

export var store = Redux.createStore<State>(Reducer);

//Guardaremos el estado de stats (en un futuro podremos guardar el estado y modificarlo y será como buffos o incluso restricciones de mapa)
export var storeStats = Redux.createStore<Stats>(ReducerStats);

export function saveState(action: Redux.AnyAction) {
    store.dispatch(action);
    // Refresca el mapa y el resto de variables del estado
    var map: Map = store.getState().map;
    var position: Array<Pair> = store.getState().position;
    var obstacles: Array<Pair> = store.getState().obstacles;
    var selectedUnit: number = store.getState().selectedUnit;
    var type: string = store.getState().type;
    map.setState({});
}
