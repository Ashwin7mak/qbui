
import * as textFormatter from '../../../common/src/formatter/textFormatter';
import * as dateTimeFormatter from '../../../common/src/formatter/dateTimeFormatter';
import * as timeOfDayFormatter from '../../../common/src/formatter/timeOfDayFormatter';
import * as numericFormatter from '../../../common/src/formatter/numericFormatter';
import * as userFormatter from '../../../common/src/formatter/userFormatter';
import * as urlFormatter from '../../../common/src/formatter/urlFileAttachmentReportLinkFormatter';
import * as emailFormatter from '../../../common/src/formatter/emailFormatter';
import * as passThroughFormatter from '../../../common/src/formatter/passthroughFormatter';
import * as durationFormatter from '../../../common/src/formatter/durationFormatter';
import FieldFormats from '../utils/fieldFormats';

import {REQUEST_PARAMETER, DURATION} from '../../../common/src/constants';
import FieldUtils from '../utils/fieldUtils';
import ReportUtils from '../utils/reportUtils';
import Locale from '../locales/locales';
import {DEFAULT_RECORD_KEY_ID, UNSAVED_RECORD_ID} from '../constants/schema';
import _ from 'lodash';

class ReportModelHelper {
    /**
     * Given the field list format the columnDefinition as needed by data grid.
     *
     * ReportDataStore has columns array with one column object for each column in a grid. ag-Grid expects the coldef to have
     * a certain properties some of these are part of the field information and some part of the report definition.
     *
     * For ease of code reuse and ag-Grid agnostic the field definition associated with the column from the report's table field
     * structure is retained as a property on the column object as a whole in the `fieldDef` property.
     * This property mirrors the server field structure and can be used with the common validation utility on the node server
     * side as well as client side validation for report inline editing and possibly form field validation.
     *
     * Beside the fieldDef object we add the `field` member to column object which is the name of the property to use
     * to access that columns data from the data rows hash for ag-Grid. ag-Grid also needs `headerName` to title the column
     * header in the grid header row. The `order` property is the index sequence of the column
     *
     * Some other values from fieldDef are elevated for convenience to column definition
     * level also `id, fieldType, fieldName, defaultValue, choices`
     *
     * @param fields
     * @param hasGrouping
     * @returns {Array}
     */
    static getReportColumns(fields, fids  = [], groupEls = []) {
        let columns = [];
        let groupDelimiter = REQUEST_PARAMETER.GROUP_DELIMITER;
        if (fields) {
            fields.forEach((fieldDef, index) => {
                let groupedField = _.find(groupEls, el => el.split(groupDelimiter)[0] === fieldDef.id);
                if (!groupedField && fids.length && (fids.indexOf(fieldDef.id) === -1)) {
                    //skip this fieldDef since its not on report's column list or on group list
                } else {
                    let column = {};
                    column.order = index;
                    column.id = fieldDef.id;
                    column.headerName = fieldDef.name;
                    column.field = fieldDef.name; //name needed for aggrid
                    column.fieldDef = fieldDef; //fieldDef props below tobe refactored to just get info from fieldObj property instead.
                    column.isHidden = false; // should this column be hidden?
                    column.isPlaceholder = false; // is this a dummy placeholder column?
                    column.fieldDef.isAddingFrom = false; // are columns being added from this column?

                    // get the column units to add to the column header, currently only duration fields gets the units from
                    // the field definition if its a scale that has units (non time type and non smart units)
                    // this value will show next to the field name in the table header, similar to numerics units e.g. Revenue (Thousands)
                    let durUnits = null;
                    if (fieldDef && _.has(fieldDef, 'datatypeAttributes.type') && fieldDef.datatypeAttributes.type === DURATION) {
                        let scale = fieldDef.datatypeAttributes.scale;
                        if (durationFormatter.hasUnitsText(scale)) {
                            durUnits = Locale.getMessage(`durationTableHeader.${scale}`);
                            if (durUnits) {
                                // the unitsDescription display option on a field will show next to the column header in a table
                                // the app builder can optionally specify unitsDescription text for numeric fields and that
                                // text is added to the column header name for a field for example Revenues (thousands)
                                // where thousands is the unitsDescription.
                                // for durations the same presentation is desired when the duration values units
                                // is the same for all cells in the column. i.e non-smart units, non HH:MM: type units
                                // when the locale changes this value is updated and thus the table column header names updated
                                column.fieldDef.datatypeAttributes.unitsDescription = durUnits;
                            }
                        }
                    }

                    column.fieldType = fieldDef.type;

                    column.defaultValue = null;
                    if (fieldDef.defaultValue && fieldDef.defaultValue.coercedValue) {
                        column.defaultValue = {
                            value: fieldDef.defaultValue.coercedValue.value,
                            display: fieldDef.defaultValue.displayValue
                        };
                    }

                    if (fieldDef.multipleChoice && fieldDef.multipleChoice.choices) {
                        column.multipleChoice = {};
                        column.multipleChoice.choices = fieldDef.multipleChoice.choices;
                    }
                    //  client side attributes
                    let maxLength = FieldUtils.getMaxLength(fieldDef);
                    if (maxLength) {
                        column.placeholder = Locale.getMessage('placeholder.maxLength', {maxLength: maxLength});
                    }
                    columns.push(column);
                }
            });
        }
        return columns;
    }

