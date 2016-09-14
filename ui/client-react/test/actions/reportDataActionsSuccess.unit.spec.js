import Fluxxor from 'fluxxor';
import reportDataActions from '../../src/actions/reportDataActions';
import * as actions from '../../src/constants/actions';
import * as query from '../../src/constants/query';
import Promise from 'bluebird';

describe('Report Data Actions success -- ', () => {
    'use strict';

    let appId = '1';
    let tblId = '2';
    let rptId = '3';
    let format = true;
    let offset = 1;
    let rows = 10;

    let filter = {
        facet: 'abc',
        search: ''
    };
    let responseReportData = {
        data: {
            name: 'name',
            reportMetaData: 'metaData',
            reportData: 'data'
        }
    };
    let responseResultData = {
        data: {
            test: 'test'
        }
    };
    let responseReportCountData = {
        response: {
            data: {
                body: 10
            }
        }
    };
    let response = {
        metaData: {
            name: responseReportData.data.name,
            hasGrouping: false, //for now just false tests until real grouping is implemented
        },
        recordData: responseResultData.data
    };
    let loadReportInputs = {
        appId: appId,
        tblId: tblId,
        rptId: rptId,
        offset: offset,
        rows: rows
    };
    let filterReportInputs = {
        appId: appId,
        tblId: tblId,
        rptId: rptId,
        filter: {
            facet: 'abc',
            search: ''
        },
        sortList: '6.-7'
    };
    let errorStatus = 404;

    let mockPromiseSuccess = function(expectedResult) {
        return Promise.resolve(expectedResult);
    };

    let mockPromiseError = function() {
        var p = Promise.defer();
        p.reject({message:'someError', status: errorStatus});
        return p.promise;
    };

    let mockPromiseException = function() {
        throw new Error("error");
    };

    class mockReportService {
        constructor() { }
        getReport() {
            return mockPromiseSuccess(responseReportData);
        }
        getReportRecordsCount() {
            return mockPromiseSuccess(responseReportCountData);
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(reportDataActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        reportDataActions.__Rewire__('ReportService', mockReportService);
        spyOn(mockReportService.prototype, 'getReport').and.callThrough();
        spyOn(mockReportService.prototype, 'getReportRecordsCount').and.callThrough();
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
    });

    it('test load report action with report parameters', (done) => {
        flux.actions.loadReport(appId, tblId, rptId, format, offset, rows).then(
            () => {
                expect(mockReportService.prototype.getReport).toHaveBeenCalled();
                expect(mockReportService.prototype.getReportRecordsCount).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(3);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_REPORT, loadReportInputs]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_REPORT_RECORDS_COUNT, {}]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(2)).toEqual([actions.LOAD_REPORT_SUCCESS, jasmine.any(Object)]);
                done();
            },
            () => {
                expect(true).toBe(false);
                done();
            }
        );
    });

    it('test load report action with sortlist', (done) => {
        let sortList = "6:V.-7";
        let queryParams = {};
        queryParams[query.OFFSET_PARAM] = offset;
        queryParams[query.NUMROWS_PARAM] = rows;
        queryParams[query.FORMAT_PARAM] = format;
        queryParams[query.SORT_LIST_PARAM] = sortList;
        queryParams[query.QUERY_PARAM] = '';
        flux.actions.loadReport(appId, tblId, rptId, format, offset, rows, sortList).then(
            () => {
                expect(mockReportService.prototype.getReport).toHaveBeenCalled();
                expect(mockReportService.prototype.getReportRecordsCount).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(3);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_REPORT, loadReportInputs]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_REPORT_RECORDS_COUNT, jasmine.any(Object)]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(2)).toEqual([actions.LOAD_REPORT_SUCCESS, jasmine.any(Object)]);
                done();
            },
            () => {
                expect(true).toBe(false);
                done();
            }
        );
    });
});

