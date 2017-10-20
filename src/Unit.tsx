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

    /*
    onMouseOver(event: React.MouseEvent<HTMLElement>) {
        let actualPosition : Pair = store.getState().position;
        let newPosition: Pair;
        if(actualPosition.x == 2) {
            if(actualPosition.y == 2) {
                newPosition = new Pair(0,0);
            } else {
                newPosition = new Pair(0, actualPosition.y+1);
            }
        } else {
            newPosition = new Pair(actualPosition.x+1, actualPosition.y);
        }

        console.log("X: "+newPosition.x);
        console.log("Y: "+newPosition.y);
        saveState(Actions.generateChangeUnitPos(0, newPosition));
    }
    */
}
