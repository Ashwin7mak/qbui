(function() {
    'use strict';
    var app = angular.module('app', ['qbse.grid', 'ngResource', 'DataServiceModule']);

    app.controller('MainExampleCtrl', [
        '$scope', '$http', '$location', 'ExampleData', function ($scope, $http, $location,  exampleData) {
            // decide what data to use
            var exampleSize = "Large";
            var requestSize = $location.search().size;
            if (requestSize == "Large") {
                exampleSize = requestSize;
            }
            // load up example data &schema
            var schemaPromise = exampleData.get({file:'mockRecordsSchema', size:exampleSize});
            var dataPromise = exampleData.get({file:'mockRecords',size:exampleSize});

            // setup the model info
            $scope.model = {};
            $scope.model.listid = 2349823904820348;
            $scope.model.type ='report';
            $scope.model.title = exampleSize + " Dataset";
            $scope.model.selectedItems = [];
            $scope.model.persons = dataPromise;

            // Define Grid settings
            $scope.columnDefs = schemaPromise;
            $scope.qbseGridOptions = {
                showColumnMenu: false,
                showGroupPanel: false
            };

        }
    ]);
}());
