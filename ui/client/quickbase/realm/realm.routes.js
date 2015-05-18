(function() {
    'use strict';

    var reportsApp = angular.module('quickbase.realm', ['ui.router', 'qbse.realm.dashboard']);
    var reportsAppConfig = reportsApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider) {

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
