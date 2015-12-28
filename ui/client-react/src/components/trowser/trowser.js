import React from 'react';

import './trowser.scss';

class Trowser extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        let trowserClasses = "trowser " + this.props.position;
        if (this.props.visible) {
            trowserClasses += " visible";
        }
        return (
            <div className={trowserClasses} >
                {this.props.children}
            </div>
        );
    }
}

export default Trowser;
