import React from 'react';
import Stage from '../stage/stage';
import QBicon from '../qbIcon/qbIcon';
import Button from 'react-bootstrap/lib/Button';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
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
import RecordHeader from './recordHeader';
import {UnloadableNode} from '../../components/hoc/unloadable';
import Breakpoints from '../../utils/breakpoints';
import WindowLocationUtils from '../../utils/windowLocationUtils';
import * as SpinnerConfigurations from '../../constants/spinnerConfigurations';
import * as UrlConsts from "../../constants/urlConstants";
import _ from 'lodash';
import {connect} from 'react-redux';
import {loadForm, editNewRecord} from '../../actions/formActions';
import {openRecord} from '../../actions/recordActions';
import {clearSearchInput} from '../../actions/searchActions';
import {APP_ROUTE, BUILDER_ROUTE, EDIT_RECORD_KEY} from '../../constants/urlConstants';
import {CONTEXT} from '../../actions/context';
import './record.scss';
import withUniqueId from '../hoc/withUniqueId';
import DrawerContainer from '../drawer/drawerContainer';
import '../drawer/drawer.scss';
import '../drawer/drawerContainer.scss';

let logger = new Logger();
let FluxMixin = Fluxxor.FluxMixin(React);
//todo :remove the following variables once we start using react router 4
let drawerRecId, drawerTableId, embeddedReport;
/**
 * record route component
 *
 * Note: this component has been partially migrated to Redux
 */
