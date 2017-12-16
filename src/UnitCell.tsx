import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';

import { Pair } from './Utils';
import { Actions } from './GameState';
import { store, saveState } from './Store';

export class UnitCell extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        //Comprobamos si es enemiga o no para cambiar su sprite
        let enemy = !this.props.unit.player?"enemy_":"";
        // Le añadiremos el resultado de la comprobación anterior.
        return (
            <div className ="unit">
                <img id={"unit"+this.props.unit.position.getRow()+"_"+this.props.unit.position.getColumn()} src={"imgs/"+enemy+this.props.unit.type+".png"} />
            </div>
        );
    }

}
