"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var StoreEdit_1 = require("./StoreEdit");
var TerrainCell_1 = require("./TerrainCell");
var Utils_1 = require("./Utils");
var Terrain = require("./Terrains");
//ESta clase es similar a Cell pero obteniendo los datos de storeEdit (quizas se pudiera generalizar y de esa forma juntar con Cell)

var EditCell = function (_React$Component) {
    _inherits(EditCell, _React$Component);

    function EditCell(props) {
        _classCallCheck(this, EditCell);

        return _possibleConstructorReturn(this, (EditCell.__proto__ || Object.getPrototypeOf(EditCell)).call(this, props));
    }
    /** Renderiza el objeto **/


    _createClass(EditCell, [{
        key: "render",
        value: function render() {
            // Comprobamos si una unidad está en esta posición
            // Comprobamos si la casilla actual contiene el cursor, primero obteniendo su posición
            var positionCursor = StoreEdit_1.storeEdit.getState().cursorPosition;
            // Despues comprobando que esta casilla esté en esa posición
            var cursor = positionCursor.column == this.props.column && positionCursor.row == this.props.row;
            var pair = new Utils_1.Pair(this.props.row, this.props.column);
            var indexTerrain = Utils_1.myIndexOf(StoreEdit_1.storeEdit.getState().terrains.map(function (x) {
                return x.position;
            }), pair);
            var terrain = indexTerrain > -1 ? StoreEdit_1.storeEdit.getState().terrains[indexTerrain] : Terrain.Plains.create(pair);
            return React.createElement("div", { className: "div_cell" }, React.createElement("img", { className: "cell", id: "hex" + this.props.row + "_" + this.props.column, src: cursor ? "imgs/hex_base_numpad.png" : "imgs/hex_base.png" }), React.createElement(TerrainCell_1.TerrainCell, { terrain: terrain }));
        }
    }]);

    return EditCell;
}(React.Component);

exports.EditCell = EditCell;