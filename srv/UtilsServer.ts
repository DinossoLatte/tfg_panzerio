import * as sqlite from 'sqlite3';
import { Army } from '../src/Army';
import { State } from './GameState';

/// Este objeto contendrá el resultado de la petición
///
/// status: Contendrá un boolean donde si es true entonces habrá un problema, en false se ha realizado de forma correcta
/// error: Este atributo contendrá el código de error
export type StatusCode = { status: boolean, error: string };

export class MapsDatabase {
    static connection: sqlite.Database;

    /// Este método se encargará de inicializar la conexión con la BD
    public static initOrCallDatabase(callback: (err: Error) => void) {
        // Si la BD no está inicializada
        if(!MapsDatabase.connection) {
            // Ejecutamos el método de inicialización, que llamará al callback
            MapsDatabase.connection = new sqlite.Database("maps-database.sqlite", callback);
        // En el caso de que lo esté
        } else {
            // Sólamente llamaremos el callback
            callback(null);
        }
    }

    /// Esta función se encargará de guardar el mapa y los terrenos del mapa,
    /// al terminar ejecutará el callback introducido con el código.
    /// code.status indicará si ha habido un error
    /// code.error indicará el error o en su defecto, "Success"
    public static saveMap(mapData: { rows: number, columns: number, map: any[], name: string, googleId: number }, callback: (error: Error) => void) {
        // Inicializamos o no la BD
        MapsDatabase.initOrCallDatabase((err: Error) => {
            // Comprobamos el mensaje de error
            if(err) {
                // Si hay error, lo mostramos en pantalla
                console.error("Se ha producido un error intentando abrir la BD!");
                callback(err);
            } else {
                console.log(mapData);
                // Preparamos el guardado del mapa
                let statement = MapsDatabase.connection.prepare("INSERT INTO map(rows, cols, name, googleId) VALUES ($rows, $cols, $name, $googleId)");
                // Y lo ejecutamos con los valores obtenidos del mapa
                statement.run({
                    $rows: mapData.rows,
                    $cols: mapData.columns,
                    $name: mapData.name,
                    $googleId: mapData.googleId
                }, (runResult: sqlite.RunResult, error: Error) => {
                    // Comprobamos si hay error:
                    if(err) {
                        // Se ha producido un error
                        console.error("Se ha producido un error creando el mapa");
                        callback(err);
                    } else {
                        // Trás ejecutar la creación del mapa, obtenemos el último ID para poder crear los terrenos
                        MapsDatabase.connection.get("SELECT last_insert_rowid() FROM map", (err: Error, rows: any) => {
                            // Si hay error
                            if(err) {
                                console.log("Error trying to get the ID of the last map created");
                                callback(err);
                            } else {
                                // En este caso, tendremos el ID
                                let mapId = rows['last_insert_rowid()'];
                                // Primero, creamos el statement con el comando de creación del terreno
                                let statement = MapsDatabase.connection.prepare("INSERT INTO terrain(id_map, name, image, movement_penalty," +
                                     "position_row, position_cols, defense_weak, defense_strong, attack_weak, attack_strong)" +
                                     " VALUES ($id_map, $name, $image, $movement_penalty, $position_row, $position_cols,"+
                                     " $defense_weak, $defense_strong, $attack_weak, $attack_strong)");
                                // Ahora empezamos a crear los mapas
                                for(let index = 0; index < mapData.map.length; index++) {
                                    let terrain = mapData.map[index];
                                    // Por cada uno, asignamos los valores del comando antes creado y lo ejecutamos
                                    statement.run({
                                        $id_map: mapId,
                                        $name: terrain.name,
                                        $image: terrain.image,
                                        $movement_penalty: terrain.movement_penalty,
                                        $position_row: terrain.position.row,
                                        $position_cols: terrain.position.column,
                                        $defense_weak: terrain.defenseWeak,
                                        $defense_strong: terrain.defenseStrong,
                                        $attack_weak: terrain.attackWeak,
                                        $attack_strong: terrain.attackStrong
                                    });
                                }
                            }
                        });
                    }
                });
                // Indicamos que hemos terminado de añadir elementos
                statement.finalize();
            }
        });
    }

