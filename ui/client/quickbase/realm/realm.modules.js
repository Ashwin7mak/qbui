(function() {
    'use strict';

    //  define angular modules to be referenced by the realm application
    angular.module('realm.dashboard', []);

    //  define the angular realm module
    angular.module('quickbase.realm',
        [
            'ui.router',
            'realm.dashboard'
        ]).
        config(['$routeProvider', function($routeProvider, $locationProvider) {

            $routeProvider.otherwise({redirectTo: ''});
            $locationProvider.html5Mode(true);

        }]);
}());
