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
import { Actions } from '../src/GameState';
import { Pair } from './Utils';
import { Terrain } from '../src/Terrains';
import { resetInitialState } from './GameState';

var server = new webSocket.Server({ port: 8080 });
var player1URL, player2URL = undefined;
var firstPlayer = undefined;
var player1FinishedSelection = false;
var player2FinishedSelection = false;

server.on('connection', function connect(ws) {
    // Este será el inicio del servidor, por ahora nos encargaremos de mostrarle el estado
    console.log("Conected with client");
    // Inicialización del servidor
    if(player1URL == undefined) {
        console.log("Conecta user 1");
        player1URL = ws;
    } else if(player2URL == undefined) {
        console.log("Conecta user 2");
        player2URL = ws;
    }
    ws.on("message", function getInitialState(data) {
        console.log("Got following action: " + data);
        // Dependiendo del estado, retornaremos una cosa u otra
        let message = JSON.parse(data as string);
        switch (message.tipo) {
            case "getInitialState":
                var state;
                console.log("Primer jugador: "+firstPlayer);
                if(firstPlayer == undefined) {
                    firstPlayer = ws;
                    // Retornaremos el estado inicial
                    state = {
                        turn: 0,
                        actualState: 0,
                        units: [],
                        visitables: null,
                        terrains: [Terrains.ImpassableMountain.create(new Utils.Pair(2, 2)), Terrains.ImpassableMountain.create(new Utils.Pair(3, 2)), Terrains.Hills.create(new Utils.Pair(2, 3)), Terrains.Forest.create(new Utils.Pair(3, 3))],
                        cursorPosition: new Utils.Pair(0, 0),
                        map: null,
                        selectedUnit: null,
                        width: 0,
                        heigth: 0,
                        type: "SET_LISTENER",
                        // Como es el primero en conectar, es el 1er jugador
                        isPlayer: true
                    };
                } else {
                    // Retorna el estado de la partida
                    let storeState = Store.store.getState();
                    state = {
                        turn: storeState.turn,
                        actualState: storeState.actualState,
                        units: storeState.units,
                        visitables: storeState.visitables,
                        terrains: storeState.terrains,
                        cursorPosition: storeState.cursorPosition,
                        map: storeState.map,
                        selectedUnit: storeState.selectedUnit,
                        width: storeState.width,
                        heigth: storeState.height,
                        type: storeState.type,
                        // Este es el segundo jugador
                        isPlayer: false
                    };
                }
                ws.send(JSON.stringify(state));
                break;
            // Este se llamará cuando se quiera sincronizar el estado del cliente con el servidor
            case "SYNC_STATE":
                // Nos aseguramos de que el estado es el final para ambos
                if(player1FinishedSelection && player2FinishedSelection) {
                    player1URL.send(JSON.stringify({
                        status: true,
                        state: Store.store.getState()
                    }));
                    player2URL.send(JSON.stringify({
                        status: true,
                        state: Store.store.getState()
                    }));
                }
                break;
            case "SAVE_MAP":
                let actmap = GameState.parseActionMap(message);
                console.dir(actmap);
                //Guardamos el estado
                Store.saveState(actmap);
                //Enviamos el nuevo estado
                ws.send(JSON.stringify(Store.store.getState()));
                break;
            /* TODO temporalmente lo quito ya que se guardará en servidor el estado, no lo veo necesario aqui
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
                break;*/
            //Borrado del mapa
            case "deleteMap":
                // Obtenemos los datos de la petición
                let delmap = message.map;
                // Ejecutamos el almacenado en la BD
                UtilsServer.MapsDatabase.deleteMap(delmap, (error: Error) => {
                    // Si hay error
                    if(error) {
                        // Entonces indicamos al receptor el borrado incorrecto del mapa
                        ws.send(JSON.stringify({
                            status: false,
                            error: "Couldn't delete map. Error: " + error.message
                        }));
                    } else {
                        // En caso contrario, avisamos del borrado correcto
                        ws.send(JSON.stringify({
                            status: true,
                            error: "Deleted successfully"
                        }))
                    }
                });
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
                let getMapvar = message.mapData;
                // Obtenemos el mapa
                console.log(JSON.stringify(getMapvar));
                UtilsServer.MapsDatabase.getMap(getMapvar, (code: { status: boolean, error: string,  map: { rows: number, columns: number, mapName: string,
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
                        console.log("Mapa: "+code.map);
                        // Convertimos los terrenos en una interpretación válida de terrenos
                        let terrains = new Array();
                        for(let index in code.map.terrains) {
                            let terrainJson = code.map.terrains[index];
                            terrains.push(new Terrain(terrainJson.name, terrainJson.image, terrainJson.movement_penalty, new Pair(terrainJson.position_row, terrainJson.position_cols), terrainJson.defense_weak, terrainJson.defense_strong, terrainJson.attack_weak, terrainJson.attack_strong));
                        }
                        Store.saveState({
                            type: "UPDATE_MAP",
                            height: code.map.rows,
                            width: code.map.columns,
                            terrains: terrains
                        });
                        ws.send(JSON.stringify({
                            status: true,
                            error: "Got successfully",
                            map: code.map
                        }))
                    }
                });
                break;
            case "getMapId":
                console.log("mapclient: "+JSON.stringify(message.mapclient));
                // Obtenemos los id de los mapas
                UtilsServer.MapsDatabase.getMapId(message.mapclient, (code: { status: boolean, error: string,  mapId: number[], mapName: string[] }) => {
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
            case "getArmyId":
                // Obtenemos los id de los mapas
                UtilsServer.ProfileDatabase.getArmyId(message.armyclient, (code: { status: boolean, error: string,  armyId: number[], armyName: string[] }) => {
                    // Si hay error
                    console.log("server: "+code.status+","+code.error+","+code.armyId);
                    if(!code.status) {
                        // Entonces indicamos al receptor que se han obtenido mal
                        ws.send(JSON.stringify({
                            status: false,
                            error: "Couldn't get map. Error: "+code.error,
                            armyId: null,
                            armyName: null
                        }));
                    } else {
                        // En caso contrario, avisamos de que se han obtenido correctamente
                        ws.send(JSON.stringify({
                            status: true,
                            error: "Got successfully",
                            armyId: code.armyId,
                            armyName: code.armyName
                        }))
                    }
                });
                break;
            case "getUnits":
                // Obtenemos los id de los mapas
                console.log("--- Valor del armyclient en servidor: "+ message.armyclient);
                UtilsServer.ProfileDatabase.getUnits(message.armyclient, (code: { status: boolean, error: string,  units: {type: string, number: number}[] }) => {
                    // Si hay error
                    console.log("server: "+code.status+","+code.error+","+code.units);
                    if(!code.status) {
                        // Entonces indicamos al receptor que se han obtenido mal
                        ws.send(JSON.stringify({
                            status: false,
                            error: "Couldn't get map. Error: "+code.error,
                            units: null
                        }));
                    } else {
                        console.dir(Utils.Network.parseArmy(code.units, message.side));
                        Store.saveState({
                            type: "UPDATE_UNITS",
                            units: Store.store.getState().units.concat(Utils.Network.parseArmy(code.units, message.side))
                        });
                        // Actualizamos el estado del jugador
                        if(message.side) {
                            player1FinishedSelection = true;
                        } else {
                            player2FinishedSelection = true;
                        }
                        // En caso contrario, avisamos de que se han obtenido correctamente
                        ws.send(JSON.stringify({
                            status: true,
                            error: "Got successfully",
                            units: code.units
                        }));
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
                // Confirma que el jugador ha terminado su turno.
                // Devolveremos el estado final, para sincronizarlo con el jugador
                // Primero, comprobamos la conexión actual
                if(player1URL == ws) {
                    // Entonces, esperamos al jugador 2
                    // Avisamoa al usuario 2
                    player2URL.send(JSON.stringify({ status: true, state: Store.store.getState() }));
                } else {
                    // Es el jugador 2, le enviamos al 1 el estado
                    player1URL.send(JSON.stringify({ status: true, state: Store.store.getState() }));
                }

                break;
            case "logIn":
                // Este caso se llamará cuando el cliente haga inicio de sesión
                // Del cliente obtendremos su ID del perfil, suficiente para identificarlo
                let token = message.token;
                // TODO NO SE VA A ELIMINAR PORQUE DEBERÍA SER NECESARIO ALGUNA FORMA DE CREAR UNA CUENTA TRAS INICIAR SESIÓN Y NO TEENER CUENTA
                let logprofile: {
                    googleId: number
                } = {
                    // Incluimos el id del usuario de Google
                    googleId: token
                };
                //Obtenemos el perfil
                UtilsServer.ProfileDatabase.getProfile(logprofile, (statusCode: { status: boolean, error: string, name: string, gamesWon: number, gamesLost: number }) => {
                    console.log("valor de error y name "+statusCode.error+", "+statusCode.name);
                    //Sino existe entonces se crea un nuevo perfil
                    if(statusCode.name==null){
                        console.log("entra en el primer if");
                        let initialprofile: {
                            id: number,
                            name: string,
                            gamesWon: number,
                            gamesLost: number,
                            armies: Array<{ id: number, name: string, pair: Array<{ type: string, number: number }> }>,
                            googleId: number
                        } = {
                            id: 0, // El id es = 0 al estar creandose el perfil
                            name: "Jugador",
                            gamesWon: 0, // El número de partidas jugadas en este momento será 0, por lo que ambas variables a 0.
                            gamesLost: 0,
                            armies: [],
                            // Incluimos el id del usuario de Google
                            googleId: token
                        };
                        UtilsServer.ProfileDatabase.saveProfile(initialprofile, (status: UtilsServer.StatusCode) => {
                            console.log("statusCode "+status.status);
                        });
                    }
                });

                ws.send(JSON.stringify({ status: true, state: "Success" }));
                break;
            case "logOut":
                // Por ahora, emitimos un OK
                ws.send(JSON.stringify({ status: true, state: "Success" }));
                break;
            case "getProfile":
                // Extraemos el perfil
                let getprofile = message.profile;
                UtilsServer.ProfileDatabase.getProfile(getprofile, (statusCode: { status: boolean, error: string, name: string, gamesWon: number, gamesLost: number }) => {
                    // Devolveremos el contenido de la petición
                    console.log("valor del name en server: "+statusCode.name);
                    ws.send(JSON.stringify(statusCode));
                });
                break;
            case "getProfileId":
                // Extraemos el perfil
                let getprofileid = message.profile;
                UtilsServer.ProfileDatabase.getProfileId(getprofileid, (statusCode: { status: boolean, error: string, id: number }) => {
                    // Devolveremos el contenido de la petición
                    console.log("valor del name en server: "+statusCode.id);
                    ws.send(JSON.stringify(statusCode));
                });
                break;
            case "saveProfileGame":
                // Extraemos el perfil
                let saveprofile = message.profile;
                UtilsServer.ProfileDatabase.saveProfileGame(saveprofile, (statusCode: UtilsServer.StatusCode) => {
                    // Devolveremos el contenido de la petición
                    ws.send(JSON.stringify(statusCode));
                });
                break;
            case "saveProfileName":
                // Extraemos el perfil
                let saveprofilename = message.profile;
                UtilsServer.ProfileDatabase.saveProfileName(saveprofilename, (statusCode: UtilsServer.StatusCode) => {
                    // Devolveremos el contenido de la petición
                    ws.send(JSON.stringify(statusCode));
                });
                break;
            case "updateProfile":
                // Extraemos el perfil
                let updateprofile = message.profile;
                console.log("llega a updateprofile");
                UtilsServer.ProfileDatabase.updateProfile(updateprofile, (statusCode: UtilsServer.StatusCode) => {
                    console.log("ejecuta el updateprofile");
                    // Devolveremos el contenido de la petición
                    ws.send(JSON.stringify(statusCode));
                });
                break;
            case "exitPreGame": 
                // Primero vemos quién ha enviado la salida
                if(ws == player1URL) {
                    // Quitamos todo lo relacionado con este jugador
                    player1FinishedSelection = false;
                    // Si el primer jugador no ha salido de la partida, se convierte en el primer jugador
                } else {
                    // Igual que el caso anterior
                    player2FinishedSelection = false;
                }
                // Reiniciamos el estado inicial
                firstPlayer = undefined;
                Store.store.dispatch({
                    type: "resetState"
                })
                // Y Confirmamos la realización correcta
                ws.send(JSON.stringify({
                    status: true,
                    message: "Success"
                }));
                break;
            default:
                console.warn("Action sent not understood! Type is " + message.tipo);
                ws.send("Command not understood");
                break;
        }
    });
});