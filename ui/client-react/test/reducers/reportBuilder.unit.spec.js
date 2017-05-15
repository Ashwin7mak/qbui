import reducer from '../../src/reducers/reportBuilder';
import * as types from '../../src/actions/types';

let initialState = {};

function initializeState() {
    initialState = {
        redirectRoute: null,
        inBuilderMode: false,
        isCollapsed: true,
        addBeforeColumn: null,
        availableColumns: []
    };
}

beforeEach(() => {
    initializeState();
});

describe('Test initial state of reportBuilder reducer', () => {
    it('return correct initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });
});

describe('ReportBuilder reducer functions for refreshing fields', () => {
    it('returns correct state with the correct fields', () => {
        let content = {
            response: {
                data: [
                    {
                        builtIn: false,
                        dataIsCopyable: true,
                        datatypeAttributes: {
                            htmlAllowed: false,
                            type: "TEXT"
                        },
                        id: 6,
                        includeInQuickSearch: true,
                        indexed: false,
                        multiChoiceSourceAllowed: false,
                        name: "Text Field",
                        required: false,
                        tableId: 0,
                        type: "SCALAR"
                    }
                ]
            }
        };
        const state = reducer(initialState, {type: types.REFRESH_FIELD_SELECT_MENU, content: content});
        expect(state.availableColumns.length).toEqual(1);
    });

    it('returns correct state with the menu open', () => {
        const state = reducer(initialState, {type: types.OPEN_FIELD_SELECT_MENU, content: {}});
        expect(state.isCollapsed).toEqual(false);
    });

    it('returns correct state with the menu closed', () => {
        const state = reducer(initialState, {type: types.CLOSE_FIELD_SELECT_MENU, content: {}});
        expect(state.isCollapsed).toEqual(true);
    });

    it('returns correct state with addBeforeColumn set to true', () => {
        let content = {
            addBeforeColumn: true
        };
        const state = reducer(initialState, {type: types.OPEN_FIELD_SELECT_MENU, content: content});
        expect(state.addBeforeColumn).toEqual(true);
    });

    it('returns correct state with addBeforeColumn set to true', () => {
        let content = {
            addBeforeColumn: false
        };
        const state = reducer(initialState, {type: types.OPEN_FIELD_SELECT_MENU, content: content});
        expect(state.addBeforeColumn).toEqual(false);
    });

    it('enter builder mode', () => {
        const state = reducer(initialState, {type: types.ENTER_BUILDER_MODE});
        expect(state.inBuilderMode).toEqual(true);
    });

    it('exit builder mode', () => {
        let openState = {inBuilderMode: true};
        const state = reducer(openState, {type: types.EXIT_BUILDER_MODE});
        expect(state.inBuilderMode).toEqual(false);
    });
});
