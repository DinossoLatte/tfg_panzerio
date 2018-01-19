import * as React from 'react';
import * as Redux from 'redux';
import { Map } from './Map';
import { Actions, getInitialState } from './GameState';
import { store } from './Store';

class EnterGameButton extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return <button id="enterGame" name="enterGame" className="enterGameButton" onClick={this.onClick.bind(this)}>Jugar</button>
    }

    onClick() {
        // Realizamos una llamada al servidor para obtener el estado inicial de las partidas
        getInitialState(() => {
            // Cuando acabe, se ejecutará el callback, que es esto.
            this.props.parentObject.changeGameState(2);
            // Comprobamos si hay ganador o perdedor, en cuyo caso se reiniciará el estado al entrar en el juego
            if (store.getState().map && store.getState().map.actualstate > 0) {
                // Si se ha producido esto, debemos reiniciar el estado
                store.dispatch(Actions.finish());
                // Ejecutamos también el reiniciado de estado del mapa
                store.getState().map.restartState();
            }
        });   
    }
}

class OptionsMenuButton extends React.Component<any, any> {
    constructor(props : any) {
        super(props);
    }

    render() {
        return <button id="optionsMenu" name="optionsMenu" className="optionsMenuButton" onClick={this.onClick.bind(this)}>Acceder al menu de opciones</button>
    }

    onClick() {
        this.props.parentObject.changeGameState(1);
    }
}

class OptionsMenu extends React.Component<any, any> {
    constructor(props : any) {
        super(props);
    }

    render() {
        return <div className="optionsMenu">
            <button>Test</button>
            <button>Test</button>
            <button id="exitButton" name="exitButton" onClick={this.onClick.bind(this)}>Volver al menu</button>
        </div>
    }

    onClick(clickEvent : React.MouseEvent<HTMLElement>) {
        this.props.parentObject.changeGameState(0);
    }
}

class Game extends React.Component<any, any> {
    constructor(props : any) {
        super(props);
        this.state = { gameState: 0 }; // 0 es el menu del juego, 1 será el menú de opciones y 2 será el juego
    }

    render() {
        let result: any;
        if(this.state.gameState == 2) {
            result = <Map horizontal="6" vertical="6" parentObject={this} />
        } else if(this.state.gameState == 1) {
            result = <OptionsMenu parentObject={this} />
        } else {
            result = (
            <div className="menu">
                <EnterGameButton parentObject={this} /><br/>
                <OptionsMenuButton parentObject={this} /><br/>
            </div>
            );
        }

        return result;
    }

    changeGameState(stateNumber: number) {
        this.setState({ gameState: stateNumber });
    }
}

export { Game };
