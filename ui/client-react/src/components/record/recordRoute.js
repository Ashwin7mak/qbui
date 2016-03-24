import React from 'react';
import Stage from '../stage/stage';
import QBicon from '../qbIcon/qbIcon';
import PageActions from '../actions/pageActions';
import Record from './record';
import {Link} from 'react-router';
import Fluxxor from 'fluxxor';
import './record.scss';

let FluxMixin = Fluxxor.FluxMixin(React);

var RecordRoute = React.createClass({
    mixins: [FluxMixin],


    componentDidMount: function() {

        let flux = this.getFlux();
        flux.actions.showTopNav();

        //this.loadRecordFromParams(this.props.params);
    },

    // Triggered when properties change
    componentWillReceiveProps: function(/* props */) {

        //this.loadRecordFromParams(props.params,true);
    },

    getSecondaryBar() {
        return (
            <div className="secondaryFormActions">
                {/* todo */}
            </div>);
    },

    getStageHeadline() {

        if (this.props.params) {
            const params = this.props.params;

            const appId = params.appId;
            const tblId = params.tblId;
            const recordId = params.recordId;

            const linkback = `/app/${appId}/table/${tblId}`;

            return (<div className="recordStageHeadline">
                <div className="linkBack"><QBicon icon="caret-left"/><Link to={linkback}>Back to report</Link></div>

                <div className="stageHeadline"><QBicon icon="report-table"/> <h3 className="breadCrumbs">
                    Record {recordId}</h3></div>
            </div>);
        } else {
            return "";
        }

    },
    getPageActions(menuAfter) {
        const actions = [
            {msg: 'pageActions.addRecord', icon:'add'},
            {msg: 'pageActions.edit', icon:'edit'},
            {msg: 'pageActions.email', icon:'mail'},
            {msg: 'pageActions.print', icon:'print'},
            {msg: 'pageActions.delete', icon:'delete'},
            {msg: 'pageActions.customizeForm', icon:'settings-hollow'},
        ];
        return (<PageActions actions={actions} menuAfter={menuAfter} {...this.props}/>);
    },

    render() {
        return (<div className="recordContainer">
            <Stage stageHeadline={this.getStageHeadline()}
                   pageActions={this.getPageActions(6)}>

                <div className="record-content">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </div>
            </Stage>

            <div className="recordActionsContainer secondaryBar">
                {this.getSecondaryBar()}
                {this.getPageActions()}
            </div>
            <Record recordData={this.props.recordData} />
        </div>);
    }
});

export default RecordRoute;
