import React from 'react';

import './trowser.scss';

class Trowser extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className={(this.props.visible ? "visible " : "") + "trowser"} >
                {this.props.children}
            </div>
        );
    }
}

export default Trowser;
