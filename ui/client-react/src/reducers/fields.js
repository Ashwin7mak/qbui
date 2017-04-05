import * as types from '../actions/types';
import _ from 'lodash';
import {BUILTIN_FIELD_ID} from '../../../common/src/constants';

//  Return the table fields object for the given appId and tableId
export const tableFieldsObj = (fieldsStore, appId, tblId) => {
    return _.find(fieldsStore, flds => flds.appId === appId && flds.tblId === tblId);
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

    // Return fields in an object structure used by the reporting components
    function getReportObj(tableFields) {
        return {
            fields: {
                data: tableFields || []
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
            error: false,
            getTableReportFields: function() {
                return getReportObj(this.fields);
            }
        });
        return newState;
    }

        case types.ADD_FIELD: {
            // let newStateWithNewField = _.cloneDeep(newState);

            let {newField} = action.content;
            // let lastIndex = newStateWithNewField[0].fields.fields.data.length;
            let lastIndex = newState[0].fields.fields.data.length;

            newState[0].fields.fields.data[lastIndex] = newField;

            return newState;
            // return newStateWithNewField

        }

    case types.LOAD_FIELDS_SUCCESS: {
        newState.push({
            appId: action.appId,
            tblId: action.tblId,
            keyField: getKeyField(action.content),
            fields: getFields(action.content),
            fieldsLoading: false,
            error: false,
            getTableReportFields: function() {
                return getReportObj(this.fields);
            }
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
            error: true,
            getTableReportFields: function() {
                return getReportObj(this.fields);
            }
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
            error: false,
            getTableReportFields: function() {
                return getReportObj(this.fields);
            }
        });
        return newState;
    }
    default:
        return state;
    }

};

export default fieldsStore;
