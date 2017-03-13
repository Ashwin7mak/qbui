import reducer, {__RewireAPI__ as ReducerRewireAPI} from '../../src/reducers/report';
import * as types from '../../src/actions/types';
import _ from 'lodash';
import Logger from '../../src/utils/logger';

let logger = new Logger();
logger.logToConsole = true;
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

    beforeEach(() => {
        state = undefined;
        actionObj.id = 1;
        actionObj.type = null;
        actionObj.content = null;
        jasmine.addMatchers({
            toDeepEqual: () => {
                return {
                    compare: (actual, expected) => {
                        return {pass: _.isEqual(actual, expected)};
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
            state = reducer(state, actionObj);
            logger.log("state=" + JSON.stringify(state));
            expect(Array.isArray(state)).toEqual(true);
            expect(state.length).toEqual(1);
            expect(state[0].loading).toEqual(true);
        });
    });

    describe('Report reducer multiple entries', () => {
        it('test state entry', () => {
            actionObj.type = types.LOAD_REPORTS;
            state = reducer(state, actionObj);
            logger.info("state=" + JSON.stringify(state));

            expect(state.length).toEqual(1);

            //  call same state with different id
            actionObj.id = 10;
            actionObj.type = types.LOAD_REPORTS;

            state = reducer(state, actionObj);
            logger.info("state=" + JSON.stringify(state));

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
            logger.info("state=" + JSON.stringify(state));

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
            logger.info("state=" + JSON.stringify(state));

            expect(Array.isArray(state)).toEqual(true);
            expect(state.length).toEqual(1);
            expect(state[0].loading).toEqual(false);
            expect(state[0].error).toEqual(true);
        });
    });

    describe('Report reducer success report loading', () => {
        it('test correct state when loading a report succeeds', () => {
            actionObj.type = types.LOAD_REPORTS_SUCCESS;
            actionObj.content = {appId: '1', tblId:'2', reportsList: []};
            state = reducer(state, actionObj);
            logger.info("state=" + JSON.stringify(state));

            expect(Array.isArray(state)).toEqual(true);
            expect(state.length).toEqual(1);
            expect(state[0].loading).toEqual(false);
            expect(state[0].error).toEqual(false);
            expect(state[0].appId).toEqual(actionObj.content.appId);
            expect(state[0].tableId).toEqual(actionObj.content.tblId);
            expect(state[0].list).toEqual(actionObj.content.reportsList);
        });
    });
});
