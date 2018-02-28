import { StringDecoder } from 'string_decoder';
import * as webSocket from 'ws';
import * as FileSystem from 'fs';
import { AnyAction } from 'redux';
import * as jwt from 'jsonwebtoken';

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
        console.log("Got following action: " + data);
        // Dependiendo del estado, retornaremos una cosa u otra
        let message = JSON.parse(data as string);
        switch (message.tipo) {
            case "getInitialState":
                // Retornaremos el estado inicial
                var state = {
                    turn: 0,
                    actualState: 0,
                    units: [],
                    visitables: null,
                    terrains: [Terrains.ImpassableMountain.create(new Utils.Pair(2, 2)), Terrains.ImpassableMountain.create(new Utils.Pair(3, 2)), Terrains.Hills.create(new Utils.Pair(2, 3)), Terrains.Forest.create(new Utils.Pair(3, 3))],
                    cursorPosition: new Utils.Pair(0, 0),
                    map: null,
                    selectedUnit: null,
                    type: "SET_LISTENER"
                };
                ws.send(JSON.stringify(state));
                break;
            // Este se llamará cuando se quiera sincronizar el estado del cliente con el servidor
            case "SYNC_STATE":
                // Asumimos que lo que nos venga del cliente es correcto, sustituimos el estado
                Store.saveState({
                    type: "SYNC_STATE",
                    state: message.state
                });
                ws.send(JSON.stringify({
                    status: true,
                    state: Store.store.getState()
                }))
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
                break;
            // - Guardado del mapa
            case "saveMap":
                // Obtenemos los datos de la petición
                let map = message.map;
                // Ejecutamos el almacenado en la BD
                UtilsServer.MapsDatabase.saveMap(map, (error: Error) => {
                    // Si hay error
                    if(error) {
                        // Entonces indicamos al receptor el guardado incorrecto del mapa
                        ws.send(JSON.stringify({
                            status: false,
                            error: "Couldn't save map. Error: " + error.message
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
                let getMapvar = message.map;
                // Obtenemos el mapa
                console.log(JSON.stringify(getMapvar));
                UtilsServer.MapsDatabase.getMap(Number(getMapvar), (code: { status: boolean, error: string,  map: { rows: number, columns: number, name: string,
                    terrains: {name: string, image: string, movement_penalty: number, position_row: number, position_cols: number,
                         defense_weak: number, defense_strong: number, attack_weak: number, attack_strong: number}[]} }) => {
                    // Si hay error
                    console.log("server: "+code.status+","+code.error+","+JSON.stringify(code.map));
                    if(!code.status) {
                        // Entonces indicamos al receptor la obtención incorrecta del mapa
                        ws.send(JSON.stringify({
                            status: false,
                            error: "Couldn't get map. Error: "+code.error,
                            map: null
                        }));
                    } else {
                        // En caso contrario, avisamos de la obtención correcta
                        ws.send(JSON.stringify({
                            status: true,
                            error: "Got successfully",
                            map: code.map
                        }))
                    }
                });
                break;
            case "getMapId":
                // Obtenemos los id de los mapas
                UtilsServer.MapsDatabase.getMapId((code: { status: boolean, error: string,  mapId: number[], mapName: string[] }) => {
                    // Si hay error
                    console.log("server: "+code.status+","+code.error+","+code.mapId);
                    if(!code.status) {
                        // Entonces indicamos al receptor que se han obtenido mal
                        ws.send(JSON.stringify({
                            status: false,
                            error: "Couldn't get map. Error: "+code.error,
                            mapId: null,
                            mapName: null
                        }));
                    } else {
                        // En caso contrario, avisamos de que se han obtenido correctamente
                        ws.send(JSON.stringify({
                            status: true,
                            error: "Got successfully",
                            mapId: code.mapId,
                            mapName: code.mapName
                        }))
                    }
                });
                break;
            case "saveProfile":
                // Extraemos el perfil
                let profile = message.profile;
                UtilsServer.ProfileDatabase.saveProfile(profile, (statusCode: UtilsServer.StatusCode) => {
                    // Devolveremos el contenido de la petición
                    ws.send(JSON.stringify(statusCode));
                });
                break;
            case "waitTurn":
                // En este caso, se espera a que el servidor realice el cambio en el estado, que lo haría el otro jugador
                // Primero, comprobamos que estemos en la fase de pre juego
                if(Store.store.getState().turn <= 2) {
                    // Si es el caso, tenemos que posicionar nuestras unidades
                    Store.saveState({
                        type: "CHANGE_UNIT_POS",
                        unit_id: 3,
                        new_position: { row: 1, column: 4 },
                        selectedUnit: null,
                        player: false
                    });
                    Store.saveState({
                        type: "CHANGE_UNIT_POS",
                        unit_id: 4,
                        new_position: { row: 0, column: 3 },
                        selectedUnit: null,
                        player: false
                    });
                    Store.saveState({
                        type: "CHANGE_UNIT_POS",
                        unit_id: 5,
                        new_position: { row: 1, column: 3 },
                        selectedUnit: null,
                        player: false
                    });
                }
                // En cualquiera de los casos, saltaremos el turno del jugador enemigo
                Store.saveState({ type: "NEXT_TURN" });
                // Devolveremos el estado resultante, para sincronizarlo con el jugador
                ws.send(JSON.stringify({ status: true, state: Store.store.getState() }));
                break;   
            case "logIn":
                // Este caso se llamará cuando el cliente haga inicio de sesión
                // Primero, obtenemos el token de inicio de sesión, un JWK
                let token = message.token;
                // Llamamos a la obtención del clientId
                let decoded = jwt.decode(token);
                console.log(decoded);
            default:
                console.warn("Action sent not understood! Type is " + message.tipo);
                ws.send("Command not understood");
                break;
        }
    });
});
