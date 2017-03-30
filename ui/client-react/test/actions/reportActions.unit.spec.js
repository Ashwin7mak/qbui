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
    it('select report records', () => {
        let selections = [1, 2, 3];
        expect(reportActions.selectReportRecords(context, selections)).toEqual(event(context, types.SELECT_REPORT_RECORDS, {selections}));
    });

    it('add a blank record to a report', (done) => {
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
    let mockReportResultsResponse = {
        data: {
            metaData: {}
        }
    };
    let mockFacetResult = {
        data: {
            something: ''
        }
    };
    let mockCountResult = {
        data: {
            body: 3
        }
    };

    class mockReportService {
        getReports() {
            return Promise.resolve(mockReportsResponse);
        }
        getReportResults() {
            return Promise.resolve(mockReportResultsResponse);
        }
        parseFacetExpression() {
            return Promise.resolve(mockFacetResult);
        }
        getDynamicReportResults() {
            return Promise.resolve(mockReportResultsResponse);
        }
        getReportRecordsCount() {
            return Promise.resolve(mockCountResult);
        }
    }

    beforeEach(() => {
        spyOn(mockReportService.prototype, 'getReports').and.callThrough();
        spyOn(mockReportService.prototype, 'getReportResults').and.callThrough();
        spyOn(mockReportService.prototype, 'getDynamicReportResults').and.callThrough();
        ReportsActionsRewireAPI.__Rewire__('ReportService', mockReportService);
    });

    afterEach(() => {
        ReportsActionsRewireAPI.__ResetDependency__('ReportService');
    });

    it('verify loadReports action', (done) => {

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

    it('verify loadReport action', (done) => {

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

    it('verify loadDynamicReport action', (done) => {

        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const filter = {
            search: 'filter'
        };
        const expectedActions = [
            event(context, types.LOAD_REPORT, {appId, tblId, rptId}),
            event(context, types.LOAD_REPORT_SUCCESS, jasmine.any(Object))
        ];
        const store = mockReportsStore({});

        return store.dispatch(reportActions.loadDynamicReport(context, appId, tblId, rptId, true, filter, null)).then(
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });

    it('loadReportRecordsCount action dispatches type:LOAD_REPORT_RECORDS_COUNT_SUCCESS with number of records', (done) => {
        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const expectedActions = [
            event(context, types.LOAD_REPORT_RECORDS_COUNT_SUCCESS, jasmine.any(Number))
        ];
        const store = mockReportsStore({});

        return store.dispatch(reportActions.loadReportRecordsCount(context, appId, tblId, rptId)).then(
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
    let mockFacetResult = {
        data: {
            something: ''
        }
    };
    class mockReportService {
        getReports() {
            return Promise.reject(mockErrorResponse);
        }
        getReportResults() {
            return Promise.reject(mockErrorResponse);
        }
        parseFacetExpression() {
            return Promise.resolve(mockFacetResult);
        }
        getDynamicReportResults() {
            return Promise.reject(mockErrorResponse);
        }
        getReportRecordsCount() {
            return Promise.reject(mockErrorResponse);
        }
    }

    beforeEach(() => {
        spyOn(mockReportService.prototype, 'getReports').and.callThrough();
        spyOn(mockReportService.prototype, 'getReportResults').and.callThrough();
        spyOn(mockReportService.prototype, 'getDynamicReportResults').and.callThrough();
        ReportsActionsRewireAPI.__Rewire__('ReportService', mockReportService);
    });

    afterEach(() => {
        mockReportService.prototype.getReports.calls.reset();
        mockReportService.prototype.getReportResults.calls.reset();
        mockReportService.prototype.getDynamicReportResults.calls.reset();
        ReportsActionsRewireAPI.__ResetDependency__('ReportService');
    });

    it('verify loadReports action with promise reject', (done) => {

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

    it('verify loadReports action with missing parameters', (done) => {

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

    it('verify loadReport action with promise reject', (done) => {

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

    it('verify loadReport action with missing parameters', (done) => {

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
                expect(mockReportService.prototype.getReportResults.calls.count()).toEqual(0);
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
    });

    it('verify loadDynamicReport action with promise reject', (done) => {
        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const expectedActions = [
            event(context, types.LOAD_REPORT, {appId, tblId, rptId}),
            event(context, types.LOAD_REPORT_FAILED, 'error')
        ];
        const store = mockReportsStore({});
        return store.dispatch(reportActions.loadDynamicReport(context, appId, tblId, rptId, true, null, null)).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
    });

    it('verify loadDynamicReport action with missing parameters', (done) => {
        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const expectedActions = [
            {id: context, type: types.LOAD_REPORT_FAILED, content: 500}
        ];
        const store = mockReportsStore({});

        return store.dispatch(reportActions.loadDynamicReport(context)).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(mockReportService.prototype.getDynamicReportResults.calls.count()).toEqual(0);
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
    });

    it('loadReportRecordsCount action dispatches LOAD_REPORT_RECORDS_COUNT_FAILED when request fails', (done) => {
        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const expectedActions = [
            event(context, types.LOAD_REPORT_RECORDS_COUNT_FAILED, 'error')
        ];
        const store = mockReportsStore({});

        return store.dispatch(reportActions.loadReportRecordsCount(context, appId, tblId, rptId)).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
    });
});
