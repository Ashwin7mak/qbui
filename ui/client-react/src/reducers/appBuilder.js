import * as types from '../actions/types';

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
    default:
        return state;
    }
};
export default appBuilder;
