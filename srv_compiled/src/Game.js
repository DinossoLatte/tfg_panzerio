"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Map_1 = require("./Map");
var GameState_1 = require("./GameState");
var EditMap_1 = require("./EditMap");
var Store_1 = require("./Store");
var Utils_1 = require("./Utils");
var Profile_1 = require("./Profile");

var EnterGameButton = function (_React$Component) {
    _inherits(EnterGameButton, _React$Component);

    function EnterGameButton(props) {
        _classCallCheck(this, EnterGameButton);

        return _possibleConstructorReturn(this, (EnterGameButton.__proto__ || Object.getPrototypeOf(EnterGameButton)).call(this, props));
    }

    _createClass(EnterGameButton, [{
        key: "render",
        value: function render() {
            return React.createElement("button", { id: "enterGame", name: "enterGame", className: "enterGameButton", onClick: this.onClick.bind(this) }, "Jugar");
        }
    }, {
        key: "onClick",
        value: function onClick() {
            var _this2 = this;

            // Realizamos una llamada al servidor para obtener el estado inicial de las partidas
            GameState_1.getInitialState(function () {
                // Reiniciamos el estado
                Store_1.store.dispatch(GameState_1.Actions.generateFinish());
                // Y también cambiamos el estado del juego
                _this2.props.parentObject.changeGameState(5);
                // Comprobamos si hay ganador o perdedor, en cuyo caso se reiniciará el estado al entrar en el juego
                if (Store_1.store.getState().map && Store_1.store.getState().actualState > 0) {
                    // Si se ha producido esto, debemos reiniciar el estado
                    Store_1.store.dispatch(GameState_1.Actions.generateFinish());
                    // Ejecutamos también el reiniciado de estado del mapa
                    Store_1.store.getState().map.restartState();
                }
            });
        }
    }]);

    return EnterGameButton;
}(React.Component);

var EditGameButton = function (_React$Component2) {
    _inherits(EditGameButton, _React$Component2);

    function EditGameButton(props) {
        _classCallCheck(this, EditGameButton);

        return _possibleConstructorReturn(this, (EditGameButton.__proto__ || Object.getPrototypeOf(EditGameButton)).call(this, props));
    }

    _createClass(EditGameButton, [{
        key: "render",
        value: function render() {
            return React.createElement("button", { id: "editGame", name: "editGame", className: "editGameButton", onClick: this.onClick.bind(this) }, "Acceder a la edici\xF3n de mapa");
        }
    }, {
        key: "onClick",
        value: function onClick() {
            this.props.parentObject.changeGameState(3);
        }
    }]);

    return EditGameButton;
}(React.Component);

var ProfileButton = function (_React$Component3) {
    _inherits(ProfileButton, _React$Component3);

    function ProfileButton(props) {
        _classCallCheck(this, ProfileButton);

        return _possibleConstructorReturn(this, (ProfileButton.__proto__ || Object.getPrototypeOf(ProfileButton)).call(this, props));
    }

    _createClass(ProfileButton, [{
        key: "render",
        value: function render() {
            return React.createElement("button", { id: "profileButton", name: "profileButton", className: "profileButton", onClick: this.onClick.bind(this) }, "Acceder al perfil personal");
        }
    }, {
        key: "onClick",
        value: function onClick() {
            this.props.parentObject.changeGameState(6);
        }
    }]);

    return ProfileButton;
}(React.Component);

var OptionsMenuButton = function (_React$Component4) {
    _inherits(OptionsMenuButton, _React$Component4);

    function OptionsMenuButton(props) {
        _classCallCheck(this, OptionsMenuButton);

        return _possibleConstructorReturn(this, (OptionsMenuButton.__proto__ || Object.getPrototypeOf(OptionsMenuButton)).call(this, props));
    }

    _createClass(OptionsMenuButton, [{
        key: "render",
        value: function render() {
            return React.createElement("button", { id: "optionsMenu", name: "optionsMenu", className: "optionsMenuButton", onClick: this.onClick.bind(this) }, "Acceder al menu de opciones");
        }
    }, {
        key: "onClick",
        value: function onClick() {
            this.props.parentObject.changeGameState(1);
        }
    }]);

    return OptionsMenuButton;
}(React.Component);

