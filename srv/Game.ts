import * as Redux from 'redux';
import * as WebSocket from 'ws';

import { State, Reducer } from './GameState';
import { Store } from './Store';

export class Game {
    player1URL: WebSocket;
    player2URL: WebSocket;
    player1FinishedSelection: boolean;
    player2FinishedSelection: boolean;
    state: State;
    store: Store;

    private static hexValues: string[] = [ '0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F' ];

    static create(player1URL: WebSocket, player2URL: WebSocket, initialState: State): Game {
        let game = new Game(player1URL, initialState);
        game.player2URL = player2URL;
        return game;
    }

    constructor(player1URL: WebSocket, initialState: State) {
        this.player1URL = player1URL;
        this.state = initialState;
        this.player1FinishedSelection = false;
        this.player2FinishedSelection = false;
        this.state = initialState;
        this.store = Redux.createStore<State>(Reducer);
    }

    public static generateRandomIdentifier(): string {
        let result = "";
        for(let i = 0; i < 10; i++) { // Identificador de hasta 10 números
            let index = Math.floor(Math.random() * 17);
            result.concat(Game.hexValues[index]);
        }

        return result;
    }

}