export const RecordRoute = React.createClass({
    mixins: [FluxMixin],

    loadRecord(appId, tblId, recordId, rptId, formType = "view") {
        const flux = this.getFlux();

        flux.actions.selectTableId(tblId);

        // ensure the search input is empty
        this.props.clearSearchInput();
        if (this.props.isDrawerContext && window.location.href.includes('drawer')) {
            let arr = window.location.href.split('&');
            this.props.loadForm(appId, drawerTableId, rptId, formType, drawerRecId, this.props.uniqueId);
            const recordsArray = embeddedReport !== undefined ? embeddedReport.data.records : [];
            this.navigateToRecord(drawerRecId, embeddedReport, recordsArray);
        } else {
            this.props.loadForm(appId, tblId, rptId, formType, recordId, 'view');
        }
    },
    loadRecordFromParams(params = this.props.params) {
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

        this.loadRecordFromParams();
    },

    componentDidUpdate(prev) {

        const viewData = this.getFormFromProps();

        if (this.props.params.appId !== prev.params.appId ||
            this.props.params.tblId !== prev.params.tblId ||
            this.props.params.recordId !== prev.params.recordId ||
            (viewData && viewData.syncLoadedForm)) {

            this.loadRecordFromParams();
        }
    },

    getSecondaryBar() {
        const record = this.getRecordFromProps(this.props);
        const showBack = !!(record && record.previousRecordId !== null);
        const showNext = !!(record && record.nextRecordId !== null);

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
        const link = `${APP_ROUTE}/${appId}/table/${tblId}/report/${rptId}`;
        this.props.router.push(link);
    },

    /**
     * do a depth first search of the grouped records array, adding records
     * to arr so we can determine next/prev records
     * TODO: this is duplicated in reportContent..should be refactored out
     * TODY: into shared function
     * @param arr
     * @param groups
     */
    addGroupedRecords(arr, groups) {
        if (Array.isArray(groups)) {
            groups.forEach(child => {
                if (child.children) {
                    this.addGroupedRecords(arr, child.children);
                } else {
                    arr.push(child);
                }
            });
        }
    },

    getRecordsArray() {
        const reportData = this.getReportDataFromProps(this.props);
        const {filteredRecords, hasGrouping} = reportData.data;
        let recordsArray = [];
        if (hasGrouping) {
            // flatten grouped records
            this.addGroupedRecords(recordsArray, filteredRecords);
        } else {
            recordsArray = filteredRecords;
        }
        return recordsArray;
    },

    navigateToRecord(recId, reportData, records) {
        if (recId) {
            const {data} = reportData || this.props.reportData;
            const key = _.has(data, 'keyField.name') ? data.keyField.name : '';
            if (key) {
                let recordsArray = records || this.getRecordsArray() || [];

                //  fetch the index of the row in the recordsArray that is being opened
                const index = _.findIndex(recordsArray, rec => rec[key] && rec[key].value === recId);
                let nextRecordId = (index < recordsArray.length - 1) ? recordsArray[index + 1][key].value : null;
                let previousRecordId = index > 0 ? recordsArray[index - 1][key].value : null;

                this.props.openRecord(recId, nextRecordId, previousRecordId, this.props.uniqueId);
            }
        }
    },

    /**
     * go back to the previous report record
     */
    previousRecord() {
        const record = this.getRecordFromProps(this.props);
        const reportData = this.getReportDataFromProps(this.props);
        this.navigateToRecord(record.previousRecordId, reportData);

        const {appId, tblId, rptId} = reportData;
        const link = `${APP_ROUTE}/${appId}/table/${tblId}/report/${rptId}/record/${record.previousRecordId}`;
        this.props.router.push(link);
        if (this.props.isDrawerContext) {
            this.renderDrawerContainer(drawerTableId, record.previousRecordId);
        }
    },

    /**
     * go forward to the next report record
     */
    nextRecord() {
        const record = this.getRecordFromProps(this.props);
        const reportData = this.getReportDataFromProps(this.props);
        this.navigateToRecord(record.nextRecordId, reportData);
        const {appId, tblId, rptId} = reportData;
        const link = `${APP_ROUTE}/${appId}/table/${tblId}/report/${rptId}/record/${record.nextRecordId}`;
        this.props.router.push(link);
        if (this.props.isDrawerContext) {
            this.renderDrawerContainer(drawerTableId, record.nextRecordId);
        }
    },

    getTitle(recIdTitle, tableName) {
        const recordId = recIdTitle || this.props.params.recordId;
        const isSmall = Breakpoints.isSmallBreakpoint();
        return <div className="title">
            {isSmall ? <TableIcon classes="primaryIcon" icon={this.props.selectedTable ? this.props.selectedTable.icon : ""}/> : null}
            <span> {tableName} # {recordId}</span></div>;
    },

    /**
     * finds and returns the table from the selected app using the table id
     * @param tableId
     * @returns table only in case, tableId is passed in
     */
    getSelectedTable(tableId) {
        if (tableId && this.props.isDrawerContext) {
            const app = this.props.selectedApp;
            if (app) {
                return _.find(app.tables, (t) => t.id === tableId);
            }
        }
        return this.props.selectedTable;
    },

    getStageHeadline() {
        if (this.props.params) {
            const {appId, tblId, rptId} = this.props.params;
            const record = this.getRecordFromProps(this.props);
            let recordIdTitle;
            const tableLink = `${APP_ROUTE}/${appId}/table/${tblId}`;

            //  ensure the property exists and it has some content
            const reportName = _.has(this.props.reportData, 'data.name') && this.props.reportData.data.name ? this.props.reportData.data.name : Locale.getMessage('nav.backToReport');
            const showBack = !!(this.props.reportData && record.previousRecordId !== null);
            const showNext = !!(this.props.reportData && record.nextRecordId !== null);
            if (this.props.isDrawerContext) {
                recordIdTitle = drawerRecId;
            }
            const tableSelected =  this.getSelectedTable(drawerTableId);
            const tableName = tableSelected !== undefined && tableSelected !== null ? tableSelected.name : '';
            return (<div className="recordStageHeadline">

                <div className="navLinks">
                    {this.props.selectedTable && <Link className="tableHomepageIconLink" to={tableLink}><TableIcon icon={this.props.selectedTable.icon}/></Link>}
                    {this.props.selectedTable && <Link className="tableHomepageLink" to={tableLink}>{tableName}</Link>}
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

                    {this.getTitle(recordIdTitle, tableName)}

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
        const recordId = this.props.params.recordId;
        this.navigateToRecord(recordId);

        WindowLocationUtils.pushWithQuery(EDIT_RECORD_KEY, recordId);
    },

    /**
     * edit the selected record in the trowser
     * @param data row record data
     */
    editNewRecord() {
        WindowLocationUtils.pushWithQuery(EDIT_RECORD_KEY, UrlConsts.NEW_RECORD_VALUE);
    },

    getPageActions() {
        const actions = [
            {msg: 'pageActions.addRecord', icon:'add', className:'addRecord', onClick: this.editNewRecord},
            {msg: 'pageActions.edit', icon:'edit', onClick: this.openRecordForEdit},
            {msg: 'unimplemented.email', icon:'mail', disabled:true},
            {msg: 'unimplemented.print', icon:'print', disabled:true},
            {msg: 'unimplemented.delete', icon:'delete', disabled:true}];

        // TODO: onCloseHandler, add to Proptypes, icon, i18nMessage for other languages
        if (this.props.isDrawerContext) {
            actions.push({msg: 'pageActions.close', icon:'close', onClick: () => {console.log('pass in this.props.onCloseHandler');}});
        }

        return (<IconActions className="pageActions" actions={actions} {...this.props}/>);
    },

    shouldRenderDrawers() {
        // TODO: update this when upgrading to React Router 4 work is done.
        const hasDrawers = _.get(this, 'props.location.search', '').indexOf('drawer') > -1;
        return hasDrawers && !this.props.isDrawerContext;
    },

    /**
     * Render drawer container (if url instructs us to render drawers).
     */
    getDrawerContainer() {
        if (this.shouldRenderDrawers()) {
            // this is the root recordRoute instance, render Drawers if any
            const drawerTableIds = ['0duiiaaaaa2'];
            const drawerRecordIds = ['2'];
            const appId = _.get(this, 'props.params.appId');
            return (
                <DrawerContainer
                    {...this.props}
                    appId={appId}
                    visible={true}
                    drawerTableIds={drawerTableIds}
                    drawerRecordIds={drawerRecordIds}
                />);
        } else {
            // Drawers don't render nested drawers.
            return null;
        }
    },

    fakeOpenDrawerLink() {
        if (window.location.href.includes('drawers')) {
            return null;
        } else {
            const link = window.location.href + '/drawers';

            return <Link to={link} >Load Them Drawers, YO!</Link>;
        }
    },

    /**
     * get the
     * @param props
     * @param formType
     * @returns {boolean|*|HTMLCollection}
     */
    getFormFromProps(props = this.props) {
        if (props.isDrawerContext) {
            return _.get(props, `forms[${props.uniqueId}]`);
        }
        return _.get(props, `forms[${CONTEXT.FORM.VIEW}]`);
    },

    getRecordFromProps(props = this.props) {
        if (this.props.isDrawerContext) {
            return  _.find(props.record, rec => rec.id === props.uniqueId) || {};
        } else {
            return  _.find(props.record, rec => rec.recId.toString() === props.params.recordId) || {};
        }
    },
    /**
     * returns report data from passed in props if not in a drawer else returns embedded Report
     * @param props
     * @returns {*}
     */
    getReportDataFromProps(props = this.props) {
        if (props.isDrawerContext) {
            return  embeddedReport;
        } else {
            return  props.reportData;
        }
    },

    /**
     * only re-render when our form data has changed */
    shouldComponentUpdate(nextProps) {
        if (/*!this.props.location.pathname.includes('drawers') &&*/ window.location.href.includes('drawer')) {
            //TODO: add a check to see if drawer component data got updated
            return true;
        }
        const viewData = this.getFormFromProps();
        const nextData = this.getFormFromProps(nextProps);

        return !viewData ||
            !_.isEqual(viewData.formData, nextData.formData) ||
            !_.isEqual(viewData.syncLoadedForm, nextData.syncLoadedForm) ||
            !_.isEqual(this.props.locale, nextProps.locale) ||
            !_.isEqual(viewData.loading, nextData.loading) ||
            !_.isEqual(this.props.pendEdits, nextProps.pendEdits) ||
            !_.isEqual(this.props.selectedTable, nextProps.selectedTable);
    },

    /***
     * method rendering the drawer conatiner
     * @param tblId
     * @param recId
     * @param embeddedReportsUniqueId
     */
    //shold be removed as a param and instead be stored in react router state
    renderDrawerContainer(tblId, recId, embeddedReportsUniqueId) {
        drawerRecId = recId;
        drawerTableId = tblId;
        if (embeddedReportsUniqueId !== undefined) {
            embeddedReport = _.find(this.props.embeddedReports, {'id' : embeddedReportsUniqueId});
        }
        WindowLocationUtils.pushWithQuery('drawerRecId', recId);
        WindowLocationUtils.pushWithQuery('drawerTableId', tblId);
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
            logger.info("the necessary params were not specified to recordRoute render params=" + simpleStringify(this.props.params));
            return null;
        } else {
            const viewData = this.getFormFromProps();

            const formLoadingErrorStatus = viewData && viewData.errorStatus;
            const formInternalError = (formLoadingErrorStatus === 500);
            const formAccessRightError = (formLoadingErrorStatus === 403);

            let key = _.has(viewData, "formData.recordId") ? viewData.formData.recordId : null;
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


                    {!formLoadingErrorStatus ?
                        <Loader key={key}
                                loaded={(!viewData || !viewData.loading)}
                                options={SpinnerConfigurations.DRAWER_CONTENT}>
                            <Record key={key}
                                    selectedApp={this.props.selectedApp}
                                    appId={this.props.params.appId}
                                    tblId={this.props.params.tblId}
                                    recId={this.props.params.recordId}
                                    errorStatus={formLoadingErrorStatus ? viewData.errorStatus : null}
                                    formData={viewData ? viewData.formData : null}
                                    appUsers={this.props.appUsers}
                                    renderDrawerContainer={this.renderDrawerContainer}/>
                        </Loader> : null }
                    {formInternalError && <pre><I18nMessage message="form.error.500"/></pre>}
                    {formAccessRightError && <pre><I18nMessage message="form.error.403"/></pre>}

                    {this.props.isDrawerContext &&
                        <UnloadableNode
                            uniqueId={this.props.uniqueId}
                            loadEntry={this.loadRecordFromParams}
                            unloadEntry={this.unloadRecordFromParams}
                            hasEntry={!!this.getFormFromProps()}
                            />}

                    {!formLoadingErrorStatus &&
                        this.getDrawerContainer()
                    }
                    {this.fakeOpenDrawerLink()}
                </div>);
        }
    }
});

