import * as types from '../actions/types';
import _ from 'lodash';
import AppModel from '../models/appModel';
import AppsModel from '../models/appsModel';

const app = (
    // default state
    state = {
        app: null,
        apps: [],
        areAppsLoading: true, // Defaulting to true prevents flashing of unloaded state
        isAppLoading: true, // Separate loading state so that the appHomePage doesn't show a partially loaded state when apps returns on first page load.
        error: false
    },
    action) => {

    /**
     * Create a deep clone of the state apps array.  If the new app
     * is not found, add to the end of the array.  Otherwise, replace
     * the existing entry with its new state.
     *
     * @param newApp
     * @returns {*}
     */
    function setAppInApps(newApp = null) {
        // reducer - no mutations against current state!
        const apps = _.cloneDeep(state.apps);

        //  if no app is passed, then just return the cloned copy of apps
        if (newApp) {
            //  does the state already hold an entry for the app
            const index = _.findIndex(apps, (a) => a.id === newApp.id);

            //  append or replace obj into the cloned copy
            if (index !== -1) {
                apps[index] = newApp;
            } else {
                apps.push(newApp);
            }
        }

        return apps;
    }

    function clearTableSelected() {
        let selected = _.cloneDeep(state.selected);
        if (!selected) {
            selected = clearSelected();
        } else {
            selected.tblId = null;
        }
        return selected;
    }

    function clearSelected() {
        return {
            appId: null,
            tblId: null
        };
    }

    function setSelectedApp(appId) {
        let selected = _.cloneDeep(state.selected);
        if (!selected) {
            selected = {};
        }

        //  only update if appId does not match currently selected as want to
        //  preserve the table selection if one is set
        if (selected.appId !== appId) {
            selected.appId = appId;
            selected.tblId = null;
        }

        return selected;
    }

    function setSelected(appId = null, tblId = null) {
        // reducer - no mutations against current state!
        let selected = _.cloneDeep(state.selected);
        if (!selected) {
            selected = {};
        }

        selected.appId = appId;
        selected.tblId = tblId;

        return selected;
    }

    function setAppOwner(appOwner) {
        let selected = _.cloneDeep(state.selected);
        if (!selected) {
            selected = {};
        }
        selected.appOwner = appOwner;
        return selected;
    }

    // reducer - no mutations!
    switch (action.type) {
    case types.CLEAR_SELECTED_APP:
        return {
            ...state,
            isAppLoading: false,
            error: false,
            app: null,
            selected: clearSelected()
        };
    case types.CLEAR_SELECTED_APP_TABLE:
        return {
            ...state,
            isAppLoading: false,
            error: false,
            selected: clearTableSelected()
        };
    case types.SELECT_APP_TABLE:
        return {
            ...state,
            selected: setSelected(action.content.appId, action.content.tblId)
        };
    case types.UPDATE_APP_TABLE_PROPS:
        let appsClone = _.cloneDeep(state.apps);
        //  find the app
        let appToUpdateIdx = _.findIndex(appsClone, (a) => a.id === action.content.appId);
        if (appToUpdateIdx !== -1) {
            let appToUpdate = appsClone[appToUpdateIdx];
            // find the table and replace
            let tableToUpdateIdx = _.findIndex(appToUpdate.tables, (t) => t.id === action.content.tblId);
            if (tableToUpdateIdx !== -1) {
                appToUpdate.tables[tableToUpdateIdx] = action.content.tableInfo;
                return {
                    ...state,
                    app: appToUpdate,
                    apps: setAppInApps(appToUpdate)
                };
            }
        }
        return state;
    case types.LOAD_APP:
        let appId = action.content.appId;
        return {
            ...state,
            isAppLoading: true,
            error: false,
            app: null,
            selected: setSelectedApp(appId)
        };
    case types.LOAD_APP_SUCCESS:
        let appModel = new AppModel(action.content);
        return {
            ...state,
            isAppLoading: false,
            error: false,
            app: appModel.getApp(),
            //  update app in apps list
            apps: setAppInApps(appModel.getApp()),
            selected: setSelectedApp(appModel.getApp().id)
        };
    case types.LOAD_APP_ERROR:
        return {
            ...state,
            isAppLoading: false,
            error: true,
            app: null,
            selected: setSelected()
        };
    case types.LOAD_APPS:
        return {
            ...state,
            areAppsLoading: true,
            error: false,
            app: null,
            apps: [],
            selected: clearSelected()
        };
    case types.LOAD_APPS_SUCCESS:
        let appsModel = new AppsModel(action.content);
        return {
            ...state,
            areAppsLoading: false,
            error: false,
            app: null,
            apps: appsModel.getApps(),
            selected: clearSelected()
        };
    case types.CREATE_APP_SUCCESS:
        //  new app was created in builder..add it to apps list and select
        if (action.app) {
            let newAppModel = new AppModel({app: action.app});
            return {
                ...state,
                app: newAppModel.getApp(),
                apps: setAppInApps(newAppModel.getApp())
            };
        }
        return state;
    case types.LOAD_APPS_ERROR:
        return {
            ...state,
            areAppsLoading: false,
            error: true,
            app: null,
            apps: [],
            selected: clearSelected()
        };
    case types.LOAD_APP_OWNER:
        return {
            ...state,
            isAppLoading: true,
            error: false
        };
    case types.LOAD_APP_OWNER_SUCCESS:
        return {
            ...state,
            isAppLoading: false,
            error: false,
            selected: setAppOwner(action.content)
        };
    case types.LOAD_APP_OWNER_ERROR:
        return {
            ...state,
            isAppLoading: false,
            error: true
        };
    case types.ASSIGN_USERS_TO_APP_ROLE:
        //  update the users for the app in the store
        if (state.app) {
            let model = new AppModel();
            model.setApp(_.clone(state.app));
            model.setUsers(action.content.appUsers[0]);
            model.setUnfilteredUsers(action.content.appUsers[1]);

            return {
                ...state,
                app: model.getApp(),
                apps: setAppInApps(model.getApp())
            };
        }
        return state;
    case types.REMOVE_USERS_FROM_APP_ROLE:
        const roleId = action.content.roleId;
        const userIds = action.content.userIds;

        let model = new AppModel();
        model.setApp(_.clone(state.app));

        let appUsers = model.getUsers();
        let unfilteredUsers = model.getUnfilteredUsersByRole(roleId);

        userIds.forEach(userId => {
            appUsers = appUsers.filter(function(obj) {
                return obj.userId !== userId;
            });
            unfilteredUsers = unfilteredUsers.filter(function(obj) {
                return obj.userId !== userId;
            });
        });

        model.setUsers(appUsers);
        model.setUnfilteredUsersByRole(unfilteredUsers, roleId);

        return {
            ...state,
            app: model.getApp(),
            apps: setAppInApps(model.getApp())
        };
    default:
        return state;
    }
};
export default app;

