"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class UnitCell extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        //Comprobamos si es enemiga o no para cambiar su sprite
        let enemy = !this.props.unit.player ? "enemy_" : "";
        // Le añadiremos el resultado de la comprobación anterior.
        return (React.createElement("div", { className: "unit" },
            React.createElement("img", { id: "unit" + this.props.unit.position.getRow() + "_" + this.props.unit.position.getColumn(), src: "imgs/" + enemy + this.props.unit.type + ".png" })));
    }
}
exports.UnitCell = UnitCell;
