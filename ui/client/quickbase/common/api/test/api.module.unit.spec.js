'use strict';

describe('quickbase common api module', function () {
    var restangularProvider, httpBackend, Restangular, apiService;
    var baseApi = 'api/api/v1';
    var errorInterceptorCalled=false;

    beforeEach(function () {
        module('restangular', function(RestangularProvider) {
            restangularProvider = RestangularProvider;
            spyOn(restangularProvider, 'setBaseUrl').and.callThrough();
            spyOn(restangularProvider, 'setErrorInterceptor').and.callFake(function() {
                errorInterceptorCalled = true;
            });
        });
        module('qbse.api');

        inject();

    });

    beforeEach(inject(function( _Restangular_, _ApiService_, _$httpBackend_) {
        httpBackend = _$httpBackend_;
        Restangular = _Restangular_;
        apiService = _ApiService_;
        errorInterceptorCalled = false;
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('Test Restangular Provider base user', function () {
        expect(restangularProvider.setBaseUrl).toHaveBeenCalled();
    });

    it('Test Restangular Provider 404 error interceptor', function () {
        httpBackend.whenGET(baseApi +'/apps/1').respond(404, {status: 404});
        apiService.getApp(1);
        httpBackend.flush();
        expect(restangularProvider.setErrorInterceptor).toHaveBeenCalled();
    });

    it('Test Restangular Provider 401 error interceptor', function () {
        httpBackend.whenGET(baseApi +'/apps/1').respond(401, {status: 401});
        apiService.getApp(1);
        httpBackend.flush();
        expect(restangularProvider.setErrorInterceptor).toHaveBeenCalled();
    });

    it('Test Restangular Provider 403 error interceptor', function () {
        httpBackend.whenGET(baseApi +'/apps/1').respond(403, {status: 403});
        apiService.getApp(1);
        httpBackend.flush();
        expect(restangularProvider.setErrorInterceptor).toHaveBeenCalled();
    });

    it('Test Restangular Provider 500 error interceptor', function () {
        httpBackend.whenGET(baseApi +'/apps/1').respond(500, {status: 500});
        apiService.getApp(1);
        httpBackend.flush();
        expect(restangularProvider.setErrorInterceptor).toHaveBeenCalled();
    });

});
