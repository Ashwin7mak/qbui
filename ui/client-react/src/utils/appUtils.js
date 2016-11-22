import _ from 'lodash';

const AppUtils = {
    appExists(selectedAppId, apps) {
        if (!selectedAppId || !apps || apps.length === 0) {
            return false;
        }

        let foundApp = _.find(apps, {id: selectedAppId});
        return (foundApp ? foundApp : false);
    },

    getAppTables(appId, apps = []) {
        let app = _.find(apps, {id: appId});

        return (app && app.tables) ? app.tables : [];
    },

    hasAdminAccess(accessRights) {
        return Array.isArray(accessRights) && accessRights.indexOf("EDIT_SCHEMA") !== -1;
    }
};

export default AppUtils;