export const getApps = (state) => {
    return state.app.apps;
};

export const getApp = (state, appId) => {
    return _.find(state.app.apps, (a) => a.id === appId) || null;
};

export const getTable = (state, appId, tableId) => {
    let appInState = getApp(state, appId);
    if (!appInState) {
        return null;
    }
    return _.find(appInState.tables, {id: tableId}) || null;
};

export const getAreAppsLoading = state => state.app.areAppsLoading;

export const getIsAppLoading = state => state.app.isAppLoading;

export const getSelectedAppId = (state) => {
    return _.get(state.app, 'selected.appId');
};

export const getSelectedApp = (state) => {
    if (!state.app.apps) {
        return null;
    }

    return state.app.apps.find(currentApp => currentApp.id === getSelectedAppId(state));
};

export const getSelectedTableId = (state) => {
    return state.app.selected ? state.app.selected.tblId : null;
};

export const getAppUsers = (state) => {
    let appUsers = [];
    if (state.app.app) {
        let appModel = new AppModel();
        appModel.setApp(state.app.app);
        appUsers = appModel.getUsers();
    }
    return appUsers;
};

export const getAppUnfilteredUsers = (state) => {
    let appUnfilteredUsers = [];
    if (state.app.app) {
        let appModel = new AppModel();
        appModel.setApp(state.app.app);
        appUnfilteredUsers = appModel.getUnfilteredUsers();
    }
    return appUnfilteredUsers;
};

export const getAppOwner = (state) => {
    return state.app.selected ? state.app.selected.appOwner : null;
};


