
import React from 'react';
import './stage.css';

import Logger from '../../utils/logger';
var logger = new Logger();

//dangerouslySetInnerHTML={{__html: this.props.stageContent}}

var Stage = React.createClass({

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
            <div id="layout-stage-content" className="layout-stage-content">{this.props.stageContent}</div>
            <button onClick={this.toggleStage} className="tab arrow"></button>
        </div>
    }
});

export default Stage;