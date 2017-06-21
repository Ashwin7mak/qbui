import * as types from '../actions/types';
import _ from 'lodash';

let cloneState;

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
        cloneState = _.cloneDeep(state);
        return {
            ...cloneState,
            savingApp: true
        };

    case types.CREATE_APP_SUCCESS:
        cloneState = _.cloneDeep(state);
        cloneState.name = '';
        cloneState.description = '';
        cloneState.dialogOpen = false;
        return {
            ...cloneState,
            savingApp: false,
            dialogOpen: false
        };

    case types.CREATE_APP_FAILED:
        cloneState = _.cloneDeep(state);
        return {
            //  TODO: depending on XD design, should the error condition be added to state or is the promise reject enough
            ...cloneState,
            savingApp: false
        };

    case types.SHOW_APP_CREATION_DIALOG:
        cloneState = _.cloneDeep(state);
        return {
            ...cloneState,
            dialogOpen: true
        };

    case types.HIDE_APP_CREATION_DIALOG:
        cloneState = _.cloneDeep(state);
        return {
            ...cloneState,
            dialogOpen: false
        };

    case types.SET_APP_PROPERTY:
        cloneState = _.cloneDeep(state);
        return {
            ...cloneState,
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
