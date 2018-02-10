"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var StoreEdit_1 = require("./StoreEdit");
var GameEditState_1 = require("./GameEditState");
var EditCell_1 = require("./EditCell");
var Utils_1 = require("./Utils");
var EditStats_1 = require("./EditStats");
var Terrains_1 = require("./Terrains");

var EditMap = function (_React$Component) {
    _inherits(EditMap, _React$Component);

    /** @constructor  Deben introducirse los elementos horizontal y vertical **/
    function EditMap(props) {
        _classCallCheck(this, EditMap);

        var _this = _possibleConstructorReturn(this, (EditMap.__proto__ || Object.getPrototypeOf(EditMap)).call(this, props));

        _this.editStats = null;
        _this.restartState();
        return _this;
    }

    _createClass(EditMap, [{
        key: "restartState",
        value: function restartState() {
            this.state = {
                cells: new Array(this.props.horizontal),
                rows: this.props.vertical,
                columns: this.props.horizontal,
                json: null
            };
            StoreEdit_1.storeEdit.dispatch(GameEditState_1.EditActions.generateSetListener(this));
        }
        /** Renderiza el mapa **/

    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            // El mapa se renderizará en un div con estilo, por ello debemos usar className="map"
            return React.createElement("div", null, StoreEdit_1.storeEdit.getState().type != 1 ? React.createElement("button", { id: "terrainButton", name: "terrainButton", onClick: this.onClickCreateTerrain.bind(this) }, "Crear terreno") : "", StoreEdit_1.storeEdit.getState().type == 1 ? React.createElement("p", null, "Acci\xF3n: Creaci\xF3n de terreno. Terreno seleccionado: ", StoreEdit_1.storeEdit.getState().selected) : "", StoreEdit_1.storeEdit.getState().type == 1 ? React.createElement("div", null, React.createElement("label", null, " Selecciona el tipo de terreno:", React.createElement("select", { defaultValue: null, value: StoreEdit_1.storeEdit.getState().selected, onChange: function onChange(evt) {
                    return _this2.selected(evt.target.value);
                } }, this.selectOptionsTerrains()))) : "", React.createElement("button", { id: "exitButton", name: "exitButton", onClick: this.onClickExit.bind(this) }, "Salir del juego"), React.createElement("button", { id: "generateButton", name: "generateButton", onClick: this.onClickGenerateMap.bind(this) }, "Guardar mapa"), this.state.json ? React.createElement("textarea", null, this.state.json) : "", React.createElement("div", null, React.createElement(EditStats_1.EditStats, { map: this }), React.createElement("div", { id: "map", className: "map", onClick: this.onClick.bind(this), tabIndex: 0, onKeyDown: this.onKey.bind(this), onContextMenu: this.onRightClick.bind(this) }, this.generateMap.bind(this)().map(function (a) {
                return a;
            }))));
        }
    }, {
        key: "selectOptionsTerrains",
        value: function selectOptionsTerrains() {
            var army = [React.createElement("option", { selected: true, value: null }, "--Selecciona--")];
            for (var i = 0; i < Terrains_1.TERRAINS.length; i++) {
                army.push(React.createElement("option", { value: Terrains_1.TERRAINS[i] }, Terrains_1.TERRAINS_ESP[i]));
            }
            return army;
        }
        //Todos estos son métodos de actualización de los botones y los estados correspondientes de borrar, crear unidad, crear terreno, seleccionar y cambiar bando

    }, {
        key: "selected",
        value: function selected(evt) {
            StoreEdit_1.saveState(GameEditState_1.EditActions.selected(this, evt));
        }
    }, {
        key: "onClickCreateTerrain",
        value: function onClickCreateTerrain(event) {
            StoreEdit_1.saveState(GameEditState_1.EditActions.onClickCreateTerrain(this));
        }
    }, {
        key: "onClickExit",
        value: function onClickExit(event) {
            this.props.parentObject.changeGameState(0); // Salir de la partida.
        }
    }, {
        key: "onClickGenerateMap",
        value: function onClickGenerateMap(event) {
            // Para generar el mapa, convertiremos el conjunto de terrenos en un JSON
            var terrains = StoreEdit_1.storeEdit.getState().terrains;
            // Generamos el JSON que contendrán los datos del mapa,
            var result = JSON.stringify({
                // Este elemento contiene los terrenos
                map: terrains,
                // También debemos definir las filas y columnas
                rows: this.state.rows,
                columns: this.state.columns
            });
            // Finalmente, mostramos en el textarea el resultado
            this.setState({
                cells: this.state.cells,
                rows: this.state.rows,
                columns: this.state.columns,
                json: result
            });
        }
        //Igual que en Map solo que se actualiza el cursor del estado de edición

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
                    cursorPosition = StoreEdit_1.storeEdit.getState().cursorPosition;
                    // Crearemos una nueva posición resultado
                    newCursorPosition = new Utils_1.Pair(cursorPosition.row + (cursorPosition.column & 1 ? 1 : 0), cursorPosition.column - 1);
                    // Llamamos a la acción para cambiarlo
                    break;
                case '2':
                    // La tecla 2 del numpad (0,+1)
                    cursorPosition = StoreEdit_1.storeEdit.getState().cursorPosition;
                    newCursorPosition = new Utils_1.Pair(cursorPosition.row + 1, cursorPosition.column);
                    break;
                case '3':
                    // La tecla 3 del numpad (+1,+1)
                    cursorPosition = StoreEdit_1.storeEdit.getState().cursorPosition;
                    newCursorPosition = new Utils_1.Pair(cursorPosition.row + (cursorPosition.column & 1 ? 1 : 0), cursorPosition.column + 1);
                    break;
                case '7':
                    // La tecla 7 del numpad (-1,-1)
                    cursorPosition = StoreEdit_1.storeEdit.getState().cursorPosition;
                    newCursorPosition = new Utils_1.Pair(cursorPosition.row - (cursorPosition.column & 1 ? 0 : 1), cursorPosition.column - 1);
                    break;
                case '8':
                    // La tecla 8 del numpad (0, -1)
                    cursorPosition = StoreEdit_1.storeEdit.getState().cursorPosition;
                    newCursorPosition = new Utils_1.Pair(cursorPosition.row - 1, cursorPosition.column);
                    break;
                case '9':
                    // La tecla 9 del numpad (+1, -1)
                    cursorPosition = StoreEdit_1.storeEdit.getState().cursorPosition;
                    newCursorPosition = new Utils_1.Pair(cursorPosition.row - (cursorPosition.column & 1 ? 0 : 1), cursorPosition.column + 1);
                    break;
                case '5':
                case ' ':
                    // Realizar el click en la posición
                    cursorPosition = StoreEdit_1.storeEdit.getState().cursorPosition;
                    this.clickAction(cursorPosition.row, cursorPosition.column);
                    break;
            }
            // Si puede hacerse el movimiento, realiza la acción
            if (newCursorPosition && newCursorPosition.row >= 0 && newCursorPosition.column >= 0 && newCursorPosition.column <= this.props.vertical && newCursorPosition.row <= this.props.horizontal) {
                StoreEdit_1.saveState(GameEditState_1.EditActions.generateChangeCursor(newCursorPosition));
            }
        }
    }, {
        key: "onClick",
        value: function onClick(event) {
            var position = Utils_1.Pathfinding.getPositionClicked(event.clientX, event.clientY);
            //Guardamos la posición actual y la nueva posición
            this.clickAction(position.row, position.column);
        }
        //Se usa editStats ya que necesitamos obtener los datos de los array de terrain y unit del estado de edición

    }, {
        key: "onRightClick",
        value: function onRightClick(event) {
            // Primero, evitamos que genere el menú del navegador
            event.preventDefault();
            // Obtenemos la posición donde ha realizado click
            var position = Utils_1.Pathfinding.getPositionClicked(event.clientX, event.clientY);
            // También comprobamos que exista un terreno en la posición
            // Pero antes, vemos que la posición sea alcanzable
            var terrain = null;
            if (position.row >= 0 && position.row <= this.props.vertical && position.column >= 0 && position.column <= this.props.horizontal) {
                // Si es válida, iteramos por los terrenos y si no se encuentra, se emite un Plains
                var terrainIndex = Utils_1.myIndexOf(StoreEdit_1.storeEdit.getState().terrains.map(function (x) {
                    return x.position;
                }), position);
                terrain = terrainIndex > -1 ? StoreEdit_1.storeEdit.getState().terrains[terrainIndex] : Terrains_1.Plains.create(position);
            }
            // Actualizamos el estado de la barra de estadísticas
            // El estado será siempre null, ya que no habrá unidades en el editor
            this.editStats.setState({ unit: null, terrain: terrain });
        }
    }, {
        key: "clickAction",
        value: function clickAction(row, column) {
            var newPosition = new Utils_1.Pair(row, column);
            var terrainIndex = Utils_1.myIndexOf(StoreEdit_1.storeEdit.getState().terrains.map(function (x) {
                return x.position;
            }), newPosition);
            var terrain = void 0;
            var array = StoreEdit_1.storeEdit.getState().terrains;
            // Obtenemos el nuevo terreno a reemplazar/crear
            switch (StoreEdit_1.storeEdit.getState().selected) {
                case "Plains":
                    terrain = Terrains_1.Plains.create(newPosition);
                    break;
                case "Mountains":
                    terrain = Terrains_1.ImpassableMountain.create(newPosition);
                    break;
                case "Hills":
                    terrain = Terrains_1.Hills.create(newPosition);
                    break;
                case "Forest":
                    terrain = Terrains_1.Forest.create(newPosition);
                    break;
                default:
            }
            ;
            // Comprobamos si la posición está ocupada
            if (terrainIndex > -1) {
                // En este caso, reemplazamos el terreno en el índice en el que esté
                array[terrainIndex] = terrain;
            } else {
                // En este otro caso, añadiremos el terreno al índice
                array.push(terrain);
            }
            // Finalmente, actualizamos el estado
            StoreEdit_1.storeEdit.dispatch(GameEditState_1.EditActions.generateChangeTerrain(array));
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
        //Se generan las celdas con EditCell ya que se necesita que vaya por la lista del estado de edit

    }, {
        key: "generateCellRow",
        value: function generateCellRow(num_row) {
            var accum2 = [];
            this.state.cells[num_row] = new Array(this.props.horizontal);
            // Este bucle iterará hasta el número de celdas horizontales especificado en el props.
            for (var j = num_row % 2 == 0 ? 0 : 1; j < this.props.horizontal; j = j + 2) {
                var column = j;
                var row = num_row % 2 == 0 ? num_row / 2 : Math.floor(num_row / 2);
                var cell = React.createElement(EditCell_1.EditCell, { row: row, column: column }); // Si es num_row % 2, es una columna sin offset y indica nueva fila, ecc necesitamos el anterior.
                this.state.cells[row][column] = cell;
                accum2.push(cell);
            }
            // Se retorna en un div que dependiendo de que se trate de la fila par o impar, contendrá también la clase celRowOdd.
            return React.createElement("div", { className: "cellRow" + (num_row % 2 == 0 ? "" : " cellRowOdd") }, accum2);
        }
    }]);

    return EditMap;
}(React.Component);

exports.EditMap = EditMap;