(function() {
    'use strict';

    //get the module
    angular
        .module('gallery.gridExample')

        // instantiate the controller
        .controller('GridExampleController', GridExampleController);

    // inject what it needs
    GridExampleController.$inject = ['$scope', 'gridData', '$q'];


    // Implement the controller
    function GridExampleController($scope, gridData, $q) {
        $scope.rowsPerPage = 1000;

        function dataGService(requestType) {
            // service request type can be COLUMN_ONLY OR DATA_ONLY.  DEFAULT is DATA.
            var deferred = $q.defer();
            var promise;

            if (requestType === 1) {
                promise = gridData.getDataPromise();
            }
            else {
                var allCols = gridData.getColumns();
                var someCols = allCols.slice(0, 3);
                promise = $q.when(someCols);
            }

            promise.then(
                function(data) {
                    return deferred.resolve(data);
                },
                function(resp) {
                    return deferred.reject(resp);
                }
            );

            return deferred.promise;
        }

        // setup the view model info
        angular.extend(this, {
            listid       : 2349823904820348,
            type         : 'report',
            title        : 'Example Dataset',
            selectedItems: [],
            dataService  : dataGService,
            //persons : gridData.getDataPromise(),

            // Define Grid settings
            //columnDefs : gridData.getColumns(),
            qbseGridOptions: {
                showColumnMenu    : false,
                showGroupPanel    : false,
                paginationPageSize: $scope.rowsPerPage
            },
            qbseGridApi    : {}
        });

    }
}());
