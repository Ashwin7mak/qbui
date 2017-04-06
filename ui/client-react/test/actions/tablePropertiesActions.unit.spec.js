import * as actions from '../../src/actions/tablePropertiesActions';
import * as types from '../../src/actions/types';
import {__RewireAPI__ as TablePropertiesActionsRewireAPI} from '../../src/actions/tablePropertiesActions';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Promise from 'bluebird';

describe('Table properties actions', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    class mockTableService {
        constructor() { }
        updateTable(appId, tableId, tableInfo) {
            return Promise.resolve({data: 'newTableId'});
        }
    }

    class mockTableFailureService {
        constructor() { }
        updateTable(appId, tableId, tableInfo) {
            return Promise.reject({response: {status: 500}});
        }
    }

    beforeEach(() => {
        TablePropertiesActionsRewireAPI.__Rewire__('TableService', mockTableService);
    });

    afterEach(() => {
        TablePropertiesActionsRewireAPI.__ResetDependency__('mockTableService');
    });


    it('should create an action for updating the table', () => {
        expect(actions.updatingTable()).toEqual({type: types.UPDATING_TABLE});
    });

    it('should create an action for failed update on a table', () => {
        expect(actions.updatingTableFailed()).toEqual({type: types.UPDATING_TABLE_FAILED});
    });

    it('should create an action for updated table', () => {
        let tableInfo = {};
        expect(actions.updatedTable(tableInfo)).toEqual({type: types.UPDATED_TABLE, tableInfo});
    });

    it('should create an action for loaded table props', () => {
        expect(actions.loadedTable({})).toEqual({type: types.LOADED_TABLE_PROPS, tableInfo: {}});
    });

    it('should create an action for setting the editing property', () => {
        expect(actions.setEditingProperty('description')).toEqual({type: types.SET_PROPS_EDITING_PROPERTY, editing: 'description'});
    });

    it('should create an action for setting the editing property', () => {
        const expected = {
            type: types.SET_TABLE_PROPS, property: 'name', value:'newName', validationError: 'badInput', isUserEdit: false
        };
        expect(actions.setTableProperty('name', 'newName', 'badInput', false)).toEqual(expected);
    });

    it('updated table', (done) => {

        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.

        const tableInfo = {name: 'Record', tableNoun: 'record', description: 'description'};
        const expectedActions = [
            {type: types.UPDATING_TABLE},
            {type: types.UPDATED_TABLE, tableInfo}
        ];
        const store = mockStore({});

        return store.dispatch(actions.updateTable('appId', 'tableId', tableInfo)).then(
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });

    it('fails to update table', (done) => {

        TablePropertiesActionsRewireAPI.__Rewire__('TableService', mockTableFailureService);

        const store = mockStore({});

        return store.dispatch(actions.updateTable('appId', 'tableId', {name: 'Record', tableNoun: 'record', description: 'description'})).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                done();
            });
    });

    it('loadTableProperties for table', (done) => {

        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.

        const expectedActions = [
            {type: types.LOADED_TABLE_PROPS, tableInfo: {name: 'name', tableNoun: 'noun', description: '', tableIcon: 'Spreadsheet'}}
        ];
        const store = mockStore({});

        store.dispatch(actions.loadTableProperties({name: 'name'}));
        expect(store.getActions()).toEqual(expectedActions);
        done();
    });
});
