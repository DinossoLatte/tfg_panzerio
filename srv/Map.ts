import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { store, saveState } from './Store';
import { State, InitialState, Reducer} from './GameState';
import { Cell } from '../src/Cell';
import { TerrainCell } from '../src/TerrainCell';
import { Pair, Cubic, myIndexOf, myIndexOfCubic, Pathfinding } from '../src/Utils';
import { Unit, UNITS, UNITS_ESP } from '../src/Unit';
import { Plains } from '../src/Terrains';
import { UnitCell } from '../src/UnitCell';
import { UnitStats } from '../src/UnitStats';

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
