import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { Map } from './Map';
import { InitialState, Reducer, State } from './GameState';
import { Pair } from './Utils';

export interface Store extends Redux.Store<State> {
    dispatch: Redux.Dispatch<State>
}

export var store = Redux.createStore<State>(Reducer);

export function saveState(action: Redux.AnyAction) {
    store.dispatch(action);
    // Refresh Map:
    var map: Map = store.getState().map;
    var position: Pair = store.getState().position;
    var type: string = store.getState().type;
    map.setState({});
}
