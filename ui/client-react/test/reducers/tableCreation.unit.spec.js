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
            value: "projects",
        },
        tableNoun: {
            value: "",
        }
    };

    initialState = {
        //  default states
        dialogOpen: false,
        dialogPage: 0,
        menuOpen: false,
        savingTable: false,
        tableInfo: defaultTableInfo,
        edited: false,
        editing: null,
        notifyTableCreated: false
    }
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

        it('return updated dialog open state', () => {

            const state = reducer(initialState, {type: types.HIDE_TABLE_CREATION_DIALOG});
            expect(state.dialogOpen).toBe(false);
        });


        it('return updated page state after next', () => {

            const state = reducer(initialState, {type: types.NEXT_TABLE_CREATION_PAGE});
            expect(state.dialogPage).toBe(1);
        });


        it('return updated page state after previous', () => {
            let state = reducer(initialState, {type: types.NEXT_TABLE_CREATION_PAGE});
            state = reducer(state, {type: types.PREVIOUS_TABLE_CREATION_PAGE});
            expect(state.dialogPage).toBe(0);

            // doesn't go negative
            state = reducer(state, {type: types.PREVIOUS_TABLE_CREATION_PAGE});
            expect(state.dialogPage).toBe(0);
        });

        it('return updated page state table menu open', () => {

            const state = reducer(initialState, {type: types.TABLE_CREATION_MENU_OPEN});
            expect(state.menuOpen).toBe(true);
        });

        it('return updated page state table menu open', () => {

            let state = reducer(initialState, {type: types.TABLE_CREATION_MENU_OPEN});
            state = reducer(state, {type: types.TABLE_CREATION_MENU_CLOSED});
            expect(state.menuOpen).toBe(false);
        });

        it('return updated page state after programatic edit', () => {

            let action = {
                type: types.SET_TABLE_CREATION_PROPERTY,
                property: 'name',
                value: '',
                validationError: 'valueIsEmpty',
                isUserEdit: false
            };
            const state = reducer(initialState, action);
            expect(state.tableInfo.name.value).toBe('');
            expect(state.tableInfo.name.validationError).toBe('valueIsEmpty');
            expect(state.tableInfo.name.edited).toBeFalsy();

            expect(state.edited).toBeFalsy();
        });

        it('return updated page state after user edits', () => {

            let action = {
                type: types.SET_TABLE_CREATION_PROPERTY,
                property: 'name',
                value: 'newName',
                validationError: null,
                isUserEdit: true
            };
            const state = reducer(initialState, action);
            expect(state.tableInfo.name.value).toBe('newName');
            expect(state.tableInfo.name.validationError).toBe(null);
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

        it('return updated notification state', () => {
            const state = reducer(initialState, {type: types.NOTIFY_TABLE_CREATED, notifyTableCreated: true});

            expect(state.notifyTableCreated).toBe(true);
        });
    });


});

