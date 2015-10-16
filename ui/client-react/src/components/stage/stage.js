
import React from 'react';
import './stage.scss';

import {Collapse,Well,Glyphicon} from 'react-bootstrap';

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

        let classes = 'layout-stage ';// + (this.state.open ? 'stage-open' : 'state-closed');

        return(
            <div className={classes}>
                <Collapse in={this.state.open}>
                    <Well>{this.props.children}</Well>
                </Collapse>
                <button className="toggleStage" onClick={this.toggleStage} ><Glyphicon glyph={this.state.open ? "menu-up" : "menu-down"} /></button>
            </div>);
    }

});

export default Stage;