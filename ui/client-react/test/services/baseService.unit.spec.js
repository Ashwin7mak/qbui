import BaseService, {__RewireAPI__ as BaseServiceRewireAPI} from '../../src/services/baseService';
import WindowLocationUtils from '../../src/utils/windowLocationUtils.js';
import {UNAUTHORIZED} from '../../src/constants/urlConstants';

describe('BaseService rewire tests', () => {
    'use strict';

    let baseService;
    const mockCookie = {
        load: () => ({loadMethodCalled:true})
    };
    const mockAxios = {
        create: () => ({
            delete: () => ({deleteMethodCalled:true}),
            get: ()  => ({getMethodCalled:true}),
            patch: () => ({patchMethodCalled:true}),
            put: () => ({putMethodCalled:true})
        })
    };

    const getMockAxios = returnValue => ({
        create: () => ({
            get: () => returnValue
        })
    });

    const mockUnauthorizedRedirectConfiguration = {
        unauthorizedRedirect: '/qbase/custom-unauthorized-route'
    };

    const mockSimpleDomainConfiguration = {
        legacyBase: '.quickbase.com'
    };

    const mockComplexSubdomainConfiguration = {
        legacyBase: '.currentstack-int.quickbaserocks.com'
    };

    const simpleSubdomain = {href: "https://team.quickbase.com", hostname: "team.quickbase.com",
        subdomain: "team", domain: "quickbase.com",
        expectedUrl: 'https://team.quickbase.com/db/main?a=nsredirect&nsurl='};
    const complexSubdomain = {href: "https://team.qb3.quickbaserocks.com", hostname: "team.qb3.quickbaserocks.com",
        subdomain: "team", domain: "currentstack-int.quickbaserocks.com",
        expectedUrl: 'https://team.currentstack-int.quickbaserocks.com/db/main?a=nsredirect&nsurl='};

    const mockWindowUtils = {
        update: url => url,
        replace: url => url,
        getHref: () => simpleSubdomain.href,
        getHostname: () => simpleSubdomain.hostname
    };

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');
        spyOn(mockWindowUtils, 'update');
        spyOn(mockWindowUtils, 'replace');

        BaseServiceRewireAPI.__Rewire__('cookie', mockCookie);
        BaseServiceRewireAPI.__Rewire__('axios', mockAxios);
        BaseServiceRewireAPI.__Rewire__('WindowLocationUtils', mockWindowUtils);
        BaseServiceRewireAPI.__Rewire__('Configuration', mockUnauthorizedRedirectConfiguration);
    });

    afterEach(() => {
        BaseServiceRewireAPI.__ResetDependency__('cookie');
        BaseServiceRewireAPI.__ResetDependency__('axios');
        BaseServiceRewireAPI.__ResetDependency__('WindowLocationUtils', mockWindowUtils);
        BaseServiceRewireAPI.__ResetDependency__('Configuration', mockUnauthorizedRedirectConfiguration);
    });

    it('test constructor', () => {
        baseService = new BaseService();
        expect(BaseService.prototype.setRequestInterceptor).toHaveBeenCalled();
        expect(BaseService.prototype.setResponseInterceptor).toHaveBeenCalled();
    });

    describe('checkResponseStatus', () => {
        beforeEach(() => {
            BaseServiceRewireAPI.__Rewire__('Configuration', mockSimpleDomainConfiguration);
        });

        it('should not do anything when 200 status', () => {
            baseService = new BaseService();
            baseService.checkResponseStatus({status: 200});
            expect(mockWindowUtils.replace).not.toHaveBeenCalled();
            expect(mockWindowUtils.update).not.toHaveBeenCalled();
        });

        it('should not do anything when request fails with a null statusCode', () => {
            BaseServiceRewireAPI.__Rewire__('Configuration', mockSimpleDomainConfiguration);
            BaseServiceRewireAPI.__Rewire__('axios', getMockAxios(Promise.reject({statusCode: null})));
            baseService = new BaseService();
            baseService.checkResponseStatus({status: 401});
            expect(mockWindowUtils.replace).not.toHaveBeenCalled();
            expect(mockWindowUtils.update).not.toHaveBeenCalled();
        });
    });

    it('test getCookie', () => {
        baseService = new BaseService();
        let cookie = baseService.getCookie('cookieName');
        expect(cookie.loadMethodCalled).toBeTruthy();
    });

    it('test axios delete method', () => {
        baseService = new BaseService();
        let axios = baseService.delete('url', 'config');
        expect(axios.deleteMethodCalled).toBeTruthy();
    });

    it('test axios get method', () => {
        baseService = new BaseService();
        let axios = baseService.get('url', 'config');
        expect(axios.getMethodCalled).toBeTruthy();
    });

    it('test axios patch method', () => {
        baseService = new BaseService();
        let axios = baseService.patch('url', 'config');
        expect(axios.patchMethodCalled).toBeTruthy();
    });

    it('test axios put method', () => {
        baseService = new BaseService();
        let axios = baseService.put('url', 'config');
        expect(axios.putMethodCalled).toBeTruthy();
    });

    /**
     * * Example2:
     *      constructUrl('/api/v1/apps/{0}/tables/{0}/reports/{1}',['123abc456', 'xyz123'])
     *        outputs
     *      /api/v1/apps/123abc456/tables/123abc456/reports/xyz123
     */
    it('test constructUrl method', () => {
        baseService = new BaseService();
        let mask = '/api/v1/apps/{0}/tables/{0}/reports/{1}';
        let tokens = ['123abc456', 'xyz123'];
        let output = '/api/v1/apps/123abc456/tables/123abc456/reports/xyz123';
        let url = baseService.constructUrl(mask, tokens);
        expect(output).toEqual(url);
    });

    describe('constructRedirectUrl', () => {
        it('returns the pre-configured unauthorizedRedirect if it exists on Configuration', (done) => {
            baseService = new BaseService();
            baseService.constructRedirectUrl().then(url => {
                expect(url).toEqual(mockUnauthorizedRedirectConfiguration.unauthorizedRedirect);
            }).then(done, done);
        });

        const mockGetSimpleSubdomainAxios = getMockAxios(Promise.resolve({data: {legacyUrl: `https://${simpleSubdomain.subdomain}.${simpleSubdomain.domain}`}}));
        const mockGetComplexSubdomainAxios = getMockAxios(Promise.resolve({data: {legacyUrl: `https://${complexSubdomain.subdomain}.${complexSubdomain.domain}`}}));
        const mockFailGettingSubdomainAxios = getMockAxios(Promise.reject({statusCode: 500}));
        const mockFailGettingSubdomainFirefoxAxios = getMockAxios(Promise.reject({statusCode: null}));

        it('returns a redirect URL with a simple subdomain', (done) => {
            BaseServiceRewireAPI.__Rewire__('Configuration', mockSimpleDomainConfiguration);
            BaseServiceRewireAPI.__Rewire__('axios', mockGetSimpleSubdomainAxios);
            baseService = new BaseService();

            let expectedUrl = simpleSubdomain.expectedUrl + mockWindowUtils.getHref();

            baseService.constructRedirectUrl().then(url => {
                expect(url).toEqual(expectedUrl);
            }).then(done, done);
        });

        it('returns a redirect URL with complex subdomain', (done) => {
            mockWindowUtils.getHref = function() {return complexSubdomain.href;};
            mockWindowUtils.getHostname = function() {return complexSubdomain.hostname;};
            BaseServiceRewireAPI.__Rewire__('WindowLocationUtils', mockWindowUtils);
            BaseServiceRewireAPI.__Rewire__('Configuration', mockComplexSubdomainConfiguration);
            BaseServiceRewireAPI.__Rewire__('axios', mockGetComplexSubdomainAxios);
            baseService = new BaseService();

            let expectedUrl = complexSubdomain.expectedUrl + mockWindowUtils.getHref();

            baseService.constructRedirectUrl().then(url => {
                expect(url).toEqual(expectedUrl);
            }).then(done, done);
        });

        it('returns a standard redirect url if obtaining information from the Federation API fails', (done) => {
            BaseServiceRewireAPI.__Rewire__('Configuration', mockSimpleDomainConfiguration);
            BaseServiceRewireAPI.__Rewire__('axios', mockFailGettingSubdomainAxios);
            baseService = new BaseService();
            baseService.constructRedirectUrl().then(url => {
                expect(url).toEqual(UNAUTHORIZED);
            }, error => expect(false).toEqual(true)).then(done, done);
        });

        // This is a test for Firefox related behavior.  When Firefox encounters a redirect while executing
        // this.get(FEDERATION_LEGACY_URL, {}) in constructRedirectUrl(), the promise will reject() and return
        // an error object with null fields.  We are verifying here that if we encounter that situation,
        // we will propagate the reject() to the next caller in the promise chain.
        it('returns a rejected promise when error object contains null fields', (done) => {
            BaseServiceRewireAPI.__Rewire__('Configuration', mockSimpleDomainConfiguration);
            BaseServiceRewireAPI.__Rewire__('axios', mockFailGettingSubdomainFirefoxAxios);
            baseService = new BaseService();
            baseService.constructRedirectUrl().then(url => {
                expect(false).toEqual(true);
            }, () => done()).then(done, done);
        });
    });
});