    /**
     * Using fields and records format the report's data.
     *
     * @param fields
     * @param records
     * @returns {*}
     */
    static getReportData(fields, records) {
        let reportData = [];
        let map = new Map();

        if (fields && records) {
            fields.forEach((field) => {
                map.set(field.id, field);
            });

            records.forEach((record) => {
                let columns = {};
                record.forEach((column) => {
                    let fld = map.get(column.id);
                    columns[fld.name] = column;
                });
                reportData.push(columns);
            });
        }

        return reportData;
    }

    /**
     *
     * @param currentReport
     * @param content
     */
    static addReportRecord(currentReport, content) {
        if (currentReport.data.hasGrouping) {
            addRecordToGroupedReport(currentReport, content);
        } else {
            addRecordToReport(currentReport, content);
        }
    }

    /**
     *
     * @param currentReport
     * @param content
     */
    static updateReportRecord(currentReport, content) {
        //  nothing to do if no record content to update
        if (content.record) {
            let record = null;
            let filteredRecord = null;
            let reportData = currentReport.data;

            //  ensure recId is numeric
            if (content.recId) {
                content.recId = +content.recId;
            }
            if (reportData.hasGrouping) {
                record = ReportUtils.findGroupedRecord(reportData.records, content.recId, reportData.keyField.name);
                filteredRecord = ReportUtils.findGroupedRecord(reportData.filteredRecords, content.recId, reportData.keyField.name);
            } else {
                record = findRecordById(reportData.records, content.recId, reportData.hasGrouping, reportData.keyField);
                filteredRecord = findRecordById(reportData.filteredRecords, content.recId, reportData.hasGrouping, reportData.keyField);
            }

            // transform record from format [{id, value}] to [fieldName: {id, value}]
            let formattedRec = formatRecord(content.record, reportData.fields);

            //  update the report with the new content
            updateReportRecordData(record, filteredRecord, formattedRec);
        }
    }

