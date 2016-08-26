
import React from 'react';
import './stage.scss';
import QBicon from '../qbIcon/qbIcon';
import {Collapse, Well} from 'react-bootstrap';

import Logger from '../../utils/logger';
var logger = new Logger();

var Stage = React.createClass({

    propTypes: {
        pageActions: React.PropTypes.element,
        stageHeadline: React.PropTypes.node
    },

    getInitialState: function() {
        return {open: true};
    },

    toggleStage: function() {
        this.setState({open: !this.state.open});
        logger.debug('Click event: ' + this.state.stage + ' staging area');
    },

    render() {

        return (
            <div className="layout-stage">
                <div className="stageHeader">
                    <div className="stageLeft">
                        {this.props.stageHeadline}
                    </div>
                    <div className="stageRight pageActions">
                        {this.props.pageActions}
                    </div>
                </div>
                <Collapse in={this.state.open}>
                    <Well>{this.props.children}</Well>
                </Collapse>
                <button className="toggleStage" onClick={this.toggleStage} ><QBicon icon={this.state.open ? "caret-up" : "caret-down"} /></button>
            </div>);
    }

});

export default Stage;