    // obtenemos el mapa
    /**/

    public static getMap(mapData: number, callback: (code: { status: boolean, error: string, map: { rows: number, columns: number, name: string,
        terrains: {name: string, image: string, movement_penalty: number, position_row: number, position_cols: number,
             defense_weak: number, defense_strong: number, attack_weak: number, attack_strong: number}[] }}) => void) {
        // Inicializamos o no la BD
        let row = 0;
        let columns = 0;
        let name = "";
        let terrains : {name: string, image: string, movement_penalty: number, position_row: number, position_cols: number,
             defense_weak: number, defense_strong: number, attack_weak: number, attack_strong: number}[] = [];
        MapsDatabase.initOrCallDatabase((err: Error) => {
            // Comprobamos el mensaje de error
            if(err) {
                // Si hay error, lo mostramos en pantalla
                console.error("Se ha producido un error intentando abrir la BD!");
                callback({ status: false, error: "Can't connect to DB", map: null });
            } else {
                MapsDatabase.connection.get("SELECT rows, cols, name FROM map where id = $mapId;", {$mapId: Number(mapData)}, (err: Error, rows: any) => {
                    // Si hay error
                    if(err) {
                        console.log("Error trying to get rows and cols");
                        callback({ status: false, error: "Error trying to get rows and cols", map: null });
                    } else {
                        // En este caso, tendremos los datos
                        console.log(JSON.stringify(mapData));
                        console.log(JSON.stringify(rows));
                        row = rows['rows'];
                        columns = rows['cols'];
                        name = rows['name'];
                        MapsDatabase.connection.each("SELECT name, image, movement_penalty, position_row, position_cols, defense_weak, defense_strong, attack_weak, attack_strong FROM terrain where id_map = $mapId;", {$mapId: mapData}, (err: Error, rows2: any) => {
                            // Si hay error
                            console.log(JSON.stringify(err));
                            if(err) {
                                console.log("Error trying to get the map");
                                callback({ status: false, error: "Error trying to get the map", map: null });
                            } else {
                                // En este caso, tendremos los datos
                                console.log("Aqui "+rows2['name']);
                                console.log(rows2['image']);
                                terrains.push({name: rows2['name'].toString(), image: rows2['image'].toString(), movement_penalty: Number(rows2['movement_penalty']), position_row: Number(rows2['position_row']),
                                    position_cols: Number(rows2['position_cols']), defense_weak: Number(rows2['defense_weak']), defense_strong: Number(rows2['defense_strong']), attack_weak: Number(rows2['attack_weak']),
                                    attack_strong: Number(rows2['attack_strong'])});
                            }
                        }, () => {
                            callback({status: true, error: "Success", map:{rows: row, columns: columns, name: name, terrains: terrains}});
                        });
                    }
                });
            }

        });
    }

    public static getMapId(mapclient: {googleId: number}, callback: (code: { status: boolean, error: string, mapId: number[], mapName: string[] }) => void) {
        // Inicializamos o no la BD
        MapsDatabase.initOrCallDatabase((err: Error) => {
            // Comprobamos el mensaje de error
            if(err) {
                // Si hay error, lo mostramos en pantalla
                console.error("Se ha producido un error intentando abrir la BD!");
                callback({ status: false, error: "Can't connect to DB", mapId: null, mapName: null });
            } else {
                var i = 0;
                let mapId : number[] = [];
                let mapName : string[] = [];
                MapsDatabase.connection.each("SELECT id, name, googleId FROM map;", (err: Error, rows: any) => {
                    // Si hay error
                    if(err) {
                        console.log("Error trying to get the ID");
                        callback({ status: false, error: "Error trying to get the ID", mapId: null, mapName: null });
                    } else {
                        // En este caso, tendremos los datos
                        if(Number(mapclient.googleId)==Number(rows['googleId'])){
                            mapId.push(Number(rows['id']));
                            mapName.push(rows['name']);
                        }
                    }
                }, () => {
			callback({ status: true, error: "Success", mapId: mapId, mapName: mapName });
		});
            }
        });
    }
}

export class ProfileDatabase {
    static connection: sqlite.Database;

