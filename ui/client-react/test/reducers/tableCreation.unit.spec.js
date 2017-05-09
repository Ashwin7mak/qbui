import reducer from '../../src/reducers/tableCreation';
import * as types from '../../src/actions/types';

let initialState = {};

function initializeState() {
    const defaultTableInfo = {
        name: {
            value: "",
        },
        description: {
            value: "",
        },
        tableIcon: {
            value: "Spreadsheet",
        },
        tableNoun: {
            value: "",
        }
    };

    initialState = {
        //  default states
        dialogOpen: false,
        showTableReadyDialog: false,
        pageIndex: 0,
        iconChooserOpen: false,
        savingTable: false,
        tableInfo: defaultTableInfo,
        edited: false,
        editing: null
    };
}

beforeEach(() => {
    initializeState();
});

describe('Test table creation reducers', () => {

    describe('Test initial state of table creation reducer', () => {
        it('return correct initial state', () => {
            expect(reducer(undefined, {})).toEqual(initialState);
        });
    });

    describe('Test feature switch states', () => {

        it('return updated dialog open state', () => {

            const state = reducer(initialState, {type: types.SHOW_TABLE_CREATION_DIALOG});
            expect(state.dialogOpen).toBe(true);
        });

        it('return updated dialog closed state', () => {

            const state = reducer(initialState, {type: types.HIDE_TABLE_CREATION_DIALOG});
            expect(state.dialogOpen).toBe(false);
        });


        it('return updated table ready dialog open state', () => {

            const state = reducer(initialState, {type: types.SHOW_TABLE_READY_DIALOG});
            expect(state.showTableReadyDialog).toBe(true);
        });

        it('return updated table ready dialog closed state', () => {

            const state = reducer(initialState, {type: types.HIDE_TABLE_READY_DIALOG});
            expect(state.showTableReadyDialog).toBe(false);
        });

        it('return updated page state icon chooser open', () => {

            const state = reducer(initialState, {type: types.TABLE_ICON_CHOOSER_OPEN, isOpen: true});
            expect(state.iconChooserOpen).toBe(true);
        });

        it('return updated page state table menu open', () => {

            let state = reducer(initialState, {type: types.TABLE_ICON_CHOOSER_OPEN, isOpen: true});
            state = reducer(state, {type: types.TABLE_ICON_CHOOSER_OPEN, isOpen: false});
            expect(state.iconChooserOpen).toBe(false);
        });

        it('return updated page state after programmatic edit', () => {

            let action = {
                type: types.SET_TABLE_CREATION_PROPERTY,
                property: 'name',
                value: '',
                pendingValidationError: 'pendingValueIsEmpty',
                validationError: 'valueIsEmpty',
                isUserEdit: false
            };
            const state = reducer(initialState, action);
            expect(state.tableInfo.name.value).toBe('');
            expect(state.tableInfo.name.pendingValidationError).toBe('pendingValueIsEmpty');
            expect(state.tableInfo.name.validationError).toBe('valueIsEmpty');
            expect(state.tableInfo.name.edited).toBeFalsy();

            expect(state.edited).toBeFalsy();
        });

        it('return updated page state after user edits', () => {

            let action = {
                type: types.SET_TABLE_CREATION_PROPERTY,
                property: 'name',
                value: 'newName',
                pendingValidationError: null,
                validationError: null,
                isUserEdit: true
            };
            const state = reducer(initialState, action);
            expect(state.tableInfo.name.value).toBe('newName');
            expect(state.tableInfo.name.validationError).toBe(null);
            expect(state.tableInfo.name.pendingValidationError).toBe(null);
            expect(state.tableInfo.name.edited).toBeTruthy();

            expect(state.edited).toBeTruthy();
        });

        it('return updated page state table menu open', () => {

            let state = reducer(initialState, {type: types.SET_EDITING_PROPERTY, editing: 'description'});

            expect(state.editing).toBe('description');
        });


        it('return updated saving', () => {

            const state = reducer(initialState, {type: types.SAVING_TABLE});
            expect(state.savingTable).toBe(true);
        });

        it('return updated created table', () => {
            let state = reducer(initialState, {type: types.SAVING_TABLE});
            state = reducer(state, {type: types.CREATED_TABLE});
            expect(state.savingTable).toBe(false);
        });

        it('return updated saving failed', () => {
            let state = reducer(initialState, {type: types.SAVING_TABLE});
            state = reducer(state, {type: types.SAVING_TABLE_FAILED});
            expect(state.savingTable).toBe(false);
        });

    });


});

