describe('Controller: ReportCtrl', function() {
    'use strict';
    // load the controller's module
    beforeEach(module('qbapp.reports.manager'));

    var _controller, _scope;

    // Initialize the controller and a mock scope
    beforeEach(
        inject(function($rootScope, $controller) {
            _controller = $controller;
            _scope = $rootScope.$new();
        })
    );
    var $rootScope, $controller, $q, $httpBackend, appConfig, scope;
    beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _$httpBackend_, _appConfig_) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $httpBackend = _$httpBackend_;
        appConfig = _appConfig_;
        scope = $rootScope.$new();
    }));

    it('should a valid controller and scope reference', function() {
        var scope = {};
        var params = {};
        _controller('ReportCtrl', {$scope:scope, $stateParams:params})

        //  all reports to have staging and content
        expect(scope.getStageContent().length).toBeGreaterThan(0);
        expect(scope.getContent().length).toBeGreaterThan(0);


    });

});
