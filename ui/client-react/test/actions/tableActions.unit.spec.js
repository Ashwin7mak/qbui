import Fluxxor from 'fluxxor';
import tableActions from '../../src/actions/tableActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

describe('Table Actions functions', () => {
    'use strict';

    let appId = 'appId';
    let tblId = 'tblId';
    let responseData = {
        reportMetaData: {data: {id: 3}},
        reportData: {}
    };
    let responseRecordCount = {
        data: 1
    };

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(tableActions);

    class mockTableService {
        constructor() { }
        getHomePage() {
            return Promise.resolve({data: responseData});
        }
    }
    class mockReportService {
        constructor() { }
        getReportRecordsCount() {
            return Promise.resolve({data: responseRecordCount.data});
        }
    }
    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockTableService.prototype, 'getHomePage').and.callThrough();
        spyOn(mockReportService.prototype, 'getReportRecordsCount').and.callThrough();
        tableActions.__Rewire__('TableService', mockTableService);
        tableActions.__Rewire__('ReportService', mockReportService);
    });

    afterEach(() => {
        tableActions.__ResetDependency__('TableService');
        tableActions.__ResetDependency__('ReportService');
    });

    var tableActionsTests = [
        {name:'test loadTableHomePage action', appId: appId, tblId: tblId}
    ];

    tableActionsTests.forEach(function(test) {
        it(test.name, function(done) {
            flux.actions.loadTableHomePage(test.appId, test.tblId).then(
                () => {
                    expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(3);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_REPORT, {appId: 'appId', tblId: 'tblId', rptId: '3'}]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_REPORT_SUCCESS, {
                        metaData: {id: 3},
                        recordData: {},
                        rptId: '3'
                    }]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(2)).toEqual([actions.LOAD_REPORT_RECORDS_COUNT_SUCCESS, responseRecordCount.data]);
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                }
            );
        });
    });

});
