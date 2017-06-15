import reducer, {__RewireAPI__ as ReducerRewireAPI} from '../../src/reducers/embeddedReports';
import * as types from '../../src/actions/types';
import _ from 'lodash';
import Logger from '../../src/utils/logger';

let logger = new Logger();
logger.logToConsole = true;
/**
 * Unit tests for embedded report reducer
 *
 */

describe('Embedded report reducer', () => {

    let state = {};

    let actionObj = {
        id: 1,
        type: null,
        content: null
    };

    let reportActionContent = {
        appId: 1, tblId: 2, rptId: 3, data: 'data'
    };

    let reportState = {
        11: {
            id: 11,
            appId: "abc",
            tblId: "def",
            rptId: "hij",
            loading: false
        }
    };

    beforeEach(() => {
        state = {};
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

    describe('initialize', () => {
        it('returns correct initial state for an empty action', () => {
            let initialState = {};

            let resultState = reducer(initialState, {});
            expect(resultState).toEqual({});
        });

        it('return correct initial state with action obj', () => {
            let initialState = {};

            let resultState = reducer(initialState, actionObj);
            expect(resultState).toDeepEqual(state);
        });
    });

    it('does not modify passed state', () => {
        let initialState = {};

        reducer(initialState, actionObj);
        expect(initialState).toEqual({});
    });

    describe('load', () => {
        let actionContentSingle = {
            appId: 1, tblId: 2, rptId:3
        };
        let reportLoadActionSingle = {
            type: types.LOAD_EMBEDDED_REPORT,
            id: 10,
            content: actionContentSingle
        };
        let newEntrySingle = {id: 10, ...actionContentSingle, loading: true};
        let expectedState = Object.assign({}, reportState, {10: newEntrySingle});

        let testCase = {
            reportLoadAction: reportLoadActionSingle,
            actionType : types.LOAD_EMBEDDED_REPORT,
            message : 'LOAD_EMBEDDED_REPORT',
            expectedState: expectedState
        };

        it('returns correct state on ' + testCase.message, () => {

            let newState = reducer(reportState, testCase.reportLoadAction);
            expect(newState).toDeepEqual(testCase.expectedState);
        });

        it(`report's "loading" field is set to true when loading a report`, () => {
            actionObj.type = types.LOAD_EMBEDDED_REPORT;
            actionObj.content = reportActionContent;
            state = reducer(state, actionObj);

            expect(state[1].loading).toEqual(true);
        });
    });

    it('unload action removes entry from state', () => {
        actionObj.type = types.UNLOAD_EMBEDDED_REPORT;
        actionObj.id = 11;
        state = reducer(reportState, actionObj);

        expect(state[11]).toBeFalsy();
    });

    describe('Report reducer load failed', () => {
        let expectedState = _.cloneDeep(reportState);

        let testCase = {
            description: "LOAD_EMBEDDED_REPORTS_FAILED",
            actionType: types.LOAD_EMBEDDED_REPORTS_FAILED,
            expectedState
        };

        it('returns correct state on ' + testCase.description, () => {
            let reportLoadAction = {
                type: testCase.actionType,
                id: 10,
                content: reportActionContent
            };
            let newState = reducer(reportState, reportLoadAction);
            expect(newState).toEqual(testCase.expectedState);
        });
    });

    describe('failed load request', () => {
        it('state.loading is set to false', () => {
            actionObj.type = types.LOAD_EMBEDDED_REPORT_FAILED;
            state = reducer(state, actionObj);

            expect(state[1].loading).toEqual(false);
        });

        it('state.error is set to true', () => {
            actionObj.type = types.LOAD_EMBEDDED_REPORT_FAILED;
            state = reducer(state, actionObj);

            expect(state[1].error).toEqual(true);
        });
    });

    describe('successful load request', () => {
        beforeEach(() => {
            actionObj.type = types.LOAD_EMBEDDED_REPORT_SUCCESS;
            actionObj.content = reportActionContent;
            state = reducer(state, actionObj);
        });

        it('sets state.error to false', () => {
            expect(state[1].error).toEqual(false);
        });

        it('sets state.loading to false', () => {
            expect(state[1].loading).toEqual(false);
        });

        it('sets appdId, tblId, and data', () => {
            expect(state[1].appId).toEqual(actionObj.content.appId);
            expect(state[1].tblId).toEqual(actionObj.content.tblId);
            expect(state[1].data).toEqual(actionObj.content.data);
        });
    });
});
