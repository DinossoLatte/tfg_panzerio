import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { Pair } from './Utils';
import { Actions } from './GameState';
import { store, saveState } from './Store';

export class Unit extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    //Con una variable externa se podría hacer que haya o no sprite de montaña etc
    //TODO En la id de unit debería ir la id de unit pero más adelante se añadirá
    render() {
        return (
            <div className={"cell"}>
                <img id={"hex"+this.props.horizontal+"_"+this.props.vertical} src="imgs/hex_base.png" />
                <div className ={"unit"}>
                    <img id={"unit"+this.props.horizontal+"_"+this.props.vertical} src="imgs/unit.png" />
                </div>
            </div>

        );
    }

}
