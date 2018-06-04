import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';

import { Map } from './Map';
import { State } from './GameState';
import { Pair, Cubic } from '../src/Utils';
import { Unit } from '../src/Unit';
import { Terrain } from '../src/Terrains';

export interface Store extends Redux.Store<State> {
    dispatch: Redux.Dispatch<State>
}

export class GameStore {
    reducer: Redux.Reducer<State>;
    store: Store;

    constructor(reducer: Redux.Reducer<State>) {
        this.reducer = reducer;
        this.store = Redux.createStore<State>(this.reducer);
    }

    saveState(act: Redux.AnyAction) {
        this.store.dispatch(act);
        console.debug(JSON.stringify(this.store.getState()));
        // Refresca el mapa y el resto de variables del estado
        var turn: number = this.store.getState().turn;
        var actualState: number = this.store.getState().actualState;
        var map: Map = this.store.getState().map;
        var units: Array<Unit> = this.store.getState().units;
        var terrains: Array<Terrain> = this.store.getState().terrains;
        var selectedUnit: number = this.store.getState().selectedUnit;
        var cursorPosition: Pair = this.store.getState().cursorPosition;
        var type: string = this.store.getState().type;
        var width: number = this.store.getState().width;
        var height: number = this.store.getState().height;
    }
}
