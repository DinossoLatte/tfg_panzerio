"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Store_1 = require("./Store");
const TerrainCell_1 = require("./TerrainCell");
const UnitCell_1 = require("./UnitCell");
const Utils_1 = require("./Utils");
const Terrain = require("./Terrains");
/**
    Esta clase consiste en la representación de una casilla dentro del mapa
    @constructor Incluye los atributos HTML: horizontal y vertical.
**/
class Cell extends React.Component {
    /** Debe introducirse los atributos horizontal y vertical
        @param props debe contener horizontal y vertical**/
    constructor(props) {
        super(props);
        let pair = new Utils_1.Pair(props.row, props.column);
        let indexTerrain = Utils_1.myIndexOf(Store_1.store.getState().terrains.map(x => x.position), pair);
        this.state = {
            terrain: indexTerrain > -1 ? Store_1.store.getState().terrains[indexTerrain] : Terrain.Plains.create(new Utils_1.Pair(props.row, props.column)),
        };
    }
    /** Renderiza el objeto **/
    render() {
        // Comprobamos si una unidad está en esta posición
        let indexUnit = Utils_1.myIndexOf(Store_1.store.getState().units.map(x => x.position), this.state.terrain.position);
        let unit = indexUnit == -1 ? null : Store_1.store.getState().units[indexUnit];
        // Comprobamos si la casilla actual contiene el cursor, primero obteniendo su posición
        let positionCursor = Store_1.store.getState().cursorPosition;
        // Despues comprobando que esta casilla esté en esa posición
        let cursor = positionCursor.column == this.props.column && positionCursor.row == this.props.row;
        return (React.createElement("div", { className: "div_cell" },
            React.createElement("img", { className: "cell", id: "hex" + this.props.row + "_" + this.props.column, src: cursor ? this.props.used ? "imgs/hex_base_numpad_used.png"
                    : this.props.selected ? "imgs/hex_base_numpad_selected.png"
                        : this.props.attack ? "imgs/hex_base_numpad_attack.png"
                            : this.props.actual ? "imgs/hex_base_numpad_actual.png"
                                : "imgs/hex_base_numpad.png"
                    : this.props.used ? "imgs/hex_base_used.png"
                        : this.props.selected ? "imgs/hex_base_selected.png"
                            : this.props.attack ? "imgs/hex_base_attack.png"
                                : this.props.actual ? "imgs/hex_base_actual.png"
                                    : "imgs/hex_base.png" }),
            React.createElement(TerrainCell_1.TerrainCell, { terrain: this.state.terrain }),
            unit != null ? React.createElement(UnitCell_1.UnitCell, { unit: unit }) : ""));
    }
}
exports.Cell = Cell;
