import * as types from '../actions/types';
import _ from 'lodash';
import AppModel from '../models/appModel';
import AppsModel from '../models/appsModel';

const app = (
    // default state
    state = {
        app: null,
        apps: [],
        loading: false,
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

    // reducer - no mutations!
    switch (action.type) {
    case types.CLEAR_SELECTED_APP:
        return {
            ...state,
            loading: false,
            error: false,
            app: null,
            selected: clearSelected()
        };
    case types.CLEAR_SELECTED_APP_TABLE:
        return {
            ...state,
            loading: false,
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
                appToUpdate.tables[tableToUpdateIdx] = action.content.tableData;
            }
        }
        return {
            ...state,
            apps: appsClone
        };
    case types.LOAD_APP:
        let appId = action.content.appId;
        return {
            ...state,
            loading: true,
            error: false,
            app: null,
            selected: setSelected(appId)
        };
    case types.LOAD_APP_SUCCESS:
        let appModel = new AppModel(action.content);
        return {
            ...state,
            loading: false,
            error: false,
            app: appModel.get(),
            //  update app in apps list
            apps: setAppInApps(appModel.getApp()),
            selected: setSelected(appModel.getApp().id)
        };
    case types.LOAD_APP_ERROR:
        return {
            ...state,
            loading: false,
            error: true,
            app: null,
            selected: setSelected()
        };
    case types.LOAD_APPS:
        return {
            loading: true,
            error: false,
            app: null,
            apps: [],
            selected: clearSelected()
        };
    case types.LOAD_APPS_SUCCESS:
        let appsModel = new AppsModel(action.content);
        return {
            loading: false,
            error: false,
            app: null,
            apps: appsModel.getApps(),
            selected: clearSelected()
        };
    case types.LOAD_APPS_ERROR:
        return {
            loading: false,
            error: true,
            app: null,
            apps: [],
            selected: clearSelected()
        };
    default:
        return state;
    }
};
export default app;

export const getApps = (state) => {
    return state.apps;
};

export const getApp = (state, appId) => {
    return _.find(state.apps, (a) => a.id === appId) || null;
};

export const getIsAppsLoading = (state) => {
    return state.loading;
};

export const getSelectedAppId = (state) => {
    return state.selected ? state.selected.appId : null;
};

export const getSelectedTableId = (state) => {
    return state.selected ? state.selected.tblId : null;
};

export const getSelectedAppUsers = (state) => {
    return state.app ? state.app.users : [];
};

export const getSelectedAppUnfilteredUsers = (state) => {
    return state.app ? state.app.unfilteredUsers : {};
};


