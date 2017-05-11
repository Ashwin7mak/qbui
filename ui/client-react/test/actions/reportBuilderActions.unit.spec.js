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

    it('openFieldSelectMenu action dispatches type.OPEN_FIELD_SELECT_MENU with open parameter', () => {
        const params = {
            clickedColumnId: 6,
            addBeforeColumn: true
        };
        const expectedAction = event(context, types.OPEN_FIELD_SELECT_MENU, params);
        expect(reportBuilderActions.openFieldSelectMenu(context, 6, true)).toEqual(expectedAction);
    });

    it('closeFieldSelectMenu action dispatches type.CLOSE_FIELD_SELECT_MENU with closed parameter', () => {
        const expectedAction = event(context, types.CLOSE_FIELD_SELECT_MENU, {});
        expect(reportBuilderActions.closeFieldSelectMenu(context)).toEqual(expectedAction);
    });

});

describe('Test ReportsActions function success workflow', () => {
    let mockResponseGetFields = {
        data: [
            {id: 10}
        ]
    };

    class mockFieldService {
        getFields() {
            return Promise.resolve(mockResponseGetFields);
        }
    }

    beforeEach(() => {
        spyOn(mockFieldService.prototype, 'getFields').and.callThrough();
        ReportsBuilderActionsRewireAPI.__Rewire__('FieldsService', mockFieldService);
    });

    afterEach(() => {
        ReportsBuilderActionsRewireAPI.__ResetDependency__('FieldsService');
    });

    it('refreshFieldSelectMenu action dispatches type:REFRESH_FIELD_SELECT_MENU', (done) => {
        const expectedActions = [
            event(context, types.REFRESH_FIELD_SELECT_MENU, {response: mockResponseGetFields})
        ];
        const store = mockReportsStore({});

        return store.dispatch(reportBuilderActions.refreshFieldSelectMenu(context, appId, tblId)).then(
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
