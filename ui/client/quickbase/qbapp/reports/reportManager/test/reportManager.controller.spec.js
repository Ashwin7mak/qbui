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

    it('should a valid controller and scope reference', function() {
        var scope = {};
        var params = {};
        _controller('ReportCtrl', {$scope:scope, $stateParams:params});

        //  all reports expected to have staging and content template defined
        expect(scope.getStageContent().length).toBeGreaterThan(0);
        expect(scope.getContent().length).toBeGreaterThan(0);

    });

});