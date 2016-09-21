import * as actions from '../constants/actions';

import Fluxxor from 'fluxxor';
import Logger from '../utils/logger';
var logger = new Logger();
import TableIconUtils from '../utils/tableIconUtils';

let AppsStore = Fluxxor.createStore({

    initialize: function() {
        this.apps = [];
        this.appUsers = [];
        this.loading = false;
        this.error = false;

        this.bindActions(
            actions.LOAD_APPS, this.onLoadApps,
            actions.LOAD_APPS_SUCCESS, this.onLoadAppsSuccess,
            actions.LOAD_APPS_FAILED, this.onLoadAppsFailed,
            actions.SELECT_APP, this.onSelectApp,
            actions.SELECT_TABLE, this.onSelectTable,
            actions.LOAD_APP_USERS_SUCCESS, this.onLoadAppUsersSuccess
        );

        this.logger = new Logger();
    },
    onLoadApps: function() {
        this.loading = true;
        this.emit("change");
    },
    onLoadAppsFailed: function() {
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
    onLoadAppsSuccess: function(apps) {

        this.loading = false;
        this.error = false;

        this.apps = apps;
        this.setTableIcons();

        this.emit('change');
    },
    onLoadAppUsersSuccess: function(users) {
        this.appUsers = users;
        this.emit('change');
    },
    onSelectApp: function(appId) {
        this.selectedAppId = appId;

        this.emit('change');
    },
    onSelectTable: function(tblId) {
        this.selectedTableId = tblId;

        this.emit('change');
    },
    getState: function() {
        return {
            apps: this.apps,
            selectedAppId: this.selectedAppId,
            appUsers: this.appUsers,
            selectedTableId: this.selectedTableId,
            loading: this.loading,
            error: this.error
        };
    },
});

export default AppsStore;
