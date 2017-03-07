import * as types from '../actions/types';
import _ from 'lodash';
import FacetSelections from '../components/facet/facetSelections';
import FieldFormats from '../utils/fieldFormats';
import FieldUtils from '../utils/fieldUtils';
import ReportUtils from '../utils/reportUtils';
import * as SchemaConstants from '../constants/schema';

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
        //  listen to record save event.  If there is a report context
        //  defined, then the report is updated with the new/updated record.
        let rpt = action.content.report;
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
                    addReportRecord(currentReport, content);
                } else {
                    updateReportRecord(currentReport, content);
                }
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

//function formatRecordValues(newRecord) {
//    Object.keys(newRecord).forEach((key) => {
//        let recField = newRecord[key];
//        recField.display = this.formatFieldValue(recField);
//    });
//}

function getDefaultValue(id, type) {
    let defaultValue = FieldUtils.getDefaultValueForFieldType(type);
    return {
        id: id,
        value: defaultValue
    };
}

function addRecordToReport(currentReport, content) {

    let record = findRecordById(currentReport.data.records, SchemaConstants.UNSAVED_RECORD_ID, currentReport.data.hasGrouping, currentReport.data.keyField);
    let filtRecord = findRecordById(currentReport.data.filteredRecords, SchemaConstants.UNSAVED_RECORD_ID, currentReport.data.hasGrouping, currentReport.data.keyField);

    if (record === undefined && filtRecord === undefined) {
        let afterRecId = content.afterRecId;
        let newRecId = content.newRecId;

        if (currentReport.data.filteredRecords.length > 0) {
            //find record to add after
            let afterRecIndex = -1;

            //  if there is a newRecId parameter value, then this is a new record
            if (!newRecId) {
                if (afterRecId) {
                    // The afterRecId is an object if coming from the grid
                    if (_.has(afterRecId, 'value')) {
                        afterRecId = afterRecId.value;
                    }
                    afterRecIndex = ReportUtils.findRecordIndex(currentReport.data.records, afterRecId, currentReport.data.keyField.name);
                }
            }

            // use 1st record to create newRecord
            const newRecord = _.mapValues(currentReport.data.filteredRecords[0], (obj) => {
                //get the default value for the fid if any
                let valueAnswer = null;
                let theCorrespondingField = _.find(currentReport.data.fields, (item) => item.id === obj.id);
                //set the default values in the answer for each field
                if (theCorrespondingField && _.has(theCorrespondingField, 'defaultValue.coercedValue')) {
                    valueAnswer = {id: obj.id, value: theCorrespondingField.defaultValue.coercedValue.value};
                } else {
                    valueAnswer = (obj.id === SchemaConstants.DEFAULT_RECORD_KEY_ID ? {
                        id: obj.id,
                        value: null
                    } : getDefaultValue(obj.id, theCorrespondingField.datatypeAttributes.type));
                }

                return valueAnswer;
            });

            //TODO: really want to avoid formatting as the individual components should be handling this requirement
            //formatRecordValues(newRecord);

            // set id to unsaved
            newRecord[currentReport.data.keyField.name].value = SchemaConstants.UNSAVED_RECORD_ID;

            //make a copy
            const newFilteredRecords = currentReport.data.filteredRecords.slice(0);

            //insert after the index
            currentReport.editingIndex = undefined;
            currentReport.editingId = undefined;

            // add to filtered records
            let filteredIndex;
            if (afterRecIndex !== -1) {
                newFilteredRecords.splice(afterRecIndex + 1, 0, newRecord);
                currentReport.editingIndex = afterRecIndex;
                currentReport.editingId = SchemaConstants.UNSAVED_RECORD_ID;
                filteredIndex = afterRecIndex + 1;
            } else {
                // add to the top of the array
                currentReport.editingIndex = newFilteredRecords.length;
                currentReport.editingId = SchemaConstants.UNSAVED_RECORD_ID;
                newFilteredRecords.unshift(newRecord);
                filteredIndex = 0;
            }

            currentReport.data.filteredRecords = newFilteredRecords;
            currentReport.data.filteredRecordsCount++;

            // add to records
            const newRecords = currentReport.data.records.slice(0);
            let newRecordsIndex;
            if (afterRecIndex !== -1) {
                newRecords.splice(afterRecIndex + 1, 0, newRecord);
                currentReport.editingIndex = afterRecIndex;
                currentReport.editingId = SchemaConstants.UNSAVED_RECORD_ID;
                newRecordsIndex = afterRecIndex + 1;
            } else {
                // add to the top of the array
                currentReport.editingIndex = newRecords.length;
                currentReport.editingId = SchemaConstants.UNSAVED_RECORD_ID;
                newRecords.unshift(newRecord);
                newRecordsIndex = 0;
            }

            // Always make sure to return an editing index so grid can detect the new row
            currentReport.editingIndex = (currentReport.editingIndex === undefined ? -1 : currentReport.editingIndex);

            currentReport.data.records = newRecords;
            currentReport.recordsCount++;

            record = newRecords[newRecordsIndex];
            filtRecord = newFilteredRecords[filteredIndex];

            // update rec from format [{id, value}] to [fieldName: {id, value}] so it can be consumed by formatRecordValues
            // formatRecordValues will add all display values
            // patch the previously created skeleton of record with the newRecord values
            //let formattedRec = formatRecord(content.record, currentReport.data.fields);

            //TODO: really want to avoid formatting as the individual components should be handling this reqeuirement
            //formatRecordValues(formattedRec, currentReport.data.fields);

            //updateReportRecordData(newRecords[newRecordsIndex], newFilteredRecords[filteredIndex], formattedRec);
        }

        let formattedRec = formatRecord(content.record, currentReport.data.fields);
        if (newRecId) {
            if (record) {
                record[currentReport.data.keyField.name].value = newRecId;
            }
            if (filtRecord) {
                filtRecord[currentReport.data.keyField.name].value = newRecId;
            }
        }
        updateReportRecordData(record, filtRecord, formattedRec);
    }
}

