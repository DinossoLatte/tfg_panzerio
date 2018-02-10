"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = require("./Utils");
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
            throw new Error();
        }
        // Obtenemos el estado
        exports.InitialState = Utils_1.Network.parseStateFromServer(event.data);
        // Una vez tengamos el estado, llamamos al callback aportado, que permitirá saber con certeza que el estado está disponible
        callback();
    };
    connection.onopen = function () {
        console.log("Connection available for sending action");
        // Enviamos la solicitud de estado inicial (se ha modificado a tipo para hacer el menor número de cambios posibles al código)
        // La variable tipo indica el tipo de la acción
        connection.send(JSON.stringify({
            tipo: "getInitialState"
        }));
        console.log("Action sent.");
    };
}
exports.getInitialState = getInitialState;

var Actions = function () {
    function Actions() {
        _classCallCheck(this, Actions);
    }

    _createClass(Actions, null, [{
        key: "selectUnit",

        //Estos son los estados posibles
        value: function selectUnit(selectedUnit) {
            //Este estado es el de cambiar la posición (justo cuando hace clic de a donde quiere ir)
            return {
                tipo: "SAVE_MAP",
                type: "SELECT",
                selectedUnit: selectedUnit
            };
        }
    }, {
        key: "generateChangeUnitPos",
        value: function generateChangeUnitPos(unit_id, new_position, selectedUnit, player) {
            //Este estado es el de cambiar la posición (justo cuando hace clic de a donde quiere ir)
            return {
                tipo: "SAVE_MAP",
                type: "CHANGE_UNIT_POS",
                unit_id: unit_id,
                new_position: new_position,
                selectedUnit: selectedUnit,
                player: player
            };
        }
    }, {
        key: "generateMove",
        value: function generateMove(unit_id, player) {
            //ESte estado es el de mantener la unidad seleccionada
            return {
                tipo: "SAVE_MAP",
                type: "MOVE",
                unit_id: unit_id,
                player: player
            };
        }
    }, {
        key: "generateCursorMovement",
        value: function generateCursorMovement(new_position) {
            return {
                tipo: "SAVE_MAP",
                type: "CURSOR_MOVE",
                position: new_position
            };
        }
    }, {
        key: "generateSetListener",
        value: function generateSetListener(map) {
            //Este es el estado de espera para seleccionar una unidad
            return {
                tipo: "SAVE_MAP",
                type: "SET_LISTENER",
                map: map
            };
        }
    }, {
        key: "generateAttack",
        value: function generateAttack(defendingUnitId, player, selectedUnit) {
            //Este estado se envía la unidad a atacar (se eliminará del array) y si es del jugador o no
            return {
                tipo: "SAVE_MAP",
                type: "ATTACK",
                defendingUnitId: defendingUnitId,
                selectedUnit: selectedUnit,
                player: player
            };
        }
        // Se le pasa el mapa porque es necesario, en caso contrario no se podría reiniciar correctamente.

    }, {
        key: "generateFinish",
        value: function generateFinish() {
            //Este estado por ahora simplemente hace que no se pueda jugar hasta que se reinicie la partida
            return {
                tipo: "SAVE_MAP",
                type: "FINISH"
            };
        }
    }, {
        key: "generateNextTurn",
        value: function generateNextTurn() {
            return {
                tipo: "SAVE_MAP",
                type: "NEXT_TURN"
            };
        }
    }, {
        key: "generateNextAction",
        value: function generateNextAction(selectedUnit) {
            return {
                tipo: "SAVE_MAP",
                selectedUnit: selectedUnit,
                type: "NEXT_ACTION"
            };
        }
    }, {
        key: "generateCustomMap",
        value: function generateCustomMap(terrains) {
            return {
                tipo: "SAVE_MAP",
                terrains: terrains,
                type: "CUSTOM_MAP_INIT"
            };
        }
    }]);

    return Actions;
}();

exports.Actions = Actions;
//Y aquí se producirá el cambio
exports.Reducer = function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : exports.InitialState;
    var action = arguments[1];

    //Dependiendo del tipo se cambiarán las variables del estado
    switch (action.type) {
        case "CHANGE_UNIT_POS":
            var visitables = state.visitables;
            // Si la unidad la tiene el jugador
            if (action.player == state.units[action.unit_id].player) {
                var lastPosition = state.units[action.unit_id].position;
                // Actualiza la posición
                state.units[action.unit_id].position = action.new_position;
                // En el caso de estar fuera de la fase de pre juego, donde posicionamos las unidades sin causar turnos
                if (state.turn >= 2) {
                    //Si es paracaidista pasa directamente a estado usado
                    if (state.units[action.unit_id].name == "Paratrooper" && !lastPosition.equals(action.new_position)) {
                        state.units[action.unit_id].used = true;
                        state.units[action.unit_id].hasAttacked = true;
                        state.units[action.unit_id].action = 2;
                    } else {
                        state.units[action.unit_id].action = 1;
                    }
                } else {
                    state.units[action.unit_id].action = 2;
                    state.units[action.unit_id].used = true;
                    state.units[action.unit_id].hasAttacked = true;
                }
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
            // Casillas disponibles
            var visitables_pair = [];
            // Si la unidad actual está en fase de ataque.
            if (state.units[action.unit_id].action == 1) {
                // Ejecutamos el método para encontrar unidades enemigas atacables
                visitables_pair = Utils_1.Pathfinding.getAttackableUnits(state.units[action.unit_id]);
            } else {
                // Ejecutamos el método para encontrar casillas movibles
                visitables_pair = Utils_1.Pathfinding.getMovableCells(state, action.unit_id, action.player);
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
            var defendingUnit = state.units[action.defendingUnitId];
            var attackingUnit = state.units[state.selectedUnit];
            // Necesitamos externalizar también el índice de la unidad actual, porque será útil al eliminar la unidad
            var selectedUnit = action.selectedUnit;
            // Obtenemos también el terreno de la unidad a atacar, para obtener la defensa
            // Obtenemos el índice de la casilla
            var terrainIndex = Utils_1.myIndexOf(
            // Convertimos el array de terrenos a sus posiciones
            state.terrains.map(function (terrain) {
                return terrain.position;
            }), defendingUnit.position);
            var terrain = terrainIndex > -1 ? state.terrains[terrainIndex] : null;
            // Después, calculamos la cantidad de vida a eliminar
            var healthRemoved = attackingUnit.calculateAttack(defendingUnit, terrain ? terrain.defenseWeak : 0, terrain ? terrain.defenseStrong : 0);
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
            if (state.units.filter(function (x) {
                return !x.player && x.name == "General";
            }).length == 0) {
                actualstate = 1;
            } else if (state.units.filter(function (x) {
                return x.player && x.name == "General";
            }).length == 0) {
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
            // En este caso retornamos el objeto inicial InitialState.
            return exports.InitialState;
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
            };
        case "SELECT":
            state.units[action.selectedUnit].action = 0;
            state.units[action.selectedUnit].used = false;
            state.units[action.selectedUnit].hasAttacked = false;
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
            };
        default:
            return state;
    }
};