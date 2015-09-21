
import React from 'react';
import './stage.css';

//dangerouslySetInnerHTML={{__html: this.props.stageContent}}

var Stage = React.createClass({
    getInitialState: function() {
        return {stage: 'open'};
    },

    toggleStage: function() {
        console.log('stage click event..open/close');
        this.setState({stage: this.state.stage === 'open' ? 'closed' : 'open'})
    },

    render: function() {
        var stageClass = this.state.stage === 'open' ? 'layout-stage stage-open' : 'layout-stage stage-close';
        return <div className={stageClass}>
            <div id="layout-stage-content" className="layout-stage-content">
            </div>
            <button onClick={this.toggleStage} className="tab arrow"></button>
        </div>
    }
});
/*
class Stage extends React.Component {

    getInitialState() {
        return {stage: 'open'};
    }

    onClick() {
        console.log('stage click event..open/close');
    }

    render() {
        var stageClass = this.state.stage === 'open' ? 'layout-stage stage-open' : 'layout-stage stage-closed';
        return <div className={stageClass}>
            <div id="layout-stage-content" className="layout-stage-content">
            </div>
            <button onClick={this.onClick} className="tab arrow"></button>
        </div>
    }
}
*/
export default Stage;