    /// Usando el mismo formato que MapsDatabase, creamos la conexión o ejecutamos directamente el callback en el caso de existir
    public static initOrCallDatabase(callback: (err: Error) => void) {
        if(!ProfileDatabase.connection) {
            ProfileDatabase.connection = new sqlite.Database("profile-database.sqlite", callback);
        } else {
            callback(null);
        }
    }

    public static deleteArmy(userId: number, callback: (code: { status: boolean, error: string }) => void) {
        // Inicializamos o no la BD
        ProfileDatabase.initOrCallDatabase((err: Error) => {
            // Comprobamos el mensaje de error
            if(err) {
                // Si hay error, lo mostramos en pantalla
                console.error("Se ha producido un error intentando abrir la BD!");
                callback({ status: false, error: "Can't connect to DB" });
            } else {
                var i = 0;
                console.log("valor del armyclient: "+userId);
                let result = { status: true, error: "Success" };
                ProfileDatabase.connection.serialize(() => {
                    // Iniciamos el statement con los datos del perfil
                    let statement = ProfileDatabase.connection.prepare(
                        "DELETE FROM army WHERE id_profile = $userId;");
                    // Habiendo preparado el comando, introducimos los datos
                    statement.run({
                        $userId: userId
                    }, (runResult: sqlite.RunResult, error: Error) => {
                        console.log(error);
                        // Comprobamos si hay error
                        if(err) {
                            // En el caso de que haya, cambiamos result
                            result = { status: false, error: err.message };
                        }
                        // En cualquier otro caso, no hacemos nada al guardarse correctamente el contenido
                        // Una vez terminada la ejecución, avisamos al callback
                        callback(result);
                    });
                });
            }
        });
    }

    public static getArmyId(armyclient: {userId: number}, callback: (code: { status: boolean, error: string, armyId: number[], armyName: string[] }) => void) {
        // Inicializamos o no la BD
        ProfileDatabase.initOrCallDatabase((err: Error) => {
            // Comprobamos el mensaje de error
            if(err) {
                // Si hay error, lo mostramos en pantalla
                console.error("Se ha producido un error intentando abrir la BD!");
                callback({ status: false, error: "Can't connect to DB", armyId: null, armyName: null });
            } else {
                var i = 0;
                let armyId : number[] = [];
                let armyName : string[] = [];
                console.log("valor del armyclient: "+armyclient.userId);
                ProfileDatabase.connection.each("SELECT id, name FROM army WHERE id_profile = $userId", {$userId: armyclient.userId}, (err: Error, rows: any) => {
                    // Si hay error
                    if(err) {
                        console.log("Error trying to get the ID");
                        callback({ status: false, error: "Error trying to get the ID", armyId: null, armyName: null });
                    } else {
                        // En este caso, tendremos los datos
                        armyId.push(Number(rows['id']));
                        armyName.push(rows['name']);
                    }
                }, () => {
			callback({ status: true, error: "Success", armyId: armyId, armyName: armyName });
		});103227525887982030000
            }
        });
    }

    public static getUnits(armyId: number, callback: (code: { status: boolean, error: string, units: {type: string, number: number}[] }) => void) {
        // Inicializamos o no la BD
        ProfileDatabase.initOrCallDatabase((err: Error) => {
            // Comprobamos el mensaje de error
            if(err) {
                // Si hay error, lo mostramos en pantalla
                console.error("Se ha producido un error intentando abrir la BD!");
                callback({ status: false, error: "Can't connect to DB", units: null });
            } else {
                var i = 0;
                let units : {type: string, number: number}[] = [];
                console.log("valor del armyclient: "+armyId);
                ProfileDatabase.connection.each("SELECT type, number FROM unit_pair WHERE id_army = $armyId", {$armyId: armyId}, (err: Error, rows: any) => {
                    // Si hay error
                    if(err) {
                        console.log("Error trying to get the ID");
                        callback({ status: false, error: "Error trying to get the ID", units: null });
                    } else {
                        // En este caso, tendremos los datos
                        units.push({type: rows['type'].toString(), number: Number(rows['number'])});
                    }
                }, () => {
			callback({ status: true, error: "Success", units: units });
		});
            }
        });
    }

