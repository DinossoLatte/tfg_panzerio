import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Map } from './Map';

// Representa la aplicación, por ahora únicamente el mapa
ReactDOM.render(<Map horizontal="5" vertical="8" />, document.getElementById("root"));
