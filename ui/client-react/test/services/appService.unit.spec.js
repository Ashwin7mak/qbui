import AppService from '../../src/services/appService';
import BaseService from '../../src/services/baseService';
import constants from '../../src/services/constants';
import StringUtils from '../../src/utils/stringUtils';
import * as query from '../../src/constants/query';

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
        let params = {};
        expect(BaseService.prototype.get).toHaveBeenCalledWith(appService.API.GET_APPS, {params:params});
    });

    it('test getApps function with hydrate', () => {
        appService.getApps(true);
        let params = {};
        params[query.HYDRATE] = '1';
        expect(BaseService.prototype.get).toHaveBeenCalledWith(appService.API.GET_APPS, {params:params});
    });

});
