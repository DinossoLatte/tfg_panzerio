"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var StoreEdit_1 = require("./StoreEdit");
//Esta clase funciona igual que UnitStats pero simplemente obtiene los datos de storeEdit

var EditStats = function (_React$Component) {
    _inherits(EditStats, _React$Component);

    function EditStats(props) {
        _classCallCheck(this, EditStats);

        // Actualizamos el atributo de Mapa para que el mapa pueda actualizar el estado de este componente.
        var _this = _possibleConstructorReturn(this, (EditStats.__proto__ || Object.getPrototypeOf(EditStats)).call(this, props));

        StoreEdit_1.storeEdit.getState().map.editStats = _this;
        _this.state = {
            terrain: null
        };
        return _this;
    }

    _createClass(EditStats, [{
        key: "render",
        value: function render() {
            var terrainStats = null;
            if (this.state.terrain != null) {
                terrainStats = React.createElement("div", null, React.createElement("p", null, "Terreno: "), React.createElement("p", null, "    Posici\xF3n: ", this.state.terrain.position.toString()), React.createElement("p", null, "    Tipo: ", this.state.terrain.name), React.createElement("p", null, "    Coste (movimiento): ", this.state.terrain.movement_penalty));
            }
            return React.createElement("div", { className: "leftPanel" }, React.createElement("div", { className: "unitStats" }, terrainStats, !terrainStats ? "Haga click derecho para poder obtener información de la unidad y terreno." : null /* Hotfix porque CSS no quiere ponerlo con el tamaño fijo nunca */));
        }
    }]);

    return EditStats;
}(React.Component);

exports.EditStats = EditStats;