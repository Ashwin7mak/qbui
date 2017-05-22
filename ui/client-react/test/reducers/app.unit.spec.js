import reducer from '../../src/reducers/app';
import AppModel from '../../src/models/appModel';
import AppsModel from '../../src/models/appsModel';
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

describe('Test app reducer - initial state', () => {
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
            expect(AppReducer.getSelectedAppId(state)).toEqual(expectedState.selected.appId);
            expect(AppReducer.getSelectedTableId(state)).toEqual(expectedState.selected.tblId);
        });
    });
});

describe('Test app reducer - update app table properties', () => {
    const appTests = [
        {'name': 'update table properties for an app', appId: '1', tblId: '2', table: {id:'2', tableData:'some new table data'}, storeUpdated: true},
        {'name': 'update table properties for an app not found in store', appId: '10', tblId: '2', table: {id:'2', tableData:'some new table data'}, storeUpdated: false},
        {'name': 'update table properties for a table not found in store', appId: '1', tblId: '20', table: {id:'2', tableData:'some new table data'}, storeUpdated: false}
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
            if (app && testCase.storeUpdated === true) {
                const table = app.tables[0];
                expect(table).toEqual(testCase.table);
            } else {
                // store should be unchanged
                expect(_.isEqual(storeState, state)).toBe(true);
            }
        });
    });
});

describe('Test app reducer - load an app', () => {
    it('test start load of app', () => {
        const appId = '1';
        const state = reducer(storeState, {type: types.LOAD_APP, content:{appId: appId}});

        expect(state.loading).toBe(true);
        expect(AppReducer.getIsAppsLoading(state)).toBe(true);
        expect(state.error).toBe(false);
        expect(state.app).toEqual(null);
        expect(state.selected.appId).toEqual(appId);
        expect(AppReducer.getSelectedAppId(state)).toEqual(appId);
        expect(AppReducer.getSelectedAppUsers(state)).toEqual([]);
        expect(AppReducer.getSelectedAppUnfilteredUsers(state)).toEqual({});
    });

    it('test successful load of app', () => {
        const appId = '1';
        const appData = {
            users: [
                [{id: appId}],
                {}
            ],
            app: {
                id: '1',
                tables: [{
                    id: '2',
                    tableData: 'some old table data'
                }]
            }
        };

        const appModel = new AppModel(appData);
        const app = appModel.get();

        const state = reducer(storeState, {type: types.LOAD_APP_SUCCESS, content:appData});
        expect(state.loading).toBe(false);
        expect(AppReducer.getIsAppsLoading(state)).toBe(false);
        expect(state.error).toBe(false);
        expect(state.app).toEqual(app);
        expect(state.apps).toEqual(AppReducer.getApps(state));
        expect(state.selected.appId).toEqual(appId);
        expect(AppReducer.getSelectedAppId(state)).toEqual(appId);
        expect(AppReducer.getSelectedAppUsers(state)).toEqual(app.users);
        expect(AppReducer.getSelectedAppUnfilteredUsers(state)).toEqual(app.unfilteredUsers);
    });

    it('test fail load of app', () => {
        const appId = '1';
        const state = reducer(storeState, {type: types.LOAD_APP_ERROR});

        expect(state.loading).toBe(false);
        expect(AppReducer.getIsAppsLoading(state)).toBe(false);
        expect(state.error).toBe(true);
        expect(state.app).toEqual(null);
        expect(state.selected.appId).toEqual(null);
        expect(AppReducer.getSelectedAppId(state)).toEqual(null);
        expect(AppReducer.getSelectedAppUsers(state)).toEqual([]);
        expect(AppReducer.getSelectedAppUnfilteredUsers(state)).toEqual({});
    });
});

describe('Test app reducer - load list of apps', () => {
    it('test start load of apps', () => {
        const appId = '1';
        const state = reducer(storeState, {type: types.LOAD_APPS});

        expect(state.loading).toBe(true);
        expect(AppReducer.getIsAppsLoading(state)).toBe(true);
        expect(state.error).toBe(false);
        expect(state.app).toEqual(null);
        expect(state.apps).toEqual([]);
        expect(AppReducer.getSelectedAppId(state)).toEqual(null);
    });

    it('test successful load of apps', () => {
        const appId = '1';
        const appsData = [
            {
                id: '1',
                tables: [{
                    id: '2',
                    tableData: 'some old table data'
                }]
            },
            {
                id: '2',
                tables: [{
                    id: '3',
                    tableData: 'some old table data'
                }]
            }
        ];

        const appsModel = new AppsModel(appsData);
        const apps = appsModel.getApps();

        const state = reducer(storeState, {type: types.LOAD_APPS_SUCCESS, content:appsData});
        expect(state.loading).toBe(false);
        expect(AppReducer.getIsAppsLoading(state)).toBe(false);
        expect(state.error).toBe(false);
        expect(state.app).toEqual(null);
        expect(state.apps).toEqual(AppReducer.getApps(state));
        expect(AppReducer.getSelectedAppId(state)).toEqual(null);
    });

    it('test fail load of apps', () => {
        const appId = '1';
        const state = reducer(storeState, {type: types.LOAD_APPS_ERROR});

        expect(state.loading).toBe(false);
        expect(AppReducer.getIsAppsLoading(state)).toBe(false);
        expect(state.error).toBe(true);
        expect(state.app).toEqual(null);
        expect(state.apps).toEqual([]);
        expect(state.selected.appId).toEqual(null);
        expect(AppReducer.getSelectedAppId(state)).toEqual(null);
        expect(AppReducer.getSelectedAppUsers(state)).toEqual([]);
        expect(AppReducer.getSelectedAppUnfilteredUsers(state)).toEqual({});
    });
});
