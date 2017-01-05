import * as types from '../constants/actions';

const forms = (

    // for now we maintain single element arrays of edit and view forms
    // but we could easily have a stack of each when the UI requires that...

    state = {
        syncLoadedForm: false, // set true after save,
        edit: [],
        view: []
    }, action) => {

    const container = action.container; // "edit" or "view"

    // reducer - no mutations!
    switch (action.type) {

    case types.LOADING_FORM: {

        let newState = {...state};

        // replace either the edit or view forms array with a new single element array  (loading status)

        newState[container] = [
            {
                loading: true,
                errorStatus: null
            }];

        return newState;
    }

    case types.LOAD_FORM_SUCCESS: {

        let newState = {...state};

        // replace either the edit or view forms array with a new single element array (with form data)

        newState[container] = [
            {
                formData: action.formData,
                loading: false,
                errorStatus: null
            }];
        return newState;
    }

    case types.LOAD_FORM_ERROR: {

        let newState = {...state};

        // replace either the edit or view forms array with a new single element array (error status)

        newState[container] = [
            {
                loading: false,
                errorStatus: action.error
            }];
        return newState;
    }

    case types.SAVE_FORM: {

        let newState = {...state};

        newState[container] = [
            {
                saving: true,
                errorStatus: null
            }];

        return newState;
    }

    case types.SAVE_FORM_SUCCESS: {

        let newState = {...state};

        newState[container] = [
            {
                saving: false,
                errorStatus: null
            }];
        newState.syncLoadedForm = true; // let the UI know it may need to sync the read-only view with the changes

        return newState;
    }

    case types.SAVE_FORM_FAILED: {

        let newState = {...state};

        newState[container] = [
            {
                saving: false,
                errorStatus: action.error
            }];
        return newState;
    }

    case types.SYNCING_FORM: {
        return {
            ...state,
            syncLoadedForm: false,
        };
    }

    default:
        // return existing state by default in redux
        return state;
    }
};

export default forms;
