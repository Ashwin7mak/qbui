/* jshint proto: true */

import Fluxxor from 'fluxxor';
import reportActions from '../../src/actions/reportActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

describe('Report Actions functions -- error', () => {
    'use strict';

    let testData = {appId:'1', tblId:'2'}

    let promise;
    class mockReportService {
        constructor() { }
        getReports() {
            var p = Promise.defer();
            p.reject({message:'some error'});
            return p.promise;
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(reportActions);

    beforeEach((done) => {
        spyOn(flux.dispatchBinder, 'dispatch');
        reportActions.__Rewire__('ReportService', mockReportService);

        promise = flux.actions.loadReports(testData);

        //  expect a load report event to get fired before the promise returns
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORTS);
        flux.dispatchBinder.dispatch.calls.reset();

        promise.then(
            function() {
                console.log('beforeEach successdone');
                done();
            },
            function() {
                console.log('beforeEeach error done');
                done();
            }
        );

    });

    afterEach(() => {
        reportActions.__ResetDependency__('ReportService');
        promise = null;
    });

    it('test load report action with error input', () => {
        expect(promise.isRejected()).toBeTruthy();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORTS_FAILED);
    });

});

describe('Report Actions functions -- no data supplied', () => {
    'use strict';

    let testData = {appId:null, tblId:null}

    let promise;
    class mockSuccessReportService {
        constructor() { }
        getReports() {
            var p = Promise.defer();
            p.reject({message:'some error'});
            return p.promise;
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(reportActions);

    beforeEach((done) => {
        spyOn(flux.dispatchBinder, 'dispatch');
        reportActions.__Rewire__('ReportService', mockSuccessReportService);

        promise = flux.actions.loadReports(testData);

        //  no spinner if missing input parameters
        expect(flux.dispatchBinder.dispatch).not.toHaveBeenCalled();

        promise.then(
            function() {
                console.log('beforeEach successdone');
                done();
            },
            function() {
                console.log('beforeEeach error done');
                done();
            }
        );

    });

    afterEach(() => {
        reportActions.__ResetDependency__('ReportService');
        promise = null;
    });

    it('test load report action with error input', () => {
        expect(promise.isRejected()).toBeTruthy();
        expect(flux.dispatchBinder.dispatch).not.toHaveBeenCalled();
    });

});

