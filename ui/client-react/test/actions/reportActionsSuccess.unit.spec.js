/* jshint proto: true */

import Fluxxor from 'fluxxor';
import reportActions from '../../src/actions/reportActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

describe('Report Actions functions -- success', () => {
    'use strict';

    let testData = {appId:'1', tblId:'2'};
    let responseData = {appId: testData.appId, tblId: testData.tblId, data: 'testData'};

    let promise;
    class mockReportService {
        constructor() { }
        getReports() {
            var p = Promise.defer();
            p.resolve(responseData);
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
                done();
            },
            function() {
                done();
            }
        );

    });

    afterEach(() => {
        reportActions.__ResetDependency__('ReportService');
        promise = null;
    });

    it('test load report action with report parameters', () => {
        expect(promise.isFulfilled()).toBeTruthy();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORTS_SUCCESS,responseData);
    });

});

