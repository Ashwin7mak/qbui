const form = (
    state = {
        formData: {},
        saving: false,
        loading: false,
        errorStatus: null,
        syncLoadedForm: false
    }, action) => {
    // reducer - no mutations!
    switch (action.type) {

    case 'LOAD_FORM': {
        return {
            formData: {},
            loading: true
        };
    }
    case 'LOAD_FORM_SUCCESS': {
        return {
            formData: action.formData,
            loading: false
        };
    }
    case 'LOAD_FORM_FAILED': {
        return {
            formData: {},
            errorStatus: action.error,
            loading: false
        };
    }
    case 'SAVE_FORM': {
        return {
            saving: true
        };
    }
    case 'SAVE_FORM_SUCCESS': {
        return {
            saving: false,
            syncLoadedForm: true
        };
    }
    case 'SAVE_FORM_FAILED': {
        return {
            errorStatus: action.error,
            saving: false
        };
    }
    case 'SYNC_FORM': {
        return {
            syncLoadedForm: false
        };
    }
    default:
        // return existing state by default in redux
        return state;
    }
};

export default form;
