import React from 'react';
import Stage from '../stage/stage';
import QBicon from '../qbIcon/qbIcon';
import {ButtonGroup, Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import TableIcon from '../qbTableIcon/qbTableIcon';
import IconActions from '../actions/iconActions';
import {I18nMessage} from '../../utils/i18nMessage';
import Record from './../record/record';
import {Link} from 'react-router';
import simpleStringify from '../../../../common/src/simpleStringify';
import Fluxxor from 'fluxxor';
import Logger from '../../utils/logger';
import {withRouter} from 'react-router';
import Locale from '../../locales/locales';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import _ from 'lodash';
import './record.scss';

let logger = new Logger();
let FluxMixin = Fluxxor.FluxMixin(React);

export let RecordRoute = React.createClass({
    mixins: [FluxMixin],

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
        const rptId = this.props.params ? this.props.params.rptId : null;

        const actions = [];
        if (showBack || showNext) {
            actions.push({msg: 'recordActions.previous', icon:'caret-left', disabled: !showBack, onClick: this.previousRecord});
        }
        if (rptId) {
            actions.push({msg: 'recordActions.return', icon: 'return', onClick: this.returnToReport});
        }
        if (showBack || showNext) {
            actions.push({msg: 'recordActions.next', icon:'caret-right', disabled: !showNext, onClick: this.nextRecord});
        }

        return (<IconActions className="secondaryFormActions" actions={actions} />);
    },

    /**
     * return to the report we navigated from
     */
    returnToReport() {

        // use the route parameters to build the URI

        const {appId, tblId, rptId} = this.props.params;

        const link = `/app/${appId}/table/${tblId}/report/${rptId}`;
        this.props.router.push(link);
    },

    /**
     * navigate back/forth to a new record
     * @param recId
     */
    navigateToRecord(appId, tblId, rptId, recId) {
        const link = `/app/${appId}/table/${tblId}/report/${rptId}/record/${recId}`;
        this.props.router.push(link);
    },

    /**
     * go back to the previous report record
     */
    previousRecord() {
        const {appId, tblId, rptId, previousRecordId} = this.props.reportData;

        // let flux now we're tranversing records so it can pass down updated previous/next record IDs
        let flux = this.getFlux();
        flux.actions.showPreviousRecord(previousRecordId);

        this.navigateToRecord(appId, tblId, rptId, previousRecordId);
    },

    /**
     * go forward to the next report record
     */
    nextRecord() {
        const {appId, tblId, rptId, nextRecordId} = this.props.reportData;

        // let flux now we're tranversing records so it can pass down updated previous/next record IDs
        let flux = this.getFlux();
        flux.actions.showNextRecord(nextRecordId);

        this.navigateToRecord(appId, tblId, rptId, nextRecordId);
    },

    getStageHeadline() {
        if (this.props.params) {
            const {rptId, recordId} = this.props.params;

            const showBack = !!(this.props.reportData && this.props.reportData.previousRecordId !== null);
            const showNext = !!(this.props.reportData && this.props.reportData.nextRecordId !== null);

            const formName = this.props.form && this.props.form.formData && this.props.form.formData.formMeta && this.props.form.formData.formMeta.name;
            const reportName = this.props.reportData && this.props.reportData.data.name ? this.props.reportData.data.name : Locale.getMessage('nav.backToReport');

            return (<div className="recordStageHeadline">

                <div className="navLinks">
                    {this.props.selectedTable && <TableIcon icon={this.props.selectedTable.icon}/> }
                    {this.props.selectedTable && this.props.selectedTable.name && <span>{this.props.selectedTable.name}&nbsp;&gt;&nbsp;</span>}
                    {rptId && <a className="backToReport" href="#" onClick={this.returnToReport}>{reportName}</a>}
                </div>

                <div className="stageHeadline iconActions">

                    {(showBack || showNext) && <div className="iconActions">
                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="prev">Previous Record</Tooltip>}>
                            <Button className="iconActionButton prevRecord" disabled={!showBack} onClick={this.previousRecord}><QBicon icon="caret-filled-left"/></Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="prev">Next Record</Tooltip>}>
                            <Button className="iconActionButton nextRecord" disabled={!showNext} onClick={this.nextRecord}><QBicon icon="caret-filled-right"/></Button>
                        </OverlayTrigger>
                    </div> }

                    <h3 className="formName">{formName} #{recordId}</h3>

                </div>
            </div>);
        } else {
            return "";
        }

    },

    /**
     * edit the selected record in the trowser
     * @param data row record data
     */
    openRecordForEdit() {

        const flux = this.getFlux();

        flux.actions.openRecordForEdit(this.props.params.recordId);
    },
    /**
     * edit the selected record in the trowser
     * @param data row record data
     */
    editNewRecord() {

        const flux = this.getFlux();

        flux.actions.editNewRecord();
    },
    getPageActions() {

        const actions = [
            {msg: 'pageActions.addRecord', icon:'add', className:'addRecord', onClick: this.editNewRecord},
            {msg: 'pageActions.edit', icon:'edit', onClick: this.openRecordForEdit},
            {msg: 'pageActions.email', icon:'mail'},
            {msg: 'pageActions.print', icon:'print'},
            {msg: 'pageActions.delete', icon:'delete'},
            {msg: 'pageActions.customizeForm', icon:'settings-hollow'}];

        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={actions.length - 1} {...this.props}/>);
    },

    /**
     * only re-render when our form data has changed */
    shouldComponentUpdate(nextProps) {
        return !_.isEqual(this.props.form.formData, nextProps.form.formData) ||
            !_.isEqual(this.props.pendEdits, nextProps.pendEdits);
    },

    /**
     * render the stage, actions, and form
     *
     * the QBForm gets a unique to allow ReactCSSTransitionGroup animation to work across route transitions (i.e. diffferent record IDs)
     * we implement shouldComponentUpdate() to prevent triggering animations unless the record has changed
     */
    render() {
        if (_.isUndefined(this.props.params) ||
            _.isUndefined(this.props.params.appId) ||
            _.isUndefined(this.props.params.tblId) ||
            (_.isUndefined(this.props.params.recordId))
        ) {
            logger.info("the necessary params were not specified to reportRoute render params=" + simpleStringify(this.props.params));
            return null;
        } else {

            // we store "next", "previous" in flux store and pass it down so we know what CSS classes to apply for the animation based on the direction

            const nextOrPreviousTransitionName = this.props.reportData && this.props.reportData.nextOrPrevious ? this.props.reportData.nextOrPrevious : "";

            return (<div id={this.props.params.recordId} className="recordContainer">
                <Stage stageHeadline={this.getStageHeadline()}
                       pageActions={this.getPageActions()}>

                    <div className="record-content">
                    </div>
                </Stage>

                <div className="recordActionsContainer secondaryBar">
                    {this.getSecondaryBar()}
                    {this.getPageActions()}
                </div>
                <div className="qbFormContainer">
                    <ReactCSSTransitionGroup transitionName={nextOrPreviousTransitionName}
                                             transitionEnterTimeout={200}
                                             transitionLeaveTimeout={200}>
                        <Record appId={this.props.params.appId}
                                tblId={this.props.params.tblId}
                                recId={this.props.params.recordId}
                                errorStatus={this.props.form && this.props.form.errorStatus ? this.props.form.errorStatus : null}
                                formData={this.props.form ? this.props.form.formData : null}
                                appUsers={this.props.appUsers}></Record>

                    </ReactCSSTransitionGroup>
                </div>
            </div>);
        }
    }
});

export let RecordRouteWithRouter = withRouter(RecordRoute);
export default RecordRouteWithRouter;
