import * as types from '../actions/types';
import {UNSAVED_RECORD_ID} from '../constants/schema';
import {NEW_RECORD_VALUE} from '../constants/urlConstants';
import _ from 'lodash';
import FacetSelections from '../components/facet/facetSelections';
import ReportModelHelper from '../models/reportModelHelper';
import {CONTEXT} from '../actions/context';

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

    /**
     * Makes sure the order of the columns isn't out of sync with their actual position.
     * Used in adding/hiding columns and when opening/closing field select menu.
     * @param columns
     */
    function reorderColumns(columns) {
        let newOrder = 1;
        columns.forEach((column) => {
            column.order = newOrder++;
        });
    }

    /**
     * Takes in the data (columns) and returns the new order of the columns after moving them.
     * Used in drag/drop columns.
     * @param data (columns)
     * @param sourceIndex (dragSource)
     * @param targetIndex (dropTarget)
     */
    function columnMove(data, sourceIndex, targetIndex) {
        let sourceItem = data[sourceIndex];
        let ret = data.slice(0, sourceIndex).concat(data.slice(sourceIndex + 1));
        return ret.slice(0, targetIndex).concat([sourceItem]).concat(ret.slice(targetIndex));
    }

    /**
     * Takes in the data (columns) and returns the new order of the fids after moving them.
     * Used in drag/drop columns.
     * @param data (columns)
     * @param sourceItem (dragSource)
     * @param targetItem (dropTarget)
     */
    function updateColumnFids(data, sourceItem, targetItem) {
        let sourceIndex;
        let targetIndex;
        for (let i = 0; i < data.length; i++) {
            if (data[i] === sourceItem) {
                sourceIndex = i;
            }
            if (data[i] === targetItem) {
                targetIndex = i;
            }
        }
        let ret = data.slice(0, sourceIndex).concat(data.slice(sourceIndex + 1));
        return ret.slice(0, targetIndex).concat([sourceItem]).concat(ret.slice(targetIndex));
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
        //  NOTE: this event is listened to in the record reducer to avoid multiple grid renders.
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

                if (content.newRecId) {
                    //  if there is a blank record created from inline editing, we'll remove the blank record
                    //  from the report and then add the new row based on recId supplied when creating the blank row
                    const hasBlankRec = ReportModelHelper.isBlankRecInReport(currentReport);
                    if (hasBlankRec) {
                        //  delete the blank row from the report
                        ReportModelHelper.deleteRecordFromReport(currentReport, UNSAVED_RECORD_ID);
                        //  add the new row where the blank row was sitting...we know where that is because we
                        //  saved the rec id immediately prior to the blank row when it was added to the report.
                        content.afterRecId = currentReport.recIdBeforeBlankRow;
                    }
                    ReportModelHelper.addReportRecord(currentReport, content);
                } else {
                    // update the existing report row
                    ReportModelHelper.updateReportRecord(currentReport, content);
                }

                //  has the user elected to add a new row to the grid via inline edit after update/save
                if (action.content.addNewRow === true) {
                    let newRowContent = {
                        newRecId: UNSAVED_RECORD_ID,
                        afterRecId: content.newRecId || content.recId
                    };
                    ReportModelHelper.addReportRecord(currentReport, newRowContent);
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
                //  search each report entry and remove the record
                //  from any report for the appId/tblId/recId combination
                if (rpt.appId === appId && rpt.tblId === tblId) {
                    ids.forEach((recId) => {
                        //  remove the record from the report
                        ReportModelHelper.deleteRecordFromReport(rpt, recId);
                        rpt.selectedRows = _.without(rpt.selectedRows, recId);
                    });
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
    case types.REMOVE_BLANK_REPORT_RECORD: {
        //  NOTE: this event is listened to in the record reducer to avoid multiple grid renders.
        let currentReport = getReportFromState(action.id);
        if (currentReport && action.content) {
            const appId = action.content.appId;
            const tblId = action.content.tblId;
            if (currentReport.appId === appId && currentReport.tblId === tblId) {
                ReportModelHelper.deleteRecordFromReport(currentReport, action.content.recId);
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
    case types.INSERT_PLACEHOLDER_COLUMN: {
        let currentReport = getReportFromState(action.id);
        if (currentReport) {
            let params = action.content;
            let clickedColumnName = params.clickedColumnName;
            let clickedColumnId = currentReport.data.columns.filter(column => {
                return column.headerName === clickedColumnName;
            })[0].id;
            let addBefore = params.addBeforeColumn;
            // remove the placeholder column if it exists
            _.remove(currentReport.data.columns, (col) => {return col.isPlaceholder;});
            // find the index of the column where 'add a column' was clicked
            let clickedColumnIndex = _.findIndex(currentReport.data.columns, (col) => {return col.id === clickedColumnId;});
            if (clickedColumnIndex !== -1) {
                // since not all columns are visible, add the placeholder column to columns so it gets rendered on screen
                let placeholder = {
                    fieldDef: {
                        userEditableValue: false
                    },
                    isPlaceholder: true,
                    isHidden: false,
                    id: -1
                };

                // add before or after the clicked column depending on selection
                let insertionIndex;
                if (addBefore) {
                    insertionIndex = clickedColumnIndex;
                } else {
                    insertionIndex = clickedColumnIndex + 1;
                }
                currentReport.data.columns.splice(insertionIndex, 0, placeholder);
                reorderColumns(currentReport.data.columns);
                return newState(currentReport);
            }
        }
        return state;
    }
    case types.ADD_COLUMN_FROM_EXISTING_FIELD: {
        let currentReport = getReportFromState(action.id);
        if (currentReport) {
            // metadata
            let currentColumns = currentReport.data.columns;
            // passed in params
            let params = action.content;
            let addBefore = params.addBefore;
            let requestedColumn = params.requestedColumn;

            let requestedColumnIndex = _.findIndex(currentColumns, (col) => {return col.id === requestedColumn.id;});
            let requestedInCurrentColumns = requestedColumnIndex !== -1;

            let columnMoving;
            if (requestedInCurrentColumns) {
                columnMoving = currentColumns.splice(requestedColumnIndex, 1)[0];
            } else {
                columnMoving = requestedColumn;
            }
            // searches through the current columns to find the index of the placeholder
            let placeholderIndex = _.findIndex(currentColumns, (col) => {return col.isPlaceholder;});
            let fidInsertionIndex;
            if (placeholderIndex === -1) {
                placeholderIndex = 0;
                fidInsertionIndex = 0;
            } else {
                fidInsertionIndex = placeholderIndex;
                // when adding after, account for the index of the placeholder by adding 1
                if (!addBefore) {
                    placeholderIndex++;
                }
            }
            // insert the requested column in the correct place in the columns list
            currentColumns.splice(placeholderIndex, 0, columnMoving);

            // show the currently hidden column that was just added
            currentColumns.forEach(column => {
                if (column.id === requestedColumn.id) {
                    column.isHidden = false;
                }
                return column;
            });
            _.remove(currentReport.data.columns, column => {return column.isPlaceholder;});
            _.remove(currentReport.data.fids, fid => {return fid === requestedColumn.id;});
            currentReport.data.fids.splice(fidInsertionIndex, 0, requestedColumn.id);
            reorderColumns(currentReport.data.columns);
            return newState(currentReport);
        }
        return state;
    }
    case types.HIDE_COLUMN: {
        let currentReport = getReportFromState(action.id);
        if (currentReport) {
            // metadata
            let columns = currentReport.data.columns;
            let fids = currentReport.data.fids;
            // passed in params
            let params = action.content;
            let clickedColumnId = params.clickedId;
            // mark the clicked column as hidden so it does not get rendered
            columns.forEach(column => {
                if (column.id === clickedColumnId) {
                    column.isHidden = true;
                }
            });
            // update the fids and metafids to reflect the hidden column
            currentReport.data.fids = fids.filter(fid => {
                return fid !== clickedColumnId;
            });
            return newState(currentReport);
        }
        return state;
    }
    case types.MOVE_COLUMN: {
        let currentReport = getReportFromState(action.id);
        if (currentReport) {
            //metadata
            let columns = currentReport.data.columns;
            let fids = currentReport.data.fids;
            let sourceIndex;
            let sourceFid;
            let targetIndex;
            let targetFid;
            //for calculating the source and target index for the sourceLabel and targetLabel
            for (let i = 0; i < columns.length; i++) {
                if (columns[i].headerName === action.content.sourceLabel) {
                    sourceIndex = i;
                    sourceFid = columns[i].id;
                }
                if (columns[i].headerName === action.content.targetLabel) {
                    targetIndex = i;
                    targetFid = columns[i].id;
                }
            }
            //new order of the columns is stored in movedColumns
            let movedColumns = columnMove(columns, sourceIndex, targetIndex);
            //new order of the fids is stored in updateFids
            let updateFids = updateColumnFids(fids, sourceFid, targetFid);

            // update columns, fids and metafids to reflect the dragged and dropped column
            currentReport.data.columns = movedColumns;
            currentReport.data.fids = updateFids;
            currentReport.data.metaData.fids = updateFids;
            return newState(currentReport);
        }
        return state;
    }
    case types.CHANGE_REPORT_NAME: {
        let currentReport = getReportFromState(action.id);
        if (currentReport) {
            // change the report data.name to show changes before save
            currentReport.data.name = action.content.newName;
            // change the report metaData.name to patch the changes after save
            currentReport.data.metaData.name = action.content.newName;
            return newState(currentReport);
        }
        return state;
    }
    default:
        // by default, return existing state
        return state;
    }
};

export const getNavReport  = (state) => _.find(state, (rpt) => rpt.id === CONTEXT.REPORT.NAV);
export const getListReport  = (state) => _.find(state, (rpt) => rpt.id === CONTEXT.REPORT.NAV_LIST);

export default report;
