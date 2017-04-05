import * as types from '../actions/types';
import _ from 'lodash';
import {BUILTIN_FIELD_ID} from '../../../common/src/constants';

const fields = (state = [], action) => {

    //  new state list without the appId/tblId entry
    const newState = _.reject(state, field => field.appId === action.appId && field.tblId === action.tblId);

    function getKeyField(content) {
        let keyField;
        if (_.has(content, 'fields')) {
            keyField = _.find(content.fields, field => field.id === BUILTIN_FIELD_ID.RECORD_ID);
        }
        return keyField;
    }

    //  Return fields in an object structure that matches the
    //  fields object that is returned within a report object.
    function getFields(content) {
        return {
            fields: {
                data: content ? content.fields : []
            }
        };
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
    default:
        return state;
    }
};

export default fields;
