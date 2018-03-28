import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { Profile } from './Profile';
import { ReducerProfile, StateProfile } from './GameProfileState';
import { Pair, Cubic, Network, Parsers } from './Utils';
import { Unit } from './Unit';
import { Army } from './Army';
import { Terrain } from './Terrains';

export interface StoreProfile extends Redux.Store<StateProfile> {
    dispatch: Redux.Dispatch<StateProfile>
}

export var storeProfile = Redux.createStore<StateProfile>(ReducerProfile);

export function saveState(act: Redux.AnyAction) {
    storeProfile.dispatch(act);
    var profile: Profile = storeProfile.getState().profile;
    var armies: Array<Army> = storeProfile.getState().armies;
    var selectedArmy: number = storeProfile.getState().selectedArmy;
    var selected: string = storeProfile.getState().selected;
    var type: string = storeProfile.getState().type;
}

//Este será el estado actual que se guardará en cliente, el servidor tendrá guardado el estado real
export var actualState: StateProfile = undefined;