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
        case types.LOAD_REPORTS: {
            const obj = {id:action.id, loading: true};
            return newState(obj);
        }
        case types.LOAD_REPORTS_FAILED: {
            const obj = {id: action.id, loading: false, error: true};
            return newState(obj);
        }
        case types.LOAD_REPORTS_SUCCESS: {
            const obj = {
                id: action.id,
                loading: false,
                error: false,
                appId: action.content.appId,
                tableId: action.content.tblId,
                list: action.content.reportsList
            };
            return newState(obj);
        }
        default:
            // by default, return existing state
            return state;
    }
};

export default report;
