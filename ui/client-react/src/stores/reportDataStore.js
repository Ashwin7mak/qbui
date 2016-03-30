import * as actions from '../../src/constants/actions';
import FacetSelections from '../components/facet/facetSelections';

import Fluxxor from 'fluxxor';
import Logger from '../utils/logger';

let logger = new Logger();


let ReportDataStore = Fluxxor.createStore({

    initialize() {
        this.data = {};
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

    checkForFacetErrors(reportData) {
        if (reportData.data.facets) {
            let facets = reportData.data.facets;
            //check for error message returned
            //i.e facets : [{id: null, errorMessage: "unknownError"}]
            if (facets.length > 0) {
                if (facets[0].id === null) {
                    //log error
                    let msg = facets[0].errorMessage;
                    logger.error(`error response from server request : ${msg} getting facet information for app:${this.appId} table:${this.tblId} report:${this.rptId} `);
                    //no facets
                    reportData.data.facets = [];
                }
                //else good id data
            } else {
                //empty facet data ok there are no filters for this report
            }
        } else {
            //log error
            logger.error(`error got no facet property returned for app:${this.appId} table:${this.tblId} report:${this.rptId} `);
            reportData.data.facets = [];
        }
    },

    onLoadReportSuccess(reportData) {
        this.loading = false;
        this.error = false;

        this.data = {};
        let records = this.getReportData(reportData.data, reportData.hasGrouping);
        this.checkForFacetErrors(reportData);
        _.extend(this.data, {
            name: reportData.name,
            hasGrouping: reportData.hasGrouping, //TODO: QBSE-19937 this should come from report meta data.
            columns: this.getReportColumns(reportData.data.fields, reportData.hasGrouping),
            records: records,
            facets: reportData.data.facets,
            filteredRecords: records,
            recordsCount: reportData.data.records.length,
            filteredRecordsCount: reportData.data.records.length
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
        this.data.filteredRecordsCount = records.records ? records.records.length : null;
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

    onShowFacetMenu() {
        this.nonFacetClicksEnabled = false;
        this.emit('change');
    },

    onHideFacetMenu() {
        this.nonFacetClicksEnabled = true;
        this.emit('change');
    },

    getReportColumns(fields, hasGrouping) {
        let columns = [];
        let groupingFields = this.data.groupingFields;

        if (fields) {
            fields.forEach(function(field, index) {
                //skip showing grouped fields on report
                let isFieldGrouped = false;
                if (hasGrouping) {
                    isFieldGrouped = groupingFields.find((groupingField) => {
                        return field.name === groupingField;
                    });
                }
                if (!isFieldGrouped) {
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
                }
            });
        }
        return columns;
    },
    findTempGroupingFields(fields) {
        let groupingFields = [];
        fields.forEach((field) => {
            if (field.datatypeAttributes.type === "TEXT" && groupingFields.length < 2) {
                groupingFields.push(field.name);
            }
            if (field.datatypeAttributes.type === "RATING" && groupingFields.length < 2) {
                groupingFields.push(field.name);
            }
        });
        this.data.groupingFields = groupingFields;
        this.data.groupLevel = groupingFields.length;
        return groupingFields;
    },
    createTempGroupedData(reportData, fields) {
        let groupingFields = this.findTempGroupingFields(fields);
        let groupedData = _.groupBy(reportData, function(record) {
            return record[groupingFields[0]];
        });
        let newData = [];

        function groupByPredicate(rec) {
            return rec[groupingFields[1]];
        }
        for (let group in groupedData) {
            let children = [];
            if (groupingFields[1]) {
                let subgroupedData = _.groupBy(groupedData[group], groupByPredicate);
                for (let subgroup in subgroupedData) {
                    children.push({group: subgroup, children: subgroupedData[subgroup]});
                }
            } else {
                children = groupedData[group];
            }
            newData.push({group: group, children: children});
        }
        return newData;
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
            //QBSE-19937: fake group data for now. find a text and a numeric field and group data on that
            return this.createTempGroupedData(reportData, fields);
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
            selections: this.selections,
            nonFacetClicksEnabled : this.nonFacetClicksEnabled,
        };
    }

});

export default ReportDataStore;