    public static getProfileId(profile: {googleId: number}, callback: (code: { status: boolean, error: string, id: number }) => void) {
        // Inicializamos o no la BD
        ProfileDatabase.initOrCallDatabase((err: Error) => {
            // Comprobamos el mensaje de error
            if(err) {
                // Si hay error, lo mostramos en pantalla
                console.error("Se ha producido un error intentando abrir la BD!");
                callback({ status: false, error: "Can't connect to DB", id: null });
            } else {
                let id: number = null;
                console.log("antes de la query");
                //ProfileDatabase.connection.get("SELECT name, games_won, games_lost FROM profile WHERE googleId = '$googleId';", {$googleId: profile.googleId}, (err: Error, rows: any) => {
                ProfileDatabase.connection.each("SELECT id, googleId FROM profile;", (err: Error, rows: any) => {
                    // Si hay error
                    if(err) {
                        console.log("Error trying to get the ID");
                        callback({ status: false, error: "Error trying to get the ID", id: null });
                    } else {
                        // En este caso, tendremos los datos
                        console.log("valor 1 = "+Number(rows['googleId'])+" , valor 2 = "+profile.googleId);
                        if(Number(rows['googleId'])==Number(profile.googleId)){
                            console.log("entra en este if");
                            id = Number(rows['id']);
                        }
                    }
                }, () => {
                        console.log("valor del id en el callback profileId "+id);
			            callback({ status: true, error: "Success", id: id });
		        });
            }
        });
    }

    public static getProfile(profile: {googleId: number}, callback: (code: { status: boolean, error: string, name: string, gamesWon: number, gamesLost: number }) => void) {
        // Inicializamos o no la BD
        ProfileDatabase.initOrCallDatabase((err: Error) => {
            // Comprobamos el mensaje de error
            if(err) {
                // Si hay error, lo mostramos en pantalla
                console.error("Se ha producido un error intentando abrir la BD!");
                callback({ status: false, error: "Can't connect to DB", name: null, gamesWon: null, gamesLost: null });
            } else {
                let name : string = null;
                let gamesWon : number = null;
                let gamesLost : number = null;
                console.log("antes de la query");
                //ProfileDatabase.connection.get("SELECT name, games_won, games_lost FROM profile WHERE googleId = '$googleId';", {$googleId: profile.googleId}, (err: Error, rows: any) => {
                ProfileDatabase.connection.each("SELECT name, games_won, games_lost, googleId FROM profile;", (err: Error, rows: any) => {
                    // Si hay error
                    if(err) {
                        console.log("Error trying to get the ID");
                        callback({ status: false, error: "Error trying to get the ID", name: null, gamesWon: null, gamesLost: null });
                    } else {
                        // En este caso, tendremos los datos
                        console.log("valor 1 = "+Number(rows['googleId'])+" , valor 2 = "+profile.googleId);
                        if(Number(rows['googleId'])==Number(profile.googleId)){
                            console.log("entra en este if");
                            name = rows['name'].toString();
                            gamesWon = Number(rows['games_won']);
                            gamesLost = Number(rows['games_lost']);
                        }
                    }
                }, () => {
                        console.log("valor del  en el callback "+name);
			            callback({ status: true, error: "Success", name: name, gamesWon: gamesWon, gamesLost: gamesLost });
		        });
            }
        });
    }

