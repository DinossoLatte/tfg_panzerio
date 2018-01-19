"use strict";

exports.__esModule = true;

var Utils_1 = require("./../src/Utils");
var Unit_1 = require("./../src/Unit");
var Terrains_1 = require("./../src/Terrains");
var webSocket = require("ws");

var server = new webSocket.Server({ port: 8080 });

server.on('connection', function connect(ws) {
    // Este será el inicio del servidor, por ahora nos encargaremos de mostrarle el estado
    console.log("Connected with someone");
    ws.on("message", function getInitialState(data) {
        // Dependiendo del estado, retornaremos una cosa u otra
        console.log("Data: "+data);
        let message = JSON.parse(data);
        switch (message.type) {
            case "getInitialState":
                // Retornaremos el estado inicial
                var state = {
                    turn: 0,
                    actualState: 0,
                    units: [Unit_1.General.create(new Utils_1.Pair(0, 0), true), Unit_1.Infantry.create(new Utils_1.Pair(1, 2), true), Unit_1.Tank.create(new Utils_1.Pair(1, 0), true), Unit_1.General.create(new Utils_1.Pair(0, 4), false),
                        Unit_1.Infantry.create(new Utils_1.Pair(1, 4), false), Unit_1.Tank.create(new Utils_1.Pair(0, 3), false)],
                    visitables: null,
                    terrains: [Terrains_1.ImpassableMountain.create(new Utils_1.Pair(2, 2)), Terrains_1.ImpassableMountain.create(new Utils_1.Pair(3, 2)), Terrains_1.Hills.create(new Utils_1.Pair(2, 3)), Terrains_1.Forest.create(new Utils_1.Pair(3, 3))],
                    cursorPosition: new Utils_1.Pair(0, 0),
                    map: null,
                    selectedUnit: null,
                    type: "SET_LISTENER"
                };
                ws.send(JSON.stringify(state));
                break;
            default:
                ws.send("Command not understood");
        }
    });
});
