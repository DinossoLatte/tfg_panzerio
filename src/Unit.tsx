import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';

import { Pair } from './Utils';
import { Actions } from './GameState';
import { store, saveState } from './Store';
import { Cursor } from './Cursor';

export class Unit extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    //Con una variable externa se podría hacer que haya o no sprite de montaña etc
    //TODO En la id de unit debería ir la id de unit pero más adelante se añadirá
    render() {
        // Al igual que en Cell, primero obtenemos la posición del cursor
        let positionCursor = store.getState().cursorPosition;
        // Despues comprobando que esta casilla esté en esa posición
        let cursor = positionCursor.column == this.props.column && positionCursor.row == this.props.row?<Cursor />:null;
        //Comprobamos si es enemiga o no para cambiar su sprite
        let unitType = this.props.enemy?"enemy_unit":"unit";
        // Le añadiremos el resultado de la comprobación anterior.
        return (
            <div className="div_cell">
                <img className="cell" id={"hex"+this.props.row+"_"+this.props.column} src="imgs/hex_base.png" />
                <div className ="unit">
                    <img id={"unit"+this.props.row+"_"+this.props.column} src={"imgs/"+unitType+".png"} />
                </div>
                {cursor}
            </div>
        );
    }

}

//Estos son los stats de las unidades
export type Stats = {
    readonly movement: number,
    readonly type: string
}

//Al inicio serán estos, el tipo nos sirve para identificar la situacion, ejemplo, con buffo de ataque etc.
export const InitialStats: Stats = {
    movement: 2,
    type: "NONE"
}

//En principio no se realizarán cambios ya que solo nos centraremos en que el movimiento funcione
export const ReducerStats : Redux.Reducer<Stats> =
    (state: Stats = InitialStats, action: Redux.AnyAction) => {
        //Dependiendo del tipo se cambiarán las variables del estado
        switch(action.type) {
            case "NONE":
                return {
                    movement: state.movement,
                    type: "NONE"
                };
            default:
                return state;
    }
}
