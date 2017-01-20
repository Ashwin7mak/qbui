import reducer from '../../src/reducers/reports';
import * as types from '../../src/actions/types';

let actionObj = {
    id: 1,
    type: null,
    content: null
};

let state = null;
beforeEach(() => {
    state = null;
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
    it('test correct state when loading a report', () => {
        action.type = types.LOAD_REPORTS;
        state = reducer(state, actionObj);
        expect(Array.isArray(state)).toEqual(true);
        expect(state.length).toEqual(1);
        expect(state[0].loading).toEqual(true);
    });
});

describe('Report reducer error report loading', () => {
    it('test correct state when loading a report fails', () => {
        action.type = types.LOAD_REPORTS_FAILED;
        state = reducer(state, actionObj);
        expect(Array.isArray(state)).toEqual(true);
        expect(state.length).toEqual(1);
        expect(state[0].loading).toEqual(false);
        expect(state[0].error).toEqual(true);
    });
});

describe('Report reducer success report loading', () => {
    it('test correct state when loading a report succeeds', () => {
        action.type = types.LOAD_REPORTS_SUCCESS;
        action.content = {appId: '1', tblId:'2', reportsList: []};
        state = reducer(state, actionObj);
        expect(Array.isArray(state)).toEqual(true);
        expect(state.length).toEqual(1);
        expect(state[0].loading).toEqual(false);
        expect(state[0].error).toEqual(false);
        expect(state[0].appId).toEqual(action.content.appId);
        expect(state[0].tblId).toEqual(action.content.tblid);
        expect(state[0].list).toEqual(action.content.reportsList);
    });
});
