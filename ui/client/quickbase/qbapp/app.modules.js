(function() {
    'use strict';

    //  define angular modules to be referenced by the apps application
    angular.module('qbapp.dashboard', []);
    angular.module('qbapp.common', []);
    angular.module('qbapp.reports.dashboard', ['qbapp.common']);
    angular.module('qbapp.reports.manager', ['ngSanitize', 'qbapp.common', 'qbse.grid']);

    //  define the angular apps module
    angular.module('quickbase.qbapp',
        [
            'ui.router',
            'qbapp.dashboard',
            'qbapp.reports.dashboard',
            'qbapp.reports.manager'
        ]).
        config(['$routeProvider', function($routeProvider, $locationProvider) {
            $routeProvider.otherwise({redirectTo: ''});
            $locationProvider.html5Mode(true);
        }]);
}());
