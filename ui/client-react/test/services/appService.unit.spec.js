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
        var url = 'test/url';
        appService.getApp(url);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(constants.APPS + '/' + url);
    });

    it('test getApps function', () => {
        appService.getApps();
        expect(BaseService.prototype.get).toHaveBeenCalledWith(constants.APPS);
    });

});
