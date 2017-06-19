import {__RewireAPI__ as ReportsBuilderActionsRewireAPI} from '../../src/actions/reportBuilderActions';
import * as reportBuilderActions from '../../src/actions/reportBuilderActions';

import * as types from '../../src/actions/types';
import {CONTEXT} from '../../src/actions/context';
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

describe('Report Builder actions', () => {
    it('hideColumn action dispatches types.HIDE_COLUMN with parameters', () => {
        const params = {
            clickedId: 6
        };
        const expectedAction = event(context, types.HIDE_COLUMN, params);
        expect(reportBuilderActions.hideColumn(context, 6)).toEqual(expectedAction);
    });

    it('addColumnFromExistingField action dispatches type.ADD_COLUMN_FROM_EXISTING_FIELD', () => {
        let params = {
            requestedColumn: {
                fieldDef: {
                    id: 7
                },
                isHidden: true,
                isPlaceholder: false
            },
            addBefore: true
        };
        const expectedAction = event(context, types.ADD_COLUMN_FROM_EXISTING_FIELD, params);
        expect(reportBuilderActions.addColumnFromExistingField(context, {fieldDef: {id: 7}, isHidden: true, isPlaceholder: false}, true))
            .toEqual(expectedAction);
    });

    it('insertPlaceholderColumn action dispatches type.INSERT_PLACEHOLDER_COLUMN with open parameter', () => {
        const params = {
            clickedColumnId: 6,
            addBeforeColumn: true
        };
        const expectedAction = event(context, types.INSERT_PLACEHOLDER_COLUMN, params);
        expect(reportBuilderActions.insertPlaceholderColumn(context, 6, true)).toEqual(expectedAction);
    });

    it('should create an action to enter builder mode', () => {
        expect(reportBuilderActions.enterBuilderMode()).toEqual({type: types.ENTER_BUILDER_MODE});
    });

    it('should create an action to exit builder mode', () => {
        expect(reportBuilderActions.exitBuilderMode()).toEqual({type: types.EXIT_BUILDER_MODE});
    });

    it('updateReportRedirectRoute action dispatches type.UPDATE_REPORT_REDIRECT_ROUTE', () => {
        let route = 'localhost';
        expect(reportBuilderActions.updateReportRedirectRoute(route))
            .toEqual({type: types.UPDATE_REPORT_REDIRECT_ROUTE, content: {route}});
    });

    it('moveColumn actions dispatches types.MOVE_COLUMN with params', () => {
        let sourceLabel = 'Column A';
        let targetLabel = 'Column B';
        const expectedAction = event(context, types.MOVE_COLUMN, {sourceLabel, targetLabel});
        expect(reportBuilderActions.moveColumn(context, sourceLabel, targetLabel)).toEqual(expectedAction);
    });

    it('changeReportName action dispatches type.CHANGE_REPORT_NAME', () => {
        const expectedAction = event(context, types.CHANGE_REPORT_NAME, {newName: 'name'});
        expect(reportBuilderActions.changeReportName(context, 'name')).toEqual(expectedAction);
    });
});

describe('Test ReportBuilderActions function success workflow', () => {
    let mockResponseGetFields = {
        data: [
            {id: 10}
        ]
    };

    let mockResponseUpdateReport = {
        data: {
            name: 'sample report',
            fids: [1, 2, 3]
        }
    };

    class mockFieldService {
        getFields() {
            return Promise.resolve(mockResponseGetFields);
        }
    }

    class mockReportService {
        updateReport() {
            return Promise.resolve(mockResponseUpdateReport);
        }
    }

    beforeEach(() => {
        spyOn(mockFieldService.prototype, 'getFields').and.callThrough();
        spyOn(mockReportService.prototype, 'updateReport').and.callThrough();
        ReportsBuilderActionsRewireAPI.__Rewire__('FieldsService', mockFieldService);
        ReportsBuilderActionsRewireAPI.__Rewire__('ReportService', mockReportService);
    });

    afterEach(() => {
        mockFieldService.prototype.getFields.calls.reset();
        ReportsBuilderActionsRewireAPI.__ResetDependency__('FieldsService');
        ReportsBuilderActionsRewireAPI.__ResetDependency__('ReportService');
    });

    it('refreshFieldSelectMenu action dispatches type:REFRESH_FIELD_SELECT_MENU', (done) => {
        const expectedActions = [
            {type: types.REFRESH_FIELD_SELECT_MENU, content: {response: mockResponseGetFields}}
        ];
        const store = mockReportsStore({});

        return store.dispatch(reportBuilderActions.refreshFieldSelectMenu(appId, tblId)).then(
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });

    it('save report', (done) => {
        const expectedAction = [
            {type: types.SET_IS_PENDING_EDIT_TO_FALSE}
        ];
        const store = mockReportsStore({});

        let rptDef = {
            data : {
                name: 'Sample Report',
                fids: [2, 3]
            }
        };

        let route = 'localhost';

        return store.dispatch(reportBuilderActions.saveReport(appId, tblId, rptId, rptDef, route)).then(
            () => {
                expect(mockReportService.prototype.updateReport).toHaveBeenCalled();
                expect(store.getActions()).toEqual(expectedAction);
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            }
        );

    });
});
