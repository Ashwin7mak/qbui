const forms = (
    state = {
        syncLoadedForm: false // set true after save
    }, action) => {

    // reducer - no mutations!
    switch (action.type) {

    case 'LOAD_FORM': {
        return {
            ...state,
            [action.id]: {
                loading: true,
                errorStatus: null
            }
        };
    }
    case 'LOAD_FORM_SUCCESS': {
        return {
            ...state,
            [action.id]: {
                formData: action.formData,
                loading: false,
                errorStatus: null
            }
        };
    }
    case 'LOAD_FORM_FAILED': {
        return {
            ...state,
            [action.id]: {
                loading: false,
                errorStatus: action.error
            },
        };
    }
    case 'SYNC_FORM': {
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
