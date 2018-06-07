import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';

import { Map } from './Map';
import { Reducer, State } from './GameState';
import { Pair, Cubic, Network } from './Utils';
import { Unit } from './Unit';
import { Terrain } from './Terrains';

export function saveState(act: Redux.AnyAction) {
    // Si contiene 'tipo', será un envío a servidor
    if(act.tipo) {
        saveStateServer(()=>{}, act);
    }
    store.dispatch(act);
    // Refresca el mapa y el resto de variables del estado
    var turn: number = store.getState().turn;
    var actualState: number = store.getState().actualState;
    var map: Map = store.getState().map;
    var units: Array<Unit> = store.getState().units;
    var terrains: Array<Terrain> = store.getState().terrains;
    var selectedUnit: number = store.getState().selectedUnit;
    var cursorPosition: Pair = store.getState().cursorPosition;
    var type: string = store.getState().type;
    // Si map está definido, lo actualizamos
    if(map) {
        map.setState({});
    }
}

export interface Store extends Redux.Store<State> {
    dispatch: Redux.Dispatch<State>
}

export var store = Redux.createStore<State>(Reducer);

//Este será el estado actual que se guardará en cliente, el servidor tendrá guardado el estado real
export var actualState: State = undefined;

export function saveStateServer(callback: () => void, act: Redux.AnyAction){
    var connection = Network.getConnection();
    // Establecemos la conexión
    connection.onmessage = function(event: MessageEvent) {
        if(event.data == "Command not understood") {
            // Enviamos un error, algo ha pasado con el servidor
            throw new Error;
        }
        // Obtenemos el estado
        actualState = Network.parseStateFromServer(event.data);
        // Una vez tengamos el estado, llamamos al callback aportado, que permitirá saber con certeza que el estado está disponible
        callback();
    };
    // Enviamos la solicitud
    let actionWithId = act;
    actionWithId.id = Network.gameId;
    connection.send(JSON.stringify(actionWithId));
}
