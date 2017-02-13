import * as types from '../actions/types';
import _ from 'lodash';
import MoveFieldHelper from '../components/formBuilder/moveFieldHelper';

const forms = (

    state = [], action) => {

    const id = action.id;

    const newState = _.reject(state, form => form.id === id);
    const currentForm = _.find(state, form => form.id === id);

    // reducer - no mutations!
    switch (action.type) {

    case types.LOADING_FORM: {

        newState.push({
            id,
            loading: true,
            errorStatus: null,
            syncLoadedForm: false
        });

        return newState;
    }

    case types.LOAD_FORM_SUCCESS: {

        newState.push({
            id,
            formData: action.formData,
            loading: false,
            errorStatus: null
        });

        return newState;
    }

    case types.LOAD_FORM_ERROR: {

        newState.push({
            id,
            loading: false,
            errorStatus: action.error
        });
        return newState;
    }

    //TODO: MOVE/RENAME TO RECORDS STORE..THIS IS FIRED WHEN SAVING A RECORD
    case types.SAVE_FORM: {

        newState.push({
            ...currentForm,
            id,
            saving: true,
            errorStatus: null
        });

        return newState;
    }

    //TODO: MOVE/RENAME TO RECORDS STORE..THIS IS FIRED WHEN SAVING A RECORD
    case types.SAVE_FORM_SUCCESS: {

        newState.push({
            ...currentForm,
            id,
            saving: false,
            errorStatus: null
        });

        return newState;
    }

    //TODO: MOVE/RENAME TO RECORDS STORE..THIS IS FIRED WHEN SAVING A RECORD
    case types.SAVE_FORM_FAILED: {

        newState.push({
            ...currentForm,
            id,
            saving: false,
            errorStatus: action.error
        });
        return newState;
    }

    case types.SYNC_FORM: {
        newState.push({
            ...currentForm,
            syncLoadedForm: true
        });
        return newState;
    }

    case types.SAVING_FORM: {
        newState.push({
            id,
            saving: true,
            errorStatus: null
        });
        return newState;
    }

    case types.SAVING_FORM_ERROR: {
        newState.push({
            id,
            saving: false,
            errorStatus: action.content
        });
        return newState;
    }

    case types.SAVING_FORM_SUCCESS: {
        newState.push({
            id,
            saving: false,
            formData: action.content
        });
        return newState;
    }

    case types.MOVE_FIELD :
        if (!currentForm) {
            return state;
        }

        let {newTabIndex, newSectionIndex, newOrderIndex, draggedItemProps} = action.content;
        let updatedForm = _.cloneDeep(currentForm);

        updatedForm.formData.formMeta = MoveFieldHelper.moveField(
            updatedForm.formData.formMeta,
            newTabIndex,
            newSectionIndex,
            newOrderIndex,
            draggedItemProps
        );

        return [
            ...newState,
            updatedForm
        ];

    default:
        // return existing state by default in redux
        return state;
    }
};

export default forms;
