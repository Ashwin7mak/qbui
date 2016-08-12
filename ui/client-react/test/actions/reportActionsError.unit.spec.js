/* jshint proto: true */

import Fluxxor from 'fluxxor';
import reportActions from '../../src/actions/reportActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

let errorStatus = 404;
let exStatus = 500;

describe('Report Actions error functions --', () => {
    'use strict';

    let testData = {appId:'1', tblId:'2'};

    class mockReportService {
        constructor() { }
        getReports() {
            var p = Promise.defer();
            p.reject({message:'someError', status:errorStatus});
            return p.promise;
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(reportActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockReportService.prototype, 'getReports').and.callThrough();
        reportActions.__Rewire__('ReportService', mockReportService);
    });

    afterEach(() => {
        reportActions.__ResetDependency__('ReportService');
    });

    it('test load report action with promise reject', (done) => {
        flux.actions.loadReports(testData.appId, testData.tblId).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(mockReportService.prototype.getReports).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_REPORTS]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_REPORTS_FAILED], errorStatus);
                done();
            }
        );
    });

    it('test load report action with no data', (done) => {
        flux.actions.loadReports().then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(mockReportService.prototype.getReports).not.toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_REPORTS_FAILED, exStatus]);
                done();
            }
        );
    });

});

describe('Report Actions error functions -- ', () => {
    'use strict';

    let testData = {appId:'1', tblId:'2'};

    class mockReportService {
        constructor() { }
        getReports() {
            return Promise.resolve(null);
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(reportActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockReportService.prototype, 'getReports').and.callThrough();
        reportActions.__Rewire__('ReportService', mockReportService);
    });

    afterEach(() => {
        reportActions.__ResetDependency__('ReportService');
    });

    it('test exception', (done) => {
        flux.actions.loadReports(testData.appId, testData.tblId).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(mockReportService.prototype.getReports).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_REPORTS]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_REPORTS_FAILED, exStatus]);
                done();
            }
        );
    });

});
