"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Redux = require("redux");
var GameProfileState_1 = require("./GameProfileState");
exports.storeProfile = Redux.createStore(GameProfileState_1.ReducerProfile);
function saveState(act) {
    exports.storeProfile.dispatch(act);
    var profile = exports.storeProfile.getState().profile;
    var armies = exports.storeProfile.getState().armies;
    var selectedArmy = exports.storeProfile.getState().selectedArmy;
    var selected = exports.storeProfile.getState().selected;
    var type = exports.storeProfile.getState().type;
}
exports.saveState = saveState;