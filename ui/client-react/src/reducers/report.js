import * as types from '../actions/types';
import {UNSAVED_RECORD_ID} from '../constants/schema';
import {NEW_RECORD_VALUE} from '../constants/urlConstants';
import _ from 'lodash';
import FacetSelections from '../components/facet/facetSelections';
import ReportUtils from '../utils/reportUtils';
import ReportModelHelper from '../models/reportModelHelper';

/**
 * Manage array of report states
 *
 * @param state - array of states
 * @param action - event type
 * @returns {Array}
 */
const report = (state = [], action) => {
    /**
     * Create a deep clone of the state array.  If the new state obj
     * id/context is not found, add to the end of the array.
     * Otherwise, replace the existing entry with its new state.
     *
     * @param obj - data object associated with new state
     * @returns {*}
     */
    function newState(obj) {
        // reducer - no mutations against current state!
        const stateList = _.cloneDeep(state);

        //  does the state already hold an entry for the report context/id
        const index = _.findIndex(stateList, rpt => rpt.id === obj.id);

        //  append or replace obj into the cloned copy
        if (index !== -1) {
            stateList[index] = obj;
        } else {
            stateList.push(obj);
        }
        return stateList;
    }

    /**
     * Search the state list for the report id.  If found, will
     * return a cloned object.
     *
     * @param id
     * @returns {*}
     */
    function getReportFromState(id) {
        //  retrieve a copy of the report for the given context/id
        const index = _.findIndex(state, rpt => rpt.id === id);
        if (index !== -1) {
            return _.cloneDeep(state[index]);
        }
        return null;
    }

    //  what report action is being requested
    switch (action.type) {
    case types.LOAD_REPORT:
        //  load a report.  Id is the context that the report is being loaded..ie:
        //  ie: NAV, Embedded report, etc.
        const loadRptObj = {
            id: action.id,
            appId: action.content ? action.content.appId : '',
            tblId: action.content ? action.content.tblId : '',
            rptId: action.content ? action.content.rptId : '',
            loading: true
        };
        return newState(loadRptObj);
    case types.LOAD_REPORTS: {
        //  load a list of reports.  Id is the 'LIST' context
        const loadReportsObj = {
            id: action.id,
            appId: action.content ? action.content.appId : '',
            tblId: action.content ? action.content.tblId : '',
            loading: true
        };
        return newState(loadReportsObj);
    }
    case types.LOAD_REPORT_FAILED:
    case types.LOAD_REPORTS_FAILED: {
        //  Report(s) load request failed
        let currentReport = getReportFromState(action.id);
        if (currentReport) {
            currentReport.loading = false;
            currentReport.error = true;
            currentReport.errorDetails = action.content;
            return newState(currentReport);
        }
        return state;
    }
    case types.LOAD_REPORT_SUCCESS: {
        //  load a report is successful..update the store with the report info
        let currentReport = getReportFromState(action.id);

        if (currentReport) {
            // set the report data from action.content.
            // action.content maps to reportModel.getModel()
            currentReport.data = action.content.data;

            // if no report id, then we need to set the report id from the data
            // response as we're loading the default table report.
            if (!currentReport.rptId) {
                currentReport.rptId = currentReport.data.rptId;
            }

            // set misc report container data
            currentReport.pageOffset = action.content.pageOffset;
            currentReport.numRows = action.content.numRows;
            //  faceting and searching
            currentReport.searchStringForFiltering = action.content.searchStringForFiltering;
            currentReport.selections = action.content.selections || new FacetSelections();
            currentReport.facetExpression = action.content.facetExpression || {};
            //  UI row selection list
            currentReport.selectedRows = action.content.selectedRows;

            // set loading state
            currentReport.loading = false;
            currentReport.error = false;

            return newState(currentReport);
        }

        return state;
    }
    case types.LOAD_REPORTS_SUCCESS: {
        //  load a list of reports is successful..update the store with the report list
        let currentReports = getReportFromState(action.id);
        if (currentReports) {
            // the list of reports to display
            // action.content maps to reportsModel.js
            currentReports.list = action.content.reportsList;

            // set loading state
            currentReports.loading = false;
            currentReports.error = false;
            return newState(currentReports);
        }
        return state;
    }
    case types.SELECT_REPORT_RECORDS: {
        //  1..n records in a report have been selected by the user...update
        //  the 'selections' element on the report
        let currentReport = getReportFromState(action.id);
        if (currentReport) {
            currentReport.selectedRows = action.content.selections;
            return newState(currentReport);
        }
        return state;
    }
    case types.SAVE_RECORD_SUCCESS: {
        //  listen to record save event.  If there is a report context
        //  defined, then the report is updated with the new/updated record.
        let rpt = _.get(action, 'content.report');
        if (rpt && rpt.context) {
            let currentReport = getReportFromState(rpt.context);
            if (currentReport) {
                let content = {
                    recId: rpt.recId,
                    record: rpt.record ? rpt.record.record : [],
                    newRecId: rpt.newRecId,
                    afterRecId: rpt.afterRecId
                };

                //  if this is a new record, add it to the report; otherwise
                //  update the report row with the changes
                if (content.newRecId) {
                    ReportModelHelper.addReportRecord(currentReport, content);
                } else {
                    ReportModelHelper.updateReportRecord(currentReport, content);
                }
                currentReport.loading = false;
                currentReport.error = false;
                return newState(currentReport);
            }
        }
        return state;
    }
    case types.REMOVE_REPORT_RECORDS: {
        // search all reports in the store and remove the deleted record
        // from any loaded report.
        const appId = action.content ? action.content.appId : null;
        const tblId = action.content ? action.content.tblId : null;
        const ids = action.content ? action.content.recIds : [];

        if (appId && tblId && Array.isArray(ids)) {
            const reports = _.cloneDeep(state);
            reports.forEach((rpt) => {
                //  table reports have a data model object
                if (_.has(rpt, 'data')) {
                    //  search each report entry and remove the record
                    //  from any report for the appId/tblId/recId combination
                    if (rpt.appId === appId && rpt.tblId === tblId) {
                        ids.forEach((recId) => {
                            //  remove the record from the report
                            ReportModelHelper.deleteRecordFromReport(rpt.data, recId);
                            rpt.selectedRows = _.without(rpt.selectedRows, recId);
                        });
                    }
                }
            });
            return reports;
        }
        return state;
    }
    case types.ADD_BLANK_REPORT_RECORD: {
        let currentReport = getReportFromState(action.id);
        if (currentReport) {
            let content = {
                newRecId: UNSAVED_RECORD_ID,
                afterRecId: action.content.afterRecId
            };

            //  gotta have an id to know where to insert the new record
            if (content.afterRecId !== undefined) {
                // remove record from report if its new and unsaved
                if (currentReport.editingIndex !== undefined || currentReport.editingId !== undefined) {
                    if (content.afterRecId === UNSAVED_RECORD_ID || content.afterRecId === NEW_RECORD_VALUE) {
                        ReportModelHelper.deleteRecordFromReport(currentReport, content.afterRecId);
                    }
                    currentReport.editingIndex = undefined;
                    currentReport.editingId = undefined;
                }

                ReportModelHelper.addReportRecord(currentReport, content);
                return newState(currentReport);
            }
        }
        return state;
    }
    case types.CHANGE_LOCALE: {
        // listen for change locale event and update all reports to the new locale
        const reports = _.cloneDeep(state);
        reports.forEach((rpt) => {
            if (rpt && !rpt.loading) {
                //  table reports have a data model object
                if (_.has(rpt, 'data')) {
                    let groupEls = rpt.data.groupEls;
                    let fids = rpt.data.fids;
                    let fields = rpt.data.hasGrouping ? rpt.data.gridColumns : rpt.data.fields;
                    rpt.data.columns = ReportModelHelper.getReportColumns(fields, fids, groupEls);
                }
            }
        });
        return reports;
    }
    case types.ADD_COLUMN_SUCCESS: {
        let currentReport = getReportFromState(action.id);
        if (currentReport) {
            let columns = currentReport.data.columns;
            let params = action.content;

            // searches through the current columns to find the one that was selected
            let clickedColumn;
            let columnToAdd = params.requested;
            for (let currentColumnIndex = 0; currentColumnIndex < columns.length; currentColumnIndex++) {
                let column = columns[currentColumnIndex];
                if (column.id === params.clickedId) {
                    clickedColumn = columns[currentColumnIndex];
                }
            }

            let indexedOrder = clickedColumn.order - 1;
            // correctly position the new column in the table
            if (params.addBefore) {
                columns.splice(indexedOrder, 0, columnToAdd);
                clickedColumn.order += 1
            } else {
                columns.splice(indexedOrder + 1, 0, columnToAdd);
            }

            return newState(currentReport);
        }
        return state;
    }
    default:
        // by default, return existing state
        return state;
    }
};

export default report;
