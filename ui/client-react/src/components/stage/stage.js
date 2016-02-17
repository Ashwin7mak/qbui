
import React from 'react';
import './stage.scss';
import QBicon from '../qbIcon/qbIcon';
import {Collapse, Well} from 'react-bootstrap';

import Logger from '../../utils/logger';
var logger = new Logger();

//dangerouslySetInnerHTML={{__html: this.props.stageContent}}

var Stage = React.createClass({

    getInitialState: function() {
        return {open: true};
    },

    toggleStage: function() {
        this.setState({open: !this.state.open});
        logger.debug('Click event: ' + this.state.stage + ' staging area');
    },

    render: function() {

        let classes = 'layout-stage ';// + (this.state.open ? 'stage-open' : 'state-closed');

        return (
            <div className={classes}>
                <Collapse in={this.state.open}>
                    <Well>{this.props.children}</Well>
                </Collapse>
                <button className="toggleStage" onClick={this.toggleStage} ><QBicon icon={this.state.open ? "caret-up" : "caret-down"} /></button>
            </div>);
    }

});

export default Stage;
