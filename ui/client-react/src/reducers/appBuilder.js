import * as types from '../actions/types';
import _ from 'lodash';

const appBuilder = (
    //  default states
    state = {
        isSavingApp: false,
        isDialogOpen: false
    },
    action) => {
    // reducer - no mutations!
    switch (action.type) {

    case types.CREATE_APP:
        return {
            ...state,
            isSavingApp: true
        };

    case types.CREATE_APP_SUCCESS:
        return {
            ...state,
            isSavingApp: false,
            isDialogOpen: false,
            name: '',
            description: ''
        };

    case types.CREATE_APP_FAILED:
        return {
            //  TODO: depending on XD design, should the error condition be added to state or is the promise reject enough
            ...state,
            isSavingApp: false
        };

    case types.SHOW_APP_CREATION_DIALOG:
        return {
            ...state,
            isDialogOpen: true
        };

    case types.HIDE_APP_CREATION_DIALOG:
        return {
            ...state,
            isDialogOpen: false,
            name: '',
            description: ''
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

export const getIsDialogOpenState = (state) => _.get(state.appBuilder, 'isDialogOpen', false);

export const getAppProperty = (state, property) => _.get(state.appBuilder, property, '');

export const getNewAppInfo = (state) => {
    //TODO: Description will need to be added to the return object, but there is currently no endpoint for it
    let description =  getAppProperty(state, 'description');
    let name = getAppProperty(state, 'name');

    if (name.length > 0) {
        return {
            name
        };
    }
    return null;
};
