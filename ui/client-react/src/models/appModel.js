import {APP_ROUTE} from '../constants/urlConstants';
import TableIconUtils from '../utils/tableIconUtils';

class AppModel {
    constructor(appData) {
        this.init(appData);
    }

    init(appData) {
        this.model = {};
        this.model.users = [];
        this.model.unfilteredUsers = {};

        if (appData) {
            this.model.users = appData.users[0];
            this.model.unfilteredUsers = appData.users[1];
            this.model.app = appData.app;
            if (this.model.app) {
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
        return this.model.users;
    }

    getUnfilteredUsers() {
        return this.model.unfilteredUsers;
    }

}

export default AppModel;
