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

    /**
     * Create a deep clone of the state array.  If the new state obj
     * id/context is not found, add to the end of the array.
     * Otherwise, replace the existing entry with its new state.
     *
     * @param obj - data object associated with new state
     * @returns {*}
     */
    function newState(obj) {
        // reducer - no mutations against current state!
        const stateList = _.cloneDeep(state);

        //  does the state already hold an entry for the report context/id
        const index = _.findIndex(stateList, rec => rec.id === obj.id);

        //  append or replace obj into the cloned copy
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
            recId: action.content.recId,
            nextRecordId: action.content.nextRecordId,
            previousRecordId: action.content.previousRecordId
        };
        return newState(obj);
    }
    default:
        // by default, return existing state
        return state;
    }
};

export default record;
