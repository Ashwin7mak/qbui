'use strict';

describe('quickbase api service', function () {
    var scope, ApiService, $httpBackend, requestHandler, deferred;

    beforeEach(function() {
        module('qbse.api','ngMockE2E');
    });

    beforeEach(inject(function ($rootScope, _ApiService_, _$httpBackend_, $q) {
        scope = $rootScope.$new();
        ApiService = _ApiService_;
        $httpBackend = _$httpBackend_;

        deferred = $q.defer();

        requestHandler = $httpBackend.whenGET('/api/v1/apps/test').respond(function(method, url, data) {
           // return ['test1','test2'];
            return deferred.promise;
        });
    }));

    //TODO write out apis access tests
    it('should do something', function () {

        var response;
        ApiService.getApp('test').then (
            function (resp) {
                response = resp;
            }
        );

        deferred.resolve();
        scope.$apply();

        //expect(response).toBeDefined();
       // expect(response.length).toBe(1);


    });

});
