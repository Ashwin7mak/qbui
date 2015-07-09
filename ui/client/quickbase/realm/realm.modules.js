(function() {
    'use strict';

    var reportsApp = angular.module('quickbase.realm', ['ui.router', 'qbse.realm.dashboard']);
    var reportsAppConfig = reportsApp.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $stateProvider
            .state('home', {
                url: '',
                views: {
                    realmHomeView: {
                        templateUrl: 'quickbase/realm/dashboard/realmDashboard.html',
                        controller: 'RealmDashboardCtrl'
                    }
                }
            });

    }]);

    reportsAppConfig.run(['$state', function($state) {
        $state.transitionTo('home');
    }]);

}());