describe('Report Data Actions Filter Report functions -- success', () => {
    'use strict';

    let appId = '1';
    let tblId = '2';
    let rptId = '3';
    let filter = {
        facet: 'abc',
        search: ''
    };
    let columns = '1.2.3.4';
    let sortList = '6.-7';
    let responseReportData = {
        data: {
            name: 'name',
            query: '',
            fid: '',
            sortFids: ''
        }
    };
    let responseFacetData = {
        data: 'facetData'
    };
    let responseRecordData = {
        data: {
            fields: [],
            records: [],
            query: 'someQuery',
            filteredCount: 55
        }
    };
    let responseRecordModel = {
        metaData: {},
        recordData: {
                fields: [],
                records: [],
                query: 'someQuery',
                filteredCount: 55
        },
        rptId: null
    };
    let responseFilteredRecordsCount = {
        data: {
            fields: [],
            records: [],
            query: 'someQuery',
            filteredCount: 55
        },
    };
    let loadReportInputs = {
        appId: appId,
        tblId: tblId,
        rptId: rptId
    };

    let filterReportInputs = {
        appId: appId,
        tblId: tblId,
        rptId: rptId,
        filter : {
            facet: 'abc',
            search: ''
        },
        offset: 0,
        numRows: 20,
        sortList: ''
    };
    let filterReportInputsWithOverrides = {
        appId: appId,
        tblId: tblId,
        rptId: rptId,
        filter: undefined,
        offset:0,
        numRows:20,
        sortList: '6.-7'
    };
    let queryParams = {};
    queryParams[query.FORMAT_PARAM] = true;
    queryParams[query.OFFSET_PARAM] = 0;
    queryParams[query.NUMROWS_PARAM] = 20;

    class mockReportService {
        constructor() { }
        getReport() {
            return Promise.resolve(responseReportData);
        }
        parseFacetExpression() {
            return Promise.resolve(responseFacetData);
        }
    }
    class mockRecordService {
        constructor() {}
        getRecords() {
            return Promise.resolve(responseRecordData);
        }
    }
    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(reportDataActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockReportService.prototype, 'getReport').and.callThrough();
        spyOn(mockReportService.prototype, 'parseFacetExpression').and.callThrough();
        spyOn(mockRecordService.prototype, 'getRecords').and.callThrough();
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
        reportDataActions.__ResetDependency__('RecordService');
    });


    it('test get filtered records action with parameters', (done) => {
        flux.actions.getFilteredRecords(appId, tblId, rptId, {format:true, offset:0, numRows:20}, filter, {}).then(
            () => {
                expect(mockReportService.prototype.getReport).toHaveBeenCalled();
                expect(mockReportService.prototype.parseFacetExpression).toHaveBeenCalled();
                expect(mockRecordService.prototype.getRecords).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(3);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_RECORDS, filterReportInputs]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_RECORDS_SUCCESS, jasmine.any(Object)]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(2)).toEqual([actions.LOAD_FILTERED_RECORDS_COUNT_SUCCESS, jasmine.any(Object)]);
                done();
            },
            () => {
                expect(true).toBe(false);
                done();
            }
        );
    });

    it('test filter report action with parameters and row limit/offset', (done) => {
        flux.actions.getFilteredRecords(appId, tblId, rptId, queryParams, filter).then(
            () => {
                expect(mockReportService.prototype.getReport).toHaveBeenCalled();
                expect(mockReportService.prototype.parseFacetExpression).toHaveBeenCalled();
                expect(mockRecordService.prototype.getRecords).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(3);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_RECORDS, filterReportInputs]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_RECORDS_SUCCESS, jasmine.any(Object)]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(2)).toEqual([actions.LOAD_FILTERED_RECORDS_COUNT_SUCCESS, jasmine.any(Object)]);
                done();
            },
            () => {
                expect(true).toBe(false);
                done();
            }
        );
    });

    it('test get filtered records action with override parameters', (done) => {
        let overrideParams = {};
        overrideParams[query.COLUMNS_PARAM] = columns;
        overrideParams[query.SORT_LIST_PARAM] = sortList;
        overrideParams[query.OFFSET_PARAM] = 0;
        overrideParams[query.NUMROWS_PARAM] = 20;

        flux.actions.getFilteredRecords(appId, tblId, rptId, queryParams, undefined, overrideParams).then(
            () => {
                expect(mockReportService.prototype.getReport).toHaveBeenCalled();
                let resultingParams = {};
                _.extend(resultingParams, queryParams, overrideParams);
                resultingParams[query.QUERY_PARAM] = "";

                expect(mockRecordService.prototype.getRecords).toHaveBeenCalledWith(appId, tblId, resultingParams);
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(3);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_RECORDS, filterReportInputsWithOverrides]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_RECORDS_SUCCESS, responseRecordModel]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(2)).toEqual([actions.LOAD_FILTERED_RECORDS_COUNT_SUCCESS, responseFilteredRecordsCount]);
                done();
            },
            () => {
                expect(true).toBe(false);
                done();
            }
        );
    });
});

