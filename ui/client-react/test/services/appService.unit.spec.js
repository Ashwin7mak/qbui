import AppService from '../../src/services/appService';
import BaseService from '../../src/services/baseService';
import constants from '../../src/services/constants';
import StringUtils from '../../src/utils/stringUtils';

describe('AppService functions', () => {
    'use strict';
    var appService;

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');
        spyOn(BaseService.prototype, 'get');
        spyOn(BaseService.prototype, 'post');

        appService = new AppService();
    });

    it('test getApp function', () => {
        let appId = '123';
        let url = StringUtils.format(appService.API.GET_APP, [appId]);

        appService.getApp(appId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url);
    });

    it('test getAppUsers function', () => {
        let appId = '123';
        let url = StringUtils.format(appService.API.GET_APP_USERS, [appId]);

        appService.getAppUsers(appId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url);
    });

    it('test getApps function', () => {
        appService.getApps();
        expect(BaseService.prototype.get).toHaveBeenCalledWith(appService.API.GET_APPS);
    });

    it('test getApps function', () => {
        appService.getApps();
        expect(BaseService.prototype.get).toHaveBeenCalledWith(appService.API.GET_APPS);
    });

    it('test getApplicationStack function', () => {
        let appId = 1;
        let url = StringUtils.format(appService.API.APPLICATION_STACK, [appId]);

        appService.getApplicationStack(appId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url);
    });

    it('test setApplicationStack function', () => {
        let appId = 1;
        let params = {'value':'1'};
        let url = StringUtils.format(appService.API.APPLICATION_STACK, [appId]);

        appService.setApplicationStack(appId, params);
        expect(BaseService.prototype.post).toHaveBeenCalledWith(url, params);
    });

});
