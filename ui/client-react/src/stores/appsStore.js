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
        this.realmUsers = [];
        this.appUsersUnfiltered = {};
        this.appOwner = {};
        // Default is true because the apps must load before the website is usable
        this.loading = true;
        this.error = false;
        this.selectedUserRows = [];

        this.selectedAppId = null;
        this.selectedTableId = null;
        this.userRoleIdToAdd = null;
        this.addUserToAppDialogOpen = false;

        this.bindActions(
            actions.LOAD_APPS, this.onLoadApps,
            actions.LOAD_APPS_SUCCESS, this.onLoadAppsSuccess,
            actions.LOAD_APPS_FAILED, this.onLoadAppsFailed,

            actions.SELECT_APP, this.onSelectApp,
            actions.SELECT_APP_SUCCESS, this.onSelectAppSuccess,
            actions.SELECT_APP_FAILED, this.onSelectAppFailed,

            actions.SELECT_TABLE, this.onSelectTable,
            actions.UPDATED_TABLE_PROPS, this.onUpdateTableProps,

            actions.LOAD_APP_OWNER, this.onLoadAppOwner,
            actions.LOAD_APP_OWNER_FAILED, this.onLoadAppOwnerFailed,
            actions.LOAD_APP_OWNER_SUCCESS, this.onLoadAppOwnerSuccess,

            actions.SELECT_USERS_DETAILS, this.onSelectedRows,

            actions.UNASSIGN_USERS, this.onUnasssignUsers,
            actions.UNASSIGN_USERS_FAILED, this.onUnasssignUsersFail,
            actions.UNASSIGN_USERS_SUCCESS, this.onUnasssignUsersSuccess,

            actions.LOAD_ALL_USERS, this.onLoadAllUsers,
            actions.SEARCH_ALL_USERS_SUCCESS, this.onLoadAllUsersSuccess,

            actions.ADD_USER, this.onAddUser,
            actions.SET_USER_ROLE_TO_ADD_TO_APP, this.onSetUserRoleToAdd,

            actions.GET_APP_USERS_SUCCESS, this.onGetAppUsersSuccess,
            actions.GET_APP_USERS_FAILED, this.onGetAppUserFailed,

            actions.ASSIGN_USERS_TO_APP_SUCCESS, this.assignUsersToAppSuccess,
            actions.TOGGLE_ADD_USER_TO_APP_DIALOG, this.addUserToAppDialog
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

    onLoadAppsSuccess(apps) {

        this.loading = false;
        this.error = false;

        this.apps = apps;
        this.setTableIcons();

        this.emit('change');
    },

    onSelectApp(appId) {
        this.selectedAppId = appId;

        //  appId can be null when clearing selection
        if (appId) {
            this.loading = true;
        }
        this.emit('change');
    },

    onSelectAppFailed() {
        this.loading = false;
        this.error = true;
        this.emit('change');
    },
    /**
     * userArray is structured so that the filtered list of users is mapped for our userPicker in index 0
     * index 1 is the untouched response from Core's getAppUsers
     */
    onSelectAppSuccess(selectedApp) {
        this.loading = false;
        this.error = false;

        //  update app users list
        if (_.has(selectedApp, 'users')) {
            const userArray = selectedApp.users;
            this.appUsers = userArray[0];
            this.appUsersUnfiltered = userArray[1];
        }

        //  update the tables for the selected app..if the app
        //  is not in the store, we'll add to it
        if (_.has(selectedApp, 'app')) {
            const app = selectedApp.app;
            if (Array.isArray(this.apps)) {
                //  find the app in the list and replace
                let index = _.findIndex(this.apps, (a) => a.id === app.id);
                if (index !== -1) {
                    this.apps[index] = app;
                } else {
                    this.apps.push(app);
                }
            } else {
                this.apps = [app];
            }
            this.setTableIcons();
            this.selectedAppId = app.id;
        }

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
    onLoadAllUsers() {
        this.emit('change');
    },
    onLoadAllUsersSuccess(data) {
        this.realmUsers = data;
        this.emit('change');
    },

    onAddUser() {
        this.loading = true;
        this.emit('change');
    },

    onSetUserRoleToAdd(roleId) {
        this.userRoleIdToAdd = roleId;
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
    /**
     * Get an array of users of an app
     * @param userArray
     */
    onGetAppUsersSuccess(data) {
        this.appUsers = data.appUsers[0];
        this.appUsersUnfiltered = data.appUsers[1];
        this.emit('change');
    },

    onGetAppUserFailed() {
        this.emit('change');
    },

    assignUsersToAppSuccess() {
        this.emit('change');
    },

    addUserToAppDialog(status) {
        this.addUserToAppDialogOpen = status;
        this.emit('change');
    },

    getState() {
        return {
            apps: this.apps,
            selectedAppId: this.selectedAppId,
            appUsers: this.appUsers,
            appUsersUnfiltered: this.appUsersUnfiltered,
            appOwner: this.appOwner,
            selectedTableId: this.selectedTableId,
            loading: this.loading,
            error: this.error,
            selectedUserRows:this.selectedUserRows,
            realmUsers: this.realmUsers,
            addUserToAppDialogOpen: this.addUserToAppDialogOpen,
            userRoleIdToAdd: this.userRoleIdToAdd,
        };
    },
});

export default AppsStore;
