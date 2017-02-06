import constants from './constants';
import BaseService from './baseService';
import * as query from '../constants/query';
import Promise from 'bluebird';

class FeatureSwitchService extends BaseService {

    constructor() {
        super();

        //  Record service API endpoints
        this.API = {
            GET_FEATURE_SWITCHES  : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_SWITCHES}`,
            PATCH_FEATURE_SWITCHES  : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_SWITCHES}`,
            GET_FEATURE_STATES  : `${constants.BASE_URL.QUICKBASE}/${constants.FEATURE_STATES}`
        };
    }

    saveFeatureSwitches(switches) {
        let url = super.constructUrl(this.API.PATCH_FEATURE_SWITCHES);
        return super.patch(url, {switches});
    }

    getFeatureSwitches() {
        let params = {};

        let url = super.constructUrl(this.API.GET_FEATURE_SWITCHES, []);

        return super.get(url, {params:params});
    }

    getFeatureSwitchStates() {
        let params = {};

        let url = super.constructUrl(this.API.GET_FEATURE_STATES, []);

        return super.get(url, {params:params});
    }
}

export default FeatureSwitchService;
