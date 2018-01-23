"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Store_1 = require("./Store");
class UnitStats extends React.Component {
    constructor(props) {
        super(props);
        // Actualizamos el atributo de Mapa para que el mapa pueda actualizar el estado de este componente.
        Store_1.store.getState().map.unitStats = this;
        this.state = {
            unit: null,
            terrain: null
        };
    }
    render() {
        let unitStats = null;
        if (this.state.unit != null) {
            unitStats = (React.createElement("div", null,
                React.createElement("h4", null, "Seleccionada: "),
                React.createElement("p", null, "Unidad: "),
                React.createElement("p", null,
                    "    Posici\u00F3n: ",
                    this.state.unit.position.toString()),
                React.createElement("p", null,
                    "    Tipo: ",
                    this.state.unit.type),
                React.createElement("p", null,
                    "    Acci\u00F3n disponible: ",
                    this.state.unit.action == 0 ? "Movimiento" : this.state.unit.action == 1 ? "Ataque" : "Ninguna"),
                React.createElement("p", null,
                    "    Movimiento: ",
                    this.state.unit.movement),
                React.createElement("p", null,
                    "    Alcance: ",
                    this.state.unit.range),
                React.createElement("p", null,
                    "    Vida: ",
                    this.state.unit.health),
                React.createElement("p", null,
                    "    Ataque d\u00E9bil: ",
                    this.state.unit.attackWeak),
                React.createElement("p", null,
                    "    Ataque fuerte: ",
                    this.state.unit.attackStrong),
                React.createElement("p", null,
                    "    Defensa d\u00E9bil: ",
                    this.state.unit.defenseWeak),
                React.createElement("p", null,
                    "    Defensa fuerte: ",
                    this.state.unit.defenseStrong)));
        }
        let terrainStats = null;
        if (this.state.terrain != null) {
            terrainStats = (React.createElement("div", null,
                React.createElement("p", null, "Terreno: "),
                React.createElement("p", null,
                    "    Posici\u00F3n: ",
                    this.state.terrain.position.toString()),
                React.createElement("p", null,
                    "    Tipo: ",
                    this.state.terrain.name),
                React.createElement("p", null,
                    "    Coste (movimiento): ",
                    this.state.terrain.movement_penalty)));
        }
        return (React.createElement("div", { className: "leftPanel" },
            React.createElement("div", { className: "unitStats" },
                unitStats,
                terrainStats,
                !unitStats && !terrainStats ? "Haga click derecho para poder obtener información de la unidad y terreno." : null /* Hotfix porque CSS no quiere ponerlo con el tamaño fijo nunca */)));
    }
}
exports.UnitStats = UnitStats;
