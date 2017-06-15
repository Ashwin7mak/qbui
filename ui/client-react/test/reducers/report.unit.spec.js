import reducer, {__RewireAPI__ as ReducerRewireAPI} from '../../src/reducers/report';
import * as types from '../../src/actions/types';
import FacetSelections from '../../src/components/facet/facetSelections';
import _ from 'lodash';
import {UNSAVED_RECORD_ID} from '../../src/constants/schema';
import {NEW_RECORD_VALUE} from '../../src/constants/urlConstants';
import Diff from 'deep-diff';


/**
 * Unit tests for report reducer
 *
 */
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
    let mockReportModelHelper = {
        addReportRecord: () => {},
        updateReportRecord: () => {},
        deleteRecordFromReport: () => {},
        getReportColumns: () => {},
        isBlankRecInReport: () => {}
    };

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
        spyOn(mockReportModelHelper, 'addReportRecord');
        spyOn(mockReportModelHelper, 'updateReportRecord');
        spyOn(mockReportModelHelper, 'deleteRecordFromReport');
        spyOn(mockReportModelHelper, 'getReportColumns');
        ReducerRewireAPI.__Rewire__('ReportModelHelper', mockReportModelHelper);


    });
    afterEach(() => {
        ReducerRewireAPI.__ResetDependency__('ReportModelHelper');
        mockReportModelHelper.addReportRecord.calls.reset();
        mockReportModelHelper.updateReportRecord.calls.reset();
        mockReportModelHelper.deleteRecordFromReport.calls.reset();
        mockReportModelHelper.getReportColumns.calls.reset();
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

    describe('Report reducer LOAD_REPORT', () => {
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

    describe('Reports reducer LOAD_REPORTS', () => {

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

    describe('Reports reducer LOAD_REPORTS load reports app/table not specified', () => {

        let reportLoadActionList = {
            type: types.LOAD_REPORTS,
            id: 11,
        };
        let expectedStateList = [{id:11, appId:"", tblId:"", loading:true}];

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

    describe('Report reducer LOAD_REPORT_FAILED load failed', () => {
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

    describe('Report reducer LOAD_REPORTS report loading', () => {
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

    describe('Report reducer LOAD_REPORTS_FAILED error report loading', () => {
        it('test correct state when loading a report fails', () => {
            actionObj.type = types.LOAD_REPORTS_FAILED;
            state = reducer(state, actionObj);
            expect(Array.isArray(state)).toEqual(true);
            expect(state.length).toEqual(0);
        });
    });

    describe('Report reducer success LOAD_REPORTS reports loading', () => {
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
        it('test correct state when LOAD_REPORTS loading reports succeeds with no matching id', () => {
            // start with a report in loading state
            let targetContext = "LIST_CONTEXT";
            let listOfReports = [1, 2, 43];
            actionObj.type = types.LOAD_REPORTS;
            actionObj.id = targetContext;
            actionObj.content = {appId: 1, tblId: 2};
            state = reducer(state, actionObj);
            let unalteredState = _.clone(state);

            // load is successful action
            actionObj.type = types.LOAD_REPORTS_SUCCESS;
            actionObj.id = targetContext + "NO_A_MATCH";
            actionObj.content = {appId: 1, tblId: 2, reportsList: listOfReports};
            state = reducer(state, actionObj);

            //success on a loading reports actions expectations
            expect(Array.isArray(state)).toEqual(true);
            expect(state.length).toEqual(1);
            expect(state[0].loading).toEqual(true);
            expect(state[0].id).toEqual(targetContext);
            expect(state[0].error).toBeUndefined();
            expect(state[0].appId).toEqual(actionObj.content.appId);
            expect(state[0].tblId).toEqual(actionObj.content.tblId);
            expect(state[0].list).toBeUndefined();
        });
    });

    describe('Report reducer success LOAD_REPORT report loading test correct state ', () => {
        let allHaveThisForContent = {appId: 1, tblId: 2};
        let targetContext = "NAVREPORT";
        let targetRpt = 55;
        let data = {rptId: targetRpt, info: "here's the report"};
        let initDefaultLoad = {appId: 1, tblId: 2, rptId: targetRpt};
        let initNoRptLoad = {appId: 1, tblId: 2};

        let loadReport = (content) => {
            if (content !== null) {
                // start with a report in loading state
                actionObj.type = types.LOAD_REPORT;
                actionObj.id = targetContext;
                actionObj.content = content;
                state = reducer(state, actionObj);
            }
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
            description: 'no matching id',
            initStateContent : null,
            contentIn : {...allHaveThisForContent, id: targetContext, pageOffset:0, numRows:10, searchStringForFiltering:"test", selectedRows:[], data},
            expectedState: undefined
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
                if (_.has(testCase, 'initStateContent')) {
                    loadReport(testCase.initStateContent);
                } else  {
                    loadReport(initDefaultLoad);
                }

                // load is successful action
                actionObj.type = types.LOAD_REPORT_SUCCESS;
                actionObj.content = testCase.contentIn;
                state = reducer(state, actionObj);

                //success on a loading report actions expectations
                expect(Array.isArray(state)).toEqual(true);
                if (testCase.expectedState) {
                    expect(state.length).toEqual(1);
                    expect(state[0].loading).toEqual(false);
                    expect(state[0].error).toEqual(false);
                    expect(state[0].appId).toEqual(actionObj.content.appId);
                    expect(state[0].tblId).toEqual(actionObj.content.tblId);
                    expect(state[0].rptId).toEqual(targetRpt);
                    let expectation = Object.assign({}, testCase.contentIn, testCase.expectedState);
                    expect(state[0]).toDeepEqual(expectation);
                }
            });
        });
    });

    describe('Report reducer SELECT_REPORT_RECORDS test correct state', () => {
        let contextId = "TEST_SELECT";
        it('when no matches', () => {
            let testState = [];
            actionObj.type = types.SELECT_REPORT_RECORDS;
            actionObj.id = contextId;
            testState = reducer(testState, actionObj);
            expect(Array.isArray(testState)).toEqual(true);
            expect(testState.length).toEqual(0);
        });
        it('when report matches', () => {
            let testState = [{id:contextId}];
            actionObj.type = types.SELECT_REPORT_RECORDS;
            actionObj.id = contextId;
            actionObj.content = {selections : [1, 2, 3]};
            testState = reducer(testState, actionObj);
            expect(Array.isArray(testState)).toEqual(true);
            expect(testState.length).toEqual(1);
        });

    });

    describe('Report reducer SAVE_RECORD_SUCCESS test correct state for update', () => {
        let contextId = "SAVE_RECORD_SUCCESS";
        let reportContentAdd = {report : {
            context: contextId,
            recId: 2,
            record: [4, 5, 6],
            newRecId :55,
            afterRecId: 6,
            info: 'report stuff'
        }};
        let reportContent = {report : {
            context: contextId,
            recId: 2,
            record: [4, 5, 6],
            afterRecId: 6,
            info: 'report stuff'
        }};

        beforeEach(() => {
            spyOn(mockReportModelHelper, 'isBlankRecInReport');
        });

        afterEach(() => {
            mockReportModelHelper.isBlankRecInReport.calls.reset();
            mockReportModelHelper.updateReportRecord.calls.reset();
            mockReportModelHelper.addReportRecord.calls.reset();
        });

        let testCases = [
            {
                description: 'when report matches update record',
                initialState: [{id:contextId}],
                content : reportContent,
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(1);
                    expect(testState[0].loading).toEqual(false);
                    expect(testState[0].error).toEqual(false);
                    expect(mockReportModelHelper.isBlankRecInReport).not.toHaveBeenCalled();
                    expect(mockReportModelHelper.addReportRecord).not.toHaveBeenCalled();
                    expect(mockReportModelHelper.updateReportRecord).toHaveBeenCalled();
                }
            },
            {
                description: 'when report matches but no record',
                initialState: [{id:contextId}],
                content : {report : {
                    context: contextId,
                    recId: 2,
                    afterRecId: 6,
                    info: 'report stuff'
                }},
                expects : (testCase) => {
                    expect(Array.isArray(testCase)).toEqual(true);
                    expect(testCase.length).toEqual(1);
                    expect(testCase[0].loading).toEqual(false);
                    expect(testCase[0].error).toEqual(false);
                    expect(mockReportModelHelper.isBlankRecInReport).not.toHaveBeenCalled();
                    expect(mockReportModelHelper.addReportRecord).not.toHaveBeenCalled();
                    expect(mockReportModelHelper.updateReportRecord).toHaveBeenCalled();
                }
            },
            {
                description: 'when no matches in current state',
                initialState: [],
                content:  {report:{context:{}}},
                expects: (testCase) => {
                    expect(Array.isArray(testCase)).toEqual(true);
                    expect(testCase.length).toEqual(0);
                    expect(mockReportModelHelper.addReportRecord).not.toHaveBeenCalled();
                    expect(mockReportModelHelper.updateReportRecord).not.toHaveBeenCalled();
                }
            },
            {
                description: 'when no content',
                initialState: [],
                expects: (testCase) => {
                    expect(Array.isArray(testCase)).toEqual(true);
                    expect(testCase.length).toEqual(0);
                    expect(mockReportModelHelper.addReportRecord).not.toHaveBeenCalled();
                    expect(mockReportModelHelper.updateReportRecord).not.toHaveBeenCalled();
                }
            }
        ];
        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let testState = testCase.initialState;
                actionObj.type = types.SAVE_RECORD_SUCCESS;
                actionObj.id = contextId;
                if (testCase.content) {
                    actionObj.content = testCase.content;
                }
                testState = reducer(testState, actionObj);

                testCase.expects(testState);
            });
        });

    });

    describe('Report reducer SAVE_RECORD_SUCCESS test correct state for add', () => {
        let contextId = "SAVE_RECORD_SUCCESS";
        let reportContentAdd = {report : {
            context: contextId,
            recId: 2,
            record: [4, 5, 6],
            newRecId :55,
            afterRecId: 6,
            info: 'report stuff'
        }};
        let reportContent = {report : {
            context: contextId,
            recId: 2,
            record: [4, 5, 6],
            afterRecId: 6,
            info: 'report stuff'
        }};

        afterEach(() => {
            mockReportModelHelper.isBlankRecInReport.calls.reset();
            mockReportModelHelper.deleteRecordFromReport.calls.reset();
            mockReportModelHelper.updateReportRecord.calls.reset();
            mockReportModelHelper.addReportRecord.calls.reset();
        });

        let testCases = [
            {
                initialState:  [{id:contextId}],
                description: 'when report matches add record',
                content : reportContentAdd,
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(1);
                    expect(testState[0].loading).toEqual(false);
                    expect(testState[0].error).toEqual(false);
                    expect(mockReportModelHelper.isBlankRecInReport).toHaveBeenCalled();
                    expect(mockReportModelHelper.addReportRecord).toHaveBeenCalled();
                    expect(mockReportModelHelper.updateReportRecord).not.toHaveBeenCalled();
                    expect(mockReportModelHelper.deleteRecordFromReport).not.toHaveBeenCalled();
                },
                blankRec: false
            },
            {
                initialState:  [{id:contextId}],
                description: 'when report matches add record',
                content : reportContentAdd,
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(1);
                    expect(testState[0].loading).toEqual(false);
                    expect(testState[0].error).toEqual(false);
                    expect(mockReportModelHelper.isBlankRecInReport).toHaveBeenCalled();
                    expect(mockReportModelHelper.addReportRecord).toHaveBeenCalled();
                    expect(mockReportModelHelper.updateReportRecord).not.toHaveBeenCalled();
                    expect(mockReportModelHelper.deleteRecordFromReport).toHaveBeenCalled();
                },
                blankRec: true
            }
        ];
        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let testState = testCase.initialState;
                actionObj.type = types.SAVE_RECORD_SUCCESS;
                actionObj.id = contextId;
                if (testCase.content) {
                    actionObj.content = testCase.content;
                }
                spyOn(mockReportModelHelper, 'isBlankRecInReport').and.returnValue(testCase.blankRec);
                testState = reducer(testState, actionObj);
                testCase.expects(testState);
            });
        });

    });

    describe('Report reducer REMOVE_REPORT_RECORDS test correct state', () => {
        let contextId = "REMOVE_REPORT_RECORDS";
        let anotherContextId = "OTHER_REMOVE_REPORT_RECORDS";
        let initialState = [
            {id:contextId, data:{}, appId: 1, tblId: 2, selectedRows:[1, 3, 4]},
            {id:anotherContextId, data:{}, appId: 1}
        ];
        let reportContentDelete = {
            appId : 1,
            tblId : 2,
            recIds: [1, 2, 3]
        };

        let testCases = [
            {
                initialState,
                description: 'when report has delete record',
                content : reportContentDelete,
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(2);
                    expect(mockReportModelHelper.deleteRecordFromReport).toHaveBeenCalled();
                    expect(testState[0].selectedRows).toEqual([4]);
                }
            },
            {
                description: 'when no content',
                initialState: [],
                expects: (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(0);
                    expect(testState).toEqual([]);
                }
            },
            {
                description: 'when no appId',
                initialState: [],
                content: _.pick(reportContentDelete, ['tblId', 'recIds']),
                expects: (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(0);
                    expect(testState).toEqual([]);
                }
            },
            {
                description: 'when no tblId',
                initialState: [],
                content: _.pick(reportContentDelete, ['appId', 'recIds']),
                expects: (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(0);
                    expect(testState).toEqual([]);
                }
            },
            {
                description: 'when not array rptIds',
                initialState: initialState,
                content: Object.assign({}, _.pick(reportContentDelete, ['appId', 'tblId']), {recIds: 'not array'}),
                expects: (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(2);
                    expect(testState).toEqual(initialState);
                }
            },
            {
                description: 'when no state',
                initialState: [],
                content: reportContentDelete,
                expects: (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(0);
                    expect(testState).toEqual([]);
                }
            }
        ];
        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let testState = testCase.initialState;
                actionObj.type = types.REMOVE_REPORT_RECORDS;
                if (testCase.content) {
                    actionObj.content = testCase.content;
                }

                testState = reducer(testState, actionObj);

                testCase.expects(testState);
            });
        });

    });

    describe('Report reducer ADD_BLANK_REPORT_RECORD test correct state', () => {
        let contextId = "ADD_BLANK_REPORT_RECORD";
        let reportContentAddBlank = {
            afterRecId: 6
        };
        let testCases = [
            {
                description: 'when report matches add record with editingIndex',
                initialState: [{id:contextId, editingIndex:44}],
                content : reportContentAddBlank,
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(1);
                    expect(testState[0].editingIndex).toBeUndefined();
                    expect(testState[0].editingId).toBeUndefined();
                    expect(mockReportModelHelper.addReportRecord).toHaveBeenCalled();
                }
            },
            {
                description: 'when report matches add record with editingId',
                initialState: [{id:contextId, editingId:44}],
                content : reportContentAddBlank,
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(1);
                    expect(testState[0].editingIndex).toBeUndefined();
                    expect(testState[0].editingId).toBeUndefined();
                    expect(mockReportModelHelper.addReportRecord).toHaveBeenCalled();
                }
            },
            {
                description: 'when report matches add record with after as UNSAVED_RECORD_ID',
                initialState: [{id:contextId, editingId:44}],
                content : {afterRecId: UNSAVED_RECORD_ID},
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(1);
                    expect(mockReportModelHelper.deleteRecordFromReport).toHaveBeenCalled();
                    expect(mockReportModelHelper.addReportRecord).toHaveBeenCalled();
                }
            },
            {
                description: 'when report matches add record with after as NEW_RECORD_VALUE',
                initialState: [{id:contextId, editingId:44}],
                content : {afterRecId: NEW_RECORD_VALUE},
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(1);
                    expect(mockReportModelHelper.deleteRecordFromReport).toHaveBeenCalled();
                    expect(mockReportModelHelper.addReportRecord).toHaveBeenCalled();
                }
            },
            {
                description: 'when report matches update record',
                initialState: [{id:contextId, editingId:44}],

                content : reportContentAddBlank,
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(1);
                    expect(mockReportModelHelper.addReportRecord).toHaveBeenCalled();
                }
            },
            {
                description: 'when report matches add record no editIndex',
                initialState: [{id:contextId}],
                content:  {},
                expects: (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(1);
                    expect(testState).toEqual([{id:contextId}]);
                }
            },
            {
                description: 'when no matches in current state',
                initialState: [],
                content:  {report:{context:{}}},
                expects: (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(0);
                }
            },
            {
                description: 'when no content',
                initialState: [],
                expects: (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(0);
                }
            }
        ];
        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let testState = testCase.initialState;
                actionObj.type = types.ADD_BLANK_REPORT_RECORD;
                actionObj.id = contextId;
                if (testCase.content) {
                    actionObj.content = testCase.content;
                }
                testState = reducer(testState, actionObj);

                testCase.expects(testState);
            });
        });

    });

    describe('Report reducer CHANGE_LOCALE test correct state', () => {
        let contextId = "CHANGE_LOCALE";
        let anotherContextId = "ANOTHER_CHANGE_LOCALE";
        let testCases = [
            {
                description: 'when report has no data',
                initialState: [{id:contextId, loading:false}, {id:anotherContextId}],
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(2);
                    expect(mockReportModelHelper.getReportColumns).not.toHaveBeenCalled();
                }
            },
            {
                description: 'when report is loading',
                initialState: [{id:contextId, loading:true,
                    data: {groupEls : {}, fids: {}}}, {id:anotherContextId}],
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(2);
                    expect(mockReportModelHelper.getReportColumns).not.toHaveBeenCalled();
                }
            },
            {
                description: 'when report not loading update columns locale',
                initialState: [{id:contextId, loading:false,
                    data: {fids: {}}}, {id:anotherContextId}],
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(2);
                    expect(mockReportModelHelper.getReportColumns).toHaveBeenCalled();
                }
            },
            {
                description: 'when report not loading update fields grp',
                initialState: [{id:contextId, loading:false, data: {groupEls : {}, fids: {}, hasGrouping: true}}, {id:anotherContextId}, {}],
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(3);
                    expect(mockReportModelHelper.getReportColumns).toHaveBeenCalled();
                }
            },
            {
                description: 'when no current state',
                initialState: [],
                expects: (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState.length).toEqual(0);
                }
            },
        ];
        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let testState = testCase.initialState;
                actionObj.type = types.CHANGE_LOCALE;
                actionObj.id = contextId;
                if (testCase.content) {
                    actionObj.content = testCase.content;
                }
                testState = reducer(testState, actionObj);

                testCase.expects(testState);
            });
        });

    });

    describe('Report reducer ADD_COLUMN_FROM_EXISTING_FIELD test correct state', () => {
        let contextId = "ADD_COLUMN_FROM_EXISTING_FIELD";
        let initialStateAddBefore = [
            {
                id: contextId,
                data: {
                    columns: [
                        {
                            id: -1,
                            isHidden: false,
                            isPlaceholder: true
                        },
                        {
                            fieldDef: {
                                id: 6
                            },
                            isHidden: false,
                            isPlaceholder: false,
                            id: 6
                        },
                        {
                            fieldDef: {
                                id: 7
                            },
                            isHidden: true,
                            isPlaceholder: false,
                            id: 7
                        }
                    ],
                    fids: [6, 7],
                    metaData: {
                        fids: [6, 7]
                    }
                }
            }
        ];
        let initialStateAddAfter = [
            {
                id: contextId,
                data: {
                    columns: [
                        {
                            fieldDef: {
                                id: 6
                            },
                            isHidden: true,
                            isPlaceholder: false,
                            id: 6
                        },
                        {
                            fieldDef: {
                                id: 7
                            },
                            isHidden: false,
                            isPlaceholder: false,
                            id: 7
                        },
                        {
                            id: -1,
                            isHidden: false,
                            isPlaceholder: true
                        },
                    ],
                    fids: [6, 7],
                    metaData: {
                        fids: [6, 7]
                    }
                }
            }
        ];
        let initialStateNoPlaceholder = [
            {
                id: contextId,
                data: {
                    columns: [
                        {
                            fieldDef: {
                                id: 6
                            },
                            isHidden: false,
                            isPlaceholder: false,
                            id: 6
                        },
                        {
                            fieldDef: {
                                id: 7
                            },
                            isHidden: true,
                            isPlaceholder: false,
                            id: 7
                        }
                    ],
                    fids: [6, 7],
                    metaData: {
                        fids: [6, 7]
                    }
                }
            }
        ];
        let requestedColumnId6InColumns = {
            fieldDef: {
                id: 6
            },
            isHidden: true,
            isPlaceholder: false,
            id: 6
        };
        let requestedColumnId7InColumns = {
            fieldDef: {
                id: 7
            },
            isHidden: true,
            isPlaceholder: false,
            id: 7
        };
        let requestedColumnIdNotInColumns = {
            fieldDef: {
                id: 8
            },
            isHidden: true,
            isPlaceholder: false,
            id: 8
        };
        let testCases = [
            {
                description: 'when adding the requested column that already exists in the columns before the clicked column',
                initialState: initialStateAddBefore,
                content : {addBefore: true, requestedColumn: requestedColumnId7InColumns},
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState[0].data.columns.length).toEqual(3);
                    expect(testState[0].data.columns[0].id).toEqual(7);
                    expect(testState[0].data.columns[1].isPlaceholder).toEqual(true);
                    expect(testState[0].data.columns[2].id).toEqual(6);
                    expect(testState[0].data.columns[0].isHidden).toEqual(false);
                    expect(testState[0].data.fids.length).toEqual(2);
                    expect(testState[0].data.fids[0]).toEqual(7);
                    expect(testState[0].data.fids[1]).toEqual(6);
                }
            },
            {
                description: 'when adding the requested column that does not exist in the columns before the clicked column',
                initialState: initialStateAddBefore,
                content : {addBefore: true, requestedColumn: requestedColumnIdNotInColumns},
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState[0].data.columns.length).toEqual(4);
                    expect(testState[0].data.columns[0].id).toEqual(8);
                    expect(testState[0].data.columns[1].isPlaceholder).toEqual(true);
                    expect(testState[0].data.columns[2].id).toEqual(6);
                    expect(testState[0].data.columns[3].id).toEqual(7);
                    expect(testState[0].data.fids.length).toEqual(3);
                    expect(testState[0].data.fids[0]).toEqual(8);
                    expect(testState[0].data.fids[1]).toEqual(6);
                    expect(testState[0].data.fids[2]).toEqual(7);
                }
            },
            {
                description: 'when adding the requested column that already exists in the columns after the clicked column',
                initialState: initialStateAddAfter,
                content : {addBefore: false, requestedColumn: requestedColumnId6InColumns},
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState[0].data.columns.length).toEqual(3);
                    expect(testState[0].data.columns[0].id).toEqual(7);
                    expect(testState[0].data.columns[1].isPlaceholder).toEqual(true);
                    expect(testState[0].data.columns[2].id).toEqual(6);
                    expect(testState[0].data.fids.length).toEqual(2);
                    expect(testState[0].data.fids[0]).toEqual(7);
                    expect(testState[0].data.fids[1]).toEqual(6);
                }
            },
            {
                description: 'when adding the requested column that does not exist in the columns after the clicked column',
                initialState: initialStateAddAfter,
                content : {addBefore: false, requestedColumn: requestedColumnIdNotInColumns},
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState[0].data.columns.length).toEqual(4);
                    expect(testState[0].data.columns[0].id).toEqual(6);
                    expect(testState[0].data.columns[1].id).toEqual(7);
                    expect(testState[0].data.columns[2].isPlaceholder).toEqual(true);
                    expect(testState[0].data.columns[3].id).toEqual(8);
                    expect(testState[0].data.fids.length).toEqual(3);
                    expect(testState[0].data.fids[0]).toEqual(6);
                    expect(testState[0].data.fids[1]).toEqual(7);
                    expect(testState[0].data.fids[2]).toEqual(8);
                }
            },
            {
                description: 'add requested column before with no placeholder present',
                initialState: initialStateNoPlaceholder,
                content : {addBefore: true, requestedColumn: requestedColumnId7InColumns},
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState[0].data.columns.length).toEqual(2);
                    expect(testState[0].data.columns[0].id).toEqual(7);
                    expect(testState[0].data.columns[1].id).toEqual(6);
                    expect(testState[0].data.fids.length).toEqual(2);
                    expect(testState[0].data.fids[0]).toEqual(7);
                    expect(testState[0].data.fids[1]).toEqual(6);
                }
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let testState = testCase.initialState;
                actionObj.type = types.ADD_COLUMN_FROM_EXISTING_FIELD;
                actionObj.id = contextId;
                if (testCase.content) {
                    actionObj.content = testCase.content;
                }
                testState = reducer(testState, actionObj);

                testCase.expects(testState);
            });
        });
    });

    describe('Report reducer HIDE_COLUMN test correct state', () => {
        let contextId = "HIDE_COLUMN";
        let initialState = [
            {
                id: contextId,
                data: {
                    columns: [
                        {
                            fieldDef: {
                                id: 6
                            },
                            isHidden: false,
                            id: 6
                        },
                        {
                            fieldDef: {
                                id: 7
                            },
                            isHidden: false,
                            id: 7
                        }
                    ],
                    fids: [6, 7],
                    metaData: {
                        fids: [6, 7]
                    }
                }
            }
        ];
        let testCases = [
            {
                description: 'when fieldDef id of column equals column id of first',
                initialState: initialState,
                content : {clickedId: 6},
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState[0].data.columns[0].isHidden).toEqual(true);
                    expect(testState[0].data.columns[1].isHidden).toEqual(false);
                    expect(testState[0].data.fids.length).toEqual(1);
                    expect(testState[0].data.fids).toContain(7);
                }
            },
            {
                description: 'when fieldDef id of column equals column id of second',
                initialState: initialState,
                content : {clickedId: 7},
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState[0].data.columns[0].isHidden).toEqual(false);
                    expect(testState[0].data.columns[1].isHidden).toEqual(true);
                    expect(testState[0].data.fids.length).toEqual(1);
                    expect(testState[0].data.fids).toContain(6);
                }
            },
            {
                description: 'when fieldDef id of column does not equal any ids',
                initialState: initialState,
                content : {clickedId: 8},
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState[0].data.columns[0].isHidden).toEqual(false);
                    expect(testState[0].data.columns[1].isHidden).toEqual(false);
                    expect(testState[0].data.fids.length).toEqual(2);
                    expect(testState[0].data.fids).toContain(6, 7);
                }
            },
            {
                description: 'when no columnId provided',
                initialState: initialState,
                content : {},
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState[0].data.columns[0].isHidden).toEqual(false);
                    expect(testState[0].data.columns[1].isHidden).toEqual(false);
                    expect(testState[0].data.fids.length).toEqual(2);
                    expect(testState[0].data.fids).toContain(6, 7);
                }
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let testState = testCase.initialState;
                actionObj.type = types.HIDE_COLUMN;
                actionObj.id = contextId;
                if (testCase.content) {
                    actionObj.content = testCase.content;
                }
                testState = reducer(testState, actionObj);

                testCase.expects(testState);
            });
        });

    });

    describe('Report reducer INSERT_PLACEHOLDER_COLUMN test correct state', () => {
        let contextId = "INSERT_PLACEHOLDER_COLUMN";
        let initialStateWithoutPlaceholder = [
            {
                id: contextId,
                data: {
                    columns: [
                        {
                            fieldDef: {
                                id: 6
                            },
                            isPlaceholder: false,
                            isHidden: false,
                            id: 6,
                            order: 1
                        },
                        {
                            fieldDef: {
                                id: 7
                            },
                            isPlaceholder: false,
                            isHidden: false,
                            id: 7,
                            order: 2
                        }
                    ],
                    fids: [6, 7],
                    metaData: {
                        fids: [6, 7]
                    }
                }
            }
        ];
        let initialStateWithPlaceholder = [
            {
                id: contextId,
                data: {
                    columns: [
                        {
                            fieldDef: {
                                id: 6
                            },
                            isPlaceholder: false,
                            isHidden: false,
                            id: 6,
                            order: 1
                        },
                        {
                            fieldDef: {
                                id: 7
                            },
                            isPlaceholder: false,
                            isHidden: false,
                            id: 7,
                            order: 2
                        },
                        {
                            isPlaceholder: true,
                            isHidden: false,
                            id: -1,
                            order: 3
                        }
                    ],
                    fids: [6, 7],
                    metaData: {
                        fids: [6, 7]
                    }
                }
            }
        ];
        let testCases = [
            {
                description: 'when the placeholder column does not exist it is added to the columns before the clickedColumnId',
                initialState: initialStateWithoutPlaceholder,
                content : {clickedColumnId: 6, addBeforeColumn: true},
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState[0].data.columns.length).toEqual(3);
                    expect(testState[0].data.columns[0].isPlaceholder).toEqual(true);
                }
            },
            {
                description: 'when the placeholder column does not exist it is added to the columns after the clickedColumnId',
                initialState: initialStateWithoutPlaceholder,
                content : {clickedColumnId: 6, addBeforeColumn: false},
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState[0].data.columns.length).toEqual(3);
                    expect(testState[0].data.columns[1].isPlaceholder).toEqual(true);
                }
            },
            {
                description: 'when the placeholder column does exist it is added to the columns before the clickedColumnId',
                initialState: initialStateWithPlaceholder,
                content : {clickedColumnId: 6, addBeforeColumn: true},
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState[0].data.columns.length).toEqual(3);
                    expect(testState[0].data.columns[0].isPlaceholder).toEqual(true);
                    expect(testState[0].data.columns[2].isPlaceholder).toEqual(false);
                }
            },
            {
                description: 'when the placeholder column does exist it is added to the columns after the clickedColumnId',
                initialState: initialStateWithPlaceholder,
                content : {clickedColumnId: 6, addBeforeColumn: false},
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState[0].data.columns.length).toEqual(3);
                    expect(testState[0].data.columns[1].isPlaceholder).toEqual(true);
                    expect(testState[0].data.columns[2].isPlaceholder).toEqual(false);
                }
            },
            {
                description: 'when the clickedColumnId is not an id of any of the columns the placeholder is not added',
                initialState: initialStateWithoutPlaceholder,
                content : {clickedColumnId: 8, addBeforeColumn: true},
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState[0].data.columns.length).toEqual(2);
                    expect(testState[0].data.columns[0].isPlaceholder).toEqual(false);
                    expect(testState[0].data.columns[1].isPlaceholder).toEqual(false);
                }
            }
        ];
        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let testState = testCase.initialState;
                actionObj.type = types.INSERT_PLACEHOLDER_COLUMN;
                actionObj.id = contextId;
                if (testCase.content) {
                    actionObj.content = testCase.content;
                }
                testState = reducer(testState, actionObj);

                testCase.expects(testState);
            });
        });
    });

    describe('Report reducer CHANGE_REPORT_NAME test correct state', () => {
        it('changes the report data name', () => {
            let contextId = "CHANGE_REPORT_NAME";
            let initialState = [
                {
                    id: contextId,
                    data: {
                        name: 'Test Name',
                        metaData: {
                            name: 'Test Name'
                        }
                    }
                }
            ];
            let expectedName = 'New Name';

            actionObj.type = types.CHANGE_REPORT_NAME;
            actionObj.id = contextId;
            actionObj.content = {newName: expectedName};

            let testState = reducer(initialState, actionObj);

            expect(testState[0].data.name).toEqual(expectedName);
            expect(testState[0].data.metaData.name).toEqual(expectedName);
        });
    });

    describe('Report reducer INVALID_ACTION test correct state', () => {
        it('handled non matching action', () => {
            let testState = [123, 456, 789];
            let expectedState = _.clone(testState);
            testState = reducer(testState, {type: "This is not a valid action type"});
            expect(testState.length).toEqual(expectedState.length);
            expect(testState).toEqual(expectedState);

        });
    });

    describe('Report reducer MOVE_COLUMN test correct state', () => {
        let contextId = "MOVE_COLUMN";
        let initialState = [
            {
                id: contextId,
                data: {
                    columns: [
                        {
                            fieldDef: {
                                id: 6
                            },
                            isHidden: false,
                            id: 6,
                            headerName: 6
                        },
                        {
                            fieldDef: {
                                id: 7
                            },
                            isHidden: false,
                            id: 7,
                            headerName: 7
                        },
                        {
                            fieldDef: {
                                id: 8
                            },
                            isHidden: false,
                            id: 8,
                            headerName: 8
                        }
                    ],
                    fids: [6, 7, 8],
                    metaData: {
                        fids: [6, 7, 8]
                    }
                }
            }
        ];
        let testCases = [
            {
                description: 'when id of column and fids are rearranged',
                initialState: initialState,
                content : {sourceLabel: 6, targetLabel: 7},
                expects : (testState) => {
                    expect(Array.isArray(testState)).toEqual(true);
                    expect(testState[0].data.columns[0].id).toEqual(7);
                    expect(testState[0].data.columns[1].id).toEqual(6);
                    expect(testState[0].data.columns[2].id).toEqual(8);
                    expect(testState[0].data.fids[0]).toEqual(7);
                    expect(testState[0].data.fids[1]).toEqual(6);
                    expect(testState[0].data.fids[2]).toEqual(8);

                }
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let testState = testCase.initialState;
                actionObj.type = types.MOVE_COLUMN;
                actionObj.id = contextId;
                if (testCase.content) {
                    actionObj.content = testCase.content;
                }
                testState = reducer(testState, actionObj);

                testCase.expects(testState);
            });
        });

    });


});
