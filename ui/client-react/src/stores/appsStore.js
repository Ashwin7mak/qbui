import * as actions from '../constants/actions';

import Fluxxor from 'fluxxor';
import Logger from '../utils/logger';
var logger = new Logger();
import TableIconUtils from '../utils/tableIconUtils';

let AppsStore = Fluxxor.createStore({

    initialize() {
        this.apps = [];
        this.appUsers = [];
        // Default is true because the apps must load before the website is usable
        this.loading = true;
        this.loadingAppUsers = false;
        this.error = false;
        this.savingAppStack = false;

        this.bindActions(
            actions.LOAD_APPS, this.onLoadApps,
            actions.LOAD_APPS_SUCCESS, this.onLoadAppsSuccess,
            actions.LOAD_APPS_FAILED, this.onLoadAppsFailed,
            actions.SELECT_APP, this.onSelectApp,
            actions.SELECT_TABLE, this.onSelectTable,

            actions.LOAD_APP_USERS, this.onLoadAppUsers,
            actions.LOAD_APP_USERS_FAILED, this.onLoadAppUsersFailed,
            actions.LOAD_APP_USERS_SUCCESS, this.onLoadAppUsersSuccess,

            actions.SET_APP_STACK, this.onSetAppStack,
            actions.SET_APP_STACK_SUCCESS, this.onSetAppStackSuccess,
            actions.SET_APP_STACK_FAILED, this.onSetAppStackFailed
        );

        this.logger = new Logger();
    },
    onLoadApps() {
        this.loading = true;
        this.emit("change");
    },
    onLoadAppsFailed() {
        this.loading = false;
        this.error = true;
        this.emit("change");
    },
    setTableIcons() {
        this.apps.forEach((app) => {
            if (app.tables) {
                app.tables.forEach((table) => {
                    table.icon = TableIconUtils.getTableIcon(table.name);
                });
            }
        });
    },
    onLoadAppsSuccess(apps) {

        this.loading = false;
        this.error = false;

        this.apps = apps;
        this.setTableIcons();

        this.emit('change');
    },
    onLoadAppUsers() {
        this.loadingAppUsers = true;
        this.emit('change');
    },
    onLoadAppUsersFailed() {
        this.loadingAppUsers = false;
        this.emit('change');
    },
    onLoadAppUsersSuccess(users) {
        this.loadingAppUsers = false;
        this.appUsers = users;
        this.emit('change');
    },
    onSelectApp(appId) {
        this.selectedAppId = appId;

        this.emit('change');
    },
    onSelectTable(tblId) {
        this.selectedTableId = tblId;

        this.emit('change');
    },
    onSetAppStack() {
        this.savingAppStack = true;

        this.emit('change');
    },
    onSetAppStackSuccess(payload) {
        const {appId, openInV3} = payload;

        this.savingAppStack = false;

        const app = _.find(this.apps, {id: appId});

        if (app) {
            app.openInV3 = openInV3;
            this.emit('change');
        }
    },
    onSetAppStackFailed(payLoad) {
        this.savingAppStack = false;
        this.emit('change');
    },
    getState() {
        return {
            apps: this.apps,
            selectedAppId: this.selectedAppId,
            appUsers: this.appUsers,
            selectedTableId: this.selectedTableId,
            loading: this.loading,
            loadingAppUsers: this.loadingAppUsers,
            savingAppStack: this.savingAppStack,
            error: this.error
        };
    },
});

export default AppsStore;
