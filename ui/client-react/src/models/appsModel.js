import {APP_ROUTE} from '../constants/urlConstants';

class AppsModel {
    constructor(apps) {
        this.init(apps);
    }

    init(apps) {
        this.model = {};
        this.setApps(apps);
    }

    get() {
        return this.model;
    }

    getApps() {
        return this.model.apps;
    }

    setApps(apps) {
        this.model.apps = Array.isArray(apps) ? apps : [];

        //  add a link element to each individual app
        this.model.apps.forEach((app) => {
            app.link = `${APP_ROUTE}/${app.id}`;
        });
    }
}

export default AppsModel;
