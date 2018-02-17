import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { store, saveState } from './Store';
import { Map } from './Map';
import { Pair, Cubic, CUBIC_DIRECTIONS, myIndexOf, myIndexOfCubic, Pathfinding, Network } from '../src/Utils';
import { Unit, Infantry, Tank, General, Paratrooper, Artillery } from '../src/Unit';
import { Terrain, Plains, ImpassableMountain, Hills, Forest } from '../src/Terrains';

//Aquí declaramos las variables del estado
export type State = {
    readonly turn: number,
    readonly actualState: number,
    readonly units: Array<Unit>,
    readonly visitables: Array<Pair>,
    readonly terrains: Array<Terrain>,
    readonly cursorPosition: Pair,
    readonly map: Map,
    readonly selectedUnit: number,
    readonly type: string
}

export var InitialState: State = {
    turn: 0,
    actualState: 0,
    units: [General.create(new Pair(-1, -1), true), Infantry.create(new Pair(-1, -1), true), Tank.create(new Pair(-1, -1), true),Paratrooper.create(new Pair(-1, -1), true),
        Artillery.create(new Pair(-1, -1), true), General.create(new Pair(-1, -1), false), Infantry.create(new Pair(-1, -1), false), Tank.create(new Pair(-1, -1), false)],
    visitables: null,
    terrains: [ImpassableMountain.create(new Pair(2, 2)), ImpassableMountain.create(new Pair(3, 2)), Hills.create(new Pair(2, 3)), Forest.create(new Pair(3, 3))],
    cursorPosition: new Pair(0, 0),
    map: null,
    selectedUnit: null,
    type: "SET_LISTENER"
}

export function parseActionMap(data: any) {
        // Definimos la salida, un mapa, y lo populamos con datos por defecto
        let result = {
            selectedUnit: 0,
            type: "",
            unit_id: 0,
            new_position: new Pair(0,0),
            player: true,
            position: new Pair(0,0),
            map: undefined as Map,
            defendingUnitId: 0,
            terrains: [] as Array<Terrain>
        };
        // Primero, convertimos el objeto en un mapa
        let json = data;
        // Después iteramos por cada uno de los atributos y crearemos el objeto cuando sea necesario
        // Para empezar, asignamos las variables primitivas, al no necesitar inicializarlas
        if(json.unit_id){
            result.unit_id = json.unit_id;
        }
        if(json.player){
            result.player = json.player;
        }
        if(json.selectedUnit){
            result.selectedUnit = json.selectedUnit;
        }
        if(json.defendingUnitId){
            result.defendingUnitId = json.defendingUnitId;
        }
        if(json.type){
            result.type = json.type;
        }
        // Después, creamos un Pair con los datos introducidos
        if(json.new_position){
            result.new_position = new Pair(json.new_position.row, json.new_position.column);
        }
        if(json.position){
            result.position = new Pair(json.position.row, json.position.column);
        }
        // Ahora vamos con los terrenos:
        let terrains: Array<{name: string, image: string, movement_penalty: number, position:{row: number, column: number}, defenseWeak: number, defenseStrong: number, attackWeak: number, attackStrong: number}> = json.terrains;
        // Para cada uno, crearemos una unidad con esos datos.
        if(terrains) {
            result.terrains = terrains.map(terrain => new Terrain(terrain.name, terrain.image, terrain.movement_penalty, new Pair(terrain.position.row, terrain.position.column),
                terrain.defenseWeak, terrain.defenseStrong, terrain.attackWeak, terrain.attackStrong));
        }
        if(json.map){
            result.map = new Map(json.map.rows, json.map.columns);
        }
        // Retornamos el estado final
        return result;
}

