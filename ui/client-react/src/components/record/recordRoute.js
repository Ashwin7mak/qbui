import React from 'react';
import Stage from '../stage/stage';
import QBicon from '../qbIcon/qbIcon';
import TableIcon from '../qbTableIcon/qbTableIcon';
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
    loadRecord(appId, tblId, recordId) {
        const flux = this.getFlux();
        flux.actions.selectTableId(tblId);
        flux.actions.loadFormAndRecord(appId, tblId, recordId);
    },
    loadRecordFromParams(params) {
        let appId = params.appId;
        let tblId = params.tblId;
        let recordId = params.recordId;

        if (appId && tblId && recordId) {
            this.loadRecord(appId, tblId, recordId);
        }
    },
    componentDidMount: function() {
        let flux = this.getFlux();
        flux.actions.showTopNav();
        flux.actions.setTopTitle();
        this.loadRecordFromParams(this.props.params);
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

                <div className="stageHeadline">
                    {this.props.selectedTable &&
                    <h3 className="breadCrumbs"><TableIcon
                        icon={this.props.selectedTable.icon}/>
                        Eric Wright at Union University</h3>
                    }
                </div>
            </div>);
        } else {
            return "";
        }

    },
    getPageActions(maxButtonsBeforeMenu = 0) {
        const actions = [
            {msg: 'pageActions.addRecord', icon:'add', className:'addRecord'},
            {msg: 'pageActions.edit', icon:'edit'},
            {msg: 'pageActions.email', icon:'mail'},
            {msg: 'pageActions.print', icon:'print'},
            {msg: 'pageActions.delete', icon:'delete'},
            {msg: 'pageActions.customizeForm', icon:'settings-hollow'},
        ];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={maxButtonsBeforeMenu} {...this.props}/>);
    },

    render() {
        console.log(this.props);
        if (_.isUndefined(this.props.params) ||
            _.isUndefined(this.props.params.appId) ||
            _.isUndefined(this.props.params.tblId) ||
            (_.isUndefined(this.props.params.recordId))
        ) {
            logger.info("the necessary params were not specified to reportRoute render params=" + simpleStringify(this.props.params));
            return null;
        } else {
            return (<div className="recordContainer">
                <Stage stageHeadline={this.getStageHeadline()}
                       pageActions={this.getPageActions(6)}>

                    <div className="record-content">
                    </div>
                </Stage>

                <div className="recordActionsContainer secondaryBar">
                    {this.getSecondaryBar()}
                    {this.getPageActions(4)}
                </div>
                <Record formData={this.props.form ? this.props.form.formData : null}/>
            </div>);
        }
    }
});

export default RecordRoute;
