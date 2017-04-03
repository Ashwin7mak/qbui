import reducer from '../../src/reducers/tableProperties';
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
        menuOpen: false,
        savingTable: false,
        tableInfo: defaultTableInfo,
        edited: false,
        editing: null
    };
}

beforeEach(() => {
    initializeState();
});

describe('Test table properties reducers', () => {

    describe('Test initial state of table properties reducer', () => {
        it('return correct initial state', () => {
            expect(reducer(undefined, {})).toEqual(initialState);
        });
    });

    describe('Test table properties states', () => {
        it('return updated page state after programatic edit', () => {

            let action = {
                type: types.SET_TABLE_PROPS,
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
                type: types.SET_TABLE_PROPS,
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

            let state = reducer(initialState, {type: types.SET_PROPS_EDITING_PROPERTY, editing: 'description'});

            expect(state.editing).toBe('description');
        });


        it('return updating saving', () => {
            const state = reducer(initialState, {type: types.UPDATING_TABLE});
            expect(state.savingTable).toBe(true);
        });

        it('return updated table', () => {
            let state = reducer(initialState, {type: types.UPDATING_TABLE});
            state = reducer(state, {type: types.UPDATED_TABLE});
            expect(state.savingTable).toBe(false);
        });

        it('return updating table failed', () => {
            let state = reducer(initialState, {type: types.UPDATING_TABLE});
            state = reducer(state, {type: types.UPDATING_TABLE_FAILED});
            expect(state.savingTable).toBe(false);
        });

        it('return loaded table props', () => {
            let state = reducer(initialState, {type: types.LOADED_TABLE_PROPS, tableInfo: {description: 'description'}});
            expect(state.tableInfo.description).toEqual({value: 'description', validationError: undefined, edited: undefined});
        });

    });


});

