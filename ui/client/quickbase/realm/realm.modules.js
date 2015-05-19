(function() {
    'use strict';

    //  define sub-modules to be referenced by the quickBase realm application
    angular.module('qbse.realm.dashboard', []);

    //  define the angular quickBase realm module
    angular.module('quickbase.realm',
        [
            'ui.router',
            'qbse.realm.dashboard'
        ]).
        config(['$routeProvider', function($routeProvider, $locationProvider) {

            $routeProvider.otherwise({redirectTo: ''});
            $locationProvider.html5Mode(true);

        }]);
}());
