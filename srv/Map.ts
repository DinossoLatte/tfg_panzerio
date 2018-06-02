import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';

/** Representa el mapa que contendrá las unidades y las casillas **/
export class Map {
    rows : number;
    columns: number;

    constructor(rows: number, columns: number) {
        this.rows = rows;
        this.columns = columns;
    }

    getColumns() {
        return this.columns;
    }

    getRows() {
        return this.rows;
    }

    setColumns(x: number) {
        this.columns = x;
    }

    setRows(y: number) {
        this.rows = y;
    }
}
