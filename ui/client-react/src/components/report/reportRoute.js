import React from 'react';
import Stage from '../stage/stage';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon.js';
import ReportStage from './reportStage';
import ReportHeader from './reportHeader';
import IconActions from '../actions/iconActions';
import {Link, withRouter} from 'react-router-dom';
import Logger from '../../utils/logger';
import QueryUtils from '../../utils/queryUtils';
import NumberUtils from '../../utils/numberUtils';
import {WindowHistoryUtils} from '../../utils/windowHistoryUtils';
import UrlUtils from '../../utils/urlUtils';
import Breakpoints from '../../utils/breakpoints';
import simpleStringify from '../../../../common/src/simpleStringify';
import constants from '../../../../common/src/constants';
import withUniqueId from '../hoc/withUniqueId';
import _ from 'lodash';
import './report.scss';
import ReportToolsAndContent from '../report/reportToolsAndContent';
import RecordInDrawer from '../drawer/recordInDrawer';
import {connect} from 'react-redux';
import {clearSearchInput} from '../../actions/searchActions';
import {loadReport, loadDynamicReport} from '../../actions/reportActions';
import {loadFields} from '../../actions/fieldsActions';
import {selectAppTable} from '../../actions/appActions';
import {CONTEXT} from '../../actions/context';
import {APP_ROUTE, EDIT_RECORD_KEY, NEW_RECORD_VALUE} from '../../constants/urlConstants';
import {hideTopNav} from '../../actions/shellActions';

import * as FieldsReducer from '../../reducers/fields';
import {getEmbeddedReportByContext} from '../../reducers/embeddedReports';

let logger = new Logger();

/**
 * report route
 *
 * Note: this component has been partially migrated to Redux
 */
