import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { Profile } from './Profile';
import { Reducer, State } from './GameState';
import { Pair, Cubic } from './Utils';
import { Unit } from './Unit';
import { Army } from './Army';
import { Terrain } from './Terrains';

export class ProfileActions {

    static save(profile: Profile, armies: Array<Army>, selectedArmy: number, selected: string, type: string) : Redux.AnyAction{
        return {
            tipo: "SAVE_PROFILE",
            profile: profile,
            armies: armies,
            selectedArmy: selectedArmy,
            selected: selected,
            type: type,
            actionType: "SAVE"
        };
    }
}

export type StateProfile = {
    readonly profile: Profile,
    readonly armies: Array<Army>,
    readonly selectedArmy: number,
    readonly selected: string,
    readonly type: string
}

function getInitialStateProfile(): StateProfile {
    return {
        profile: null,
        armies: new Array<Army>(),
        selectedArmy: null,
        selected: null,
        type: "0"
    };
}

export const InitialStateProfile: StateProfile = getInitialStateProfile();

//Se actualizan cada uno de los estados, está puesto un forceUpdate ya que no se actualizaba
export const ReducerProfile : Redux.Reducer<StateProfile> =
    (state: StateProfile = InitialStateProfile, action: Redux.AnyAction) => {
        switch(action.actionType) {
            case "SAVE":
                action.profile.forceUpdate();
                return{
                    profile: action.profile,
                    armies: action.armies,
                    selectedArmy: action.selectedArmy,
                    selected: action.selected,
                    type: action.type
                };
            case "CHANGE_GOOGLE_ID":
                action.profile.forceUpdate();
                return {
                    profile: state.profile,
                    armies: state.armies,
                    selectedArmy: state.selectedArmy,
                    selected: state.selected,
                    type: state.type
                }
            default:
                return state;
        }
    }
