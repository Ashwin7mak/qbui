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
            'ui.grid.selection',
            'ui.grid.pagination'
        ])
        // Setup some consts
        .constant('gridConstants', {
            'MAX_ROWS_PER_PAGE': 10000, //will truncate data at this point
            'ROWS_PER_PAGE': 50
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
   GridController.$inject = ['$scope', '$q', 'uiGridConstants', 'gridConstants', '$http'];
   function GridController($scope, $q, uiGridConstants, gridConstants, $http){
        $scope.selectedItems = [];
        $scope.validatedItems = [];
        $scope.itemsPromise = $q.defer();

       //state and handling of grid pages
       $scope.pagesHandler =
       {
           current: {
               pageSize  : gridConstants.ROWS_PER_PAGE,
               totalPages: Number.MAX_VALUE,
               pageNumber: 1,
               pageTopRow: 0,
               sort      : null
           }
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
            showSelectionCheckbox    : false,
            paginationPageSizes     : [25, 50, 75],
            paginationPageSize      : $scope.pagesHandler.current.pageSize,
            useExternalPagination   : true,
            enableSorting           : false,
            useExternalSorting      : false,
            enablePaginationControls: false
        };

       // user of this directive can provide their own customizations to override the defaults
       // we can control which are allowed here but currently anything goes for overrides
       // in $scope.customOptions;

       // the definition of the columns and data
       // in ui-grid terms, required minimally
       $scope.dataOptions = {
           //columnDefs: $scope.cols,
           //TODO : dynamically get defs from grid config service
           columnDefs : [
           {name: 'firstName'},
           {name: 'lastName'},
           {name: 'employed'},
           {name: 'company'}
                 ],
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

       // handle paging of rows
       $scope.pagesHandler.sortList = function(grid, sortColumns) {
           if (sortColumns.length === 0) {
               $scope.pagesHandler.current.sort = null;
           } else {
               $scope.pagesHandler.current.sort = sortColumns[0].sort.direction;
           }
           getPage();
       };
       $scope.pagesHandler.updatePages = function(newPage, pageSize) {
           $scope.pagesHandler.current.pageNumber = newPage;
           $scope.pagesHandler.current.pageSize = pageSize;
           $scope.pagesHandler.current.pageTopRow = (newPage - 1) * pageSize;

           getPage();
           $scope.pagesHandler.current.totalPages = $scope.gridApi.pagination.getTotalPages();
           $scope.pagesHandler.current.pageBottomRow = $scope.pagesHandler.current.pageTopRow + $scope.gridOptions.data.length;
       };

       $scope.pagesHandler.getTotalPagesMsg = function() {
           if ($scope.pagesHandler.current.foundEnd) {
               return $scope.pagesHandler.current.totalRows;
           }
       };

       // data items array or promise of data validated when available
       //TODO : disabled old service fetch for getData below resync
        //$q.when($scope.items).then($scope.checkForTooLargeData);


        // gridApi is how we can hook into the grid events, keep api handle on scope
        $scope.gridOptions.onRegisterApi = function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, $scope.pagesHandler.sortList);
            gridApi.pagination.on.paginationChanged($scope, $scope.pagesHandler.updatePages);

            //override default getTotalPage to support unknown size until end it reached
            gridApi.pagination.getTotalPages = function() {
                if (!$scope.gridOptions.enablePagination) {
                    return null;
                }
                if ($scope.pagesHandler.current.morePages) {
                    return ($scope.pagesHandler.current.foundEnd) ? $scope.pagesHandler.current.foundEnd : Number.MAX_VALUE;
                } else {
                    return $scope.pagesHandler.current.pageNumber;
                }
                //return ($scope.gridOptions.totalItems === 0) ? 1 :
                //Math.ceil($scope.gridOptions.totalItems / $scope.gridOptions.paginationPageSize);
            };
        };

       //TODO: move static data to a service
       var getPage = function() {
           var url;
           var testdataurl = 'quickbase/common/mockdata/1000.json';

           switch ( $scope.pagesHandler.current.sort) {
               case uiGridConstants.ASC:
                   url = testdataurl;
                   break;
               case uiGridConstants.DESC:
                   url = testdataurl;
                   break;
               default:
                   url = testdataurl;
                   break;
           }

           $http.get(url)
               .success(function(data) {
                   $scope.gridOptions.totalItems = 1000;

                   var current = $scope.pagesHandler.current;

                   var firstRow = ( current.pageNumber - 1) *
                                    current.pageSize;
                   $scope.gridOptions.data = data.slice(firstRow, firstRow +  current.pageSize);
                   //console.log("firstrow " + firstRow)
                   //console.log("current.pageSize " +  current.pageSize)
                   //console.log("scope.gridOptions.totalItems " + $scope.gridOptions.totalItems)
                   current.totalPages = $scope.gridApi.pagination.getTotalPages();
                   current.pageBottomRow =  current.pageTopRow +  $scope.gridOptions.data.length;

                   if (( current.foundEnd &&  current.pageNumber < current.foundEnd ) ||
                       (firstRow +  current.pageSize) < $scope.gridOptions.totalItems) {
                       current.morePages = true;
                   } else {
                       current.morePages = false;
                       current.foundEnd =  current.pageNumber;
                       current.totalRows =  current.pageTopRow +  $scope.gridOptions.data.length;
                   }
               });
       };

       getPage();
       // full table search is no longer supported in ui-grid,
        // see http://ui-grid.info/docs/#/tutorial/103_filtering
        // ui-grid has filtering per column
        // only in ng-grid we may need to provide it for small tables

    }



})();
