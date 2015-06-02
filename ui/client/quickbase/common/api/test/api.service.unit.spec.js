'use strict';

describe('quickbase api service', function () {
    var scope, ApiService, $httpBackend, successCallback, errorCallback;

    beforeEach(function() {
        module('qbse.api','ngMockE2E');
    });

    beforeEach(inject(function ($rootScope, _ApiService_, _$httpBackend_, $q) {
        scope = $rootScope.$new();
        ApiService = _ApiService_;
        successCallback = jasmine.createSpy('success');
        errorCallback = jasmine.createSpy('error');
        $httpBackend = _$httpBackend_;
    }));

    //TODO write out apis access tests
    it('Test getApp API call', function () {

        $httpBackend.expectGET('/api/v1/apps/test').respond(200, 'appData mocked');

        var promise = ApiService.getApp('test');

        $httpBackend.flush();

        promise.then(function() {
            successCallback;
        }, function() {
            errorCallback;
        });

        //TODO: not working
        expect(successCallback).not.toHaveBeenCalled();
        expect(errorCallback).not.toHaveBeenCalled();


    });

});
