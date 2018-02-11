import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';

import { EditMap } from './EditMap';
import { Pair } from '../src/Utils';
import { Terrain } from '../src/Terrains';

//Este es el estado de la edición
export type StateEdit = {
    readonly map: EditMap,
    readonly terrains: Array<Terrain>,
    readonly cursorPosition: Pair,
    readonly selected: string,
    readonly type: number // Será 0 para estado inicial, 1 para colocación de terreno y 2 para eliminación de terrenos
}

function getInitialStateEdit(): StateEdit {
    return {
        map: null,
        terrains: [],
        cursorPosition: new Pair(0,0),
        selected: null,
        type: 0
    };
}

export const InitialStateEdit: StateEdit = getInitialStateEdit();

export function parseActionMap(data: any) {
        // Definimos la salida, un mapa, y lo populamos con datos por defecto
        let result = {
            selected: "",
            type: 0,
            cursorPosition: new Pair(0,0),
            map: undefined as EditMap,
            terrains: [] as Array<Terrain>
        };
        // Primero, convertimos el objeto en un mapa
        let json = data;
        // Después iteramos por cada uno de los atributos y crearemos el objeto cuando sea necesario
        // Para empezar, asignamos las variables primitivas, al no necesitar inicializarlas
        if(json.selected){
            result.selected = json.selected;
        }
        if(json.type){
            result.type = json.type;
        }
        // Después, creamos un Pair con los datos introducidos
        if(json.cursorPosition){
            result.cursorPosition = new Pair(json.cursorPosition.row, json.cursorPosition.column);
        }
        // Ahora vamos con los terrenos:
        let terrains: Array<{name: string, image: string, movement_penalty: number, position:{row: number, column: number}, defenseWeak: number, defenseStrong: number}> = json.terrains;
        // Para cada uno, crearemos una unidad con esos datos.
        if(terrains) {
            result.terrains = terrains.map(terrain => new Terrain(terrain.name, terrain.image, terrain.movement_penalty, new Pair(terrain.position.row, terrain.position.column),
                terrain.defenseWeak, terrain.defenseStrong));
        }
        if(json.map){
            result.map = new EditMap(json.map.rows, json.map.columns);
        }
        // Retornamos el estado final
        return result;
}

//Se actualizan cada uno de los estados, está puesto un forceUpdate ya que no se actualizaba
export const ReducerEdit : Redux.Reducer<StateEdit> =
    (state: StateEdit = InitialStateEdit, action: Redux.AnyAction) => {
        switch(action.type) {
            case "SELECTED":
                return{
                    map: action.map,
                    terrains: state.terrains,
                    cursorPosition: state.cursorPosition,
                    selected: action.selected,
                    type: 1
                };
            case "CREATE_TERRAIN":
                return{
                    map: action.map,
                    terrains: state.terrains,
                    cursorPosition: state.cursorPosition,
                    selected: state.selected,
                    type: 1
                };
            case "SAVE":
                return{
                    map: action.map,
                    terrains: action.terrains,
                    cursorPosition: action.cursorPosition,
                    selected: action.selected,
                    type: 0
                };
            case "SET_LISTENER":
                return{
                    map: action.map,
                    terrains: state.terrains,
                    cursorPosition: state.cursorPosition,
                    selected: state.selected,
                    type: 0
                };
            case "CHANGE_CURSOR":
                return {
                    map: state.map,
                    terrains: state.terrains,
                    cursorPosition: action.cursorPosition,
                    selected: state.selected,
                    type: state.type
                }
            case "CHANGE_TERRAIN":
                return {
                    map: state.map,
                    terrains: action.terrains,
                    cursorPosition: state.cursorPosition,
                    selected: state.selected,
                    type: 1
                }
            default:
                return state;
        }
    }