//Y aquí se producirá el cambio
export const Reducer : Redux.Reducer<State> =
    (state: State = InitialState, action: Redux.AnyAction) => {
        //Dependiendo del tipo se cambiarán las variables del estado
        switch(action.type) {
            case "CHANGE_UNIT_POS":
                let visitables = state.visitables;
                // Si la unidad la tiene el jugador
                if(action.player==state.units[action.unit_id].player){
                    let lastPosition = state.units[action.unit_id].position;
                    // Actualiza la posición
                    state.units[action.unit_id].position = action.new_position;
                    // En el caso de estar fuera de la fase de pre juego, donde posicionamos las unidades sin causar turnos
                    if(state.turn >= 2) {
                        //Si es paracaidista pasa directamente a estado usado
                        if(state.units[action.unit_id].name=="Paratrooper" && !lastPosition.equals(action.new_position)){
                            state.units[action.unit_id].used = true;
                            state.units[action.unit_id].hasAttacked = true;
                            state.units[action.unit_id].action = 2;
                        }else{
                            state.units[action.unit_id].action = 1;
                        }
                    }

                }
                // Si la unidad tiene posiblidad de atacar
                if(!state.units[action.unit_id].hasAttacked && state.units[action.unit_id].action==1) {
                    // Regeneramos los visitables, pero esta vez sólo obteniendo la distancia absoluta para los enemigos
                    visitables = Pathfinding.getAttackableUnits(state.units[action.unit_id]);
                }
                return {
                    turn: state.turn,
                    actualState: state.actualState,
                    units: state.units,
                    visitables: [],
                    terrains: state.terrains,
                    map: state.map,
                    selectedUnit: action.selectedUnit,
                    cursorPosition: state.cursorPosition,
                    type: "SET_LISTENER"
                };
            case "MOVE":
                // Casillas disponibles
                let visitables_pair: Array<Pair> = [];
                // Si la unidad actual está en fase de ataque.
                if(state.units[action.unit_id].action == 1) {
                    // Ejecutamos el método para encontrar unidades enemigas atacables
                    visitables_pair = Pathfinding.getAttackableUnits(state.units[action.unit_id]);
                } else { // En caso contrario
                    // Ejecutamos el método para encontrar casillas movibles
                    // TODO problema encontrado aquí ya que se almacena el mapa sin las casillas
                    //visitables_pair = Pathfinding.getMovableCells(state, action.unit_id, action.player);
                }

                return {
                    turn: state.turn,
                    actualState: state.actualState,
                    units: state.units,
                    visitables: visitables_pair,
                    terrains: state.terrains,
                    map: state.map,
                    selectedUnit: action.unit_id,
                    cursorPosition: state.cursorPosition,
                    type: "MOVE"
                };
            case "SET_LISTENER":
                return {
                    turn: state.turn,
                    actualState: state.actualState,
                    units: state.units,
                    visitables: state.visitables,
                    terrains: state.terrains,
                    map: action.map,
                    selectedUnit: null,
                    cursorPosition: state.cursorPosition,
                    type: "SET_LISTENER"
                };
            case "CURSOR_MOVE":
                return {
                    turn: state.turn,
                    actualState: state.actualState,
                    units: state.units,
                    visitables: state.visitables,
                    terrains: state.terrains,
                    map: state.map,
                    cursorPosition: action.position,
                    selectedUnit: state.selectedUnit,
                    type: state.type
                };
            case "ATTACK":
                // Lógica de ataque
                // Primero, obtenemos la unidad atacando y defendiendo
                let defendingUnit = state.units[action.defendingUnitId];
                let attackingUnit = state.units[state.selectedUnit];
                // Necesitamos externalizar también el índice de la unidad actual, porque será útil al eliminar la unidad
                let selectedUnit = action.selectedUnit;
                // Obtenemos también el terreno de la unidad a atacar, para obtener la defensa
                // Obtenemos el índice de la casilla
                let terrainIndex = myIndexOf(
                    // Convertimos el array de terrenos a sus posiciones
                    state.terrains.map(terrain => terrain.position), defendingUnit.position)
                let terrain = terrainIndex > -1?state.terrains[terrainIndex]:null;
                // Después, calculamos la cantidad de vida a eliminar
                let healthRemoved = attackingUnit.calculateAttack(defendingUnit, terrain?terrain.defenseWeak:0, terrain?terrain.defenseStrong:0, terrain?terrain.attackWeak:0, terrain?terrain.attackStrong:0);
                // Comprobamos que la unidad defendiendo le queden todavía vida
                if (defendingUnit.health - healthRemoved > 0) {
                    // Si es el caso, le cambiamos la cantidad de vida
                    defendingUnit.health -= healthRemoved;
                } else {
                    // Esta unidad ha dejado de existir (no se puede de la otra forma porque no se borra correctamente)
                    state.units.splice(action.defendingUnitId, 1);
                    // Y por lo tanto no podemos estar apuntandole como seleccionada
                    if (action.selectedUnit > action.defendingUnitId) {
                        selectedUnit -= 1;
                    }
                }
                // Debemos actualizar el estado de la unidad, al realizarse un movimiento
                attackingUnit.used = true;
                // También actualizamos el estado para avisar que ha atacado
                attackingUnit.hasAttacked = true;
                attackingUnit.action = 2;
                var actualstate = state.actualState;
                //Si no está el general del jugador entonces se considerará victoria o derrota (esto ya incluye también que no queden más unidades)
                if(state.units.filter(x => !x.player && x.name=="General").length==0){
                    actualstate=1;
                }else if(state.units.filter(x => x.player && x.name=="General").length==0){
                    actualstate=2;
                }
                return {
                    turn: state.turn,
                    actualState: actualstate,
                    units: state.units,
                    visitables: [],
                    terrains: state.terrains,
                    map: state.map,
                    cursorPosition: state.cursorPosition,
                    selectedUnit: selectedUnit,
                    type: "SET_LISTENER"
                }
            case "FINISH":
                // En este caso retornamos el objeto inicial InitialState.
                return InitialState;
            case "NEXT_TURN":
                //Se actualizan los used
                for(var i = 0 ; i < state.units.length ; i++) {
                    state.units[i].used = false;
                    // Actualizamos también el estado de ataque
                    state.units[i].hasAttacked = false;
                    state.units[i].action = 0;
                }
                return {
                    turn: state.turn+1,
                    actualState: state.actualState,
                    units: state.units,
                    visitables: null,
                    terrains: state.terrains,
                    map: state.map,
                    cursorPosition: state.cursorPosition,
                    selectedUnit: null,
                    type: "SET_LISTENER"
                }
            case "NEXT_ACTION":
                state.units[action.selectedUnit].action++;
                if(state.units[action.selectedUnit].action>=2){
                    state.units[action.selectedUnit].used = true;
                    state.units[action.selectedUnit].hasAttacked = true;
                }
                return {
                    turn: state.turn,
                    actualState: state.actualState,
                    units: state.units,
                    visitables: null,
                    terrains: state.terrains,
                    map: state.map,
                    cursorPosition: state.cursorPosition,
                    selectedUnit: null,
                    type: "SET_LISTENER"
                }
            case "CUSTOM_MAP_INIT":
                // Si se quiere importar un mapa, se cambiará los terrenos
                return {
                    turn: state.turn,
                    actualState: state.actualState,
                    units: state.units,
                    visitables: state.visitables,
                    terrains: action.terrains,
                    map: state.map,
                    cursorPosition: state.cursorPosition,
                    selectedUnit: state.selectedUnit,
                    type: state.type
                }
            case "SELECT":
                //Simplemente se modificará la unidad seleccionada
                return {
                    turn: state.turn,
                    actualState: state.actualState,
                    units: state.units,
                    visitables: state.visitables,
                    terrains: state.terrains,
                    map: state.map,
                    cursorPosition: state.cursorPosition,
                    selectedUnit: action.selectedUnit,
                    type: "SET_LISTENER"
                }
            default:
                return state;
        }
    }
