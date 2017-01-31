import * as types from '../actions/types';
import _ from 'lodash';
import FacetSelections from '../components/facet/facetSelections';

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
        const index = _.findIndex(stateList, rpt => rpt.id === obj.id);

        //  append or replace obj into the cloned copy
        if (index !== -1) {
            stateList[index] = obj;
        } else {
            stateList.push(obj);
        }
        return stateList;
    }

    //  what report action is being requested
    switch (action.type) {
    case types.LOAD_REPORT:
    case types.LOAD_REPORTS: {
        const obj = {
            id: action.id,
            loading: true,
            appId: action.content.appId,
            tblId: action.content.tblId,
            rptId: action.content.rptId
        };
        return newState(obj);
    }
    case types.LOAD_REPORT_FAILED:
    case types.LOAD_REPORTS_FAILED: {
        const obj = {
            id: action.id,
            loading: false,
            error: true,
            errorDetails: action.content
        };
        return newState(obj);
    }
    case types.LOAD_REPORT_SUCCESS: {
        const obj = {
            id: action.id,
            loading: false,
            error: false,
            data: action.content,
            //  needed??..these are on the data property
            appId: action.content.appId,
            tblId: action.content.tblId,
            rptId: action.content.rptId,
            pageOffset: action.content.pageOffset,
            numRows: action.content.numRows,
            searchStringForFiltering: action.content.searchStringForFiltering,
            selections: action.content.selections || new FacetSelections(),
            facetExpression: action.content.facetExpression || {}
            // end ???
            // bah...lot of other stuff to figure out..
        };
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
