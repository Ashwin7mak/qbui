import * as types from '../actions/types';
import _ from 'lodash';
import Logger from '../utils/logger';
import {BUILTIN_FIELD_ID} from '../../../common/src/constants';
import {NEW_FIELD_PREFIX} from '../constants/schema';

//  Return the table fields object for the given appId and tableId
export const tableFieldsObj = (state, appId, tblId) => {
    return _.find(state, flds => flds.appId === appId && flds.tblId === tblId);
};

//  Return fields for the given appId/tableId in format expected by the reports components
export const tableFieldsReportDataObj = (state, appId, tblId) => {
    const tableFields = _.find(state, flds => flds.appId === appId && flds.tblId === tblId);
    return {
        fields: {
            data: tableFields ? tableFields.fields : []
        }
    };
};

// Return a specific field from table fields object for a given appId and tableId, else returns null
export const getField = (state, id, appId, tblId) => {
    const fieldsList = _.find(state.fields, fieldList => fieldList.appId === appId && fieldList.tblId === tblId);
    return fieldsList ? _.find(fieldsList.fields, field => field.id === id) : null;
};

export const getFields = (state, appId, tblId) => {
    const fieldsList = _.find(state.fields, fieldList => fieldList.appId === appId && fieldList.tblId === tblId);
    return fieldsList ? fieldsList.fields : [];
};

const fieldsStore = (state = [], action) => {
    //  new state list without the appId/tblId entry
    const newState = _.reject(state, field => field.appId === action.appId && field.tblId === action.tblId);
    let getCurrentState = (appId, tblId) =>  _.find(state, field => field.appId === appId && field.tblId === tblId);

    let logger = new Logger();

    function getKeyField(content) {
        let keyField;
        if (_.has(content, 'fields')) {
            keyField = _.find(content.fields, field => field.id === BUILTIN_FIELD_ID.RECORD_ID);
        }
        return keyField;
    }

    function getFieldsFromContent(content) {
        return content ? content.fields : [];
    }

    switch (action.type) {
    case types.LOAD_FIELDS: {

        newState.push({
            appId: action.appId,
            tblId: action.tblId,
            keyField: getKeyField(),
            fields: [],
            fieldsLoading: true,
            error: false
        });
        return newState;
    }

    case types.ADD_FIELD: {
        // New fields have a string id so we can detect a new vs existing field by checking if the id is a number or string.
        // If a number, it is existing and we don't want to add it again.
        if (Number.isInteger(action.content.field.id)) {
            return state;
        }

        let field = _.cloneDeep(action.content.field);
        // Removes the FormFieldElement key which is not applicable to fields store, only matters on forms.
        delete field.FormFieldElement;

        let {appId, tblId} = action;

        let currentState = getCurrentState(appId, tblId);

        if (!currentState) {
            currentState = {
                appId: appId,
                tblId: tblId,
                fields: [field]
            };
        } else {
            currentState.fields.push(field);
        }

        newState.push(currentState);
        return newState;
    }

    case types.LOAD_FIELDS_SUCCESS: {
        newState.push({
            appId: action.appId,
            tblId: action.tblId,
            keyField: getKeyField(action.content),
            fields: getFieldsFromContent(action.content),
            fieldsLoading: false,
            error: false
        });
        return newState;
    }
    case types.LOAD_FIELDS_ERROR: {
        newState.push({
            appId: action.appId,
            tblId: action.tblId,
            keyField: getKeyField(),
            fields: [],
            fieldsLoading: false,
            error: true
        });
        return newState;
    }
    case types.LOAD_FORM_SUCCESS: {
        // update fields store when loading a form
        newState.push({
            appId: action.appId,
            tblId: action.tblId,
            keyField: getKeyField(action.formData),
            fields: getFieldsFromContent(action.formData),
            fieldsLoading: false,
            error: false
        });
        return newState;
    }

    case types.UPDATE_FIELD : {
        if (action.field) {
            //newState above already pulled out the fieldList we want removed, so we just need to find our fieldList and update it!
            let fieldList = _.find(state, fieldlist => fieldlist.appId === action.appId && fieldlist.tblId === action.tblId);

            if (fieldList) {
                fieldList = _.cloneDeep(fieldList);

                let fieldIndex = _.findIndex(fieldList.fields, field => field.id === action.field.id);
                let {field, propertyName, newValue} = action;

                field[propertyName] = newValue;
                //indexed and unique are linked and needs to be set to the same value
                field.indexed = field.unique;

                fieldList.fields[fieldIndex] = {...field, isPendingEdit: true};
                fieldList.isPendingEdit = true;

                newState.push(fieldList);
                return newState;
            }
        }
        logger.warn(`the list of fields for the appId: ${action.appId}  and tblId: ${action.tblId} do not exist!`);
        return state;
    }
    case types.SET_IS_PENDING_EDIT_TO_FALSE: {
        newState[0].isPendingEdit = false;
        return newState;
    }
    case types.SET_IS_REQD_FOR_RECORD_TITLE: {
        let fieldList = _.find(state, fieldlist => fieldlist.appId === action.appId && fieldlist.tblId === action.tblId);
        fieldList = _.cloneDeep(fieldList);

        let fieldIndex = _.findIndex(fieldList.fields, field => field.id === action.fieldId);
        fieldList.fields[fieldIndex] = {...fieldList.fields[fieldIndex], isRequiredForRecordTitleField: action.state};
        newState.push(fieldList);

        return newState;
    }
    case types.SAVING_FORM: {
        //This is for formBuilder
        if (!newState[0]) {
            newState[0] = {};
        }
        newState[0].isPendingEdit = false;
        return newState;
    }
    case types.UPDATE_FIELD_ID : {
        let fieldList = _.find(state, fieldlist => fieldlist.appId === action.appId && fieldlist.tblId === action.tblId);
        fieldList = _.cloneDeep(fieldList);

        let fieldIndex = _.findIndex(fieldList.fields, field => field.id === action.oldFieldId);
        fieldList.fields[fieldIndex] = {...fieldList.fields[fieldIndex], id: action.newFieldId};
        newState.push(fieldList);

        return newState;
    }
    case types.REMOVE_FIELD : {
        // remove a field from the list only if this is not a saved field on the table schema
        if (action.field && action.field.id && action.field.id.toString().indexOf(NEW_FIELD_PREFIX) !== -1) {
            let fieldList = _.find(state, {appId: action.appId, tblId: action.tblId});
            let fields = _.filter(fieldList.fields, field => field.id !== action.field.id);
            return [...newState, {...fieldList, fields}];
        }
        return state;
    }
    default:
        return state;
    }

};

export default fieldsStore;
