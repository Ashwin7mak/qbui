import * as automationActions from "../../src/actions/automationActions";
import {__RewireAPI__ as AutomationActionsRewireAPI} from "../../src/actions/automationActions";

import * as types from "../../src/actions/types";
import {CONTEXT} from "../../src/actions/context";
import mockStore from "redux-mock-store";
import thunk from "redux-thunk";
import Promise from "bluebird";
import Logger from '../../src/utils/logger';
import LogLevel from '../../src/utils/logLevels.js';

let appId = 1;
let automationId = "auto1";
let context = CONTEXT.AUTOMATION.GRID;
let automationName = "SendEmailAction";
let logger = new Logger();
logger.logToConsole = true;


// mock the Redux store when testing async action creators
const middlewares = [thunk];
const mockAutomationStore = mockStore(middlewares);

function event(ctx, type, content) {
    return {
        context: ctx,
        type: type,
        content: content || null
    };
}


describe('Test AutomationActions function success workflow', () => {
    let auto1 = {id: 'auto1', name: 'Auto 1', active: true, type: "EMAIL"};

    let mockAutomationsResponse = {
        data: [
            auto1
        ]
    };

    let mockGetAutomationResponse = {
        data: auto1
    };

    let mockSaveAutomationResponse = {
        data: auto1
    };

    let mockTestAutomationResponse = {
        data: [
            {response: true}
        ]
    };

    class mockAutomationService {
        getAutomations() {
            return Promise.resolve(mockAutomationsResponse);
        }
        getAutomation() {
            return Promise.resolve(mockGetAutomationResponse);
        }
        saveAutomation() {
            return Promise.resolve(mockSaveAutomationResponse);
        }
        testAutomation() {
            return Promise.resolve(mockTestAutomationResponse);
        }
        invokeAutomation() {
            return Promise.resolve(mockTestAutomationResponse);
        }
    }

    beforeEach(() => {
        spyOn(mockAutomationService.prototype, 'getAutomations').and.callThrough();
        spyOn(mockAutomationService.prototype, 'getAutomation').and.callThrough();
        spyOn(mockAutomationService.prototype, 'saveAutomation').and.callThrough();
        spyOn(mockAutomationService.prototype, 'testAutomation').and.callThrough();
        AutomationActionsRewireAPI.__Rewire__('AutomationService', mockAutomationService);
    });

    afterEach(() => {
        AutomationActionsRewireAPI.__ResetDependency__('AutomationService');
    });

    it('verify loadAutomations action', (done) => {
        const expectedActions = [
            event(context, types.LOAD_AUTOMATIONS, appId),
            event(context, types.LOAD_AUTOMATIONS_SUCCESS, mockAutomationsResponse.data)
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

    it('verify loadAutomation action', (done) => {
        const expectedActions = [
            event(null, types.LOAD_AUTOMATION, {appId: appId, automationId: automationId}),
            event(null, types.LOAD_AUTOMATION_SUCCESS, mockGetAutomationResponse.data)
        ];

        const store = mockAutomationStore({});

        return store.dispatch(automationActions.loadAutomation(appId, automationId)).then(
            (resp) => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            (error) => {
                if (error) {
                    logger.parseAndLogError(LogLevel.INFO, error, 'automationActions');
                }
                expect(false).toBe(true);
                done();
            });
    });

    it('verify saveAutomation action', (done) => {
        const expectedActions = [
            event(null, types.SAVE_AUTOMATION, {appId: appId, automationId: automationId, automation: auto1}),
            event(null, types.SAVE_AUTOMATION_SUCCESS, mockSaveAutomationResponse.data)
        ];

        const store = mockAutomationStore({});

        return store.dispatch(automationActions.saveAutomation(appId, automationId, auto1)).then(
            (resp) => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            (error) => {
                if (error) {
                    logger.parseAndLogError(LogLevel.INFO, error, 'automationActions');
                }
                expect(false).toBe(true);
                done();
            });
    });

    it('verify testAutomation action', (done) => {
        const expectedActions = [
            event(automationName, appId, types.TEST_AUTOMATION),
            event(automationName, types.TEST_AUTOMATION_SUCCESS, mockTestAutomationResponse.data)
        ];

        const store = mockAutomationStore({});

        return store.dispatch(automationActions.testAutomation(automationName, appId)).then(
            (resp) => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            (error) => {
                if (error) {
                    logger.parseAndLogError(LogLevel.INFO, error, 'automationActions');
                }
                expect(false).toBe(true);
                done();
            });
    });
});

describe('Test AutomationActions function failure workflow', () => {

    let mockAutomationsResponse = {
        response: 'error'
    };

    let mockGetAutomationResponse = {
        response: 'error'
    };

    let mockSaveAutomationResponse = {
        response: 'error'
    };

    let mockTestAutomationResponse = {
        response: 'no content'
    };

    class mockAutomationService {
        getAutomations() {
            return Promise.reject(mockAutomationsResponse);
        }
        getAutomation() {
            return Promise.resolve(mockGetAutomationResponse);
        }
        saveAutomation() {
            return Promise.resolve(mockSaveAutomationResponse);
        }
        testAutomation() {
            return Promise.reject(mockTestAutomationResponse);
        }
    }

    beforeEach(() => {
        spyOn(mockAutomationService.prototype, 'getAutomations').and.callThrough();
        spyOn(mockAutomationService.prototype, 'getAutomation').and.callThrough();
        spyOn(mockAutomationService.prototype, 'saveAutomation').and.callThrough();
        spyOn(mockAutomationService.prototype, 'testAutomation').and.callThrough();
        AutomationActionsRewireAPI.__Rewire__('AutomationService', mockAutomationService);
    });

    afterEach(() => {
        AutomationActionsRewireAPI.__ResetDependency__('AutomationService');
    });

    it('verify loadAutomations action with no context', (done) => {
        const expectedActions = [
            event(null, types.LOAD_AUTOMATIONS_FAILED, 500)
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
            }
        );
    });

    it('verify loadAutomations action with no app', (done) => {
        const expectedActions = [
            event(null, types.LOAD_AUTOMATIONS_FAILED, 500)
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
        const expectedActions = [
            event(context, types.LOAD_AUTOMATIONS, appId),
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

    it('verify loadAutomation action with error response', (done) => {
        const expectedActions = [
            event(null, types.LOAD_AUTOMATION_FAILED, 500)
        ];

        const store = mockAutomationStore({});

        return store.dispatch(automationActions.loadAutomation(appId, null)).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
    });

    it('verify saveAutomation action with error response', (done) => {
        const expectedActions = [
            event(null, types.SAVE_AUTOMATION_FAILED, 500)
        ];

        const store = mockAutomationStore({});

        return store.dispatch(automationActions.saveAutomation(appId, null, null)).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
    });

    it('verify testAutomation action with error response', (done) => {
        const expectedActions = [
        ];

        const store = mockAutomationStore({});

        return store.dispatch(automationActions.testAutomation(null, appId)).then(
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
