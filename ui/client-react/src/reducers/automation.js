import * as types from "../actions/types";
import _ from "lodash";

/**
 * Manage automation states
 *
 * @param state - automation state
 * @param action - event type
 * @returns {Array}
 */
const automation = (
    state = {
        // default
        appId: null,
        list: null,
        error: undefined
    }, action) => {

    //  what report action is being requested
    switch (action.type) {
    case types.LOAD_AUTOMATIONS: {
        //  load a list of automations
        return {
            ...state,
            appId: action.content,
        };
    }
    case types.LOAD_AUTOMATIONS_FAILED: {
        return {
            ...state,
            list: null,
            error: action.content
        };
    }
    case types.LOAD_AUTOMATIONS_SUCCESS: {
        return {
            ...state,
            list: action.content,
            error: undefined
        };
    }
    case types.TEST_AUTOMATION: {
        return {
            ...state,
            appId: action.appId,
            automationName: action.automationName,
            payload: action.payload
        };
    }
    case types.TEST_AUTOMATION_SUCCESS: {
        return {
            ...state,
            error: undefined
        };
    }
    case types.TEST_AUTOMATION_FAILED: {
        return {
            ...state,
            error: action.content
        };
    }
    default:
        // by default, return existing state
        return state;
    }
};

export default automation;

export const getAutomationList = (state) => {
    return state.automation.list;
};

export const testAutomation = (state) => {
    return state.automation.list;
};
