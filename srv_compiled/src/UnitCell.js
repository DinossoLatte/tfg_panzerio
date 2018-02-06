"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");

var UnitCell = function (_React$Component) {
    _inherits(UnitCell, _React$Component);

    function UnitCell(props) {
        _classCallCheck(this, UnitCell);

        return _possibleConstructorReturn(this, (UnitCell.__proto__ || Object.getPrototypeOf(UnitCell)).call(this, props));
    }

    _createClass(UnitCell, [{
        key: "render",
        value: function render() {
            //Comprobamos si es enemiga o no para cambiar su sprite
            var enemy = !this.props.unit.player ? "enemy_" : "";
            // Le añadiremos el resultado de la comprobación anterior.
            return React.createElement("div", { className: "unit" }, React.createElement("img", { id: "unit" + this.props.unit.position.getRow() + "_" + this.props.unit.position.getColumn(), src: "imgs/" + enemy + this.props.unit.type + ".png" }));
        }
    }]);

    return UnitCell;
}(React.Component);

exports.UnitCell = UnitCell;