import Fluxxor from 'fluxxor';
import Logger from '../utils/logger';

//import { fakeGriddleDataByReportId } from '../components/dataTable/griddleTable/fakeData.js';

let logger = new Logger();

let ReportDataStore = Fluxxor.createStore({

    initialize: function() {
        this.data = [];
        this.loading = false;
        this.error = false;

        this.bindActions(
            'LOAD_REPORT', this.onLoadReport,
            'LOAD_REPORT_SUCCESS', this.onLoadReportSuccess,
            'LOAD_REPORT_FAILED', this.onLoadReportFailed
        );
    },

    onLoadReport: function(report) {
        this.loading = true;

        this.appId = report.appId;
        this.tblId = report.tblId;
        this.rptId = report.rptId;

        this.emit("change");
    },
    onLoadReportFailed: function() {
        this.loading = false;
        this.error = true;
        this.emit("change");
    },

    onLoadReportSuccess: function(reportData) {
        this.loading = false;
        this.error = false;

        let data = {
            name: reportData.name,
            columns: this.getReportColumns(reportData.data.fields),
            records: this.getReportData(reportData.data)
        };

        this.data = data;
        this.emit("change");
    },

    getReportColumns: function(fields) {
        let columns = [];
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
        return columns;
    },

    getReportData: function(data) {
        let fields = data.fields;
        let records = data.records;
        let reportData = [];
        let map = new Map();

        if (fields && records) {
            fields.forEach(function(field) {
                map.set(field.id, field);
            });

            records.forEach(function(record) {
                let columns = {};
                record.forEach(function(column) {
                    let fld = map.get(column.id);
                    columns[fld.name] = column.display;
                });
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
            rptId: this.rptId
        };
    }
});

export default ReportDataStore;