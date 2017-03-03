import * as types from '../actions/types';
import _ from 'lodash';
import FacetSelections from '../components/facet/facetSelections';
import FieldFormats from '../utils/fieldFormats';
import FieldUtils from '../utils/fieldUtils';
import ReportUtils from '../utils/reportUtils';

//import * as textFormatter from '../../../common/src/formatter/textFormatter';
//import * as dateTimeFormatter from '../../../common/src/formatter/dateTimeFormatter';
//import * as timeOfDayFormatter from '../../../common/src/formatter/timeOfDayFormatter';
//import * as numericFormatter from '../../../common/src/formatter/numericFormatter';
//import * as userFormatter from '../../../common/src/formatter/userFormatter';
//import * as urlFormatter from '../../../common/src/formatter/urlFileAttachmentReportLinkFormatter';
//import * as emailFormatter from '../../../common/src/formatter/emailFormatter';
//import * as passThroughFormatter from '../../../common/src/formatter/passthroughFormatter';
//import * as durationFormatter from '../../../common/src/formatter/durationFormatter';

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
        const index = _.findIndex(state, rpt => rpt.id === id);
        if (index !== -1) {
            return _.cloneDeep(state[index]);
        }
        return null;
    }

    //  what report action is being requested
    switch (action.type) {
    case types.LOAD_REPORT:
    case types.LOAD_REPORTS: {
        const obj = {
            id: action.id,
            loading: true,
            appId: action.content.appId,
            tblId: action.content.tblId,
            rptId: action.content.rptId
        };
        return newState(obj);
    }
    case types.LOAD_REPORT_FAILED:
    case types.LOAD_REPORTS_FAILED: {
        const obj = {
            id: action.id,
            loading: false,
            error: true,
            errorDetails: action.content
        };
        return newState(obj);
    }
    case types.LOAD_REPORT_SUCCESS: {
        const obj = {
            id: action.id,
            loading: false,
            error: false,
            data: action.content,
            //  TODO: needed??..these are on the data property
            appId: action.content.appId,
            tblId: action.content.tblId,
            rptId: action.content.rptId,
            //
            pageOffset: action.content.pageOffset,
            numRows: action.content.numRows,
            //  faceting and searching
            searchStringForFiltering: action.content.searchStringForFiltering,
            selections: action.content.selections || new FacetSelections(),
            facetExpression: action.content.facetExpression || {},
            //  UI row selection list
            selectedRows: []
        };
        return newState(obj);
    }
    case types.LOAD_REPORTS_SUCCESS: {
        const obj = {
            id: action.id,
            loading: false,
            error: false,
            appId: action.content.appId,
            tblId: action.content.tblId,
            list: action.content.reportsList
        };
        return newState(obj);
    }
    case types.SELECT_REPORT_LIST: {
        let rpt = getReportFromState(action.id);
        if (rpt) {
            rpt.selectedRows = action.content.selections;
            return newState(rpt);
        }
        return state;
    }
    //case types.SAVE_RECORD: {
    //    let currentReport = getReportFromState(action.content.report.context);
    //    if (currentReport) {
    //        updateReportRecord(currentReport, action.content.report.record);
    //        return newState(currentReport);
    //    }
    //    return state;
    //}
    case types.SAVE_RECORD_SUCCESS: {
        let rpt = action.content.report;
        if (rpt && rpt.context) {
            let currentReport = getReportFromState(rpt.context);
            if (currentReport) {
                let obj = {
                    recId: rpt.recId,
                    record: rpt.record ? rpt.record.record : []
                };
                updateReportRecord(currentReport, obj);
                currentReport.loading = false;
                currentReport.error = false;
                return newState(currentReport);
            }
        }
        return state;
    }
    //case types.SAVE_RECORD_ERROR: {
    //    let ctx = action.content.context;
    //    if (ctx) {
    //        let currentReport = getReportFromState(ctx);
    //        if (currentReport) {
    //            currentReport.loading = false;
    //            return newState(currentReport);
    //        }
    //    }
    //    return state;
    //}
    case types.UPDATE_REPORT_RECORD: {
        let currentReport = getReportFromState(action.id);
        if (currentReport) {
            updateReportRecord(currentReport, action.content);
            return newState(currentReport);
        }
        return state;
    }
    case types.REMOVE_REPORT_RECORDS: {
        // remove record from all report stores
        const ids = action.content.recIds;
        const reports = _.cloneDeep(state);
        reports.forEach((rpt) => {
            ids.forEach((recId) => {
                deleteRecordFromReport(rpt.data, recId);
                rpt.selectedRows = _.without(rpt.selectedRows, recId);
            });
        });
        return reports;
    }
    default:
        // by default, return existing state
        return state;
    }
};

