describe('quickbase common api module', function() {
    'use strict';

    var restangularProvider;
    var httpBackend;
    var Restangular;
    var apiService;
    var qbUtility;
    var baseApi = 'api/api/v1';

    beforeEach(function() {
        module('restangular', function(RestangularProvider) {
            restangularProvider = RestangularProvider;
            spyOn(restangularProvider, 'setBaseUrl').and.callThrough();
        });
        module('qbse.api');

        inject();

    });

    beforeEach(inject(function(_Restangular_, _ApiService_, _$httpBackend_, _qbUtility_) {
        httpBackend = _$httpBackend_;
        Restangular = _Restangular_;
        apiService = _ApiService_;
        qbUtility = _qbUtility_;

        spyOn(qbUtility, 'setLocationHref').and.callFake(function(path) {
            return path;
        });
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('Test Restangular Provider base user', function() {
        expect(restangularProvider.setBaseUrl).toHaveBeenCalled();
    });

    it('Test Restangular Provider 400 error interceptor', function() {
        httpBackend.whenGET(baseApi + '/apps/1').respond(400, {status: 400});
        apiService.getApp(1);
        httpBackend.flush();
        expect(qbUtility.setLocationHref).toHaveBeenCalledWith('/pageNotFound');
    });

    it('Test Restangular Provider 404 error interceptor', function() {
        httpBackend.whenGET(baseApi + '/apps/1').respond(404, {status: 404});
        apiService.getApp(1);
        httpBackend.flush();
        expect(qbUtility.setLocationHref).toHaveBeenCalledWith('/pageNotFound');
    });

    it('Test Restangular Provider 401 error interceptor', function() {
        httpBackend.whenGET(baseApi + '/apps/1').respond(401, {status: 401});
        apiService.getApp(1);
        httpBackend.flush();
        expect(qbUtility.setLocationHref).toHaveBeenCalledWith('/unauthorized');
    });

    it('Test Restangular Provider 403 error interceptor', function() {
        httpBackend.whenGET(baseApi + '/apps/1').respond(403, {status: 403});
        apiService.getApp(1);
        httpBackend.flush();
        expect(qbUtility.setLocationHref).toHaveBeenCalledWith('/unauthorized');
    });

    it('Test Restangular Provider 500 error interceptor', function() {
        httpBackend.whenGET(baseApi + '/apps/1').respond(500, {status: 500});
        apiService.getApp(1);
        httpBackend.flush();
        expect(qbUtility.setLocationHref).toHaveBeenCalledWith('/internalServerError');
    });

    it('Test Restangular Provider 200 error interceptor', function() {
        httpBackend.whenGET(baseApi + '/apps/1').respond(200, {status: 200});
        apiService.getApp(1);
        httpBackend.flush();
        expect(qbUtility.setLocationHref).not.toHaveBeenCalled();
    });

});
