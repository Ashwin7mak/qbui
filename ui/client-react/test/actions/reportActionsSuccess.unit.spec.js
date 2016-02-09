/* jshint proto: true */

import Fluxxor from 'fluxxor';
import reportActions from '../../src/actions/reportActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

describe('Report Actions functions -- success', () => {
    'use strict';

    let testData = {appId: '1', tblId: '2'};
    let responseData = {appId: testData.appId, tblId: testData.tblId, data: 'testData'};

    class mockReportService {
        constructor() { }
        getReports(appId, tblId) {
            return Promise.resolve({data:responseData});
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

    it('test load report action with report parameters', (done) => {

        flux.actions.loadReports(testData.appId, testData.tblId).then(
            () => {
                expect(mockReportService.prototype.getReports).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_REPORTS]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_REPORTS_SUCCESS, {appId:testData.appId, tblId:testData.tblId, data:responseData}]);
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            }
        );
    });

});

