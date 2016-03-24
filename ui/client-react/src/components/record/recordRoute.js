import React from 'react';
import Stage from '../stage/stage';
import QBicon from '../qbIcon/qbIcon';
import IconActions from '../actions/iconActions';
import {I18nMessage} from '../../utils/i18nMessage';
import Record from './record';
import {Link} from 'react-router';
import Fluxxor from 'fluxxor';
import './record.scss';

let FluxMixin = Fluxxor.FluxMixin(React);

var RecordRoute = React.createClass({
    mixins: [FluxMixin],

    contextTypes: {
        history: React.PropTypes.object
    },
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

        const actions = [
            {msg: 'recordActions.previous', icon:'caret-left'},
            {msg: 'recordActions.return', icon:'return', onClick:this.returnToReport},
            {msg: 'recordActions.next', icon:'caret-right'}

        ];
        return (<IconActions className="secondaryFormActions" actions={actions} />);
    },

    // just navigate back for now since the record ui does not
    // currently use any actual data from which to build a link
    returnToReport() {
        this.context.history.goBack();
    },

    getStageHeadline() {

        if (this.props.params) {
            const params = this.props.params;

            const appId = params.appId;
            const tblId = params.tblId;
            const recordId = params.recordId;

            const linkback = `/app/${appId}/table/${tblId}`;

            return (<div className="recordStageHeadline">
                <div className="linkBack"><QBicon icon="caret-left"/>
                    <a href="#" onClick={this.returnToReport}><I18nMessage message={'nav.backToReport'}/></a>
                </div>

                <div className="stageHeadline"><QBicon icon="report-table"/> <h3 className="breadCrumbs">
                    Record {recordId}</h3></div>
            </div>);
        } else {
            return "";
        }

    },
    getPageActions(menuAfter = 0) {
        const actions = [
            {msg: 'pageActions.addRecord', icon:'add', className:'addRecord'},
            {msg: 'pageActions.edit', icon:'edit'},
            {msg: 'pageActions.email', icon:'mail'},
            {msg: 'pageActions.print', icon:'print'},
            {msg: 'pageActions.delete', icon:'delete'},
            {msg: 'pageActions.customizeForm', icon:'settings-hollow'},
        ];
        return (<IconActions className="pageActions" actions={actions} menuAfter={menuAfter} {...this.props}/>);
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
                {this.getPageActions(4)}
            </div>
            <Record recordData={this.props.recordData} />
        </div>);
    }
});

export default RecordRoute;
