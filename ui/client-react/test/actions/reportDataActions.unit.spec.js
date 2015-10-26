/* jshint proto: true */

import Fluxxor from 'fluxxor';
import reportDataActions from '../../src/actions/reportDataActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

describe('Report Data Actions functions -- success', () => {
    'use strict';

    let appId = '1';
    let tblId = '2';
    let rptId = '3';
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

    let promise;
    class mockReportService {
        constructor() { }
        getReport() {
            var p = Promise.defer();
            p.resolve(responseReportData);
            return p.promise;
        }
        getReportResults() {
            var p = Promise.defer();
            p.resolve(responseResultData);
            return p.promise;
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(reportDataActions);

    beforeEach((done) => {
        spyOn(flux.dispatchBinder, 'dispatch');
        reportDataActions.__Rewire__('ReportService', mockReportService);

        promise = flux.actions.loadReport(appId, tblId, rptId, true);

        //  expect a load report event to get fired before the promise returns
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT, {appId, tblId, rptId});
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
        reportDataActions.__ResetDependency__('ReportService');
        promise = null;
    });

    it('test load report action with report parameters', () => {
        expect(promise.isFulfilled()).toBeTruthy();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT_SUCCESS, response);
    });

});

