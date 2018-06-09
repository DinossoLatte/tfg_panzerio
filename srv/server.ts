import { StringDecoder } from 'string_decoder';
import * as webSocket from 'ws';
import * as FileSystem from 'fs';
import { AnyAction } from 'redux';
import * as jwt from 'jsonwebtoken';

import * as Units from '../src/Unit';
import * as Utils from '../src/Utils';
import * as Terrains from '../src/Terrains';
import * as GameState from './GameState';
import * as GameEditState from './GameEditState';
import * as StoreEdit from './StoreEdit';
import * as GameProfileState from './GameProfileState';
import * as StoreProfile from './StoreProfile';
import * as UtilsServer from './UtilsServer';
import * as StoreMenu from './StoreMenu';

import { Actions } from '../src/GameState';
import { Pair } from './Utils';
import { Terrain } from '../src/Terrains';
import { getInitialState } from './GameState';
import { Game } from './Game';

var server = new webSocket.Server({ port: 8080 });
var games : Map<string, Game> = new Map<string, Game>();

server.on('connection', function connect(ws: webSocket) {
    // Este será el inicio del servidor, por ahora nos encargaremos de mostrarle el estado
    ws.on("close", () => {
        let gameId = null;
        for(let gameIndex in games) {
            if(games[gameIndex] && (ws == games[gameIndex].player1URL || ws == games[gameIndex].player2URL)) {
                // Encontramos el juego del que ha salido un jugador
                gameId = gameIndex;
                break;
            }
        }
        if(gameId != null) {
            if(games[gameId].player1URL == ws) {
                games[gameId].player1URL = undefined;
                if((games[gameId].player1FinishedSelection || games[gameId].player2FinishedSelection) && games[gameId].player2URL) {
                    games[gameId].player2URL.send(JSON.stringify({ status: false }));
                }
            } else {
                games[gameId].player2URL = undefined;
                if((games[gameId].player1FinishedSelection || games[gameId].player2FinishedSelection) && games[gameId].player1URL) {
                    games[gameId].player1URL.send(JSON.stringify({ status: false }));
                }
            }
        }
    })
    ws.on("message", function getInitialState(data) {
        // Dependiendo del estado, retornaremos una cosa u otra
        let message = JSON.parse(data as string);
        // Debido a la forma de compilar el programa, es necesario declarar aqui el id del mensaje, aun cuando este no deba aparecer en el mensaje.
        let gameId = message.id;
        let game;
        switch (message.tipo) {
            case "createGame":
                // Creamos la partida con la conexión entrante
                let game: Game = new Game(ws, GameState.getInitialState());
                // Importante, las posibilidades de que el Id coincida son bajas, pero
                // TODO Hacer un if para evitar sobreescribir la partida
                let id = Game.generateRandomIdentifier();
                games[id] = game;
                ws.send(JSON.stringify({
                    id: id
                }));
                break;
            case "joinGame":
                if(games[gameId]) {
                    // Primero, vemos si la sala está vacia
                    if(!games[gameId].player1URL && !games[gameId].player2URL) {
                        // En cuyo caso, el jugador actual será el primero
                        games[gameId].player1URL = ws;
                        ws.send(JSON.stringify({ status: true, id: gameId }));
                    } else {
                        // Hemos encontrado el juego, vemos si hay posición disponible
                        // Comprobamos si la partida ha finalizado
                        if(games[gameId].currentState == 2 || games[gameId].currentState == 1) {
                            // Si es el caso, avisamos que la partida está finalizada
                            ws.send(JSON.stringify({ status: false, error: "Game is over or in progress" }));
                        } else {
                            if (!games[gameId].player2URL) {
                                // Jugador actual es el jugador 2:
                                games[gameId].player2URL = ws;
                                ws.send(JSON.stringify({ status: true, id: gameId }));
                            } else {
                                // En caso contrario, avisamos de que la sala está ocupada
                                ws.send(JSON.stringify({ status: false, error: "Game is full" }));
                            }
                        }
                    }
                } else {
                    // Enviamos error
                    ws.send(JSON.stringify({ status: false, error: "Game not found" }));
                }
                break;
            case "getInitialState":
                if(gameId) {
                    var state;
                    if(games[gameId].firstPlayer == undefined) {
                        games[gameId].firstPlayer = ws;
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
                            isPlayer: true,
                            id: gameId
                        };
                    } else {
                        // Retorna el estado de la partida
                        let storeState = games[gameId].getState();
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
                            isPlayer: false,
                            id: gameId
                        };
                        games[gameId].currentState = 1; // Cambiamos el estado del juego a en progreso.
                    }
                    // Creamos la partida
                    ws.send(JSON.stringify(state));
                }

                break;
            // Este se llamará cuando se quiera sincronizar el estado del cliente con el servidor
            case "SYNC_STATE":
                // Nos aseguramos de que el estado es el final para ambos
                if(gameId) {
                    game = games[gameId];
                    if(game.player1FinishedSelection && game.player2FinishedSelection) {
                        game.player1URL.send(JSON.stringify({
                            status: true,
                            state: game.getState()
                        }));
                        game.player2URL.send(JSON.stringify({
                            status: true,
                            state: game.getState()
                        }));
                    }
                } else {
                    // En este caso, el mensaje no contiene Id, debería informarse al cliente del error.
                }
                break;
            case "SAVE_MAP":
                if(gameId) {
                    let actmap = GameState.parseActionMap(message);
                    //Guardamos el estado
                    games[gameId].store.saveState(actmap);
                    //Enviamos el nuevo estado
                    ws.send(JSON.stringify(games[gameId].getState()));
                    break;
                }
                break;
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
                UtilsServer.MapsDatabase.getMap(getMapvar, (code: { status: boolean, error: string,  map: { rows: number, columns: number, mapName: string,
                    terrains: {name: string, image: string, movement_penalty: number, position_row: number, position_cols: number,
                         defense_weak: number, defense_strong: number, attack_weak: number, attack_strong: number}[]} }) => {
                    // Si hay error
                    if(!code.status) {
                        // Entonces indicamos al receptor la obtención incorrecta del mapa
                        ws.send(JSON.stringify({
                            status: false,
                            error: "Couldn't get map. Error: "+code.error,
                            map: null
                        }));
                    } else if(gameId) {
                        // En caso contrario, avisamos de la obtención correcta
                        // Convertimos los terrenos en una interpretación válida de terrenos
                        let terrains = new Array();
                        for(let index in code.map.terrains) {
                            let terrainJson = code.map.terrains[index];
                            terrains.push(new Terrain(terrainJson.name, terrainJson.image, terrainJson.movement_penalty, new Pair(terrainJson.position_row, terrainJson.position_cols), terrainJson.defense_weak, terrainJson.defense_strong, terrainJson.attack_weak, terrainJson.attack_strong));
                        }
                        games[gameId].store.saveState({
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
                // Obtenemos los id de los mapas
                UtilsServer.MapsDatabase.getMapId(message.mapclient, (code: { status: boolean, error: string,  mapId: number[], mapName: string[] }) => {
                    // Si hay error
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
                UtilsServer.ProfileDatabase.getUnits(message.armyclient, (code: { status: boolean, error: string,  units: {type: string, number: number}[], armyId: number }) => {
                    // Si hay error
                    if(!code.status) {
                        // Entonces indicamos al receptor que se han obtenido mal
                        ws.send(JSON.stringify({
                            status: false,
                            error: "Couldn't get map. Error: "+code.error,
                            units: null,
                            armyId: null
                        }));
                    } else if(gameId) {
                        games[gameId].store.saveState({
                            type: "UPDATE_UNITS",
                            units: games[gameId].getState().units.concat(Utils.Network.parseArmy(code.units, message.side))
                        });
                        // Actualizamos el estado del jugador
                        if(message.side) {
                            games[gameId].player1FinishedSelection = true;
                        } else {
                            games[gameId].player2FinishedSelection = true;
                        }
                        // En caso contrario, avisamos de que se han obtenido correctamente
                        ws.send(JSON.stringify({
                            status: true,
                            error: "Got successfully",
                            units: code.units,
                            armyId: code.armyId
                        }));
                    } else {
                        // TODO Añadir tratamiento de no Id en el mensaje.
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
                if(gameId) {
                    if(games[gameId].player1URL == ws) {
                        // Entonces, esperamos al jugador 2
                        // Comprobamos que el usuario 2 no se haya ido de la partida
                        if(games[gameId].player2URL == undefined) {
                            games[gameId].player1URL.send(JSON.stringify({ status: false, state: games[gameId].getState() }));
                        } else {
                            // En caso contrario, esperamos al usuario 2
                            games[gameId].player2URL.send(JSON.stringify({ status: true, state: games[gameId].getState() }));
                        }
                    } else {
                        // Misma comprobación del jugador 1
                        if(games[gameId].player1URL == undefined) {
                            games[gameId].player1URL.send(JSON.stringify({ status: false, state: games[gameId].getState() }));
                        } else {
                            games[gameId].player1URL.send(JSON.stringify({ status: true, state: games[gameId].getState() }));
                        }
                    }
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
                    //Sino existe entonces se crea un nuevo perfil
                    if(statusCode.name==null){
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
                    ws.send(JSON.stringify(statusCode));
                });
                break;
            case "getProfileId":
                // Extraemos el perfil
                let getprofileid = message.profile;
                UtilsServer.ProfileDatabase.getProfileId(getprofileid, (statusCode: { status: boolean, error: string, id: number }) => {
                    // Devolveremos el contenido de la petición
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
                UtilsServer.ProfileDatabase.updateProfile(updateprofile, (statusCode: UtilsServer.StatusCode) => {
                    // Devolveremos el contenido de la petición
                    ws.send(JSON.stringify(statusCode));
                });
                break;
            case "exitPreGame":
                if(gameId) {
                    // Primero vemos quién ha enviado la salida
                    if(ws == games[gameId].player1URL) {
                        // Quitamos todo lo relacionado con este jugador
                        games[gameId].player1FinishedSelection = false;
                        games[gameId].player1URL = undefined;
                        // Reiniciamos el estado inicial
                        games[gameId].firstPlayer = games[gameId].player2URL;
                        // Si el primer jugador no ha salido de la partida, se convierte en el primer jugador
                        if(games[gameId].player2URL) {
                            games[gameId].player2URL.send(JSON.stringify({ status: false }));
                        } else {
                            // Eliminamos la partida, ya que no habrá más usuarios
                            games[gameId] = undefined;
                        }
                    } else {
                        // Igual que el caso anterior
                        games[gameId].player2FinishedSelection = false;
                        games[gameId].player2URL = undefined;
                        // Reiniciamos el estado inicial
                        games[gameId].firstPlayer = games[gameId].player1URL;
                        // Avisamos al otro usuario
                        if(games[gameId].player1URL) {
                            games[gameId].player1URL.send(JSON.stringify({ status: false }));
                        } else {
                            // Eliminamos la partida, ya que no habrá más usuarios
                            games[gameId] = undefined;
                        }
                    }
                    // Actualizamos el estado, si no hay jugadores el juego ha terminado
                    if(games[gameId]) {
                        games[gameId].currentState = 2;
                    }
                    // Y Confirmamos la realización correcta
                    ws.send(JSON.stringify({
                        status: true,
                        message: "Success"
                    }));
                }
                break;
            case "getGames":
                let result = Utils.Parsers.stringifyCyclicObject({
                    status: true,
                    games: games
                });
                // Obtenemos los juegos que estén en funcionamiento.
                ws.send(Utils.Parsers.stringifyCyclicObject({
                    status: true,
                    games: games
                }));
                break;
            case "getMapEdit":
                // Obtenemos los datos de la petición
                let getMapvarMenu = message.mapData;
                // Obtenemos el mapa
                UtilsServer.MapsDatabase.getMap(getMapvarMenu, (code: { status: boolean, error: string,  map: { rows: number, columns: number, mapName: string,
                    terrains: {name: string, image: string, movement_penalty: number, position_row: number, position_cols: number,
                         defense_weak: number, defense_strong: number, attack_weak: number, attack_strong: number}[]} }) => {
                    // Si hay error
                    if(!code.status) {
                        // Entonces indicamos al receptor la obtención incorrecta del mapa
                        ws.send(JSON.stringify({
                            status: false,
                            error: "Couldn't get map. Error: "+code.error,
                            map: null
                        }));
                    } else {
                        // En caso contrario, avisamos de la obtención correcta
                        // Convertimos los terrenos en una interpretación válida de terrenos
                        let terrains = new Array();
                        for(let index in code.map.terrains) {
                            let terrainJson = code.map.terrains[index];
                            terrains.push(new Terrain(terrainJson.name, terrainJson.image, terrainJson.movement_penalty, new Pair(terrainJson.position_row, terrainJson.position_cols), terrainJson.defense_weak, terrainJson.defense_strong, terrainJson.attack_weak, terrainJson.attack_strong));
                        }
                        StoreMenu.saveState({
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
            case "getUnitsMenu":
                // Obtenemos los id de los mapas
                UtilsServer.ProfileDatabase.getUnits(message.armyclient, (code: { status: boolean, error: string,  units: {type: string, number: number}[], armyId: number }) => {
                    // Si hay error
                    if(!code.status) {
                        // Entonces indicamos al receptor que se han obtenido mal
                        ws.send(JSON.stringify({
                            status: false,
                            error: "Couldn't get map. Error: "+code.error,
                            units: null,
                            armyId: null
                        }));
                    } else {
                        StoreMenu.saveState({
                            type: "UPDATE_UNITS",
                            units: StoreMenu.store.getState().units.concat(Utils.Network.parseArmy(code.units, message.side))
                        })
                        // En caso contrario, avisamos de que se han obtenido correctamente
                        ws.send(JSON.stringify({
                            status: true,
                            error: "Got successfully",
                            units: code.units,
                            armyId: code.armyId
                        }));
                    }
                });
                break;
            default:
                ws.send("Command not understood");
                break;
        }
    });
});
