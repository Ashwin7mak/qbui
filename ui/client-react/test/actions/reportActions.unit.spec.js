import {__RewireAPI__ as ReportsActionsRewireAPI} from '../../src/actions/reportActions';
import * as reportActions from '../../src/actions/reportActions';

import * as types from '../../src/actions/types';
import {CONTEXT} from '../../src/actions/context';
import reportsModel from '../../src/models/reportsModel';
import ReportModel from '../../src/models/reportModel';
import mockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Promise from 'bluebird';

let appId = 1;
let tblId = 2;
let rptId = 3;
let context = CONTEXT.REPORT.NAV;

// mock the Redux store when testing async action creators
const middlewares = [thunk];
const mockReportsStore = mockStore(middlewares);

function event(ctx, type, content) {
    let id = ctx;
    return {
        id: id,
        type: type,
        content: content || null
    };
}

describe('Report actions', () => {
    it('create an action to select report records', () => {
        let selections = [1, 2, 3];
        expect(reportActions.selectReportRecords(context, selections)).toEqual(event(context, types.SELECT_REPORT_RECORDS, {selections}));
    });

    it('add blank record to a report', (done) => {
        const store = mockReportsStore({});
        const afterRecId = 10;
        const expectedAction = [
            event(context, types.ADD_BLANK_REPORT_RECORD, {context, afterRecId})
        ];
        return store.dispatch(reportActions.addBlankRecordToReport(context, afterRecId)).then(
            () => {
                expect(store.getActions()).toEqual(expectedAction);
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });
});

describe('Test ReportsActions function success workflow', () => {

    let mockReportsResponse = {
        data: [
            {id: 1, name: 'report1', type:'type1'}
        ]
    };
    let mockReportsResultsResponse = {
        data: {
            metaData: {}
        }
    };

    class mockReportService {
        getReports() {
            return Promise.resolve(mockReportsResponse);
        }
        getReportResults() {
            return Promise.resolve(mockReportsResultsResponse);
        }
    }

    beforeEach(() => {
        spyOn(mockReportService.prototype, 'getReports').and.callThrough();
        spyOn(mockReportService.prototype, 'getReportResults').and.callThrough();
        ReportsActionsRewireAPI.__Rewire__('ReportService', mockReportService);
    });

    afterEach(() => {
        ReportsActionsRewireAPI.__ResetDependency__('ReportService');
    });

    it('verify loadReports action with resolve promise response', (done) => {

        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        let model = reportsModel.set(appId, tblId, mockReportsResponse.data);
        const expectedActions = [
            event(context, types.LOAD_REPORTS, {appId, tblId}),
            event(context, types.LOAD_REPORTS_SUCCESS, model)
        ];
        const store = mockReportsStore({});

        return store.dispatch(reportActions.loadReports(context, appId, tblId)).then(
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });

    it('verify loadReport action with resolve promise response', (done) => {

        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.

        const expectedActions = [
            event(context, types.LOAD_REPORT, {appId, tblId, rptId}),
            event(context, types.LOAD_REPORT_SUCCESS, jasmine.any(Object))
        ];
        const store = mockReportsStore({});

        return store.dispatch(reportActions.loadReport(context, appId, tblId, rptId, true, 0, 20)).then(
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

describe('Test ReportsActions function failure workflow', () => {

    let mockErrorResponse = {
        response: 'error'
    };

    class mockReportService {
        getReports() {
            return Promise.reject(mockErrorResponse);
        }
        getReportResults() {
            return Promise.reject(mockErrorResponse);
        }
    }

    beforeEach(() => {
        spyOn(mockReportService.prototype, 'getReports').and.callThrough();
        spyOn(mockReportService.prototype, 'getReportResults').and.callThrough();
        ReportsActionsRewireAPI.__Rewire__('ReportService', mockReportService);
    });

    afterEach(() => {
        mockReportService.prototype.getReports.calls.reset();
        mockReportService.prototype.getReportResults.calls.reset();
        ReportsActionsRewireAPI.__ResetDependency__('ReportService');
    });

    it('verify loadReports action with reject promise response', (done) => {

        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const expectedActions = [
            event(context, types.LOAD_REPORTS, {appId, tblId}),
            event(context, types.LOAD_REPORTS_FAILED, mockErrorResponse)
        ];
        const store = mockReportsStore({});
        return store.dispatch(reportActions.loadReports(context, appId, tblId)).then(
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

        return store.dispatch(reportActions.loadReports()).then(
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

    it('verify loadReport action with reject promise response', (done) => {

        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const expectedActions = [
            event(context, types.LOAD_REPORT, {appId, tblId, rptId}),
            event(context, types.LOAD_REPORT_FAILED, mockErrorResponse)
        ];
        const store = mockReportsStore({});
        return store.dispatch(reportActions.loadReport(context, appId, tblId, rptId, true, 0, 20)).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
    });

    it('verify loadReport action with invalid input parameters', (done) => {

        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const expectedActions = [
            {id: context, type: types.LOAD_REPORT_FAILED, content: 500}
        ];
        const store = mockReportsStore({});

        return store.dispatch(reportActions.loadReport(context)).then(
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

