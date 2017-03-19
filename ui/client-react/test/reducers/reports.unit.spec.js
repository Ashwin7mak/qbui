import reducer from '../../src/reducers/report';
import * as types from '../../src/actions/types';

let actionObj = {
    id: 1,
    type: null,
    content: null
};

let state = undefined;
beforeEach(() => {
    state = undefined;
    actionObj.id = 1;
    actionObj.type = null;
    actionObj.content = null;
});

describe('Report reducer initialize', () => {
    it('test correct initial state', () => {
        state = (reducer(state, actionObj));
        expect(Array.isArray(state)).toEqual(true);
        expect(state.length).toEqual(0);
    });
});

describe('Report reducer report loading', () => {
    it('test correct state when loading a report with no content', () => {
        actionObj.type = types.LOAD_REPORTS;
        state = reducer(state, actionObj);
        expect(Array.isArray(state)).toEqual(true);
        expect(state.length).toEqual(1);
        expect(state[0].loading).toEqual(true);
        expect(state[0].appId).toEqual('');
        expect(state[0].tblId).toEqual('');
    });
    it('test correct state when loading a report', () => {
        actionObj.type = types.LOAD_REPORTS;
        actionObj.content = {
            appId: '1',
            tblId: '2'
        };
        state = reducer(state, actionObj);
        expect(Array.isArray(state)).toEqual(true);
        expect(state.length).toEqual(1);
        expect(state[0].loading).toEqual(true);
        expect(state[0].appId).toEqual(actionObj.content.appId);
        expect(state[0].tblId).toEqual(actionObj.content.tblId);
    });
});

describe('Report reducer multiple entries', () => {
    it('test state entry', () => {
        actionObj.type = types.LOAD_REPORTS;
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
    it('test correct state when loading a report fails and report not in store', () => {
        actionObj.type = types.LOAD_REPORTS_FAILED;
        state = reducer(state, actionObj);
        expect(Array.isArray(state)).toEqual(true);
        expect(state.length).toEqual(0);
    });
    it('test correct state when loading a report fails and report in store', () => {
        actionObj.type = types.LOAD_REPORTS;
        actionObj.content = {
            appId: '1',
            tblId: '2'
        };
        state = reducer(state, actionObj);
        expect(state.length).toEqual(1);

        actionObj.type = types.LOAD_REPORTS_FAILED;
        state = reducer(state, actionObj);
        expect(Array.isArray(state)).toEqual(true);
        expect(state.length).toEqual(1);
        expect(state[0].loading).toEqual(false);
        expect(state[0].error).toEqual(true);
    });
});

describe('Report reducer success report loading', () => {
    it('test correct state when loading a report succeeds and report not in store', () => {
        actionObj.type = types.LOAD_REPORTS_SUCCESS;
        state = reducer(state, actionObj);
        expect(Array.isArray(state)).toEqual(true);
        expect(state.length).toEqual(0);
    });
    it('test correct state when loading a report succeeds', () => {
        actionObj.type = types.LOAD_REPORTS;
        actionObj.content = {
            appId: '1',
            tblId: '2'
        };
        state = reducer(state, actionObj);
        expect(state.length).toEqual(1);

        actionObj.type = types.LOAD_REPORTS_SUCCESS;
        actionObj.content = {appId: '1', tblId:'2', reportsList: ['list of reports']};
        state = reducer(state, actionObj);
        expect(Array.isArray(state)).toEqual(true);
        expect(state.length).toEqual(1);
        expect(state[0].loading).toEqual(false);
        expect(state[0].error).toEqual(false);
        expect(state[0].appId).toEqual(actionObj.content.appId);
        expect(state[0].tblId).toEqual(actionObj.content.tblId);
        expect(state[0].list).toEqual(actionObj.content.reportsList);
    });
});