var OptionsMenu = function (_React$Component5) {
    _inherits(OptionsMenu, _React$Component5);

    function OptionsMenu(props) {
        _classCallCheck(this, OptionsMenu);

        return _possibleConstructorReturn(this, (OptionsMenu.__proto__ || Object.getPrototypeOf(OptionsMenu)).call(this, props));
    }

    _createClass(OptionsMenu, [{
        key: "render",
        value: function render() {
            return React.createElement("div", { className: "optionsMenu" }, React.createElement("button", null, "Test"), React.createElement("button", null, "Test"), React.createElement("button", { id: "exitButton", name: "exitButton", onClick: this.onClick.bind(this) }, "Volver al menu"));
        }
    }, {
        key: "onClick",
        value: function onClick(clickEvent) {
            this.props.parentObject.changeGameState(0);
        }
    }]);

    return OptionsMenu;
}(React.Component);

var PreGameMenu = function (_React$Component6) {
    _inherits(PreGameMenu, _React$Component6);

    function PreGameMenu(props) {
        _classCallCheck(this, PreGameMenu);

        var _this7 = _possibleConstructorReturn(this, (PreGameMenu.__proto__ || Object.getPrototypeOf(PreGameMenu)).call(this, props));

        _this7.state = {
            custom: false
        };
        return _this7;
    }

    _createClass(PreGameMenu, [{
        key: "render",
        value: function render() {
            // En el caso de querer usar un mapa, mostramos una zona para ponerlo
            var customMap = this.state.custom ? React.createElement("textarea", { id: "customMap" }, "Introduzca el JSON aqui") : "";
            return React.createElement("div", { className: "preGameMenu" }, React.createElement("h2", null, "Menu de pre juego"), React.createElement("div", { className: "playerMenu" }, React.createElement(SideOptionMenu, { player: true })), React.createElement("div", { className: "mapMenu" }, React.createElement("select", { id: "map", onClick: this.updateMap.bind(this) }, React.createElement("option", { id: "map1", selected: true }, "Mapa 1"), React.createElement("option", { id: "custom" }, "Personalizado")), customMap, React.createElement("button", { onClick: this.startGame.bind(this) }, "Empezar juego"), React.createElement("button", { onClick: this.exitPreGame.bind(this) }, "Volver")));
        }
    }, {
        key: "startGame",
        value: function startGame(event) {
            // Definimos las dimensiones básicas del mapa
            var rows = 6;
            var columns = 6;
            // Antes de ejecutar, comprobamos que exista un mapa personalizado
            if (this.state.custom) {
                // Primero, obtenemos el JSON resultante
                var custom = JSON.parse(document.getElementById("customMap").value);
                // Obtenemos por un lado el mapa
                var newMap = Utils_1.Network.parseMap(custom.map);
                // Y cambiamos el estado para tener esto en cuenta
                Store_1.store.dispatch(GameState_1.Actions.generateCustomMap(newMap));
                // Modificamos las dimensiones del mapa
                rows = custom.rows;
                columns = custom.columns;
            }
            this.props.parentObject.setState({
                gameState: 2,
                rows: rows,
                columns: columns
            });
        }
        // Actualiza el componente de poder introducir el mapa, en el caso de seleccionar
        // la opción de 'Personalizado'.

    }, {
        key: "updateMap",
        value: function updateMap(mouseEvent) {
            // Comprobamos que el select tenga seleccionado el 'custom'
            var select = document.getElementById("map");
            if (select.options[select.selectedIndex].id == "custom") {
                this.setState({ custom: true });
            } else {
                this.setState({ custom: false });
            }
        }
    }, {
        key: "exitPreGame",
        value: function exitPreGame(mouseEvent) {
            // Para salir, cambiamos el estado del menu del juego.
            this.props.parentObject.setState({ gameState: 0 });
        }
    }]);

    return PreGameMenu;
}(React.Component);

var SideOptionMenu = function (_React$Component7) {
    _inherits(SideOptionMenu, _React$Component7);

    function SideOptionMenu(props) {
        _classCallCheck(this, SideOptionMenu);

        var _this8 = _possibleConstructorReturn(this, (SideOptionMenu.__proto__ || Object.getPrototypeOf(SideOptionMenu)).call(this, props));

        _this8.state = { player: props.player };
        return _this8;
    }

    _createClass(SideOptionMenu, [{
        key: "render",
        value: function render() {
            return React.createElement("div", { className: "sideOption" + this.state.player ? "Player" : "Enemy" }, React.createElement("p", null, "Aqui vendr\xE1n las opciones del jugador ", this.state.player ? "Aliado" : "Enemigo"));
        }
    }]);

    return SideOptionMenu;
}(React.Component);

