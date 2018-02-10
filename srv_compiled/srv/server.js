"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Units = require("../src/Unit");
var Utils = require("../src/Utils");
var Terrains = require("../src/Terrains");
var GameState = require("./GameState");
var Store = require("./Store");
var GameEditState = require("./GameEditState");
var StoreEdit = require("./StoreEdit");
var GameProfileState = require("./GameProfileState");
var StoreProfile = require("./StoreProfile");
var webSocket = require("ws");
var server = new webSocket.Server({ port: 8080 });
server.on('connection', function connect(ws) {
    // Este será el inicio del servidor, por ahora nos encargaremos de mostrarle el estado
    console.log("Conected with client");
    ws.on("message", function getInitialState(data) {
        console.log("Got following action: " + data);
        // Dependiendo del estado, retornaremos una cosa u otra
        var message = JSON.parse(data);
        switch (message.tipo) {
            case "getInitialState":
                // Retornaremos el estado inicial
                var state = {
                    turn: 0,
                    actualState: 0,
                    units: [Units.General.create(new Utils.Pair(-1, -1), true), Units.Infantry.create(new Utils.Pair(-1, -1), true), Units.Tank.create(new Utils.Pair(-1, -1), true), Units.Paratrooper.create(new Utils.Pair(-1, -1), true), Units.Artillery.create(new Utils.Pair(-1, -1), true), Units.General.create(new Utils.Pair(-1, -1), false), Units.Infantry.create(new Utils.Pair(-1, -1), false), Units.Tank.create(new Utils.Pair(-1, -1), false)],
                    visitables: null,
                    terrains: [Terrains.ImpassableMountain.create(new Utils.Pair(2, 2)), Terrains.ImpassableMountain.create(new Utils.Pair(3, 2)), Terrains.Hills.create(new Utils.Pair(2, 3)), Terrains.Forest.create(new Utils.Pair(3, 3))],
                    cursorPosition: new Utils.Pair(0, 0),
                    map: null,
                    selectedUnit: null,
                    type: "SET_LISTENER"
                };
                ws.send(JSON.stringify(state));
                break;
            case "SAVE_MAP":
                var actmap = GameState.parseActionMap(message);
                //Guardamos el estado
                Store.saveState(actmap);
                //Enviamos el nuevo estado
                ws.send(JSON.stringify(Store.store.getState()));
                break;
            case "SAVE_EDIT":
                var actedit = GameEditState.parseActionMap(message);
                //Guardamos el estado
                StoreEdit.saveState(actedit);
                //Enviamos el nuevo estado
                ws.send(JSON.stringify(StoreEdit.storeEdit.getState()));
                break;
            case "SAVE_PROFILE":
                var actprofile = GameProfileState.parseActionMap(message);
                //Guardamos el estado
                StoreProfile.saveState(actprofile);
                //Enviamos el nuevo estado
                ws.send(JSON.stringify(StoreProfile.storeProfile.getState()));
                break;
            default:
                console.warn("Action sent not understood! Type is " + message.type);
                ws.send("Command not understood");
        }
    });
});