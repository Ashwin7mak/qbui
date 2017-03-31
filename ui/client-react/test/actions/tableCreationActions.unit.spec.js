import * as actions from '../../src/actions/tableCreationActions';
import * as types from '../../src/actions/types';
import {__RewireAPI__ as TableCreationsActionsRewireAPI} from '../../src/actions/tableCreationActions';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Promise from 'bluebird';

describe('Table Creation actions', () => {

    let switchesResponseData = [
        {'Feature A': true},
        {'Feature B': false}
    ];

    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    class mockTableService {
        constructor() { }
        createTableComponents(appId, tableInfo) {
            return Promise.resolve({data: 'newTableId'});
        }
    }

    class mockTableFailureService {
        constructor() { }
        createTableComponents(appId, tableInfo) {
            return Promise.reject({response: {status: 500}});
        }
    }

    beforeEach(() => {
        TableCreationsActionsRewireAPI.__Rewire__('TableService', mockTableService);
    });

    afterEach(() => {
        TableCreationsActionsRewireAPI.__ResetDependency__('mockTableService');
    });


    it('should create an action for showing the dialog', () => {
        expect(actions.showTableCreationDialog()).toEqual({type: types.SHOW_TABLE_CREATION_DIALOG});
    });

    it('should create an action for hiding the dialog', () => {
        expect(actions.hideTableCreationDialog()).toEqual({type: types.HIDE_TABLE_CREATION_DIALOG});
    });

    it('should create an action for navigating next', () => {
        expect(actions.nextTableCreationPage()).toEqual({type: types.NEXT_TABLE_CREATION_PAGE});
    });

    it('should create an action for navigating previous', () => {
        expect(actions.previousTableCreationPage()).toEqual({type: types.PREVIOUS_TABLE_CREATION_PAGE});
    });

    it('should create an action for opened table menu', () => {
        expect(actions.tableMenuOpened()).toEqual({type: types.TABLE_CREATION_MENU_OPEN});
    });

    it('should create an action for closed table menu', () => {
        expect(actions.tableMenuClosed()).toEqual({type: types.TABLE_CREATION_MENU_CLOSED});
    });

    it('should create an action for setting the editing property', () => {
        expect(actions.setEditingProperty('description')).toEqual({type: types.SET_EDITING_PROPERTY, editing: 'description'});
    });

    it('should create an action for setting the editing property', () => {
        const expected = {
            type: types.SET_TABLE_CREATION_PROPERTY, property: 'name', value:'newName', validationError: 'badInput', isUserEdit: false
        };
        expect(actions.setTableProperty('name', 'newName', 'badInput', false)).toEqual(expected);
    });

    it('should create an action for saving table', () => {
        expect(actions.savingTable('description')).toEqual({type: types.SAVING_TABLE});
    });

    it('should create an action for saving table failed', () => {
        expect(actions.savingTableFailed('description')).toEqual({type: types.SAVING_TABLE_FAILED});
    });
    it('should create an action for created table', () => {
        expect(actions.createdTable('description')).toEqual({type: types.CREATED_TABLE});
    });

    it('should create an action for setting the editing property', () => {
        expect(actions.setEditingProperty('description')).toEqual({type: types.SET_EDITING_PROPERTY, editing: 'description'});
    });

    it('creates table', (done) => {

        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.

        const expectedActions = [
            {type: types.SAVING_TABLE},
            {type: types.CREATED_TABLE}
        ];
        const store = mockStore({});

        return store.dispatch(actions.createTable('appId', {name: 'Record', tableNoun: 'record', description: 'description'})).then(
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });

    it('fails to create table', (done) => {

        TableCreationsActionsRewireAPI.__Rewire__('TableService', mockTableFailureService);

        const expectedActions = [
            {type: types.SAVING_TABLE},
            {type: types.CREATED_TABLE}
        ];
        const store = mockStore({});

        return store.dispatch(actions.createTable('appId', {name: 'Record', tableNoun: 'record', description: 'description'})).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                done();
            });

    });
    it('should create an action for notifying of table creation', () => {
        expect(actions.notifyTableCreated(true)).toEqual({type: types.NOTIFY_TABLE_CREATED, notifyTableCreated: true});
    });
});
