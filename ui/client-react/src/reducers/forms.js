import * as types from '../actions/types';
import _ from 'lodash';
import MoveFieldHelper from '../components/formBuilder/moveFieldHelper';

const forms = (

    state = {}, action) => {

    const id = action.id;
    // retrieve currentForm and assign the rest of the form to newState
    let {[id]: currentForm, ...newState} = _.cloneDeep(state);
    let updatedForm = currentForm;

    // TODO: do this smarter, change to markCopiesAsDirty
    function removeCopies(_id) {
        // remove any entries where the entry's formData.recordId matches the passed in id
        return _.omit(newState, ['formData.recordId', _id]);
    }

    // reducer - no mutations!
    switch (action.type) {

    case types.LOADING_FORM: {

        newState[id] = ({
            id,
            loading: true,
            errorStatus: null,
            syncLoadedForm: false
        });

        return newState;
    }

    case types.LOAD_FORM_SUCCESS: {
        /**
         * The data is being modified directly because this a direct response from the sever
         * This is a fix for a bug in EE that does not return either a tableId or an appId
         * */
        action.formData.formMeta.appId = action.formData.formMeta.appId || action.appId;
        action.formData.formMeta.tableId = action.formData.formMeta.tableId || action.tblId;

        newState[id] = ({
            id,
            formData: action.formData,
            loading: false,
            errorStatus: null
        });

        return newState;
    }

    case types.LOAD_FORM_ERROR: {

        newState[id] = ({
            id,
            loading: false,
            errorStatus: action.error
        });
        return newState;
    }

    case types.SYNC_FORM: {
        newState[id] = ({
            ...currentForm,
            syncLoadedForm: true
        });
        return newState;
    }

    case types.SAVE_FORM: {
        //  hide/show modal window and spinner over a form
        newState[id] = ({
            ...currentForm,
            id,
            saving: true,
            errorStatus: null
        });
        return newState;
    }

    case types.SAVE_FORM_COMPLETE: {
        // a form has been updated, remove entries if there are multiple entries for the same record
        newState = removeCopies(_.get(currentForm, 'formData.recordId'));
        //  hide/show modal window and spinner over a form
        newState[id] = ({
            ...currentForm,
            id,
            saving: false,
            errorStatus: null
        });
        console.log(JSON.stringify(newState));
        return newState;
    }

    case types.SAVING_FORM_SUCCESS: {
        // a form has been updated, remove entries if there are multiple entries for the same record
        newState = removeCopies(_.get(currentForm, 'formData.recordId'));
        if (!updatedForm.formData) {
            updatedForm.formData = {};
        }
        updatedForm.formData.formMeta = action.content;
        newState[id] = ({
            ...updatedForm,
            id,
            saving: false
        });
        return newState;
    }

    case types.MOVE_FIELD : {
        if (!currentForm) {
            return state;
        }

        let {newLocation, draggedItemProps} = action.content;

        updatedForm.formData.formMeta = MoveFieldHelper.moveField(
            updatedForm.formData.formMeta,
            newLocation,
            draggedItemProps
        );

        newState[action.id] = updatedForm;
        return newState;
    }

    case types.REMOVE_FIELD : {
        if (!currentForm) {
            return state;
        }

        let {location} = action.content;

        updatedForm.formData.formMeta = MoveFieldHelper.removeField(
            updatedForm.formData.formMeta,
            location
        );

        newState[id] = updatedForm;
        return newState;
    }

    case types.SELECT_FIELD : {

        if (!currentForm || !_.has(action, 'content.location')) {
            return state;
        }

        if (!updatedForm.selectedFields) {
            updatedForm.selectedFields = [];
            updatedForm.previouslySelectedField = [];
        }

        updatedForm.selectedFields[0] = action.content.location;
        updatedForm.previouslySelectedField = undefined;

        newState[id] = updatedForm;
        return newState;
    }

    case types.DESELECT_FIELD : {

        if (!currentForm || !_.has(action, 'content.location')) {
            return state;
        }

        if (!updatedForm.selectedFields || !updatedForm.previouslySelectedField) {
            updatedForm.selectedFields = [];
            updatedForm.previouslySelectedField = [];
        }

        updatedForm.previouslySelectedField[0] = action.content.location;
        updatedForm.selectedFields[0] = undefined;

        newState[id] = updatedForm;
        return newState;
    }

    case types.KEYBOARD_MOVE_FIELD_UP : {
        if (!currentForm) {
            return state;
        }

        let {location} = action.content;

        updatedForm.formData.formMeta = MoveFieldHelper.keyBoardMoveFieldUp(
            updatedForm.formData.formMeta,
            location
        );

        if (!updatedForm.selectedFields) {
            updatedForm.selectedFields = [];
        }

        updatedForm.selectedFields[0] = MoveFieldHelper.updateSelectedFieldLocation(
            location,
            -1
        );

        newState[id] = updatedForm;
        return newState;
    }

    case types.KEYBOARD_MOVE_FIELD_DOWN : {
        if (!currentForm) {
            return state;
        }

        let {location} = action.content;

        updatedForm.formData.formMeta = MoveFieldHelper.keyBoardMoveFieldDown(
            updatedForm.formData.formMeta,
            location
        );

        if (!updatedForm.selectedFields) {
            updatedForm.selectedFields = [];
        }

        updatedForm.selectedFields[0] = MoveFieldHelper.updateSelectedFieldLocation(
            location,
            1
        );

        newState[id] = updatedForm;
        return newState;
    }

    case types.TOGGLE_FORM_BUILDER_CHILDREN_TABINDEX : {
        if (!currentForm) {
            return state;
        }

        let tabIndex = action.content.currentTabIndex === undefined || action.content.currentTabIndex === "-1" ? "0" : "-1";
        let formFocus = false;

        if (action.content.currentTabIndex === undefined) {
            formFocus = false;
        } else if (tabIndex === "-1") {
            formFocus = true;
        }

        if (!updatedForm.formBuilderChildrenTabIndex && !updatedForm.formFocus) {
            updatedForm.formBuilderChildrenTabIndex = [];
            updatedForm.formFocus = [];
        }

        updatedForm.formBuilderChildrenTabIndex[0] = tabIndex;
        updatedForm.formFocus[0] = formFocus;

        newState[id] = updatedForm;
        return newState;
    }

    case types.UNLOAD_FORM : {
        return removeCopies(currentForm.formData.recordId);
    }

    default:
        // return existing state by default in redux
        return state;
    }
};

export default forms;

// Utility function which returns a component's state given it's context. The context is the 'key' in the state map.
export const getFormByContext = (state, context) => _.get(state, `forms.${context}`);
