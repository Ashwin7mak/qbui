
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
        },
        patch: function() {
            return {patchMethodCalled:true};
        },
        delete: function() {
            return {deleteMethodCalled:true};
        }
    };

    var simpleSubdomain = {href: "https://team.quickbase.com", hostname: "team.quickbase.com",
        subdomain: "team", domain: "quickbase.com",
        expectedUrl: 'https://team.quickbase.com/db/main?a=nsredirect&nsurl='};
    var complexSubdomain = {href: "https://team.demo.quickbaserocks.com", hostname: "team.demo.quickbaserocks.com",
        subdomain: "team", domain: "quickbaserocks.com",
        expectedUrl: 'https://team.quickbaserocks.com/db/main?a=nsredirect&nsurl='};

    var mockWindowUtils = {
        update: function(url) {
            return url;
        },
        replace: function(url) {
            return url;
        },
        getHref: function() {
            return simpleSubdomain.href;
        },
        getHostname: function() {
            return simpleSubdomain.hostname;
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


    it('test checkResponseStatus with 401 status', () => {
        baseService = new BaseService();
        baseService.checkResponseStatus({response: {status: 401}});
        expect(mockWindowUtils.update).toHaveBeenCalled();
        expect(mockWindowUtils.replace).not.toHaveBeenCalled();
    });

    it('test checkResponseStatus with 200 status', () => {
        baseService = new BaseService();
        baseService.checkResponseStatus({status: 200});
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

    it('test axios patch method', () => {
        baseService = new BaseService();
        var axios = baseService.patch('url', 'config');
        expect(axios.patchMethodCalled).toBeTruthy();
    });

    it('test axios delete method', () => {
        baseService = new BaseService();
        var axios = baseService.delete('url', 'config');
        expect(axios.deleteMethodCalled).toBeTruthy();
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

    it('test constructRedirectUrl method with simple subdomain', () => {
        baseService = new BaseService();
        var expectedUrl = simpleSubdomain.expectedUrl + mockWindowUtils.getHref();
        var url = baseService.constructRedirectUrl();
        expect(expectedUrl).toEqual(url);
    });

    it('test getSubdomain method with simple subdomain', () => {
        baseService = new BaseService();
        var subdomain = baseService.getSubdomain();
        expect(simpleSubdomain.subdomain).toEqual(subdomain);
    });

    it('test getDomain method with simple subdomain', () => {
        baseService = new BaseService();
        var domain = baseService.getDomain();
        expect(simpleSubdomain.domain).toEqual(domain);
    });

    it('test constructRedirectUrl method with complex subdomain', () => {
        mockWindowUtils.getHref = function() {return complexSubdomain.href;};
        mockWindowUtils.getHostname = function() {return complexSubdomain.hostname;};
        BaseService.__Rewire__('WindowLocationUtils', mockWindowUtils);
        baseService = new BaseService();
        var expectedUrl = complexSubdomain.expectedUrl + mockWindowUtils.getHref();
        var url = baseService.constructRedirectUrl();
        expect(expectedUrl).toEqual(url);
    });

    it('test getSubdomain method with complex subdomain', () => {
        baseService = new BaseService();
        var subdomain = baseService.getSubdomain();
        expect(complexSubdomain.subdomain).toEqual(subdomain);
    });

    it('test getDomain method with complex subdomain', () => {
        baseService = new BaseService();
        var domain = baseService.getDomain();
        expect(complexSubdomain.domain).toEqual(domain);
    });

});