var CreateMenu = function (_React$Component8) {
    _inherits(CreateMenu, _React$Component8);

    function CreateMenu(props) {
        _classCallCheck(this, CreateMenu);

        var _this9 = _possibleConstructorReturn(this, (CreateMenu.__proto__ || Object.getPrototypeOf(CreateMenu)).call(this, props));

        _this9.state = { error: false };
        return _this9;
    }

    _createClass(CreateMenu, [{
        key: "render",
        value: function render() {
            var _this10 = this;

            return React.createElement("div", { className: "optionsMenu" }, React.createElement("div", null, "Anchura: ", React.createElement("input", { type: "text", value: this.props.parentObject.state.editx, onChange: function onChange(evt) {
                    return _this10.updateInput(evt.target.value, _this10.props.parentObject.state.edity);
                } })), React.createElement("div", null, "Altura: ", React.createElement("input", { type: "text", value: this.props.parentObject.state.edity, onChange: function onChange(evt) {
                    return _this10.updateInput(_this10.props.parentObject.state.editx, evt.target.value);
                } })), this.state.error ? React.createElement("div", { id: "error" }, "Deben introducirse valores num\xE9ricos") : "", React.createElement("button", { id: "createButton", name: "createButton", onClick: this.onClick.bind(this) }, "Crear mapa"), React.createElement("button", { id: "exitButton", name: "exitButton", onClick: this.onClickExit.bind(this) }, "Volver al menu"));
        }
    }, {
        key: "updateInput",
        value: function updateInput(x, y) {
            this.props.parentObject.setMapSize(x, y);
        }
    }, {
        key: "onClick",
        value: function onClick(clickEvent) {
            if (this.props.parentObject.state.editx.match(/^\d+$/g) && this.props.parentObject.state.edity.match(/^\d+$/g)) {
                this.setState({ error: false });
                this.props.parentObject.changeGameState(4);
            } else {
                this.setState({ error: true });
                this.props.parentObject.changeGameState(3);
            }
        }
    }, {
        key: "onClickExit",
        value: function onClickExit(clickEvent) {
            this.setState({ error: false });
            this.props.parentObject.changeGameState(0);
        }
    }]);

    return CreateMenu;
}(React.Component);

var Game = function (_React$Component9) {
    _inherits(Game, _React$Component9);

    function Game(props) {
        _classCallCheck(this, Game);

        var _this11 = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, props));

        _this11.state = { gameState: 0, editx: "5", edity: "5" }; // 0 es el menu del juego, 1 será el menú de opciones, 2 el juego, 3 edición de map y 5 el pre juego
        return _this11;
    }

    _createClass(Game, [{
        key: "render",
        value: function render() {
            var result = void 0;
            switch (this.state.gameState) {
                case 1:
                    result = React.createElement(OptionsMenu, { parentObject: this });
                    break;
                case 2:
                    result = React.createElement(Map_1.Map, { horizontal: this.state.rows, vertical: this.state.columns, parentObject: this });
                    break;
                case 3:
                    result = React.createElement(CreateMenu, { parentObject: this });
                    break;
                case 4:
                    result = React.createElement(EditMap_1.EditMap, { horizontal: this.state.editx, vertical: this.state.edity, parentObject: this });
                    break;
                case 5:
                    result = React.createElement(PreGameMenu, { parentObject: this });
                    break;
                case 6:
                    result = React.createElement(Profile_1.Profile, { parentObject: this });
                    break;
                default:
                    result = React.createElement("div", { className: "menu" }, React.createElement(EnterGameButton, { parentObject: this }), React.createElement("br", null), React.createElement(EditGameButton, { parentObject: this }), React.createElement("br", null), React.createElement(ProfileButton, { parentObject: this }), React.createElement("br", null), React.createElement(OptionsMenuButton, { parentObject: this }), React.createElement("br", null));
                    break;
            }
            return result;
        }
    }, {
        key: "changeGameState",
        value: function changeGameState(stateNumber) {
            this.setState({ gameState: stateNumber, editx: this.state.editx, edity: this.state.edity });
        }
    }, {
        key: "setMapSize",
        value: function setMapSize(x, y) {
            this.setState({ gameState: this.state.gameState, editx: x, edity: y });
        }
    }]);

    return Game;
}(React.Component);

exports.Game = Game;