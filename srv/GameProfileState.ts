import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { Profile } from './Profile';
import { Reducer, State } from './GameState';
import { Pair, Cubic } from '../src/Utils';
import { Unit } from '../src/Unit';
import { Army } from '../src/Army';
import { Terrain } from '../src/Terrains';

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

export function parseActionMap(data: any) {
        // Definimos la salida, un mapa, y lo populamos con datos por defecto
        let result = {
            selected: "",
            selectedArmy: "",
            type: "",
            actionType: "",
            profile: undefined as Profile,
            armies: [] as Array<Army>
        };
        // Primero, convertimos el objeto en un mapa
        let json = data;
        // Después iteramos por cada uno de los atributos y crearemos el objeto cuando sea necesario
        // Para empezar, asignamos las variables primitivas, al no necesitar inicializarlas
        if(json.selected){
            result.selected = json.selected;
        }
        if(json.selectedArmy){
            result.selectedArmy = json.selectedArmy;
        }
        if(json.type){
            result.type = json.type;
        }
        if(json.actionType){
            result.actionType = json.actionType;
        }
        // Ahora vamos con los batallones:
        if(json.armies){
            let armies: Array<{army: Array<{ type: string, number: number }>, name: string}> = json.armies;
            // Para cada uno, crearemos una unidad con esos datos.
            for(var i = 0; i < armies.length; i++){
                var army = new Array<{type: string, number: number}>();
                for(var j = 0; i < armies[i].army.length; j++){
                    army.push({type: armies[i].army[j].type, number:armies[i].army[j].number});
                }
                result.armies.push(new Army(army,armies[i].name));
            }
        }
        if(json.profile){
            result.profile = new Profile(json.profile.name);
        }
        // Retornamos el estado final
        return result;
}

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
            default:
                return state;
        }
    }
