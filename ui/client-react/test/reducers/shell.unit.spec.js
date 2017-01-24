import reducer from '../../src/reducers/shell';
import * as types from '../../src/actions/types';

let initialState = {};

function initializeState() {
    initialState = {
        trowserOpen: false,
        trowserContent: null,
        leftNavExpanded: true,
        leftNavVisible: false,
        openCount: 0,
        isRowPopUpMenuOpen: false,
        appsListOpen: false
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
        {name:'nav state is not a boolean', navState: '1', expectation: false},
        {name:'nav state is not set', navState: null, expectation: false}
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
        {name:'nav state is not a boolean', navState: '1', expectation: true},
        {name:'nav state is not set', navState: null, expectation: true}
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

describe('Nav reducer functions for Toggle row actions menu', () => {
    var testCases = [
        {name:'toggle state is false', toggleState: false, expectedRowPopupMenuState: false, openCount: 0},
        {name:'toggle state is true', toggleState: true, expectedRowPopupMenuState: true, openCount: 1},
        {name:'toggle state is not a boolean', toggleState: '1', expectedRowPopupMenuState: false, openCount: 0},
        {name:'toggle state is not set', toggleState: null, expectedRowPopupMenuState: false, openCount: 0}
    ];

    testCases.forEach(function(test) {
        it(test.name, (done) => {
            initializeState();
            const state = reducer(initialState, {type: types.TOGGLE_ROW_POP_UP_MENU, toggleState: test.toggleState});
            expect(state.isRowPopUpMenuOpen).toEqual(test.expectedRowPopupMenuState);
            expect(state.openCount).toEqual(test.openCount);
            done();
        });
    });
});

describe('Nav reducer functions for Toggle apps list', () => {
    var testCases = [
        {name:'toggle state is false', toggleState: false, expectation: false},
        {name:'toggle state is true', toggleState: true, expectation: true},
        {name:'toggle state is not a boolean', toggleState: '1', expectation: true},
        {name:'toggle state is not set', toggleState: null, expectation: true}
    ];

    testCases.forEach(function(test) {
        it(test.name, (done) => {
            initializeState();
            const state = reducer(initialState, {type: types.TOGGLE_APPS_LIST, toggleState: test.toggleState});
            expect(state.appsListOpen).toEqual(test.expectation);
            done();
        });
    });
});

