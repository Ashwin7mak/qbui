import _ from 'lodash';

import * as types from '../actions/types';
import FacetSelections from '../components/facet/facetSelections';

/**
 * Manage map of embedded reports
 *
 * @param {Object} state - map of report states
 * @param {String} action - event type
 * @returns {Array}
 */
const embeddedReport = (state = {}, action) => {
    //  what report action is being requested
    switch (action.type) {
    case types.LOAD_EMBEDDED_REPORT: {
        const obj = {
            id: action.id,
            loading: true,
            appId: action.content.appId,
            tblId: action.content.tblId,
            rptId: action.content.rptId
        };
        const stateList = _.cloneDeep(state);
        stateList[action.id] = obj;
        return stateList;
    }
    case types.LOAD_EMBEDDED_REPORT_FAILED: {
        const obj = {
            id: action.id,
            loading: false,
            error: true,
            errorDetails: action.content
        };
        const stateList = _.cloneDeep(state);
        // remove entry
        stateList[action.id] = obj;
        return stateList;
    }
    case types.LOAD_EMBEDDED_REPORT_SUCCESS: {
        const obj = {
            id: action.id,
            loading: false,
            error: false,
            data: action.content.data,
            //  TODO: needed??..these are on the data property
            appId: action.content.appId,
            tblId: action.content.tblId,
            rptId: action.content.rptId,

            pageOffset: action.content.pageOffset,
            numRows: action.content.numRows,
            searchStringForFiltering: action.content.searchStringForFiltering,
            selections: action.content.selections || new FacetSelections(),
            facetExpression: action.content.facetExpression || {}
        };
        // reducer - no mutations against current state!
        const stateList = _.cloneDeep(state);

        //  append or replace obj into the cloned copy
        stateList[action.id] = obj;

        return stateList;
    }
    case types.UNLOAD_EMBEDDED_REPORT: {
        // reducer - no mutations against current state!
        const stateList = _.cloneDeep(state);
        // remove entry
        delete stateList[action.id];
        return stateList;
    }
    default:
        // by default, return existing state
        return state;
    }
};

export default embeddedReport;