// instead of relying on our parent route component to pass our props down,
// the react-redux container will generate the required props for this route
// from the Redux state (the presentational component has no code dependency on Redux!)
const mapStateToProps = (state, ownProps) => {
    return {
        forms: state.forms,
        record: state.record,
        embeddedReports: state.embeddedReports
        //Todo: get reports from state and remove as a passed prop
    };
};

// similarly, abstract out the Redux dispatcher from the presentational component
// (another bit of boilerplate to keep the component free of Redux dependencies)
const mapDispatchToProps = (dispatch) => {
    return {
        editNewRecord: () => {
            dispatch(editNewRecord());
        },
        loadForm: (appId, tblId, rptId, formType, recordId, context) => {
            dispatch(loadForm(appId, tblId, rptId, formType, recordId, context));
        },
        openRecord: (recId, nextId, prevId, tblId, uniqueId) => {
            dispatch(openRecord(recId, nextId, prevId, tblId, uniqueId));
        },
        clearSearchInput: () => {
            dispatch(clearSearchInput());
        }
    };
};

// named exports for unit testing router functions and redux actions

export const RecordRouteWithRouter = withRouter(RecordRoute);
export const ConnectedRecordRoute = connect(
    mapStateToProps,
    mapDispatchToProps
)(RecordRoute);

// why do we have 2 connected RecordRoutes exported?
export const ConnectedRecordRouteWithRouter = connect(
    mapStateToProps,
    mapDispatchToProps
)(RecordRouteWithRouter);
export default ConnectedRecordRouteWithRouter;

// Wrap RecordRoute with `withUniqueId` hoc so that it has a unique ID used to identify its own
// instance's data in the record store and form store. Used by stacked forms.
export const RecordRouteWithUniqueId = withUniqueId(ConnectedRecordRouteWithRouter, CONTEXT.FORM.DRAWER);
