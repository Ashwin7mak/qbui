import React from 'react';

import './trowser.scss';

/**
 * a transaction browser (like a modal but slides up/down and width=100%)
 */
let Trowser = React.createClass({
    propTypes: {
        visible: React.PropTypes.bool,
        position: React.PropTypes.string // top or bottom
    },
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
});

export default Trowser;
