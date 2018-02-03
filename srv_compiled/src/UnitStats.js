"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Store_1 = require("./Store");

var UnitStats = function (_React$Component) {
    _inherits(UnitStats, _React$Component);

    function UnitStats(props) {
        _classCallCheck(this, UnitStats);

        // Actualizamos el atributo de Mapa para que el mapa pueda actualizar el estado de este componente.
        var _this = _possibleConstructorReturn(this, (UnitStats.__proto__ || Object.getPrototypeOf(UnitStats)).call(this, props));

        Store_1.store.getState().map.unitStats = _this;
        _this.state = {
            unit: null,
            terrain: null
        };
        return _this;
    }

    _createClass(UnitStats, [{
        key: "render",
        value: function render() {
            var unitStats = null;
            if (this.state.unit != null) {
                unitStats = React.createElement("div", null, React.createElement("h4", null, "Seleccionada: "), React.createElement("p", null, "Unidad: "), React.createElement("p", null, "    Posici\xF3n: ", this.state.unit.position.toString()), React.createElement("p", null, "    Tipo: ", this.state.unit.type), React.createElement("p", null, "    Acci\xF3n disponible: ", this.state.unit.action == 0 ? "Movimiento" : this.state.unit.action == 1 ? "Ataque" : "Ninguna"), React.createElement("p", null, "    Movimiento: ", this.state.unit.movement), React.createElement("p", null, "    Alcance: ", this.state.unit.range), React.createElement("p", null, "    Vida: ", this.state.unit.health), React.createElement("p", null, "    Ataque d\xE9bil: ", this.state.unit.attackWeak), React.createElement("p", null, "    Ataque fuerte: ", this.state.unit.attackStrong), React.createElement("p", null, "    Defensa d\xE9bil: ", this.state.unit.defenseWeak), React.createElement("p", null, "    Defensa fuerte: ", this.state.unit.defenseStrong));
            }
            var terrainStats = null;
            if (this.state.terrain != null) {
                terrainStats = React.createElement("div", null, React.createElement("p", null, "Terreno: "), React.createElement("p", null, "    Posici\xF3n: ", this.state.terrain.position.toString()), React.createElement("p", null, "    Tipo: ", this.state.terrain.name), React.createElement("p", null, "    Coste (movimiento): ", this.state.terrain.movement_penalty));
            }
            return React.createElement("div", { className: "leftPanel" }, React.createElement("div", { className: "unitStats" }, unitStats, terrainStats, !unitStats && !terrainStats ? "Haga click derecho para poder obtener información de la unidad y terreno." : null /* Hotfix porque CSS no quiere ponerlo con el tamaño fijo nunca */));
        }
    }]);

    return UnitStats;
}(React.Component);

exports.UnitStats = UnitStats;