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

            const state = reducer(storeState, {type: types.UPDATE_APP_TABLE_PROPS, content:{appId: testCase.appId, tblId: testCase.tblId, tableInfo: testCase.table}});

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
        expect(AppReducer.getAppUsers(state)).toEqual([]);
        expect(AppReducer.getAppUnfilteredUsers(state)).toEqual([]);
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
        const app = appModel.getApp();

        const state = reducer(storeState, {type: types.LOAD_APP_SUCCESS, content:appData});
        expect(state.loading).toBe(false);
        expect(AppReducer.getIsAppsLoading(state)).toBe(false);
        expect(state.error).toBe(false);
        expect(state.app).toEqual(app);
        expect(state.apps).toEqual(AppReducer.getApps(state));
        expect(state.selected.appId).toEqual(appId);
        expect(AppReducer.getSelectedAppId(state)).toEqual(appId);
        expect(AppReducer.getAppUsers(state)).toEqual(app.users);
        expect(AppReducer.getAppUnfilteredUsers(state)).toEqual(app.unfilteredUsers);
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
        expect(AppReducer.getAppUsers(state)).toEqual([]);
        expect(AppReducer.getAppUnfilteredUsers(state)).toEqual([]);
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
        expect(AppReducer.getAppUsers(state)).toEqual([]);
        expect(AppReducer.getAppUnfilteredUsers(state)).toEqual([]);
    });
});

describe('Test app reducer - load app owner', () => {
    it('test start of load app owner', () => {
        const appId = '1';
        const state = reducer(storeState, {type: types.LOAD_APP_OWNER});

        expect(state.loading).toBe(true);
        expect(AppReducer.getIsAppsLoading(state)).toBe(true);
        expect(state.error).toBe(false);
        expect(state.app).toEqual(null);
        expect(state.apps).toEqual([]);
        expect(AppReducer.getAppOwner(state)).toEqual(null);
    });

    it('test successful load of app owner', () => {
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
        const appOwner = {id: 1, firstName: "Captain", lastName: "Obvious", email: "noyouremail@what.who"};
        const appModel = new AppModel(appData);
        const app = appModel.getApp();
        const state = reducer(reducer(storeState, {type: types.LOAD_APP_SUCCESS, content: appData}), {type: types.LOAD_APP_OWNER_SUCCESS, content: appOwner});
        expect(AppReducer.getAppOwner(state)).toEqual(appOwner);
    });

    it('test fail load of app owner', () => {
        const appId = '1';
        const state = reducer(storeState, {type: types.LOAD_APP_OWNER_ERROR});

        expect(state.loading).toBe(false);
        expect(AppReducer.getIsAppsLoading(state)).toBe(false);
        expect(state.error).toBe(true);
        expect(state.app).toEqual(null);
        expect(state.apps).toEqual([]);
        expect(AppReducer.getAppOwner(state)).toEqual(null);
    });
});

describe('Test app reducer - add/remove users from app', () => {
    it('test adding users to the app', () => {
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
        const users = [{"userId": 1}];
        const unfilteredUsers = {"1": [{"userId": 1}]};
        const state = reducer(reducer(storeState, {type: types.LOAD_APP_SUCCESS, content: appData}), {type: types.ASSIGN_USERS_TO_APP_ROLE, content: {appUsers: [users, unfilteredUsers]}});

        expect(AppReducer.getAppUsers(state)).toEqual(users);
        expect(AppReducer.getAppUnfilteredUsers(state)).toEqual(unfilteredUsers);
    });

    it('test removing users from the app', () => {
        //first we need to add users to the app
        const appId = '1';
        const roleId = '11';
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
        const users = [
            {"userId": 1, firstName: "Ghost"},
            {"userId": 2, firstName: "Pepper"},
            {"userId": 3, firstName: "Jalepeno"},
            {"userId": 4, firstName: "Cucumber"}
        ];
        const unfilteredUsers = {"11": [{"userId": 1, firstName: "Ghost"},
                                     {"userId": 2, firstName: "Pepper"},
                                     {"userId": 3, firstName: "Jalepeno"},
                                     {"userId": 4, firstName: "Cucumber"}]};
        const usersRemoved = [
            {"userId": 1, firstName: "Ghost"},
            {"userId": 4, firstName: "Cucumber"}
        ];
        const unfilteredRemoved = {"11": [{"userId": 1, firstName: "Ghost"},
                                          {"userId": 4, firstName: "Cucumber"}]};
        let usersAddedState = reducer(reducer(storeState, {type: types.LOAD_APP_SUCCESS, content: appData}), {type: types.ASSIGN_USERS_TO_APP_ROLE, content: {appUsers: [users, unfilteredUsers]}});
        //now we need to remove them
        let usersToRemove = [2, 3];
        let usersRemovedState = reducer(usersAddedState, {type: types.REMOVE_USERS_FROM_APP_ROLE, content: {roleId: roleId, userIds: usersToRemove}});
        expect(AppReducer.getAppUsers(usersRemovedState)).toEqual(usersRemoved);
        expect(AppReducer.getAppUnfilteredUsers(usersRemovedState)).toEqual(unfilteredRemoved);
    });
});

describe('Test App Creation', () => {
    it('test show app creation dialog', () => {
        const state = reducer(storeState, {type: types.SHOW_APP_CREATION_DIALOG});

        expect(state.dialogOpen).toBe(true);
    });
});
