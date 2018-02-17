import { StringDecoder } from 'string_decoder';
import * as webSocket from 'ws';
import * as FileSystem from 'fs';

import * as Units from '../src/Unit';
import * as Utils from '../src/Utils';
import * as Terrains from '../src/Terrains';
import * as GameState from './GameState';
import * as Store from './Store';
import * as GameEditState from './GameEditState';
import * as StoreEdit from './StoreEdit';
import * as GameProfileState from './GameProfileState';
import * as StoreProfile from './StoreProfile';
import * as UtilsServer from './UtilsServer';

var server = new webSocket.Server({ port: 8080 });

server.on('connection', function connect(ws) {
    // Este será el inicio del servidor, por ahora nos encargaremos de mostrarle el estado
    console.log("Conected with client");
    ws.on("message", function getInitialState(data) {
        console.log("Got following action: "+data);
        // Dependiendo del estado, retornaremos una cosa u otra
        let message = JSON.parse(data as string);
        switch (message.tipo) {
            case "getInitialState":
                // Retornaremos el estado inicial
                var state = {
                    turn: 0,
                    actualState: 0,
                    units: [Units.General.create(new Utils.Pair(-1, -1), true), Units.Infantry.create(new Utils.Pair(-1, -1), true), Units.Tank.create(new Utils.Pair(-1, -1), true),Units.Paratrooper.create(new Utils.Pair(-1, -1), true),Units.Artillery.create(new Utils.Pair(-1, -1), true), Units.General.create(new Utils.Pair(-1, -1), false),
                        Units.Infantry.create(new Utils.Pair(-1, -1), false), Units.Tank.create(new Utils.Pair(-1, -1), false)],
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
                let actmap = GameState.parseActionMap(message);
                //Guardamos el estado
                Store.saveState(actmap);
                //Enviamos el nuevo estado
                ws.send(JSON.stringify(Store.store.getState()));
                break;
            case "SAVE_EDIT":
                let actedit = GameEditState.parseActionMap(message);
                //Guardamos el estado
                StoreEdit.saveState(actedit);
                //Enviamos el nuevo estado
                ws.send(JSON.stringify(StoreEdit.storeEdit.getState()));
                break;
            case "SAVE_PROFILE":
                let actprofile = GameProfileState.parseActionMap(message);
                //Guardamos el estado
                StoreProfile.saveState(actprofile);
                //Enviamos el nuevo estado
                ws.send(JSON.stringify(StoreProfile.storeProfile.getState()));
            // - Guardado del mapa
            case "saveMap":
                // Obtenemos los datos de la petición
                let map = message.map;
                // Ejecutamos el almacenado en la BD
                UtilsServer.MapsDatabase.saveMap(map, (code: { status: boolean, error: string }) => {
                    // Si hay error
                    if(status) {
                        // Entonces indicamos al receptor el guardado incorrecto del mapa
                        ws.send(JSON.stringify({
                            status: false,
                            error: "Couldn't save map. Error: "+code.error
                        }));
                    } else {
                        // En caso contrario, avisamos del guardado correcto
                        ws.send(JSON.stringify({
                            status: true,
                            error: "Saved successfully"
                        }))
                    }
                });
                break;
            case "getMap":
                // Obtenemos los datos de la petición
                let getMap = message.map;
                // Ejecutamos el almacenado en la BD
                UtilsServer.MapsDatabase.getMap(getMap, (code: { status: boolean, error: string,  map: { rows: number, columns: number,
                    terrains: {name: string, image: string, movement_penalty: number, position_row: number, position_cols: number,
                         defense_weak: number, defense_strong: number, attack_weak: number, attack_strong: number}[]} }) => {
                    // Si hay error
                    if(status) {
                        // Entonces indicamos al receptor el guardado incorrecto del mapa
                        ws.send(JSON.stringify({
                            status: false,
                            error: "Couldn't get map. Error: "+code.error,
                            map: null
                        }));
                    } else {
                        // En caso contrario, avisamos del guardado correcto
                        ws.send(JSON.stringify({
                            status: true,
                            error: "Got successfully",
                            map: code.map
                        }))
                    }
                });
                break;
            case "getMapId":
                // Ejecutamos el almacenado en la BD
                UtilsServer.MapsDatabase.getMapId((code: { status: boolean, error: string,  mapId: number[] }) => {
                    // Si hay error
                    if(status) {
                        // Entonces indicamos al receptor el guardado incorrecto del mapa
                        ws.send(JSON.stringify({
                            status: false,
                            error: "Couldn't get map. Error: "+code.error,
                            mapId: null
                        }));
                    } else {
                        // En caso contrario, avisamos del guardado correcto
                        ws.send(JSON.stringify({
                            status: true,
                            error: "Got successfully",
                            mapId: code.mapId
                        }))
                    }
                });
                break;
            default:
                console.warn("Action sent not understood! Type is "+message.type);
                ws.send("Command not understood");
        }
    });
});
