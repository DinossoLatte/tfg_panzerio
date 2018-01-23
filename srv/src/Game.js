"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Map_1 = require("./Map");
const GameState_1 = require("./GameState");
const Store_1 = require("./Store");
class EnterGameButton extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return React.createElement("button", { id: "enterGame", name: "enterGame", className: "enterGameButton", onClick: this.onClick.bind(this) }, "Jugar");
    }
    onClick() {
        // Realizamos una llamada al servidor para obtener el estado inicial de las partidas
        GameState_1.getInitialState(() => {
            // Cuando acabe, se ejecutará el callback, que es esto.
            this.props.parentObject.changeGameState(2);
            // Comprobamos si hay ganador o perdedor, en cuyo caso se reiniciará el estado al entrar en el juego
            if (Store_1.store.getState().map && Store_1.store.getState().actualState > 0) {
                // Si se ha producido esto, debemos reiniciar el estado
                Store_1.store.dispatch(GameState_1.Actions.finish());
                // Ejecutamos también el reiniciado de estado del mapa
                Store_1.store.getState().map.restartState();
            }
        });
    }
}
class OptionsMenuButton extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return React.createElement("button", { id: "optionsMenu", name: "optionsMenu", className: "optionsMenuButton", onClick: this.onClick.bind(this) }, "Acceder al menu de opciones");
    }
    onClick() {
        this.props.parentObject.changeGameState(1);
    }
}
class OptionsMenu extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return React.createElement("div", { className: "optionsMenu" },
            React.createElement("button", null, "Test"),
            React.createElement("button", null, "Test"),
            React.createElement("button", { id: "exitButton", name: "exitButton", onClick: this.onClick.bind(this) }, "Volver al menu"));
    }
    onClick(clickEvent) {
        this.props.parentObject.changeGameState(0);
    }
}
class PreGameMenu extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement("div", { className: "preGameMenu" },
            React.createElement("h2", null, "Menu de pre juego"),
            React.createElement("div", { className: "playerMenu" },
                React.createElement(SideOptionMenu, { player: true })),
            React.createElement("div", { className: "mapMenu" },
                React.createElement("select", null,
                    React.createElement("option", { id: "map1", selected: true }, "Mapa 1")),
                React.createElement("button", { onClick: this.startGame.bind(this) }, "Empezar juego"))));
    }
    startGame(event) {
        this.props.parentObject.setState({ gameState: 3 });
    }
}
class SideOptionMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = { player: props.player };
    }
    render() {
        return (React.createElement("div", { className: "sideOption" + this.state.player ? "Player" : "Enemy" },
            React.createElement("p", null, "Aqui vendr\u00E1n las opciones")));
    }
}
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = { gameState: 0 }; // 0 es el menu del juego, 1 será el menú de opciones y 2 será el menu pre juego, 3 el juego en sí
    }
    render() {
        let result;
        if (this.state.gameState == 2) {
            result = React.createElement(PreGameMenu, { parentObject: this });
        }
        else if (this.state.gameState == 3) {
            result = React.createElement(Map_1.Map, { horizontal: "6", vertical: "6", parentObject: this });
        }
        else if (this.state.gameState == 1) {
            result = React.createElement(OptionsMenu, { parentObject: this });
        }
        else {
            result = (React.createElement("div", { className: "menu" },
                React.createElement(EnterGameButton, { parentObject: this }),
                React.createElement("br", null),
                React.createElement(OptionsMenuButton, { parentObject: this }),
                React.createElement("br", null)));
        }
        return result;
    }
    changeGameState(stateNumber) {
        this.setState({ gameState: stateNumber });
    }
}
exports.Game = Game;
