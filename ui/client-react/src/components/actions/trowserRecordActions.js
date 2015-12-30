import React from 'react';
import ReactIntl from 'react-intl';

import Hicon from '../harmonyIcon/harmonyIcon';
import './trowserRecordActions.scss';

/**
 * additional record actions
 */
let TrowserRecordActions = React.createClass({

    propTypes: {
        onClose: React.PropTypes.func
    },
    render() {

        return (
            <div className={"trowserRecordActions"}>
                <a href="#" className="closeRecordActions" onClick={this.props.onClose}><Hicon icon="close" /></a>
                <ul>
                    <li>Extra action 1 goes here</li>
                    <li>Extra action 2 goes here</li>
                    <li>Extra action 3 goes here</li>
                </ul>
            </div>);
    }
});

export default TrowserRecordActions;
