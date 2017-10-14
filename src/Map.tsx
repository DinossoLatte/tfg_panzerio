import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { Cell } from './Cell';

class Map extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div id="map" className="map">
                {this.generateMap().map((a: any) => {
                    return a;
                })}
            </div>
        );
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
            accum2.push(
                <Cell />
            );
        }

        return (
            <div className={"cellRow" + (num_row%2==0?"":" cellRowOdd")}>
                {accum2}
            </div>
        );
    }
}

export { Map };
