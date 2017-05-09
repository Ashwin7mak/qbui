import * as actions from '../constants/actions';
import Locale from '../../../reuse/client/src/locales/locale';
import Fluxxor from 'fluxxor';
import Logger from '../utils/logger';
var logger = new Logger();
import TableIconUtils from '../utils/tableIconUtils';
import NotificationManager from '../../../reuse/client/src/scripts/notificationManager';

import _ from 'lodash';

let AppsStore = Fluxxor.createStore({

    initialize() {
        this.apps = null;
        this.appUsers = [];
        this.appUsersUnfiltered = {};
        this.appRoles = [];
        this.appOwner = {};
        // Default is true because the apps must load before the website is usable
        this.loading = true;
        this.loadingAppUsers = false;
        this.error = false;
        this.selectedUserRows = [];

        this.bindActions(
            actions.LOAD_APP, this.onLoadApps,
            actions.LOAD_APP_SUCCESS, this.onLoadAppSuccess,
            actions.LOAD_APP_FAILED, this.onLoadAppsFailed,

            actions.LOAD_APPS, this.onLoadApps,
            actions.LOAD_APPS_SUCCESS, this.onLoadAppsSuccess,
            actions.LOAD_APPS_FAILED, this.onLoadAppsFailed,
            actions.SELECT_APP, this.onSelectApp,
            actions.SELECT_TABLE, this.onSelectTable,
            actions.UPDATED_TABLE_PROPS, this.onUpdateTableProps,

            actions.LOAD_APP_USERS, this.onLoadAppUsers,
            actions.LOAD_APP_USERS_FAILED, this.onLoadAppUsersFailed,
            actions.LOAD_APP_USERS_SUCCESS, this.onLoadAppUsersSuccess,

            actions.LOAD_APP_ROLES, this.onLoadAppRoles,
            actions.LOAD_APP_ROLES_FAILED, this.onLoadAppRolesFailed,
            actions.LOAD_APP_ROLES_SUCCESS, this.onLoadAppRolesSuccess,

            actions.LOAD_APP_OWNER, this.onLoadAppOwner,
            actions.LOAD_APP_OWNER_FAILED, this.onLoadAppOwnerFailed,
            actions.LOAD_APP_OWNER_SUCCESS, this.onLoadAppOwnerSuccess,

            actions.SELECT_USERS_DETAILS, this.onSelectedRows,

            actions.UNASSIGN_USERS, this.onUnasssignUsers,
            actions.UNASSIGN_USERS_FAILED, this.onUnasssignUsersFail,
            actions.UNASSIGN_USERS_SUCCESS, this.onUnasssignUsersSuccess,
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
                    if (!table.tableIcon) {
                        table.tableIcon = TableIconUtils.getTableIcon(table.name);
                    }
                });
            }
        });
    },
    onLoadAppSuccess(app, emitEvent = true) {

        this.loading = false;
        this.error = false;

        //  find the app in the list and replace
        let index = _.findIndex(this.apps, (a) => a.id === app.id);
        if (index !== -1) {
            this.apps[index] = app;
        }

        this.setTableIcons();

        // clean this up..npe
        this.selectedAppId = app.id;
        //this.selectedTableId = null;

        if (emitEvent) {
            this.emit('change');
        }
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
    onLoadAppUsersSuccess(app) {
        const userArray = app.users;

        this.loadingAppUsers = false;
        this.appUsers = userArray[0];
        this.appUsersUnfiltered = userArray[1];

        this.onLoadAppSuccess(app.hydratedApp, false);

        this.emit('change');
    },
    onLoadAppRoles() {
        //place holder incase we want to in the future (I know we are going to migrate to redux as well)
    },
    onLoadAppRolesFailed() {
        //place holder incase we want to in the future (I know we are going to migrate to redux as well)
    },
    onLoadAppRolesSuccess(roles) {
        this.appRoles = roles;
        this.emit('change');
    },
    onLoadAppOwner() {
        //place holder incase we want to in the future (I know we are going to migrate to redux as well)
    },
    onLoadAppOwnerFailed() {
        //place holder incase we want to in the future (I know we are going to migrate to redux as well)
    },
    onLoadAppOwnerSuccess(appOwner) {
        this.appOwner = appOwner;
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
    onSelectedRows(selectedRows) {
        this.selectedUserRows = selectedRows;

        this.emit('change');
    },
    onUnasssignUsers() {
        this.emit('change');
    },
    onUnasssignUsersSuccess(data) {
        let appUsers = this.appUsers;
        let appUsersUnfiltered = this.appUsersUnfiltered[data.roleId];
        let users = data.userIds.length;

        (data.userIds).forEach(selectedUser => {
            appUsers = appUsers.filter(function(obj) {
                return obj.userId !== selectedUser;
            });
            appUsersUnfiltered = appUsersUnfiltered.filter(function(obj) {
                return obj.userId !== selectedUser;
            });
        });

        this.appUsersUnfiltered[data.roleId] = appUsersUnfiltered;
        this.appUsers = appUsers;
        this.selectedUserRows = [];
        let msg = " ";
        msg = (users > 1) ? users + Locale.getMessage('app.users.usersRemoved') :
        msg = users + Locale.getMessage('app.users.userRemoved');

        NotificationManager.success(msg);
        this.emit('change');
    },
    onUnasssignUsersFail() {
        this.emit('change');
    },
    /**
     * A table's props were updated. Find the table in the selected app and replace its details with those passed in.
     * An example of who updated the table might be user updated table name from settings pages.
     * @param tblId
     * @param tableInfo
     */
    onUpdateTableProps(payload) {
        let tblId = payload.tableId;
        let tableInfo = payload.tableInfo;
        let newAppsList = this.apps.map((app) => {
            if (app.id === this.selectedAppId) {
                let newAppTables = app.tables.map((table) => {
                    if (table.id === tblId) {
                        return tableInfo;
                    } else {
                        return table;
                    }
                });
                app.tables = newAppTables;
            }
            return app;
        });
        this.apps = newAppsList;
        this.emit('change');
    },
    getState() {
        return {
            apps: this.apps,
            selectedAppId: this.selectedAppId,
            appUsers: this.appUsers,
            appUsersUnfiltered: this.appUsersUnfiltered,
            appRoles: this.appRoles,
            appOwner: this.appOwner,
            selectedTableId: this.selectedTableId,
            loading: this.loading,
            loadingAppUsers: this.loadingAppUsers,
            error: this.error,
            selectedUserRows:this.selectedUserRows
        };
    },
});

export default AppsStore;
