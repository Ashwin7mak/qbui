let appsModel = {
    set: function(apps) {
        if (apps) {
            //  add a link element to each individual app
            apps.forEach((app) => {
                app.link = '/qbase/app/' + app.id;
                app.openInV3 = false;
                app.accessRights = [];
            });
        }
        return apps;
    }
};
export default appsModel;
