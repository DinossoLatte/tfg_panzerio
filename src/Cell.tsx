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
        // Comprobación de que exista una unidad seleccionada
        let anyUnitSelected = store.getState().selectedUnit != null;
        // Comprobación si la unidad en la posición de la celda es usada
        let isUnitUsed = unit == null?false:unit.used;
        // Comprobación de la unidad seleccionada es la de la celda
        let isUnitSelected = anyUnitSelected && store.getState().units[store.getState().selectedUnit].position.equals(this.state.terrain.position);
        // Comprobación de que la casilla actual sea visitable o atacable por la unidad seleccionada
        let isCellVisitable = anyUnitSelected && myIndexOf(store.getState().visitables, this.state.terrain.position) > -1;
        // Compobación de la unidad en nuestra posición es atacable
        let isUnitAttackable = (isCellVisitable && unit != null)&& ((unit.player && store.getState().turn%2!=0) || (!unit.player && store.getState().turn%2==0));
        // Comprobamos si la casilla actual contiene el cursor, primero obteniendo su posición
        let positionCursor = store.getState().cursorPosition;
        // Despues comprobando que esta casilla esté en esa posición
        let cursor = positionCursor.column == this.props.column && positionCursor.row == this.props.row;
        return (
                <div className="div_cell">
                    <img className="cell" id={"hex"+this.props.row+"_"+this.props.column}
                        src={
                            cursor?isUnitUsed?"imgs/hex_base_numpad_used.png"
                                :isUnitSelected?"imgs/hex_base_numpad_actual.png"
                                :isUnitAttackable?"imgs/hex_base_numpad_attack.png"
                                :isCellVisitable?"imgs/hex_base_numpad_selected.png"
                                :"imgs/hex_base_numpad.png"
                            :isUnitUsed?"imgs/hex_base_used.png"
                            :isUnitSelected?"imgs/hex_base_actual.png"
                            :isUnitAttackable?"imgs/hex_base_attack.png"
                            :isCellVisitable?"imgs/hex_base_selected.png"
                            :"imgs/hex_base.png"} />
                    <TerrainCell terrain={this.state.terrain} />
                    {unit!=null?<UnitCell unit={unit} />:""}
                </div>
        );
    }
}

export { Cell };
