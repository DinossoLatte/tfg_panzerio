import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';

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
        return (
            <div className="cell">
                <img id={"hex"+this.props.horizontal+"_"+this.props.vertical} src="imgs/hex_base.png" />
            </div>
        );
    }

    /** Placeholder, contendrá la lógica de movimiento y otros **/
    onClick() {
        window.alert("Clicked on ("+this.props.horizontal+", "+this.props.vertical+")");
    }
}

export { Cell };
