import _ from 'lodash';
import FacetSelections from '../components/facet/facetSelections';

/**
 * Manage array of report states
 *
 * @param state - array of states
 * @param action - event type
 * @returns {Array}
 */
const embeddedReport = (state = {}, action) => {
    //  what report action is being requested
    switch (action.type) {
    /*case types.LOAD_REPORT: {
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
    }*/
    case 'LOAD_EMBEDDED_REPORT_SUCCESS': {
        const obj = {
            id: action.id,
            loading: false,
            error: false,
            data: action.content,
            //  TODO: needed??..these are on the data property
            appId: action.content.appId,
            tblId: action.content.tblId,
            rptId: action.content.rptId,
            //
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
    default:
        // by default, return existing state
        return state;
    }
};

export default embeddedReport;
