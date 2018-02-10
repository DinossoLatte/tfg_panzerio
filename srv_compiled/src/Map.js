"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Store_1 = require("./Store");
var GameState_1 = require("./GameState");
var Cell_1 = require("./Cell");
var Utils_1 = require("./Utils");
var Unit_1 = require("./Unit");
var Terrains_1 = require("./Terrains");
var UnitStats_1 = require("./UnitStats");
/** Representa el mapa que contendrá las unidades y las casillas **/

var Map = function (_React$Component) {
    _inherits(Map, _React$Component);

    /** @constructor  Deben introducirse los elementos horizontal y vertical **/
    function Map(props) {
        _classCallCheck(this, Map);

        var _this = _possibleConstructorReturn(this, (Map.__proto__ || Object.getPrototypeOf(Map)).call(this, props));

        _this.unitStats = null;
        _this.restartState();
        return _this;
    }

    _createClass(Map, [{
        key: "restartState",
        value: function restartState() {
            this.state = { cells: new Array(this.props.horizontal), rows: this.props.vertical, columns: this.props.horizontal, alertUnitsNotPlaced: false };
            Store_1.store.dispatch(GameState_1.Actions.generateSetListener(this));
        }
        /** Renderiza el mapa **/

    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            // El mapa se renderizará en un div con estilo, por ello debemos usar className="map"
            return React.createElement("div", null, React.createElement("p", null, "Turno del ", Store_1.store.getState().turn % 2 == 0 ? "Jugador" : "Enemigo", ". D\xEDa ", Math.floor(Store_1.store.getState().turn / 2), Store_1.store.getState().actualState == 1 ? ". Victoria" : Store_1.store.getState().actualState == 2 ? ". Derrota" : "", " ", Store_1.store.getState().turn < 2 ? "(Pre juego)" : ""), React.createElement("button", { id: "exitButton", name: "exitButton", onClick: this.onClickExit.bind(this) }, "Salir del juego"), Store_1.store.getState().actualState == 0 ? React.createElement("button", { id: "nextTurn", name: "nextTurn", onClick: this.onClickTurn.bind(this) }, "Pasar turno") : "", Store_1.store.getState().selectedUnit != null && Store_1.store.getState().turn >= 2 ? React.createElement("button", { id: "cancelAction", name: "cancelAction", onClick: this.onClickCancelAction.bind(this) }, "Cancelar acci\xF3n") : "", Store_1.store.getState().selectedUnit != null && Store_1.store.getState().turn >= 2 && Store_1.store.getState().units[Store_1.store.getState().selectedUnit].action < 2 ? React.createElement("button", { id: "nextAction", name: "nextAction", onClick: this.onClickUnitAction.bind(this) }, "Pasar acci\xF3n") : "", Store_1.store.getState().turn < 2 ? React.createElement("div", null, React.createElement("label", null, " Selecciona la unidad:", React.createElement("select", { defaultValue: null, value: Store_1.store.getState().selectedUnit, onChange: function onChange(evt) {
                    return _this2.selectUnit(evt.target.value);
                } }, this.selectOptions())), React.createElement("button", { onClick: this.onClickPlaceUnit.bind(this) }, "Seleccionar unidad")) : "", this.state.alertUnitsNotPlaced ? React.createElement("p", { className: "alert" }, "ATENCI\xD3N: Algunas de las unidades no han sido posicionadas en el juego, por favor, posicione las unidades en el juego") : "", React.createElement("div", null, React.createElement(UnitStats_1.UnitStats, null), React.createElement("div", { id: "map", className: "map", onClick: this.onClick.bind(this), tabIndex: 0, onKeyDown: this.onKey.bind(this), onContextMenu: this.onRightClick.bind(this) }, this.generateMap.bind(this)().map(function (a) {
                return a;
            }))));
        }
        //Se guarda dicha unidad como seleccionada

    }, {
        key: "selectUnit",
        value: function selectUnit(evt) {
            Store_1.saveState(GameState_1.Actions.selectUnit(Number(evt)));
        }
    }, {
        key: "selectOptions",
        value: function selectOptions() {
            //Creamos todos los options a partir de todas las unidades de la lista de unidades
            var army = [React.createElement("option", { selected: true, value: null }, "--Selecciona--")];
            for (var i = 0; i < Store_1.store.getState().units.length; i++) {
                //Se usa for para generalizar si se añadieran más unidades
                if (Store_1.store.getState().units[i].player == (Store_1.store.getState().turn % 2 == 0)) {
                    for (var j = 0; j < Unit_1.UNITS.length; j++) {
                        if (Store_1.store.getState().units[i].name == Unit_1.UNITS[j]) {
                            // La unidad será nombrada de esa manera para poder distinguirla y saber además su tipo
                            army.push(React.createElement("option", { value: i }, "Unidad " + i + " - " + Unit_1.UNITS_ESP[j]));
                        }
                    }
                }
            }
            return army;
        }
    }, {
        key: "onClickExit",
        value: function onClickExit(event) {
            this.props.parentObject.changeGameState(0); // Salir de la partida.
        }
        //Se debe permitir solo si esta en pardida (this.actualstate==0), sino no hace nada

    }, {
        key: "onClickTurn",
        value: function onClickTurn(event) {
            //Si se pulsa al botón se pasa de turno esto se hace para asegurar que el jugador no quiere hacer nada o no puede en su turno
            //Evitando pasar turno automaticamente ya que el jugador quiera ver alguna cosa de sus unidades o algo aunque no tenga movimientos posibles
            // Pero antes de poder pasar el turno, comprobamos si ha posicionado todas sus unidades
            if (
            // Primero, comprobamos si estamos en la fase de pre juego
            Store_1.store.getState().turn < 2
            // Después vemos si de las unidades ...
            && Store_1.store.getState().units.some(function (unit) {
                // Son del jugador y éstas están fuera de la zona de juego (por defecto (-1, -1))
                return unit.player == (Store_1.store.getState().turn % 2 == 0) && (unit.position.row < 0 || unit.position.column < 0);
            })) {
                // Esto quiere decir que debemos informar al jugador, cambiando el siguiente atributo
                this.setState({
                    cells: this.state.cells,
                    rows: this.state.rows,
                    columns: this.state.columns,
                    alertUnitsNotPlaced: true
                });
            } else {
                // En caso contrario, pasamos el turno
                // Y eliminamos la restricción
                this.setState({
                    cells: this.state.cells,
                    rows: this.state.rows,
                    columns: this.state.columns,
                    alertUnitsNotPlaced: false
                });
                Store_1.saveState(GameState_1.Actions.generateNextTurn()); //Se usa para obligar a actualizar el estado (tambien actualiza los used)
            }
        }
    }, {
        key: "onClickUnitAction",
        value: function onClickUnitAction(event) {
            //Dependiendo de la accion de la unidad pasará a la siguiente acción y será usada o no
            Store_1.saveState(GameState_1.Actions.generateNextAction(Store_1.store.getState().selectedUnit));
        }
    }, {
        key: "onClickCancelAction",
        value: function onClickCancelAction(event) {
            //Con esto se cancela la acción actual para que se pueda seleccionar otra unidad
            Store_1.saveState(GameState_1.Actions.generateSetListener(this));
        }
    }, {
        key: "onClickPlaceUnit",
        value: function onClickPlaceUnit(mouseEvent) {
            // Obtenemos el índice
            var selectedIndex = Store_1.store.getState().selectedUnit;
            console.log("Index: " + selectedIndex);
            // Si no está definido
            if (selectedIndex == null ||
            // Si la próxima unidad no es del jugador
            !Store_1.store.getState().units[selectedIndex + 1].player == (Store_1.store.getState().turn % 2 == 0) || Store_1.store.getState().units.length <= selectedIndex + 1 // O sobrepasa el límite de la lista
            ) {
                console.log("Entra en no definido");
                // Entonces debemos encontrar el índice de una unidad del jugador
                selectedIndex = Store_1.store.getState().units.indexOf(Store_1.store.getState().units.find(function (unit) {
                    return unit.player == (Store_1.store.getState().turn % 2 == 0);
                }));
            }
            console.log("Resutado " + selectedIndex);
            // Ejecutamos la selección de unidad
            Store_1.store.dispatch(GameState_1.Actions.generateMove(selectedIndex, Store_1.store.getState().turn % 2 == 0));
            // Y, para indicar al jugador de la unidad seleccionada, cambiamos el
            // indicador de la izquierda
            this.unitStats.setState({ unit: Store_1.store.getState().units[selectedIndex], terrain: null });
        }
        /*
            onClickNextUnit(mouseEvent: MouseEvent) {
                // Obtenemos el índice
                let selectedIndex = store.getState().selectedUnit;
                console.log("Index: "+selectedIndex);
                // Si no está definido
                if(selectedIndex == null
                    || (// O en el caso de estarlo, es posible incrementar el índice
                        // Si la próxima unidad no es del jugador
                        !store.getState().units[selectedIndex + 1].player == (store.getState().turn%2 == 0)
                        || store.getState().units.length <= selectedIndex + 1 // O sobrepasa el límite de la lista
                )) {
                    console.log("Entra en no definido");
                    // Entonces debemos encontrar el índice de una unidad del jugador
                    selectedIndex = store.getState().units.indexOf(store.getState().units.find((unit) => unit.player == (store.getState().turn%2 == 0)));
                } else {
                    console.log("Entra en ya definido");
                    // En otro caso ya está definido y es válido el incremento
                    selectedIndex = selectedIndex + 1;
                }
                console.log("Resutado "+selectedIndex);
        
                // Ejecutamos la selección de unidad
                store.dispatch(Actions.generateMove(selectedIndex, store.getState().turn%2 == 0));
                // Y, para indicar al jugador de la unidad seleccionada, cambiamos el
                // indicador de la izquierda
                this.unitStats.setState({ unit: store.getState().units[selectedIndex], terrain: null });
            }
        */

    }, {
        key: "onKey",
        value: function onKey(keyEvent) {
            var keyCode = keyEvent.key;
            var cursorPosition = void 0,
                newCursorPosition = void 0;
            console.log("KeyCode: " + keyCode);
            switch (keyCode) {
                case 'Escape':
                    this.props.parentObject.changeGameState(0); // Retornamos al menu.
                    break;
                // Los siguientes casos corresponden con las teclas del numpad, para mover el cursor
                case '1':
                    // La tecla 1 del numpad (-1,+1)
                    // Primero, obtenemos la posición de la casilla
                    cursorPosition = Store_1.store.getState().cursorPosition;
                    // Crearemos una nueva posición resultado
                    newCursorPosition = new Utils_1.Pair(cursorPosition.row + (cursorPosition.column & 1 ? 1 : 0), cursorPosition.column - 1);
                    // Llamamos a la acción para cambiarlo
                    break;
                case '2':
                    // La tecla 2 del numpad (0,+1)
                    cursorPosition = Store_1.store.getState().cursorPosition;
                    newCursorPosition = new Utils_1.Pair(cursorPosition.row + 1, cursorPosition.column);
                    break;
                case '3':
                    // La tecla 3 del numpad (+1,+1)
                    cursorPosition = Store_1.store.getState().cursorPosition;
                    newCursorPosition = new Utils_1.Pair(cursorPosition.row + (cursorPosition.column & 1 ? 1 : 0), cursorPosition.column + 1);
                    break;
                case '7':
                    // La tecla 7 del numpad (-1,-1)
                    cursorPosition = Store_1.store.getState().cursorPosition;
                    newCursorPosition = new Utils_1.Pair(cursorPosition.row - (cursorPosition.column & 1 ? 0 : 1), cursorPosition.column - 1);
                    break;
                case '8':
                    // La tecla 8 del numpad (0, -1)
                    cursorPosition = Store_1.store.getState().cursorPosition;
                    newCursorPosition = new Utils_1.Pair(cursorPosition.row - 1, cursorPosition.column);
                    break;
                case '9':
                    // La tecla 9 del numpad (+1, -1)
                    cursorPosition = Store_1.store.getState().cursorPosition;
                    newCursorPosition = new Utils_1.Pair(cursorPosition.row - (cursorPosition.column & 1 ? 0 : 1), cursorPosition.column + 1);
                    break;
                case '4':
                    if (Store_1.store.getState().selectedUnit != null) {
                        //Con esto se cancela la acción actual para que se pueda seleccionar otra unidad
                        Store_1.saveState(GameState_1.Actions.generateSetListener(this));
                    }
                    break;
                case '6':
                    if (Store_1.store.getState().selectedUnit != null && Store_1.store.getState().units[Store_1.store.getState().selectedUnit].action < 2) {
                        //Dependiendo de la accion de la unidad pasará a la siguiente acción y será usada o no
                        Store_1.saveState(GameState_1.Actions.generateNextAction(Store_1.store.getState().selectedUnit));
                    }
                    break;
                case '5':
                case ' ':
                    // Realizar el click en la posición
                    cursorPosition = Store_1.store.getState().cursorPosition;
                    this.clickAction(cursorPosition.row, cursorPosition.column);
                    break;
            }
            // Si puede hacerse el movimiento, realiza la acción
            if (newCursorPosition && newCursorPosition.row >= 0 && newCursorPosition.column >= 0 && newCursorPosition.column <= this.props.vertical && newCursorPosition.row <= this.props.horizontal) {
                Store_1.saveState(GameState_1.Actions.generateCursorMovement(newCursorPosition));
            }
        }
    }, {
        key: "onClick",
        value: function onClick(event) {
            var position = Utils_1.Pathfinding.getPositionClicked(event.clientX, event.clientY);
            //Si el juego está terminado entonces no hace nada, por eso comprueba si todavía sigue la partida
            if (Store_1.store.getState().actualState == 0) {
                //Guardamos la posición actual y la nueva posición
                this.clickAction(position.row, position.column);
            }
        }
    }, {
        key: "onRightClick",
        value: function onRightClick(event) {
            // Primero, evitamos que genere el menú del navegador
            event.preventDefault();
            // Obtenemos la posición donde ha realizado click
            var position = Utils_1.Pathfinding.getPositionClicked(event.clientX, event.clientY);
            // Comprobamos que exista una unidad en esa posición
            var unit = Store_1.store.getState().units[Utils_1.myIndexOf(Store_1.store.getState().units.map(function (x) {
                return x.position;
            }), position)];
            // También comprobamos que exista un terreno en la posición
            // Pero antes, vemos que la posición sea alcanzable
            var terrain = null;
            if (position.row >= 0 && position.row <= this.props.vertical && position.column >= 0 && position.column <= this.props.horizontal) {
                // Si es válida, iteramos por los terrenos y si no se encuentra, se emite un Plains
                var terrainIndex = Utils_1.myIndexOf(Store_1.store.getState().terrains.map(function (x) {
                    return x.position;
                }), position);
                terrain = terrainIndex > -1 ? Store_1.store.getState().terrains[terrainIndex] : Terrains_1.Plains.create(position);
            }
            // Actualizamos el estado de la barra de estadísticas
            this.unitStats.setState({ unit: unit, terrain: terrain });
        }
    }, {
        key: "clickAction",
        value: function clickAction(row, column) {
            var newPosition = new Utils_1.Pair(row, column);
            var side = Store_1.store.getState().turn % 2 == 0; // Representa el bando del jugador actual
            var unitIndex = Utils_1.myIndexOf(Store_1.store.getState().units.map(function (x) {
                return x.position;
            }), newPosition); // Obtenemos la posición de la unidad donde ha realizado click o -1.
            var unitEnemy = void 0; //Vale true si la unidad seleccionada es enemiga de las unidades del turno actual
            unitIndex != -1 ? // Si se ha seleccionado una unidad
            side ? // Si el turno es del "aliado"
            unitEnemy = !Store_1.store.getState().units[unitIndex].player // Asigna como enemigo el contrario de la unidad que ha hecho click
            : unitEnemy = Store_1.store.getState().units[unitIndex].player // Asigna como enemigo la unidad que ha hecho click
            : false; // En caso contrario, no hagas nada?
            //Vemos si la unidad ha sido usada (si hay una unidad seleccionada vemos si esta ha sido usada o no, y sino vemos si la unidad del click es seleccionada)
            var used = Store_1.store.getState().selectedUnit != null ? Store_1.store.getState().units[Store_1.store.getState().selectedUnit].used : unitIndex != -1 ? Store_1.store.getState().units[unitIndex].used : false;
            // También comprobaremos si la unidad ha realizado un ataque, que permitirá que la unidad ataque por separado con respecto al movimiento
            var hasAttacked = Store_1.store.getState().selectedUnit != null ?
            // Se activará este boolean cuando se ha seleccionado una unidad y además se ha seleccionado un enemigo
            Store_1.store.getState().units[Store_1.store.getState().selectedUnit].hasAttacked && unitEnemy : true;
            if (!used) {
                //Si el indice es != -1 (está incluido en la lista de unidades) y está en modo de espera de movimiento se generará el estado de movimiento
                if (unitIndex != -1 && !unitEnemy && // La unidad clickeada existe y es del jugador
                Store_1.store.getState().type == "SET_LISTENER" // El tipo de estado es esperando selección
                ) {
                        Store_1.saveState(GameState_1.Actions.generateMove(unitIndex, side));
                        //Si hace clic en una possición exterior, mantiene el estado de en movimiento (seleccionado) y sigue almacenando la unidad seleccionada
                    } else if (newPosition.column < 0 // La posición no es negativa en columnas
                || newPosition.column > this.props.horizontal // Ni es superior al número de celdas horizontales
                || newPosition.row < 0 // La posición no es negativa en filas
                || newPosition.row > this.props.vertical // Ni es superior al número de celdas verticales
                ) {
                        Store_1.saveState(GameState_1.Actions.generateMove(Store_1.store.getState().selectedUnit, side));
                        //En caso de que no esté incluida en la lista de unidades y esté en estado de movimiento
                    } else if (
                // unitIndex!=-1 // La unidad existe
                Store_1.store.getState().selectedUnit != null // Se tiene seleccionada una unidad
                && (Utils_1.myIndexOf(Store_1.store.getState().visitables, newPosition) != -1 // Y la posición de la unidad es alcanzable
                || Store_1.store.getState().turn < 2 // O estamos en la fase de pre juego
                )) {
                    var selectedUnit = Store_1.store.getState().selectedUnit; // Índice de la unidad seleccionada
                    var actualPosition = Store_1.store.getState().units[selectedUnit].position; //Obtenemos la posición actual
                    //Primero se comprueba si es un ataque (si selecciona a un enemigo durante el movimiento)
                    if (unitIndex != -1 && unitEnemy && Store_1.store.getState().units[selectedUnit].action == 1 && !Store_1.store.getState().units[selectedUnit].hasAttacked) {
                        Store_1.saveState(GameState_1.Actions.generateMove(Store_1.store.getState().selectedUnit, side));
                        // Se atacará, esto incluye el movimiento si es aplicable
                        Store_1.saveState(GameState_1.Actions.generateAttack(unitIndex, side, null));
                    } else {
                        // En caso contrario, se ejecutará el movimiento como siempre
                        // El valor de null es si se hace que justo tras el movimiento seleccione otra unidad, en este caso no es necesario así que se pondrá null
                        Store_1.saveState(GameState_1.Actions.generateChangeUnitPos(selectedUnit, newPosition, null, side));
                    }
                }
            } else if (!hasAttacked // En el caso de que tenga posiblidad de atacar y ha hecho click a la unidad enemiga
            || Store_1.store.getState().turn >= 2 // O no estamos en la fase de pre juego
            ) {
                    // Realizamos el ataque:
                    Store_1.saveState(GameState_1.Actions.generateAttack(unitIndex, side, null));
                }
        }
        /** Función auxiliar usada para renderizar el mapa. Consiste en recorrer todas las columnas acumulando las casillas. **/

    }, {
        key: "generateMap",
        value: function generateMap() {
            var accum = [];
            // Repetirá este for hasta que se llegue al número de columnas especificado
            for (var i = 0; i <= this.props.vertical * 2 + 1; i++) {
                // Este método retornará una lista con las casillas en fila
                accum.push(this.generateCellRow.bind(this)(i));
            }
            return accum;
        }
        /** Función auxiliar que servirá para generar las casillas en una fila **/

    }, {
        key: "generateCellRow",
        value: function generateCellRow(num_row) {
            var accum2 = [];
            this.state.cells[num_row] = new Array(this.props.horizontal);
            // Este bucle iterará hasta el número de celdas horizontales especificado en el props.
            for (var j = num_row % 2 == 0 ? 0 : 1; j < this.props.horizontal; j = j + 2) {
                var column = j;
                var row = num_row % 2 == 0 ? num_row / 2 : Math.floor(num_row / 2);
                var cell = React.createElement(Cell_1.Cell, { row: row, column: column });
                this.state.cells[row][column] = cell;
                accum2.push(cell);
            }
            // Se retorna en un div que dependiendo de que se trate de la fila par o impar, contendrá también la clase celRowOdd.
            return React.createElement("div", { className: "cellRow" + (num_row % 2 == 0 ? "" : " cellRowOdd") }, accum2);
        }
    }]);

    return Map;
}(React.Component);

exports.Map = Map;