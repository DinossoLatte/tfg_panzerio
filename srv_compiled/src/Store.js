"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Redux = require("redux");
var GameState_1 = require("./GameState");
var Utils_1 = require("./Utils");
function saveState(act) {
    saveStateServer(function () {}, act);
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
exports.store = Redux.createStore(GameState_1.Reducer);
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
        exports.actualState = Utils_1.Network.parseStateFromServer(event.data);
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