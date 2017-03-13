import {loadTableHomePage, __RewireAPI__ as TableActionsRewireAPI} from '../../src/actions/tableActions';
import * as types from '../../src/actions/types';
import {PAGE} from '../../../common/src/constants';
import ReportModel from '../../src/models/reportModel';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import Promise from 'bluebird';

let appId = 'appId';
let tblId = 'tblId';
let rptId = null;
let offset = PAGE.DEFAULT_OFFSET;
let numRows = PAGE.DEFAULT_NUM_ROWS;
let context = 'view';

// we mock the Redux store when testing async action creators
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

class mockReportModel {
    constructor() { }
    get() {
        return null;
    }
}

describe('Table Actions success workflow functions', () => {

    let responseData = {
        data: null
    };
    class mockTableService {
        constructor() { }
        getHomePage() {
            return Promise.resolve(responseData);
        }
    }

    beforeEach(() => {
        spyOn(mockTableService.prototype, 'getHomePage').and.callThrough();
        TableActionsRewireAPI.__Rewire__('TableService', mockTableService);
        TableActionsRewireAPI.__Rewire__('ReportModel', mockReportModel);
    });

    afterEach(() => {
        TableActionsRewireAPI.__ResetDependency__('TableService');
        TableActionsRewireAPI.__ResetDependency__('ReportModel');
    });

    it('loads table home page', (done) => {
        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const expectedActions = [
            {id: context, type: types.LOAD_REPORT, content: {appId, tblId, rptId}},
            {id: context, type: types.LOAD_REPORT_SUCCESS, content: null}
        ];

        const store = mockStore({});
        return store.dispatch(loadTableHomePage(context, appId, tblId, rptId, offset, numRows)).then(
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toEqual(true);
                done();
            });
    });
});

describe('Table Actions functions', () => {

    let errorData = {
        response: 'some error'
    };
    class mockTableService {
        constructor() { }
        getHomePage() {
            return Promise.reject(errorData);
        }
    }

    beforeEach(() => {
        spyOn(mockTableService.prototype, 'getHomePage').and.callThrough();
        TableActionsRewireAPI.__Rewire__('TableService', mockTableService);
        TableActionsRewireAPI.__Rewire__('ReportModel', mockReportModel);
    });

    afterEach(() => {
        TableActionsRewireAPI.__ResetDependency__('TableService');
        TableActionsRewireAPI.__ResetDependency__('ReportModel');
    });

    it('loads table home page with invalid parameters', (done) => {
        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const expectedActions = [
            {id: context, type: types.LOAD_REPORT_FAILED, content: 500}
        ];

        const store = mockStore({});
        return store.dispatch(loadTableHomePage(context)).then(
            () => {
                expect(true).toEqual(false);
                done();
            },
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
    });

    it('loads table home page with invalid response', (done) => {
        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const expectedActions = [
            {id: context, type: types.LOAD_REPORT, content: {appId, tblId, rptId}},
            {id: context, type: types.LOAD_REPORT_FAILED, content: errorData}
        ];

        const store = mockStore({});
        return store.dispatch(loadTableHomePage(context, appId, tblId, rptId, offset, numRows)).then(
            () => {
                expect(true).toEqual(false);
                done();
            },
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
    });

});
