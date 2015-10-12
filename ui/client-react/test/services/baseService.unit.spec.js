
import BaseService from '../../src/services/baseService';

describe('BaseService rewire tests', () => {
    'use strict';

    let baseService;
    var mockCookie = {
        load: function(name) {
            return {loadMethodCalled:true};
        }
    };
    var mockAxios = {
        get: function(url, config) {
            return {getMethodCalled:true};
        }
    }

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');

        BaseService.__Rewire__('cookie', mockCookie);
        BaseService.__Rewire__('axios', mockAxios);
    });

    afterEach(() => {
        BaseService.__ResetDependency__('cookie');
        BaseService.__ResetDependency__('axios');
    });

    it('test constructor', () => {
        baseService = new BaseService();
        expect(baseService.baseUrl).toBeDefined();
        expect(BaseService.prototype.setRequestInterceptor).toHaveBeenCalled();
        expect(BaseService.prototype.setResponseInterceptor).toHaveBeenCalled();
    });

    it('test getCookie', () => {
        baseService = new BaseService();
        var cookie = baseService.getCookie('cookieName');
        expect(cookie.loadMethodCalled).toBeTruthy();
    });

    it('test axios get method', () => {
        baseService = new BaseService();
        var axios = baseService.get('url','config');
        expect(axios.getMethodCalled).toBeTruthy();
    });
});

describe('BaseService axios interceptor tests', () => {
    'use strict';

    let baseService;

    it('test authorization header on request', function(done) {
    //    baseService = new BaseService();
    //    baseService.get('/test/url');
    //    expect(jasmine.Ajax.requests.mostRecent().url).toBe('/test/url');
    //});

});

