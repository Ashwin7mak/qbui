(function() {
    /**
     * Example calling of service
     */
    'use strict';
    var dataModule = angular.module('gridExampleService', []);

    //example data &schema
    dataModule.factory('exampleData', ['$resource',
        function($resource){
            return $resource('quickbase/common/mockdata/:file:size.json', {file:'@file', size:'@size'}, {
                get: {method:'GET', isArray:true}
            });
        }]);
}());

