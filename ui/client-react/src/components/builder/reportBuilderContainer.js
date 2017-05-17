import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Logger from '../../utils/logger';
import _ from 'lodash';
import {DragDropContext} from 'react-dnd';
import TouchBackend from 'react-dnd-touch-backend';
import ReportColumnTransformer from '../dataTable/reportGrid/reportColumnTransformer';
import ReportRowTransformer from '../dataTable/reportGrid/reportRowTransformer';
import ReportColumnHeaderMenu from '../dataTable/reportGrid/reportColumnHeaderMenu';
import ReportNameEditor from '../reportBuilder/reportNameEditor';
import ReportFieldSelectMenu from '../reportBuilder/reportFieldSelectMenu';
import ReportSaveOrCancelFooter from '../reportBuilder/reportSaveOrCancelFooter';
import QbGrid from '../dataTable/qbGrid/qbGrid';
import ReportCell from '../dataTable/reportGrid/reportCell';
import ReportToolbar from '../report/reportToolbar';
import Locale from '../../locales/locales';
import FilterUtils from '../../utils/filterUtils';
import StringUtils from '../../utils/stringUtils';
import * as query from '../../constants/query';
import ReportUtils from '../../utils/reportUtils';
import * as Constants from "../../../../common/src/constants";
import {CONTEXT} from '../../actions/context';
import {exitBuilderMode, closeFieldSelectMenu} from '../../actions/reportBuilderActions';
import {loadDynamicReport} from '../../actions/reportActions';

import './reportBuilderContainer.scss';

let logger = new Logger();

export class ReportBuilderContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.debouncedFilterReport = _.debounce(this.filterReport, 700);
    }

    getSaveOrCancelFooter = () => {
        let {appId, tblId} = this.props.match.params;
        return <ReportSaveOrCancelFooter appId={appId} tblId={tblId}/>;
    };

    isOnlyOneColumnVisible(columns) {
        return columns.filter(column => {
                return !column.isHidden && !column.isPlaceholder;
            }).length === 1;
    };

    filterOnSelections = (newSelections) => {
        this.debouncedFilterReport(this.props.reportData.searchStringForFiltering, newSelections, true);
    };

    filterReport = (searchString, selections, alwaysRunReport) => {
        // leading and trailing spaces are trimmed..
        const trimmedSearch = StringUtils.trim(searchString);

        //  only generate a report if search value differs from prior search value OR alwaysRunReport is set to true
        if (trimmedSearch !== this.props.reportData.searchStringForFiltering || alwaysRunReport === true) {
            logger.debug('Sending filter action with:' + trimmedSearch);

            let facetFields = this.mapFacetFields();
            const filter = FilterUtils.getFilter(StringUtils.trim(trimmedSearch), selections, facetFields);

            let queryParams = {};
            queryParams[query.SORT_LIST_PARAM] = ReportUtils.getGListString(this.props.reportData.data.sortFids, this.props.reportData.data.groupEls);

            // new search always resets to 1st page
            queryParams[query.OFFSET_PARAM] = Constants.PAGE.DEFAULT_OFFSET;
            queryParams[query.NUMROWS_PARAM] = Constants.PAGE.DEFAULT_NUM_ROWS;

            this.props.loadDynamicReport(CONTEXT.REPORT.NAV, this.props.match.params.appId,
                this.props.match.params.tblId, this.props.match.params.rptId, true, filter, queryParams);
        }
    };

    render() {
        let {appId, tblId, rptId} = this.props.match.params;
        let {columns, records, sortFids, name} = this.props.reportData.data;
        let recordShowLimit = 25;
        let transformedColumns = ReportColumnTransformer.transformColumnsForGrid(columns);
        transformedColumns.forEach(column => {
            column.fieldDef.userEditableValue = false;
        });
        let transformedRows = ReportRowTransformer.transformRecordsForGrid(_.take(records, recordShowLimit), columns);
        let numberOfRecords = records.length;
        return (
            <div className="reportBuilderContainer">
                <ReportFieldSelectMenu
                    appId={appId}
                    tblId={tblId}
                    reportData={this.props.reportData}>
                    <div className="reportBuilderContainerContent">
                        <div className="reportBuilderHeader">
                            {name && <ReportNameEditor name={name}/>}
                            <ReportToolbar
                                reportData={this.props.reportData}
                                searchStringForFiltering={this.props.reportData.searchStringForFiltering}
                                selections={this.props.reportData.selections}
                                filterOnSelections={this.filterOnSelections}
                                isRightToolbarVisible={false}
                                isSearchBoxVisible={false}
                            />
                        </div>
                        <QbGrid
                            numberOfColumns={columns.length}
                            columns={transformedColumns}
                            rows={transformedRows}
                            isDraggable={true}
                            cellRenderer={ReportCell}
                            menuComponent={ReportColumnHeaderMenu}
                            showRowActionsColumn={false}
                            menuProps={{
                                appId: appId,
                                tblId: tblId,
                                rptId: rptId,
                                sortFids: sortFids,
                                isOnlyOneColumnVisible: this.isOnlyOneColumnVisible(columns)
                            }}
                        />
                        <div className="recordCount">
                            {(numberOfRecords > recordShowLimit)
                            && Locale.getMessage('builder.reportBuilder.recordLimitFirstHalf')
                            + recordShowLimit
                            + Locale.getMessage('builder.reportBuilder.recordLimitMiddle')
                            + numberOfRecords
                            + Locale.getMessage('builder.reportBuilder.recordLimitSecondHalf')}
                        </div>
                    </div>
                </ReportFieldSelectMenu>
                {this.getSaveOrCancelFooter()}
            </div>
        );
    }
}

ReportBuilderContainer.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            /**
             * the app id */
            appId: PropTypes.string,

            /**
             * the table id */
            tblId: PropTypes.string,

            /**
             * the report id */
            rptId: PropTypes.string
        })
    }),

    /**
     * A route that will be redirected to after a save/cancel action. Currently passed through mapState. */
    redirectRoute: PropTypes.string,

    /**
     * Controls the open state of the left tool panel */
    isOpen: PropTypes.bool,

    /**
     * Controls the collapsed state of the left tool panel */
    isCollapsed: PropTypes.bool
};

const mapStateToProps = (state) => {
    return {
        reportBuilder: state.reportBuilder,
        reportData: (_.find(state.report, {'id': CONTEXT.REPORT.NAV}))
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        exitBuilderMode: (context) => dispatch(exitBuilderMode(context)),

        closeFieldSelectMenu: (context) => dispatch(closeFieldSelectMenu(context)),

        loadDynamicReport: (context, appId, tblId, rptId, format, filter, queryParams) => {
            dispatch(loadDynamicReport(context, appId, tblId, rptId, format, filter, queryParams))
        }
    };
};

export default DragDropContext(TouchBackend({enableMouseEvents: true, delay: 30}))(
    connect(mapStateToProps, mapDispatchToProps)(ReportBuilderContainer));
