import * as automationActions from "../../src/actions/automationActions";
import {__RewireAPI__ as AutomationActionsRewireAPI} from "../../src/actions/automationActions";

import * as types from "../../src/actions/types";
import {CONTEXT} from "../../src/actions/context";
import automationsModel from "../../src/models/automationsModel";
import mockStore from "redux-mock-store";
import thunk from "redux-thunk";
import Promise from "bluebird";


let appId = 1;
let context = CONTEXT.AUTOMATION.GRID;

// mock the Redux store when testing async action creators
const middlewares = [thunk];
const mockAutomationStore = mockStore(middlewares);

function event(ctx, type, content) {
    let id = ctx;
    return {
        id: id,
        type: type,
        content: content || null
    };
}


describe('Test AutomationActions function success workflow', () => {

    let mockAutomationsResponse = {
        data: [
            {id: 1, name: 'auto1'}
        ]
    };

    class mockAutomationService {
        getAutomations() {
            return Promise.resolve(mockAutomationsResponse);
        }
    }

    beforeEach(() => {
        spyOn(mockAutomationService.prototype, 'getAutomations').and.callThrough();
        AutomationActionsRewireAPI.__Rewire__('AutomationService', mockAutomationService);
    });

    afterEach(() => {
        AutomationActionsRewireAPI.__ResetDependency__('AutomationService');
    });

    it('verify loadAutomations action', (done) => {

        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        let model = automationsModel.set(appId, mockAutomationsResponse.data);
        const expectedActions = [
            event(context, types.LOAD_AUTOMATIONS, {appId}),
            event(context, types.LOAD_AUTOMATIONS_SUCCESS, model)
        ];
        const store = mockAutomationStore({});

        return store.dispatch(automationActions.loadAutomations(context, appId)).then(
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

describe('Test AutomationActions function failure workflow', () => {

    let mockAutomationsResponse = {
        response: 'error'
    };

    class mockAutomationService {
        getAutomations() {
            return Promise.reject(mockAutomationsResponse);
        }
    }

    beforeEach(() => {
        spyOn(mockAutomationService.prototype, 'getAutomations').and.callThrough();
        AutomationActionsRewireAPI.__Rewire__('AutomationService', mockAutomationService);
    });

    afterEach(() => {
        AutomationActionsRewireAPI.__ResetDependency__('AutomationService');
    });

    it('verify loadAutomations action with no context', (done) => {
        let model = automationsModel.set(appId, mockAutomationsResponse.data);
        const expectedActions = [
            {id: null, type: types.LOAD_AUTOMATIONS_FAILED, content: 500}
        ];
        const store = mockAutomationStore({});

        return store.dispatch(automationActions.loadAutomations(null, appId)).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
    });

    it('verify loadAutomations action with no app', (done) => {
        let model = automationsModel.set(appId, mockAutomationsResponse.data);
        const expectedActions = [
            {id: null, type: types.LOAD_AUTOMATIONS_FAILED, content: 500}
        ];
        const store = mockAutomationStore({});

        return store.dispatch(automationActions.loadAutomations(context, null)).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
    });

    it('verify loadAutomations action with error response', (done) => {
        let model = automationsModel.set(appId, mockAutomationsResponse.data);
        const expectedActions = [
            event(context, types.LOAD_AUTOMATIONS, {appId}),
            event(context, types.LOAD_AUTOMATIONS_FAILED, mockAutomationsResponse)
        ];
        const store = mockAutomationStore({});

        return store.dispatch(automationActions.loadAutomations(context, appId)).then(
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