    /**
     *
     * @param reportData
     * @param recId
     */
    static deleteRecordFromReport(report, recId) {
        //  table reports have a data model object
        if (_.has(report, 'data')) {
            let reportData = report.data;

            let recordValueToMatch = {};
            recordValueToMatch[FieldUtils.getPrimaryKeyFieldName(recordValueToMatch)] = {value: recId};

            const newFilteredRecords = reportData.filteredRecords ? reportData.filteredRecords.slice(0) : null;
            const newRecords = reportData.records ? reportData.records.slice(0) : null;
            let recordDeleted = false;
            let filteredRecordDeleted = false;

            // ensure recId is numeric
            if (recId) {
                recId = +recId;
            }
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
    }

    /**
     * Helper method to check current report model for a blank record added from inline edit
     *
     * @param currentReport
     * @returns {boolean}
     */
    static isBlankRecInReport(currentReport) {
        const keyName = _.has(currentReport, 'data.keyField') ? currentReport.data.keyField.name : '';
        let records = _.has(currentReport, 'data.records') ? currentReport.data.records : [];

        //  check to see if the new record is getting added from an inline editing blank row
        let hasBlankRec = false;
        if (currentReport.data.hasGrouping) {
            const blankRec = ReportUtils.findGroupedRecord(records, UNSAVED_RECORD_ID, keyName);
            hasBlankRec = (blankRec !== null);
        } else {
            const blankRecIdx = ReportUtils.findRecordIndex(records, UNSAVED_RECORD_ID, keyName);
            hasBlankRec = (blankRecIdx !== -1);
        }
        return hasBlankRec;
    }
}

// PRIVATE functions

/**
 *
 * @param records
 * @param recId
 * @param hasGrouping
 * @param keyField
 * @returns {*}
 */
function findRecordById(records, recId, hasGrouping, keyField) {
    // ensure recId is numeric
    if (recId) {
        recId = +recId;
    }

    if (hasGrouping) {
        return ReportUtils.findGroupedRecord(records, recId, keyField.name);
    } else {
        /*eslint eqeqeq:0*/
        return records.find(rec => rec[keyField.name].value == recId);
    }
}

/**
 *
 * @param currentReport
 * @param content
 */
function addRecordToReport(currentReport, content) {

    let reportData = currentReport.data;
    let record = findRecordById(reportData.records, UNSAVED_RECORD_ID, reportData.hasGrouping, reportData.keyField);
    let filtRecord = findRecordById(reportData.filteredRecords, UNSAVED_RECORD_ID, reportData.hasGrouping, reportData.keyField);

    if (record === undefined && filtRecord === undefined) {
        let afterRecId = content.afterRecId;
        // The afterRecId is an object if coming from the grid
        if (_.has(afterRecId, 'value')) {
            afterRecId = afterRecId.value;
        }
        //  ensure afterRecId is numeric
        if (afterRecId) {
            afterRecId = +afterRecId;
        }

        let newRecId = content.newRecId;

        let newRecord;
        let afterRecIndex = -1;
        if (reportData.filteredRecords.length > 0) {
            //  Unless there is a specified afterRecId, will add the new record to the top of the list.  Currently, only
            //  adding a new record from the grid will include the afterRecId.
            if (afterRecId) {
                afterRecIndex = ReportUtils.findRecordIndex(reportData.records, afterRecId, reportData.keyField.name);
            }

            // use 1st record to create newRecord
            newRecord = _.mapValues(reportData.filteredRecords[0], (obj) => {
                //get the default value for the fid if any
                let valueAnswer = null;
                let theCorrespondingField = _.find(reportData.fields, (item) => item.id === obj.id);
                //set the default values in the answer for each field
                if (theCorrespondingField && _.has(theCorrespondingField, 'defaultValue.coercedValue')) {
                    valueAnswer = {id: obj.id, value: theCorrespondingField.defaultValue.coercedValue.value};
                } else {
                    valueAnswer = (obj.id === DEFAULT_RECORD_KEY_ID ? {
                        id: obj.id,
                        value: null
                    } : getDefaultValue(obj.id, theCorrespondingField.datatypeAttributes.type));
                }

                return valueAnswer;
            });

            // format the values in the new record
            formatRecordValues(newRecord, reportData.fields);
            // set id to unsaved
            newRecord[reportData.keyField.name].value = UNSAVED_RECORD_ID;
        } else {
            afterRecId = 0;
            //  there are no records in the grid to use as a template..so just convert the
            //  new record into the 'newRecord' format
            newRecord = formatRecord(content.record, reportData.fields);
        }

        //make a copy
        const newFilteredRecords = reportData.filteredRecords.slice(0);

        //insert after the index
        currentReport.editingIndex = undefined;
        currentReport.editingId = undefined;

        // add to filtered records
        let filteredIndex;
        if (afterRecIndex !== -1) {
            newFilteredRecords.splice(afterRecIndex + 1, 0, newRecord);
            filteredIndex = afterRecIndex + 1;
        } else {
            // add to the top of the array
            newFilteredRecords.unshift(newRecord);
            filteredIndex = 0;
        }

        reportData.filteredRecords = newFilteredRecords;
        reportData.filteredRecordsCount++;

        // add to records
        const newRecords = reportData.records.slice(0);
        let newRecordsIndex;
        if (afterRecIndex !== -1) {
            newRecordsIndex = afterRecIndex + 1;
            newRecords.splice(newRecordsIndex, 0, newRecord);
        } else {
            // add to the top of the array
            newRecords.unshift(newRecord);
            newRecordsIndex = 0;
        }

        //  set the editing index for new blank rows
        if (newRecId === UNSAVED_RECORD_ID) {
            currentReport.editingIndex = newRecordsIndex;
            currentReport.editingId = UNSAVED_RECORD_ID;
            // keep track of the record id immediately before the blank row
            currentReport.recIdBeforeBlankRow = afterRecId;
        } else {
            currentReport.recIdBeforeBlankRow = undefined;
        }

        reportData.records = newRecords;
        reportData.recordsCount++;

        record = newRecords[newRecordsIndex];
        filtRecord = newFilteredRecords[filteredIndex];

        if (newRecId) {
            if (record) {
                record[reportData.keyField.name].value = newRecId;
            }
            if (filtRecord) {
                filtRecord[reportData.keyField.name].value = newRecId;
            }
        }

        // skip if adding a blank row to the report list as content.record will not exist
        if (content.record) {
            // transform record from format [{id, value}] to [fieldName: {id, value}]
            let formattedRec = formatRecord(content.record, reportData.fields);

            //  update the report with the new record data
            updateReportRecordData(record, filtRecord, formattedRec);
        }
    }
}

/**
 *
 * @param currentReport
 * @param content
 */
function addRecordToGroupedReport(currentReport, content) {
    let reportData = currentReport.data;
    let record = ReportUtils.findGroupedRecord(reportData.filteredRecords, UNSAVED_RECORD_ID, reportData.keyField.name);
    if (record === null && reportData.filteredRecords.length > 0) {
        // find record to add after
        let afterRecordIdValue = content.afterRecId || -1;
        if (_.has(content.afterRecId, 'value')) {
            afterRecordIdValue = content.afterRecId.value;
        }

        // ensure afterRecordId is numeric
        if (afterRecordIdValue) {
            afterRecordIdValue = +afterRecordIdValue;
        }

        //  find the first group if no 'after record id' supplied
        let templateRecord;
        if (afterRecordIdValue === -1) {
            templateRecord = ReportUtils.findFirstGroupedRecord(reportData.filteredRecords, afterRecordIdValue, reportData.keyField.name);
        } else {
            templateRecord = ReportUtils.findGroupedRecord(reportData.filteredRecords, afterRecordIdValue, reportData.keyField.name);
        }
        if (templateRecord === null) {
            logger.error(`failed to find record that initiated new record call in the list: recId ${afterRecordIdValue}`);
            return;
        }

        let groupFids = [];
        if (afterRecordIdValue !== -1) {
            groupFids = reportData.groupFields.map(field => {
                return field.field.id;
            });
        }

        // use the template record to create new record
        record = _.mapValues(templateRecord, (obj) => {
            //get the default value for the fid if any
            let valueAnswer = null;
            let theCorrespondingField = _.find(reportData.fields, (item) => item.id === obj.id);
            //copy the group field values
            let isGroupedFid = _.findIndex(groupFids, item => {
                return item === theCorrespondingField.id;
            });
            if (isGroupedFid !== -1) {
                let fieldValuesForRecord = _.find(templateRecord, (item) => item.id === theCorrespondingField.id);
                valueAnswer = {id: obj.id, value: fieldValuesForRecord.value};
            } else if (theCorrespondingField && _.has(theCorrespondingField, 'defaultValue.coercedValue')) {
                //set the default values in the answer for each field
                valueAnswer = {id: obj.id, value: theCorrespondingField.defaultValue.coercedValue.value};
            } else {
                valueAnswer = (obj.id === DEFAULT_RECORD_KEY_ID ? {
                    id: obj.id,
                    value: null
                } : getDefaultValue(obj.id, theCorrespondingField.datatypeAttributes.type));
            }
            return valueAnswer;
        });

        //format the values in the new record
        formatRecordValues(record, reportData.fields);

        // set id to unsaved
        record[reportData.keyField.name].value = UNSAVED_RECORD_ID;

        //make a copy
        const newFilteredRecords = reportData.filteredRecords.slice(0);
        //const newRecords = model.records.slice(0);

        //insert after the record (in the same group) -- update both record sets and update counts
        let filteredRecordAdded = false;
        let recordAdded = false;  //TODO why is this variable necessary??

        if (afterRecordIdValue === -1) {
            // goes to the top of the list
            filteredRecordAdded = newFilteredRecords.unshift(record);
            recordAdded = filteredRecordAdded;
        } else {
            filteredRecordAdded = ReportUtils.addGroupedRecordAfterRecId(newFilteredRecords, afterRecordIdValue, reportData.keyField.name, record);
            recordAdded = filteredRecordAdded;//Yes this is a hack - for some reason updating records array adds an extra row to aggrid - no idea why.
        }

        if (filteredRecordAdded) {
            reportData.filteredRecords = newFilteredRecords;
            reportData.filteredRecordsCount++;
        }
        if (recordAdded) {
            reportData.recordsCount++; //for pagination
        }

        let afterRecIndex = -1;
        if (afterRecordIdValue) {
            afterRecIndex = ReportUtils.findRecordIndex(reportData.filteredRecords, afterRecordIdValue, reportData.keyField.name);
        }

        //  set the editing index for new blank rows
        if (content.newRecId === UNSAVED_RECORD_ID) {
            currentReport.editingIndex = afterRecIndex + 1;
            currentReport.editingId = UNSAVED_RECORD_ID;
            // keep track of the record id immediately before the blank row
            currentReport.recIdBeforeBlankRow = afterRecordIdValue;
        } else {
            currentReport.recIdBeforeBlankRow = undefined;
        }

        // set the record id
        if (content.newRecId) {
            record[reportData.keyField.name].value = content.newRecId;
        }

        // skip if adding a blank row to the report list as content.record will not exist
        if (content.record) {
            // transform record from format [{id, value}] to [fieldName: {id, value}]
            let formattedRec = formatRecord(content.record, reportData.fields);

            //  update the report with the new record data
            updateReportRecordData(null, record, formattedRec);
        }
    }
}

/**
 *  Update the report with the new formatted record data
 *
 * @param record
 * @param filteredRecord
 * @param formattedRec
 */
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

/**
 *
 * @param id
 * @param type
 * @returns {{id: *, value: *}}
 */
function getDefaultValue(id, type) {
    let defaultValue = FieldUtils.getDefaultValueForFieldType(type);
    return {
        id: id,
        value: defaultValue
    };
}

/**
 * Transform record from format [{id, value}] to [fieldName: {id, value}]
 *
 * @param record
 * @param fields
 * @returns {{}}
 */
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

function formatRecordValues(newRecord, fields) {
    Object.keys(newRecord).forEach((key) => {
        let recField = newRecord[key];
        recField.display = formatFieldValue(recField, fields);
    });
}

/**
 * formats a fields value according to the fields type
 * @param recField
 * @returns {*} the formatted value
 */
function formatFieldValue(recField, fields) {
    let answer = null;

    // THIS CODE IS AN ARTIFACT OF THE FLUX STORE IMPLEMENTATION AND WAS
    // CARRIED OVER WHEN REFACTORED TO REDUX.  IT'S BELIEVE THIS METHOD AND
    // getFormatter() CAN BOTH BE REMOVED AS recField.value IS ALWAYS NULL,
    // BUT WILL REMAIN AS COMMENTED OUT CODE UNTIL THE NEW REDUX CODE HAS
    // BEEN EXCERSISED FOR A FEW WEEKS.
    //
    // RecField.value is always undefined as the method is only called when
    // creating a new record from a template andvalue is explicitly set to
    // null.  If it's determined that this code is unnecessary (ie: nothing
    // is broken), please remove...
    //
    //if (recField && recField.value) {
    //    // assume same raw and formatted
    //    answer = recField.value;
    //
    //    //get the corresponding field meta data
    //    let fieldMeta = _.find(fields, (item) => {
    //        return (((recField.id !== undefined) && (item.id === recField.id) ||
    //        ((recField.fieldName !== undefined) && (item.name === recField.fieldName))));
    //    });
    //
    //    //format the value by field display type
    //    if (fieldMeta && fieldMeta.datatypeAttributes && fieldMeta.datatypeAttributes.type) {
    //        let formatType = FieldFormats.getFormatType(fieldMeta.datatypeAttributes);
    //        let formatter = getFormatter(formatType);
    //
    //        // if there's a formatter use it to format the display version
    //        if (formatter !== null) {
    //            answer = formatter.format(recField, fieldMeta.datatypeAttributes);
    //        }
    //    }
    //}
    return answer;
}

/**
 * given a formatType returns with a formatter object that
 * can be used to format raw values to display values by the type
 * @param formatType
 * @returns {*} - a object with a format method
 */
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

export default ReportModelHelper;
