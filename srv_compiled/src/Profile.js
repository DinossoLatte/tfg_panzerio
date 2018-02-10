"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var StoreProfile_1 = require("./StoreProfile");
var GameProfileState_1 = require("./GameProfileState");
var Army_1 = require("./Army");

var Profile = function (_React$Component) {
    _inherits(Profile, _React$Component);

    function Profile(props) {
        _classCallCheck(this, Profile);

        var _this = _possibleConstructorReturn(this, (Profile.__proto__ || Object.getPrototypeOf(Profile)).call(this, props));

        _this.state = {
            name: null
        };
        return _this;
    }
    /// Este método cambiará el título


    _createClass(Profile, [{
        key: "updateInput",
        value: function updateInput(title) {
            if (title.trim() == "") {
                // Si nos viene el TODO (objeto), indicamos el batallón seleccionado
                this.setState({ name: "Batallón " + StoreProfile_1.storeProfile.getState().selectedArmy });
            } else {
                // En otro caso, mostraremos el elemento de entrada TODO ???
                this.setState({ name: title });
            }
        }
        /// Este listener se encargará de cambiar a la edición del batallón

    }, {
        key: "onClickAddEdit",
        value: function onClickAddEdit(event) {
            // Si está definido el nombre
            if (this.state.name != null && (
            // El tipo es 1 o edición de nombre del ejército
            StoreProfile_1.storeProfile.getState().type == "1" || StoreProfile_1.storeProfile.getState().type == "3") &&
            // Y se dispone de un ejercito seleccionado
            StoreProfile_1.storeProfile.getState().selectedArmy != null) {
                // Actualizamos el menú realizando un setState
                this.setState({ name: null });
            }
            // Actualizamos el estado general para cambiar a la fase TODO 4 ???
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, StoreProfile_1.storeProfile.getState().selectedArmy, null, "4"));
        }
        /// Este método se encargará

    }, {
        key: "onClickDeleteEdit",
        value: function onClickDeleteEdit(event) {
            // Si no tenemos un nombre, es decir estamos modificando un batallón
            if (this.state.name != null && (
            // Si estamos en la fase 1 o edición de nombre del ejército
            StoreProfile_1.storeProfile.getState().type == "1" || StoreProfile_1.storeProfile.getState().type == "3") &&
            // Y tenemos un ejército seleccionado
            StoreProfile_1.storeProfile.getState().selectedArmy != null) {
                // Actualizamos el menú
                this.setState({ name: null });
            }
            // Actualizamos el estado a la fase TODO 5 ???
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, StoreProfile_1.storeProfile.getState().selectedArmy, null, "5"));
        }
        /// Esta función representará las opciones del los ejércitos

    }, {
        key: "renderSelectOptionsArmy",
        value: function renderSelectOptionsArmy() {
            // Primero, ponemos la opción por defecto
            var armies = [React.createElement("option", { selected: true, value: null }, "--Selecciona--")];
            for (var i = 0; i < StoreProfile_1.storeProfile.getState().armies.length; i++) {
                // y introducimos cada posible ejército
                armies.push(React.createElement("option", { value: i }, StoreProfile_1.storeProfile.getState().armies[i].name));
            }
            return armies;
        }
        /// Esta función se encargará de mostrar el contenido de un ejército,
        /// siendo en este caso las unidades que lo contienen

    }, {
        key: "renderArmyContent",
        value: function renderArmyContent(armyIndex) {
            // 'result' contendrá el conjunto de elementos HTML que se representará
            var result = [];
            // Y estos contadores tendrán el número de unidades del correspondiente tipo
            var generalNumber = 0;
            var infantryNumber = 0;
            var tankNumber = 0;
            var index =
            // Si el índice introducido es null
            armyIndex == null ?
            // Entonces obtenemos el del estado general
            StoreProfile_1.storeProfile.getState().selectedArmy :
            // En caso contrario, usamos el que nos da de argumento
            armyIndex;
            // Iteramos por cada tipo de unidad del ejército
            for (var armyIndex = 0; armyIndex < StoreProfile_1.storeProfile.getState().armies[index].unitList.length; armyIndex++) {
                // Según el tipo de la unidad, le asignaremos el contador correspondiente
                // TODO esto deberá de cambiar para admitir cualquier atributo de la unidad, es decir, poder crear nuevos tipos de unidades
                // Seleccionamos el elemento iterado
                var unitNumberPair = StoreProfile_1.storeProfile.getState().armies[index].unitList[armyIndex];
                // Y comprobamos el tipo
                switch (unitNumberPair.type) {
                    case "General":
                        generalNumber = unitNumberPair.number;
                        break;
                    case "Infantry":
                        infantryNumber = unitNumberPair.number;
                        break;
                    case "Tank":
                        tankNumber = unitNumberPair.number;
                        break;
                    default:
                        // Este caso no debería ocurrir nunca
                        console.error("renderArmyContents, el tipo de la unidad no se tiene en cuenta!");
                        break;
                }
            }
            // Finalmente, añadiremos a los componentes el número de unidades
            result.push(React.createElement("p", null, "Generales: ", generalNumber));
            result.push(React.createElement("p", null, "Infanter\xEDas: ", infantryNumber));
            result.push(React.createElement("p", null, "Tanques: ", tankNumber));
            return result;
        }
        /// Esta función se encargará de renderizar una lista de los ejércitos del usuario

    }, {
        key: "renderArmyList",
        value: function renderArmyList() {
            // Esta variable contendrá los elementso HTML a representar
            var armies = [];
            // Iteramos por cada ejército
            for (var index = 0; index < StoreProfile_1.storeProfile.getState().armies.length; index++) {
                armies.push(React.createElement("div", { id: "army" }, StoreProfile_1.storeProfile.getState().armies[index].name));
                // Por cada ejército mostraremos también las unidades que lo contienen
                var unitLists = this.renderArmyContent(index);
                // Y los introducimos a la lista
                for (var j = 0; j < unitLists.length; j++) {
                    armies.push(unitLists[j]);
                }
            }
            return armies;
        }
        /// Esta función se encarga de seleccionar la unidad

    }, {
        key: "selectUnit",
        value: function selectUnit(unitType) {
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, StoreProfile_1.storeProfile.getState().selectedArmy, unitType, StoreProfile_1.storeProfile.getState().type));
        }
        /// Esta función seleccionará el ejército con el índice introducido para cambiarle el nombre

    }, {
        key: "selectArmy",
        value: function selectArmy(armyIndex) {
            // Comprobamos que no tengamos el nombre
            if (this.state.name != null) {
                // Asignamos el valor del ejército, para ser modificado
                this.setState({ name: StoreProfile_1.storeProfile.getState().armies[parseInt(armyIndex)].name });
            }
            // Actualizamos el estado a fase edición de nombre del ejército
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, parseInt(armyIndex), null, "3"));
        }
        /// Este listener se encargará de tramitar la eliminación de la unidad

    }, {
        key: "onClickDeleteUnit",
        value: function onClickDeleteUnit(event) {
            // Primero, obtenemos el ejército seleccionado
            var army = StoreProfile_1.storeProfile.getState().armies[StoreProfile_1.storeProfile.getState().selectedArmy];
            // Obtenemos el índice del ejército, que lo sobrescribiremos
            var armyUnits = army.unitList;
            // Obtenemos el tipo de la unidad
            var deletedUnitType = StoreProfile_1.storeProfile.getState().selected;
            // Iteramos el array
            armyUnits.filter(function (pair) {
                return pair.type == deletedUnitType;
            }).forEach(function (pair) {
                return pair.number = pair.number - 1;
            });
            // Asignamos el nuevo ejército al seleccionado
            army.unitList = armyUnits.filter(function (pair) {
                return pair.number > 0;
            });
            // Actualizamos el estado TODO MEJORARLO, ASÍ NO SE HACE!?
            StoreProfile_1.storeProfile.getState().armies[StoreProfile_1.storeProfile.getState().selectedArmy] = army;
            // Y finalmente llamamos a la actualización del estado
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, StoreProfile_1.storeProfile.getState().selectedArmy, StoreProfile_1.storeProfile.getState().selected, StoreProfile_1.storeProfile.getState().type));
        }
        /// Este listener se encargará de eliminar un ejército

    }, {
        key: "onClickDeleteArmy",
        value: function onClickDeleteArmy(event) {
            // Obtenemos la lista de ejércitos
            var armies = StoreProfile_1.storeProfile.getState().armies;
            // Obtenemos el ejército a eliminar
            var army = armies[StoreProfile_1.storeProfile.getState().selectedArmy];
            console.log(JSON.stringify(army));
            // Filtramos el ejército de la lista
            armies = armies.filter(function (armyList) {
                return armyList.name != army.name;
            });
            // Finalmente guardamos el conjunto de ejércitos
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, armies, null, null, "2"));
        }
        /// Este listener se encarga de añadir a los ejércitos unidades

    }, {
        key: "onClickAddUnit",
        value: function onClickAddUnit(event) {
            var army = void 0;
            // Comprobamos si la lista de ejércitos coinciden con el ejército seleccionado
            if (StoreProfile_1.storeProfile.getState().armies.length == StoreProfile_1.storeProfile.getState().selectedArmy) {
                // Si el índice es igual, se estará creando el ejército
                // Definimos el ejército por defecto
                army = new Army_1.Army([{ type: "General", number: 1 }],
                // Si el nombre no está definido, ponemos uno por defecto
                this.state.name == null ? "Batallón " + StoreProfile_1.storeProfile.getState().selectedArmy :
                // Si ya nos viene, le ponemos el que tengamos
                this.state.name);
                // Si tenemos un ejército seleccionado
                if (StoreProfile_1.storeProfile.getState().selected != null) {
                    army.unitList.push({ type: StoreProfile_1.storeProfile.getState().selected, number: 1 });
                }
                StoreProfile_1.storeProfile.getState().armies.push(army);
            } else {
                // En otro caso, tenemos ya uno seleccionado
                army = StoreProfile_1.storeProfile.getState().armies[StoreProfile_1.storeProfile.getState().selectedArmy];
                // Si tenemos un ejército seleccionado
                if (StoreProfile_1.storeProfile.getState().selected != null) {
                    // Primero, comprobamos que exista el par tipo y número de unidades
                    var pairTypeNumberOfSelected = army.unitList.find(function (unitType) {
                        return unitType.type == StoreProfile_1.storeProfile.getState().selected;
                    });
                    // Comprobamos si el par existe
                    if (pairTypeNumberOfSelected) {
                        // En el caso de que exista, cambiaremos el valor del número en el índice del seleccionado
                        army.unitList[army.unitList.indexOf(pairTypeNumberOfSelected)].number = pairTypeNumberOfSelected.number + 1;
                    } else {
                        // En otro caso, estamos iniciando el par tipo y número
                        army.unitList.push({ type: StoreProfile_1.storeProfile.getState().selected, number: 1 });
                    }
                }
                // Si estamos en la fase 1 o edición de nombre del ejército
                if (StoreProfile_1.storeProfile.getState().type == "1" || StoreProfile_1.storeProfile.getState().type == "3") {
                    // Entonces cambiamos el nombre del ejército
                    army.name =
                    // Si el nombre no está definido, le asignamos uno por defecto
                    this.state.name == null ? "Batallón " + StoreProfile_1.storeProfile.getState().selectedArmy :
                    // Si lo tenemos, ponemos el que está definido
                    this.state.name;
                }
                // Finalmente ponemos el ejército, TODO de nuevo no es esta la forma de hacerlo
                StoreProfile_1.storeProfile.getState().armies[StoreProfile_1.storeProfile.getState().selectedArmy] = army;
            }
            // TODO Esta no es la forma de gestionar un estado, para que tener acciones diferentes!?!?
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, StoreProfile_1.storeProfile.getState().selectedArmy, StoreProfile_1.storeProfile.getState().selected, StoreProfile_1.storeProfile.getState().type));
        }
        /// Esta función se encargará de tramitar la creación de ejércitos

    }, {
        key: "onClickCreateArmy",
        value: function onClickCreateArmy(event) {
            // Si no se ha introducido un nombre del ejército
            if (this.state.name != null && (
            // Y la fase es la 1 o edición de nombre del ejército
            StoreProfile_1.storeProfile.getState().type == "1" || StoreProfile_1.storeProfile.getState().type == "3") &&
            // Y se ha seleccionado un ejército
            StoreProfile_1.storeProfile.getState().selectedArmy != null) {
                // Entonces cambiamos el estado del componente, renderizando de nuevo
                this.setState({ name: null });
            }
            // Finalmente, actualizamos la fase del estado
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, StoreProfile_1.storeProfile.getState().armies.length, "General", "1"));
        }
        /// Este listener se encargará de activar la edición de ejércitos

    }, {
        key: "onClickEditArmy",
        value: function onClickEditArmy(event) {
            // Si el nombre no está asignado
            if (this.state.name != null && (
            // Y el estado es 1 o edición de nombre del ejército
            StoreProfile_1.storeProfile.getState().type == "1" || StoreProfile_1.storeProfile.getState().type == "3") &&
            // Ý se dispone de un ejército
            StoreProfile_1.storeProfile.getState().selectedArmy != null) {
                // Refrescamos la vista
                this.setState({ name: null });
            }
            // Y actualizamos el estado para pasar a la fase 2 TODO ??
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, null, null, "2"));
        }
        /// Este listener se encargará de cambiar el nombre del ejército

    }, {
        key: "onClickEditArmyName",
        value: function onClickEditArmyName(event) {
            // El nombre no está asignado
            if (this.state.name != null && (
            // La fase es 1 o edición de nombre del ejército
            StoreProfile_1.storeProfile.getState().type == "1" || StoreProfile_1.storeProfile.getState().type == "3") &&
            // Y se tiene un ejército seleccionado
            StoreProfile_1.storeProfile.getState().selectedArmy != null) {
                // Actualizamos el estado y refrescamos la vista
                this.setState({ name: null });
            }
            // Guardamos el estado para pasar a la fase 3 (edición del nombre del ejército)
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, StoreProfile_1.storeProfile.getState().selectedArmy, null, "3"));
        }
        /// Este listener se encargará de listar las unidades del ejército?

    }, {
        key: "onClickList",
        value: function onClickList(event) {
            // El nombre está asignado
            if (this.state.name != null && (
            // La fase es 1 o edición del nombre del ejército
            StoreProfile_1.storeProfile.getState().type == "1" || StoreProfile_1.storeProfile.getState().type == "3") &&
            // Y se tiene un ejército seleccionado
            StoreProfile_1.storeProfile.getState().selectedArmy != null) {
                // Entonces refrescamos el estado
                this.setState({ name: null });
            }
            // Y cambiamos la fase a 0?
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, null, null, "0"));
        }
        /// Este listener se encargará de salir del menú de perfil

    }, {
        key: "onClickExitMenu",
        value: function onClickExitMenu(event) {
            // El nombre está asignado
            if (this.state.name != null && (
            // La fase es 1 o edición de nombre del ejército
            StoreProfile_1.storeProfile.getState().type == "1" || StoreProfile_1.storeProfile.getState().type == "3") &&
            // Hay un ejército seleccionado
            StoreProfile_1.storeProfile.getState().selectedArmy != null) {
                // Entonces, actualizamos el estado y refrescamos la vista
                this.setState({ name: null });
            }
            // Guardamos el estado, para que tenga en cuenta la fase inicial por si el usuario vuelve a entrar
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, null, null, "0"));
            // Y avisamos al juego de que el usuario ha salido del menú de perfil
            this.props.parentObject.changeGameState(0);
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            return React.createElement("div", null, React.createElement("img", { className: "avatar", src: "imgs/avatar.png" }), React.createElement("p", null, "Nombre: Jugador"), React.createElement("p", null, "Partidas ganadas: x"), React.createElement("p", null, "Partidas perdidas: y"), React.createElement("p", null, "Nivel: z"), StoreProfile_1.storeProfile.getState().type != "0" ? React.createElement("button", { id: "listArmy", name: "listArmy", className: "listArmyButton", onClick: this.onClickList.bind(this) }, "Mostrar batallones") : "", StoreProfile_1.storeProfile.getState().type != "1" ? React.createElement("button", { id: "createArmy", name: "createArmy", className: "createArmyButton", onClick: this.onClickCreateArmy.bind(this) }, "Crear un nuevo ej\xE9rcito") : "", StoreProfile_1.storeProfile.getState().type != "2" ? React.createElement("button", { id: "editArmy", name: "editArmy", className: "editArmyButton", onClick: this.onClickEditArmy.bind(this) }, "Editar un ej\xE9rcito") : "", React.createElement("button", { id: "exitButton", name: "exitButton", onClick: this.onClickExitMenu.bind(this) }, "Volver al men\xFA"), StoreProfile_1.storeProfile.getState().type >= "2" && StoreProfile_1.storeProfile.getState().armies.length > 0 ? React.createElement("div", null, React.createElement("label", null, " Selecciona el batall\xF3n:", React.createElement("select", { defaultValue: null, value: StoreProfile_1.storeProfile.getState().selectedArmy, onChange: function onChange(evt) {
                    return _this2.selectArmy(evt.target.value);
                } }, this.renderSelectOptionsArmy())), StoreProfile_1.storeProfile.getState().type > "2" && StoreProfile_1.storeProfile.getState().type != "3" ? React.createElement("button", { id: "editName", name: "editName", className: "editNameButton", onClick: this.onClickEditArmyName.bind(this) }, "Editar nombre del batall\xF3n") : "", StoreProfile_1.storeProfile.getState().type > "2" && StoreProfile_1.storeProfile.getState().type != "4" ? React.createElement("button", { id: "addUnit", name: "addUnit", className: "addUnitButton", onClick: this.onClickAddEdit.bind(this) }, "A\xF1adir una nueva unidad") : "", StoreProfile_1.storeProfile.getState().type > "2" && StoreProfile_1.storeProfile.getState().type != "5" ? React.createElement("button", { id: "deleteUnit", name: "deleteUnit", className: "deleteUnitButton", onClick: this.onClickDeleteEdit.bind(this) }, "Eliminar una unidad") : "", StoreProfile_1.storeProfile.getState().type > "2" && StoreProfile_1.storeProfile.getState().selectedArmy != null ? React.createElement("button", { id: "deleteArmy", name: "deleteArmy", className: "deleteArmyButton", onClick: this.onClickDeleteArmy.bind(this) }, "Eliminar batall\xF3n") : "") : StoreProfile_1.storeProfile.getState().type >= "2" && StoreProfile_1.storeProfile.getState().armies.length == 0 ? React.createElement("div", { id: "error" }, "No hay batallones para seleccionar") : "", StoreProfile_1.storeProfile.getState().type == "1" || StoreProfile_1.storeProfile.getState().type == "4" ? React.createElement("div", null, React.createElement("label", null, " Selecciona el tipo de unidad:", React.createElement("select", { defaultValue: null, value: StoreProfile_1.storeProfile.getState().selected, onChange: function onChange(evt) {
                    return _this2.selectUnit(evt.target.value);
                } }, React.createElement("option", { selected: true, value: null }, "--Selecciona--"), React.createElement("option", { value: "Infantry" }, "Infanter\xEDa"), React.createElement("option", { value: "Tank" }, "Tanque"))), StoreProfile_1.storeProfile.getState().selected != null ? React.createElement("button", { id: "addUnit", name: "addUnit", className: "addUnitButton", onClick: this.onClickAddUnit.bind(this) }, "A\xF1adir unidad") : "") : "", (StoreProfile_1.storeProfile.getState().type == "1" || StoreProfile_1.storeProfile.getState().type == "3") && StoreProfile_1.storeProfile.getState().selectedArmy != null ? React.createElement("div", null, "Nombre: ", React.createElement("input", { type: "text", value: this.state.name, onChange: function onChange(evt) {
                    return _this2.updateInput(evt.target.value);
                } }), React.createElement("button", { id: "setName", name: "setName", className: "setNameButton", onClick: this.onClickAddUnit.bind(this) }, "Establecer nombre")) : "", StoreProfile_1.storeProfile.getState().type == "5" && StoreProfile_1.storeProfile.getState().armies[StoreProfile_1.storeProfile.getState().selectedArmy].unitList.length > 1 ? React.createElement("div", null, React.createElement("label", null, " Selecciona el tipo de unidad:", React.createElement("select", { defaultValue: null, value: StoreProfile_1.storeProfile.getState().selected, onChange: function onChange(evt) {
                    return _this2.selectUnit(evt.target.value);
                } }, React.createElement("option", { selected: true, value: null }, "--Selecciona--"), StoreProfile_1.storeProfile.getState().armies[StoreProfile_1.storeProfile.getState().selectedArmy].unitList.filter(function (pair) {
                return pair.type == "Infantry";
            }).length != 0 ? React.createElement("option", { value: "Infantry" }, "Infanter\xEDa") : "", StoreProfile_1.storeProfile.getState().armies[StoreProfile_1.storeProfile.getState().selectedArmy].unitList.filter(function (pair) {
                return pair.type == "Tank";
            }).length != 0 ? React.createElement("option", { value: "Tank" }, "Tanque") : "")), StoreProfile_1.storeProfile.getState().selected != null ? React.createElement("button", { id: "deleteUnit", name: "deleteUnit", className: "deleteUnitButton", onClick: this.onClickDeleteUnit.bind(this) }, "Eliminar unidad") : "") : StoreProfile_1.storeProfile.getState().type == "5" && StoreProfile_1.storeProfile.getState().armies[StoreProfile_1.storeProfile.getState().selectedArmy].unitList.length <= 1 ? React.createElement("div", { id: "error" }, "No hay unidades para eliminar") : "", StoreProfile_1.storeProfile.getState().selectedArmy != null && StoreProfile_1.storeProfile.getState().armies.length > StoreProfile_1.storeProfile.getState().selectedArmy ? React.createElement("div", null, React.createElement("p", null, "El batall\xF3n contiene:"), React.createElement("div", null, this.renderArmyContent(null))) : "", StoreProfile_1.storeProfile.getState().type == "0" ? React.createElement("div", null, React.createElement("p", null, "Batallones del jugador:"), React.createElement("div", null, this.renderArmyList())) : "");
        }
    }]);

    return Profile;
}(React.Component);

exports.Profile = Profile;