import reducer from '../../src/reducers/shell';
import * as types from '../../src/actions/types';

let initialState = {
    trowserOpen: false,
    trowserContent: null,
    leftNavExpanded: true,
    leftNavVisible: false
};

function initializeState() {
    initialState = {
        trowserOpen: false,
        trowserContent: null,
        leftNavExpanded: true,
        leftNavVisible: false
    };
}

beforeEach(() => {
    initializeState();
});

describe('Test initial state of shell reducer', () => {
    it('return correct initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });
});

describe('Nav reducer functions for Show/hide trowser', () => {
    it('returns correct state with trowser shown', () => {
        const state = reducer(initialState, {type: types.SHOW_TROWSER, content: 'someContent'});
        expect(state.trowserOpen).toEqual(true);
        expect(state.trowserContent).toEqual('someContent');
    });

    let openState = {trowserOpen: true, trowserContent: 'someContent'};
    it('returns correct state with trowser hidden', () => {
        const state = reducer(openState, {type: types.HIDE_TROWSER});
        expect(state.trowserOpen).toEqual(false);
        expect(state.trowserContent).toEqual('someContent');
    });
});

describe('Nav reducer functions for Toggle left nav expanded', () => {
    var testCases = [
        {name:'nav state is false', navState: false, expectation: false},
        {name:'nav state is true', navState: true, expectation: true},
        {name:'nav state is not a boolean', navState: '1', expectation: !initialState.leftNavExpanded},
        {name:'nav state is not set', navState: null, expectation: !initialState.leftNavExpanded}
    ];

    testCases.forEach(function(test) {
        it(test.name, (done) => {
            initializeState();
            const state = reducer(initialState, {type: types.TOGGLE_LEFT_NAV_EXPANDED, navState: test.navState});
            expect(state.leftNavExpanded).toEqual(test.expectation);
            done();
        });
    });
});

describe('Nav reducer functions for Toggle left nav visible', () => {
    var testCases = [
        {name:'nav state is false', navState: false, expectation: false},
        {name:'nav state is true', navState: true, expectation: true},
        {name:'nav state is not a boolean', navState: '1', expectation: !initialState.leftNavVisible},
        {name:'nav state is not set', navState: null, expectation: !initialState.leftNavVisible}
    ];

    testCases.forEach(function(test) {
        it(test.name, (done) => {
            initializeState();
            const state = reducer(initialState, {type: types.TOGGLE_LEFT_NAV_VISIBLE, navState: test.navState});
            expect(state.leftNavVisible).toEqual(test.expectation);
            done();
        });
    });
});
