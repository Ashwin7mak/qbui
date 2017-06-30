import * as types from "../actions/types";
import _ from "lodash";


/*
    Methods for accessing particular parts of auomtations of type email.
    There are a number things we need to access that are particular to how we
    set up the email templated automations. These methods assure one place
    to change if the template changes.
*/
export const emailAutomationGetTo = (anAutomation) => anAutomation.inputs.filter((input) => input.name === "toAddress")[0].defaultValue;
export const emailAutomationSetTo = (anAutomation, value) => anAutomation.inputs.filter((input) => input.name === "toAddress")[0].defaultValue = value;

export const emailAutomationGetSubject = (anAutomation) => anAutomation.inputs.filter((input) => input.name === "subject")[0].defaultValue;
export const emailAutomationSetSubject = (anAutomation, value) => anAutomation.inputs.filter((input) => input.name === "subject")[0].defaultValue = value;

export const emailAutomationGetBody = (anAutomation) => anAutomation.inputs.filter((input) => input.name === "body")[0].defaultValue;
export const emailAutomationSetBody = (anAutomation, value) => anAutomation.inputs.filter((input) => input.name === "body")[0].defaultValue = value;

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
    case types.LOAD_AUTOMATION: {
        //  load an automation
        return {
            ...state,
            appId: action.content.appId,
            automationId: action.content.automationId
        };
    }
    case types.LOAD_AUTOMATION_FAILED: {
        return {
            ...state,
            automation: null,
            error: action.content
        };
    }
    case types.LOAD_AUTOMATION_SUCCESS: {
        return {
            ...state,
            automation: action.content,
            error: undefined
        };
    }
    case types.SAVE_AUTOMATION: {
        return {
            ...state,
            appId: action.content.appId,
            automationId: action.content.automationId,
            automation: action.content.automation
        };
    }
    case types.SAVE_AUTOMATION_FAILED: {
        return {
            ...state,
            error: action.content
        };
    }
    case types.SAVE_AUTOMATION_SUCCESS: {
        return {
            ...state,
            automation: action.content,
            error: undefined
        };
    }

    case types.CREATE_AUTOMATION: {
        //let newState = _.cloneDeep(state);
        let subject = {
            defaultValue: null,
            name: "subject",
            type: "TEXT",
        };
        let toAddress = {
            defaultValue:null,
            name:"toAddress",
            type:"TEXT",
        };
        let body = {
            defaultValue:null,
            name:"body",
            type:"TEXT",
        };
        let newStateAutomation = {
            name:'',
            type:"EMAIL",
            inputs: [
                subject,
                toAddress,
                body
            ]
        };
        return {
            ...state,
            automation : newStateAutomation,
            newAutomation : true
        };
    }

    case types.CHANGE_AUTOMATION_NAME: {
        let newState = _.cloneDeep(state);
        newState.automation.name = action.content.newName;
        return newState;
    }
    case types.CHANGE_AUTOMATION_EMAIL_TO: {
        let newState = _.cloneDeep(state);
        emailAutomationSetTo(newState.automation, action.content.newTo);
        return newState;
    }
    case types.CHANGE_AUTOMATION_EMAIL_SUBJECT: {
        let newState = _.cloneDeep(state);
        emailAutomationSetSubject(newState.automation, action.content.newSubject);
        return newState;
    }
    case types.CHANGE_AUTOMATION_EMAIL_BODY: {
        let newState = _.cloneDeep(state);
        emailAutomationSetBody(newState.automation, action.content.newBody);
        return newState;
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

export const getAutomation = (state) => {
    return state.automation.automation;
};

export const getNewAutomation = (state) => {
    return state.automation.newAutomation;
};
