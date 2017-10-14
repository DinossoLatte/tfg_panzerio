import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';

class Cell extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="cell">
                <img src="imgs/hex_base.png" />
            </div>
        );
    }
}

export { Cell };
