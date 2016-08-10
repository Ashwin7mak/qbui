import Fluxxor from 'fluxxor';
import reportDataActions from '../../src/actions/reportDataActions';
import * as actions from '../../src/constants/actions';
import * as query from '../../src/constants/query';
import Promise from 'bluebird';
import ReportUtils from '../../src/utils/reportUtils';

describe('Report Data Actions success -- ', () => {
    'use strict';

    let appId = '1';
    let tblId = '2';
    let rptId = '3';
    let filter = {
        facet: 'abc',
        search: ''
    };
    let responseReportData = {
        data: {
            name: 'name'
        }
    };
    let responseResultData = {
        data: {
            test: 'test'
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
        rptId: rptId
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

    class mockReportService {
        constructor() { }
        getReport() {
            return Promise.resolve(responseReportData);
        }
        getReportDataAndFacets() {
            return Promise.resolve(responseResultData);
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(reportDataActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockReportService.prototype, 'getReport').and.callThrough();
        spyOn(mockReportService.prototype, 'getReportDataAndFacets').and.callThrough();
        reportDataActions.__Rewire__('ReportService', mockReportService);
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
    });

    it('test load report action with report parameters', (done) => {
        flux.actions.loadReport(appId, tblId, rptId, true).then(
            () => {
                expect(mockReportService.prototype.getReport).toHaveBeenCalled();
                expect(mockReportService.prototype.getReportDataAndFacets).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_REPORT, loadReportInputs]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_REPORT_SUCCESS, jasmine.any(Object)]);
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
        queryParams[query.OFFSET_PARAM] = 0;
        queryParams[query.NUMROWS_PARAM] = 0;
        queryParams[query.FORMAT_PARAM] = true;
        queryParams[query.SORT_LIST_PARAM] = sortList;
        queryParams[query.QUERY_PARAM] = '';
        flux.actions.loadReport(appId, tblId, rptId, true, 0, 0, sortList).then(
            () => {
                expect(mockReportService.prototype.getReport).toHaveBeenCalled();
                expect(mockReportService.prototype.getReportDataAndFacets).toHaveBeenCalledWith(appId, tblId, rptId, queryParams);
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_REPORT, loadReportInputs]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_REPORT_SUCCESS, jasmine.any(Object)]);
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
            query: 'someQuery'
        }
    };
    let responseRecordModel = {
        metaData: {},
        recordData: {
            fields: [],
            records: [],
            query: 'someQuery'
        },
        rptId: null
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
        sortList: ''
    };
    let filterReportInputsWithOverrides = {
        appId: appId,
        tblId: tblId,
        rptId: rptId,
        filter: undefined,
        sortList: '6.-7'
    };
    let queryParams = {};
    queryParams[query.FORMAT_PARAM] = true;
    queryParams[query.OFFSET_PARAM] = 10;
    queryParams[query.NUMROWS_PARAM] = 50;

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
        flux.actions.getFilteredRecords(appId, tblId, rptId, {format:true}, filter, {}).then(
            () => {
                expect(mockReportService.prototype.getReport).toHaveBeenCalled();
                expect(mockReportService.prototype.parseFacetExpression).toHaveBeenCalled();
                expect(mockRecordService.prototype.getRecords).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_RECORDS, filterReportInputs]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_RECORDS_SUCCESS, jasmine.any(Object)]);
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
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_RECORDS, filterReportInputs]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_RECORDS_SUCCESS, jasmine.any(Object)]);
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

        flux.actions.getFilteredRecords(appId, tblId, rptId, queryParams, undefined, overrideParams).then(
            () => {
                expect(mockReportService.prototype.getReport).toHaveBeenCalled();
                let resultingParams = {};
                _.extend(resultingParams, queryParams, overrideParams);
                resultingParams[query.QUERY_PARAM] = "";

                expect(mockRecordService.prototype.getRecords).toHaveBeenCalledWith(appId, tblId, resultingParams);
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_RECORDS, filterReportInputsWithOverrides]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_RECORDS_SUCCESS, responseRecordModel]);
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
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.DELETE_REPORT_RECORD_SUCCESS, recId]);
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
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.DELETE_REPORT_RECORD_BULK_SUCCESS, recIds]);
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

});