describe('Report Data Actions Edit Report functions -- success', () => {
    'use strict';

    let appId = '1';
    let tblId = '2';
    let recId = '3';
    let recIds = [1, 2, 3];
    let changes = {};
    let newRecord = {data:'value'};
    let responseData = {appId, tblId, data: 'success'};

    class mockRecordService {
        constructor() {}
        saveRecord(a, t, r, c) {
            return Promise.resolve({data:responseData});
        }
        createRecord(a, t, r) {
            return Promise.resolve({data: {body: '{"id" : 34}'}});
        }
        deleteRecord(a, b, r) {
            return Promise.resolve({data:responseData});
        }
        deleteRecordBulk(a, b, r) {
            return Promise.resolve({data:responseData});
        }
    }
    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(reportDataActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockRecordService.prototype, 'saveRecord').and.callThrough();
        spyOn(mockRecordService.prototype, 'createRecord').and.callThrough();
        spyOn(mockRecordService.prototype, 'deleteRecord').and.callThrough();
        spyOn(mockRecordService.prototype, 'deleteRecordBulk').and.callThrough();
        reportDataActions.__Rewire__('RecordService', mockRecordService);
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('RecordService');
    });

    it('test selectedRows', () => {
        let rows = "some info";
        flux.actions.selectedRows({rows});
        expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
        expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.SELECTED_ROWS, {rows}]);
    });

    it('test filterSelectionsPending', () => {
        let selections = 'some info';
        flux.actions.filterSelectionsPending(selections);
        expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
        expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.FILTER_SELECTIONS_PENDING, {selections}]);
    });

    it('test filterSearchPending', () => {
        let string = 'some info';
        flux.actions.filterSearchPending(string);
        expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
        expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.FILTER_SEARCH_PENDING, {string}]);
    });

    it('test newBlankReportRecord', () => {
        flux.actions.newBlankReportRecord(appId, tblId, 4);
        expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
        expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.NEW_BLANK_REPORT_RECORD, {appId, tblId, afterRecId:4}]);
    });

    it('test deleteReportRecord', (done) => {
        flux.actions.deleteReportRecord(appId, tblId, recId).then(
            () => {
                expect(mockRecordService.prototype.deleteRecord).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.DELETE_REPORT_RECORD_SUCCESS, recId]);
                done();
            },
            () => {
                expect(true).toBe(false);
                done();
            }
        );
    });

    it('test deleteReportRecordBulk resolve', (done) => {
        flux.actions.deleteReportRecordBulk(appId, tblId, recIds).then(
            () => {
                expect(mockRecordService.prototype.deleteRecordBulk).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.DELETE_REPORT_RECORD_BULK_SUCCESS, recIds]);
                done();
            },
            () => {
                expect(true).toBe(false);
                done();
            }
        );
    });

    it('test saveReportRecord', (done) => {

        flux.actions.saveReportRecord(appId, tblId, recId, changes).then(
                () => {
                    expect(mockRecordService.prototype.saveRecord).toHaveBeenCalled();
                    expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.SAVE_REPORT_RECORD,
                        {appId, tblId, recId, changes}]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.SAVE_REPORT_RECORD_SUCCESS,
                        jasmine.any(Object)]);
                    done();
                },
                () => {
                    expect(true).toBe(false);
                    done();
                }
            );
    });

    it('test saveNewReportRecord', (done) => {

        flux.actions.saveNewReportRecord(appId, tblId, newRecord).then(
                () => {
                    expect(mockRecordService.prototype.createRecord).toHaveBeenCalled();
                    expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.ADD_REPORT_RECORD,
                        {appId, tblId, record:newRecord}]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.ADD_REPORT_RECORD_SUCCESS,
                        jasmine.any(Object)]);
                    done();
                },
                () => {
                    expect(true).toBe(false);
                    done();
                }
            );
    });

});
