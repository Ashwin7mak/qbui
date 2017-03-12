import BaseService from '../../src/services/baseService';
import FeatureSwitchService from '../../src/services/featureSwitchService';
import _ from 'lodash';

describe('FeatureService functions', () => {
    'use strict';
    var featureSwitchService;

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');
        spyOn(BaseService.prototype, 'get');
        spyOn(BaseService.prototype, 'post');
        spyOn(BaseService.prototype, 'put');
        spyOn(BaseService.prototype, 'delete');

        featureSwitchService = new FeatureSwitchService();
    });

    it('test getFeatureSwitches function', () => {

        const url = featureSwitchService.constructUrl(featureSwitchService.API.GET_FEATURE_SWITCHES);
        featureSwitchService.getFeatureSwitches();

        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params: {}});
    });

    it('test createFeatureSwitch function', () => {

        const feature = {name: 'fsName', defaultOn: true};
        const url = featureSwitchService.constructUrl(featureSwitchService.API.POST_FEATURE_SWITCH);
        featureSwitchService.createFeatureSwitch(feature);

        expect(BaseService.prototype.post).toHaveBeenCalledWith(url, feature);
    });

    it('test updateFeatureSwitch function', () => {
        const feature = {id: 'id', name: 'fsName', description: 'desc', teamName: 'team', defaultOn: true};
        const url = featureSwitchService.constructUrl(featureSwitchService.API.PUT_FEATURE_SWITCH, ['id']);
        featureSwitchService.updateFeatureSwitch(feature);

        expect(BaseService.prototype.put).toHaveBeenCalledWith(url, _.omit(feature, 'id'));
    });

    it('test deleteFeatureSwitches function', () => {
        const features = {
            features: [{id:'id1'}, {id:'id2'}]
        };
        const url = featureSwitchService.constructUrl(featureSwitchService.API.DELETE_FEATURE_SWITCHES);
        featureSwitchService.deleteFeatureSwitches(['id1', 'id2']);

        expect(BaseService.prototype.post).toHaveBeenCalledWith(url, features);
    });

    it('test createOverride function', () => {

        const override = {entityType: 'app', entityValue: '1', on: true};
        const url = featureSwitchService.constructUrl(featureSwitchService.API.POST_OVERRIDE, ['featureId']);
        featureSwitchService.createOverride('featureId', override);

        expect(BaseService.prototype.post).toHaveBeenCalledWith(url, override);
    });

    it('test updateOverride function', () => {
        const override = {entityType: 'realm', entityValue: '2', on: false};
        const url = featureSwitchService.constructUrl(featureSwitchService.API.PUT_OVERRIDE, ['featureId', 'id']);
        featureSwitchService.updateOverride('featureId', 'id', override);

        expect(BaseService.prototype.put).toHaveBeenCalledWith(url, override);
    });

    it('test deleteOverrides function', () => {
        const overrides = {
            overrides: [{id:'id1'}, {id:'id2'}]
        };
        const url = featureSwitchService.constructUrl(featureSwitchService.API.DELETE_OVERRIDES, ['featureId']);
        featureSwitchService.deleteOverrides('featureId', ['id1', 'id2']);

        expect(BaseService.prototype.post).toHaveBeenCalledWith(url, overrides);
    });

    it('test getFeatureSwitchStates function', () => {

        const appId = 1;

        const url = featureSwitchService.constructUrl(featureSwitchService.API.GET_FEATURE_STATES, [appId]);
        featureSwitchService.getFeatureSwitchStates(appId);

        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params: {appId: 1}});
    });
});
