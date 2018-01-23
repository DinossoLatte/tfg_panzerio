"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class TerrainCell extends React.Component {
    constructor(props) {
        super(props);
    }
    //Este es el render del obstacle
    render() {
        return (React.createElement("div", { className: "obstacle" },
            React.createElement("img", { id: "obstacle" + this.props.terrain.position.getRow() + "_" + this.props.terrain.position.getColumn(), src: this.props.terrain.image })));
    }
}
exports.TerrainCell = TerrainCell;
