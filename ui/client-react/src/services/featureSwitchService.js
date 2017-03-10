import constants from './constants';
import BaseService from './baseService';
import * as query from '../constants/query';
import _ from 'lodash';

class FeatureSwitchService extends BaseService {

    constructor() {
        super();

        //  Feature switch service API endpoints
        this.API = {
            GET_FEATURE_SWITCHES    : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_SWITCHES}`,
            POST_FEATURE_SWITCH     : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_SWITCHES}`,
            PUT_FEATURE_SWITCH      : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_SWITCHES}/{0}`,
            DELETE_FEATURE_SWITCHES : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_SWITCHES}/bulk`,

            POST_OVERRIDE    : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_SWITCHES}/{0}/${constants.FEATURE_OVERRIDES}`,
            PUT_OVERRIDE     : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_SWITCHES}/{0}/${constants.FEATURE_OVERRIDES}/{1}`,
            DELETE_OVERRIDES : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_SWITCHES}/{0}/${constants.FEATURE_OVERRIDES}/bulk`,

            GET_FEATURE_STATES : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_STATES}`
        };
    }

    getFeatureSwitches() {
        const params = {};
        const url = super.constructUrl(this.API.GET_FEATURE_SWITCHES, []);

        return super.get(url, {params});
    }

    getDefaultFeatureProps() {
        return {name: '', description: '', defaultOn: false, teamName: ''};
    }

    createFeatureSwitch(feature) {
        const url = super.constructUrl(this.API.POST_FEATURE_SWITCH);

        return super.post(url, feature);
    }

    updateFeatureSwitch(feature) {
        const url = super.constructUrl(this.API.PUT_FEATURE_SWITCH,  [feature.id]);

        const featureAllProps = _.merge(this.getDefaultFeatureProps(), feature);

        return super.put(url, _.omit(featureAllProps, ['id']));
    }

    deleteFeatureSwitches(ids) {
        const params = {};
        params[query.IDS] = ids.join();

        const url = super.constructUrl(this.API.DELETE_FEATURE_SWITCHES);

        return super.delete(url, {params:params});
    }

    createOverride(id, override) {
        const url = super.constructUrl(this.API.POST_OVERRIDE, [id]);

        return super.post(url, override);
    }

    updateOverride(featureSwitchId, id, override) {

        const url = super.constructUrl(this.API.PUT_OVERRIDE,  [featureSwitchId, id]);
        return super.put(url, _.omit(override, ['id']));
    }

    deleteOverrides(id, ids) {
        const params = {};
        params[query.IDS] = ids.join();

        let url = super.constructUrl(this.API.DELETE_OVERRIDES, [id]);

        return super.delete(url, {params:params});
    }

    getFeatureSwitchStates(appId) {
        const params = {
            appId
        };

        const url = super.constructUrl(this.API.GET_FEATURE_STATES, []);

        return super.get(url, {params});
    }
}

export default FeatureSwitchService;
