"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Redux = require("redux");
const GameState_1 = require("./GameState");
exports.store = Redux.createStore(GameState_1.Reducer);
function saveState(act) {
    exports.store.dispatch(act);
    // Refresca el mapa y el resto de variables del estado
    var turn = exports.store.getState().turn;
    var actualState = exports.store.getState().actualState;
    var map = exports.store.getState().map;
    var units = exports.store.getState().units;
    var terrains = exports.store.getState().terrains;
    var selectedUnit = exports.store.getState().selectedUnit;
    var cursorPosition = exports.store.getState().cursorPosition;
    var type = exports.store.getState().type;
    map.setState({});
}
exports.saveState = saveState;
