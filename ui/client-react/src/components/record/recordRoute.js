import React from 'react';
import Stage from '../stage/stage';
import QBicon from '../qbIcon/qbIcon';
import Button from 'react-bootstrap/lib/Button';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon.js';
import IconActions from '../actions/iconActions';
import {I18nMessage} from '../../utils/i18nMessage';
import Record from './../record/record';
import {Link} from 'react-router-dom';
import simpleStringify from '../../../../common/src/simpleStringify';
import Fluxxor from 'fluxxor';
import Logger from '../../utils/logger';
import {withRouter} from 'react-router-dom';
import Locale from '../../locales/locales';
import Loader from 'react-loader';
import RecordHeader from './recordHeader';
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

let logger = new Logger();
let FluxMixin = Fluxxor.FluxMixin(React);

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

        this.props.loadForm(appId, tblId, rptId, formType, recordId);
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

        this.loadRecordFromParams(this.props.match.params);
    },

    componentDidUpdate(prev) {

        const viewData = this.getViewFormFromProps();

        if (this.props.match.params.appId !== prev.params.appId ||
            this.props.match.params.tblId !== prev.params.tblId ||
            this.props.match.params.recordId !== prev.params.recordId ||
            (viewData && viewData.syncLoadedForm)) {

            this.loadRecordFromParams(this.props.match.params);
        }
    },

    getSecondaryBar() {
        const record = this.getRecordFromProps(this.props);
        const showBack = !!(record && record.previousRecordId !== null);
        const showNext = !!(record && record.nextRecordId !== null);

        const rptId = this.props.match.params ? this.props.match.params.rptId : null;

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
        const {appId, tblId, rptId} = this.props.match.params;
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
        const {filteredRecords, hasGrouping} = this.props.reportData.data;

        let recordsArray = [];
        if (hasGrouping) {
            // flatten grouped records
            this.addGroupedRecords(recordsArray, filteredRecords);
        } else {
            recordsArray = filteredRecords;
        }
        return recordsArray;
    },

    navigateToRecord(recId) {
        if (recId) {
            const {data} = this.props.reportData;
            const key = _.has(data, 'keyField.name') ? data.keyField.name : '';
            if (key) {
                let recordsArray = this.getRecordsArray() || [];

                //  fetch the index of the row in the recordsArray that is being opened
                const index = _.findIndex(recordsArray, rec => rec[key] && rec[key].value === recId);
                let nextRecordId = (index < recordsArray.length - 1) ? recordsArray[index + 1][key].value : null;
                let previousRecordId = index > 0 ? recordsArray[index - 1][key].value : null;

                this.props.openRecord(recId, nextRecordId, previousRecordId);
            }
        }
    },

    /**
     * go back to the previous report record
     */
    previousRecord() {
        const record = this.getRecordFromProps(this.props);
        this.navigateToRecord(record.previousRecordId);

        const {appId, tblId, rptId} = this.props.reportData;
        const link = `${APP_ROUTE}/${appId}/table/${tblId}/report/${rptId}/record/${record.previousRecordId}`;
        this.props.router.push(link);
    },

    /**
     * go forward to the next report record
     */
    nextRecord() {
        const record = this.getRecordFromProps(this.props);
        this.navigateToRecord(record.nextRecordId);

        const {appId, tblId, rptId} = this.props.reportData;
        const link = `${APP_ROUTE}/${appId}/table/${tblId}/report/${rptId}/record/${record.nextRecordId}`;
        this.props.router.push(link);
    },

    getTitle() {
        const {recordId} = this.props.match.params;
        const isSmall = Breakpoints.isSmallBreakpoint();
        const tableName = this.props.selectedTable ? this.props.selectedTable.name : '';
        return <div className="title">
            {isSmall ? <Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} classes="primaryIcon" icon={this.props.selectedTable ? this.props.selectedTable.tableIcon : ""}/> : null}
            <span> {tableName} # {recordId}</span></div>;
    },

    getStageHeadline() {
        if (this.props.match.params) {
            const {appId, tblId, rptId} = this.props.match.params;
            const record = this.getRecordFromProps(this.props);

            const tableLink = `${APP_ROUTE}/${appId}/table/${tblId}`;

            //  ensure the property exists and it has some content
            const reportName = _.has(this.props.reportData, 'data.name') && this.props.reportData.data.name ? this.props.reportData.data.name : Locale.getMessage('nav.backToReport');
            const showBack = !!(this.props.reportData && record.previousRecordId !== null);
            const showNext = !!(this.props.reportData && record.nextRecordId !== null);

            return (<div className="recordStageHeadline">

                <div className="navLinks">
                    {this.props.selectedTable && <Link className="tableHomepageIconLink" to={tableLink}><Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={this.props.selectedTable.tableIcon}/></Link>}
                    {this.props.selectedTable && <Link className="tableHomepageLink" to={tableLink}>{this.props.selectedTable.name}</Link>}
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
        const recordId = this.props.match.params.recordId;
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

        return (<IconActions className="pageActions" actions={actions} {...this.props}/>);
    },

    /**
     * get the
     * @param props
     * @param formType
     * @returns {boolean|*|HTMLCollection}
     */
    getViewFormFromProps(props = this.props) {
        return _.get(props, `forms[${CONTEXT.FORM.VIEW}]`);
    },

    getRecordFromProps(props = this.props) {
        return _.nth(props.record, 0) || {};
    },

    /**
     * only re-render when our form data has changed */
    shouldComponentUpdate(nextProps) {

        const viewData = this.getViewFormFromProps();
        const nextData = this.getViewFormFromProps(nextProps);

        return !viewData ||
            !_.isEqual(viewData.formData, nextData.formData) ||
            !_.isEqual(viewData.syncLoadedForm, nextData.syncLoadedForm) ||
            !_.isEqual(this.props.locale, nextProps.locale) ||
            !_.isEqual(viewData.loading, nextData.loading) ||
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
        if (_.isUndefined(this.props.match.params) ||
            _.isUndefined(this.props.match.params.appId) ||
            _.isUndefined(this.props.match.params.tblId) ||
            (_.isUndefined(this.props.match.params.recordId))
        ) {
            logger.info("the necessary params were not specified to recordRoute render params=" + simpleStringify(this.props.match.params));
            return null;
        } else {
            const viewData = this.getViewFormFromProps();

            const formLoadingErrorStatus = viewData && viewData.errorStatus;
            const formInternalError = !formLoadingErrorStatus ? false : (formLoadingErrorStatus === 500);
            const formAccessRightError = !formLoadingErrorStatus ? false : (formLoadingErrorStatus === 403);

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
                                options={SpinnerConfigurations.TROWSER_CONTENT}>
                        <Record key={key}
                                selectedApp={this.props.selectedApp}
                                appId={this.props.match.params.appId}
                                tblId={this.props.match.params.tblId}
                                recId={this.props.match.params.recordId}
                                errorStatus={formLoadingErrorStatus ? viewData.errorStatus : null}
                                formData={viewData ? viewData.formData : null}
                                appUsers={this.props.appUsers} />
                        </Loader> : null }
                    {formInternalError && <pre><I18nMessage message="form.error.500"/></pre>}
                    {formAccessRightError && <pre><I18nMessage message="form.error.403"/></pre>}
                </div>);
        }
    }
});

// instead of relying on our parent route component to pass our props down,
// the react-redux container will generate the required props for this route
// from the Redux state (the presentational component has no code dependency on Redux!)
const mapStateToProps = (state) => {
    return {
        forms: state.forms,
        record: state.record
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
        loadForm: (appId, tblId, rptId, formType, recordId) => {
            dispatch(loadForm(appId, tblId, rptId, formType, recordId));
        },
        openRecord: (recId, nextId, prevId) => {
            dispatch(openRecord(recId, nextId, prevId));
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RecordRouteWithRouter);
