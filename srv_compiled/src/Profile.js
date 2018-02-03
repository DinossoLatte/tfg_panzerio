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
var Unit_1 = require("./Unit");

var Profile = function (_React$Component) {
    _inherits(Profile, _React$Component);

    function Profile(props) {
        _classCallCheck(this, Profile);

        var _this = _possibleConstructorReturn(this, (Profile.__proto__ || Object.getPrototypeOf(Profile)).call(this, props));

        _this.state = { name: null };
        return _this;
    }

    _createClass(Profile, [{
        key: "updateInput",
        value: function updateInput(evt) {
            if (evt == null || evt == undefined || evt == "") {
                this.setState({ name: "Batallón " + StoreProfile_1.storeProfile.getState().selectedArmy });
            } else {
                this.setState({ name: evt });
            }
        }
    }, {
        key: "onClickAddEdit",
        value: function onClickAddEdit(event) {
            this.state.name != null && (StoreProfile_1.storeProfile.getState().type == "1" || StoreProfile_1.storeProfile.getState().type == "3") && StoreProfile_1.storeProfile.getState().selectedArmy != null ? this.setState({ name: null }) : "";
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, StoreProfile_1.storeProfile.getState().selectedArmy, null, "4"));
        }
    }, {
        key: "onClickDeleteEdit",
        value: function onClickDeleteEdit(event) {
            this.state.name != null && (StoreProfile_1.storeProfile.getState().type == "1" || StoreProfile_1.storeProfile.getState().type == "3") && StoreProfile_1.storeProfile.getState().selectedArmy != null ? this.setState({ name: null }) : "";
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, StoreProfile_1.storeProfile.getState().selectedArmy, null, "5"));
        }
    }, {
        key: "selectOptionsArmy",
        value: function selectOptionsArmy() {
            var army = [React.createElement("option", { selected: true, value: null }, "--Selecciona--")];
            for (var i = 0; i < StoreProfile_1.storeProfile.getState().armies.length; i++) {
                army.push(React.createElement("option", { value: i }, StoreProfile_1.storeProfile.getState().armies[i].getName()));
            }
            return army;
        }
        //Se crean los options segun la lista de unidades disponibles (empieza en 1 para no contar general)

    }, {
        key: "selectOptionsUnits",
        value: function selectOptionsUnits() {
            var army = [React.createElement("option", { selected: true, value: null }, "--Selecciona--")];
            for (var i = 1; i < Unit_1.UNITS.length; i++) {
                army.push(React.createElement("option", { value: Unit_1.UNITS[i] }, Unit_1.UNITS_ESP[i]));
            }
            return army;
        }
    }, {
        key: "selectOptionsUnitsDelete",
        value: function selectOptionsUnitsDelete() {
            var army = [React.createElement("option", { selected: true, value: null }, "--Selecciona--")];
            for (var i = 1; i < Unit_1.UNITS.length; i++) {
                if (StoreProfile_1.storeProfile.getState().armies[StoreProfile_1.storeProfile.getState().selectedArmy].getArmy().filter(function (x) {
                    return x == Unit_1.UNITS[i];
                }).length != 0) {
                    army.push(React.createElement("option", { value: Unit_1.UNITS[i] }, Unit_1.UNITS_ESP[i]));
                }
            }
            return army;
        }
    }, {
        key: "armyContent",
        value: function armyContent(i) {
            var army = [];
            //Es necesario hacer este bucle porque sino no se puede incializar a 0 el array
            var armyNum = [];
            for (var j = 0; j < Unit_1.UNITS.length; j++) {
                armyNum.push(0);
            }
            var ind = void 0;
            i == null ? ind = StoreProfile_1.storeProfile.getState().selectedArmy : ind = i;
            for (var y = 0; y < StoreProfile_1.storeProfile.getState().armies[ind].getArmy().length; y++) {
                for (var p = 0; p < Unit_1.UNITS.length; p++) {
                    if (StoreProfile_1.storeProfile.getState().armies[ind].getArmy()[y] == Unit_1.UNITS[p]) {
                        armyNum[p]++;
                    }
                }
            }
            for (var z = 0; z < armyNum.length; z++) {
                army.push(React.createElement("p", null, Unit_1.UNITS_ESP[z], ": ", armyNum[z]));
            }
            return army;
        }
    }, {
        key: "armyList",
        value: function armyList() {
            var armies = [];
            for (var i = 0; i < StoreProfile_1.storeProfile.getState().armies.length; i++) {
                armies.push(React.createElement("div", { id: "arm" }, StoreProfile_1.storeProfile.getState().armies[i].getName()));
                var army = this.armyContent(i);
                for (var j = 0; j < army.length; j++) {
                    armies.push(army[j]);
                }
            }
            return armies;
        }
    }, {
        key: "selectedUnit",
        value: function selectedUnit(evt) {
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, StoreProfile_1.storeProfile.getState().selectedArmy, evt, StoreProfile_1.storeProfile.getState().type));
        }
    }, {
        key: "selectedArmy",
        value: function selectedArmy(evt) {
            this.state.name != null ? this.setState({ name: StoreProfile_1.storeProfile.getState().armies[parseInt(evt)].getName() }) : "";
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, parseInt(evt), StoreProfile_1.storeProfile.getState().selected, "3"));
        }
    }, {
        key: "onClickDelete",
        value: function onClickDelete(event) {
            var army = StoreProfile_1.storeProfile.getState().armies[StoreProfile_1.storeProfile.getState().selectedArmy];
            var index = army.getArmy().indexOf(StoreProfile_1.storeProfile.getState().selected);
            delete army.getArmy()[index];
            army.setArmy(army.getArmy().filter(function (x) {
                return x !== undefined;
            }));
            StoreProfile_1.storeProfile.getState().armies[StoreProfile_1.storeProfile.getState().selectedArmy] = army;
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, StoreProfile_1.storeProfile.getState().selectedArmy, "", StoreProfile_1.storeProfile.getState().type));
        }
    }, {
        key: "onClickDeleteArmy",
        value: function onClickDeleteArmy(event) {
            var armies = StoreProfile_1.storeProfile.getState().armies;
            delete armies[StoreProfile_1.storeProfile.getState().selectedArmy];
            armies = armies.filter(function (x) {
                return x !== undefined;
            });
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, armies, null, "", "2"));
        }
    }, {
        key: "onClickAdd",
        value: function onClickAdd(event) {
            var army = void 0;
            //this.updateInput(this.state.name);
            if (StoreProfile_1.storeProfile.getState().armies.length == StoreProfile_1.storeProfile.getState().selectedArmy) {
                army = new Army_1.Army(["General"], this.state.name == null ? "Batallón " + StoreProfile_1.storeProfile.getState().selectedArmy : this.state.name);
                if (StoreProfile_1.storeProfile.getState().selected != null) {
                    army.getArmy().push(StoreProfile_1.storeProfile.getState().selected);
                }
                StoreProfile_1.storeProfile.getState().armies.push(army);
            } else {
                army = StoreProfile_1.storeProfile.getState().armies[StoreProfile_1.storeProfile.getState().selectedArmy];
                if (StoreProfile_1.storeProfile.getState().selected != null) {
                    army.getArmy().push(StoreProfile_1.storeProfile.getState().selected);
                }
                if (StoreProfile_1.storeProfile.getState().type == "1" || StoreProfile_1.storeProfile.getState().type == "3") {
                    army.setName(this.state.name == null ? "Batallón " + StoreProfile_1.storeProfile.getState().selectedArmy : this.state.name);
                }
                StoreProfile_1.storeProfile.getState().armies[StoreProfile_1.storeProfile.getState().selectedArmy] = army;
            }
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, StoreProfile_1.storeProfile.getState().selectedArmy, "", StoreProfile_1.storeProfile.getState().type));
        }
    }, {
        key: "onClickCreate",
        value: function onClickCreate(event) {
            this.state.name != null && (StoreProfile_1.storeProfile.getState().type == "1" || StoreProfile_1.storeProfile.getState().type == "3") && StoreProfile_1.storeProfile.getState().selectedArmy != null ? this.setState({ name: null }) : "";
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, StoreProfile_1.storeProfile.getState().armies.length, "", "1"));
        }
    }, {
        key: "onClickEdit",
        value: function onClickEdit(event) {
            this.state.name != null && (StoreProfile_1.storeProfile.getState().type == "1" || StoreProfile_1.storeProfile.getState().type == "3") && StoreProfile_1.storeProfile.getState().selectedArmy != null ? this.setState({ name: null }) : "";
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, null, "", "2"));
        }
    }, {
        key: "onClickEditName",
        value: function onClickEditName(event) {
            this.state.name != null && (StoreProfile_1.storeProfile.getState().type == "1" || StoreProfile_1.storeProfile.getState().type == "3") && StoreProfile_1.storeProfile.getState().selectedArmy != null ? this.setState({ name: null }) : "";
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, StoreProfile_1.storeProfile.getState().selectedArmy, "", "3"));
        }
    }, {
        key: "onClickList",
        value: function onClickList(event) {
            this.state.name != null && (StoreProfile_1.storeProfile.getState().type == "1" || StoreProfile_1.storeProfile.getState().type == "3") && StoreProfile_1.storeProfile.getState().selectedArmy != null ? this.setState({ name: null }) : "";
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, null, "", "0"));
        }
    }, {
        key: "onClickExit",
        value: function onClickExit(event) {
            this.state.name != null && (StoreProfile_1.storeProfile.getState().type == "1" || StoreProfile_1.storeProfile.getState().type == "3") && StoreProfile_1.storeProfile.getState().selectedArmy != null ? this.setState({ name: null }) : "";
            StoreProfile_1.saveState(GameProfileState_1.ProfileActions.save(this, StoreProfile_1.storeProfile.getState().armies, null, "", "0"));
            this.props.parentObject.changeGameState(0);
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            return React.createElement("div", null, React.createElement("img", { className: "avatar", src: "imgs/avatar.png" }), React.createElement("p", null, "Nombre: Jugador"), React.createElement("p", null, "Partidas ganadas: x"), React.createElement("p", null, "Partidas perdidas: y"), React.createElement("p", null, "Nivel: z"), StoreProfile_1.storeProfile.getState().type != "0" ? React.createElement("button", { id: "listArmy", name: "listArmy", className: "listArmyButton", onClick: this.onClickList.bind(this) }, "Mostrar batallones") : "", StoreProfile_1.storeProfile.getState().type != "1" ? React.createElement("button", { id: "createArmy", name: "createArmy", className: "createArmyButton", onClick: this.onClickCreate.bind(this) }, "Crear un nuevo ej\xE9rcito") : "", StoreProfile_1.storeProfile.getState().type != "2" ? React.createElement("button", { id: "editArmy", name: "editArmy", className: "editArmyButton", onClick: this.onClickEdit.bind(this) }, "Editar un ej\xE9rcito") : "", React.createElement("button", { id: "exitButton", name: "exitButton", onClick: this.onClickExit.bind(this) }, "Volver al men\xFA"), StoreProfile_1.storeProfile.getState().type >= "2" && StoreProfile_1.storeProfile.getState().armies.length > 0 ? React.createElement("div", null, React.createElement("label", null, " Selecciona el batall\xF3n:", React.createElement("select", { defaultValue: null, value: StoreProfile_1.storeProfile.getState().selectedArmy, onChange: function onChange(evt) {
                    return _this2.selectedArmy(evt.target.value);
                } }, this.selectOptionsArmy())), StoreProfile_1.storeProfile.getState().type > "2" && StoreProfile_1.storeProfile.getState().type != "3" ? React.createElement("button", { id: "editName", name: "editName", className: "editNameButton", onClick: this.onClickEditName.bind(this) }, "Editar nombre del batall\xF3n") : "", StoreProfile_1.storeProfile.getState().type > "2" && StoreProfile_1.storeProfile.getState().type != "4" ? React.createElement("button", { id: "addUnit", name: "addUnit", className: "addUnitButton", onClick: this.onClickAddEdit.bind(this) }, "A\xF1adir una nueva unidad") : "", StoreProfile_1.storeProfile.getState().type > "2" && StoreProfile_1.storeProfile.getState().type != "5" ? React.createElement("button", { id: "deleteUnit", name: "deleteUnit", className: "deleteUnitButton", onClick: this.onClickDeleteEdit.bind(this) }, "Eliminar una unidad") : "", StoreProfile_1.storeProfile.getState().type > "2" && StoreProfile_1.storeProfile.getState().selectedArmy != null ? React.createElement("button", { id: "deleteArmy", name: "deleteArmy", className: "deleteArmyButton", onClick: this.onClickDeleteArmy.bind(this) }, "Eliminar batall\xF3n") : "") : StoreProfile_1.storeProfile.getState().type >= "2" && StoreProfile_1.storeProfile.getState().armies.length == 0 ? React.createElement("div", { id: "error" }, "No hay batallones para seleccionar") : "", StoreProfile_1.storeProfile.getState().type == "1" || StoreProfile_1.storeProfile.getState().type == "4" ? React.createElement("div", null, React.createElement("label", null, " Selecciona el tipo de unidad:", React.createElement("select", { defaultValue: null, value: StoreProfile_1.storeProfile.getState().selected, onChange: function onChange(evt) {
                    return _this2.selectedUnit(evt.target.value);
                } }, this.selectOptionsUnits())), StoreProfile_1.storeProfile.getState().selected != null ? React.createElement("button", { id: "addUnit", name: "addUnit", className: "addUnitButton", onClick: this.onClickAdd.bind(this) }, "A\xF1adir unidad") : "") : "", (StoreProfile_1.storeProfile.getState().type == "1" || StoreProfile_1.storeProfile.getState().type == "3") && StoreProfile_1.storeProfile.getState().selectedArmy != null ? React.createElement("div", null, "Nombre: ", React.createElement("input", { type: "text", value: this.state.name, onChange: function onChange(evt) {
                    return _this2.updateInput(evt.target.value);
                } }), React.createElement("button", { id: "setName", name: "setName", className: "setNameButton", onClick: this.onClickAdd.bind(this) }, "Establecer nombre")) : "", StoreProfile_1.storeProfile.getState().type == "5" && StoreProfile_1.storeProfile.getState().armies[StoreProfile_1.storeProfile.getState().selectedArmy].getArmy().length > 1 ? React.createElement("div", null, React.createElement("label", null, " Selecciona el tipo de unidad:", React.createElement("select", { defaultValue: null, value: StoreProfile_1.storeProfile.getState().selected, onChange: function onChange(evt) {
                    return _this2.selectedUnit(evt.target.value);
                } }, this.selectOptionsUnitsDelete())), StoreProfile_1.storeProfile.getState().selected != null ? React.createElement("button", { id: "deleteUnit", name: "deleteUnit", className: "deleteUnitButton", onClick: this.onClickDelete.bind(this) }, "Eliminar unidad") : "") : StoreProfile_1.storeProfile.getState().type == "5" && StoreProfile_1.storeProfile.getState().armies[StoreProfile_1.storeProfile.getState().selectedArmy].getArmy().length <= 1 ? React.createElement("div", { id: "error" }, "No hay unidades para eliminar") : "", StoreProfile_1.storeProfile.getState().selectedArmy != null && StoreProfile_1.storeProfile.getState().armies.length > StoreProfile_1.storeProfile.getState().selectedArmy ? React.createElement("div", null, React.createElement("p", null, "El batall\xF3n contiene:"), React.createElement("div", null, this.armyContent(null))) : "", StoreProfile_1.storeProfile.getState().type == "0" ? React.createElement("div", null, React.createElement("p", null, "Batallones del jugador:"), React.createElement("div", null, this.armyList())) : "");
        }
    }]);

    return Profile;
}(React.Component);

exports.Profile = Profile;