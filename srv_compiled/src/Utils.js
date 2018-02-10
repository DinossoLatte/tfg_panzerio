"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var Unit_1 = require("./Unit");
var Store_1 = require("./Store");
var Terrains_1 = require("./Terrains");
var Army_1 = require("./Army");

var Pair = function () {
    function Pair(x, y) {
        var _this = this;

        _classCallCheck(this, Pair);

        this.toString = function () {
            return "(" + _this.row + ", " + _this.column + ")";
        };
        this.row = x;
        this.column = y;
    }

    _createClass(Pair, [{
        key: "getColumn",
        value: function getColumn() {
            return this.column;
        }
    }, {
        key: "getRow",
        value: function getRow() {
            return this.row;
        }
    }, {
        key: "setColumn",
        value: function setColumn(x) {
            this.column = x;
        }
    }, {
        key: "setRow",
        value: function setRow(y) {
            this.row = y;
        }
    }, {
        key: "add",
        value: function add(pair) {
            var new_pair = new Pair(0, 0);
            new_pair.row = this.row + pair.row;
            new_pair.column = this.column + pair.column;
            return new_pair;
        }
    }, {
        key: "equals",
        value: function equals(pair) {
            return this.row == pair.row && this.column == pair.column;
        }
    }]);

    return Pair;
}();

exports.Pair = Pair;
/* Representación cúbica del hexágono */

var Cubic = function () {
    function Cubic(x, y, z) {
        var _this2 = this;

        _classCallCheck(this, Cubic);

        this.toString = function () {
            return "(" + _this2.x + ", " + _this2.y + ", " + _this2.z + ")";
        };
        this.x = x;
        this.y = y;
        this.z = z;
    }

    _createClass(Cubic, [{
        key: "distanceTo",

        /* Calcula la distancia Manhattan */
        value: function distanceTo(cubic) {
            return Math.max(Math.abs(this.x - cubic.x), Math.abs(this.y - cubic.y), Math.abs(this.z - cubic.z));
        }
    }, {
        key: "getPair",
        value: function getPair() {
            return new Pair(this.z + (this.x - (this.x & 1)) / 2, this.x);
        }
    }, {
        key: "getX",
        value: function getX() {
            return this.x;
        }
    }, {
        key: "getY",
        value: function getY() {
            return this.y;
        }
    }, {
        key: "getZ",
        value: function getZ() {
            return this.z;
        }
    }, {
        key: "add",
        value: function add(cubic) {
            var new_cubic = Object.create(this);
            new_cubic.sum(cubic);
            return new_cubic;
        }
    }, {
        key: "sum",
        value: function sum(cubic) {
            this.x = this.x + cubic.getX();
            this.y = this.y + cubic.getY();
            this.z = this.z + cubic.getZ();
        }
    }], [{
        key: "create",
        value: function create(pair) {
            var cubic = new Cubic(0, 0, 0);
            cubic.x = pair.column;
            cubic.z = pair.row - (pair.column - (pair.column & 1)) / 2;
            cubic.y = -cubic.x - cubic.z;
            return cubic;
        }
    }]);

    return Cubic;
}();

exports.Cubic = Cubic;
exports.CUBIC_DIRECTIONS = [new Cubic(0, 1, -1), new Cubic(1, 0, -1), new Cubic(1, -1, 0), new Cubic(0, -1, 1), new Cubic(-1, 0, 1), new Cubic(-1, 1, 0)];
//Debido a que indexOf de los array iguala con ===, no es posible saber si un objeto está dentro de un array sino es identicamente el mismo objeto
//por eso se ha creado este método auxiliar para ayudar al cálculo
function myIndexOf(arr, o) {
    if (arr != null && arr != undefined) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].column == o.column && arr[i].row == o.row) {
                return i;
            }
        }
    }
    return -1;
}
exports.myIndexOf = myIndexOf;
//Igual que el de arriba pero para cúbica
function myIndexOfCubic(arr, o) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].getX() == o.getX() && arr[i].getY() == o.getY() && arr[i].getZ() == o.getZ()) {
            return i;
        }
    }
    return -1;
}
exports.myIndexOfCubic = myIndexOfCubic;
// Esta clase contendrá funciones relacionadas con el Pathfinding y encontrar si una unidad tiene acceso a cierta casilla o unidad

