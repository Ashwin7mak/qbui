import React from 'react';
import ReactIntl from 'react-intl';

import Hicon from '../harmonyIcon/harmonyIcon';
import './trowserRecordActions.scss';

/**
 * additional record actions
 */
let TrowserRecordActions = React.createClass({

    propTypes: {

    },
    render() {

        return (
            <div className={"trowserRecordActions"}>
                <a href="#" className="closeRecordActions" onClick={this.props.onClose}><Hicon icon="close" /></a>
                <ul>
                    <li>Extra action 1</li>
                    <li>Extra action 2</li>
                    <li>Extra action 3</li>
                </ul>
            </div>);
    }
});

export default TrowserRecordActions;
