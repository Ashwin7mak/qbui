import constants from './constants';
import BaseService from './baseService';

class FeatureSwitchService extends BaseService {

    constructor() {
        super();

        //  Record service API endpoints
        this.API = {
            GET_FEATURE_SWITCHES         : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_SWITCHES}`,
            PUT_FEATURE_SWITCHES         : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_SWITCHES}`,
            PUT_FEATURE_SWITCH_OVERRIDES : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_SWITCHES}/{0}/${constants.FEATURE_SWITCH_OVERRIDES}`,
            GET_FEATURE_STATES           : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_STATES}`
        };
    }

    getFeatureSwitches() {
        let params = {};

        let url = super.constructUrl(this.API.GET_FEATURE_SWITCHES, []);

        return super.get(url, {params});
    }

    saveFeatureSwitches(switches) {
        let url = super.constructUrl(this.API.PUT_FEATURE_SWITCHES);
        return super.put(url, {switches});
    }

    saveFeatureSwitchOverrides(featureSwitchId, overrides) {
        let url = super.constructUrl(this.API.PUT_FEATURE_SWITCH_OVERRIDES, [featureSwitchId]);
        return super.put(url, {overrides});
    }

    getFeatureSwitchStates() {
        let params = {};

        let url = super.constructUrl(this.API.GET_FEATURE_STATES, []);

        return super.get(url, {params});
    }
}

export default FeatureSwitchService;
