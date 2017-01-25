import * as types from '../actions/types';
import _ from 'lodash';

/**
 * Manage array of report states
 *
 * @param state - array of states
 * @param action - event type
 * @returns {Array}
 */
const report = (state = [], action) => {

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
        const index = _.findIndex(stateList, report => report.id === obj.id);

        //  append or replace obj into the cloned copy
        if (index !== -1) {
            stateList[index] = obj;
        } else {
            stateList.push(obj);
        }
        return stateList;
    }

    //  what report list action is being requested
    switch (action.type) {
    case types.OPEN_REPORT_RECORD: {
        const obj = {id:action.id};
        return newState(obj);
    }
    case types.EDIT_REPORT_RECORD: {
        const obj = {id:action.id};
        return newState(obj);
    }
    case types.PREVIOUS_REPORT_RECORD: {
        const obj = {id:action.id};
        return newState(obj);
    }
    case types.NEXT_REPORT_RECORD: {
        const obj = {id:action.id};
        return newState(obj);
    }
    default:
        // by default, return existing state
        return state;
    }
};

export default report;
