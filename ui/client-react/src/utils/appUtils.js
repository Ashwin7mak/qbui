import _ from 'lodash';

const AppUtils = {
    appExists(selectedAppId, apps) {
        if (!selectedAppId || !apps || apps.length === 0) {
            return false;
        }

        let foundApp = _.find(apps, {id: selectedAppId});
        return (foundApp ? foundApp : false);
    }
};

export default AppUtils;
