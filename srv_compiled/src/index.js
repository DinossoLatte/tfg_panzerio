"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var Game_1 = require("./Game");
// Representa la aplicación, por ahora únicamente el mapa
function main() {
    ReactDOM.render(React.createElement(Game_1.Game, null), document.getElementById("root"));
}
main();