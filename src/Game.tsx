import * as React from 'react';
import * as Redux from 'redux';
import { Map } from './Map';

class EnterGameButton extends React.Component<any, any> {
    constructor(props: any) {
        super();
    }

    render() {
        return <button id="enterGame" name="enterGame" className="enterGameButton" onClick={this.onClick.bind(this)}>Jugar</button>
    }

    onClick() {
        this.props.parentObject.changeGameState(2);
    }
}

class OptionsMenuButton extends React.Component<any, any> {
    constructor(props : any) {
        super();
    }

    render() {
        return <button id="optionsMenu" name="optionsMenu" className="optionsMenuButton" onClick={this.onClick.bind(this)}>Acceder al menu de opciones</button>
    }

    onClick() {
        this.props.parentObject.changeGameState(1);
    }
}

class OptionsMenu extends React.Component<any, any> {
    constructor() {
        super();
    }

    render() {
        return <div className="optionsMenu">
            <button />
            <button />
            <button id="exitButton" name="exitButton" onClick={this.onClick.bind(this)} />
        </div>
    }

    onClick(clickEvent : React.MouseEvent<HTMLElement>) {
        this.props.parentObject.changeGameState(0);
    }
}

class Game extends React.Component<any, any> {
    constructor() {
        super();
        this.state = { gameState: 0 }; // 0 es el menu del juego, 1 será el menú de opciones y 2 será el juego
    }

    render() {
        let result: any;
        if(this.state.gameState == 2) {
            result = <Map horizontal="8" vertical="8" parentObject={this} />
        } else if(this.state.gameState == 1) {
            result = <OptionsMenu parentObject={this} />
        } else {
            result = (
            <div className="menu">
                <EnterGameButton parentObject={this} />
                <OptionsMenuButton parentObject={this} />
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
