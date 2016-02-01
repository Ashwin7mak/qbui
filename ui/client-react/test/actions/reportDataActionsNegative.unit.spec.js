import Fluxxor from 'fluxxor';
import reportDataActions from '../../src/actions/reportDataActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

let inputs = {
    appId: '1',
    tblId: '2',
    rptId: '3',
    formatted: true,
    filter: {
        facet: 'abc',
        search: ''
    }
};
let responseReportData = {
    data: {
        name: 'name'
    }
};
let responseResultData = {
    data: {
        fields: [],
        records: []
    }
};
let responseFacetData = {
    data: {
        facets: {
            name: 'test'
        }
    }
};

let responseResultQuery = {
    data: 'testQuery'
};
let mockPromiseSuccess = function(expectedResult){
    var p = Promise.defer();
    p.resolve(expectedResult);
    return p.promise;
};
let mockPromiseError = function(){
    var p = Promise.defer();
    p.reject({message:'some error'});
    return p.promise;
};
let mockPromiseException = function(){
    var p = Promise.defer();
    throw new Error("error");
};

let stores = {};
let flux = new Fluxxor.Flux(stores);
flux.addActions(reportDataActions);


describe('Report Data Actions -- Filter report Negative', () => {
    'use strict';

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
        reportDataActions.__ResetDependency__('RecordService');
    });


    it('test filter report fail on resolve facet', (done) => {
        class mockReportService {
            constructor() { }
            getReport(){
                return mockPromiseSuccess(responseReportData);
            }
            parseFacetExpression() {
                return mockPromiseError();
            }
        }
        class mockRecordService {
            constructor() {
            }
            getRecords(){
                return mockPromiseSuccess(responseResultData);
            }
        }
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);
        flux.actions.filterReport(inputs.appId, inputs.tblId, inputs.rptId, inputs.formatted, inputs.filter);

        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT, {appId: inputs.appId, tblId: inputs.tblId, rptId: inputs.rptId});
        flux.dispatchBinder.dispatch.calls.reset();

        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT_FAILED);

    });

    it('test filter report fail on get records', (done) => {
        class mockReportService {
            constructor() { }
            getReport(){
                return mockPromiseSuccess(responseReportData);
            }
            parseFacetExpression(){
                return mockPromiseSuccess(responseResultQuery);
            }
        }
        class mockRecordService {
            constructor() {
            }
            getRecords() {
                return mockPromiseError();
            }
        }
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);
        flux.actions.filterReport(inputs.appId, inputs.tblId, inputs.rptId, inputs.formatted, inputs.filter);

        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT, {appId: inputs.appId, tblId: inputs.tblId, rptId: inputs.rptId});
        flux.dispatchBinder.dispatch.calls.reset();

        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_RECORDS_FAILED);

    });

    it('test filter report exception on get records', (done) => {
        class mockReportService {
            constructor() { }
            getReport(){
                return mockPromiseSuccess(responseReportData);
            }
            parseFacetExpression(){
                return mockPromiseSuccess(responseResultQuery);
            }
        }
        class mockRecordService {
            constructor() {
            }
            getRecords(){
                return mockPromiseException();
            }
        }
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);
        flux.actions.filterReport(inputs.appId, inputs.tblId, inputs.rptId, inputs.formatted, inputs.filter);

        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT, {appId: inputs.appId, tblId: inputs.tblId, rptId: inputs.rptId});
        flux.dispatchBinder.dispatch.calls.reset();

        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT_FAILED);

    });

});

describe('Report Data Actions -- Filter report Negative missing parameters', () => {
    'use strict';
    class mockReportService {
        constructor() {
        }
        getReport() {
            return mockPromiseSuccess(responseReportData);
        }
        getReportResults() {
            return mockPromiseSuccess(responseResultData);
        }
        parseFacetExpression() {
            return mockPromiseSuccess(responseResultQuery);
        }
    }
    class mockRecordService {
        constructor() {
        }
        getRecords() {
            return mockPromiseSuccess(responseResultData);
        }
    }

    var filter = {
        facet: 'abc',
        search: ''
    };

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockReportService.prototype, 'getReport');
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
        reportDataActions.__ResetDependency__('RecordService');
    });

    it('test filter report fail on missing appId', (done) => {
        //no app id
        flux.actions.filterReport(null, 2, 3, false, filter);
        expect(mockRecordService.getReport).not.toHaveBeenCalled();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT_FAILED);
    });

    it('test filter report fail on missing tableId', (done) => {
        //no table id
        flux.actions.filterReport(1, null, 3, false, filter);
        expect(mockRecordService.getReport).not.toHaveBeenCalled();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT_FAILED);
    });

    it('test filter report fail on missing reportId', (done) => {
        //no table id
        let promise = flux.actions.filterReport(1, 2, null, false, filter);
        expect(mockRecordService.getReport).not.toHaveBeenCalled();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT_FAILED);
    });

});

describe('Report Data Actions -- load report Negative missing parameters', () => {
    'use strict';
    class mockReportService {
        constructor() {
        }

        getReport() {
            return mockPromiseError(responseReportData);
        }

        getReportResults() {
            return mockPromiseSuccess(responseResultQuery);
        }

        getReportFacets() {
            return mockPromiseSuccess(responseFacetData);
        }
    }

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockReportService.prototype, 'getReport');
        reportDataActions.__Rewire__('ReportService', mockReportService);
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
    });

    it('test load report with missing appId', (done) => {
        let promise = flux.actions.loadReport(null, 2, 3, false);
        expect(mockReportService.prototype.getReport).not.toHaveBeenCalled();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT_FAILED);
    });

    it('test load report with missing tblId', (done) => {
        let promise = flux.actions.loadReport(1, null, 3, false);
        expect(mockReportService.prototype.getReport).not.toHaveBeenCalled();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT_FAILED);
    });

    it('test load report with missing rptId', (done) => {
        let promise = flux.actions.loadReport(1, 2, null, false);
        expect(mockReportService.prototype.getReport).not.toHaveBeenCalled();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT_FAILED);
    });

    it('test throwing exception when getting report', (done) => {
        let promise = flux.actions.loadReport(1, 2, 3, false);
        expect(mockReportService.prototype.getReport).toHaveBeenCalled();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalled();
        flux.dispatchBinder.dispatch.calls.reset();

        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT_FAILED);
    });
});

describe('Report Data Actions -- load report exception', () => {
    'use strict';
    class mockReportService {
        constructor() {
        }
        getReport() {
            return mockPromiseSuccess(responseReportData);
        }
        getReportResults() {
            return mockPromiseSuccess(responseResultQuery);
        }
        getReportFacets() {
            return mockPromiseException();
        }
    }

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockReportService.prototype, 'getReport');
        reportDataActions.__Rewire__('ReportService', mockReportService);
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
    });

    it('test throwing exception when loading a report', (done) => {

        let promise = flux.actions.loadReport(1, 2, 3, false);
        expect(mockReportService.prototype.getReport).toHaveBeenCalled();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalled();
        flux.dispatchBinder.dispatch.calls.reset();

        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT_FAILED);
    });

});

