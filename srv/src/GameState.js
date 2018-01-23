"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("./Utils");
//El estado inicial será este (selectedUnit es el valor del indice en la lista de unidades(position) de la unidad seleccionada)
exports.InitialState = undefined;
// Esta función se encargará de devolver el estado inicial, es la única forma de ofrecer un objeto inmutable:
function getInitialState(callback) {
    // Creamos la petición al servidor
    var connection = new WebSocket("ws://localhost:8080/");
    console.log("Connection established with server");
    // Establecemos la conexión
    connection.onmessage = function (event) {
        console.log("Receiving data ...");
        console.log("Message: " + event.data);
        if (event.data == "Command not understood") {
            // Enviamos un error, algo ha pasado con el servidor
            throw new Error;
        }
        // Obtenemos el estado
        exports.InitialState = Utils_1.Network.parseStateFromServer(event.data);
        // Una vez tengamos el estado, llamamos al callback aportado, que permitirá saber con certeza que el estado está disponible
        callback();
    };
    connection.onopen = function () {
        console.log("Connection available for sending action");
        // Enviamos la solicitud de estado inicial
        connection.send(JSON.stringify({
            type: "getInitialState"
        }));
        console.log("Action sent.");
    };
}
exports.getInitialState = getInitialState;
class Actions {
    //Estos son los estados posibles
    static generateChangeUnitPos(unit_id, new_position, selectedUnit, player) {
        //Este estado es el de cambiar la posición (justo cuando hace clic de a donde quiere ir)
        return {
            type: "CHANGE_UNIT_POS",
            unit_id: unit_id,
            new_position: new_position,
            selectedUnit: selectedUnit,
            player: player
        };
    }
    static generateMove(unit_id, player) {
        //ESte estado es el de mantener la unidad seleccionada
        return {
            type: "MOVE",
            unit_id: unit_id,
            player: player
        };
    }
    static generateCursorMovement(new_position) {
        return {
            type: "CURSOR_MOVE",
            position: new_position
        };
    }
    static generateSetListener(map) {
        //Este es el estado de espera para seleccionar una unidad
        return {
            type: "SET_LISTENER",
            map: map
        };
    }
    static attack(defendingUnitId, player, selectedUnit) {
        //Este estado se envía la unidad a atacar (se eliminará del array) y si es del jugador o no
        return {
            type: "ATTACK",
            defendingUnitId: defendingUnitId,
            selectedUnit: selectedUnit,
            player: player
        };
    }
    // Se le pasa el mapa porque es necesario, en caso contrario no se podría reiniciar correctamente.
    static finish() {
        //Este estado por ahora simplemente hace que no se pueda jugar hasta que se reinicie la partida
        return {
            type: "FINISH"
        };
    }
    static nextTurn() {
        return {
            type: "NEXT_TURN"
        };
    }
    static nextAction(selectedUnit) {
        return {
            selectedUnit: selectedUnit,
            type: "NEXT_ACTION"
        };
    }
}
exports.Actions = Actions;
//Y aquí se producirá el cambio
exports.Reducer = (state = exports.InitialState, action) => {
    //Dependiendo del tipo se cambiarán las variables del estado
    switch (action.type) {
        case "CHANGE_UNIT_POS":
            let visitables = state.visitables;
            //Si es una unidad del jugador actual y no es la misma posición, actualiza su uso y su posición, sino el movimiento se considera cancelado
            //if(action.player==state.units[action.unit_id].player && !state.units[action.unit_id].position.equals(action.new_position)){
            if (action.player == state.units[action.unit_id].player) {
                state.units[action.unit_id].position = action.new_position;
                //state.units[action.unit_id].used = true;
                state.units[action.unit_id].action = 1;
            }
            // Si la unidad tiene posiblidad de atacar
            if (!state.units[action.unit_id].hasAttacked && state.units[action.unit_id].action == 1) {
                // Regeneramos los visitables, pero esta vez sólo obteniendo la distancia absoluta para los enemigos
                visitables = Utils_1.Pathfinding.getAttackableUnits(state.units[action.unit_id]);
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
            // Para reducir los cálculos del movimiento, vamos a realizar en este punto el cálculo de las celdas visitables
            var visitables_cubic = [new Utils_1.Cubic(state.units[action.unit_id].position)];
            var movements = state.units[action.unit_id].movement;
            // Los vecinos estarán compuestos por la posición cúbica y el número de movimientos para pasar la posición
            var neighbours = new Array();
            // En esta variable se guardarán las posiciones de las unidades atacables, que deben separarse porque no se pueden considerar como atravesables.
            var enemyUnits = new Array();
            // Primero, iteraremos desde 0 hasta el número de movimientos
            for (var i = 0; i <= movements; i++) {
                // Calculamos los próximos vecinos:
                var new_neighbours = [];
                visitables_cubic = visitables_cubic.concat(neighbours.filter(possible_tuple => possible_tuple[1] == 0).map(x => x[0]));
                for (var index_directions = 0; index_directions < Utils_1.cubic_directions.length; index_directions++) {
                    visitables_cubic.forEach(cubic => {
                        var new_cubic = cubic.add(Utils_1.cubic_directions[index_directions]);
                        // Siempre que la nueva casilla no esté en la lista de visitables ni sea una posición no alcanzable.
                        if (Utils_1.myIndexOfCubic(visitables_cubic, new_cubic) == -1) {
                            var indexOfNeighbours = Utils_1.myIndexOfCubic(neighbours.map(x => x[0]), new_cubic);
                            // Para añadir la posición, comprobamos primero que no esté la posición:
                            if (indexOfNeighbours == -1) {
                                // Si es el caso, debemos comprobar que la posición no esté ocupada por una de las unidades del jugador
                                var positionIndex = state.units
                                    .filter(x => x.player == action.player) // Si debe estar ocupada por una unidad, que sea únicamente la enemigas
                                    .map(y => y.position);
                                if (Utils_1.myIndexOf(positionIndex, new_cubic.getPair()) == -1) {
                                    // Primero, comprobamos que se trate de una unidad enemiga, simplemente comprobando si está en la lista es suficiente
                                    let indexUnit = Utils_1.myIndexOf(state.units.map(x => x.position), new_cubic.getPair());
                                    // En el caso en el que esté, la añadimos a la lista de atacables y acabamos
                                    if (indexUnit != -1) {
                                        // Añadimos a lista de atacables, sólo si no está en la lista y ésta iteración es el alcance del ataque más uno.
                                        Utils_1.myIndexOfCubic(enemyUnits, new_cubic) == -1 && i < state.units[action.unit_id].range ? enemyUnits.push(new_cubic) : false;
                                    }
                                    else {
                                        // Obtenemos el índice del obstáculo, si es que está.
                                        let indexOfObstacle = Utils_1.myIndexOf(state.terrains.map(x => x.position), new_cubic.getPair());
                                        // Si se admite, añadimos la posición y la cantidad de movimientos para pasar por la casilla
                                        // Por ahora se comprueba si está en la lista de obstáculos, en cuyo caso coge la cantidad. En caso contrario, asumimos Plains
                                        new_neighbours.push([new_cubic, indexOfObstacle > -1 ? state.terrains[indexOfObstacle].movement_penalty - 1 : 0]);
                                    }
                                }
                            }
                            else {
                                // Actualizamos el movimiento de la unidad, si es el caso.
                                var cell = neighbours[indexOfNeighbours];
                                // Siempre que sea reducible
                                if (cell[1] > 0) {
                                    // Obtenemos el índice de la iteración actual
                                    var index = Utils_1.myIndexOfCubic(new_neighbours.map(x => x[0]), cell[0]);
                                    // Si no está en nuestra lista de vecinos
                                    if (index == -1) {
                                        // Lo añadimos y le reducimos el peso
                                        new_neighbours.push([new_cubic, cell[1] - 1]);
                                    }
                                    else {
                                        // Si ya está en nuestra lista de vecinos, accedemos y lo reemplazamos reducciendo en uno
                                        new_neighbours[index] = [new_cubic, cell[1] - 1];
                                    }
                                }
                            }
                        }
                    });
                    neighbours = new_neighbours;
                }
            }
            var visitables_pair;
            if (state.units[action.unit_id].action == 0) {
                visitables_pair = visitables_cubic.map(cubic => cubic.getPair());
            }
            else {
                visitables_pair = enemyUnits.map(x => x.getPair());
            }
            // Finalmente convertimos el resultado a Pair:
            //var visitables_pair : Array<Pair> = visitables_cubic.map(cubic => cubic.getPair());
            // Sin olvidar las unidades atacables!
            //visitables_pair = visitables_pair.concat(enemyUnits.map(x => x.getPair()));
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
            // Después, calculamos la cantidad de vida a eliminar
            let healthRemoved = attackingUnit.calculateAttack(defendingUnit);
            // Comprobamos que la unidad defendiendo le queden todavía vida
            if (defendingUnit.health - healthRemoved > 0) {
                // Si es el caso, le cambiamos la cantidad de vida
                defendingUnit.health -= healthRemoved;
            }
            else {
                // Esta unidad ha dejado de existir
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
            if (state.units.filter(x => !x.player && x.name == "General").length == 0) {
                actualstate = 1;
            }
            else if (state.units.filter(x => x.player && x.name == "General").length == 0) {
                actualstate = 2;
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
            };
        case "FINISH":
            // Asignamos de nuevo el estado usando la función de estado inicial
            getInitialState(() => {
                // El callback será el retornado del estado
                // Retornamos el estado, asignamos el mapa porque algunas funciones dependen de éste.
                return state;
            });
        case "NEXT_TURN":
            //Se actualizan los used
            for (var i = 0; i < state.units.length; i++) {
                state.units[i].used = false;
                // Actualizamos también el estado de ataque
                state.units[i].hasAttacked = false;
                state.units[i].action = 0;
            }
            return {
                turn: state.turn + 1,
                actualState: state.actualState,
                units: state.units,
                visitables: null,
                terrains: state.terrains,
                map: state.map,
                cursorPosition: state.cursorPosition,
                selectedUnit: null,
                type: "SET_LISTENER"
            };
        case "NEXT_ACTION":
            state.units[action.selectedUnit].action++;
            if (state.units[action.selectedUnit].action >= 2) {
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
            };
        default:
            return state;
    }
};
