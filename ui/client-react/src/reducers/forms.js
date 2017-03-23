import * as types from '../actions/types';
import _ from 'lodash';
import MoveFieldHelper from '../components/formBuilder/moveFieldHelper';

const forms = (

    state = [], action) => {

    const id = action.id;

    const newState = _.reject(state, form => form.id === id);
    const currentForm = _.find(state, form => form.id === id);
    let updatedForm;

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
        //  TODO:
        //  because the state object holds both form and record data, make sure the
        //  currentForm object is passed along for the ride.  This will get cleaned
        //  up once form and record data is separated.
        newState.push({
            ...currentForm,
            id,
            saving: true,
            errorStatus: null
        });
        return newState;
    }

    case types.SAVING_FORM_ERROR: {
        //  TODO:
        //  because the state object holds both form and record data, make sure the
        //  currentForm object is passed along for the ride.  This will get cleaned
        //  up once form and record data is separated.
        newState.push({
            ...currentForm,
            id,
            saving: false,
            errorStatus: action.content
        });
        return newState;
    }

    case types.SAVING_FORM_SUCCESS: {
        //  TODO:
        //  because the state object holds both form and record data, make sure the
        //  currentForm object is passed along for the ride.  This will get cleaned
        //  up once form and record data is separated.
        //
        //no changes to state..
        updatedForm = _.cloneDeep(currentForm);
        //  ..for now until the store is refactored..
        if (!updatedForm.formData) {
            updatedForm.formData = {};
        }
        updatedForm.formData.formMeta = action.content;
        newState.push({
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
        updatedForm = _.cloneDeep(currentForm);

        updatedForm.formData.formMeta = MoveFieldHelper.moveField(
            updatedForm.formData.formMeta,
            newLocation,
            draggedItemProps
        );

        return [
            ...newState,
            updatedForm
        ];
    }

    case types.REMOVE_FIELD : {
        if (!currentForm) {
            return state;
        }

        let {location} = action.content;
        updatedForm = _.cloneDeep(currentForm);

        updatedForm.formData.formMeta = MoveFieldHelper.removeField(
            updatedForm.formData.formMeta,
            location
        );

        return [
            ...newState,
            updatedForm
        ];
    }

    case types.SELECT_FIELD : {

        if (!currentForm || !_.has(action, 'content.location')) {
            return state;
        }

        updatedForm = _.cloneDeep(currentForm);

        if (!updatedForm.selectedFields) {
            updatedForm.selectedFields = [];
        }

        updatedForm.selectedFields[0] = action.content.location;

        return [
            ...newState,
            updatedForm
        ];
    }

        case types.DESELECT_FIELD : {

            if (!currentForm || !_.has(action, 'content.location')) {
                return state;
            }

            updatedForm = _.cloneDeep(currentForm);

            if (!updatedForm.selectedFields || !updatedForm.previouslySelectedField) {
                updatedForm.selectedFields = [];
                updatedForm.previouslySelectedField = [];
            }

            updatedForm.previouslySelectedField[0] = action.content.location;
            updatedForm.selectedFields[0] = undefined;

            return [
                ...newState,
                updatedForm
            ];
        }

    case types.KEYBOARD_MOVE_FIELD_UP : {
        if (!currentForm) {
            return state;
        }

        let {location} = action.content;
        updatedForm = _.cloneDeep(currentForm);

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

        return [
            ...newState,
            updatedForm
        ];
    }

    case types.KEYBOARD_MOVE_FIELD_DOWN : {
        if (!currentForm) {
            return state;
        }

        let {location} = action.content;
        updatedForm = _.cloneDeep(currentForm);

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

        return [
            ...newState,
            updatedForm
        ];
    }

    case types.TOGGLE_FORM_BUILDER_CHILDREN_TABINDEX : {
        if (!currentForm) {
            return state;
        }

        let tabIndex = action.content.currentTabIndex === undefined || action.content.currentTabIndex === "-1" ? "0" : "-1";
        updatedForm = _.cloneDeep(currentForm);

        if (!updatedForm.formBuilderChildrenTabIndex) {
            updatedForm.formBuilderChildrenTabIndex = [];
        }

        updatedForm.formBuilderChildrenTabIndex[0] = tabIndex;

        return [
            ...newState,
            updatedForm
        ];
    }

    default:
        // return existing state by default in redux
        return state;
    }
};

export default forms;