    //TODO tampoco funciona por la misma razón del método anterior ya que no filtra correctamente por googleId, en caso de que no funcionara se podría hacer
    //un bucle recorriendo para obtener todos los id y con un if se obtiene el id que corresponde a la fila del usuario y editar los valores de ese id,
    //ya que no debería haber problemas raros con el where indicando a un id ya que se ha hecho muchas veces
    public static saveProfileGame(profile: { gamesWon: number, gamesLost: number, googleId: number}, callback: (statusCode: StatusCode) => void) {
        // Definimos el resultado de la transacción
        let result = { status: true, error: "Success" };
        // Primero, establecemos la conexión con la BD
        ProfileDatabase.initOrCallDatabase((err: Error) => {
            // En el caso de existir un error, lo interpretamos
            if(err) {
                // Retornamos un código de error para el callback
                result = { status: false, error: "Couldn't establish connection with DB" };
            } else {
                // En el caso de poder establecer la conexión, primero insertamos el perfil del usuario
                // Iniciamos el bloque serializado
                ProfileDatabase.connection.serialize(() => {
                    // Iniciamos el statement con los datos del perfil
                    let statement = ProfileDatabase.connection.prepare(
                        "UPDATE profile SET games_won = $gamesWon, games_lost = $gamesLost WHERE googleId = $googleId;");
                    // Habiendo preparado el comando, introducimos los datos
                    statement.run({
                        $gamesWon: profile.gamesWon,
                        $gamesLost: profile.gamesLost,
                        $googleId: profile.googleId
                    }, (runResult: sqlite.RunResult, error: Error) => {
                        console.log(error);
                        // Comprobamos si hay error
                        if(err) {
                            // En el caso de que haya, cambiamos result
                            result = { status: false, error: err.message };
                        }
                        // En cualquier otro caso, no hacemos nada al guardarse correctamente el contenido
                        // Una vez terminada la ejecución, avisamos al callback
                        callback(result);
                    });
                });
            }
        });
    }

    //Este método sirve para actualizar el nombre del jugador
    public static saveProfileName(profile: { name: number, googleId: number }, callback: (statusCode: StatusCode) => void) {
        // Definimos el resultado de la transacción
        let result = { status: true, error: "Success" };
        // Primero, establecemos la conexión con la BD
        ProfileDatabase.initOrCallDatabase((err: Error) => {
            // En el caso de existir un error, lo interpretamos
            if(err) {
                // Retornamos un código de error para el callback
                result = { status: false, error: "Couldn't establish connection with DB" };
            } else {
                // En el caso de poder establecer la conexión, primero insertamos el perfil del usuario
                // Iniciamos el bloque serializado
                ProfileDatabase.connection.serialize(() => {
                    // Iniciamos el statement con los datos del perfil
                    let statement = ProfileDatabase.connection.prepare(
                        "UPDATE profile SET name = $name WHERE googleId = $googleId;");
                    // Habiendo preparado el comando, introducimos los datos
                    statement.run({
                        $name: profile.name,
                        $googleId: profile.googleId
                    }, (runResult: sqlite.RunResult, error: Error) => {
                        console.log(error);
                        // Comprobamos si hay error
                        if(err) {
                            // En el caso de que haya, cambiamos result
                            result = { status: false, error: err.message };
                        }
                        // En cualquier otro caso, no hacemos nada al guardarse correctamente el contenido
                        // Una vez terminada la ejecución, avisamos al callback
                        callback(result);
                    });
                });
            }
        });
    }

    public static savePair(idArmy: number, pair: { type: string, number: number }, callback: (statusCode: StatusCode) => void) {
        let result = { status: false, error: "Success" };
        // Igual que el resto de llamadas, obtenemos la conexión con BD
        ProfileDatabase.initOrCallDatabase((err: Error) => {
            // Comprobamos el resultado
            if (err) {
                // Si hay error, avisaremos
                result = { status: false, error: "Could not connect to BD" };
            } else {
                // Si no, entonces iniciamos el guardado
                // Pedimos la ejecución en serie de los comandos
                ProfileDatabase.connection.serialize(() => {
                    // Creamos el statement
                    let statement = ProfileDatabase.connection.prepare("INSERT INTO unit_pair(id_army, type, number) VALUES($idArmy, $type, $number)");
                    // Asignamos los valores
                    statement.run({
                        $idArmy: idArmy,
                        $type: pair.type,
                        $number: pair.number
                    }, (runResult: sqlite.RunResult, error: Error) => {
                        console.log(error);
                        // Comprobamos si hay error
                        if(err) {
                            // En el caso de que haya, cambiamos result
                            result = { status: false, error: err.message };
                        }
                        // En cualquier otro caso, no hacemos nada al guardarse correctamente el contenido
                        // Una vez terminada la ejecución, avisamos al callback
                        callback(result);
                    });
                });
            }
        });
    }

