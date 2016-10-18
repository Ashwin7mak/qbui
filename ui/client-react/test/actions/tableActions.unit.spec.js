import Fluxxor from 'fluxxor';
import tableActions from '../../src/actions/tableActions';
import * as actions from '../../src/constants/actions';
import Constants from '../../../common/src/constants';
import reportModel from '../../src/models/reportModel';

import Promise from 'bluebird';

describe('Table Actions functions', () => {
    'use strict';

    let appId = 'appId';
    let tblId = 'tblId';
    let offset = Constants.PAGE.DEFAULT_OFFSET;
    let numRows = Constants.PAGE.DEFAULT_NUM_ROWS;

    let responseData = {
        reportMetaData: {data: {id: '2'}},
        reportData: {data:{filteredCount: 1}}
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

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockTableService.prototype, 'getHomePage').and.callThrough();
        tableActions.__Rewire__('TableService', mockTableService);
    });

    afterEach(() => {
        tableActions.__ResetDependency__('TableService');
        flux.dispatchBinder.dispatch.calls.reset();
    });

    var tableActionsTests = [
        {name:'test loadTableHomePage action', appId: appId, tblId: tblId, offset: offset, numRows: numRows}
    ];

    tableActionsTests.forEach(function(test) {
        it(test.name, function(done) {
            flux.actions.loadTableHomePage(test.appId, test.tblId, test.offset, test.numRows).then(
                () => {
                    done();
                    let model = reportModel.set(responseData.reportMetaData, responseData.reportData);
                    expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(3);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_REPORT, {appId: 'appId', tblId: 'tblId', rptId: responseData.reportMetaData.data.id}]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_REPORT_SUCCESS, model]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(2)).toEqual([actions.LOAD_REPORT_RECORDS_COUNT_SUCCESS, responseData.reportData.data.filteredCount]);
                },
                () => {
                    done();
                    expect(false).toBe(true);
                }
            );
        });
    });

});
