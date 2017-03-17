import * as types from '../actions/types';
import _ from 'lodash';
import constants from '../../../common/src/constants';

const fields = (state = [], action) => {

    //  new state list without the appId/tblId entry
    const newState = _.reject(state, field => field.appId === action.appId && field.tblId === action.tblId);

    //  return the current state entry for the appId/tblId from the state list
    const currentField = _.find(state, field => field.appId === action.appId && field.tblId === action.tblId);

    function getKeyField() {
        let keyField;
        if (_.has(action.content, 'fields')) {
            keyField = _.find(action.content.fields, field => field.keyField === true);
        }
        return keyField;
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
            keyField: getKeyField(),
            fields: action.content.fields,
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
    default:
        return state;
    }

};

export default fields;
