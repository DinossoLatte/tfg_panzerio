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
    public static saveMap(mapData: { rows: number, columns: number, map: any[] }, callback: (error: Error) => void) {
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
                let statement = MapsDatabase.connection.prepare("INSERT INTO map(rows, cols) VALUES ($rows, $cols)");
                // Y lo ejecutamos con los valores obtenidos del mapa
                statement.run({
                    $rows: mapData.rows, 
                    $cols: mapData.columns
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
    public static saveProfile(profile: { id: number, name: string, gamesWon: number, gamesLost: number, armies: Array<{ id: number, name: string, pair: Array<{ type: string, number: number }>}>}, callback: (statusCode: StatusCode) => void) {
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
                        "INSERT INTO profile(name, games_won, games_lost) VALUES ($name, $gamesWon, $gamesLost)");
                    // Habiendo preparado el comando, introducimos los datos
                    statement.run({
                        $name: profile.name,
                        $gamesWon: profile.gamesWon,
                        $gamesLost: profile.gamesLost
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
}
