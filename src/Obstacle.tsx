import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import { Pair } from './Utils';
import { Actions } from './GameState';
import { store, saveState } from './Store';

export class Obstacle extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    //Este es el render del obstacle
    render() {
        return (
                <div className ="obstacle">
                    <img id={"obstacle"+this.props.horizontal+"_"+this.props.vertical} src="imgs/obstacle.png" />
                </div>
        );
    }

}
