import reducer, {__RewireAPI__ as ReducerRewireAPI} from '../../src/reducers/report';
import * as types from '../../src/actions/types';
import _ from 'lodash';

describe('Report reducer functions', () => {
    let initialState = [];
    let actionObj = {
        id: 1,
        type: null,
        content: null
    };
    let reportActionContent = {
        appId: 1, tblId: 2, rptId: 3
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

        it('returns correct initial state', () => {
            expect(reducer(undefined, {})).toEqual(initialState);
        });
    });

    describe('Report reducer load', () => {
        it('returns correct state on LOAD_REPORT', () => {
            let reportLoadAction = {
                type: types.LOAD_REPORT,
                id: 10,
                content: reportActionContent
            };
            let newState = reducer(reportListState, reportLoadAction);
            let expectedState = _.cloneDeep(reportListState);
            let newEntry = {...reportActionContent, id: 10, loading: true};
            expectedState.push(newEntry);
            expect(newState).toDeepEqual(expectedState);
        });
        it('returns correct state on LOAD_REPORTS', () => {
            let reportLoadAction = {
                type: types.LOAD_REPORTS,
                id: 10,
                content: reportActionContent
            };
            let newState = reducer(reportListState, reportLoadAction);
            let expectedState = _.cloneDeep(reportListState);
            let newEntry = {...reportActionContent, id: 10, loading: true};
            expectedState.push(newEntry);
            expect(newState).toDeepEqual(expectedState);
        });
    });

    describe('Report reducer load failed', () => {
        it('returns correct state on LOAD_REPORT_FAILED', () => {
            let reportLoadAction = {
                type: types.LOAD_REPORT_FAILED,
                id: 10,
                content: reportActionContent
            };
            let newState = reducer(reportListState, reportLoadAction);
            let expectedState = _.cloneDeep(reportListState);
            let newEntry = {
                id: 10,
                loading: false,
                error: true,
                errorDetails: reportActionContent
            };
            expectedState.push(newEntry);
            expect(newState).toDeepEqual(expectedState);
        });
    });
    //TODO: more actions to test, load success
});
