import _ from 'lodash';

const AppUtils = {
    appExists(selectedAppId, apps) {
        let foundAppId = _.find(apps, {id: selectedAppId});
        return (selectedAppId && foundAppId);
    }
};

export default AppUtils;
