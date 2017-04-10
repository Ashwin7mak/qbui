import * as types from '../actions/types';
import _ from 'lodash';
import {BUILTIN_FIELD_ID} from '../../../common/src/constants';

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
    const fieldsList = _.find(state, fieldList => fieldList.appId === appId && fieldList.tblId === tblId);
    return fieldsList ? _.find(fieldsList.fields, field => field.id === id) : null;
};

const fieldsStore = (state = [], action) => {

    //  new state list without the appId/tblId entry
    const newState = _.reject(state, field => field.appId === action.appId && field.tblId === action.tblId);

    function getKeyField(content) {
        let keyField;
        if (_.has(content, 'fields')) {
            keyField = _.find(content.fields, field => field.id === BUILTIN_FIELD_ID.RECORD_ID);
        }
        return keyField;
    }

    function getFields(content) {
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
    case types.LOAD_FIELDS_SUCCESS: {
        newState.push({
            appId: action.appId,
            tblId: action.tblId,
            keyField: getKeyField(action.content),
            fields: getFields(action.content),
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
            fields: getFields(action.formData),
            fieldsLoading: false,
            error: false
        });
        return newState;
    }
    case types.UPDATE_FIELD : {
        //newState above already pulled out the fieldList we want removed, so we just need to find our fieldList and update it!
        let fieldList = _.find(state, fieldlist => fieldlist.appId === action.appId && fieldlist.tblId === action.tblId);
        let fieldIndex = _.findIndex(fieldList.fields, field => field.id === action.field.id);
        fieldList.fields[fieldIndex] = action.field;
        newState.push(fieldList);
        return newState;
    }
    default:
        return state;
    }

};

export default fieldsStore;
