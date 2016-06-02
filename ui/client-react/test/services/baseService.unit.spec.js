
import BaseService from '../../src/services/baseService';
import StringUtils from '../../src/utils/stringUtils';

describe('BaseService rewire tests', () => {
    'use strict';

    let baseService;
    var mockCookie = {
        load: function() {
            return {loadMethodCalled:true};
        }
    };
    var mockAxios = {
        get: function() {
            return {getMethodCalled:true};
        }
    };

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        //spyOn(BaseService.prototype, 'setResponseInterceptor');

        BaseService.__Rewire__('cookie', mockCookie);
        BaseService.__Rewire__('axios', mockAxios);
    });

    afterEach(() => {
        BaseService.__ResetDependency__('cookie');
        BaseService.__ResetDependency__('axios');
    });

    it('test constructor', () => {
        baseService = new BaseService();
        expect(BaseService.prototype.setRequestInterceptor).toHaveBeenCalled();
        //expect(BaseService.prototype.setResponseInterceptor).toHaveBeenCalled();
    });

    it('test setResponseInterceptor', () => {
        baseService = new BaseService();
        var duder = baseService.setResponseInterceptor();
        console.log("this is my test");
        console.log(duder);
        console.log("done with my test");
    });

    it('test getCookie', () => {
        baseService = new BaseService();
        var cookie = baseService.getCookie('cookieName');
        expect(cookie.loadMethodCalled).toBeTruthy();
    });

    it('test axios get method', () => {
        baseService = new BaseService();
        var axios = baseService.get('url', 'config');
        expect(axios.getMethodCalled).toBeTruthy();
    });

    /**
     * * Example2:
     *      constructUrl('/api/v1/apps/{0}/tables/{0}/reports/{1}',['123abc456', 'xyz123'])
     *        outputs
     *      /api/v1/apps/123abc456/tables/123abc456/reports/xyz123
     */
    it('test constructUrl method', () => {
        baseService = new BaseService();
        var mask = '/api/v1/apps/{0}/tables/{0}/reports/{1}';
        var tokens = ['123abc456', 'xyz123'];
        var output = '/api/v1/apps/123abc456/tables/123abc456/reports/xyz123';
        var url = baseService.constructUrl(mask, tokens);
        expect(output).toEqual(url);
    });

    it('test constructRedirectUrl method', () => {
        baseService = new BaseService();
        var expectedUrl = 'https://localhost/db/main?a=nsredirect&nsurl=' + window.location.href;
        var url = baseService.constructRedirectUrl();
        expect(expectedUrl).toEqual(url);
    });

});
