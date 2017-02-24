import * as types from '../actions/types';
import _ from 'lodash';
import FacetSelections from '../components/facet/facetSelections';
import FieldFormats from '../utils/fieldFormats';
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
            searchStringForFiltering: action.content.searchStringForFiltering,
            selections: action.content.selections || new FacetSelections(),
            facetExpression: action.content.facetExpression || {}
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
    case types.UPDATE_REPORT_RECORD: {
        const id = action.id;
        const currentReport = _.find(state, rpt => rpt.id === id);
        let updatedReport = _.cloneDeep(currentReport);

        let record = null;
        let filtRecord = null;
        if (updatedReport.data.hasGrouping) {
            record = ReportUtils.findGroupedRecord(updatedReport.data.records, action.content.recId, updatedReport.data.keyField.name);
            filtRecord = ReportUtils.findGroupedRecord(updatedReport.data.filteredRecords, action.content.recId, updatedReport.data.keyField.name);
        } else {
            record = findRecordById(updatedReport.data.records, action.content.recId, updatedReport.data.hasGrouping, updatedReport.data.keyField);
            filtRecord = findRecordById(updatedReport.data.filteredRecords, action.content.recId, updatedReport.data.hasGrouping, updatedReport.data.keyField);
        }

        // update rec from format [{id, value}] to [fieldName: {id, value}] so it can be consumed by formatRecordValues
        // formatRecordValues will add all display values
        // patch the previously created skeleton of record with the newRecord values
        let formattedRec = formatRecord(action.content.record, updatedReport.data.fields);

        //formatRecordValues(formattedRec, updatedReport.data.fields);

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


        return newState(updatedReport);
    }
    case types.LOAD_EMBEDDED_REPORT_SUCCESS: {
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
            searchStringForFiltering: action.content.searchStringForFiltering,
            selections: action.content.selections || new FacetSelections(),
            facetExpression: action.content.facetExpression || {}
        };
        // reducer - no mutations against current state!
        const stateList = _.cloneDeep(state);

        //  append or replace obj into the cloned copy
        stateList[2] = obj;

        return stateList;
    }
    default:
        // by default, return existing state
        return state;
    }
};

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
