describe('Controller: ReportCtrl', function() {
    'use strict';
    // load the controller's module
    beforeEach(module('qbapp.reports.manager'));

    var _scope, _ReportModel;

    // Initialize the controller and a mock scope
    beforeEach(
        inject(function($controller, $rootScope, _ReportModel_ ) {
            _scope = $rootScope.$new();
            _ReportModel = _ReportModel_;
            $controller('ReportCtrl',
                {$scope:_scope, $stateParams:{id:1}, ReportModel:_ReportModel });
            _scope.$digest();
        })
    );

    it('validate the scope references', function() {
        //  all reports expected to have these scope variables
        expect(_scope.report.id).toEqual(1);

        expect(_scope.gridOptions.showGridFooter).toBeTruthy();
        expect(_scope.stage.visible).toBeTruthy();
    });

    it('validate the content references', function() {
        //  all reports expected to have staging and content template defined
        expect(_scope.getStageContent().length).toBeGreaterThan(0);
        expect(_scope.getContent().length).toBeGreaterThan(0);
    });

});