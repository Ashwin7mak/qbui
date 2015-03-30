(function() {
    'use strict';
    /***
     * This module is used to expand on the angular ui directive
     * to support Quickbase grid features on a various lists of data
     * it also provides some default settings for the grid options for consistency
     * in user experience.
     *
     * If we need to workaround/extend the ui-grid code we will use the decorator pattern
     * to add features if they can not be tacked on here
     * I created an example of this pattern in plunker http://plnkr.co/edit/bXYL19
     *
     */

    var gridModule = angular.module('qbse.grid', [
        'ui.grid',
        'ui.grid.selection'
    ]);

    /**
     * Setup some consts
     *
     */
    gridModule.value('gbseGridConsts', {
        'MAX_ROWS_PER_PAGE': 500
    });

    /**
     * a quickbase grid element directive
    **/
    gridModule.directive('qbseGrid', function() {
        return {
            restrict   : 'E',
            templateUrl: 'grid.template.html',
            scope      : {
                title: '@',
                items: '=',
                cols: '=',
                selectedItems: '=',
                customOptions: '='
            },
            replace    : true,
            transclude : false,
            controller : qbseGridController
        };

    });


    /**
    * this internal controller for this grid directive
    * keeps track of selected items
    * and defines default options for initializing the directive
    */
   function qbseGridController($scope, $http, $log, $interval, uiGridConstants, gbseGridConsts){
        $scope.selectedItems = [];

        // user of this directive can provide their own customizations to override the defaults
        // we can control which are allowed here but currently anything goes for overrides
        var customOptions = $scope.customOptions;

        // the definition of the columns and data
        // in ui-grid terms, required minimally
        var fixedOptions = {
            columnDefs: $scope.cols,
            data      : $scope.items
        };

        // the defaults we'll use for grids
        var defaultOptions = {
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
        //TODO: Paging
        // if data size is > some MAX for browser
        // truncate a copy of the set until we get to
        // paging implementation
        $scope.items.$promise.then(function(resolveData) {
            if (resolveData.length > gbseGridConsts.MAX_ROWS_PER_PAGE){
                fixedOptions.data = resolveData.slice(0).slice(0,gbseGridConsts.MAX_ROWS_PER_PAGE);
                $scope.tooManyToShow = fixedOptions.data.length;
            }
        });
        //TODO : Sorting initialization

        //combine the defaults and the overrides
        $scope.gridOptions = {};
        angular.extend($scope.gridOptions, defaultOptions);
        angular.extend($scope.gridOptions, customOptions);
        angular.extend($scope.gridOptions, fixedOptions);

        // make sure it what we expect
        $log.debug($scope.gridOptions);

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
        $scope.$watch('scopeItemThatChanges', function(value) {
            if ($scope.gridApi) {
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
            }
        });

        // way to load up data from url specified
        if (customOptions.asyncLoad) {
            $http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/500_complex.json')
                //$http.get(asyncLoad)
                .success(function(data) {
                    $scope.gridOptions.data = data;

                    // $interval whilst we wait for the grid to digest the data we just gave it
                    $interval(function() {
                        if ($scope.gridApi) {
                            $scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);
                        }
                    }, 0, 1);
                });
        }
    }

})();
