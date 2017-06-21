import * as types from '../actions/types';
import * as tabIndexConstants from '../../../client-react/src/components/formBuilder/tabindexConstants';
import * as constants from '../../../common/src/constants';
import _ from 'lodash';
import MoveFieldHelper from '../components/formBuilder/moveFieldHelper';
import fieldFormats from '../utils/fieldFormats';
import {getFields} from '../reducers/fields';
import Locale from '../../../reuse/client/src/locales/locale';

const forms = (

    state = {}, action) => {
    const {id, formId} = action;
    // retrieve currentForm and assign the rest of the form to newState
    // We use JSON.parse(JSON.stringify()) instead of _.cloneDeep in this case because:
    // a) There was about 0.3 to 0.5 ms performance improvement and we need all the performance we can get for drag and drop
    // b) It is a simple object, so no prototype information will be lost in the conversion.
    // This is not a generally recommended practice. Consider either Object.assign, Object spread {...}, or _.cloneDeep before using this method.
    let {[id || formId]: currentForm, ...newState} = JSON.parse(JSON.stringify(state));

    let updatedForm = currentForm;

    // TODO: do this smarter, change to markCopiesAsDirty
    function removeCopies(_id) {
        // remove any entries where the entry's formData.recordId matches the passed in id
        return _.omit(newState, ['formData.recordId', _id]);
    }
    // reducer - no mutations!
    switch (action.type) {

    case types.UPDATE_FORM_REDIRECT_ROUTE: {
        return {
            ...state,
            redirectRoute: action.redirectRoute
        };
    }


    case types.LOADING_FORM: {

        newState[id] = ({
            id,
            loading: true,
            errorStatus: null,
            syncFormForRecordId: null
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

        //Removes all built in fields for formBuilder
        let allFields = _.differenceBy(action.formData.fields, constants.BUILTIN_FIELD_ID_ARRAY, (field) => {
            if (typeof field === 'number') {
                return field;
            } else {
                return field.id;
            }
        });

        action.formData.fields = allFields;
        //this is needed to only show the delete icon on a field in formBuilder when there are more than one field on the form
        action.formData.formMeta.numberOfFieldsOnForm = action.formData.formMeta.fields.length;

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
            syncFormForRecordId: action.recordId
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

        return newState;
    }

    case types.SAVING_FORM: {
        currentForm = {
            ...currentForm,
            saving: true,
            selectedFields: [],
            isPendingEdit: false
        };

        return {...newState, [id || formId]: currentForm};
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

        if (!updatedForm.selectedFields) {
            updatedForm.selectedFields = [];
            updatedForm.previouslySelectedField = [];
        }

        updatedForm.selectedFields[0] = newLocation;

        updatedForm.isPendingEdit = true;
        newState[action.id] = updatedForm;

        return newState;
    }

    /**
     * If a location is not passed in, a location will be hardcoded, since there is no current implementation
     * that sets the current tabIndex, sectionIndex, and columnIndex for a new field.
     * Default location for a field is always set to the bottom of the form.
     */
    case types.ADD_FIELD : {
        if (!currentForm) {
            return state;
        }

        let {field, newLocation} = _.cloneDeep(action.content);
        const isNewRelationshipField = _.get(field, "datatypeAttributes.type", null) === constants.LINK_TO_RECORD;

        updatedForm = _.cloneDeep(currentForm);
        let columnElementLength = updatedForm.formData.formMeta.tabs[0].sections[0].columns[0] ? updatedForm.formData.formMeta.tabs[0].sections[0].columns[0].elements.length : 0;
        // Remove all keys that are not necessary for forms
        Object.keys(field).forEach(key => {
            if (key !== 'FormFieldElement' && key !== 'id') {
                delete field[key];
            }
        });

        if (!newLocation) {
            let elementIndex = 0;
            if (updatedForm.formData.formMeta.tabs[0].sections[0].columns[0]) {
                elementIndex = updatedForm.formData.formMeta.tabs[0].sections[0].columns[0].elements.length;
            }

            newLocation = {
                tabIndex: 0,
                sectionIndex: 0,
                columnIndex: 0,
                elementIndex: elementIndex
            };
        } else if (newLocation.elementIndex !== columnElementLength) {
            //If a field is selected on the form and the selectedField is not located at the end of the form, then the new field will be added below the selected field
            if (newLocation && !_.isNil(newLocation.elementIndex)) {
                newLocation.elementIndex = newLocation.elementIndex + 1;
            }
        }

        updatedForm.formData.formMeta = MoveFieldHelper.addFieldToForm(
            updatedForm.formData.formMeta,
            newLocation,
            {...field}
        );

        if (!updatedForm.selectedFields) {
            updatedForm.selectedFields = [];
            updatedForm.previouslySelectedField = [];
        }

        updatedForm.selectedFields[0] = newLocation;
        updatedForm.formData.formMeta.numberOfFieldsOnForm = _.has(updatedForm, 'formData.formMeta.tabs[0].sections[0].columns[0]') ? updatedForm.formData.formMeta.tabs[0].sections[0].columns[0].elements.length : 0;

        updatedForm.isPendingEdit = true;
        newState[action.id] = updatedForm;

        return newState;
    }

    case types.REMOVE_FIELD : {
        if (!currentForm) {
            return state;
        }

        let {location, field} = action;
        let relatedRelationship = false;
        let formMetaCopy = _.cloneDeep(updatedForm.formData.formMeta);

        if (field.tableId && Array.isArray(formMetaCopy.relationships) && formMetaCopy.relationships.length > 0) {
            relatedRelationship = _.find(formMetaCopy.relationships, (rel) => rel.detailTableId === field.tableId  && rel.detailFieldId === field.id);
        }

        if (relatedRelationship) {
            if (formMetaCopy.fieldsToDelete) {
                formMetaCopy.fieldsToDelete.push(field.id);
            } else {
                formMetaCopy.fieldsToDelete = [field.id];
            }
        }

        if (updatedForm.formData.formMeta.numberOfFieldsOnForm > 1) {
            updatedForm.formData.formMeta = MoveFieldHelper.removeField(
                formMetaCopy,
                location
            );
        }

        updatedForm.formData.formMeta.numberOfFieldsOnForm = _.has(updatedForm, 'formData.formMeta.tabs[0].sections[0].columns[0]') ? updatedForm.formData.formMeta.tabs[0].sections[0].columns[0].elements.length : 0;
        updatedForm.isPendingEdit = true;
        newState[id] = updatedForm;
        return newState;
    }

    case types.UPDATE_FIELD_ID : {
        if (!currentForm) {
            return state;
        }

        updatedForm = _.cloneDeep(currentForm);

        let foundFieldElement;
        updatedForm.formData.formMeta.tabs.some(tab => {
            return tab.sections.some(section => {
                return section.columns.some(column => {
                    return column.elements.some(currentElement => {
                        if (currentElement.FormFieldElement) {
                            foundFieldElement = currentElement.FormFieldElement;
                            return currentElement.FormFieldElement.fieldId === action.oldFieldId;
                        }

                        return false;
                    });
                });
            });
        });

        if (foundFieldElement) {
            foundFieldElement.fieldId = action.newFieldId;
        }

        return {
            ...newState,
            [id || formId]: updatedForm
        };
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

    case types.IS_DRAGGING : {
        if (!currentForm) {
            return state;
        }

        if (!updatedForm.isDragging) {
            updatedForm.isDragging = [];
        }

        updatedForm.isDragging = true;

        newState[id] = updatedForm;
        return newState;
    }

    case types.SET_IS_PENDING_EDIT_TO_FALSE : {
        if (!currentForm) {
            return state;
        }

        updatedForm.isPendingEdit = false;

        newState[id] = updatedForm;
        return newState;
    }

    case types.END_DRAG : {
        if (!currentForm) {
            return state;
        }

        if (!updatedForm.isDragging) {
            updatedForm.isDragging = [];
        }

        updatedForm.isDragging = false;

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

        updatedForm.isPendingEdit = true;
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

        updatedForm.isPendingEdit = true;
        newState[id] = updatedForm;
        return newState;
    }

    case types.TOGGLE_FORM_BUILDER_CHILDREN_TABINDEX : {
        if (!currentForm) {
            return state;
        }

        let formTabIndex = action.content.currentTabIndex === undefined || action.content.currentTabIndex === "-1" ? tabIndexConstants.FORM_TAB_INDEX : "-1";
        let formFocus = false;

        if (action.content.currentTabIndex === undefined) {
            formFocus = false;
        } else if (formTabIndex === "-1") {
            formFocus = true;
        }

        if (!updatedForm.formBuilderChildrenTabIndex && !updatedForm.formFocus) {
            updatedForm.formBuilderChildrenTabIndex = [];
            updatedForm.toolPaletteChildrenTabIndex = [];
            updatedForm.formFocus = [];
            updatedForm.toolPaletteFocus = [];
        }
        //In order to maintain proper tabbing and focus, everything is updated accordingly
        updatedForm.formBuilderChildrenTabIndex[0] = formTabIndex;
        updatedForm.toolPaletteChildrenTabIndex[0] = "-1";
        updatedForm.formFocus[0] = formFocus;
        updatedForm.toolPaletteFocus[0] = false;

        newState[id] = updatedForm;
        return newState;
    }

    case types.TOGGLE_TOOL_PALETTE_BUILDER_CHILDREN_TABINDEX : {
        if (!currentForm) {
            return state;
        }

        let toolPaletteFocus = false;
        let toolPaletteTabIndex = action.content.currentTabIndex === undefined || action.content.currentTabIndex === "-1" ? tabIndexConstants.TOOL_PALETTE_TABINDEX : "-1";

        if (action.content.currentTabIndex === undefined) {
            toolPaletteFocus = false;
        } else if (toolPaletteTabIndex === "-1") {
            toolPaletteFocus = true;
        }

        if (!updatedForm.formBuilderChildrenTabIndex && !updatedForm.toolPaletteChildrenTabIndex && !updatedForm.formFocus) {
            updatedForm.toolPaletteChildrenTabIndex = [];
            updatedForm.formBuilderChildrenTabIndex = [];
            updatedForm.formFocus = [];
            updatedForm.toolPaletteFocus = [];
        }
        //In order to maintain proper tabbing and focus, everything is updated accordingly
        updatedForm.toolPaletteChildrenTabIndex[0] = toolPaletteTabIndex;
        updatedForm.formBuilderChildrenTabIndex[0] = "-1";
        updatedForm.formFocus[0] = false;
        updatedForm.toolPaletteFocus[0] = toolPaletteFocus;

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

export const getSelectedFormElement = (state, id) => {
    const currentForm = state.forms[id];

    if (!currentForm || !currentForm.selectedFields || !currentForm.selectedFields[0]) {
        return null;
    }

    const {tabIndex, sectionIndex, columnIndex, elementIndex} = currentForm.selectedFields[0];
    return _.get(currentForm, `formData.formMeta.tabs[${tabIndex}].sections[${sectionIndex}].columns[${columnIndex}].elements[${elementIndex}]`);
};

/***
 * retrieve all existing fields that are not on a form
 * @param state
 * @param id
 * @param appId
 * @param tblId
 * @returns {Array}
 */
export const getExistingFields = (state, id, appId, tblId) => {
    const currentForm = state.forms[id];

    // If the form hasn't loaded yet (doesn't have meta data or list of fields),
    // don't try to calculate which fields are on the form.
    // All existing fields show up in the list if the form is not loaded without this check.
    if (!_.has(currentForm, 'formData.formMeta.fields')) {
        return null;
    }

    let fields = getFields(state, appId, tblId).reduce((formFields, field) => {
        // Skip any built in fields
        if (_.includes(constants.BUILTIN_FIELD_ID_ARRAY, field.id)) {
            return formFields;
        }

        // Skip any new fields
        if (_.isString(field.id) && field.id.indexOf('new') >= 0) {
            return formFields;
        }

        // Skip fields that are already on the form
        if (_.includes(currentForm.formData.formMeta.fields, field.id)) {
            return formFields;
        }

        // Skip fields that are marked for deletion from schema
        if (_.includes(_.get(currentForm, 'formData.formMeta.fieldsToDelete', []), field.id)) {
            return formFields;
        }

        // Otherwise, create a form friendly version of the field and append it to the list of fields in the  existing fields menu.
        return [
            ...formFields,
            {
                containingElement: {id, FormFieldElement: {positionSameRow: false, ...field}},
                location: {tabIndex: 0, sectionIndex: 0, columnIndex: 0, elementIndex: 0},
                key: `existingField_${field.id}`, // Key for react to use to identify it in the array
                type: fieldFormats.getFormatType(field),
                relatedField: field,
                title: field.name,
                tooltipText: Locale.getMessage('builder.existingFieldsToolTip', {fieldName: field.name})
            }
        ];
    }, []);

    return _.sortBy(fields, (field) => field.title);
};

/***
 * retrieve all parent-child relationships where child is the current form's table
 * @param state
 * @param id
 * @returns {Array}
 */
export const getParentRelationshipsForSelectedFormElement = (state, id) => {
    const currentForm = _.has(state, 'forms') ? state.forms[id] : null;
    const formMeta = currentForm !== null ? _.get(currentForm, 'formData.formMeta', {}) : {};
    const relationships = !_.isEmpty(formMeta) && _.get(formMeta, 'relationships') ? formMeta.relationships : [];

    const tableId = formMeta.tableId;
    return _.filter(relationships, (relationship) => {
        return (relationship.detailTableId === tableId);
    });
};

export default forms;

// Utility function which returns a component's state given it's context. The context is the 'key' in the state map.
export const getFormByContext = (state, context) => _.get(state, `forms.${context}`);

export const getFormRedirectRoute = (state) => _.get(state, 'forms.redirectRoute');

