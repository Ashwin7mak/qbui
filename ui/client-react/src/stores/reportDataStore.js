import * as actions from '../../src/constants/actions';
import FacetSelections from '../components/facet/facetSelections';

import Fluxxor from 'fluxxor';

let ReportDataStore = Fluxxor.createStore({

    initialize() {
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

    onLoadReportSuccess(reportData) {
        this.loading = false;
        this.error = false;

        this.data = {};
        let records = this.getReportData(reportData.data, reportData.hasGrouping);
        _.extend(this.data, {
            name: reportData.name,
            hasGrouping: reportData.hasGrouping, //TODO: this should come from report meta data.
            columns: this.getReportColumns(reportData.data.fields),
            records: records,
            facets: reportData.data.facets,
            filteredRecords: records,
            recordsCount: reportData.data.records.length
        });
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

    onLoadRecordsSuccess(records) {
        this.loading = false;
        this.error = false;
        this.data.filteredRecords = this.getReportData(records, records.hasGrouping);
        this.data.hasGrouping = records.hasGrouping;
        this.data.filteredRecordsCount = records.length;
        this.emit('change');
    },

    onLoadRecordsFailed() {
        this.loading = false;
        this.error = true;
        this.emit('change');
    },

    onSearchFor(text) {

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

    getReportData(data, hasGrouping) {
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

        if (hasGrouping) {
            //fake group data for now. find a text and a numeric field and group data on that
            let groupingField1 = null;
            let groupingField2 = null;
            fields.forEach((field) => {
                if (field.datatypeAttributes.type === "TEXT" && groupingField1 === null) {
                    groupingField1 = field.name;
                }
                if (field.datatypeAttributes.type === "RATING" && groupingField2 === null) {
                    groupingField2 = field.name;
                }
            });
            if (groupingField1 &&  groupingField2) {
                this.data.groupLevel = 2;
            } else if (groupingField1 ||  groupingField2) {
                this.data.groupLevel = 1;
            }
            var groupedData = _.groupBy(reportData, function(record) {
                return record[groupingField1];
            });
            var newData = [];
            for (var group in groupedData) {
                var subgroupedData = _.groupBy(groupedData[group], ((record) => {
                    return record[groupingField2];
                }));
                var children = [];
                for (var subgroup in subgroupedData) {
                    children.push({group: subgroup, children: subgroupedData[subgroup]});
                }
                newData.push({group: group, children: children});
            }
            return newData;
        }
        return reportData;
    },

    getState() {
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
