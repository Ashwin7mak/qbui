import * as types from '../actions/types';
import _ from 'lodash';
import AppModel from '../models/appModel';
import AppsModel from '../models/appsModel';

const app = (
    // default state
    state = {
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
    function getAppsFromState(newApp = null) {
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

    // reducer - no mutations!
    switch (action.type) {
    case types.CLEAR_APP:
        return {
            ...state,
            loading: false,
            error: false,
            selected: {
                appId: null
            }
        };
    case types.CLEAR_APP_TABLE:
        // make a copy of what is selected
        const selected = _.cloneDeep(state.selected);
        selected.tableId = null;

        return {
            ...state,
            selected: selected
        };
    case types.LOAD_APP:
        let appId = action.context;
        return {
            ...state,
            loading: true,
            error: false,
            selected: {
                appId: appId
            }
        };
    case types.LOAD_APP_SUCCESS:
        let appModel = new AppModel(action.content);
        return {
            ...state,
            loading: false,
            error: false,
            selected: {
                appId: appModel.getApp().id,
                tableId: null,
                appUsers: appModel.getUsers(),
                appUsersUnfiltered: appModel.getUnfilteredUsers()
            },
            apps: getAppsFromState(appModel.getApp())
        };
    case types.LOAD_APP_ERROR:
        return {
            ...state,
            loading: false,
            error: true
        };
    case types.SELECT_APP_TABLE:
        const tableId = action.content.tableId;
        // make a copy of what is selected
        const selected = _.cloneDeep(state.selected);
        selected.tableId = tableId;

        return {
            ...state,
            selected: selected
        };
    case types.LOAD_APPS:
        return {
            loading: true,
            error: false,
            apps: []
        };
    case types.LOAD_APPS_SUCCESS:
        let appsModel = new AppsModel(action.content);
        return {
            loading: false,
            error: false,
            apps: appsModel.getApps()
        };
    case types.LOAD_APPS_ERROR:
        return {
            loading: false,
            error: true,
            apps: []
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

export const getSelectedAppUsers = (state) => {
    return state.selected ? state.selected.appUsers : null;
};

export const getSelectedAppUnfilteredUsers = (state) => {
    return state.selected ? state.selected.appUsersUnfiltered : null;
};


