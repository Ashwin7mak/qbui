(function() {
    'use strict';

    //get the module
    angular
        .module('gallery.gridExample')

        // instantiate the controller
        .controller('GridExampleController', GridExampleController);

        // inject what it needs
        GridExampleController.$inject = ['$scope', 'gridData'];

        // Implement the controller
        function GridExampleController($scope, gridData) {

            // setup the view model info
            angular.extend(this, {
                listid : 2349823904820348,
                type :'report',
                title : 'Example Dataset',
                selectedItems : [],
                persons : gridData.data(),

                // Define Grid settings
                columnDefs : gridData.columns(),
                qbseGridOptions : {
                    showColumnMenu: false,
                    showGroupPanel: false
                }
            });
        }
}());
