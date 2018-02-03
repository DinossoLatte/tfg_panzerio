"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Store_1 = require("./Store");
var TerrainCell_1 = require("./TerrainCell");
var UnitCell_1 = require("./UnitCell");
var Utils_1 = require("./Utils");
var Terrain = require("./Terrains");
/**
    Esta clase consiste en la representación de una casilla dentro del mapa
    @constructor Incluye los atributos HTML: horizontal y vertical.
**/

var Cell = function (_React$Component) {
    _inherits(Cell, _React$Component);

    /** Debe introducirse los atributos horizontal y vertical
        @param props debe contener horizontal y vertical**/
    function Cell(props) {
        _classCallCheck(this, Cell);

        var _this = _possibleConstructorReturn(this, (Cell.__proto__ || Object.getPrototypeOf(Cell)).call(this, props));

        var pair = new Utils_1.Pair(props.row, props.column);
        var indexTerrain = Utils_1.myIndexOf(Store_1.store.getState().terrains.map(function (x) {
            return x.position;
        }), pair);
        _this.state = {
            terrain: indexTerrain > -1 ? Store_1.store.getState().terrains[indexTerrain] : Terrain.Plains.create(new Utils_1.Pair(props.row, props.column))
        };
        return _this;
    }
    /** Renderiza el objeto **/


    _createClass(Cell, [{
        key: "render",
        value: function render() {
            // Comprobamos si una unidad está en esta posición
            var indexUnit = Utils_1.myIndexOf(Store_1.store.getState().units.map(function (x) {
                return x.position;
            }), this.state.terrain.position);
            var unit = indexUnit == -1 ? null : Store_1.store.getState().units[indexUnit];
            // Comprobación de que exista una unidad seleccionada
            var anyUnitSelected = Store_1.store.getState().selectedUnit != null;
            // Comprobación si la unidad en la posición de la celda es usada
            var isUnitUsed = unit == null ? false : unit.used;
            // Comprobación de la unidad seleccionada es la de la celda
            var isUnitSelected = anyUnitSelected && Store_1.store.getState().units[Store_1.store.getState().selectedUnit].position.equals(this.state.terrain.position);
            // Comprobación de que la casilla actual sea visitable o atacable por la unidad seleccionada
            var isCellVisitable = anyUnitSelected && Utils_1.myIndexOf(Store_1.store.getState().visitables, this.state.terrain.position) > -1;
            // Compobación de la unidad en nuestra posición es atacable
            var isUnitAttackable = isCellVisitable && unit != null && (unit.player && Store_1.store.getState().turn % 2 != 0 || !unit.player && Store_1.store.getState().turn % 2 == 0);
            // Comprobamos si la casilla actual contiene el cursor, primero obteniendo su posición
            var positionCursor = Store_1.store.getState().cursorPosition;
            // Despues comprobando que esta casilla esté en esa posición
            var cursor = positionCursor.column == this.props.column && positionCursor.row == this.props.row;
            return React.createElement("div", { className: "div_cell" }, React.createElement("img", { className: "cell", id: "hex" + this.props.row + "_" + this.props.column, src: cursor ? isUnitUsed ? "imgs/hex_base_numpad_used.png" : isUnitSelected ? "imgs/hex_base_numpad_actual.png" : isUnitAttackable ? "imgs/hex_base_numpad_attack.png" : isCellVisitable ? "imgs/hex_base_numpad_selected.png" : "imgs/hex_base_numpad.png" : isUnitUsed ? "imgs/hex_base_used.png" : isUnitSelected ? "imgs/hex_base_actual.png" : isUnitAttackable ? "imgs/hex_base_attack.png" : isCellVisitable ? "imgs/hex_base_selected.png" : "imgs/hex_base.png" }), React.createElement(TerrainCell_1.TerrainCell, { terrain: this.state.terrain }), unit != null ? React.createElement(UnitCell_1.UnitCell, { unit: unit }) : "");
        }
    }]);

    return Cell;
}(React.Component);

exports.Cell = Cell;