function addRecordToGroupedReport(currentReport, content) {
    let record = ReportUtils.findGroupedRecord(currentReport.data.filteredRecords, SchemaConstants.UNSAVED_RECORD_ID, currentReport.data.keyField.name);
    if (record === null && currentReport.data.filteredRecords.length > 0) {
        // find record to add after
        let afterRecordIdValue = content.afterRecId || -1;
        if (_.has(content.afterRecId, 'value')) {
            afterRecordIdValue = content.afterRecId.value;
        }

        //  find the first group if no 'after record id' supplied
        let templateRecord;
        if (afterRecordIdValue === -1) {
            templateRecord = ReportUtils.findFirstGroupedRecord(currentReport.data.filteredRecords, afterRecordIdValue, currentReport.data.keyField.name);
        } else {
            templateRecord = ReportUtils.findGroupedRecord(currentReport.data.filteredRecords, afterRecordIdValue, currentReport.data.keyField.name);
        }
        if (templateRecord === null) {
            logger.error(`failed to find record that initiated new record call in the list: recId ${afterRecordIdValue}`);
            return;
        }

        let groupFids = [];
        if (afterRecordIdValue !== -1) {
            groupFids = currentReport.data.groupFields.map(field => {
                return field.field.id;
            });
        }

        // use the template record to create new record
        record = _.mapValues(templateRecord, (obj) => {
            //get the default value for the fid if any
            let valueAnswer = null;
            let theCorrespondingField = _.find(currentReport.data.fields, (item) => item.id === obj.id);
            //copy the group field values
            let isGroupedFid = _.findIndex(groupFids, item => {
                return item === theCorrespondingField.id;
            });
            if (isGroupedFid !== -1) {
                let fieldValuesForRecord = _.find(record, (item) => item.id === theCorrespondingField.id);
                valueAnswer = {id: obj.id, value: fieldValuesForRecord.value};
            } else if (theCorrespondingField && _.has(theCorrespondingField, 'defaultValue.coercedValue')) {
                //set the default values in the answer for each field
                valueAnswer = {id: obj.id, value: theCorrespondingField.defaultValue.coercedValue.value};
            } else {
                valueAnswer = (obj.id === SchemaConstants.DEFAULT_RECORD_KEY_ID ? {id: obj.id, value: null} : getDefaultValue(obj.id, theCorrespondingField.datatypeAttributes.type));
            }
            return valueAnswer;
        });

        //format the values in the new record
        //formatRecordValues(newRecord);

        // set id to unsaved
        record[currentReport.data.keyField.name].value = SchemaConstants.UNSAVED_RECORD_ID;

        //make a copy
        const newFilteredRecords = currentReport.data.filteredRecords.slice(0);
        //const newRecords = model.records.slice(0);

        //insert after the record (in the same group) -- update both record sets and update counts
        let filteredRecordAdded = false;
        let recordAdded = false;  //TODO why is this variable necessary??

        if (afterRecordIdValue === -1) {
            // goes to the top of the list
            filteredRecordAdded = newFilteredRecords.unshift(record);
            recordAdded = filteredRecordAdded;
        } else {
            filteredRecordAdded = ReportUtils.addGroupedRecordAfterRecId(newFilteredRecords, afterRecordIdValue, currentReport.data.keyField.name, record);
            recordAdded = filteredRecordAdded;//Yes this is a hack - for some reason updating records array adds an extra row to aggrid - no idea why.
        }

        if (filteredRecordAdded) {
            currentReport.data.filteredRecords = newFilteredRecords;
            currentReport.data.filteredRecordsCount++;
        }
        if (recordAdded) {
            currentReport.data.recordsCount++; //for pagination
        }

        let afterRecIndex = -1;
        if (content.afterRecId) {
            afterRecIndex = ReportUtils.findRecordIndex(currentReport.data.filteredRecords, content.afterRecId, currentReport.data.keyField.name);
        }

        //editing index for aggrid to open inline edit
        currentReport.editingIndex = afterRecIndex;
        currentReport.editingId = SchemaConstants.UNSAVED_RECORD_ID;
    }

    // set the record id
    if (content.newRecId && record) {
        record[currentReport.data.keyField.name].value = content.newRecId;
    }

    let formattedRec = formatRecord(content.record, currentReport.data.fields);
    updateReportRecordData(null, record, formattedRec);
}

