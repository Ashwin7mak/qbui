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
     *
     * TODO : Which additional features:
     *      use ui.grid.autoResize for sizing to container? - see: http://ui-grid.info/docs/#/tutorial/213_auto_resizing
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
                testdata: '=',
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
   GridController.$inject = ['$scope', '$log', 'uiGridConstants', 'gridConstants'];
   function GridController($scope, $log, uiGridConstants, gridConstants){
        $scope.selectedItems = [];

        // user of this directive can provide their own customizations to override the defaults
        // we can control which are allowed here but currently anything goes for overrides
        var customOptions = $scope.customOptions;

        // the definition of the columns and data
        // in ui-grid terms, required minimally
       $scope.fixedOptions = {
            columnDefs: $scope.cols,
            data      : $scope.items
        };

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

        $scope.checkForTooLargeData = function(resolveData) {
            if (resolveData.length > gridConstants.MAX_ROWS_PER_PAGE) {
                $scope.totalRows = resolveData.length;
                $scope.gridOptions.data.slice(0, gridConstants.MAX_ROWS_PER_PAGE);
                $scope.tooManyToShow = true;
            }
        };

        //TODO: Paging
        // if data size is > some MAX for browser
        // truncate the set until we get to
        // paging implementation work
        $scope.items.$promise.then($scope.checkForTooLargeData);

        //TODO : Sorting initialization

        //combine the defaults and the overrides
        $scope.gridOptions = {};
        angular.extend($scope.gridOptions, $scope.defaultOptions);
        angular.extend($scope.gridOptions, customOptions);
        angular.extend($scope.gridOptions, $scope.fixedOptions);

        // gridApi is how we can hook into the grid events
        $scope.gridOptions.onRegisterApi = function(gridApi){
            $scope.gridApi = gridApi;
            // example of how we can setup listeners on grid events
            $scope.gridApi.selection.on.rowSelectionChanged($scope,function(row){
                var msg = 'row selected ' + row.isSelected;
                $log.log(msg);
            });

            $scope.gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
                var msg = 'rows changed ' + rows.length;
                $log.log(msg);
            });
        };


        // full table search is no longer supported in ui-grid,
        // see http://ui-grid.info/docs/#/tutorial/103_filtering
        // only in ng-grid we may need to provide it for small tables

       //wn
        $scope.$watch('scopeItemThatChanges', function() {
            if ($scope.gridApi) {
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
            }
        });
    }



})();
