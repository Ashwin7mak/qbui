import React from 'react';
import Stage from '../stage/stage';
import TableIcon from '../qbTableIcon/qbTableIcon';
import ReportStage from './reportStage';
import ReportHeader from './reportHeader';
import IconActions from '../actions/iconActions';
import {Link} from 'react-router';
import Logger from '../../utils/logger';
import QueryUtils from '../../utils/queryUtils';
import NumberUtils from '../../utils/numberUtils';
import WindowLocationUtils from '../../utils/windowLocationUtils';
import simpleStringify from '../../../../common/src/simpleStringify';
import constants from '../../../../common/src/constants';
import Fluxxor from 'fluxxor';
import _ from 'lodash';
import './report.scss';
import ReportToolsAndContent from '../report/reportToolsAndContent';
import {connect} from 'react-redux';
import {editNewRecord} from '../../actions/formActions';
import {loadReport, loadDynamicReport} from '../../actions/reportActions';
import {CONTEXT} from '../../actions/context';
import {APP_ROUTE, EDIT_RECORD_KEY, NEW_RECORD_VALUE} from '../../constants/urlConstants';

let logger = new Logger();
let FluxMixin = Fluxxor.FluxMixin(React);

/**
 * report route
 *
 * Note: this component has been partially migrated to Redux
 */
const ReportRoute = React.createClass({
    mixins: [FluxMixin],
    nameForRecords: "Records",  // get from table meta data

    loadReport(appId, tblId, rptId, offset, numRows) {
        const flux = this.getFlux();
        flux.actions.selectTableId(tblId);
        flux.actions.loadFields(appId, tblId);
        //flux.actions.loadReport(appId, tblId, rptId, true, offset, numRows);
        this.props.dispatch(loadReport(CONTEXT.REPORT.NAV, appId, tblId, rptId, true, offset, numRows));
    },

    /**
     * Load a report with query parameters.
     */
    loadDynamicReport(appId, tblId, rptId, format, filter, queryParams) {
        this.props.dispatch(loadDynamicReport(CONTEXT.REPORT.NAV, appId, tblId, rptId, format, filter, queryParams));
    },

    /**
     * Load a report with query parameters.
     */
    loadDynamicReportFromParams(appId, tblId, rptId, queryParams) {
        const flux = this.getFlux();
        flux.actions.selectTableId(tblId);
        flux.actions.loadFields(appId, tblId);

        // TODO: instead of using 0 for the rptID, the node layer should send data when apps have
        // TODO: tables with relationships
        //flux.actions.loadDynamicReport(appId, tblId, rptId, true, /*filter*/{}, queryParams);
        this.loadDynamicReport(appId, tblId, rptId, true, /*filter*/{}, queryParams);
    },
    loadReportFromParams(params) {
        let {appId, tblId} = params;
        let rptId = typeof this.props.rptId !== "undefined" ? this.props.rptId : params.rptId;

        if (appId && tblId && rptId) {
            //  loading a report..always render the 1st page on initial load
            let offset = constants.PAGE.DEFAULT_OFFSET;
            let numRows = NumberUtils.getNumericPropertyValue(this.props.reportData, 'numRows') || constants.PAGE.DEFAULT_NUM_ROWS;

            const {detailKeyFid, detailKeyValue} = _.get(this, 'props.location.query', {});
            // A link from a parent component (see qbform.createChildReportElementCell) was used
            // to display a filtered child report.
            if (detailKeyFid && detailKeyValue) {
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
        const flux = this.getFlux();
        flux.actions.hideTopNav();
        // No one is listening
        //flux.actions.resetRowMenu();
        if (this.props.params) {
            this.loadReportFromParams(this.props.params);
        }
    },
    getHeader() {
        return (
            <ReportHeader reportData={this.props.reportData}
                          nameForRecords={this.nameForRecords}
                          searchData={this.props.reportSearchData}
                {...this.props}
            />);
    },

    /**
     * edit the selected record in the trowser
     * @param data row record data
     */
    editNewRecord() {

        // need to dispatch to Fluxxor since report store handles this too...
        //const flux = this.getFlux();
        //flux.actions.editNewRecord();
        //
        //this.props.dispatch(editNewRecord());
        WindowLocationUtils.pushWithQuery(EDIT_RECORD_KEY, NEW_RECORD_VALUE);
    },

    getPageActions(maxButtonsBeforeMenu) {
        const actions = [
            {msg: 'pageActions.addRecord', icon:'add', className:'addRecord', onClick: this.editNewRecord},
            {msg: 'unimplemented.makeFavorite', icon:'star', disabled: true},
            {msg: 'unimplemented.print', icon:'print', disabled: true},
        ];
        return (<IconActions className="pageActions" actions={actions}/>);
    },


    getStageHeadline() {
        const reportName = this.props.reportData && this.props.reportData.data && this.props.reportData.data.name;
        const {appId, tblId} = this.props.params;
        const tableLink = `${APP_ROUTE}/${appId}/table/${tblId}`;
        return (
            <div className="reportStageHeadline">

                <div className="navLinks">
                    {this.props.selectedTable && <Link className="tableHomepageIconLink" to={tableLink}><TableIcon icon={this.props.selectedTable.icon}/></Link>}
                    {this.props.selectedTable && <Link className="tableHomepageLink" to={tableLink}>{this.props.selectedTable.name}</Link>}
                </div>

                <div className="stageHeadline">
                    <h3 className="reportName">{reportName}</h3>
                </div>
            </div>);
    },

    render() {
        if (_.isUndefined(this.props.params) ||
            _.isUndefined(this.props.params.appId) ||
            _.isUndefined(this.props.params.tblId) ||
            (_.isUndefined(this.props.params.rptId) && _.isUndefined(this.props.rptId))
        ) {
            logger.info("the necessary params were not specified to reportRoute render params=" + simpleStringify(this.props.params));
            return null;
        } else {
            return (<div className="reportContainer">
                <Stage stageHeadline={this.getStageHeadline()}
                       pageActions={this.getPageActions(5)}>

                    <ReportStage reportData={this.props.reportData} />
                </Stage>

                {this.getHeader()}

                <ReportToolsAndContent
                    params={this.props.params}
                    reportData={this.props.reportData}
                    appUsers={this.props.appUsers}
                    pendEdits={this.props.pendEdits}
                    isRowPopUpMenuOpen={this.props.isRowPopUpMenuOpen}
                    routeParams={this.props.routeParams}
                    selectedAppId={this.props.selectedAppId}
                    fields={this.props.fields}
                    searchStringForFiltering={this.props.reportData.searchStringForFiltering}
                    pageActions={this.getPageActions(0)}
                    nameForRecords={this.nameForRecords}
                    selectedRows={this.props.reportData.selectedRows}
                    scrollingReport={this.props.scrollingReport}
                    loadDynamicReport={this.loadDynamicReport}
                />
            </div>);
        }
    }
});

export default connect()(ReportRoute);
