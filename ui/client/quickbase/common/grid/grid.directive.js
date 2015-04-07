(function() {
    'use strict';
    /***
     * This module is used to expand on the angular ui.grid directive
     * to support Quickbase grid features on a various lists of data
     * it also provides some default settings for the grid options for consistency
     * in user experience.
     *
     * If we need to workaround/extend the ui-grid code we will use the decorator pattern
     * to add features if they can not be tacked on here
     * I created an example of this pattern in plunker http://plnkr.co/edit/bXYL19
     *
     * Expects :
     * items - value to be a promise of data values array
     * cols -  expected to be an array with displayname and/or name member for each of cols to display
     * title is optional
     * customOptions - any overrides to the default grid settings
     *
     * Possible additional later features:
     *      selectedItems - array of row index to select (TODO)
     *      use ui.grid.autoResize for sizing to container -
     *              see: http://ui-grid.info/docs/#/tutorial/213_auto_resizing
     *      use export to csv or pdf - http://ui-grid.info/docs/#/tutorial/206_exporting_data
     */

    angular
        // define the QuickBase (qbse) Grid Module
        //depends on the ui-grid and ui-selection see: http://ui-grid.info/
        .module('qbse.grid', [
            'ui.grid',
            'ui.grid.selection'
        ])
        // Setup some consts
        .constant('gridConstants', {
            'MAX_ROWS_PER_PAGE': 500
        })

         // the quickbase grid element directive
        .directive('qbseGrid', GridDirective);

    // its implementation
    function GridDirective() {
        return {
            restrict   : 'E',
            templateUrl: 'quickbase/common/grid/grid.template.html',
            scope      : {
                title: '@', //one way bind
                items: '=',
                cols: '=',
                selectedItems: '=',
                customOptions: '='
            },
            replace    : true,
            transclude : false,
            controller : GridController
        };
    }

    /**
    * this internal controller for this grid directive
    * keeps track of selected items
    * and defines default options for initializing the directive
    */
   GridController.$inject = ['$scope', '$q', 'uiGridConstants', 'gridConstants'];
   function GridController($scope, $q, uiGridConstants, gridConstants){
        $scope.selectedItems = [];
        $scope.validatedItems = [];
        $scope.itemsPromise = $q.defer();

        // the defaults we'll use for grids
        $scope.defaultOptions = {
            enableColumnResizing     : true,
            enableFiltering          : false,
            enableGridMenu           : false,
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableRowHeaderSelection : false,
            enableRowSelection       : true,
            modifierKeysToMultiSelect: false,
            multiSelect              : false,
            noUnselect               : false,
            selectedItems            : $scope.selectedItems,
            showColumnFooter         : false,
            showFooter               : true,
            showGridFooter           : false,
            showSelectionCheckbox    : false
        };

       // user of this directive can provide their own customizations to override the defaults
       // we can control which are allowed here but currently anything goes for overrides
       // in $scope.customOptions;

       // the definition of the columns and data
       // in ui-grid terms, required minimally
       $scope.dataOptions = {
           columnDefs: $scope.cols,
           data      : [] // empty until scope.items promise is resolved, and data valiated
       };


        //TODO : Sorting initialization

        //combine the defaults then the custom overrides and then required data
       $scope.gridOptions = {};
       angular.extend($scope.gridOptions, $scope.defaultOptions, $scope.customOptions, $scope.dataOptions);

       // method to validate data is within supported limit
       $scope.checkForTooLargeData = function(resolveData) {
           var validList = resolveData;
           $scope.origTotalRows = resolveData.length;
           if (resolveData && (resolveData.length > gridConstants.MAX_ROWS_PER_PAGE)) {
               //update the result
               validList = validList.slice(0).slice(0, gridConstants.MAX_ROWS_PER_PAGE);
               $scope.tooManyToShow = true;
           }
           // update the items for the list;
           $scope.itemsPromise.resolve(validList);
           $scope.gridOptions.data = $scope.validatedItems = validList;
           if ($scope.gridApi){
               $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
           }
       };


       //TODO: Paging
       // if data size is > some MAX for browser
       // truncate the set until we get to
       // paging implementation work

       // data items array or promise of data validated when available
        $q.when($scope.items).then($scope.checkForTooLargeData);


        // gridApi is how we can hook into the grid events, keep api handle on scope
        $scope.gridOptions.onRegisterApi = function(gridApi){
            $scope.gridApi = gridApi;
        };


        // full table search is no longer supported in ui-grid,
        // see http://ui-grid.info/docs/#/tutorial/103_filtering
        // ui-grid has filtering per column
        // only in ng-grid we may need to provide it for small tables

    }



})();
