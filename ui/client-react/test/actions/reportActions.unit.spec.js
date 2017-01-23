import {loadReports, __RewireAPI__ as ReportActionsRewireAPI} from '../../src/actions/reportActions';
import * as types from '../../src/actions/types';
import reportsModel from '../../src/models/reportsModel';
import mockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Promise from 'bluebird';

describe('loading actions', () => {

    let appId = 1;
    let tblId = 2;
    let storeId = appId + '-' + tblId;

    // mock the Redux store when testing async action creators
    const middlewares = [thunk];
    const mockReportsStore = mockStore(middlewares);

    describe('reports data action success', () => {

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

        it('load reports action', (done) => {

            // the mock store makes the actions dispatched available via getActions()
            // so we don't need to spy on the dispatcher etc.
            let model = reportsModel.set(appId, tblId, mockReportsResponse.data);
            const expectedActions = [
                {id: storeId, type: types.LOAD_REPORTS, content: null},
                {id: storeId, type: types.LOAD_REPORTS_SUCCESS, content: model}
            ];
            const store = mockReportsStore({});

            return store.dispatch(reportActions.loadReports(appId, tblId)).then(
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

    describe('reports data action error', () => {

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

        it('load reports action', (done) => {

            // the mock store makes the actions dispatched available via getActions()
            // so we don't need to spy on the dispatcher etc.
            const expectedActions = [
                {id: storeId, type: types.LOAD_REPORTS, content: null},
                {id: storeId, type: types.LOAD_REPORTS_FAILED, content: mockReportsResponse}
            ];
            const store = mockReportsStore({});

            return store.dispatch(reportActions.loadReports(appId, tblId)).then(
                () => {
                    expect(store.getActions()).toEqual(expectedActions);
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                });
        });

        it('load reports with invalid input parameters', (done) => {

            // the mock store makes the actions dispatched available via getActions()
            // so we don't need to spy on the dispatcher etc.
            const expectedActions = [
                {id: storeId, type: types.LOAD_REPORTS_FAILED, content: 500}
            ];
            const store = mockReportsStore({});

            return store.dispatch(reportActions.loadReports()).then(
                () => {
                    expect(mockReportService.prototype.getReports.calls.count()).toEqual(0);
                    expect(store.getActions()).toEqual(expectedActions);
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                });
        });
    });

});
