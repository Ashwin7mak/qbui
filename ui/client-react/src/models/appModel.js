import {APP_ROUTE} from '../constants/urlConstants';
import TableIconUtils from '../utils/tableIconUtils';

class AppModel {
    constructor(appData) {
        this.init(appData);
    }

    init(appData) {
        this.model = {};

        if (appData) {
            this.model.app = appData.app;
            if (this.model.app) {
                this.model.app.users = appData.users[0];
                this.model.app.unfilteredUsers = appData.users[1];
                this.model.app.link = `${APP_ROUTE}/${this.model.app.id}`;

                //  set the table icons
                let tables = this.model.app.tables;
                if (tables) {
                    tables.forEach((table) => {
                        table.tableIcon = TableIconUtils.getTableIcon(table.name);
                    });
                }
            }
        }
    }

    get() {
        return this.model;
    }

    getApp() {
        return this.model.app;
    }

    getUsers() {
        return this.model.app.users;
    }

    getUnfilteredUsers() {
        return this.model.app.unfilteredUsers;
    }

    setModel(model) {
        this.model = model;
    }

    setUsers(users) {
        this.model.app.users = users;
    }

    setUnfilteredUsers(unfilteredUsers) {
        this.model.app.unfilteredUsers = unfilteredUsers;
    }

}

export default AppModel;
