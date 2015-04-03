(function() {
    'use strict';

    //define the module
    angular
        .module('gridExample', ['qbse.grid', 'ngResource', 'ngLodash'])

        // instantiate the controller
        .controller('GridExampleController', GridExampleController);

    // inject what it needs
    GridExampleController.$inject = ['$scope', 'exampleData', 'lodash'];

    // Implement the controller
    function GridExampleController($scope, exampleData, _) {
        console.log('lodash version %s', _.VERSION);

        // decide what data to use
        var exampleSize = 'Large';
        var requestSize = location.search.replace(/^.*?\=/, '');

        if (requestSize.toLowerCase() === 'large' || requestSize.toLowerCase() === 'small') {
            exampleSize = requestSize;
        }
        // load up example data &schema
        var schemaPromise = exampleData.get({file:'mockRecordsSchema', size:exampleSize});
        var dataPromise = exampleData.get({file:'mockRecords',size:exampleSize});

        // setup the view model info
        angular.extend(this, {
            listid : 2349823904820348,
            type :'report',
            title : exampleSize + ' Dataset',
            selectedItems : [],
            persons : dataPromise,

            // Define Grid settings
            columnDefs : schemaPromise,
            qbseGridOptions : {
                showColumnMenu: false,
                showGroupPanel: false
            }
        });

    }
}());
