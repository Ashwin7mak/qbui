import * as actions from '../constants/actions';

import Fluxxor from 'fluxxor';
import Logger from '../utils/logger';
var logger = new Logger();
import TableIconUtils from '../utils/tableIconUtils';

let AppsStore = Fluxxor.createStore({

    initialize() {
        this.apps = null;
        this.appUsers = [];
        this.appUsersUnfiltered = {};
        this.appRoles = [];
        // Default is true because the apps must load before the website is usable
        this.loading = true;
        this.loadingAppUsers = false;
        this.error = false;

        this.bindActions(
            actions.LOAD_APPS, this.onLoadApps,
            actions.LOAD_APPS_SUCCESS, this.onLoadAppsSuccess,
            actions.LOAD_APPS_FAILED, this.onLoadAppsFailed,
            actions.SELECT_APP, this.onSelectApp,
            actions.SELECT_TABLE, this.onSelectTable,

            actions.LOAD_APP_USERS, this.onLoadAppUsers,
            actions.LOAD_APP_USERS_FAILED, this.onLoadAppUsersFailed,
            actions.LOAD_APP_USERS_SUCCESS, this.onLoadAppUsersSuccess,

            actions.LOAD_APP_ROLES, this.onLoadAppRoles,
            actions.LOAD_APP_ROLES_FAILED, this.onLoadAppRolesFailed,
            actions.LOAD_APP_ROLES_SUCCESS, this.onLoadAppRolesSuccess,
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
    /**
     * userArray is structured so that the filtered list of users is mapped for our userPicker in index 0
     * index 1 is the untouched response from Core's getAppUsers
     */
    onLoadAppUsersSuccess(userArray) {
        this.loadingAppUsers = false;
        this.appUsers = userArray[0];
        this.appUsersUnfiltered = userArray[1];
        this.emit('change');
    },
    onLoadAppRoles() {
        this.emit('change');
    },
    onLoadAppRolesFailed() {
        this.emit('change');
    },
    onLoadAppRolesSuccess(roles) {
        this.appRoles = roles;
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
    getState() {
        return {
            apps: this.apps,
            selectedAppId: this.selectedAppId,
            appUsers: this.appUsers,
            appUsersUnfiltered: this.appUsersUnfiltered,
            appRoles: this.appRoles,
            selectedTableId: this.selectedTableId,
            loading: this.loading,
            loadingAppUsers: this.loadingAppUsers,
            error: this.error
        };
    },
});

export default AppsStore;
