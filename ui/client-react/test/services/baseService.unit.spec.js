import BaseService, {__RewireAPI__ as BaseServiceRewireAPI} from '../../src/services/baseService';
import WindowLocationUtils from '../../src/utils/windowLocationUtils.js';
import {UNAUTHORIZED} from '../../src/constants/urlConstants';

describe('BaseService rewire tests', () => {
    'use strict';

    let baseService;
    const mockCookie = {
        load: function() {
            return {loadMethodCalled:true};
        }
    };
    const mockAxios = {
        create: function() {
            return {
                delete: function() {
                    return {deleteMethodCalled:true};
                },
                get: function() {
                    return {getMethodCalled:true};
                },
                patch: function() {
                    return {patchMethodCalled:true};
                },
                put: function() {
                    return {putMethodCalled:true};
                }
            };
        }
    };

    const mockUnauthorizedRedirectConfiguration = {
        unauthorizedRedirect: '/qbase/custom-unathorized-route'
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


    it('test checkResponseStatus with 401 status', (done) => {
        baseService = new BaseService();
        baseService.checkResponseStatus({response: {status: 401}}).then(() => {
            expect(mockWindowUtils.update).not.toHaveBeenCalledWith('');
            expect(mockWindowUtils.replace).not.toHaveBeenCalled();
            done();
        }).catch(() => {
            expect(false).toEqual(true);
            done();
        });
    });

    it('test checkResponseStatus with 200 status', () => {
        baseService = new BaseService();
        baseService.checkResponseStatus({status: 200});
        expect(mockWindowUtils.replace).not.toHaveBeenCalled();
        expect(mockWindowUtils.update).not.toHaveBeenCalled();
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

        const createMockAxiosForFederation = returnValue => ({
            create: function() {
                return {
                    get: function() {
                        return returnValue;
                    }
                };
            }
        });

        const mockGetSimpleSubdomainAxios = createMockAxiosForFederation(Promise.resolve({data: {legacyUrl: `https://${simpleSubdomain.subdomain}.${simpleSubdomain.domain}`}}));
        const mockGetComplexSubdomainAxios = createMockAxiosForFederation(Promise.resolve({data: {legacyUrl: `https://${complexSubdomain.subdomain}.${complexSubdomain.domain}`}}));
        const mockFailGettingSubdomainInAxios = createMockAxiosForFederation(Promise.reject());

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
            BaseServiceRewireAPI.__Rewire__('axios', mockFailGettingSubdomainInAxios);

            baseService = new BaseService();

            baseService.constructRedirectUrl().then(url => {
                expect(url).toEqual(UNAUTHORIZED);
            }, error => expect(false).toEqual(true)).then(done, done);
        });
    });
});