var Pathfinding = function () {
    function Pathfinding() {
        _classCallCheck(this, Pathfinding);
    }

    _createClass(Pathfinding, null, [{
        key: "getAttackableUnits",
        value: function getAttackableUnits(unit) {
            // Primero, necesitamos encontrar las casillas de las unidades enemigas
            var enemyUnitsPos = Store_1.store.getState().units.filter(function (x) {
                return x.player != unit.player;
            }).map(function (x) {
                return x.position;
            });
            var enemyUnitsReachable = [];
            // Ahora, realizaremos una iteración igual que el proceso de obtener las posiciones accesibles por la unidad.
            var visitables_cubic = [Cubic.create(unit.position)];
            // Los vecinos estarán compuestos por la posición cúbica y el número de movimientos para pasar la posición
            var neighbours = new Array();
            for (var i = 0; i < unit.range; i++) {
                // Calculamos los próximos vecinos:
                var new_neighbours = [];
                visitables_cubic = visitables_cubic.concat(neighbours);
                for (var index_directions = 0; index_directions < exports.CUBIC_DIRECTIONS.length; index_directions++) {
                    visitables_cubic.forEach(function (cubic) {
                        var new_cubic = cubic.add(exports.CUBIC_DIRECTIONS[index_directions]);
                        // Mientras la casilla actual no sea ya visitada o esté contenida en los vecinos anteriores
                        if (myIndexOfCubic(visitables_cubic, new_cubic) == -1 && myIndexOfCubic(neighbours, new_cubic) == -1) {
                            // En el caso de que no sea ninguno de los anteriores, la añadiremos a los visitados
                            new_neighbours.push(new_cubic);
                            // Y comprobamos que exista una unidad enemiga en esa posición
                            var index = myIndexOf(enemyUnitsPos, new_cubic.getPair());
                            //Si es artilleria y es cuerpo a cuerpo (i==0) entonces no se usa
                            if (index > -1 && !(unit.name == "Artillery" && i == 0)) {
                                // En el caso de exista, la añadimos a los alcanzables
                                enemyUnitsReachable.push(enemyUnitsPos[index]);
                            }
                        }
                    });
                    neighbours = new_neighbours;
                }
            }
            return enemyUnitsReachable;
        }
        // Este método calcula las posiciones movibles de la unidad introducida. Alto coste computacional

    }, {
        key: "getMovableCells",
        value: function getMovableCells(state, unit_id, unit_player) {
            // Iniciamos las casillas visitables por la posición actual de la unidad
            var visitables_cubic = [Cubic.create(state.units[unit_id].position)];
            // Obtenemos también el movimiento de la unidad, que delimita el número de iteraciones.
            var movements = state.units[unit_id].movement;
            // Los vecinos estarán compuestos por la posición cúbica y el número de movimientos para pasar la posición
            var neighbours = new Array();
            // En esta variable se guardarán las posiciones de las unidades atacables, que deben separarse porque no se pueden considerar como atravesables.
            var enemyUnits = new Array();
            // Primero, iteraremos desde 0 hasta el número de movimientos
            for (var i = 0; i <= movements; i++) {
                // Calculamos los próximos vecinos:
                var new_neighbours = [];
                // Añadimos los vecinos anteriores que sean alcanzables a la lista de casillas visitables.
                visitables_cubic = visitables_cubic.concat(neighbours.filter(function (possible_tuple) {
                    return possible_tuple[1] == 0;
                }).map(function (x) {
                    return x[0];
                }));
                // Para cada una de las direcciones posibles
                for (var index_directions = 0; index_directions < exports.CUBIC_DIRECTIONS.length; index_directions++) {
                    // Por cada casilla visitable
                    visitables_cubic.forEach(function (cubic) {
                        // Obtenemos la nueva casilla a visitar
                        var new_cubic = cubic.add(exports.CUBIC_DIRECTIONS[index_directions]);
                        // Siempre que la nueva casilla no esté en la lista de visitables ni sea una posición no alcanzable.
                        if (myIndexOfCubic(visitables_cubic, new_cubic) == -1) {
                            var indexOfNeighbours = myIndexOfCubic(neighbours.map(function (x) {
                                return x[0];
                            }), new_cubic);
                            // Para añadir la posición, comprobamos primero que no esté la posición:
                            if (indexOfNeighbours == -1) {
                                // Si es el caso, debemos comprobar que la posición no esté ocupada por una de las unidades del jugador
                                var positionIndex = state.units.filter(function (x) {
                                    return x.player == unit_player;
                                }) // Si debe estar ocupada por una unidad, que sea únicamente la enemigas
                                .map(function (y) {
                                    return y.position;
                                });
                                if (myIndexOf(positionIndex, new_cubic.getPair()) == -1) {
                                    // Primero, comprobamos que se trate de una unidad enemiga, simplemente comprobando si está en la lista es suficiente
                                    var indexUnit = myIndexOf(state.units.map(function (x) {
                                        return x.position;
                                    }), new_cubic.getPair());
                                    // En el caso en el que esté, la añadimos a la lista de atacables y acabamos
                                    if (indexUnit != -1) {
                                        // Añadimos a lista de atacables, sólo si no está en la lista y ésta iteración es el alcance del ataque más uno.
                                        myIndexOfCubic(enemyUnits, new_cubic) == -1 && i < state.units[unit_id].range ? enemyUnits.push(new_cubic) : false;
                                    } else {
                                        // Obtenemos el índice del obstáculo, si es que está.
                                        var indexOfObstacle = myIndexOf(state.terrains.map(function (x) {
                                            return x.position;
                                        }), new_cubic.getPair());
                                        // Si se admite, añadimos la posición y la cantidad de movimientos para pasar por la casilla
                                        // Por ahora se comprueba si está en la lista de obstáculos, en cuyo caso coge la cantidad. En caso contrario, asumimos Plains
                                        // No tiene sentido las restricciones de movimiento para unidades aéreas
                                        new_neighbours.push([new_cubic, indexOfObstacle > -1 && state.units[unit_id].property != 1 ? state.terrains[indexOfObstacle].movement_penalty - 1 : 0]);
                                    }
                                }
                            } else {
                                // Actualizamos el movimiento de la unidad, si es el caso.
                                var cell = neighbours[indexOfNeighbours];
                                // Siempre que sea reducible
                                if (cell[1] > 0) {
                                    // Obtenemos el índice de la iteración actual
                                    var index = myIndexOfCubic(new_neighbours.map(function (x) {
                                        return x[0];
                                    }), cell[0]);
                                    // Si no está en nuestra lista de vecinos
                                    if (index == -1) {
                                        // Lo añadimos y le reducimos el peso
                                        new_neighbours.push([new_cubic, cell[1] - 1]);
                                    } else {
                                        // Si ya está en nuestra lista de vecinos, accedemos y lo reemplazamos reducciendo en uno
                                        new_neighbours[index] = [new_cubic, cell[1] - 1];
                                    }
                                }
                            }
                        }
                    });
                    // Finalmente, se actualizan los vecinos.
                    neighbours = new_neighbours;
                }
            }
            var visitables_pair = visitables_cubic.map(function (cubic) {
                return cubic.getPair();
            });
            // Finalmente convertimos el resultado a un sistema de coordenadas (row, column)
            return visitables_pair;
        }
    }, {
        key: "getPositionClicked",
        value: function getPositionClicked(xCoor, yCoor) {
            // Para obtener las posiciones relativas al mapa, obtenemos las posiciones absolutas del primer objeto, que es el hexágono primero.
            var dimensions = document.getElementById("hex0_0").getBoundingClientRect();
            // Para soportar mejor los cambios de pantalla, obtenemos las dimensiones del hex primero, para los demás será igual.
            var height = dimensions.bottom - dimensions.top; // Hardcoded, se deberían realizar más pruebas
            var width = Math.round(height * 1.153846154); // El valor que se multiplica es la proporción entre el height y width
            var x = xCoor - dimensions.left; // A las coordenadas absolutas les restamos las dimensiones en el extremo superior izquierdo del primer hex.
            var y = yCoor - dimensions.top;
            var column = Math.floor(x / (3 / 4 * width)); // Primero, encontramos la columna aproximada, dividiendo la posición por 3/4 la anchura (debido a los siguientes cálculos)
            var row; // Definimos el número de fila.
            var isOdd = column % 2 == 1; // Comprobamos si la columna de hexes es impar, ya que estará bajada por la mitad de la altura
            switch (isOdd) {
                case true:
                    // Se le restará la mitad de la altura del hex.
                    row = Math.floor((y - height / 2) / height);
                    break;
                case false:
                    // En otro caso, se obtendrá de forma parecida a la columna. Dividiendo la altura del hex (como se verá, no es multiplicado por 3/4 al no existir un extremo en esa posición).
                    row = Math.floor(y / height);
            }
            // En este momento, tendrémos la casilla correcta aproximada.
            var centerX = Math.round(column * (3 / 4 * width) + width / 2); // Para encontrar el punto central del hex más cercano. 3/4 ya que los hexes están solapados.
            var centerY;
            switch (isOdd) {
                case true:
                    // El punto central equivale a la fila por el tamaño del hex más la mitad (punto medio) más el offset por la fila impar
                    centerY = Math.round(row * height + height);
                    break;
                case false:
                    // En otro caso, no existirá el offset por la fila impar.
                    centerY = Math.round(row * height + height / 2);
            }
            var radius = Math.round(height / 4); // Tomamos el radio más pequeño, siendo este la mitad de la altura del hex.
            // Comprobación de si está el punto en el círculo
            if (!Pathfinding.getInCircle(centerX, centerY, radius, x, y)) {
                // Debemos calcular la distancia entre los otros hexágonos:
                // Debe tenerse en cuenta que estamos intentando encontrar si el punto está en el extremo de forma "<"
                // Primero comprobamos si debemos escoger el hexágono superior o inferior
                var isUpper = y < centerY;
                // Recogemos la posición del hex horizontal siguiente:
                var comparingHexX = Math.round(centerX - width * 3 / 4);
                // Y dependiendo de que esté arriba o debajo, la posición vertical del hex posible:
                var comparingHexY = Math.round(isUpper ? centerY - height / 2 : centerY + height / 2);
                // Calculamos la distancia entre todos los posibles hexes:
                var distanceCircle = Pathfinding.calculateDistance(centerX, centerY, x, y);
                var distancePossibleHex = Pathfinding.calculateDistance(comparingHexX, comparingHexY, x, y);
                // Si la distancia del hex posible es menor al del círculo, entonces cambiamos el row y column
                if (distancePossibleHex < distanceCircle) {
                    // Debido al sistema de identificación usado, es necesario añadir reglas si el hex es impar o par.
                    if (isOdd) {
                        column--;
                        if (!isUpper) {
                            row++;
                        }
                    } else {
                        column--;
                        if (isUpper) {
                            row--;
                        }
                    }
                }
            }
            return new Pair(row, column);
        }
        // Calcula si dado los datos del circulo y  un punto cualquiuera, el punto cualquiera está dentro del círculo

    }, {
        key: "getInCircle",
        value: function getInCircle(centerX, centerY, radius, x, y) {
            // Raiz cuadrada de la distancia vectorial entre el centro y el punto debe ser menor al radio
            return this.calculateDistance(centerX, centerY, x, y) < radius;
        }
        // Calcula la distancia vectorial entre dos puntos

    }, {
        key: "calculateDistance",
        value: function calculateDistance(x0, y0, x1, y1) {
            return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
        }
    }]);

    return Pathfinding;
}();

