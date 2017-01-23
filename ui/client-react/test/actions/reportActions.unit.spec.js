import {loadReports, __RewireAPI__ as ReportActionsRewireAPI} from '../../src/actions/reportActions';
import * as types from '../../src/actions/types';
import {CONTEXT} from '../../src/actions/context';
import reportsModel from '../../src/models/reportsModel';
import mockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Promise from 'bluebird';

let appId = 1;
let tblId = 2;
let context = CONTEXT.LOAD_REPORTS.NAV;

// mock the Redux store when testing async action creators
const middlewares = [thunk];
const mockReportsStore = mockStore(middlewares);

describe('Test ReportActions function success workflow', () => {

    let mockReportsResponse = {
        data: [
            {id: 1, name: 'report1', type:'type1'}
        ]
    };

    class mockReportService {
        constructor() { }
        getReports() {
            return Promise.resolve(mockReportsResponse);
        }
    }

    beforeEach(() => {
        spyOn(mockReportService.prototype, 'getReports').and.callThrough();
        ReportActionsRewireAPI.__Rewire__('ReportService', mockReportService);
    });

    afterEach(() => {
        ReportActionsRewireAPI.__ResetDependency__('ReportService');
    });

    it('verify loadReports action with resolve promise response', (done) => {

        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        let model = reportsModel.set(appId, tblId, mockReportsResponse.data);
        const expectedActions = [
            {id: context, type: types.LOAD_REPORTS, content: null},
            {id: context, type: types.LOAD_REPORTS_SUCCESS, content: model}
        ];
        const store = mockReportsStore({});

        return store.dispatch(loadReports(context, appId, tblId)).then(
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });
});

describe('Test ReportActions function failure workflow', () => {

    let mockReportsResponse = {
        response: 'error'
    };

    class mockReportService {
        constructor() { }
        getReports() {
            return Promise.reject(mockReportsResponse);
        }
    }

    beforeEach(() => {
        spyOn(mockReportService.prototype, 'getReports').and.callThrough();
        ReportActionsRewireAPI.__Rewire__('ReportService', mockReportService);
    });

    afterEach(() => {
        mockReportService.prototype.getReports.calls.reset();
        ReportActionsRewireAPI.__ResetDependency__('ReportService');
    });

    it('verify loadReports action with reject promise response', (done) => {

        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const expectedActions = [
            {id: context, type: types.LOAD_REPORTS, content: null},
            {id: context, type: types.LOAD_REPORTS_FAILED, content: mockReportsResponse}
        ];
        const store = mockReportsStore({});

        return store.dispatch(loadReports(context, appId, tblId)).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
    });

    it('verify loadReports action with invalid input parameters', (done) => {

        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const expectedActions = [
            {id: null, type: types.LOAD_REPORTS_FAILED, content: 500}
        ];
        const store = mockReportsStore({});

        return store.dispatch(loadReports()).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(mockReportService.prototype.getReports.calls.count()).toEqual(0);
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
    });
});

