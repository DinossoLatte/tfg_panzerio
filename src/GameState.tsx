import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { store, saveState } from './Store';
import { Map } from './Map';
import { Pair, Cubic, cubic_directions, myIndexOf, myIndexOfCubic} from './Utils';
import { Unit, Infantry, Tank, General } from './Unit';
import { Terrain, Plains, ImpassableMountain, Hills } from './Terrains';

export class Actions {
    //Estos son los estados posibles
    static generateChangeUnitPos(unit_id: number, new_position: Pair, selectedUnit: number, player:boolean) : Redux.AnyAction {
        //Este estado es el de cambiar la posición (justo cuando hace clic de a donde quiere ir)
        return {
            type: "CHANGE_UNIT_POS",
            unit_id: unit_id,
            new_position: new_position,
            selectedUnit: selectedUnit,
            player: player
        };
    }

    static generateMove(unit_id: number,player: boolean) : Redux.AnyAction {
        //ESte estado es el de mantener la unidad seleccionada
        return {
            type: "MOVE",
            unit_id: unit_id,
            player: player
        };
    }

    static generateCursorMovement(new_position: Pair) : Redux.AnyAction {
        return {
            type: "CURSOR_MOVE",
            position: new_position
        }
    }

    static generateSetListener(map: Map) : Redux.AnyAction {
        //Este es el estado de espera para seleccionar una unidad
        return {
            type: "SET_LISTENER",
            map: map
        };
    }

    static attack(unit_id: number, player: boolean) : Redux.AnyAction {
        //Este estado se envía la unidad a atacar (se eliminará del array) y si es del jugador o no
        return {
            type: "ATTACK",
            unit_id: unit_id,
            player: player
        }
    }

    // Se le pasa el mapa porque es necesario, en caso contrario no se podría reiniciar correctamente.
    static finish() : Redux.AnyAction {
        //Este estado por ahora simplemente hace que no se pueda jugar hasta que se reinicie la partida
        return {
            type: "FINISH"
        }
    }
}

//Aquí declaramos las variables del estado
export type State = {
    readonly units: Array<Unit>,
    readonly visitables: Array<Pair>,
    readonly terrains: Array<Terrain>,
    readonly cursorPosition: Pair,
    readonly map: Map,
    readonly selectedUnit: number,
    readonly type: string
}

//El estado inicial será este (selectedUnit es el valor del indice en la lista de unidades(position) de la unidad seleccionada)
export const InitialState: State = {
    units: [General.create(new Pair (0,0), true), Infantry.create(new Pair(0,1), true), Tank.create(new Pair (1,0), true), General.create(new Pair (0,4), false)
    , Infantry.create(new Pair(1,4), false), Tank.create(new Pair (0,3), false)],
    visitables: null,
    terrains: [ImpassableMountain.create(new Pair(2, 2)), ImpassableMountain.create(new Pair(3,2)), Hills.create(new Pair(2,3))],
    cursorPosition: new Pair(0,0),
    map: null,
    selectedUnit: null,
    type: "SET_LISTENER"
}

