describe('Controller: ReportsDashboardCtrl', function() {
    'use strict';
    // load the controller's module
    var controller, ReportsDashboardModel, scope, $httpBackend, $state, deferredGet, transitionTo;

    beforeEach(function() {
        module('qbse.qbapp.reports.dashboard','qbse.qbapp.reports.manager', 'quickbase.qbapp', 'qbse.templates');
    });

    beforeEach(
        inject(function($controller, $rootScope, _ReportsDashboardModel_, _$state_, $q, _$httpBackend_ ) {
            scope = $rootScope.$new();
            ReportsDashboardModel = _ReportsDashboardModel_;
            $httpBackend = _$httpBackend_;
            $state = _$state_;
            deferredGet = $q.defer();

            spyOn(ReportsDashboardModel, 'get').and.callFake(function() {
                return deferredGet.promise;
            });

            transitionTo = spyOn($state, 'transitionTo').and.callThrough();

            controller = $controller;
        })
    );

    it('validate default scope variables', function() {
        var appId= '1', tableId = '2';
        var getReportData = [{id:'10', name:'name1'}, {id:'11', name:'name2'}];
        deferredGet.resolve(getReportData);

        controller('ReportsDashboardCtrl',
            {$scope:scope, $state:$state, ReportsDashboardModel:ReportsDashboardModel });
        scope.$digest();

        expect(ReportsDashboardModel.get).not.toHaveBeenCalledWith(appId, tableId);

        expect(scope.header.leftContent).toBeDefined();
        expect(scope.header.rightContent).toBeDefined();
        expect(scope.getNavigationContent()).toBeDefined();
    });

    it('validate selected report transition', function() {
        var appId= '1', tableId = '2';
        var report = {id:'1'};
        var notSelectedReport = {id:'2'};

        controller('ReportsDashboardCtrl',
            {$scope:scope, $state:$state, ReportsDashboardModel:ReportsDashboardModel });
        scope.$digest();

        expect(ReportsDashboardModel.get).not.toHaveBeenCalledWith(appId, tableId);

        scope.goToPage(report);
        expect(scope.isSelected(report)).toBeTruthy();
        expect(scope.isSelected(notSelectedReport)).toBeFalsy();
        expect(scope.reportId).toEqual(report.id);
        expect($state.transitionTo).toHaveBeenCalledWith('reports/report', {appId:scope.appId, tableId:scope.tableId, id: report.id});
    });

    it('validate the workflow when the appId and tableId are not supplied', function() {
        var appId= '1', tableId = '2';

        controller('ReportsDashboardCtrl',
            {$scope:scope, $state:$state, ReportsDashboardModel:ReportsDashboardModel });
        scope.$digest();

        expect(ReportsDashboardModel.get).not.toHaveBeenCalledWith(appId, tableId);

        expect(scope.appId).not.toBeDefined();
        expect(scope.tableId).not.toBeDefined();
        expect(scope.reports).not.toBeDefined();
    });

    it('validate the workflow when the appId and tableId are supplied', function() {
        var appId= '1', tableId = '2';

        var getReportData = [{id:'10', name:'name1'}, {id:'11', name:'name2'}];
        deferredGet.resolve(getReportData);

        controller('ReportsDashboardCtrl',
            {$scope:scope, $stateParams:{appId:appId, tableId:tableId}, $state:$state, ReportsDashboardModel:ReportsDashboardModel });
        scope.$digest();

        expect(ReportsDashboardModel.get).toHaveBeenCalledWith(appId, tableId);

        expect(scope.appId).toBeDefined();
        expect(scope.tableId).toBeDefined();

        expect(scope.reports.length).toEqual(2);
        expect($state.transitionTo).toHaveBeenCalledWith('reports/report', {appId:scope.appId, tableId:scope.tableId, id: '10'});

    });


});