function addReportRecord(currentReport, content) {
    //  TODO: need to support insertion into the grid via an inline edit add...this is currently not enabled..
    let record = content.record ? content.record.record : [];
    if (currentReport.data.hasGrouping) {
        addRecordToGroupedReport(currentReport, content);
    } else {
        addRecordToReport(currentReport, content);
    }
    //    // update the  record values
    //    this.editingIndex = undefined;
    //    if (currentReport.data.hasGrouping) {
    //        let record = ReportUtils.findGroupedRecord(currentReport.data.filteredRecords, SchemaConstants.UNSAVED_RECORD_ID, currentReport.data.keyField.name);
    //        if (record === null) {
    //            // add record was called without creating an empty record probably from a trowser so create one here
    //            this.createNewGroupedRecord(-1);
    //        }
    //    } else {
    //        let record = this.reportModel.findARecord(SchemaConstants.UNSAVED_RECORD_ID);
    //        let filtRecord = this.reportModel.findAFilteredRecord(SchemaConstants.UNSAVED_RECORD_ID);
    //        if (record === undefined && filtRecord === undefined) {
    //            // add record was called without creating an empty record probably from a trowser so create one here
    //            this.createNewRecord(content.recId);
    //        }
    //    }
    //
}

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

    //TODO: really want to avoid formatting as the individual components should be handling this reqeuirement
    //formatRecordValues(formattedRec, currentReport.data.fields);

    updateReportRecordData(record, filtRecord, formattedRec);
}

function updateReportRecordData(record, filteredRecord, formattedRec) {

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
        if (filteredRecord && filteredRecord[fieldName] && formattedRec[fieldName]) {
            filteredRecord[fieldName].value = formattedRec[fieldName].value;
            if (formattedRec[fieldName].display !== undefined) {
                filteredRecord[fieldName].display = formattedRec[fieldName].display;
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
