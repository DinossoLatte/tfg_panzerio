"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Redux = require("redux");
var GameEditState_1 = require("./GameEditState");
exports.storeEdit = Redux.createStore(GameEditState_1.ReducerEdit);
function saveState(act) {
    exports.storeEdit.dispatch(act);
    // Refresca el mapa y el resto de variables del estado
    var map = exports.storeEdit.getState().map;
    var side = exports.storeEdit.getState().side;
    var terrains = exports.storeEdit.getState().terrains;
    var selected = exports.storeEdit.getState().selected;
    var cursorPosition = exports.storeEdit.getState().cursorPosition;
    var type = exports.storeEdit.getState().type;
}
exports.saveState = saveState;