import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';

import { Cell } from './Cell';
import { storeEdit } from './StoreEdit';
import { TerrainCell } from './TerrainCell';
import { UnitCell } from './UnitCell';
import { Pair, myIndexOf } from './Utils';
import * as Terrain from './Terrains';

const baseRoute = "imgs/hex_base.png";
const numpadRoute = "imgs/hex_base_numpad.png";

//ESta clase es similar a Cell pero obteniendo los datos de storeEdit (quizas se pudiera generalizar y de esa forma juntar con Cell)
export class EditCell extends React.Component<any, any> {
    constructor(props : any) {
        super(props);
    }

    /** Renderiza el objeto **/
    render() {
        // Comprobamos si una unidad está en esta posición
        // Comprobamos si la casilla actual contiene el cursor, primero obteniendo su posición
        let positionCursor = storeEdit.getState().cursorPosition;
        // Despues comprobando que esta casilla esté en esa posición
        let cursor = positionCursor.column == this.props.column && positionCursor.row == this.props.row;
        let pair = new Pair(this.props.row, this.props.column);
        // .filter( != null) es necesario, al añadirse nulls al terreno si no hay ninguno
        let indexTerrain = myIndexOf(storeEdit.getState().terrains.filter(elem => elem != null).map(x => x.position), pair);
        let terrain = indexTerrain > -1?storeEdit.getState().terrains[indexTerrain]:Terrain.Plains.create(pair);
        return (
                <div className="div_cell">
                    <img className="cell" id={"hex"+this.props.row+"_"+this.props.column}
                        src={
                            cursor?numpadRoute
                            :baseRoute} />
                    <TerrainCell terrain={terrain} />
                </div>
        );
    }
}
