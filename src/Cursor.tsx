import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';

export class Cursor extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <img src="imgs/hex_numpad_selected.png" id="selector" className="selector" />
        );
    }
}