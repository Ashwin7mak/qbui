import * as types from '../actions/types';
import _ from 'lodash';

const appBuilder = (
    //  default states
    state = {
        savingApp: false,
        dialogOpen: false
    },
    action) => {
    // reducer - no mutations!
    switch (action.type) {

    case types.CREATE_APP:
        return {
            ...state,
            savingApp: true
        };

    case types.CREATE_APP_SUCCESS:
        return {
            //  TODO: what if any data to be added to state for the new app
            ...state,
            savingApp: false
        };

    case types.CREATE_APP_FAILED:
        return {
            //  TODO: should the error condition to be added to state or is the promise reject enough
            ...state,
            savingApp: false
        };

    case types.SHOW_APP_CREATION_DIALOG:
        return {
            ...state,
            dialogOpen: true
        };

    case types.HIDE_APP_CREATION_DIALOG:
        return {
            ...state,
            dialogOpen: false
        };

    case types.SET_APP_PROPERTY:
        return {
            ...state,
            [action.property]: action.value
        };
    default:
        return state;
    }
};

export default appBuilder;

export const getIsDialogOpenState = (state) => _.get(state.appBuilder, 'dialogOpen', false);

export const getAppNameValue = (state) => _.get(state.appBuilder, 'name', '');

export const getAppDescriptionValue = (state) => _.get(state.appBuilder, 'description', '');

export const getNewAppInfo = (state) => {
    //TODO: Description will need to be added to the return object, but there is currently no endpoint for it
    let description =  getAppDescriptionValue(state);
    let name = getAppNameValue(state);

    if (name.length > 0) {
        return {
            name: name
        };
    }
    return null;
};
