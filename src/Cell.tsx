import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';

import { Cursor } from './Cursor';
import { store } from './Store';

/**
    Esta clase consiste en la representación de una casilla dentro del mapa
    @constructor Incluye los atributos HTML: horizontal y vertical.
**/
class Cell extends React.Component<any, any> {
    /** Debe introducirse los atributos horizontal y vertical
        @param props debe contener horizontal y vertical**/
    constructor(props : any) {
        super(props);
    }

    /** Renderiza el objeto **/
    render() {
        // Comprobamos si la casilla actual contiene el cursor, primero obteniendo su posición
        let positionCursor = store.getState().cursorPosition;
        // Despues comprobando que esta casilla esté en esa posición
        let cursor = positionCursor.x == this.props.horizontal && positionCursor.y == this.props.vertical?<Cursor />:null;
        // Le añadiremos el resultado de la comprobación anterior.
        return (
                <div className="div_cell">
                    <img className="cell" id={"hex"+this.props.horizontal+"_"+this.props.vertical} src={this.props.selected?"imgs/hex_base_selected.png":"imgs/hex_base.png"} />
                    {cursor}
                </div>
        );
    }
}

export { Cell };
