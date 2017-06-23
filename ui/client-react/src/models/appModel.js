import {APP_ROUTE} from '../constants/urlConstants';
import TableIconUtils from '../utils/tableIconUtils';
import _ from 'lodash';

class AppModel {
    constructor(appData) {
        this.init(appData);
    }

    init(appData) {
        this.app = {};

        if (_.has(appData, 'app')) {
            this.app = appData.app;
            if (Array.isArray(appData.users)) {
                if (appData.users.length > 0) {
                    this.setUsers(appData.users[0]);
                }
                if (appData.users.length > 1) {
                    this.setUnfilteredUsers(appData.users[1]);
                }
            }
            this.app.link = `${APP_ROUTE}/${this.app.id}`;

            //  set the table icons if one is not already set
            let tables = this.app.tables;
            if (tables) {
                tables.forEach((table) => {
                    if (!table.tableIcon) {
                        table.tableIcon = TableIconUtils.getTableIcon(table.name);
                    }
                });
            }
        }
    }

    getApp() {
        return this.app;
    }

    getAppId() {
        return this.app.id;
    }

    getUsers() {
        return this.app.users || [];
    }

    getUnfilteredUsers() {
        return this.app.unfilteredUsers || [];
    }

    getUnfilteredUsersByRole(roleId) {
        const unfilteredUsers = this.getUnfilteredUsers();
        return unfilteredUsers[roleId] || [];
    }

    setApp(app) {
        this.app = app;
    }

    setUsers(users) {
        this.app.users = users;
    }

    setUnfilteredUsers(unfilteredUsers) {
        this.app.unfilteredUsers = unfilteredUsers;
    }

    setUnfilteredUsersByRole(unfilteredUsers, roleId) {
        const unfilteredUsersList = this.getUnfilteredUsers();
        unfilteredUsersList[roleId] = unfilteredUsers;
    }

}

export default AppModel;
