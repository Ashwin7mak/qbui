import React from 'react';
import Stage from '../stage/stage';
import QBicon from '../qbIcon/qbIcon';
import {ButtonGroup, Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import TableIcon from '../qbTableIcon/qbTableIcon';
import IconActions from '../actions/iconActions';
import {I18nMessage} from '../../utils/i18nMessage';
import QBForm from './../QBForm/qbform.js';
import {Link} from 'react-router';
import simpleStringify from '../../../../common/src/simpleStringify';
import Fluxxor from 'fluxxor';
import Logger from '../../utils/logger';
import './record.scss';

let logger = new Logger();
let FluxMixin = Fluxxor.FluxMixin(React);

var RecordRoute = React.createClass({
    mixins: [FluxMixin],

    contextTypes: {
        history: React.PropTypes.object
    },

    loadRecord(appId, tblId, recordId, rptId, formType) {
        const flux = this.getFlux();
        flux.actions.selectTableId(tblId);
        flux.actions.loadFormAndRecord(appId, tblId, recordId, rptId, formType);
    },
    loadRecordFromParams(params) {
        const {appId, tblId, recordId, rptId} = params;

        if (appId && tblId && recordId) {
            //  report id is optional
            //  TODO: add form type as a parameter
            this.loadRecord(appId, tblId, recordId, rptId);
        }
    },
    componentDidMount: function() {
        let flux = this.getFlux();
        flux.actions.showTopNav();
        flux.actions.setTopTitle();
        this.loadRecordFromParams(this.props.params);
    },

    getSecondaryBar() {
        const showBack = !!(this.props.reportData && this.props.reportData.previousRecordId !== null);
        const showNext = !!(this.props.reportData && this.props.reportData.nextRecordId !== null);

        const actions = [
            {msg: 'recordActions.previous', icon:'caret-left', disabled: !showBack, onClick: this.previousRecord},
            {msg: 'recordActions.return', icon:'return', onClick:this.returnToReport},
            {msg: 'recordActions.next', icon:'caret-right', disabled: !showNext, onClick: this.nextRecord}
        ];

        return (<IconActions className="secondaryFormActions" actions={actions} />);
    },

    /**
     * return to the report we navigated from
     */
    returnToReport() {

        // use the route parameters to build the URI

        const {appId, tblId, rptId} = this.props.params;

        const link = `/app/${appId}/table/${tblId}/report/${rptId}`;
        this.props.history.pushState(null, link);
    },

    /**
     * navigate back/forth to a new record
     * @param recId
     */
    navigateToRecord(recId) {
        const {appId, tblId, rptId} = this.props.reportData;

        // let flux now we're tranversing records so it can pass down updated previous/next record IDs
        let flux = this.getFlux();
        flux.actions.openingReportRow(rptId, recId);

        const link = `/app/${appId}/table/${tblId}/report/${rptId}/record/${recId}`;
        this.props.history.pushState(null, link);
    },

    /**
     * go back to the previous report record
     */
    previousRecord() {
        this.navigateToRecord(this.props.reportData.previousRecordId);
    },

    /**
     * go forward to the next report record
     */
    nextRecord() {
        this.navigateToRecord(this.props.reportData.nextRecordId);
    },

    getStageHeadline() {

        if (this.props.params) {
            const {rptId} = this.props.params;

            const showBack = !!(this.props.reportData && this.props.reportData.previousRecordId !== null);
            const showNext = !!(this.props.reportData && this.props.reportData.nextRecordId !== null);

            return (<div className="recordStageHeadline">

                <div className="navLinks">
                    {(showBack || showNext) && <div className="iconActions">
                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="prev">Previous Record</Tooltip>}>
                            <Button className="iconActionButton prevRecord" disabled={!showBack} onClick={this.previousRecord}><QBicon icon="caret-left"/></Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="prev">Next Record</Tooltip>}>
                            <Button className="iconActionButton nextRecord" disabled={!showNext} onClick={this.nextRecord}><QBicon icon="caret-right"/></Button>
                        </OverlayTrigger>
                    </div> }

                    {rptId && <span><QBicon icon="return"/><a className="backToReport" href="#" onClick={this.returnToReport}><I18nMessage message={'nav.backToReport'}/></a></span>}
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
    getPageActions() {

        const actions = [
            {msg: 'pageActions.addRecord', icon:'add', className:'addRecord'},
            {msg: 'pageActions.edit', icon:'edit'},
            {msg: 'pageActions.email', icon:'mail'},
            {msg: 'pageActions.print', icon:'print'},
            {msg: 'pageActions.delete', icon:'delete'},
            {msg: 'pageActions.customizeForm', icon:'settings-hollow'}];

        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={actions.length - 1} {...this.props}/>);
    },

    render() {

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
                       pageActions={this.getPageActions()}>

                    <div className="record-content">
                    </div>
                </Stage>

                <div className="recordActionsContainer secondaryBar">
                    {this.getSecondaryBar()}
                    {this.getPageActions()}
                </div>
                <QBForm errorStatus={this.props.form && this.props.form.errorStatus ? this.props.form.errorStatus : null} formData={this.props.form ? this.props.form.formData : null}></QBForm>
            </div>);
        }
    }
});

export default RecordRoute;
