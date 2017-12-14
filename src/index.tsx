import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Game } from './Game';

// Representa la aplicación, por ahora únicamente el mapa
export function main() {
    ReactDOM.render(<Game />, document.getElementById("root"));
}

main();