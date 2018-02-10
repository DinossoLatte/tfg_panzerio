import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';

import { storeEdit, saveState } from './StoreEdit';
import { ReducerEdit, StateEdit, InitialStateEdit} from './GameEditState';
import { Cell } from '../src/Cell';
import { EditCell } from '../src/EditCell';
import { TerrainCell } from '../src/TerrainCell';
import { Pair, Cubic, myIndexOf, CUBIC_DIRECTIONS, myIndexOfCubic, Pathfinding } from '../src/Utils';
import { UnitCell } from '../src/UnitCell';
import { UnitStats } from '../src/UnitStats';
import { EditStats } from '../src/EditStats';
import { Unit, Infantry, Tank, General, UNITS, UNITS_ESP } from '../src/Unit';
import { Terrain, Plains, ImpassableMountain, Hills, Forest, TERRAINS, TERRAINS_ESP } from '../src/Terrains';

export class EditMap {
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
