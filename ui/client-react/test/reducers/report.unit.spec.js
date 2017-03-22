import reducer, {__RewireAPI__ as ReducerRewireAPI} from '../../src/reducers/report';
import * as types from '../../src/actions/types';
import FacetSelections from '../../src/components/facet/facetSelections';
import _ from 'lodash';
import Diff from 'deep-diff';


/**
 * Unit tests for report reducer
 *
 */
/* eslint no-console:0 */

describe('Report reducer functions', () => {

    let state = undefined;

    let actionObj = {
        id: 1,
        type: null,
        content: null
    };

    let reportActionContent = {
        appId: 1, tblId: 2
    };

    let reportListState = [
        {
            id: 11,
            appId: "abc",
            tblId: "def",
            rptId: "hij",
            loading: false
        }
    ];

    beforeEach(() => {
        state = undefined;
        actionObj.id = 1;
        actionObj.type = null;
        actionObj.content = null;
        jasmine.addMatchers({
            toDeepEqual: () => {
                return {
                    compare: (actual, expected) => {
                        return {
                            pass: _.isEqual(actual, expected),
                            message : `Expected actual: ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)} 
                            but difference is :
                            ${JSON.stringify(Diff.diff(actual, expected))}`
                        };
                    }
                };
            }
        });

    });

    describe('Report reducer initialize', () => {

        it('returns correct initial state empty action', () => {
            let initialState = [];

            let resultState = reducer(undefined, {});
            expect(resultState).toEqual(initialState);
        });

        it('test correct initial state with action obj', () => {
            let resultState = (reducer(state, actionObj));
            expect(Array.isArray(resultState)).toEqual(true);
            expect(resultState.length).toEqual(0);
        });
    });

    describe('Report reducer load', () => {
        let expectedStateSingle = _.cloneDeep(reportListState);
        let actionContentSingle = {
            appId: 1, tblId: 2, rptId:3
        };
        let reportLoadActionSingle = {
            type: types.LOAD_REPORT,
            id: 10,
            content: actionContentSingle
        };
        let newEntrySingle = {id: 10, ...actionContentSingle, loading: true};
        expectedStateSingle.push(newEntrySingle);

        let testCase = {
            reportLoadAction: reportLoadActionSingle,
            actionType : types.LOAD_REPORT,
            message : 'LOAD_REPORT',
            expectedState: expectedStateSingle
        };
        it('returns correct state on ' + testCase.message, () => {

            let newState = reducer(reportListState, testCase.reportLoadAction);
            expect(newState).toDeepEqual(testCase.expectedState);
        });
    });

    describe('Reports reducer load', () => {

        let expectedStateList = _.cloneDeep(reportListState);
        let actionContentList = {
            appId: 1, tblId: 2
        };
        let reportLoadActionList = {
            type: types.LOAD_REPORTS,
            id: 10,
            content: actionContentList
        };
        let newEntryList = {id: 10, ...actionContentList, loading: true};
        expectedStateList.push(newEntryList);

        let testCase = {
            reportLoadAction: reportLoadActionList,
            actionType: types.LOAD_REPORTS,
            message: 'LOAD_REPORTS',
            expectedState: expectedStateList
        };
        it('returns correct state on ' + testCase.message, () => {

            let newState = reducer(reportListState, testCase.reportLoadAction);
            expect(newState).toDeepEqual(testCase.expectedState);
        });
    });

    describe('Report reducer load failed', () => {
        let expectedState = _.cloneDeep(reportListState);

        let testCases = [
            {
                description: "LOAD_REPORT_FAILED",
                actionType: types.LOAD_REPORT_FAILED,
                expectedState
            },
            {
                description: "LOAD_REPORTS_FAILED",
                actionType: types.LOAD_REPORTS_FAILED,
                expectedState
            },
        ];

        testCases.forEach(testCase => {
            it('returns correct state on ' + testCase.description, () => {
                let reportLoadAction = {
                    type: testCase.actionType,
                    id: 10,
                    content: reportActionContent
                };
                let newState = reducer(reportListState, reportLoadAction);
                expect(newState).toEqual(testCase.expectedState);
            });
        });

    });

    describe('Report reducer report loading', () => {
        it('test correct state when loading a report', () => {
            actionObj.type = types.LOAD_REPORTS;
            actionObj.content = reportActionContent;
            state = reducer(state, actionObj);
            expect(Array.isArray(state)).toEqual(true);
            expect(state.length).toEqual(1);
            expect(state[0].loading).toEqual(true);
        });
    });

    describe('Report reducer multiple entries', () => {
        it('test state entry', () => {
            actionObj.type = types.LOAD_REPORTS;
            actionObj.content = reportActionContent;
            state = reducer(state, actionObj);

            expect(state.length).toEqual(1);

            //  call same state with different id
            actionObj.id = 10;
            actionObj.type = types.LOAD_REPORTS;

            state = reducer(state, actionObj);

            expect(state.length).toEqual(2);
            expect(state[0].id).toEqual(1);
            expect(state[0].loading).toEqual(true);
            expect(state[1].id).toEqual(10);
            expect(state[1].loading).toEqual(true);

            //  call state with original id..should get
            //  placed in same offset of the array..
            actionObj.id = 1;
            actionObj.type = types.LOAD_REPORTS_FAILED;

            state = reducer(state, actionObj);

            expect(state.length).toEqual(2);
            expect(state[0].id).toEqual(1);
            expect(state[0].loading).toEqual(false);
            expect(state[0].error).toEqual(true);
            expect(state[1].id).toEqual(10);
            expect(state[1].loading).toEqual(true);
        });
    });

    describe('Report reducer error report loading', () => {
        it('test correct state when loading a report fails', () => {
            actionObj.type = types.LOAD_REPORTS_FAILED;
            state = reducer(state, actionObj);
            expect(Array.isArray(state)).toEqual(true);
            expect(state.length).toEqual(0);
        });
    });

    describe('Report reducer success reports loading', () => {
        it('test correct state when loading reports succeeds', () => {
            // start with a report in loading state
            let targetContext = "LIST_CONTEXT";
            let listOfReports = [1, 2, 43];
            actionObj.type = types.LOAD_REPORTS;
            actionObj.id = targetContext;
            actionObj.content = {appId: 1, tblId: 2};
            state = reducer(state, actionObj);

            // load is successful action
            actionObj.type = types.LOAD_REPORTS_SUCCESS;
            actionObj.id = targetContext;
            actionObj.content = {appId: 1, tblId: 2, reportsList: listOfReports};
            state = reducer(state, actionObj);

            //success on a loading reports actions expectations
            expect(Array.isArray(state)).toEqual(true);
            expect(state.length).toEqual(1);
            expect(state[0].loading).toEqual(false);
            expect(state[0].error).toEqual(false);
            expect(state[0].appId).toEqual(actionObj.content.appId);
            expect(state[0].tblId).toEqual(actionObj.content.tblId);
            expect(state[0].list).toEqual(listOfReports);
        });
    });

    describe('Report reducer success report loading test correct state ', () => {
        let allHaveThisForContent = {appId: 1, tblId: 2};
        let targetContext = "NAVREPORT";
        let targetRpt = 55;
        let data = {rptId: targetRpt, info: "here's the report"};
        let initDefaultLoad = {appId: 1, tblId: 2, rptId: targetRpt};
        let initNoRptLoad = {appId: 1, tblId: 2};

        let loadReport = (content) => {
            // start with a report in loading state
            actionObj.type = types.LOAD_REPORT;
            actionObj.id = targetContext;
            actionObj.content = content;
            state = reducer(state, actionObj);
        };

        let testCases = [{
            description: 'all Params',
            contentIn : {...allHaveThisForContent, id: targetContext, pageOffset:0, numRows:10, searchStringForFiltering:"hello", selectedRows:[1], data},
            expectedState: {error:false, loading:false, rptId: targetRpt, data, selections: new FacetSelections(), facetExpression: {}}
        }, {
            description: 'page params',
            contentIn : {...allHaveThisForContent, id: targetContext, pageOffset:10, numRows:99, searchStringForFiltering:"hello", selectedRows:[1], data},
            expectedState: {error:false, loading:false, rptId: targetRpt, data, selections: new FacetSelections(), facetExpression: {}}
        }, {
            description: 'no search param',
            contentIn : {...allHaveThisForContent, id: targetContext, pageOffset:0, numRows:10, searchStringForFiltering:"", selectedRows:[1], data},
            expectedState: {error:false, loading:false, rptId: targetRpt, data, selections: new FacetSelections(), facetExpression: {}}
        }, {
            description: 'no selected rows param',
            contentIn : {...allHaveThisForContent, id: targetContext, pageOffset:0, numRows:10, searchStringForFiltering:"test", selectedRows:[], data},
            expectedState: {error:false, loading:false, rptId: targetRpt, data, selections: new FacetSelections(), facetExpression: {}}
        }, {
            description: 'no rptId in state',
            initStateContent : initNoRptLoad,
            contentIn : {...allHaveThisForContent, rptId:undefined, id: targetContext, pageOffset:0, numRows:10, searchStringForFiltering:"test", selectedRows:[], data},
            expectedState: {error:false, loading:false, rptId: targetRpt, data, selections: new FacetSelections(), facetExpression: {}}
        },

        ];


        testCases.forEach(testCase => {
            it('when loading report with ' + testCase.description  + ' succeeds', () => {
                // use testcase init state if supplied
                if (testCase.initStateContent) {
                    loadReport(testCase.initStateContent);
                } else  {
                    loadReport(initDefaultLoad);
                }
                console.log("before case state = " + JSON.stringify(state));

                // load is successful action
                actionObj.type = types.LOAD_REPORT_SUCCESS;
                actionObj.content = testCase.contentIn;
                console.log("before case actionObj = " + JSON.stringify(actionObj));
                state = reducer(state, actionObj);
                console.log("after case for " + testCase.description + " state = " + JSON.stringify(state));

                //success on a loading report actions expectations
                expect(Array.isArray(state)).toEqual(true);
                expect(state.length).toEqual(1);
                expect(state[0].loading).toEqual(false);
                expect(state[0].error).toEqual(false);
                expect(state[0].appId).toEqual(actionObj.content.appId);
                expect(state[0].tblId).toEqual(actionObj.content.tblId);
                expect(state[0].rptId).toEqual(targetRpt);
                let expectation  = Object.assign({}, testCase.contentIn, testCase.expectedState);
                expect(state[0]).toDeepEqual(expectation);
            });
        });

    });
});
