describe('Controller: ReportCtrl', function() {
    'use strict';
    // load the controller's module
    beforeEach(module('qbapp.reports.manager'));

    var scope, ReportModel;

    // Initialize the controller and a mock scope
    beforeEach(
        inject(function($controller, $rootScope, _ReportModel_ ) {
            scope = $rootScope.$new();
            ReportModel = _ReportModel_;
            $controller('ReportCtrl',
                {$scope:scope, $stateParams:{id:1}, ReportModel:ReportModel });
            scope.$digest();
        })
    );

    it('validate the scope references', function() {
        //  all reports expected to have these scope variables
        expect(scope.report.id).toEqual(1);

        expect(scope.qbseGridOptions.showGridFooter).toBeTruthy();
        expect(scope.stage.visible).toBeTruthy();
    });

    it('validate the content references', function() {
        //  all reports expected to have staging and content template defined
        expect(scope.getStageContent().length).toBeGreaterThan(0);
        expect(scope.getContent().length).toBeGreaterThan(0);
    });

});
