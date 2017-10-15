import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';

class Cell extends React.Component<any, any> {
    constructor(props : any) {
        super(props);
    }

    render() {
        return (
            <div className="cell">
                <img id={"hex"+this.props.horizontal+"_"+this.props.vertical} src="imgs/hex_base.png" />
            </div>
        );
    }

    onClick() {
        window.alert("Clicked on ("+this.props.horizontal+", "+this.props.vertical+")");
    }
}

export { Cell };
