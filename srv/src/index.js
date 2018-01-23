"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const Game_1 = require("./Game");
// Representa la aplicación, por ahora únicamente el mapa
function main() {
    ReactDOM.render(React.createElement(Game_1.Game, null), document.getElementById("root"));
}
exports.main = main;
main();
