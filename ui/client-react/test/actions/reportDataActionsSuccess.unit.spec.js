import Fluxxor from 'fluxxor';
import reportDataActions from '../../src/actions/reportDataActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

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
        name: responseReportData.data.name,
        data: responseResultData.data
    };
    let loadReportInputs = {
        appId: appId,
        tblId: tblId,
        rptId: rptId
    };

    class mockReportService {
        constructor() { }
        getReport() {
            return Promise.resolve(responseReportData);
        }
        getReportResults() {
            return Promise.resolve(responseResultData);
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(reportDataActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockReportService.prototype, 'getReport').and.callThrough();
        spyOn(mockReportService.prototype, 'getReportResults').and.callThrough();
        reportDataActions.__Rewire__('ReportService', mockReportService);
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
    });

    it('test load report action with report parameters', (done) => {
        flux.actions.loadReport(appId, tblId, rptId, true).then(
            () => {
                expect(mockReportService.prototype.getReport).toHaveBeenCalled();
                expect(mockReportService.prototype.getReportResults).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_REPORT, loadReportInputs]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_REPORT_SUCCESS, response]);
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
    let loadReportInputs = {
        appId: appId,
        tblId: tblId,
        rptId: rptId
    };

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


    it('test filter report action with parameters', (done) => {
        flux.actions.filterReport(appId, tblId, rptId, true, filter).then(
            () => {
                expect(mockReportService.prototype.getReport).toHaveBeenCalled();
                expect(mockReportService.prototype.parseFacetExpression).toHaveBeenCalled();
                expect(mockRecordService.prototype.getRecords).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_REPORT, loadReportInputs]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_REPORT_SUCCESS, responseRecordData.data]);
                done();
            },
            () => {
                expect(true).toBe(false);
                done();
            }
        );
    });
});
