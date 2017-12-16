import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';

import { store } from './Store';
import { TerrainCell } from './TerrainCell';
import { UnitCell } from './UnitCell';
import { Pair, myIndexOf } from './Utils';
import * as Terrain from './Terrains';

/**
    Esta clase consiste en la representación de una casilla dentro del mapa
    @constructor Incluye los atributos HTML: horizontal y vertical.
**/
class Cell extends React.Component<any, any> {
    /** Debe introducirse los atributos horizontal y vertical
        @param props debe contener horizontal y vertical**/
    constructor(props : any) {
        super(props);
        let pair = new Pair(props.row, props.column);
        let indexTerrain = myIndexOf(store.getState().terrains.map(x => x.position), pair);
        this.state = {
            terrain: indexTerrain > -1?store.getState().terrains[indexTerrain]:Terrain.Plains.create(new Pair(props.row, props.column)),
        }
    }

    /** Renderiza el objeto **/
    render() {
        // Comprobamos si una unidad está en esta posición
        let indexUnit = myIndexOf(store.getState().units.map(x => x.position), this.state.terrain.position);
        let unit = indexUnit == -1?null:store.getState().units[indexUnit];
        // Comprobamos si la casilla actual contiene el cursor, primero obteniendo su posición
        let positionCursor = store.getState().cursorPosition;
        // Despues comprobando que esta casilla esté en esa posición
        let cursor = positionCursor.column == this.props.column && positionCursor.row == this.props.row;
        return (
                <div className="div_cell">
                    <img className="cell" id={"hex"+this.props.row+"_"+this.props.column}
                        src={cursor?this.props.selected?"imgs/hex_base_numpad_selected.png":"imgs/hex_base_numpad.png":this.props.selected?"imgs/hex_base_selected.png":"imgs/hex_base.png"} />
                    <TerrainCell terrain={this.state.terrain} />
                    {unit!=null?<UnitCell unit={unit} />:""}
                </div>
        );
    }
}

export { Cell };