    public static saveArmy(idProfile: number, army: { id: number, name: string, pair: Array<{ type: string, number: number }> }, callback: (statusCode: StatusCode) => void, transactional?: boolean) {
        let result = { status: true, error: "Success" };
        // Ante todo, ver si la BD está establecida:
        ProfileDatabase.initOrCallDatabase((err: Error) => {
            if(err) {
                result = { status: false, error: "Could not connect to the DB" };
            } else {
                // Serializamos los comandos a ejecutar, evitando así tener que usar los callbacks
                ProfileDatabase.connection.serialize(() => {
                    // Comprobamos si se necesita realizar la operación de forma transaccional
                    if(transactional) {
                        // Iniciamos la transacción
                        ProfileDatabase.connection.run("BEGIN TRANSACTION");
                    }
                    // Si creamos, pues ejecutamos el comando para crear el ejército
                    let statement = ProfileDatabase.connection.run("INSERT INTO army(id_profile, name) VALUES($idProfile, $name)", {
                            $idProfile: idProfile,
                            $name: army.name
                    }, (runResult: sqlite.RunResult, err: Error) => {
                        // Comprobamos si hay error
                        if(err) {
                            // Si es el caso, indicaremos en el result la causa
                            result = { status: false, error: err.message };
                        }
                    });
                    // Obtenemos el id del ejército creado:
                    ProfileDatabase.connection.get("SELECT last_insert_rowid() FROM army", (runResult: sqlite.RunResult, armyId: number, err: Error) => {
                        console.log(armyId);
                        if(err) {
                            // Cambiamos el resultado
                            result = { status: false, error: err.message };
                        } else {
                            // Teniendolo, podemos crear las diferentes unidades del ejército
                            for (let index = 0; index < army.pair.length; index++) {
                                // Obtenemos el par
                                let pair = army.pair[index];
                                // Y realizamos el guardado del par
                                ProfileDatabase.savePair(armyId['last_insert_rowid()'], pair, (statusCode: StatusCode) => {
                                    // Comprobamos si hay error
                                    if (err) {
                                        // Si hay, emitiremos el error
                                        result = { status: false, error: err.message };
                                    }
                                });
                            }
                        }
                    });

                    if(transactional) {
                        // Finalmente, cerramos la transacción y veremos qué ha pasado
                        ProfileDatabase.connection.run("END TRANSACTION", (runResult: sqlite.RunResult, err: Error) => {
                            // Si ha habido un error
                            if(err) {
                                // Indicamos en result el resultado
                                result = { status: false, error: err.message };
                            }
                            // Finalmente, ejecutamos el callback con lo que tenga result
                            callback(result);
                        });
                    } else {
                        // Llamamos manualmente a callback
                        callback(result);
                    }
                });
            }
        });
    }

    /// Este método se encargará de guardar el perfil en la BD.
    /// ATENCIÓN: ¡Este método sólo se realizará de forma transaccional!
    public static saveProfile(profile: { id: number, name: string, gamesWon: number, gamesLost: number, armies: Array<{ id: number, name: string, pair: Array<{ type: string, number: number }>}>, googleId: number}, callback: (statusCode: StatusCode) => void) {
        // Definimos el resultado de la transacción
        let result = { status: true, error: "Success" };
        // Primero, establecemos la conexión con la BD
        ProfileDatabase.initOrCallDatabase((err: Error) => {
            // En el caso de existir un error, lo interpretamos
            if(err) {
                // Retornamos un código de error para el callback
                result = { status: false, error: "Couldn't establish connection with DB" };
            } else {
                // En el caso de poder establecer la conexión, primero insertamos el perfil del usuario
                // Iniciamos el bloque serializado
                ProfileDatabase.connection.serialize(() => {
                    // Iniciamos la transacción
                    ProfileDatabase.connection.run("BEGIN TRANSACTION");
                    // Iniciamos el statement con los datos del perfil
                    let statement = ProfileDatabase.connection.prepare(
                        "INSERT INTO profile(name, games_won, games_lost, googleId) VALUES ($name, $gamesWon, $gamesLost, $googleId)");
                    // Habiendo preparado el comando, introducimos los datos
                    statement.run({
                        $name: profile.name,
                        $gamesWon: profile.gamesWon,
                        $gamesLost: profile.gamesLost,
                        $googleId: profile.googleId
                    });
                    // Ahora, para crear los objetos hijos, necesitamos obtener el id del perfil creado
                    ProfileDatabase.connection.get("SELECT last_insert_rowid() FROM profile", (stmt: sqlite.Statement, row: any, err: Error) => {
                        // Comprobamos el error
                        if (err) {
                            result = { status: false, error: err.message };
                        } else {
                            // Teniendo el id, podremos crear los ejércitos del perfil
                            let profileIndex = row['last_insert_rowid()'] as number;
                            for (let armyIndex = 0; armyIndex < profile.armies.length; armyIndex++) {
                                // Obtenemos el ejército
                                let army = profile.armies[armyIndex];
                                // Y lo guardamos
                                ProfileDatabase.saveArmy(profileIndex, army, (statusCode: StatusCode) => {
                                    // En el caso de encontrar un problema, cambiaremos result
                                    if (statusCode.status) {
                                        result = statusCode;
                                    }
                                });
                            }
                            // Una vez se termine la operación, emitiremos un mensaje de éxito
                        }
                    });
                    // Finalmente, cerramos la transacción
                    ProfileDatabase.connection.run("END TRANSACTION", (runResult: sqlite.RunResult, err: Error) => {
                        if(err) {
                            // De nuevo, cambiamos el result
                            result = { status: false, error: err.message };
                        }
                        // y en ambos casos, llamaremos a callback
                        callback(result);
                    });
                });
            }
        });
    }

