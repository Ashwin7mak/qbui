import * as actions from '../../src/constants/actions';
import FacetSelections from '../components/facet/facetSelections';
import ReportUtils from '../utils/reportUtils';
import Fluxxor from 'fluxxor';
import Logger from '../utils/logger';
import Locale from '../locales/locales';
import * as SchemaConsts from "../constants/schema";
import FieldFormats from '../utils/fieldFormats';
import NumberUtils from '../utils/numberUtils';
import * as textFormatter from '../../../common/src/formatter/textFormatter';
import * as dateTimeFormatter from '../../../common/src/formatter/dateTimeFormatter';
import * as timeOfDayFormatter from '../../../common/src/formatter/timeOfDayFormatter';
import * as numericFormatter from '../../../common/src/formatter/numericFormatter';
import * as userFormatter from '../../../common/src/formatter/userFormatter';

const serverTypeConsts = require('../../../common/src/constants');

let logger = new Logger();
const groupDelimiter = ":";

let reportModel = {
    model: {
        columns: null,
        description: "",
        facets: null,
        fids: [],
        filteredRecords: null,
        filteredRecordsCount: null,
        fields: null,
        keyField: null,
        fieldsMap: null,
        groupFields: null,
        groupLevel: 0,
        hasGrouping: false,
        name: null,
        records: null,
        recordsCount: null,
        sortFids: [],
        groupEls: [],
        originalMetaData: null,
    },

    /**
     * Given the field list format the columnDefinition as needed by data grid.
     * @param fields
     * @param hasGrouping
     * @returns {Array}
     */
    getReportColumns(fields) {
        let columns = [];

        if (fields) {
            fields.forEach((field, index) => {
                let groupedField = _.find(this.model.groupEls, function(el) {
                    return el.split(groupDelimiter)[0] === field.id;
                });
                if (!groupedField && this.model.fids.length && (this.model.fids.indexOf(field.id) === -1)) {
                    //skip this field since its not on report's column list or on group list
                } else {
                    let column = {};
                    column.order = index;
                    column.id = field.id;
                    column.headerName = field.name;
                    column.field = field.name;
                    column.fieldType = field.type;
                    column.builtIn = field.builtIn;
                    column.unique = field.unique;
                    column.userEditableValue = field.userEditableValue;
                    column.dataIsCopyable = field.dataIsCopyable;
                    column.required = field.required;
                    column.defaultValue = null;
                    if (field.defaultValue && field.defaultValue.coercedValue) {
                        column.defaultValue = {value: field.defaultValue.coercedValue.value, display: field.defaultValue.displayValue};
                    }

                    if (field.multipleChoice && field.multipleChoice.choices) {
                        column.multipleChoice = {};
                        column.multipleChoice.choices = field.multipleChoice.choices;
                    }
                    //  client side attributes..
                    column.datatypeAttributes = field.datatypeAttributes;
                    column.placeholder = (field.datatypeAttributes && field.datatypeAttributes.type && field.datatypeAttributes.type === serverTypeConsts.EMAIL_ADDRESS) ?
                        Locale.getMessage('placeholder.email') : '';
                    columns.push(column);
                }
            });
        }
        return columns;
    },

    /**
     * Using fields and records format the report's data.
     * @param fields
     * @param records
     * @param hasGrouping
     * @returns {*}
     */
    getReportData(fields, records) {
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
    },

    /**
     * Returns the model object
     * @returns {reportModel.model|{columns, facets, filteredRecords, filteredRecordsCount, groupingFields, groupLevel, hasGrouping, name, records, recordsCount}}
     */
    get() {
        return this.model;
    },

    /**
     * Set everything related to report's meta data that's needed by components in state
     * @param reportMetaData
     */
    setMetaData(reportMetaData) {
        this.model.name = reportMetaData.name;
        this.model.description = reportMetaData.description;
        this.model.fids = reportMetaData.fids ? reportMetaData.fids : [];
        // in report's meta data sortlist is returned as an array of sort elements
        this.setSortFids(reportMetaData.sortList);
        this.setGroupElements(reportMetaData.sortList);
    },

    /**
     * Set the reports original meta data
     * @param reportOriginalMetaData
     */
    setOriginalMetaData(reportOriginalMetaData) {
        // clones the meta data to allow for adhoc updates to sort/group or other
        // report metadata values, and still be able to access the original
        // report settings for resetting feature in sort group dialog and later
        // for cancel adhoc edits to a report
        this.model.originalMetaData = _.cloneDeep(reportOriginalMetaData);
    },

    /**
     * Set all records related state
     * @param recordData
     */
    setRecordData(recordData) {
        this.model.hasGrouping = false;
        if (recordData.groups) {
            this.model.hasGrouping = recordData.groups.hasGrouping;
        }

        if (this.model.hasGrouping === true) {
            this.model.columns = this.getReportColumns(recordData.groups.gridColumns);
            this.model.records = recordData.groups.gridData;
            this.model.groupFields = recordData.groups.fields;
        } else {
            this.model.columns = this.getReportColumns(recordData.fields);
            this.model.records = this.getReportData(recordData.fields, recordData.records);
            this.model.groupFields = null;
        }

        this.model.fields = recordData.fields || [];
        // map of fields by field id for fast lookup
        let map = new Map();
        if (recordData.fields) {
            recordData.fields.forEach((field) => {
                map.set(field.id, field);
            });
        }
        this.model.fieldsMap = map;
        this.model.keyField =  this.model.fields.find(field => field.keyField);

        this.model.filteredRecords = this.model.records;
        this.model.filteredRecordsCount = recordData.records ? recordData.records.length : null;
    },

    /**
     * finds in model records the record with matching the recId
     * model records are in the form of array [{fieldName1 : {id:4,value:rec1}, fieldName2: {id:5,value:'test'}}, ...]
     * @param records
     * @param recId
     * @returns the found record or undefined
     */
    findRecordById(records, recId) {
        return records.find(rec => rec[this.model.keyField.name].value === recId);
    },

    /**
     *
     * @param records
     * @param recId
     * @returns {number|*}
     */
    findRecordIndexById(records, recId) {
        return records.findIndex(rec => rec[this.model.keyField.name].value === recId);
    },

    /**
     * updates a record in the model inplace, for inline edits with changes
     * per xd user will not get reload of sort/group/filtered effects of the
     *  edit until they reload
     * @param oldRecId - the record with the id to be modified
     * @param newRecId - optional if its a new record the record this is the new record id
     * @param changes - the changes to make to the record form is [{id: fieldid, display: dispVal, value: raw, fieldName: name}, ...]
     */
    updateARecord(oldRecId, newRecId, changes) {
        if (this.model.records && this.model.filteredRecords) {
            let record = this.findRecordById(this.model.records, oldRecId);
            let filtRecord = this.findRecordById(this.model.filteredRecords, oldRecId);

            // update with new recid
            if (newRecId !== null) {
                if (record) {
                    record[this.model.keyField.name].value = newRecId;
                }
                if (filtRecord) {
                    filtRecord[this.model.keyField.name].value = newRecId;
                }
            }
            // change the data values
            changes.forEach(change => {
                if (change.display === undefined) {
                    //format value for display
                    this.formatFieldValue(change);
                }
                if (record) {
                    record[change.fieldName].value = change.value;
                    if (change.display !== undefined) {
                        record[change.fieldName].display = change.display;
                    }
                }
                if (filtRecord) {
                    filtRecord[change.fieldName].value = change.value;
                    if (change.display !== undefined) {
                        filtRecord[change.fieldName].display = change.display;
                    }
                }
            });
        }
    },

    updateRecordsCount: function(recordsCountData) {
        if (recordsCountData && !isNaN(recordsCountData)) {
            this.model.recordsCount = parseInt(recordsCountData);
        }
    },

    /**
     * Update count of filtered records
     * @param recordsCountData
     */
    updateFilteredRecordsCount: function(count) {
        this.model.filteredRecordsCount = parseInt(count);
    },

    /**
     * Update the filtered Records from response.
     * @param recordData
     */
    updateFilteredRecords(recordData) {
        if (recordData.groups && recordData.groups.hasGrouping) {
            this.model.columns = this.getReportColumns(recordData.groups.gridColumns);
            this.model.filteredRecords = recordData.groups.gridData;
            this.model.filteredRecordsCount = recordData.groups.totalRows;
            this.model.groupFields = recordData.groups.fields;
        } else {
            this.model.columns = this.getReportColumns(recordData.fields);
            this.model.filteredRecords = this.getReportData(recordData.fields, recordData.records);
            this.model.filteredRecordsCount = recordData.records.length;
            this.model.groupFields = null;
        }

    },

    /**
     * Set facets data(if any) from response
     * @param recordData
     */
    setFacetData(recordData) {
        this.model.facets = [];

        if (recordData && recordData.facets) {
            //check for an error message ==> [{id:x, name:y, type:z, errorCode: errorCode}]
            if (recordData.facets.length > 0) {
                if (recordData.facets[0].errorCode) {
                    //  TODO: implement translating the error code into a descriptive message
                    let errorCode = recordData.facets[0].errorCode;
                    let id = recordData.facets[0].id;
                    let name = recordData.facets[0].name;
                    logger.error(`Error response from server. Facet:${id}, name:{$name}, error: ${errorCode}; app:${this.appId}; table:${this.tblId}; report:${this.rptId}.`);
                } else {
                    this.model.facets = recordData.facets;
                }
            }
        }
    },

    /**
     * set the fields to sort by
     * @param sortList
     */
    setSortFids(sortList) {
        this.model.sortFids = ReportUtils.getSortFidsOnly(sortList);
    },

    /**
     * The the fields to group by
     * @param sortList
     */
    setGroupElements(sortList) {
        this.model.groupEls = ReportUtils.getGroupElements(sortList);
        this.model.groupLevel = this.model.groupEls.length;
    },


    /**
     * given a formatType returns with a formatter object that
     * can be used to format raw values to display values by the type
     * @param formatType
     * @returns {*} - a object with a format method
     */
    getFormatter(formatType) {
        let answer = textFormatter;
        switch (formatType) {
        case FieldFormats.DATETIME_FORMAT:
        case FieldFormats.DATE_FORMAT:
            answer = dateTimeFormatter;
            break;
        case FieldFormats.TIME_FORMAT:
            answer = timeOfDayFormatter;
            break;
        case FieldFormats.TEXT_FORMAT:
            answer = textFormatter;
            break;
        case FieldFormats.USER_FORMAT:
            answer = userFormatter;
            break;
        case FieldFormats.NUMBER_FORMAT:
        case FieldFormats.RATING_FORMAT:
        case FieldFormats.CURRENCY_FORMAT:
        case FieldFormats.PERCENT_FORMAT:
            answer = numericFormatter;
            break;
        }
        return answer;
    },

    /**
     * formats a fields value according to the fields type
     * @param recField
     * @returns {*} the formatted value
     */
    formatFieldValue(recField) {
        let answer = null;

        if (recField && recField.value) {
            // assume same raw and formatted
            answer = recField.value;

            //get the corresponding field meta data
            let fieldMeta = _.find(this.model.fields, (item) => {
                return (((recField.id !== undefined) && (item.id === recField.id) ||
                       ((recField.fieldName !== undefined) && (item.name === recField.fieldName))));
            });

            //format the value by field display type
            if (fieldMeta && fieldMeta.datatypeAttributes && fieldMeta.datatypeAttributes.type) {
                let formatType = FieldFormats.getFormatType(fieldMeta.datatypeAttributes.type);
                let formatter = this.getFormatter(formatType);

                // if there's a formatter use it to format the display version
                if (formatter !== null) {
                    answer = formatter.format(recField, fieldMeta.datatypeAttributes);
                }
            }
        }
        return answer;
    },

    /**
     * formats all the values on the newRecord
     * modifies the display property of the each field.
     *
     * @param newRecord
     */
    formatRecordValues(newRecord) {
        Object.keys(newRecord).forEach((key) => {
            let recField = newRecord[key];
            recField.display = this.formatFieldValue(recField);
        });
    },

    /**
     * Deletes the record from filteredRecords and records arrays so that display can update
     *
     * @param recId to delete
     */
    deleteRecordsFromLists(recId) {
        var recordValueToMatch = {};
        recordValueToMatch[SchemaConsts.DEFAULT_RECORD_KEY] = {value: recId};
        var index = _.findIndex(this.model.filteredRecords, recordValueToMatch);
        if (index !== -1) {
            this.model.filteredRecords.splice(index, 1);
            this.model.recordsCount--;
        } else {
            logger.error(`the record to delete does not exist in the filteredRecords list. value: ${recId} index: ${index}`);
        }
        index = _.findIndex(this.model.records, recordValueToMatch);
        if (index !== -1) {
            this.model.records.splice(index, 1);
            this.model.recordsCount--;
        } else {
            logger.error(`the record to delete does not exist in the filteredRecords list. value: ${recId} index: ${index}`);
        }
    }
};


