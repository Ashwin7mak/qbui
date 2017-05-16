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
        appId: ''
    }, action) => {

    //  what report action is being requested
    switch (action.type) {
        case types.LOAD_AUTOMATIONS: {
            //  load a list of automations
            return {
                ...state,
                appId: action.content ? action.content.appId : '',
            };
        }
        case types.LOAD_AUTOMATIONS_FAILED: {
            return {
                ...state,
                list: null,
                error: true,
                errorDetails: action.content
            }
        }
        case types.LOAD_AUTOMATIONS_SUCCESS: {
            return {
                ...state,
                list: action.content.automationsList,
                error: false,
                errorDetails: null
            }
        }
        default:
            // by default, return existing state
            return state;
    }
};

export default automation;
