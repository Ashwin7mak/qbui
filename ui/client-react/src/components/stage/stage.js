
import React from 'react';
import './stage.scss';


import {Collapse} from 'react-bootstrap';

import Logger from '../../utils/logger';
var logger = new Logger();

//dangerouslySetInnerHTML={{__html: this.props.stageContent}}

var Stage = React.createClass({


    getInitialState: function() {
        return {open: true};
    },
    toggleStage: function() {
        this.setState({open: !this.state.open})
        logger.debug('Click event: ' + this.state.stage + ' staging area');
    },
    render: function() {

        let classes = 'layout-stage ' + (this.state.open ? 'stage-open' : 'state-closed');

        return(
            <div className={classes}>
                <Collapse in={this.state.open}>
                <div id="layout-stage-content" className="layout-stage-content">{this.props.children}</div>
                </Collapse>
                <button onClick={this.toggleStage} className="tab arrow"></button>
            </div>);

    }

/*
    getInitialState: function() {
        return {stage: 'open'};
    },

    toggleStage: function() {
        this.setState({stage: this.state.stage === 'open' ? 'closed' : 'open'})
        logger.debug('Click event: ' + this.state.stage + ' staging area');
    },

    render: function() {
        var stageClass = this.state.stage === 'open' ? 'layout-stage stage-open' : 'layout-stage stage-close';
        return <div className={stageClass}>
            <div id="layout-stage-content" className="layout-stage-content">{this.props.children}</div>
            <button onClick={this.toggleStage} className="tab arrow"></button>
        </div>
    }
*/
});

export default Stage;