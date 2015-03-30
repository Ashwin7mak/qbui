(function() {
    /**
     * Example calling of service
     */
    'use strict';
    var dataModule = angular.module("DataServiceModule", []);

    //example data &schema
    dataModule.factory('ExampleData', ['$resource',
        function($resource){
            return $resource('../mockdata/:file:size.json', {file:'@file', size:'@size'}, {
                get: {method:'GET', isArray:true}
            });
        }]);

}());

