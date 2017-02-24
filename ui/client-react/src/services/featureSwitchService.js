import constants from './constants';
import BaseService from './baseService';
import * as query from '../constants/query';

class FeatureSwitchService extends BaseService {

    constructor() {
        super();

        //  Record service API endpoints
        this.API = {
            GET_FEATURE_SWITCHES    : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_SWITCHES}`,
            POST_FEATURE_SWITCH     : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_SWITCHES}`,
            PUT_FEATURE_SWITCH      : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_SWITCHES}/{0}`,
            DELETE_FEATURE_SWITCHES : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_SWITCHES}/bulk`,

            POST_OVERRIDE    : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_SWITCHES}/{0}/${constants.FEATURE_SWITCH_OVERRIDES}`,
            PUT_OVERRIDE     : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_SWITCHES}/{0}/${constants.FEATURE_SWITCH_OVERRIDES}/{1}`,
            DELETE_OVERRIDES : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_SWITCHES}/{0}/${constants.FEATURE_SWITCH_OVERRIDES}/bulk`,

            GET_FEATURE_STATES : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_STATES}`
        };
    }

    getFeatureSwitches() {
        let params = {};

        let url = super.constructUrl(this.API.GET_FEATURE_SWITCHES, []);

        return super.get(url, {params});
    }

    createFeatureSwitch(feature) {
        let url = super.constructUrl(this.API.POST_FEATURE_SWITCH);
        return super.post(url, {feature});
    }

    updateFeatureSwitch(feature) {
        let url = super.constructUrl(this.API.PUT_FEATURE_SWITCH,  [feature.id]);
        return super.put(url, {feature});
    }

    deleteFeatureSwitches(ids) {
        let params = {};
        params[query.IDS] = ids.join();

        let url = super.constructUrl(this.API.DELETE_FEATURE_SWITCHES);

        return super.delete(url, {params:params});
    }

    createOverride(id, override) {
        let url = super.constructUrl(this.API.POST_OVERRIDE, [id]);
        return super.post(url, {override});
    }

    updateOverride(featureSwitchId, id, override) {
        let url = super.constructUrl(this.API.PUT_OVERRIDE,  [featureSwitchId, id]);
        return super.put(url, {override});
    }

    deleteOverrides(id, ids) {
        let params = {};
        params[query.IDS] = ids.join();

        let url = super.constructUrl(this.API.DELETE_OVERRIDES, [id]);

        return super.delete(url, {params:params});
    }

    getFeatureSwitchStates() {
        let params = {};

        let url = super.constructUrl(this.API.GET_FEATURE_STATES, []);

        return super.get(url, {params});
    }
}

export default FeatureSwitchService;
