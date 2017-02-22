import {APP_ROUTE} from '../constants/urlConstants';

let appsModel = {
    set: function(apps) {
        if (apps) {
            //  add a link element to each individual app
            apps.forEach((app) => {
                app.link = `${APP_ROUTE}/${app.id}`;
            });
        }
        return apps;
    }
};
export default appsModel;
