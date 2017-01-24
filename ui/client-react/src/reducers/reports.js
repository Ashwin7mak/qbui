import * as types from '../actions/types';
import _ from 'lodash';

/**
 * Manage array of states for a list of reports.
 *
 * @param state - array of reportList states
 * @param action - event type
 * @returns {Array}
 */
const reports = (
    state = [], action) => {

    const id = action.id;
    const newState = _.reject(state, report => report.id === id);

    // reducer - no mutations!
    switch (action.type) {
    case types.LOAD_REPORTS: {
        newState.push({
            id,
            loading: true
        });
        return newState;
    }
    case types.LOAD_REPORTS_FAILED: {
        newState.push({
            id,
            loading: false,
            error: true
        });
        return newState;
    }
    case types.LOAD_REPORTS_SUCCESS: {
        newState.push({
            id,
            loading: false,
            error: false,
            appId: action.content.appId,
            tableId: action.content.tblId,
            list: action.content.reportsList
        });
        return newState;
    }
    default:            // return existing state by default in redux
        return state;
    }
};

export default reports;
