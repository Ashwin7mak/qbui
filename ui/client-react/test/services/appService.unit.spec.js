import AppService from '../../src/services/appService';
import BaseService from '../../src/services/baseService';
import constants from '../../src/services/constants';

describe('AppService functions', () => {
    'use strict';
    var appService;

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');
        spyOn(BaseService.prototype, 'get');

        appService = new AppService();
    });

    it('test getApp function', () => {
        var appId = '123';
        var url = appService.constructUrl(appService.API.GET_APP, [appId]);
        appService.getApp(appId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url);
    });

    it('test getApps function', () => {
        appService.getApps();
        expect(BaseService.prototype.get).toHaveBeenCalledWith(appService.API.GET_APPS);
    });

});
