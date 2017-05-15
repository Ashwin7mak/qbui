import UrlUtils from '../utils/urlUtils';

let automationsModel = {
    set: function(appId, automations) {
        let obj = {
            appId: appId,
            automationsList: []
        };
        if (automations) {
            automations.forEach((auto) => {
                obj.automationsList.push({
                    id: auto.id,
                    name: auto.name
                    // TODO set link
                });
            });
        }
        return obj;
    }
};
export default automationsModel;
