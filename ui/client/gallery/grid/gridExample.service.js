(function() {
    'use strict';

    /**
     * Service for loading example data for grid
     */
    angular
            .module('gallery.gridExample')

        //define example data &schema
            .factory('ExampleData', ExampleData);

    //inject what it needs
    ExampleData.$inject = ['$resource'];

    // the factory implementation
    function ExampleData($resource) {
        return $resource('quickbase/common/mockdata/:file:size.json', {file: '@file', size: '@size'}, {
                    get: {
                        method: 'GET', isArray: true
                    }
                }
        );
    }
}());