// export for unit tests
export const ReportRoute = React.createClass({
    nameForRecords: "Records",  // get from table meta data

    loadReport(appId, tblId, rptId, offset, numRows) {
        this.props.selectTable(appId, tblId);

        // ensure the search box is cleared for the new report
        this.props.clearSearchInput();

        //  get the fields for this app/tbl
        this.props.loadFields(appId, tblId);

        //  load the report
        this.props.loadReport(CONTEXT.REPORT.NAV, appId, tblId, rptId, true, offset, numRows);
    },

    /**
     * Load a report with query parameters.
     */
    loadDynamicReport(appId, tblId, rptId, format, filter, queryParams) {
        const context = this.props.uniqueId || CONTEXT.REPORT.NAV;
        this.props.loadDynamicReport(context, appId, tblId, rptId, format, filter, queryParams);
    },

    /**
     * Load a report with query parameters.
     */
    loadDynamicReportFromParams(appId, tblId, rptId, queryParams) {
        this.props.selectTable(appId, tblId);

        // ensure the search box is cleared for the new report
        this.props.clearSearchInput();

        //  get the fields for this app/tbl
        this.props.loadFields(appId, tblId);

        this.loadDynamicReport(appId, tblId, rptId, true, /*filter*/{}, queryParams);
    },

    loadReportFromParams(params) {
        let {appId, tblId, detailKeyFid, detailKeyValue} = params;
        let rptId = typeof this.props.rptId !== "undefined" ? this.props.rptId : params.rptId;

        if (appId && tblId && rptId) {
            //  loading a report..always render the 1st page on initial load
            let offset = constants.PAGE.DEFAULT_OFFSET;
            let numRows = NumberUtils.getNumericPropertyValue(this.props.reportData, 'numRows') || constants.PAGE.DEFAULT_NUM_ROWS;

            // A link from a parent component (see qbform.createChildReportElementCell) was used
            // to display a filtered child report.
            const isChildReport = !_.isUndefined(detailKeyFid) && !_.isUndefined(detailKeyValue);
            if (isChildReport) {
                const queryParams = {
                    query: QueryUtils.parseStringIntoExactMatchExpression(detailKeyFid, detailKeyValue),
                    offset,
                    numRows
                };
                this.loadDynamicReportFromParams(appId, tblId, rptId, queryParams);
            } else {
                this.loadReport(appId, tblId, rptId, offset, numRows);
            }
        }
    },

    componentDidMount() {
        this.props.hideTopNav();

        if (this.props.match.params) {
            this.loadReportFromParams(this.props.match.params);
        }
    },

    /***
     * Push a new url to drill down one more level. Should be called when we want to open a drawer.
     * @param tblId
     * @param recId
     */
    handleDrillIntoChild(tblId, recId) {
        let embeddedReport = getEmbeddedReportByContext(this.props.embeddedReports, this.props.uniqueId);

        if (embeddedReport) {
            const existingPath = this.props.match.url;
            const appId = _.get(this, 'props.match.params.appId', this.selectedAppId);
            const recordDrawerSegment = UrlUtils.getRecordDrawerSegment(appId, tblId, embeddedReport.id, recId);
            const link = existingPath + recordDrawerSegment;
            if (this.props.history) {
                this.props.history.push(link);
            }
        }
    },

    /**
     * Render drawer container which will contain a record to drill down to.
     * This should only be rendered when this report is the main report (not an embedded report) shown inside a drawer.
     */
    getDrawerContainer() {
        return (
            <RecordInDrawer
                {...this.props}
                direction="bottom"
                renderBackdrop={false}
                rootDrawer={!this.props.isDrawerContext}
                closeDrawer={this.closeDrawer}
                match={this.props.match}
                pathToAdd="/sr_app_:appId([A-Za-z0-9]+)_table_:tblId([A-Za-z0-9]+)_report_:rptId([A-Za-z0-9]+)_record_:recordId([A-Za-z0-9]+)"
            />);
    },

    getHeader() {
        return (
            <ReportHeader nameForRecords={this.nameForRecords}
                {...this.props}
            />);
    },

    /**
     * edit the selected record in the trowser
     * @param data row record data
     */
    editNewRecord() {
        WindowHistoryUtils.pushWithQuery(EDIT_RECORD_KEY, NEW_RECORD_VALUE);
    },

    getPageActions(maxButtonsBeforeMenu) {
        const actions = [
            {msg: 'pageActions.addRecord', icon:'add-new-filled', className:'addRecord', onClick: this.editNewRecord},
            {msg: 'unimplemented.makeFavorite', icon:'star', disabled: true},
            {msg: 'unimplemented.print', icon:'print', disabled: true},
        ];
        return (<IconActions className="pageActions" actions={actions}/>);
    },

    getStageHeadline() {
        const reportName = this.props.reportData && this.props.reportData.data && this.props.reportData.data.name;
        const {appId, tblId} = this.props.match.params;
        const tableLink = `${APP_ROUTE}/${appId}/table/${tblId}`;
        return (
            <div className="reportStageHeadline">

                <div className="navLinks">
                    {this.props.selectedTable && <Link className="tableHomepageIconLink" to={tableLink}><Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={this.props.selectedTable.tableIcon}/></Link>}
                    {this.props.selectedTable && <Link className="tableHomepageLink" to={tableLink}>{this.props.selectedTable.name}</Link>}
                </div>

                <div className="stageHeadline">
                    <h3 className="reportName">{reportName}</h3>
                </div>
            </div>);
    },

    render() {
        if (_.isUndefined(this.props.match.params) ||
            _.isUndefined(this.props.match.params.appId) ||
            _.isUndefined(this.props.match.params.tblId) ||
            (_.isUndefined(this.props.match.params.rptId) && _.isUndefined(this.props.rptId))
        ) {
            logger.info("the necessary params were not specified to reportRoute render params=" + simpleStringify(this.props.match.params));
            return null;
        } else {
            const reportData = _.get(this, 'props.reportData', {});
            const classNames = ['reportContainer'];
            classNames.push(Breakpoints.isSmallBreakpoint() ? 'smallBreakPoint' : '');
            return (
                <div className={classNames.join(' ')}>
                    <Stage stageHeadline={this.getStageHeadline()}
                           pageActions={this.getPageActions(5)}>
                        <ReportStage reportData={this.props.reportData}/>
                    </Stage>

                    {this.getHeader()}

                    <ReportToolsAndContent
                        params={this.props.match.params}
                        reportData={reportData}
                        appUsers={this.props.appUsers}
                        pendEdits={this.props.pendEdits}
                        isRowPopUpMenuOpen={this.props.isRowPopUpMenuOpen}
                        routeParams={this.props.match.params}
                        selectedAppId={this.props.selectedAppId}
                        selectedTable={this.props.selectedTable}
                        searchStringForFiltering={reportData.searchStringForFiltering}
                        pageActions={this.getPageActions(0)}
                        nameForRecords={this.nameForRecords}
                        selectedRows={reportData.selectedRows}
                        scrollingReport={this.props.scrollingReport}
                        loadDynamicReport={this.loadDynamicReport}
                        noRowsUI={true}
                        handleDrillIntoChild={this.props.uniqueId && this.handleDrillIntoChild}
                    />

                    {this.props.isDrawerContext && this.getDrawerContainer()}
                </div>
            );
        }
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        clearSearchInput: () => {
            dispatch(clearSearchInput());
        },
        loadFields: (appId, tblId) => {
            dispatch(loadFields(appId, tblId));
        },
        loadReport: (context, appId, tblId, rptId, format, offset, rows) => {
            dispatch(loadReport(context, appId, tblId, rptId, format, offset, rows));
        },
        loadDynamicReport: (context, appId, tblId, rptId, format, filter, queryParams) => {
            dispatch(loadDynamicReport(context, appId, tblId, rptId, format, filter, queryParams));
        },
        selectTable: (appId, tableId) => dispatch(selectAppTable(appId, tableId)),
        hideTopNav: () => dispatch(hideTopNav())

    };
};

const mapStateToProps = (state, ownProps) => {
    return {
        reportData: ownProps.reportData || getEmbeddedReportByContext(state.embeddedReports, ownProps.uniqueId),
        embeddedReports: state.embeddedReports
    };
};

const ConnectedReportRoute = withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportRoute));
export default ConnectedReportRoute;

export const ReportRouteWithViewId = withUniqueId(ConnectedReportRoute, CONTEXT.REPORT.EMBEDDED);
