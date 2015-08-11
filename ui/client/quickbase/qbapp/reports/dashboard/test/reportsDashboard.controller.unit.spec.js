describe('Controller: ReportsDashboardCtrl', function() {
    'use strict';
    // load the controller's module
    var controller;
    var ReportsDashboardModel;
    var scope;
    var $httpBackend;
    var $state;
    var deferredGet;
    var $log;
    var transitionTo;

    beforeEach(function() {
        module('qbse.qbapp.reports.dashboard', 'qbse.qbapp.reports.manager', 'quickbase.qbapp', 'qbse.templates');
    });

    beforeEach(
            inject(function($controller, $rootScope, _ReportsDashboardModel_, _$state_, $q, _$httpBackend_, _$log_) {
                scope = $rootScope.$new();
                ReportsDashboardModel = _ReportsDashboardModel_;
                $httpBackend = _$httpBackend_;
                $log = _$log_;
                $state = _$state_;
                deferredGet = $q.defer();

                //  setup a spy on the ReportsDashboardModel.get function.  Return a deferred promise and
                //  can resolve or reject based on how you choose to configure your test.  See references to
                //  deferredGet elsewhere to configuration options.
                spyOn(ReportsDashboardModel, 'get').and.callFake(function() {
                    return deferredGet.promise;
                });

                //  setup a spy on the Angular transitionTo function.
                transitionTo = spyOn($state, 'transitionTo').and.callFake(function() {
                    return null;
                });

                controller = $controller;
            })
    );

    it('validate default scope variables', function() {
        var appId = '1', tableId = '2';
        var getReportData = [{id: '10', name: 'name1'}, {id: '11', name: 'name2'}];

        //  resolve the promise with the getReportData object
        deferredGet.resolve(getReportData);

        controller('ReportsDashboardCtrl',
                   {$scope: scope, $state: $state, ReportsDashboardModel: ReportsDashboardModel, $log: $log});
        scope.$digest();

        expect(ReportsDashboardModel.get).not.toHaveBeenCalledWith(appId, tableId);

        expect(scope.header.leftContent).toBeDefined();
        expect(scope.header.rightContent).toBeDefined();
        expect(scope.getNavigationContent()).toBeDefined();
    });

    it('validate selected report transition', function() {
        var appId = '1', tableId = '2';
        var report = {id: '1'};
        var notSelectedReport = {id: '2'};

        controller('ReportsDashboardCtrl',
                   {$scope: scope, $state: $state, ReportsDashboardModel: ReportsDashboardModel, $log: $log});
        scope.$digest();

        expect(ReportsDashboardModel.get).not.toHaveBeenCalledWith(appId, tableId);

        scope.goToPage(report);
        expect(scope.isSelected(report)).toBeTruthy();
        expect(scope.isSelected(notSelectedReport)).toBeFalsy();
        expect(scope.reportId).toEqual(report.id);
        expect($state.transitionTo).toHaveBeenCalledWith('reports/report', {appId: scope.appId, tableId: scope.tableId, id: report.id});
    });

    it('validate the workflow when the appId and tableId are not supplied', function() {
        var appId = '1', tableId = '2';

        controller('ReportsDashboardCtrl',
                   {$scope: scope, $state: $state, ReportsDashboardModel: ReportsDashboardModel, $log: $log});
        scope.$digest();

        expect(ReportsDashboardModel.get).not.toHaveBeenCalledWith(appId, tableId);

        expect(scope.appId).not.toBeDefined();
        expect(scope.tableId).not.toBeDefined();
        expect(scope.reportId).not.toBeDefined();
        expect(scope.reports.length).toEqual(0);
    });

    it('validate the default report when the appId and tableId are supplied', function() {
        var appId = '1', tableId = '2', reportId1 = '10', reportId2 = '11';

        var getReportData = [{id: reportId1, name: 'name1'}, {id: reportId2, name: 'name2'}];
        deferredGet.resolve(getReportData);

        controller('ReportsDashboardCtrl',
                   {$scope: scope, $stateParams: {appId: appId, tableId: tableId}, $state: $state, ReportsDashboardModel: ReportsDashboardModel, $log: $log});
        scope.$digest();

        expect(ReportsDashboardModel.get).toHaveBeenCalledWith(appId, tableId);

        expect(scope.appId).toEqual(appId);
        expect(scope.tableId).toEqual(tableId);
        expect(scope.reportId).toEqual(reportId1);   // first report in the list is the default
        expect(scope.reports.length).toEqual(2);
        expect($state.transitionTo).toHaveBeenCalledWith('reports/report', {appId: scope.appId, tableId: scope.tableId, id: reportId1});

    });

    it('validate the default report when the appId and tableId are supplied but invalid', function() {
        var appId = '1', tableId = '2';

        var getErrorResp = {msg: 'Invalid reportId', status: 500};
        deferredGet.reject(getErrorResp);

        controller('ReportsDashboardCtrl',
                   {$scope: scope, $stateParams: {appId: appId, tableId: tableId}, $state: $state, ReportsDashboardModel: ReportsDashboardModel, $log: $log});
        scope.$digest();

        expect(ReportsDashboardModel.get).toHaveBeenCalledWith(appId, tableId);

        expect(scope.appId).toEqual(appId);
        expect(scope.tableId).toEqual(tableId);
        expect(scope.reportId).not.toBeDefined();
        expect(scope.reports.length).toEqual(0);
        expect($state.transitionTo).not.toHaveBeenCalled();

    });


});