exports.Pathfinding = Pathfinding;
// Esta clase contendrán métodos auxiliares con respecto a la conexión entre cliente y servidor

var Network = function () {
    function Network() {
        _classCallCheck(this, Network);
    }

    _createClass(Network, null, [{
        key: "parseStateFromServer",
        value: function parseStateFromServer(data) {
            // Definimos la salida, un mapa, y lo populamos con datos por defecto
            var result = {
                turn: 0,
                actualState: 0,
                units: [],
                visitables: [],
                terrains: [],
                cursorPosition: new Pair(0, 0),
                map: undefined,
                selectedUnit: 0,
                type: ""
            };
            // Primero, convertimos el objeto en un mapa
            var json = JSON.parse(data);
            // Después iteramos por cada uno de los atributos y crearemos el objeto cuando sea necesario
            // Para empezar, asignamos las variables primitivas, al no necesitar inicializarlas
            result.turn = json.turn;
            result.actualState = json.actualState;
            result.selectedUnit = json.selectedUnit;
            result.type = json.type;
            // Después, creamos un Pair con los datos introducidos
            result.cursorPosition = new Pair(json.cursorPosition.row, json.cursorPosition.column);
            // Ahora nos encargamos de visitables
            // Inicializamos una lista con los datos de las casillas visitables
            var visitables = json.visitables;
            // Y asignamos al estado las casillas
            if (visitables) result.visitables = visitables.map(function (pair) {
                return new Pair(pair.row, pair.column);
            });
            // Ahora vamos con las unidades:
            var units = json.units;
            // Para cada uno, crearemos una unidad con esos datos.
            if (units) {
                result.units = units.map(function (unit) {
                    return new Unit_1.Unit(unit.name, unit.type, unit.movement, new Pair(unit.position.row, unit.position.column), unit.player, unit.used, unit.attackWeak, unit.attackStrong, unit.defenseWeak, unit.defenseStrong, unit.health, unit.range, 0, unit.property, unit.hasAttacked);
                });
            }
            // Finalmente, nos quedan los terrenos, mismo proceso
            result.terrains = this.parseMap(json.terrains);
            // Retornamos el estado final
            return result;
        }
    }, {
        key: "parseStateEditFromServer",
        value: function parseStateEditFromServer(data) {
            // Definimos la salida, un mapa, y lo populamos con datos por defecto
            var result = {
                map: undefined,
                terrains: [],
                cursorPosition: new Pair(0, 0),
                selected: "",
                type: 0
            };
            // Primero, convertimos el objeto en un mapa
            var json = JSON.parse(data);
            // Después iteramos por cada uno de los atributos y crearemos el objeto cuando sea necesario
            // Para empezar, asignamos las variables primitivas, al no necesitar inicializarlas
            result.selected = json.selected;
            result.type = json.type;
            // Después, creamos un Pair con los datos introducidos
            result.cursorPosition = new Pair(json.cursorPosition.row, json.cursorPosition.column);
            // Finalmente, nos quedan los terrenos, mismo proceso
            result.terrains = this.parseMap(json.terrains);
            // Retornamos el estado final
            return result;
        }
    }, {
        key: "parseStateProfileFromServer",
        value: function parseStateProfileFromServer(data) {
            // Definimos la salida, un mapa, y lo populamos con datos por defecto
            var result = {
                profile: undefined,
                armies: [],
                selectedArmy: 0,
                selected: "",
                type: "0"
            };
            // Primero, convertimos el objeto en un mapa
            var json = JSON.parse(data);
            // Después iteramos por cada uno de los atributos y crearemos el objeto cuando sea necesario
            // Para empezar, asignamos las variables primitivas, al no necesitar inicializarlas
            result.selected = json.selected;
            result.selectedArmy = json.selectedArmy;
            result.type = json.type;
            // Ahora vamos con los batallones:
            var armies = json.armies;
            // Para cada uno, crearemos una unidad con esos datos.
            for (var i = 0; i < armies.length; i++) {
                var army = new Array();
                for (var j = 0; i < armies[i].army.length; j++) {
                    army.push({ type: armies[i].army[j].type, number: armies[i].army[j].number });
                }
                result.armies.push(new Army_1.Army(army, armies[i].name));
            }
            // Retornamos el estado final
            return result;
        }
    }, {
        key: "parseMap",
        value: function parseMap(terrains) {
            var result = [];
            if (terrains) {
                result = terrains.map(function (terrain) {
                    return new Terrains_1.Terrain(terrain.name, terrain.image, terrain.movement_penalty, new Pair(terrain.position.row, terrain.position.column), terrain.defenseWeak, terrain.defenseStrong);
                });
            }
            return result;
        }
    }]);

    return Network;
}();

exports.Network = Network;