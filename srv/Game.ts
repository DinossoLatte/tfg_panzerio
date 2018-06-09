import * as Redux from 'redux';
import * as WebSocket from 'ws';

import { GameState, State } from './GameState';
import { GameStore } from './Store';

export class Game {
    player1URL: WebSocket;
    player2URL: WebSocket;
    player1FinishedSelection: boolean;
    player2FinishedSelection: boolean;
    currentState: number; // 0 -> Por empezar (unible), 1 -> En progreso, 2 -> Terminado (sobreescribible).
    gameState: GameState;
    store: GameStore;

    private static hexValues: string[] = [ '0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F' ];

    static create(player1URL: WebSocket, player2URL: WebSocket, initialState: State): Game {
        let game = new Game(player1URL, initialState);
        game.player2URL = player2URL;
        return game;
    }

    constructor(player1URL: WebSocket, initialState: State) {
        this.player1URL = player1URL;
        this.player1FinishedSelection = false;
        this.player2FinishedSelection = false;
        this.gameState = new GameState();
        this.store = new GameStore(this.gameState.Reducer);
        this.currentState = 0;
    }

    public static generateRandomIdentifier(): string {
        let result = "";
        for(let i = 0; i < 10; i++) { // Identificador de hasta 10 números
            let index = Math.floor(Math.random() * 16);
            result = result.concat(Game.hexValues[index]);
        }

        return result;
    }

    getState() {
        return this.store.store.getState();
    }

}