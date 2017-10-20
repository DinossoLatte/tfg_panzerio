import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { Map } from './Map';
import { Pair } from './Utils';

export class Actions {
    //Estos son los estados posibles
    static generateChangeUnitPos(unit_id: number, new_position: Pair) : Redux.AnyAction {
        //Este estado es el de cambiar la posición (justo cuando hace clic de a donde quiere ir)
        return {
            type: "CHANGE_UNIT_POS",
            unit_id: unit_id,
            new_position: new_position
        };
    }

    static generateMove(unit_id: number) : Redux.AnyAction {
        //ESte estado es el de mantener la unidad seleccionada
        return {
            type: "MOVE",
            unit_id: unit_id
        };
    }

    static generateSetListener(map: Map) : Redux.AnyAction {
        //Este es el estado de espera para seleccionar una unidad
        return {
            type: "SET_LISTENER",
            map: map
        };
    }
}

//Aquí declaramos las variables del estado
export type State = {
    readonly position: Pair,
    readonly map: Map,
    readonly type: string
}

//El estado inicial será este
export const InitialState: State = {
    position: new Pair(0,0),
    map: null,
    type: "SET_LISTENER"
}

//Y aquí se producirá el cambio
export const Reducer : Redux.Reducer<State> =
    (state: State = InitialState, action: Redux.AnyAction) => {
        //Dependiendo del tipo se cambiarán las variables del estado
        switch(action.type) {
            case "CHANGE_UNIT_POS":
                return {
                    position: action.new_position,
                    map: state.map,
                    type: "SET_LISTENER"
                };
            case "MOVE":
                return {
                    position: state.position,
                    map: state.map,
                    type: "MOVE"
                };
            case "SET_LISTENER":
                return {
                    position: state.position,
                    map: action.map,
                    type: "SET_LISTENER"
                };
            default:
                return state;
        }
    }
