import {__RewireAPI__ as FieldsActionsRewireAPI} from '../../src/actions/fieldsActions';
import * as fieldActions from '../../src/actions/fieldsActions';
import * as types from '../../src/actions/types';
import Promise from 'bluebird';

import mockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
const middlewares = [thunk];
const mockReportsStore = mockStore(middlewares);

function event(appId, tblId, type, content) {
    return {
        appId,
        tblId,
        type: type,
        content: content || null
    };
}

describe('Test FieldsActions function success workflow', () => {

    const appId = '1';
    const tblId = '2';
    let mockResponse = {
        data: [{id: 1}]
    };

    class mockFieldService {
        getFields() {
            return Promise.resolve(mockResponse);
        }
    }

    beforeEach(() => {
        spyOn(mockFieldService.prototype, 'getFields').and.callThrough();
        FieldsActionsRewireAPI.__Rewire__('FieldsService', mockFieldService);
    });

    afterEach(() => {
        FieldsActionsRewireAPI.__ResetDependency__('FieldsService');
    });

    it('verify loadFields action', (done) => {
        const expectedActions = [
            event(appId, tblId, types.LOAD_FIELDS),
            event(appId, tblId, types.LOAD_FIELDS_SUCCESS, {fields:mockResponse.data})
        ];
        const store = mockReportsStore({});
        return store.dispatch(fieldActions.loadFields(appId, tblId)).then(
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

describe('Test FieldsActions function failure workflow', () => {

    let errorResponse = {
        response: {
            error: {status:500}
        }
    };
    class mockFieldService {
        getFields() {
            return Promise.reject(errorResponse);
        }
    }

    beforeEach(() => {
        spyOn(mockFieldService.prototype, 'getFields').and.callThrough();
        FieldsActionsRewireAPI.__Rewire__('FieldsService', mockFieldService);
    });
    afterEach(() => {
        FieldsActionsRewireAPI.__ResetDependency__('FieldsService');
    });

    let testCases = [
        {name:'verify missing appId parameter', tblId:'2'},
        {name:'verify missing tblId parameter', appId:'1'},
        {name:'verify missing parameters'},
        {name:'verify getFields reject response', appId:'1', tblId: '2', rejectTest:true}
    ];

    testCases.forEach(testCase => {
        it(testCase.name, (done) => {
            let expectedActions = [];
            if (testCase.rejectTest === true) {
                expectedActions.push(event(testCase.appId, testCase.tblId, types.LOAD_FIELDS));
            }
            expectedActions.push(event(testCase.appId, testCase.tblId, types.LOAD_FIELDS_ERROR, {error:jasmine.any(Object)}));

            const store = mockReportsStore({});
            return store.dispatch(fieldActions.loadFields(testCase.appId, testCase.tblId)).then(
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
});

