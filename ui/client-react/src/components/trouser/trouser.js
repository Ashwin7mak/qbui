import React from 'react';

import './trouser.scss'

class Trouser extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.addEventListener("keydown",  (e) => {
            var keyCode = e.keyCode;

            if(keyCode == 27) {
                this.props.onHide();
            }
        }, false);
    }

    render() {
        return (
            <div className={(this.props.visible ? "visible " : "") + "trouser"} >
                {this.props.children}
            </div>
        );
    }
}

export default Trouser;