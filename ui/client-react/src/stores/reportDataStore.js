import * as actions from '../../src/constants/actions';
import FacetSelections from '../components/facet/facetSelections';

import Fluxxor from 'fluxxor';

let ReportDataStore = Fluxxor.createStore({

    initialize: function() {
        this.data = {};
        this.loading = false;
        this.error = false;
        this.searchStringForFiltering = '' ;
        this.selections  = new FacetSelections();

        this.bindActions(
            actions.LOAD_REPORT, this.onLoadReport,
            actions.LOAD_REPORT_SUCCESS, this.onLoadReportSuccess,
            actions.LOAD_REPORT_FAILED, this.onLoadReportFailed,
            actions.LOAD_RECORDS,  this.onLoadRecords,
            actions.LOAD_RECORDS_SUCCESS, this.onLoadRecordsSuccess,
            actions.LOAD_RECORDS_FAILED, this.onLoadRecordsFailed,
            actions.SEARCH_FOR, this.onSearchFor
        );
    },

    onLoadReport: function(report) {
        this.loading = true;

        this.appId = report.appId;
        this.tblId = report.tblId;
        this.rptId = report.rptId;
        this.searchStringForFiltering = '' ;
        this.selections  = new FacetSelections();

        this.emit('change');
    },
    onLoadReportFailed: function() {
        this.loading = false;
        this.error = true;
        this.emit('change');
    },

    onLoadReportSuccess: function(reportData) {
        this.loading = false;
        this.error = false;

        let records = this.getReportData(reportData.data);
        this.data = {
            name: reportData.name,
            columns: this.getReportColumns(reportData.data.fields),
            records: records,
            facets: reportData.data.facets,
            filteredRecords: records
        };
        this.emit('change');
    },

    onLoadRecords: function(payload) {
        this.loading = true;

        this.appId = payload.appId;
        this.tblId = payload.tblId;
        this.rptId = payload.rptId;
        this.selections = payload.filter.selections;
        this.facetExpression = payload.filter.facet;
        this.searchStringForFiltering =  payload.filter.search;

        this.emit('change');
    },

    onLoadRecordsSuccess: function(records) {
        this.loading = false;
        this.error = false;
        this.data.filteredRecords = this.getReportData(records);
        this.emit('change');
    },

    onLoadRecordsFailed: function() {
        this.loading = false;
        this.error = true;
        this.emit('change');
    },

    onSearchFor: function(text) {

        this.data.filteredRecords = [];

        if (this.data.records) {
            this.data.records.forEach((record) => {

                let match = false;
                _.values(record).forEach((val) => {
                    if (val && val.toString().toLowerCase().indexOf(text.toLowerCase()) !== -1) {
                        match = true;
                    }
                });
                if (match) {
                    this.data.filteredRecords.push(record);
                }

            });
        }
        this.emit('change');
    },

    getReportColumns: function(fields) {
        let columns = [];
        if (fields) {
            fields.forEach(function(field, index) {
                let column = {};
                column.order = index;
                column.id = field.id;
                column.columnName = field.name;
                column.displayName = field.name;
                column.fieldType = field.type;
                column.builtIn = field.builtIn;

                //  client side attributes..
                column.datatypeAttributes = field.datatypeAttributes;

                columns.push(column);
            });
        }
        return columns;
    },

    getReportData: function(data) {
        let fields = data.fields;
        let records = data.records;
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

    getState: function() {
        return {
            loading: this.loading,
            error: this.error,
            data: this.data,
            appId: this.appId,
            tblId: this.tblId,
            rptId: this.rptId,
            searchStringForFiltering: this.searchStringForFiltering,
            selections: this.selections
        };
    }

});

export default ReportDataStore;
