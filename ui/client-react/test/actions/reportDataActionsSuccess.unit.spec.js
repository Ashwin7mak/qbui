import Fluxxor from 'fluxxor';
import reportDataActions from '../../src/actions/reportDataActions';
import * as actions from '../../src/constants/actions';
import * as query from '../../src/constants/query';
import Promise from 'bluebird';

describe('Report Data Actions - load a report', () => {
    'use strict';

    let appId = '1';
    let tblId = '2';
    let rptId = '3';
    let format = true;
    let offset = 1;
    let rows = 10;

    let responseReportData = {
        data: {
            name: 'name',
            reportMetaData: 'metaData',
            reportData: 'data'
        }
    };

    let loadReportInputs = {
        appId: appId,
        tblId: tblId,
        rptId: rptId,
        offset: offset,
        rows: rows
    };

    let mockPromiseSuccess = function(expectedResult) {
        return Promise.resolve(expectedResult);
    };

    class mockReportService {
        constructor() { }
        getReportResults() {
            return mockPromiseSuccess(responseReportData);
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(reportDataActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        reportDataActions.__Rewire__('ReportService', mockReportService);
        spyOn(mockReportService.prototype, 'getReportResults').and.callThrough();
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
    });

    it('test load report action with report parameters', (done) => {
        flux.actions.loadReport(appId, tblId, rptId, format, offset, rows).then(
            () => {
                expect(mockReportService.prototype.getReportResults).toHaveBeenCalled();
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

describe('Report Data Actions -- load a dynamic report', () => {
    'use strict';

    let appId = '1';
    let tblId = '2';
    let rptId = '3';
    let filter = {
        facet: 'abc',
        search: 'xyz'
    };

    let sortList = '6.-7:EQUALS';
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

    let queryParams = {};
    queryParams[query.OFFSET_PARAM] = 0;
    queryParams[query.NUMROWS_PARAM] = 20;

    class mockReportService {
        constructor() { }
        parseFacetExpression() {
            return Promise.resolve(responseFacetData);
        }
        getDynamicReportResults() {
            return Promise.resolve(responseReportData);
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(reportDataActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockReportService.prototype, 'parseFacetExpression').and.callThrough();
        spyOn(mockReportService.prototype, 'getDynamicReportResults').and.callThrough();
        reportDataActions.__Rewire__('ReportService', mockReportService);
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
    });

    it('test load dynamic report action with no override parameters', (done) => {
        flux.actions.loadDynamicReport(appId, tblId, rptId, true, filter, queryParams).then(
            () => {
                expect(mockReportService.prototype.getDynamicReportResults).toHaveBeenCalled();
                expect(mockReportService.prototype.parseFacetExpression).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_RECORDS, jasmine.any(Object)]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_RECORDS_SUCCESS, jasmine.any(Object)]);
                done();
            },
            () => {
                expect(true).toBe(false);
                done();
            }
        );
    });

    it('test load dynamic report action with override parameters and no search', (done) => {
        let overrideParams = queryParams;
        overrideParams[query.SORT_LIST_PARAM] = sortList;
        let format = true;

        let filterParams = [];
        filterParams.push(responseFacetData.data);
        overrideParams[query.QUERY_PARAM] = filterParams;

        flux.actions.loadDynamicReport(appId, tblId, rptId, format, null, overrideParams).then(
            () => {
                expect(mockReportService.prototype.getDynamicReportResults).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_RECORDS, jasmine.any(Object)]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_RECORDS_SUCCESS, jasmine.any(Object)]);
                done();
            },
            () => {
                expect(true).toBe(false);
                done();
            }
        );
    });

    it('test load dynamic report action with override parameters and search filter', (done) => {
        let overrideParams = queryParams;
        overrideParams[query.SORT_LIST_PARAM] = sortList;
        let format = true;

        flux.actions.loadDynamicReport(appId, tblId, rptId, format, filter, overrideParams).then(
            () => {
                expect(mockReportService.prototype.getDynamicReportResults).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_RECORDS, jasmine.any(Object)]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_RECORDS_SUCCESS, jasmine.any(Object)]);
                done();
            },
            () => {
                expect(true).toBe(false);
                done();
            }
        );
    });
});

describe('Report Data Actions - Edit Record functions -- success', () => {
    'use strict';

    let appId = '1';
    let tblId = '2';
    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(reportDataActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
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
});
