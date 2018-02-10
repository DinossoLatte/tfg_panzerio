"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Redux = require("redux");
var GameProfileState_1 = require("./GameProfileState");
var Utils_1 = require("./Utils");
exports.storeProfile = Redux.createStore(GameProfileState_1.ReducerProfile);
function saveState(act) {
    saveStateServer(function () {}, act);
    exports.storeProfile.dispatch(act);
    var profile = exports.storeProfile.getState().profile;
    var armies = exports.storeProfile.getState().armies;
    var selectedArmy = exports.storeProfile.getState().selectedArmy;
    var selected = exports.storeProfile.getState().selected;
    var type = exports.storeProfile.getState().type;
}
exports.saveState = saveState;
//Este será el estado actual que se guardará en cliente, el servidor tendrá guardado el estado real
exports.actualState = undefined;
function saveStateServer(callback, act) {
    var connection = new WebSocket("ws://localhost:8080/");
    console.log("Connection established with server");
    // Establecemos la conexión
    connection.onmessage = function (event) {
        console.log("Receiving data ...");
        console.log("Message: " + event.data);
        if (event.data == "Command not understood") {
            // Enviamos un error, algo ha pasado con el servidor
            throw new Error();
        }
        // Obtenemos el estado
        exports.actualState = Utils_1.Network.parseStateProfileFromServer(event.data);
        // Una vez tengamos el estado, llamamos al callback aportado, que permitirá saber con certeza que el estado está disponible
        callback();
    };
    connection.onopen = function () {
        console.log("Connection available for sending action");
        // Enviamos la solicitud
        connection.send(JSON.stringify(act));
        console.log("Action sent.");
    };
}
exports.saveStateServer = saveStateServer;