import * as actions from '../../src/constants/actions';
import FacetSelections from '../components/facet/facetSelections';
import ReportUtils from '../utils/reportUtils';
import Fluxxor from 'fluxxor';
import Logger from '../utils/logger';

let logger = new Logger();

let reportModel = {
    model: {
        columns: null,
        description: "",
        facets: null,
        fids: [],
        filteredRecords: null,
        filteredRecordsCount: null,
        groupingFields: null,
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
                if (this.model.fids.length && (this.model.fids.indexOf(field.id) === -1)) {
                    //skip this field since its not on report's column list
                } else {
                    let column = {};
                    column.order = index;
                    column.id = field.id;
                    column.headerName = field.name;
                    column.field = field.name;
                    column.fieldType = field.type;
                    column.builtIn = field.builtIn;

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
                    columns[fld.name] = column.display;
                });
                columns.actions = record.id;
                reportData.push(columns);
            });
        }

        return reportData;
    },

    /**
     * Check if we have facets at all or any errors returned by server.
     * @param facets
     * @returns {*}
     */


    /**
     * Returns the model object
     * @returns {reportModel.model|{columns, facets, filteredRecords, filteredRecordsCount, groupingFields, groupLevel, hasGrouping, name, records, recordsCount}}
     */
    get: function() {
        return this.model;
    },

    getRecords: function() {
        return this.model.records;
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

    setOriginalMetaData(reportOriginalMetaData) {
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
            //  TODO: with paging, this count is flawed...
            this.model.recordsCount = recordData.groups.totalRows;
        } else {
            this.model.columns = this.getReportColumns(recordData.fields);
            this.model.records = this.getReportData(recordData.fields, recordData.records);

            //  TODO: with paging, this count is flawed...
            this.model.recordsCount = recordData.records.length;
        }
        this.model.filteredRecords = this.model.records;
        this.model.filteredRecordsCount = recordData.records.length;
    },
    /**
     * Set just the filteredRecords. No change to fields. This has to be client side
     * TODO: Is this being used anymore?
     * @param records
     */
    setFilteredRecords: function(records) {
        this.model.filteredRecords = records;
        this.model.filteredRecordsCount = records.length;
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
        } else {
            this.model.columns = this.getReportColumns(recordData.fields);
            this.model.filteredRecords = this.getReportData(recordData.fields, recordData.records);
            this.model.filteredRecordsCount = recordData.records.length;
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
    }
};


let ReportDataStore = Fluxxor.createStore({

    initialize() {
        this.reportModel = reportModel;
        this.loading = false;
        this.error = false;
        this.nonFacetClicksEnabled = true;
        this.searchStringForFiltering = '' ;
        this.facetExpression = {};
        this.selections  = new FacetSelections();
        this.selectedRows = [];

        this.bindActions(
            actions.LOAD_REPORT, this.onLoadReport,
            actions.LOAD_REPORT_SUCCESS, this.onLoadReportSuccess,
            actions.LOAD_REPORT_FAILED, this.onLoadReportFailed,
            actions.LOAD_RECORDS,  this.onLoadRecords,
            actions.LOAD_RECORDS_SUCCESS, this.onLoadRecordsSuccess,
            actions.LOAD_RECORDS_FAILED, this.onLoadRecordsFailed,
            actions.FILTER_SELECTIONS_PENDING, this.onFilterSelectionsPending,
            actions.SHOW_FACET_MENU, this.onShowFacetMenu,
            actions.HIDE_FACET_MENU, this.onHideFacetMenu,
            actions.SEARCH_FOR, this.onSearchFor,
            actions.SELECTED_ROWS, this.onSelectedRows,

            actions.ADD_REPORT_RECORD, this.onAddReportRecord, // for empower demo
            actions.DELETE_REPORT_RECORD, this.onDeleteReportRecord // for empower demo
        );
    },

    onSelectedRows(selectedRows) {
        this.selectedRows = selectedRows;

        this.emit('change');
    },

    onLoadReport(report) {
        this.loading = true;

        this.appId = report.appId;
        this.tblId = report.tblId;
        this.rptId = report.rptId;
        this.searchStringForFiltering = '' ;
        this.selections  = new FacetSelections();
        this.selectedRows = [];

        this.emit('change');
    },
    onLoadReportFailed() {
        this.loading = false;
        this.error = true;
        this.emit('change');
    },

    onLoadReportSuccess(response) {
        this.loading = false;
        this.error = false;

        this.reportModel = reportModel;
        reportModel.setOriginalMetaData(response.metaData);
        reportModel.setMetaData(response.metaData);
        reportModel.setRecordData(response.recordData);
        reportModel.setFacetData(response.recordData);
        this.emit('change');
    },

    onLoadRecords(payload) {
        this.loading = true;

        this.appId = payload.appId;
        this.tblId = payload.tblId;
        this.rptId = payload.rptId;
        this.selections = payload.filter.selections;
        this.facetExpression = payload.filter.facet;
        this.searchStringForFiltering =  payload.filter.search;

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
        this.error = false;
        this.reportModel.updateFilteredRecords(response.recordData);
        this.emit('change');
    },

    onLoadRecordsFailed() {
        this.loading = false;
        this.error = true;
        this.emit('change');
    },

    onSearchFor(text) {
        // placeholder which will be obsolete
        // when other searches from global are supported
        let filteredRecords = [];
        let records = this.reportModel.getRecords();
        if (records) {
            records.forEach((record) => {

                let match = false;
                let lText = text.toLowerCase();
                _.values(record).forEach((val) => {
                    if (val && val.toString().toLowerCase(lText).indexOf() !== -1) {
                        match = true;
                    }
                });
                if (match) {
                    filteredRecords.push(record);
                }

            });
        }
        this.reportModel.setFilteredRecords(filteredRecords);
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

    onAddReportRecord() {
        const model = this.reportModel.get();

        const recordKey = "Record ID#";

        if (model.filteredRecords.length > 0) {

            // find record with greatest record ID (after converting to number) regardless of array order
            const maxRecord = model.filteredRecords.reduce((last, record) => {
                return (parseInt(last[recordKey]) > parseInt(record[recordKey])) ? last : record;
            });

            const newRecord = _.mapValues(maxRecord, (obj) => {return null;});

            const id = parseInt(lastRecord["Record ID#"]) + 1;
            newRecord["Record ID#"] = id;

            const newRecords = model.filteredRecords.slice(0);
            newRecords.push(newRecord);
            model.filteredRecords = newRecords;
            model.filteredRecordsCount++;

            this.emit('change');
        }
    },
    onDeleteReportRecord(id) {
        const model = this.reportModel.get();

        const index = _.findIndex(model.filteredRecords, {"Record ID#": id});

        model.filteredRecords.splice(index, 1);
        this.emit('change');
    },

    getState() {
        return {
            loading: this.loading,
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