function updateReportRecord(currentReport, content) {
    let record = null;
    let filtRecord = null;
    if (currentReport.data.hasGrouping) {
        record = ReportUtils.findGroupedRecord(currentReport.data.records, content.recId, currentReport.data.keyField.name);
        filtRecord = ReportUtils.findGroupedRecord(currentReport.data.filteredRecords, content.recId, currentReport.data.keyField.name);
    } else {
        record = findRecordById(currentReport.data.records, content.recId, currentReport.data.hasGrouping, currentReport.data.keyField);
        filtRecord = findRecordById(currentReport.data.filteredRecords, content.recId, currentReport.data.hasGrouping, currentReport.data.keyField);
    }

    // update rec from format [{id, value}] to [fieldName: {id, value}] so it can be consumed by formatRecordValues
    // formatRecordValues will add all display values
    // patch the previously created skeleton of record with the newRecord values
    let formattedRec = formatRecord(content.record, currentReport.data.fields);

    //TODO: really want to avoid formatting as the individual components should be handling this rqeuirement
    //formatRecordValues(formattedRec, currentReport.data.fields);

    //  update each cell in the report grid with the updated record data
    Object.keys(formattedRec).forEach((fieldName) => {
        //  update the record list
        if (record && record[fieldName] && formattedRec[fieldName]) {
            record[fieldName].value = formattedRec[fieldName].value;
            if (formattedRec[fieldName].display !== undefined) {
                record[fieldName].display = formattedRec[fieldName].display;
            }
        }
        //  update the filtered list
        if (filtRecord && filtRecord[fieldName] && formattedRec[fieldName]) {
            filtRecord[fieldName].value = formattedRec[fieldName].value;
            if (formattedRec[fieldName].display !== undefined) {
                filtRecord[fieldName].display = formattedRec[fieldName].display;
            }
        }
    });
}

function formatRecord(record, fields) {
    let formattedRec = {};
    record.forEach(rec => {
        let matchingField = _.find(fields, (field) => {
            return rec.id === field.id;
        });
        if (matchingField) {
            formattedRec[matchingField.name] = _.clone(rec);
        }
    });
    return formattedRec;
}

function findRecordById(records, recId, hasGrouping, keyField) {
    if (hasGrouping) {
        return ReportUtils.findGroupedRecord(records, recId, keyField.name);
    } else {
        /*eslint eqeqeq:0*/
        return records.find(rec => rec[keyField.name].value == recId);
    }
}

