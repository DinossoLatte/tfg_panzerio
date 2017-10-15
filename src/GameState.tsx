import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { Map } from './Map';
import { Pair } from './Utils';

export class Actions {
    static generateChangeUnitPos(unit_id: number, new_position: Pair) : Redux.AnyAction {
        return {
            type: "CHANGE_UNIT_POS",
            unit_id: unit_id,
            new_position: new_position
        };
    }

    static generateSetListener(map: Map) : Redux.AnyAction {
        return {
            type: "SET_LISTENER",
            map: map
        };
    }
}

export type State = {
    readonly position: Pair,
    readonly map: Map
}

export const InitialState: State = {
    position: new Pair(0,0),
    map: null
}

export const Reducer : Redux.Reducer<State> =
    (state: State = InitialState, action: Redux.AnyAction) => {
        switch(action.type) {
            case "CHANGE_UNIT_POS":
                return {
                    position: action.new_position,
                    map: state.map
                };
            case "SET_LISTENER":
                return {
                    position: state.position,
                    map: action.map
                };
            default:
                return state;
        }
    }
