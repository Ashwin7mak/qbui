import React from 'react';
import Stage from '../stage/stage';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon.js';
import ReportStage from './reportStage';
import ReportHeader from './reportHeader';
import IconActions from '../actions/iconActions';
import {Link} from 'react-router-dom';
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
import ReportFieldSelectMenu from './reportFieldSelectMenu';
import {connect} from 'react-redux';
import {clearSearchInput} from '../../actions/searchActions';
import {loadReport, loadDynamicReport} from '../../actions/reportActions';
import {loadFields} from '../../actions/fieldsActions';
import {CONTEXT} from '../../actions/context';
import {APP_ROUTE, EDIT_RECORD_KEY, NEW_RECORD_VALUE} from '../../constants/urlConstants';

import * as FieldsReducer from '../../reducers/fields';

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
        this.props.loadDynamicReport(CONTEXT.REPORT.NAV, appId, tblId, rptId, format, filter, queryParams);
    },

    /**
     * Load a report with query parameters.
     */
    loadDynamicReportFromParams(appId, tblId, rptId, queryParams) {
        const flux = this.getFlux();
        flux.actions.selectTableId(tblId);

        // ensure the search box is cleared for the new report
        this.props.clearSearchInput();

        //  get the fields for this app/tbl
        this.props.loadFields(appId, tblId);

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

        if (this.props.match.params) {
            this.loadReportFromParams(this.props.match.params);
        }
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
        WindowLocationUtils.pushWithQuery(EDIT_RECORD_KEY, NEW_RECORD_VALUE);
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
            return (
                <div className="reportContainer">
                    <ReportFieldSelectMenu
                        appId={this.props.match.params.appId}
                        tblId={this.props.match.params.tblId}
                        reportData={this.props.reportData}
                        pullRight>

                        <Stage stageHeadline={this.getStageHeadline()}
                               pageActions={this.getPageActions(5)}>
                            <ReportStage reportData={this.props.reportData}/>
                        </Stage>

                        {this.getHeader()}

                        <ReportToolsAndContent
                            params={this.props.match.params}
                            reportData={this.props.reportData}
                            appUsers={this.props.appUsers}
                            pendEdits={this.props.pendEdits}
                            isRowPopUpMenuOpen={this.props.isRowPopUpMenuOpen}
                            routeParams={this.props.match.params}
                            selectedAppId={this.props.selectedAppId}
                            selectedTable={this.props.selectedTable}
                            searchStringForFiltering={this.props.reportData.searchStringForFiltering}
                            pageActions={this.getPageActions(0)}
                            nameForRecords={this.nameForRecords}
                            selectedRows={this.props.reportData.selectedRows}
                            scrollingReport={this.props.scrollingReport}
                            loadDynamicReport={this.loadDynamicReport}
                            noRowsUI={true}
                        />

                    </ReportFieldSelectMenu>
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
        }
    };
};

export default connect(null, mapDispatchToProps)(ReportRoute);
