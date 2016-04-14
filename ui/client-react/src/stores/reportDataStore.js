import * as actions from '../../src/constants/actions';
import FacetSelections from '../components/facet/facetSelections';

import Fluxxor from 'fluxxor';
import Logger from '../utils/logger';

let logger = new Logger();

let reportModel = {
    model: {
        columns: null,
        facets: null,
        filteredRecords: null,
        filteredRecordsCount: null,
        groupingFields: null,
        groupLevel: 0,
        hasGrouping: false,
        name: null,
        records: null,
        recordsCount: null
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
            fields.forEach(function(field, index) {
                let column = {};
                column.order = index;
                column.id = field.id;
                column.headerName = field.name;     //for ag-grid
                column.field = field.name;          //for ag-grid
                column.columnName = field.name;     //for griddle
                column.displayName = field.name;    //for griddle
                column.fieldType = field.type;
                column.builtIn = field.builtIn;

                //  client side attributes..
                column.datatypeAttributes = field.datatypeAttributes;
                columns.push(column);
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
    checkForFacetErrors(facets) {
        if (facets) {
            //check for error message returned
            //i.e facets : [{id: null, errorMessage: "unknownError"}]
            if (facets.length > 0) {
                if (facets[0].id === null) {
                    //log error
                    let msg = facets[0].errorMessage;
                    logger.error(`error response from server request : ${msg} getting facet information for app:${this.appId} table:${this.tblId} report:${this.rptId} `);
                    //no facets
                    return [];
                }
                //else good id data
            } else {
                //empty facet data ok there are no filters for this report
            }
            return facets;
        } else {
            //log error
            logger.error(`error got no facet property returned for app:${this.appId} table:${this.tblId} report:${this.rptId} `);
            return [];
        }
    },
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
            this.model.groupLevel = recordData.groups.columns.length;
            this.model.groupingFields = recordData.groups.columns;

            //  TODO: with paging, this is flawed...
            this.model.recordsCount = recordData.groups.totalRows;
        } else {
            this.model.columns = this.getReportColumns(recordData.fields);
            this.model.records = this.getReportData(recordData.fields, recordData.records);
            this.model.groupLevel = 0;
            this.model.groupingFields = null;

            //  TODO: with paging, this is flawed...
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
        if (this.model.hasGrouping === true) {
            this.model.filteredRecords = recordData.groups.gridData;
            this.model.filteredRecordsCount = recordData.groups.totalRows;
        } else {
            this.model.filteredRecords = this.getReportData(recordData.fields, recordData.records);
            this.model.filteredRecordsCount = recordData.records.length;
        }
    },
    /**
     * Set facets data from response
     * @param recordData
     */
    setFacetData: function(recordData) {
        this.model.facets = this.checkForFacetErrors(recordData.facets);
    }

};


let ReportDataStore = Fluxxor.createStore({

    initialize() {
        this.reportModel = reportModel;
        this.loading = false;
        this.error = false;
        this.nonFacetClicksEnabled = true;
        this.searchStringForFiltering = '' ;
        this.selections  = new FacetSelections();

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
            actions.SEARCH_FOR, this.onSearchFor
        );
    },

    onLoadReport(report) {
        this.loading = true;

        this.appId = report.appId;
        this.tblId = report.tblId;
        this.rptId = report.rptId;
        this.searchStringForFiltering = '' ;
        this.selections  = new FacetSelections();

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
            nonFacetClicksEnabled : this.nonFacetClicksEnabled
        };
    }

});

export default ReportDataStore;
