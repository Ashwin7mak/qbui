let appsModel = {
    set: function(apps) {
        if (apps) {
            //  add a link element to each individual app
            apps.forEach((app) => {
                app.link = '/qbase/app/' + app.id;
            });
        }
        return apps;
    }
};
export default appsModel;
