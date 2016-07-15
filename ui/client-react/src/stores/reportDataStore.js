import * as actions from '../../src/constants/actions';
import FacetSelections from '../components/facet/facetSelections';
import ReportUtils from '../utils/reportUtils';
import Fluxxor from 'fluxxor';
import Logger from '../utils/logger';
import * as SchemaConsts from "../constants/schema";
import * as formats from '../constants/fieldFormats';
const serverTypeConsts = require('../../../common/src/constants');
import * as dateTimeFormatter from '../../../common/src/formatter/dateTimeFormatter';
import * as timeOfDayFormatter from '../../../common/src/formatter/timeOfDayFormatter';
import * as numericFormatter from '../../../common/src/formatter/numericFormatter';


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
        groupFields: null,
        groupLevel: 0,
        hasGrouping: false,
        name: null,
        records: null,
        recordsCount: null,
        sortFids: [],
        groupEls: [],
        originalMetaData: null
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
                    column.defaultValue = null;
                    if (field.defaultValue && field.defaultValue.coercedValue) {
                        column.defaultValue = {value: field.defaultValue.coercedValue.value, display: field.defaultValue.displayValue};
                    }

                    if (field.multiChoiceSourceAllowed && field.multipleChoice) {
                        column.choices = field.multipleChoice.choices;
                    }
                    //  client side attributes..
                    column.datatypeAttributes = field.datatypeAttributes;
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
    get: function() {
        return this.model;
    },

    /**
     * Set everything related to report's meta data that's needed by components in state
     * @param reportMetaData
     */
    setMetaData: function(reportMetaData) {
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
    setRecordData: function(recordData) {
        this.model.hasGrouping = false;
        if (recordData.groups) {
            this.model.hasGrouping = recordData.groups.hasGrouping;
        }

        if (this.model.hasGrouping === true) {
            this.model.columns = this.getReportColumns(recordData.groups.gridColumns);
            this.model.records = recordData.groups.gridData;
            this.model.groupFields = recordData.groups.fields;
                //  TODO: with paging, this count is flawed...
            this.model.recordsCount = recordData.groups.totalRows;
        } else {
            this.model.columns = this.getReportColumns(recordData.fields);
            this.model.records = this.getReportData(recordData.fields, recordData.records);
            this.model.groupFields = null;

            //  TODO: with paging, this count is flawed...
            this.model.recordsCount = recordData.records ? recordData.records.length : null;
        }

        this.model.fields = recordData.fields || [];
        this.model.keyField =  this.model.fields.find(field => field.keyField);

        this.model.filteredRecords = this.model.records;
        this.model.filteredRecordsCount = recordData.records ? recordData.records.length : null;
    },

    findRecordById(records, recId) {
        return records.find(rec => rec[this.model.keyField.name].value === recId);
    },

    findRecordIndexById(records, recId) {
        return records.findIndex(rec => rec[this.model.keyField.name].value === recId);
    },
    updateARecord(oldRecId, newRecId, changes) {
        // update the record value inplace, for inline edits
        // per xd user will not get reload of sort/group/filtered effects of the
        // edit until they reload
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
    },

    /**
     * Update the filtered Records from response.
     * @param recordData
     */
    updateFilteredRecords: function(recordData) {
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
    setFacetData: function(recordData) {
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

    setSortFids: function(sortList) {
        this.model.sortFids = ReportUtils.getSortFidsOnly(sortList);
    },

    setGroupElements: function(sortList) {
        this.model.groupEls = ReportUtils.getGroupElements(sortList);
        this.model.groupLevel = this.model.groupEls.length;
    },

    //format data methods
    getFormatType(fieldType) {
        let formatType = formats.TEXT_FORMAT;

        switch (fieldType) {
        case serverTypeConsts.NUMERIC:
            formatType = formats.NUMBER_FORMAT;
            break;
        case serverTypeConsts.DATE :
            formatType = formats.DATE_FORMAT;
            break;
        case serverTypeConsts.DATE_TIME:
            formatType = formats.DATETIME_FORMAT;
            break;
        case serverTypeConsts.TIME_OF_DAY :
            formatType = formats.TIME_FORMAT;
            break;
        case serverTypeConsts.CHECKBOX :
            formatType = formats.CHECKBOX_FORMAT;
            break;
        case serverTypeConsts.USER :
            formatType = formats.USER_FORMAT;
            break;
        case serverTypeConsts.CURRENCY :
            formatType = formats.CURRENCY_FORMAT;
            break;
        case serverTypeConsts.RATING :
            formatType = formats.RATING_FORMAT;
            break;
        case serverTypeConsts.PERCENT :
            formatType = formats.PERCENT_FORMAT;
            break;
        default:
            formatType = formats.TEXT_FORMAT;
            break;
        }
        return formatType;
    },
    getFormatter(formatType) {
        let answer = null;
        switch (formatType) {
        case formats.DATETIME_FORMAT:
        case formats.DATE_FORMAT:
            answer = dateTimeFormatter;
            break;
        case formats.TIME_FORMAT:
            answer = timeOfDayFormatter;
            break;
        case formats.NUMBER_FORMAT:
        case formats.RATING_FORMAT:
        case formats.CURRENCY_FORMAT:
        case formats.PERCENT_FORMAT:
            answer = numericFormatter;
            break;
        }
        return answer;
    },

    formatFieldValue(recField) {
        let answer = null;

        if (recField && recField.value) {
            // assume same raw and formatted
            answer = recField.value;

            //get the corresponding field meta data
            let fieldMeta = _.find(this.fields, (item) => item.id === recField.id);

            //format the value by field display type
            if (fieldMeta && fieldMeta.datatypeAttributes && fieldMeta.datatypeAttributes.type) {
                let formatType = this.getFormatType(fieldMeta.datatypeAttributes.type);
                let formatter = this.getFormatter(formatType);

                // if there's a formatter use it to format the display version
                if (formatter !== null) {
                    answer = formatter.format(recField, fieldMeta.datatypeAttributes);
                }
            }
        }
        return answer;
    },

    formatRecordValues(newRecord) {
        Object.keys(newRecord).forEach((key) => {
            let recField = newRecord[key];
            recField.display = this.formatFieldValue(recField);
        });
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
        this.lastSaveOk = null;
        this.lastSaveRecordId = null;

        this.bindActions(
            actions.LOAD_REPORT, this.onLoadReport,
            actions.LOAD_REPORT_SUCCESS, this.onLoadReportSuccess,
            actions.LOAD_REPORT_FAILED, this.onLoadReportFailed,
            actions.LOAD_RECORDS, this.onLoadRecords,
            actions.LOAD_RECORDS_SUCCESS, this.onLoadRecordsSuccess,
            actions.LOAD_RECORDS_FAILED, this.onLoadRecordsFailed,
            actions.FILTER_SELECTIONS_PENDING, this.onFilterSelectionsPending,
            actions.SHOW_FACET_MENU, this.onShowFacetMenu,
            actions.HIDE_FACET_MENU, this.onHideFacetMenu,
            actions.SELECTED_ROWS, this.onSelectedRows,

            actions.NEW_BLANK_REPORT_RECORD, this.onAddReportRecord,
            actions.DELETE_REPORT_RECORD, this.onDeleteReportRecord, // for empower demo
            actions.RECORD_EDIT_CANCEL, this.onRecordEditCancel,
            actions.SAVE_REPORT_RECORD_SUCCESS, this.onSaveRecordSuccess,
            actions.SAVE_REPORT_RECORD_FAILED, this.onClearEdit,
            actions.ADD_REPORT_RECORD_SUCCESS, this.onAddRecordSuccess,
            actions.ADD_REPORT_RECORD_FAILED, this.onClearEdit
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
        this.searchStringForFiltering = '';
        this.selections = new FacetSelections();
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

    onShowFacetMenu() {
        this.nonFacetClicksEnabled = false;
        this.emit('change');
    },

    onHideFacetMenu() {
        this.nonFacetClicksEnabled = true;
        this.emit('change');
    },

    onAddReportRecord(payload) {
        const model = this.reportModel.get();

        const recordKey = SchemaConsts.DEFAULT_RECORD_KEY;

        if (model.filteredRecords.length > 0) {
            //find record to add after
            let afterRecId = payload.afterRecId;

            // find record with  record ID (after converting to number) regardless of array order
            // const maxRecord = model.filteredRecords.reduce((last, record) => {
            //     return (parseInt(last[recordKey]) > parseInt(record[recordKey])) ? last : record;
            // });

            let afterRecIndex = _.findIndex(model.filteredRecords, (rec) => rec[recordKey].value === afterRecId.value);

            const newRecord = _.mapValues(model.filteredRecords[afterRecIndex], (obj) => {
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
            newRecord[SchemaConsts.DEFAULT_RECORD_KEY].value = SchemaConsts.UNSAVED_RECORD_ID;

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
    onDeleteReportRecord(id) {
        const model = this.reportModel.get();

        const index = _.findIndex(model.filteredRecords, {"Record ID#": id});

        model.filteredRecords.splice(index, 1);
        this.emit('change');
    },

    onSaveRecordSuccess(payload) {
        // update the  record values
        this.editingIndex = null;
        this.reportModel.updateARecord(payload.recId, null, payload.changes);
        this.emit("change");
    },

    onAddRecordSuccess(payload) {
        // update the  record values
        this.editingIndex = null;
        this.reportModel.updateARecord(SchemaConsts.UNSAVED_RECORD_ID, payload.recId, payload.record);
        this.emit("change");
    },

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
    onClearEdit() {
        this.editingIndex = null;
        this.editingId = null;
        this.emit("change");
    },
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
            searchStringForFiltering: this.searchStringForFiltering,
            selections: this.selections,
            facetExpression: this.facetExpression,
            nonFacetClicksEnabled : this.nonFacetClicksEnabled,
            selectedRows: this.selectedRows
        };
    }

});

export default ReportDataStore;
