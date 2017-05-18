import * as types from '../actions/types';
import _ from 'lodash';
import AppsModel from '../models/appsModel';

const app = (
    // default state
    state = {
        apps: [],
        loading: false,
        error: false
    },
    action) => {

    // reducer - no mutations!
    switch (action.type) {
    case types.LOAD_APPS:
        return {
            loading: true,
            error: false,
            apps: []
        };
    case types.LOAD_APPS_SUCCESS:
        let model = new AppsModel(action.content);
        return {
            loading: false,
            error: false,
            apps: model.getApps()
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

export const getApp = (state, appId) => _.find(state.apps, (a) => a.id === appId);

export const getIsAppsLoading = (state) => {
    return state.loading;
};

