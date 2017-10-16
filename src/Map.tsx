import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { store, saveState } from './Store';
import { Actions, State, InitialState, Reducer } from './GameState';
import { Cell } from './Cell';
import { Unit } from './Unit';

/** Representa el mapa que contendrá las unidades y las casillas **/
export class Map extends React.Component<any, any> {
    /** @constructor  Deben introducirse los elementos horizontal y vertical **/
    constructor(props: any) {
        super(props);
        store.dispatch(Actions.generateSetListener(this));
    }

    /** Renderiza el mapa **/
    render() {
        // El mapa se renderizará en un div con estilo, por ello debemos usar className="map"
        return (
            <div id="map" className="map" onClick={this.onClick.bind(this)}>
                {this.generateMap().map((a: any) => {
                    return a;
                })}
            </div>
        );
    }

    /** Placeholder, contendrá la lógica de selección de la casilla correcta. **/
    onClick(e : React.MouseEvent<HTMLElement>) {
        console.log("Clicked on: ("+e.clientX+", "+e.clientY+")");

    }

    /** Función auxiliar usada para renderizar el mapa. Consiste en recorrer todas las columnas acumulando las casillas. **/
    generateMap() {
        var accum = [];
        // Repetirá este for hasta que se llegue al número de columnas especificado
        for(var i = 0; i < this.props.vertical; i++) {
            // Este método retornará una lista con las casillas en fila
            accum.push(this.generateCellRow(i));
        }

        return accum;
    }

    /** Función auxiliar que servirá para generar las casillas en una fila **/
    generateCellRow(num_row: number) {
        var accum2 = [];
        // Este bucle iterará hasta el número de celdas horizontales especificado en el props.
        for(var j = 0; j < this.props.horizontal; j++) {
            if(j == store.getState().position.x && num_row == store.getState().position.y){
                accum2.push(
                    <div className={"cell"}>
                        <Unit horizontal={j} vertical={num_row} />
                    </div>
                );
            }else{
                // Se introducirá el elemento en una lista
                accum2.push(
                    <Cell horizontal={j} vertical={num_row} />
                );
            }
        }

        // Se retorna en un div que dependiendo de que se trate de la fila par o impar, contendrá también la clase celRowOdd.
        return (
            <div className={"cellRow" + (num_row%2==0?"":" cellRowOdd")}>
                {accum2}
            </div>
        );
    }
}
