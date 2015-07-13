describe('Controller: AppDashboardCtrl', function() {
    'use strict';
    // load the controller's module
    var controller, ReportsDashboardModel, scope, $httpBackend, $state, deferredGetApp, deferredGetApps, deferredGet, transitionTo;

    beforeEach(function() {
        module('qbse.qbapp.dashboard','qbse.qbapp.reports.dashboard','qbse.qbapp.reports.manager', 'quickbase.qbapp', 'qbse.templates');
    });

    beforeEach(
        inject(function($controller, $rootScope, _ReportsDashboardModel_, _$state_, $q, _$httpBackend_ ) {
            scope = $rootScope.$new();
            ReportsDashboardModel = _ReportsDashboardModel_;
            $httpBackend = _$httpBackend_;
            $state = _$state_;
            deferredGet = $q.defer();
            deferredGetApp = $q.defer();
            deferredGetApps = $q.defer();

            spyOn(ReportsDashboardModel, 'get').and.callFake(function() {
                return deferredGet.promise;
            });

            spyOn(ReportsDashboardModel, 'getApp').and.callFake(function() {
                return deferredGetApp.promise;
            });

            spyOn(ReportsDashboardModel, 'getApps').and.callFake(function() {
                return deferredGetApps.promise;
            });

            transitionTo = spyOn($state, 'transitionTo').and.callThrough();

            controller = $controller;
        })
    );

    it('validate the proper workflow when the appId and tableId are not defined', function() {
        var appId='1', tableId='2';

        var getData = [{id:'1', name:'name1'}, {id:'2', name:'name2'}];
        deferredGet.resolve(getData);

        controller('AppDashboardCtrl',
            {$scope:scope, $stateParams:{appId:appId, tableId:tableId}, $state:$state, ReportsDashboardModel:ReportsDashboardModel });
        scope.$digest();

        expect(scope.appId).toBeDefined();
        expect(scope.tableId).toBeDefined();
        expect(ReportsDashboardModel.get).toHaveBeenCalledWith(appId, tableId);
        expect(ReportsDashboardModel.getApps).not.toHaveBeenCalled();
        expect(ReportsDashboardModel.getApp).not.toHaveBeenCalled();
        expect(scope.showLayout).toBeTruthy();
        expect(scope.reports.length).toEqual(2);

    });

    it('validate the proper workflow when the appId and tableId are not defined', function() {

        var getApps = [
            {id: '10'},
            {id: '11'}
        ];
        deferredGetApps.resolve(getApps);

        var getApp = {
            id:'10',
            name:'name10',
            tables: [
                {id:'100', name:'tableName100'},
                {id:'101', name:'tableName101'},
                {id:'102', name:'tableName102'}
            ]
        };
        deferredGetApp.resolve(getApp);

        controller('AppDashboardCtrl',
            {$scope:scope, $state:$state, ReportsDashboardModel:ReportsDashboardModel });
        scope.$digest();

        expect(scope.appId).not.toBeDefined();
        expect(scope.tableId).not.toBeDefined();
        expect(ReportsDashboardModel.get).not.toHaveBeenCalled();
        expect(ReportsDashboardModel.getApps).toHaveBeenCalled();
        expect(ReportsDashboardModel.getApp).toHaveBeenCalledWith('10');
        expect(ReportsDashboardModel.getApp).toHaveBeenCalledWith('11');

        expect(scope.apps.length).toEqual(2);
        expect(scope.apps[0].tables.length).toEqual(3);

        expect(scope.showLayout).toBeTruthy();

    });

    it('validate the proper workflow when their are no applications', function() {

         deferredGetApps.resolve(null);
         deferredGetApp.resolve(null);

         controller('AppDashboardCtrl',
             {$scope:scope, $state:$state, ReportsDashboardModel:ReportsDashboardModel });
         scope.$digest();

         expect(scope.appId).not.toBeDefined();
         expect(scope.tableId).not.toBeDefined();
         expect(ReportsDashboardModel.get).not.toHaveBeenCalled();
         expect(ReportsDashboardModel.getApps).toHaveBeenCalled();
         expect(ReportsDashboardModel.getApp).not.toHaveBeenCalledWith();

         expect(scope.apps[0].id).toEqual('');
         expect(scope.apps[0].tables.length).toEqual(0);

         expect(scope.showLayout).toBeTruthy();

     });

    it('validate transitionTo Table', function() {
        var appId='1', tableId='2';
        var table = {appId:'1', appName: 'appName', id: '10', name:'tableName' };

        var getData = [{id:'1', name:'name1'}, {id:'2', name:'name2'}];
        deferredGet.resolve(getData);

        controller('AppDashboardCtrl',
            {$scope:scope, $stateParams:{appId:appId, tableId:tableId}, $state:$state, ReportsDashboardModel:ReportsDashboardModel });
        scope.$digest();

        scope.goToTable(table);

        expect($state.transitionTo).toHaveBeenCalledWith('reports', {appId:table.appId, tableId:table.id});

    });

    it('validate transitionTo states', function() {
        var appId='1', tableId='2';

        var getData = [{id:'1', name:'name1'}, {id:'2', name:'name2'}];
        deferredGet.resolve(getData);

        controller('AppDashboardCtrl',
            {$scope:scope, $stateParams:{appId:appId, tableId:tableId}, $state:$state, ReportsDashboardModel:ReportsDashboardModel });
        scope.$digest();

        scope.goToReports();

        expect($state.transitionTo).toHaveBeenCalledWith('reports', {appId:scope.appId, tableId:scope.tableId});

    });

    it('validate transitionTo states', function() {
        var appId='1', tableId='2';
        var report = {id: '1'};

        var getData = [{id:'1', name:'name1'}, {id:'2', name:'name2'}];
        deferredGet.resolve(getData);

        controller('AppDashboardCtrl',
            {$scope:scope, $stateParams:{appId:appId, tableId:tableId}, $state:$state, ReportsDashboardModel:ReportsDashboardModel });
        scope.$digest();

        scope.goToReport(report);

        expect($state.transitionTo).toHaveBeenCalledWith('report', {appId:scope.appId, tableId:scope.tableId, id: report.id});

    });


});
