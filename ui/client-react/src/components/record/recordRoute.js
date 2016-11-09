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
import Loader from 'react-loader';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import RecordHeader from './recordHeader';
import Breakpoints from '../../utils/breakpoints';
import _ from 'lodash';
import './record.scss';

let logger = new Logger();
let FluxMixin = Fluxxor.FluxMixin(React);

export let RecordRoute = React.createClass({
    mixins: [FluxMixin],

    loadRecord(appId, tblId, recordId, rptId, formType) {
        const flux = this.getFlux();
        flux.actions.syncingForm();
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
    componentDidMount() {
        let flux = this.getFlux();
        flux.actions.hideTopNav();
        flux.actions.setTopTitle();

        this.loadRecordFromParams(this.props.params);
    },

    componentDidUpdate(prev) {

        if (this.props.params.appId !== prev.params.appId ||
            this.props.params.tblId !== prev.params.tblId ||
            this.props.params.recId !== prev.params.recId ||
            (this.props.form && this.props.form.syncLoadedForm)) {

            this.loadRecordFromParams(this.props.params);
        }
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

        const link = `/qbase/app/${appId}/table/${tblId}/report/${rptId}`;
        this.props.router.push(link);
    },

    /**
     * navigate back/forth to a new record
     * @param recId
     */
    navigateToRecord(appId, tblId, rptId, recId) {
        const link = `/qbase/app/${appId}/table/${tblId}/report/${rptId}/record/${recId}`;
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

    getTitle() {
        const {recordId} = this.props.params;
        const isSmall = Breakpoints.isSmallBreakpoint();
        const tableName = this.props.selectedTable ? this.props.selectedTable.name : '';
        return <div className="title">
            {isSmall ? <TableIcon classes="primaryIcon" icon={this.props.selectedTable ? this.props.selectedTable.icon : ""}/> : null}
            <span> {tableName} # {recordId}</span></div>;
    },

    getStageHeadline() {
        if (this.props.params) {
            const {appId, tblId, rptId} = this.props.params;

            const tableLink = `/qbase/app/${appId}/table/${tblId}`;

            const reportName = this.props.reportData && this.props.reportData.data.name ? this.props.reportData.data.name : Locale.getMessage('nav.backToReport');
            const showBack = !!(this.props.reportData && this.props.reportData.previousRecordId !== null);
            const showNext = !!(this.props.reportData && this.props.reportData.nextRecordId !== null);

            return (<div className="recordStageHeadline">

                <div className="navLinks">
                    {this.props.selectedTable && <Link className="tableHomepageLink" to={tableLink}><TableIcon icon={this.props.selectedTable.icon}/>{this.props.selectedTable.name}</Link>}
                    {this.props.selectedTable && rptId && <span className="divider color-black-700">&nbsp;&nbsp;:&nbsp;&nbsp;</span>}
                    {rptId && <a className="backToReport" href="#" onClick={this.returnToReport}>{reportName}</a>}
                </div>
                <div className="stageHeadline iconActions">

                    {(showBack || showNext) && <div className="iconActions">
                        {showBack ?
                            <OverlayTrigger placement="bottom" overlay={<Tooltip id="prev">Previous Record</Tooltip>}>
                                <Button className="iconActionButton prevRecord" onClick={this.previousRecord}><QBicon icon="caret-filled-left"/></Button>
                            </OverlayTrigger> :
                            <Button className="iconActionButton prevRecord" disabled={true} onClick={this.previousRecord}><QBicon icon="caret-filled-left"/></Button>}
                        {showNext ?
                            <OverlayTrigger placement="bottom" overlay={<Tooltip id="prev">Next Record</Tooltip>}>
                                <Button className="iconActionButton nextRecord" onClick={this.nextRecord}><QBicon icon="caret-filled-right"/></Button>
                            </OverlayTrigger> :
                            <Button className="iconActionButton nextRecord" disabled={true} onClick={this.nextRecord}><QBicon icon="caret-filled-right"/></Button>}
                    </div> }

                    {this.getTitle()}

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

        flux.actions.openRecordForEdit(parseInt(this.props.params.recordId), true);
    },
    /**
     * edit the selected record in the trowser
     * @param data row record data
     */
    editNewRecord() {

        const flux = this.getFlux();

        flux.actions.editNewRecord(true);
    },
    getPageActions() {

        const actions = [
            {msg: 'pageActions.addRecord', icon:'add', className:'addRecord', onClick: this.editNewRecord},
            {msg: 'pageActions.edit', icon:'edit', onClick: this.openRecordForEdit},
            {msg: 'pageActions.email', icon:'mail'},
            {msg: 'unimplemented.print', icon:'print', disabled:true},
            {msg: 'pageActions.delete', icon:'delete'}];

        return (<IconActions className="pageActions" actions={actions} {...this.props}/>);
    },

    /**
     * only re-render when our form data has changed */
    shouldComponentUpdate(nextProps) {
        return this.props.form.syncLoadedForm ||
            !_.isEqual(this.props.form.formData, nextProps.form.formData) ||
            !_.isEqual(this.props.form.formLoading, nextProps.form.formLoading) ||
            !_.isEqual(this.props.pendEdits, nextProps.pendEdits) ||
            !_.isEqual(this.props.selectedTable, nextProps.selectedTable);
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
            const formLoadingeErrorStatus = (_.isUndefined(this.props.form) || _.isUndefined(this.props.form.errorStatus)) ? false : this.props.form.errorStatus;
            const formInternalError = !formLoadingeErrorStatus ? false : (formLoadingeErrorStatus === 500);
            const formAccessRightError = !formLoadingeErrorStatus ? false : (formLoadingeErrorStatus === 403);

            return (
                <div className="recordContainer">
                    <Stage stageHeadline={this.getStageHeadline()}
                           pageActions={this.getPageActions()}>

                        <div className="record-content">
                        </div>
                    </Stage>

                    <RecordHeader title={this.getTitle()}/>
                    <div className="recordActionsContainer secondaryBar">
                        {this.getSecondaryBar()}
                        {this.getPageActions()}
                    </div>

                    {!formLoadingeErrorStatus ?
                        <Loader key={_.has(this.props, "form.formData.recordId") ? this.props.form.formData.recordId : null }
                                            loaded={(!this.props.form || !this.props.form.formLoading)}>
                        <Record key={_.has(this.props, "form.formData.recordId") ? this.props.form.formData.recordId : null }
                                appId={this.props.params.appId}
                                tblId={this.props.params.tblId}
                                recId={this.props.params.recordId}
                                errorStatus={formLoadingeErrorStatus ? this.props.form.errorStatus : null}
                                formData={this.props.form ? this.props.form.formData : null}
                                appUsers={this.props.appUsers} />
                        </Loader> : null }
                    {formInternalError && <pre><I18nMessage message="form.error.500"/></pre>}
                    {formAccessRightError && <pre><I18nMessage message="form.error.403"/></pre>}
                </div>);
        }
    }
});

export let RecordRouteWithRouter = withRouter(RecordRoute);
export default RecordRouteWithRouter;
