import reducer from '../../src/reducers/reportBuilder';
import * as types from '../../src/actions/types';

let initialState = {};

const route = 'new/route/';

function initializeState() {
    initialState = {
        redirectRoute: null,
        isPendingEdit: false,
        isInBuilderMode: false,
        availableColumns: [],
        addBeforeColumn: false,
        fieldBeingDragged: ''
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

describe('reportBuilder reducer', () => {
    it('DRAGGING_COLUMN_START sets fieldBeingDragged to the sourceLabel', () => {
        let content = {
            sourceLabel: 'Label'
        };
        const state = reducer(initialState, {type: types.DRAGGING_COLUMN_START, content: content});
        expect(state.fieldBeingDragged).toEqual(content.sourceLabel);
    });

    it('DRAGGING_COLUMN_END sets fieldBeingDragged to the an empty string', () => {
        const state = reducer(initialState, {type: types.DRAGGING_COLUMN_END});
        expect(state.fieldBeingDragged).toEqual('');
    });

    it('UPDATE_REPORT_REDIRECT_ROUTE sets redirectRoute to the route', () => {
        let content = {
            route: route
        };
        const state = reducer(initialState, {type: types.UPDATE_REPORT_REDIRECT_ROUTE, content: content});
        expect(state.redirectRoute).toEqual(route);
    });

    it('REFRESH_FIELD_SELECT_MENU sets availableColumns to the response columns', () => {
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

    it('ENTER_BUILDER_MODE sets isInBuilderMode to true', () => {
        const state = reducer(initialState, {type: types.ENTER_BUILDER_MODE});
        expect(state.isInBuilderMode).toEqual(true);
    });

    it('EXIT_BUILDER_MODE sets isInBuilderMode to false', () => {
        let inBuilderModeState = {isInBuilderMode: true};
        const state = reducer(inBuilderModeState, {type: types.EXIT_BUILDER_MODE});
        expect(state.isInBuilderMode).toEqual(false);
    });
});