function deleteRecordFromReport(reportData, recId) {
    // TODO: needed?
    var recordValueToMatch = {};
    recordValueToMatch[FieldUtils.getPrimaryKeyFieldName(recordValueToMatch)] = {value: recId};

    const newFilteredRecords = reportData.filteredRecords ? reportData.filteredRecords.slice(0) : null;
    const newRecords = reportData.records ? reportData.records.slice(0) : null;
    let recordDeleted = false;
    let filteredRecordDeleted = false;

    if (reportData.hasGrouping) {
        filteredRecordDeleted = ReportUtils.removeGroupedRecordById(newFilteredRecords, recId, reportData.keyField.name);
        recordDeleted = ReportUtils.removeGroupedRecordById(newRecords, recId, reportData.keyField.name);
    } else {
        //find record
        let filteredRecordIndex = ReportUtils.findRecordIndex(newFilteredRecords, recId, reportData.keyField.name);
        //remove it
        if (filteredRecordIndex !== -1) {
            filteredRecordDeleted = true;
            newFilteredRecords.splice(filteredRecordIndex, 1);
        }

        //find record
        let recordIndex = ReportUtils.findRecordIndex(newRecords, recId, reportData.keyField.name);
        //remove it
        if (recordIndex !== -1) {
            recordDeleted = true;
            newRecords.splice(recordIndex, 1);
        }
    }
    if (filteredRecordDeleted) {
        reportData.filteredRecords = newFilteredRecords;
        reportData.filteredRecordsCount--;
    }
    if (recordDeleted) {
        reportData.records = newRecords;
        reportData.recordsCount--; //pagination uses this one.
    }
}


//function formatRecordValues(newRecord, fields) {
//    Object.keys(newRecord).forEach((key) => {
//        let recField = newRecord[key];
//        recField.display = formatFieldValue(recField, fields);
//    });
//}

///**
// * formats a fields value according to the fields type
// * @param recField
// * @returns {*} the formatted value
// */
//function formatFieldValue(recField, fields) {
//    let answer = null;
//
//    if (recField && recField.value) {
//        // assume same raw and formatted
//        answer = recField.value;
//
//        //get the corresponding field meta data
//        let fieldMeta = _.find(fields, (item) => {
//            return (((recField.id !== undefined) && (item.id === recField.id) ||
//            ((recField.fieldName !== undefined) && (item.name === recField.fieldName))));
//        });
//
//        //format the value by field display type
//        if (fieldMeta && fieldMeta.datatypeAttributes && fieldMeta.datatypeAttributes.type) {
//            let formatType = FieldFormats.getFormatType(fieldMeta.datatypeAttributes);
//            let formatter = getFormatter(formatType);
//
//            // if there's a formatter use it to format the display version
//            if (formatter !== null) {
//                answer = formatter.format(recField, fieldMeta.datatypeAttributes);
//            }
//        }
//    }
//    return answer;
//}
//
///**
// * given a formatType returns with a formatter object that
// * can be used to format raw values to display values by the type
// * @param formatType
// * @returns {*} - a object with a format method
// */
//function getFormatter(formatType) {
//    let answer = textFormatter;
//    switch (formatType) {
//    case FieldFormats.DATETIME_FORMAT:
//    case FieldFormats.DATE_FORMAT:
//        answer = dateTimeFormatter;
//        break;
//    case FieldFormats.EMAIL_ADDRESS:
//        answer = emailFormatter;
//        break;
//    case FieldFormats.PHONE_FORMAT:
//        // All phone formatting happens on the server because of the large library required.
//        // The formatter should only pass through the display value from the server
//        answer = passThroughFormatter;
//        break;
//    case FieldFormats.TIME_FORMAT:
//        answer = timeOfDayFormatter;
//        break;
//    case FieldFormats.TEXT_FORMAT:
//        answer = textFormatter;
//        break;
//    case FieldFormats.USER_FORMAT:
//        answer = userFormatter;
//        break;
//    case FieldFormats.DURATION_FORMAT:
//        answer = durationFormatter;
//        break;
//    case FieldFormats.NUMBER_FORMAT:
//    case FieldFormats.RATING_FORMAT:
//    case FieldFormats.CURRENCY_FORMAT:
//    case FieldFormats.PERCENT_FORMAT:
//        answer = numericFormatter;
//        break;
//    case FieldFormats.URL:
//        answer = urlFormatter;
//        break;
//    }
//    return answer;
//}

export default report;
