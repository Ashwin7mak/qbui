(function() {
    'use strict';

    //  define sub-modules to be referenced by the quickBase apps application
    angular.module('qbse.qbapp.dashboard', []);
    angular.module('qbse.qbapp.reports.dashboard', ['qbse.layout']);
    angular.module('qbse.qbapp.reports.manager', ['ngSanitize', 'qbse.layout', 'qbse.grid']);

    //  define the quickBase angular apps module
    angular.module('quickbase.qbapp',
        [
            'ui.router',
            'qbse.qbapp.dashboard',
            'qbse.qbapp.reports.dashboard',
            'qbse.qbapp.reports.manager'
        ]).
        config(['$routeProvider', function($routeProvider, $locationProvider) {
            $routeProvider.otherwise({redirectTo: ''});
            $locationProvider.html5Mode(true);
        }]);
}());
