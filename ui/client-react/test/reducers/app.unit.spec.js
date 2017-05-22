import reducer from '../../src/reducers/app';
import * as AppReducer from '../../src/reducers/app';
import * as types from '../../src/actions/types';
import _ from 'lodash';

let storeState = {};

function initializeState() {
    return {
        app: null,
        apps: [],
        loading: false,
        error: false
    };
}

beforeEach(() => {
    storeState = initializeState();
});

describe('Test app reducer', () => {
    it('return default state', () => {
        expect(reducer(undefined, {})).toEqual(storeState);
    });
});

describe('Test app reducer - clear selected app tests', () => {
    const appTests = [
        {'name': 'clear selected app: initial state'},
        {'name': 'clear selected app: with apps list and no selected app', apps: ['some apps']},
        {'name': 'clear selected app: with apps list and selected app', apps: ['some apps'], selectedApp: '1'},
        {'name': 'clear selected app: with apps and selected app and table', apps: ['some apps'], selectedApp: '1', selectedTable: '2'}
    ];

    appTests.forEach(testCase => {
        it(testCase.name, () => {
            if (testCase.apps) {
                storeState.apps = testCase.apps;
            }
            if (testCase.selectedApp) {
                storeState.selected = {
                    appId: testCase.selectedApp,
                    tblId: testCase.selectedTable || null
                };
            }

            const expectedState = {
                ...storeState,
                apps: testCase.apps || [],
                selected: {
                    appId: null,
                    tblId: null
                }
            };

            const state = reducer(storeState, {type: types.CLEAR_SELECTED_APP});
            expect(state).toEqual(expectedState);
        });
    });
});

describe('Test app reducer - clear selected app table tests', () => {
    const appTests = [
        {'name': 'clear selected app table: initial state'},
        {'name': 'clear selected app table: with apps list and no selected app', apps: ['some apps']},
        {'name': 'clear selected app table: with apps list and selected app', apps: ['some apps'], selectedApp: '1'},
        {'name': 'clear selected app table: with apps and selected app and table', apps: ['some apps'], selectedApp: '1', selectedTable: '2'}
    ];

    appTests.forEach(testCase => {
        it(testCase.name, () => {
            //  set store with state changes
            if (testCase.apps) {
                storeState.apps = testCase.apps;
            }
            if (testCase.selectedApp) {
                storeState.selected = {
                    appId: testCase.selectedApp,
                    tblId: testCase.selectedTable || null
                };
            }

            const expectedState = {
                ...storeState,
                apps: testCase.apps || [],
                selected: {
                    appId: testCase.selectedApp || null,
                    tblId: null
                }
            };

            const state = reducer(storeState, {type: types.CLEAR_SELECTED_APP_TABLE});
            expect(state).toEqual(expectedState);
        });
    });
});

describe('Test app reducer - select app table tests', () => {
    const appTests = [
        {'name': 'select app table: initial state'},
        {'name': 'select app table: with app and tbl id', appId: '1', tblId: '2'}
    ];
    appTests.forEach(testCase => {
        it(testCase.name, () => {
            const expectedState = {
                ...storeState,
                selected: {
                    appId: testCase.appId || null,
                    tblId: testCase.tblId || null
                }
            };
            const state = reducer(storeState, {type: types.SELECT_APP_TABLE, content:{appId: testCase.appId, tblId: testCase.tblId}});
            expect(state).toEqual(expectedState);
        });
    });
});

describe('Test app reducer - update app table properties', () => {
    const appTests = [
        {'name': 'update table properties for an app', appId: '1', tblId: '2', table: {id:'2', tableData:'some new table data'}, expectation: true},
        {'name': 'update table properties for an app not found in store', appId: '10', tblId: '2', table: {id:'2', tableData:'some new table data'}, expectation: false},
        {'name': 'update table properties for a table not found in store', appId: '1', tblId: '20', table: {id:'2', tableData:'some new table data'}, expectation: false}
    ];
    appTests.forEach(testCase => {
        it(testCase.name, () => {
            storeState.apps = [{
                id: '1',
                tables: [{
                    id: '2',
                    tableData: 'some old table data'
                }]
            }];

            const state = reducer(storeState, {type: types.UPDATE_APP_TABLE_PROPS, content:{appId: testCase.appId, tblId: testCase.tblId, tableData: testCase.table}});

            //  find the app in the new state
            const app = AppReducer.getApp(state, testCase.appId);
            if (app && testCase.expectation === true) {
                const table = app.tables[0];
                expect(table).toEqual(testCase.table);
            } else {
                // store should be unchanged
                expect(_.isEqual(storeState, state)).toBe(true);
            }
        });
    });
});
