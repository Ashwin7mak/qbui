import React from 'react';
import Stage from '../stage/stage';
import ReportStage from '../report/reportStage';
import ReportHeader from '../report/reportHeader';
import TableHomePageInitial from './tableHomePageInitial';
import TableIcon from '../qbTableIcon/qbTableIcon';
import IconActions from '../actions/iconActions';
import ReportToolsAndContent from '../report/reportToolsAndContent';
import Fluxxor from 'fluxxor';
import {I18nMessage} from "../../utils/i18nMessage";
import Constants from '../../../../common/src/constants';
import {connect} from 'react-redux';
import * as SearchActions from '../../actions/searchActions';
import * as TableActions from '../../actions/tableActions';
import * as FieldsActions from '../../actions/fieldsActions';
import {showTableCreationDialog} from '../../actions/tableCreationActions';
import {loadDynamicReport} from '../../actions/reportActions';
import {CONTEXT} from '../../actions/context';
import WindowLocationUtils from '../../utils/windowLocationUtils';
import {EDIT_RECORD_KEY, NEW_RECORD_VALUE} from '../../constants/urlConstants';
import _ from 'lodash';

let FluxMixin = Fluxxor.FluxMixin(React);
import './tableHomePage.scss';
import '../report/report.scss';

/**
 * table homepage route
 *
 * Note: this component has been partially migrated to Redux
 */
export const TableHomePageRoute = React.createClass({
    mixins: [FluxMixin],
    nameForRecords: "Records",

    getHeader() {
        return (
            <ReportHeader nameForRecords={this.nameForRecords}
                          rptId={this.props.reportData ? this.props.reportData.rptId : null} {...this.props}
            />);
    },

    /**
     * Load a report with query parameters.
     */
    loadDynamicReport(appId, tblId, rptId, format, filter, queryParams) {
        this.props.loadDynamicReport(appId, tblId, rptId, format, filter, queryParams);
    },

    loadTableHomePageReportFromParams(appId, tblId, offset, numRows) {
        const flux = this.getFlux();
        flux.actions.selectTableId(tblId);

        //  redux actions..
        this.props.clearSearchInput();
        this.props.loadFields(appId, tblId);

        //  loads from the report Nav context
        this.props.loadTableHomePage(CONTEXT.REPORT.NAV, appId, tblId, offset, numRows);
    },
    loadHomePageForParams(params) {
        let appId = params.appId;
        let tblId = params.tblId;

        if (appId && tblId) {
            //  Always fetch page 1 as this is called only when loading the home page for the first
            //  time.  Paging will always call report paging after initial load as the client will not
            //  (and shouldnt) know that the report is default table report and not a saved report.
            let offset = Constants.PAGE.DEFAULT_OFFSET;
            let numRows = Constants.PAGE.DEFAULT_NUM_ROWS;
            this.loadTableHomePageReportFromParams(appId, tblId, offset, numRows);
        }
    },
    componentDidMount() {
        const flux = this.getFlux();
        flux.actions.hideTopNav();

        if (this.props.params) {
            this.loadHomePageForParams(this.props.params);
        }
    },

    /**
     * Add a new record in trowser
     */
    editNewRecord() {
        WindowLocationUtils.pushWithQuery(EDIT_RECORD_KEY, NEW_RECORD_VALUE);
    },

    getPageActions(maxButtonsBeforeMenu) {
        const actions = [
            {msg: 'pageActions.addRecord', icon:'add', className:'addRecord', onClick: this.editNewRecord},
            {msg: 'unimplemented.makeFavorite', icon:'star', disabled: true},
            {msg: 'unimplemented.print', icon:'print', disabled: true}
        ];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={maxButtonsBeforeMenu}/>);
    },

    getStageHeadline() {
        let reportName = this.props.reportData && this.props.reportData.data && this.props.reportData.data.name;

        return (
            <div className="tableHomepageStageHeadline">
                <div className="navLinks">
                    {this.props.selectedTable && this.props.selectedTable.icon && <TableIcon icon={this.props.selectedTable.icon}/> }
                    <span>{this.props.selectedTable && this.props.selectedTable.name}&nbsp;<I18nMessage message={'nav.home'}/></span>
                </div>
            </div>);
    },

    /**
     * show we render the initial homepage information instead of the grid?
     * @returns {boolean}
     */
    showInitialTableHomePage() {

        const haveRecords = _.has(this.props, "reportData.data.records") && this.props.reportData.data.records.length > 0;
        const newTablesJSONArrray = window.sessionStorage && window.sessionStorage.newTables;

        if (haveRecords || !newTablesJSONArrray) {
            return false;
        }

        // show the initial homepage if we have the current table ID in session storage's newTables JSON array

        const newTableIds = newTablesJSONArrray.split(",");

        return newTableIds.indexOf(this.props.params.tblId) !== -1;
    },

    render() {
        //  ensure there is a rptId property otherwise the report not found page is rendered in ReportToolsAndContent
        let homePageParams = _.assign(this.props.params, {rptId: null});

        let mainContent;

        if (this.showInitialTableHomePage()) {
            mainContent = <TableHomePageInitial onCreateTable={this.props.showTableCreationDialog}
                                                        onAddRecord={this.editNewRecord} />;
        } else {
            mainContent = <ReportToolsAndContent
                params={homePageParams}
                reportData={this.props.reportData}
                appUsers={this.props.appUsers}
                routeParams={this.props.routeParams}
                selectedAppId={this.props.selectedAppId}
                searchStringForFiltering={this.props.reportData.searchStringForFiltering}
                selectedRows={this.props.reportData.selectedRows}
                scrollingReport={this.props.scrollingReport}
                rptId={this.props.reportData ? this.props.reportData.rptId : null}
                nameForRecords={this.nameForRecords}
                pendEdits={this.props.pendEdits}
                loadDynamicReport={this.loadDynamicReport}/>;
        }

        return (<div className="reportContainer">
            <Stage stageHeadline={this.getStageHeadline()} pageActions={this.getPageActions(5)}>
                <ReportStage reportData={this.props.reportData} />
            </Stage>

            {this.getHeader()}
            {mainContent}

        </div>);
    }
});

// similarly, abstract out the Redux dispatcher from the presentational component
// (another bit of boilerplate to keep the component free of Redux dependencies)
const mapStateToProps = (state) => {
    return {
        report: state.report
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        clearSearchInput:  () => {
            dispatch(SearchActions.clearSearchInput());
        },
        loadTableHomePage: (context, appId, tblId, offset, numRows) => {
            dispatch(TableActions.loadTableHomePage(CONTEXT.REPORT.NAV, appId, tblId, offset, numRows));
        },
        loadFields: (appId, tblId) => {
            dispatch(FieldsActions.loadFields(appId, tblId));
        },
        loadDynamicReport: (appId, tblId, rptId, format, filter, queryParams) => {
            dispatch(loadDynamicReport(CONTEXT.REPORT.NAV, appId, tblId, rptId, format, filter, queryParams));
        },
        showTableCreationDialog: () => {
            dispatch(showTableCreationDialog());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TableHomePageRoute);
