"use strict";

describe("quickbase api service", function () {
    var ApiService, $httpBackend;

    beforeEach(module("qbse.api", "ngMockE2E"));

    beforeEach(inject(function (_ApiService_, _$httpBackend_) {
        ApiService = _ApiService_;
        $httpBackend = _$httpBackend_;
    }));

    //TODO write out apis access tests
    it("should do something", function () {
        $httpBackend.whenGET("/api/apps").respond([]);
        expect(ApiService).toBeDefined();
        expect(ApiService.inValidProperty).toBeUndefined();
        expect(ApiService.getApp).toBeDefined();
        ApiService.getApp('test').then(function(response) {
            expect(response).not.toBeNull();
        });
    });

});