//Y aquí se producirá el cambio
export const Reducer : Redux.Reducer<State> =
    (state: State = InitialState, action: Redux.AnyAction) => {
        //Dependiendo del tipo se cambiarán las variables del estado
        switch(action.type) {
            case "CHANGE_UNIT_POS":
                if(action.player==state.units[action.unit_id].player){
                    state.units[action.unit_id].position = action.new_position;
                }
                return {
                    units: state.units,
                    visitables: state.visitables,
                    terrains: state.terrains,
                    map: state.map,
                    selectedUnit: action.selectedUnit,
                    cursorPosition: state.cursorPosition,
                    type: "SET_LISTENER"
                };
            case "MOVE":
                // Para reducir los cálculos del movimiento, vamos a realizar en este punto el cálculo de las celdas visitables
                var visitables_cubic : Array<Cubic> = [new Cubic(state.units[action.unit_id].position)];
                var movements : number = state.units[action.unit_id].movement;
                // Los vecinos estarán compuestos por la posición cúbica y el número de movimientos para pasar la posición
                var neighbours : [Cubic, number][] = new Array<[Cubic, number]>();
                // Primero, iteraremos desde 0 hasta el número de movimientos
                for(var i = 0 ; i <= movements ; i++) {
                    // Añadimos los vecinos que queden, son celdas visitables:
                    visitables_cubic = visitables_cubic.concat(neighbours.filter(possible_tuple => possible_tuple[1] == 0).map(x => x[0]));
                    // Calculamos los próximos vecinos:
                    var new_neighbours: [Cubic, number][] = [];
                    for(var index_directions = 0; index_directions < cubic_directions.length; index_directions++) {
                        visitables_cubic.forEach(cubic => {
                            var new_cubic = cubic.add(cubic_directions[index_directions]);
                            // Siempre que la nueva casilla no esté en la lista de visitables ni sea una posición no alcanzable.
                            if(myIndexOfCubic(visitables_cubic, new_cubic) == -1) {
                                var indexOfNeighbours = myIndexOfCubic(neighbours.map(x => x[0]), new_cubic);
                                // Para añadir la posición, comprobamos primero que no esté la posición:
                                if(indexOfNeighbours == -1) {
                                    // Si es el caso, debemos comprobar que la posición no esté ocupada por una de las unidades del jugador
                                    var positionIndex = state.units
                                        .filter(x => x.player==action.player) // Si debe estar ocupada por una unidad, que sea únicamente la enemigas
                                        .map(y => y.position);
                                    if(myIndexOf(positionIndex, new_cubic.getPair()) == -1) {
                                        // Obtenemos el índice del obstáculo si está en la lista.
                                        let indexOfObstacle = myIndexOf(state.terrains.map(x => x.position), new_cubic.getPair());
                                        // Si se admite, añadimos la posición y la cantidad de movimientos para pasar por la casilla
                                        new_neighbours.push([new_cubic,
                                            // Por ahora se comprueba si está en la lista de obstáculos, en cuyo caso coge la cantidad. En caso contrario, asumimos Plains
                                            indexOfObstacle > -1?state.terrains[indexOfObstacle].movement_penalty:0]);
                                    }
                                } else { // Si no, esta casilla ya la tenemos en vecinos, pero tiene un movimiento != 0, por lo que reducimos el movimiento de la casilla
                                    // Actualizamos el movimiento de la unidad, si es el caso.
                                    var cell = neighbours[indexOfNeighbours];
                                    cell[1]--;
                            }
                        });
                    neighbours = new_neighbours;
                }

                // Finalmente convertimos el resultado a Pair:
                var visitables_pair : Array<Pair> = visitables_cubic.map(cubic => cubic.getPair());

                return {
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
                    units: state.units,
                    visitables: state.visitables,
                    terrains: state.terrains,
                    map: action.map,
                    selectedUnit: state.selectedUnit,
                    cursorPosition: state.cursorPosition,
                    type: "SET_LISTENER"
                };
            case "CURSOR_MOVE":
                return {
                    units: state.units,
                    visitables: state.visitables,
                    terrains: state.terrains,
                    map: state.map,
                    cursorPosition: action.position,
                    selectedUnit: state.selectedUnit,
                    type: state.type
                };
            case "ATTACK":
                state.units.splice(action.unit_id, 1);
                return {
                    units: state.units,
                    visitables: state.visitables,
                    terrains: state.terrains,
                    map: state.map,
                    cursorPosition: state.cursorPosition,
                    selectedUnit: state.selectedUnit,
                    type: "MOVE"
                }
            case "FINISH":
                return {
                    units: state.units,
                    visitables: state.visitables,
                    terrains: state.terrains,
                    map: state.map,
                    cursorPosition: state.cursorPosition,
                    selectedUnit: state.selectedUnit,
                    type: action.type
                }
            default:
                return state;
        }
    }
