
import BaseService from '../../src/services/baseService';
import WindowLocationUtils from '../../src/utils/windowLocationUtils.js';

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

    var noSubdomain = {href: "https://quickbase.com", hostname: "quickbase.com", expectedUrl: 'https://quickbase.com/db/main?a=nsredirect&nsurl='};
    var simpleSubdomain = {href: "https://team.newstack.quickbase.com", hostname: "team.newstack.quickbase.com", expectedUrl: 'https://team.quickbase.com/db/main?a=nsredirect&nsurl='};
    var complexSubdomain = {href: "https://team.demo.newstack.quickbase.com", hostname: "team.demo.newstack.quickbase.com", expectedUrl: 'https://team.quickbase.com/db/main?a=nsredirect&nsurl='};

    var mockWindowUtils = {
        update: function(url) {
            return url;
        },
        replace: function(url) {
            return url;
        },
        getHref: function () {
            return noSubdomain.href;
        },
        getHostname: function () {
            return noSubdomain.hostname;
        }
    };

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');
        spyOn(mockWindowUtils, 'update');
        spyOn(mockWindowUtils, 'replace');

        BaseService.__Rewire__('cookie', mockCookie);
        BaseService.__Rewire__('axios', mockAxios);
        BaseService.__Rewire__('WindowLocationUtils', mockWindowUtils);
    });

    afterEach(() => {
        BaseService.__ResetDependency__('cookie');
        BaseService.__ResetDependency__('axios');
        BaseService.__ResetDependency__('WindowLocationUtils', mockWindowUtils);
    });

    it('test constructor', () => {
        baseService = new BaseService();
        expect(BaseService.prototype.setRequestInterceptor).toHaveBeenCalled();
        expect(BaseService.prototype.setResponseInterceptor).toHaveBeenCalled();
    });


    it('test setResponseInterceptor with 401 status', () => {
        baseService = new BaseService();
        baseService.responseInterceptorError({status: 401});
        expect(mockWindowUtils.update).toHaveBeenCalled();
    });

    it('test setResponseInterceptor with 403 status', () => {
        baseService = new BaseService();
        baseService.responseInterceptorError({status: 403});
        expect(mockWindowUtils.replace).toHaveBeenCalled();
    });

    it('test setResponseInterceptor with 200 status', () => {
        baseService = new BaseService();
        baseService.responseInterceptorError({status: 200});
        expect(mockWindowUtils.replace).not.toHaveBeenCalled();
        expect(mockWindowUtils.update).not.toHaveBeenCalled();
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

    it('test constructRedirectUrl method with no subdomain', () => {
        baseService = new BaseService();
        var expectedUrl = noSubdomain.expectedUrl + mockWindowUtils.getHref();
        var url = baseService.constructRedirectUrl();
        expect(expectedUrl).toEqual(url);
    });

    it('test constructRedirectUrl method with simple subdomain', () => {
        mockWindowUtils.getHostname = function () { return simpleSubdomain.hostname };
        mockWindowUtils.getHref = function () { return simpleSubdomain.href };
        BaseService.__Rewire__('WindowLocationUtils', mockWindowUtils);
        baseService = new BaseService();
        var expectedUrl = simpleSubdomain.expectedUrl + mockWindowUtils.getHref();
        var url = baseService.constructRedirectUrl();
        expect(expectedUrl).toEqual(url);
    });

    it('test constructRedirectUrl method with complex subdomain', () => {
        mockWindowUtils.getHostname = function () { return complexSubdomain.hostname };
        mockWindowUtils.getHref = function () { return complexSubdomain.href };
        BaseService.__Rewire__('WindowLocationUtils', mockWindowUtils);
        baseService = new BaseService();
        var expectedUrl = complexSubdomain.expectedUrl + mockWindowUtils.getHref();
        var url = baseService.constructRedirectUrl();
        expect(expectedUrl).toEqual(url);
    });

});
