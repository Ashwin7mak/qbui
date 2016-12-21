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

    case 'LOADING_FORM': {
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
    default:
        // return existing state by default in redux
        return state;
    }
};

export default form;