    public static updateProfile(profile: { armies: Array<{ id: number, name: string, pair: Array<{ type: string, number: number }>}>, googleId: number}, callback: (statusCode: StatusCode) => void) {
        // Definimos el resultado de la transacción
        let result = { status: true, error: "Success" };
        // Primero, establecemos la conexión con la BD
        ProfileDatabase.initOrCallDatabase((err: Error) => {
            // En el caso de existir un error, lo interpretamos
            if(err) {
                // Retornamos un código de error para el callback
                result = { status: false, error: "Couldn't establish connection with DB" };
            } else {
                // En el caso de poder establecer la conexión, primero insertamos el perfil del usuario
                // Iniciamos el bloque serializado
                console.log("no hay primer error en updateProfile");
                ProfileDatabase.connection.serialize(() => {
                    // Iniciamos la transacción
                    ProfileDatabase.connection.run("BEGIN TRANSACTION");
                    // Ahora, para crear los objetos hijos, necesitamos obtener el id del perfil
                    ProfileDatabase.connection.each("SELECT id, googleId FROM profile", (stmt: sqlite.Statement, row: any, err: Error) => {
                        // Comprobamos el error
                        if (err) {
                            result = { status: false, error: err.message };
                        } else {
                            if(Number(profile.googleId)==Number(row['googleId'])){
                                console.log("entra en el if de googleid");
                                // Teniendo el id, podremos crear los ejércitos del perfil
                                let profileIndex = row['id'] as number;
                                for (let armyIndex = 0; armyIndex < profile.armies.length; armyIndex++) {
                                    // Obtenemos el ejército
                                    let army = profile.armies[armyIndex];
                                    // Y lo guardamos
                                    ProfileDatabase.deleteArmy(profileIndex,(statusCode: StatusCode) => {
                                        // En el caso de encontrar un problema, cambiaremos result
                                        if (statusCode.status) {
                                            console.log("Hay fallo "+statusCode);
                                            result = statusCode;
                                        }else{
                                            console.log("Entra en el else");
                                            ProfileDatabase.saveArmy(profileIndex, army, (statusCode: StatusCode) => {
                                                // En el caso de encontrar un problema, cambiaremos result
                                                if (statusCode.status) {
                                                    result = statusCode;
                                                }
                                            });
                                        }
                                    });
                                }
                                // Una vez se termine la operación, emitiremos un mensaje de éxito
                            }
                        }
                    });
                    // Finalmente, cerramos la transacción
                    ProfileDatabase.connection.run("END TRANSACTION", (runResult: sqlite.RunResult, err: Error) => {
                        if(err) {
                            // De nuevo, cambiamos el result
                            result = { status: false, error: err.message };
                        }
                        // y en ambos casos, llamaremos a callback
                        callback(result);
                    });
                });
            }
        });
    }


}
