import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { store, saveState } from './Store';
import { Actions, State, InitialState, Reducer } from './GameState';
import { Cell } from './Cell';
import { Unit } from './Unit';

export class Map extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        store.dispatch(Actions.generateSetListener(this));
    }

    render() {
        return (
            <div id="map" className="map" onClick={this.onClick.bind(this)}>
                {this.generateMap().map((a: any) => {
                    return a;
                })}
            </div>
        );
    }

    onClick(e : React.MouseEvent<HTMLElement>) {
        console.log("Clicked on: ("+e.clientX+", "+e.clientY+")");

    }

    generateMap() {
        var accum = [];
        for(var i = 0; i < this.props.vertical; i++) {
            accum.push(this.generateCellRow(i));
        }

        return accum;
    }

    generateCellRow(num_row: number) {
        var accum2 = [];
        for(var j = 0; j < this.props.horizontal; j++) {
            if(j == store.getState().position.x && num_row == store.getState().position.y){
                accum2.push(
                    <div className={"cell"}>
                        <Unit horizontal={j} vertical={num_row} />
                    </div>
                );
            }else{
                accum2.push(
                    <Cell horizontal={j} vertical={num_row} />
                );
            }
        }

        return (
            <div className={"cellRow" + (num_row%2==0?"":" cellRowOdd")}>
                {accum2}
            </div>
        );
    }
}
