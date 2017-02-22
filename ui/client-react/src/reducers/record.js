import * as types from '../actions/types';
import _ from 'lodash';

/**
 * Manage array of record states
 *
 * @param state - array of states
 * @param action - event type
 * @returns {Array}
 */
const record = (state = [], action) => {

    //  keep array, but until a use case requires support for
    //  multiple records, will only have one record in store.
    const singleRecordStore = true;

    /**
     * Create a deep clone of the state array.  If the new state obj
     * id/context is not found, add to the end of the array.
     * Otherwise, replace the existing entry with its new state.
     *
     * @param obj - data object associated with new state
     * @returns {*}
     */
    function newState(obj) {
        if (singleRecordStore === true) {
            return [obj];
        }

        // reducer - no mutations against current state!
        const stateList = _.cloneDeep(state);

        //  does the state already hold an entry for the record context/id
        const index = _.findIndex(stateList, rec => rec.id === obj.id);
        if (index !== -1) {
            stateList[index] = obj;
        } else {
            stateList.push(obj);
        }
        return stateList;
    }

    //  what record action is being requested
    switch (action.type) {
    case types.OPEN_RECORD: {
        const obj = {
            id: action.id,
            recId: action.content.recId,
            nextRecordId: action.content.nextRecordId,
            previousRecordId: action.content.previousRecordId
        };
        return newState(obj);
    }
    case types.EDIT_RECORD: {
        const obj = {
            id: action.id,
            recId: action.content.recId,
            nextRecordId: action.content.nextRecordId,
            previousRecordId: action.content.previousRecordId
        };
        return newState(obj);
    }
    case types.SAVE_RECORD: {
        const obj = {
            id: action.id,
            appId: action.content.appId,
            tblId: action.content.tblId,
            recId: action.content.recId,
            changes: action.content.changes
        };
        return newState(obj);
    }
    case types.EDIT_RECORD_START: {
        const obj = {
            id: action.id,
            pendEdits: action.content
        };
        return newState(obj);
    }
    case types.EDIT_RECORD_CHANGE: {
        const obj = {
            id: action.id,
            pendEdits: action.content
        };
        return newState(obj);
    }
    case types.EDIT_RECORD_COMMIT: {
        const obj = {
            id: action.id,
            pendEdits: action.content
        };
        return newState(obj);
    }
    case types.EDIT_RECORD_CANCEL: {
        const obj = {
            id: action.id,
            pendEdits: action.content
        };
        return newState(obj);
    }
    default:
        // by default, return existing state
        return state;
    }
};

export default record;