let ReportDataStore = Fluxxor.createStore({

    initialize() {
        this.reportModel = reportModel;
        this.loading = false;
        this.editingIndex = null;
        this.editingId = null;
        this.error = false;
        this.nonFacetClicksEnabled = true;
        this.searchStringForFiltering = '';
        this.facetExpression = {};
        this.selections = new FacetSelections();
        this.selectedRows = [];
        this.pageOffset = serverTypeConsts.PAGE.DEFAULT_OFFSET;
        this.numRows = serverTypeConsts.PAGE.DEFAULT_NUM_ROWS;
        this.countingTotalRecords = false;

        this.currentRecordId = null;
        this.nextRecordId = null;
        this.previousRecordId = null;
        this.nextOrPrevious = "";

        this.bindActions(
            actions.LOAD_REPORT, this.onLoadReport,
            actions.LOAD_REPORT_SUCCESS, this.onLoadReportSuccess,
            actions.LOAD_REPORT_FAILED, this.onLoadReportFailed,
            actions.LOAD_RECORDS, this.onLoadRecords,
            actions.LOAD_RECORDS_SUCCESS, this.onLoadRecordsSuccess,
            actions.LOAD_RECORDS_FAILED, this.onLoadRecordsFailed,
            actions.LOAD_FILTERED_RECORDS_COUNT_SUCCESS, this.onFilteredRecordsCountSuccess,
            actions.LOAD_FILTERED_RECORDS_COUNT_FAILED, this.onFilteredRecordsCountFailed,
            actions.FILTER_SELECTIONS_PENDING, this.onFilterSelectionsPending,
            actions.SHOW_FACET_MENU, this.onShowFacetMenu,
            actions.HIDE_FACET_MENU, this.onHideFacetMenu,
            actions.SELECTED_ROWS, this.onSelectedRows,

            actions.NEW_BLANK_REPORT_RECORD, this.onAddReportRecord,
            actions.DELETE_RECORD, this.onDeleteReportRecord,
            actions.DELETE_RECORD_SUCCESS, this.onDeleteReportRecordSuccess,
            actions.DELETE_RECORD_FAILED, this.onDeleteReportRecordFailed,
            actions.DELETE_RECORD_BULK, this.onDeleteReportRecordBulk,
            actions.DELETE_RECORD_BULK_SUCCESS, this.onDeleteReportRecordBulkSuccess,
            actions.DELETE_RECORD_BULK_FAILED, this.onDeleteReportRecordBulkFailed,
            actions.RECORD_EDIT_CANCEL, this.onRecordEditCancel,
            actions.SAVE_RECORD_SUCCESS, this.onSaveRecordSuccess,
            actions.SAVE_RECORD_FAILED, this.onClearEdit,
            actions.ADD_RECORD_SUCCESS, this.onAddRecordSuccess,
            actions.ADD_RECORD_FAILED, this.onClearEdit,

            actions.LOAD_REPORT_RECORDS_COUNT, this.onLoadReportRecordsCount,
            actions.LOAD_REPORT_RECORDS_COUNT_SUCCESS, this.onLoadReportRecordsCountSuccess,
            actions.LOAD_REPORT_RECORDS_COUNT_FAILED, this.onLoadReportRecordsCountFailed,

            actions.OPEN_REPORT_RECORD, this.onOpenRecord,
            actions.SHOW_NEXT_RECORD, this.onShowNextRecord,
            actions.SHOW_PREVIOUS_RECORD, this.onShowPreviousRecord

        );
    },

    onSelectedRows(selectedRows) {
        this.selectedRows = selectedRows;

        this.emit('change');
    },

    onLoadReport(report) {
        this.loading = true;
        this.editingIndex = null;
        this.editingId = null;

        this.appId = report.appId;
        this.tblId = report.tblId;
        this.rptId = report.rptId;

        this.pageOffset = NumberUtils.isInt(report.offset) && report.offset >= 0 ? report.offset : this.pageOffset;
        this.numRows = NumberUtils.isInt(report.numRows) && report.numRows ? report.numRows : this.numRows;

        this.searchStringForFiltering = '' ;
        this.selections  = new FacetSelections();
        this.selectedRows = [];

        this.emit('change');
    },

    onLoadReportFailed() {
        this.loading = false;
        this.editingIndex = null;
        this.editingId = null;

        this.error = true;
        this.emit('change');
    },

    onLoadReportSuccess(response) {
        this.loading = false;
        this.editingIndex = null;
        this.editingId = null;

        this.error = false;

        this.reportModel = reportModel;
        reportModel.setOriginalMetaData(response.metaData);
        reportModel.setMetaData(response.metaData);
        reportModel.setRecordData(response.recordData);
        if (response.sortList !== undefined) {
            reportModel.setSortFids(response.sortList);
            reportModel.setGroupElements(response.sortList);
        }
        reportModel.setFacetData(response.recordData);

        this.emit('change');
    },

    onLoadRecords(payload) {
        this.loading = true;
        this.editingIndex = null;
        this.editingId = null;

        this.appId = payload.appId;
        this.tblId = payload.tblId;
        this.rptId = payload.rptId;
        this.selections = payload.filter.selections;
        this.facetExpression = payload.filter.facet;
        this.searchStringForFiltering = payload.filter.search;

        this.reportModel.setSortFids(payload.sortList);
        this.reportModel.setGroupElements(payload.sortList);

        this.pageOffset = NumberUtils.isInt(payload.offset) && payload.offset >= 0 ? payload.offset : this.pageOffset;
        this.numRows = NumberUtils.isInt(payload.numRows) && payload.numRows ? payload.numRows : this.numRows;

        this.emit('change');
    },

    onFilterSelectionsPending(payload) {
        this.selections = payload.selections;
        this.emit('change');
    },

    onLoadRecordsSuccess(response) {
        this.loading = false;
        this.editingIndex = null;
        this.editingId = null;

        this.error = false;
        this.reportModel.updateFilteredRecords(response.recordData);

        this.emit('change');
    },

    onLoadRecordsFailed() {
        this.loading = false;
        this.editingIndex = null;
        this.editingId = null;

        this.error = true;
        this.emit('change');
    },

    onFilteredRecordsCountSuccess(response) {
        this.loading = false;
        this.editingIndex = null;
        this.editingId = null;

        this.error = false;
        this.reportModel.updateFilteredRecordsCount(response.data.filteredCount);

        this.emit('change');
    },

    onFilteredRecordsCountFailed() {
        this.loading = false;
        this.editingIndex = null;
        this.editingId = null;

        this.error = true;
        this.emit('change');
    },

    onLoadReportRecordsCount() {
        this.countingTotalRecords = true;
        this.emit('change');
    },

    onLoadReportRecordsCountSuccess(response) {
        this.countingTotalRecords = false;
        this.reportModel.updateRecordsCount(response.body);
        this.emit('change');
    },

    onLoadReportRecordsCountFailed() {
        this.countingTotalRecords = false;
        this.error = true;
        this.emit('change');
    },

    onShowFacetMenu() {
        this.nonFacetClicksEnabled = false;
        this.emit('change');
    },

    onHideFacetMenu() {
        this.nonFacetClicksEnabled = true;
        this.emit('change');
    },

    /**
     * adds a new blank record to the list of records
     *
     * @param payload parameter contains
     *  payload.afterRecId : {value:id} of record to add the new blank record after
     *  (its not sorted/group till next reload from server)
     *
     */
    onAddReportRecord(payload) {
        const model = this.reportModel.get();

        if (model.filteredRecords.length > 0) {
            //find record to add after
            let afterRecId = payload.afterRecId;

            let afterRecIndex = -1;
            if (afterRecId && afterRecId.value !== undefined) {
                afterRecIndex = this.reportModel.findRecordIndexById(model.filteredRecords, afterRecId.value);
            }

            // use 1st record to create newRecord
            const newRecord = _.mapValues(model.filteredRecords[0], (obj) => {
                //get the default value for the fid if any
                let valueAnswer = null;
                let theCorrespondingField = _.find(model.fields, (item) => item.id === obj.id);
                //set the default values in the answer for each field
                if (theCorrespondingField && _.has(theCorrespondingField, 'defaultValue.coercedValue')) {
                    valueAnswer = {value: theCorrespondingField.defaultValue.coercedValue.value, id: obj.id} ;
                } else {
                    //TBD : type specific values
                    valueAnswer = {value:null, id:obj.id} ;
                }
                return valueAnswer;
            });

            //format the values in the new record
            this.reportModel.formatRecordValues(newRecord);

            // set id to unsaved
            newRecord[model.keyField.name].value = SchemaConsts.UNSAVED_RECORD_ID;

            //make a copy
            const newFilteredRecords = model.filteredRecords.slice(0);

            //insert after the index
            this.editingIndex = null;
            this.editingId = null;

            // add to filtered records
            if (afterRecIndex !== -1) {
                newFilteredRecords.splice(afterRecIndex + 1, 0, newRecord);
                this.editingIndex = afterRecIndex;
                this.editingId = SchemaConsts.UNSAVED_RECORD_ID;
            } else {
                this.editingIndex = newFilteredRecords.length;
                this.editingId = SchemaConsts.UNSAVED_RECORD_ID;
                newFilteredRecords.push(newRecord);
            }

            model.filteredRecords = newFilteredRecords;
            model.filteredRecordsCount++;

            // add to records
            const newRecords = model.records.slice(0);
            if (afterRecIndex !== -1) {
                newRecords.splice(afterRecIndex + 1, 0, newRecord);
                this.editingIndex = afterRecIndex;
                this.editingId = SchemaConsts.UNSAVED_RECORD_ID;
            } else {
                this.editingIndex = newRecords.length;
                this.editingId = SchemaConsts.UNSAVED_RECORD_ID;
                newRecords.push(newRecord);
            }
            model.records = newRecords;
            model.recordsCount++;

            this.emit('change');
        }
    },

    /**
     * if anyone is listening this is me telling you we are deleting a record
     * @param payload {appId, tblId, recId}
     */
    onDeleteReportRecord(payload) {
        //add code here when we want to do something with this action
    },

    /**
     * removes the record with the matching value in the keyfield from the
     * models filteredRecord list
     * @param id
     */
    onDeleteReportRecordSuccess(recId) {
        const model = this.reportModel.get();
        this.reportModel.deleteRecordsFromLists(recId);
        this.emit('change');
    },

    /**
     * Does not do anything if it failed, just emits a change which wont cause an update (for agGrid)
     * @param payload parameter contains {appId, tblId, recId, error: error}
     */
    onDeleteReportRecordFailed(payload) {
        logger.error(`the record failed to delete: recId ${payload.recId}`);
    },

    /**
     * if anyone is listening this is me telling you we are deleting records in bulk
     * @param payload {appId, tblId, recIds}
     */
    onDeleteReportRecordBulk(payload) {
        //add code here when we want to do something with this action
    },

    /**
     * removes the records with the matching values in keyfield from the
     * models filteredRecord list
     * @param recIds
     */
    onDeleteReportRecordBulkSuccess(recIds) {
        const model = this.reportModel.get();
        for (var i = 0; i < recIds.length; i++) {
            this.reportModel.deleteRecordsFromLists(recIds[i]);
        }
        this.selectedRows = [];
        this.emit('change');
    },

    /**
     * Does not do anything if it failed, just emits a change which wont cause an update (for agGrid)
     * @param payload parameter contains {appId, tblId, recId, error: error}
     */
    onDeleteReportRecordBulkFailed(payload) {
        logger.error(`the records failed to delete: recIds ${payload.recIds}`);
    },

    /**
     * updates the list of records at record at the specified record id
     * with the specified field value changes
     * @param payload paramater contains recId :number, changes :[]
     */
    onSaveRecordSuccess(payload) {
        // update the  record values

        this.editingIndex = null;
        this.reportModel.updateARecord(payload.recId, null, payload.changes);
        this.emit("change");
    },

    /**
     * updates the list of records at the specified record id or end of list if no recId specified
     * with the new record
     * @param payload paramater contains recId :number, record :[]
     */
    onAddRecordSuccess(payload) {
        // update the  record values
        this.editingIndex = null;
        this.reportModel.updateARecord(SchemaConsts.UNSAVED_RECORD_ID, payload.recId, payload.record);

        this.emit("change");
    },

    /**
     * Cancels an record edit
     * if the record id specified is a new record (has an unsaved record id) the record is removed
     * from the models list of records and filtered records.
     * and the record to rendered as in inline edit is cleared
     * @param payload
     */
    onRecordEditCancel(payload) {
        //remove record if its new unsaved
        if (payload.recId.value === SchemaConsts.UNSAVED_RECORD_ID) {
            const model = this.reportModel.get();
            //make a copy
            const newFilteredRecords = model.filteredRecords.slice(0);
            //find record
            let cancelledFRecordIndex = this.reportModel.findRecordIndexById(newFilteredRecords, SchemaConsts.UNSAVED_RECORD_ID);
            //remove it
            if (cancelledFRecordIndex !== -1) {
                newFilteredRecords.splice(cancelledFRecordIndex, 1);
                model.filteredRecords = newFilteredRecords;
                model.filteredRecordsCount--;
            }

            //make a copy
            const newRecords = model.records.slice(0);
            //find record
            let cancelledRecordIndex = this.reportModel.findRecordIndexById(newRecords, SchemaConsts.UNSAVED_RECORD_ID);
            //remove it
            if (cancelledRecordIndex !== -1) {
                newRecords.splice(cancelledRecordIndex, 1);
                model.records = newRecords;
                model.recordsCount--;
            }
        }
        this.onClearEdit();
    },

    /**
     * Cancels an record edit
     * the id and index of a record to render in inline edit id is cleared
     * @param payload - none
     */
    onClearEdit() {
        this.editingIndex = null;
        this.editingId = null;
        this.emit("change");
    },

    /**
     * the displayed record has changed, update the previous/next record IDs
     * @param recId
     */
    updateRecordNavContext(recId, nextOrPrevious = "") {

        const {filteredRecords, filteredRecordsCount, keyField} = this.reportModel.get();

        const index = filteredRecords.findIndex(rec => rec[keyField.name] && rec[keyField.name].value === recId);

        // store the next and previous record ID relative to recId in the report (or null if we're at the end/beginning)
        this.currentRecordId = recId;

        this.nextRecordId = (index < filteredRecordsCount - 1) ? filteredRecords[index + 1][keyField.name].value : null;
        this.previousRecordId = index > 0 ? filteredRecords[index - 1][keyField.name].value : null;

        this.nextOrPrevious = nextOrPrevious;

        this.emit("change");
    },

    /**
     * drilldown into record from report
     *
     * @param payload
     */
    onOpenRecord(payload) {
        this.updateRecordNavContext(payload.recId);
    },
    /**
     * update prev/next props after displaying previous record
     */
    onShowPreviousRecord(payload) {
        this.updateRecordNavContext(payload.recId, "previous");
    },
    /**
     * update prev/next props after displaying next record
     */
    onShowNextRecord(payload) {
        this.updateRecordNavContext(payload.recId, "next");
    },
    /**
     * gets the state of a reportData
     * @returns report state
     */
    getState() {
        return {
            loading: this.loading,
            editingIndex: this.editingIndex,
            editingId: this.editingId,
            error: this.error,
            data: this.reportModel.get(),
            appId: this.appId,
            tblId: this.tblId,
            rptId: this.rptId,
            pageOffset: this.pageOffset,
            numRows: this.numRows,
            countingTotalRecords: this.countingTotalRecords,
            searchStringForFiltering: this.searchStringForFiltering,
            selections: this.selections,
            facetExpression: this.facetExpression,
            nonFacetClicksEnabled : this.nonFacetClicksEnabled,
            selectedRows: this.selectedRows,
            currentRecordId: this.currentRecordId,
            nextRecordId: this.nextRecordId,
            previousRecordId: this.previousRecordId,
            nextOrPrevious: this.nextOrPrevious
        };
    }
});

export default ReportDataStore;
