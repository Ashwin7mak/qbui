import Fluxxor from 'fluxxor';
import Logger from '../utils/logger';
import ReportService from '../services/reportService';
//import { fakeGriddleDataByReportId } from '../components/dataTable/griddleTable/fakeData.js';

let logger = new Logger();

let ReportDataStore = Fluxxor.createStore({

    initialize: function() {
        this.data = [];
        this.bindActions(
            'LOAD_REPORT', this.onLoadReport
        );

        this.reportService = new ReportService();
    },

    onLoadReport: function(report) {
        this.data = {};
        if (report.appId && report.tblId && report.rptId) {
            this.reportService.getReportResults(report.appId, report.tblId, report.rptId, true).
                then(
                function(response) {
                    this.data = {columns: this.getReportColumns(response.data.fields), records: this.getReportData(response.data)};
                    logger.debug('success:' + response);
                    this.emit('change');
                }.bind(this),
                function(error) {
                    logger.debug('error:' + error);
                    this.emit('change');
                }.bind(this))
                .catch(
                function(ex) {
                    logger.debug('exception:' + ex);
                    this.emit('change');
                }.bind(this)
            );
        }

        //if (fakeGriddleDataByReportId[reportID])
        //    this.data = fakeGriddleDataByReportId[reportID];
        //else
        //    this.data = fakeGriddleDataByReportId["1"];
        //
        //this.emit("change");
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
            column.datatypeAttribures = field.datatypeAttributes;

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
            data: this.data
        };
    }
});

export default ReportDataStore;