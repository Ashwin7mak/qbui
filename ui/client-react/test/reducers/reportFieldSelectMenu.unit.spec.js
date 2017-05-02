import reducer from '../../src/reducers/reportFieldSelectMenu';
import * as types from '../../src/actions/types';

let initialState = {};

function initializeState() {
    initialState = {
        isCollapsed: true,
        addBeforeColumn: null,
        availableColumns: []
    };
}

beforeEach(() => {
    initializeState();
});

describe('Test initial state of reportFieldSelectMenu reducer', () => {
    it('return correct initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });
});

describe('ReportFieldSelectMenu reducer functions for refreshing fields', () => {
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
        let content = {
            addBeforeColumn: true
        };
        const state = reducer(initialState, {type: types.OPEN_FIELD_SELECT_MENU, content: content});
        expect(state.isCollapsed).toEqual(false);
        expect(state.addBeforeColumn).toEqual(true);
    });

    it('returns correct state with the menu closed', () => {
        let content = {
            addBeforeColumn: false
        };
        const state = reducer(initialState, {type: types.CLOSE_FIELD_SELECT_MENU, content: content});
        expect(state.isCollapsed).toEqual(true);
        expect(state.addBeforeColumn).toEqual(false);
    });
});
