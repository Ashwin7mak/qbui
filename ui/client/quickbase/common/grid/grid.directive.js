(function () {
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
     * cols -  expected to be an array with display name and/or name member for each of cols to display
     *    options that can be set in cols for column definitions and example values are as follows: (From https://github.com/angular-ui/ng-grid/wiki/Defining-columns)
     *    TODO:Determine which options are not overridable for a qbse.grid
     *      width: 60
     *      minWidth: 50
     *      maxWidth: 9000
     *      visible: true
     *      field: "foo" Can also be a property path on your data model. "foo.bar.myField", "Name.First", etc..
     *      displayName: "Pretty Foo"
     *      sortable: true
     *      resizable: true
     *      groupable: true allows the column to be grouped with drag and drop, but has no effect on gridOptions.groups
     *      pinnable: true allows the column to be pinned when enablePinning is set to true
     *      editableCellTemplate: true the template to use while editing
     *      enableCellEdit: true allows the cell to use an edit template when focused (grid option enableCellSelection must be enabled)
     *      cellEditableCondition: 'true' controls when to use the edit template on per-row basis using an angular expression (enableCellEdit must also be true for editing)
     *      sortFn: function(a,b){return a > b} (see Sorting and Filtering)
     *      cellTemplate: ""(see Templating)
     *      cellClass: "userDefinedCSSClass"
     *      headerClass: "userDefinedCSSClass"
     *      headerCellTemplate: "" (see Templating)
     *      cellFilter: string name for filter to use on the cell ('currency', 'date', etc..)
     *      aggLabelFilter: string name for filter to use on the aggregate label ('currency', 'date', etc..) defaults
     *      to cellFilter if not set.
     *
     * title - grid title which optional
     * customOptions - optional any overrides to the default grid settings
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
        .module('qbse.grid')
        // Setup some consts
        .constant('gridConstants', {
            'MAX_ROWS_PER_PAGE': 10000,
            'ROWS_PER_PAGE': 100,
            'SERVICE_REQ': {
                'DATA': 1,
                'COLS': 2
            }
        })

        // the quickbase grid element directive
        .directive('qbseGrid', GridDirective);

    // its implementation
    function GridDirective() {
        return {
            restrict: 'E',
            templateUrl: 'quickbase/common/grid/grid.template.html',
            scope: {
                title: '@?',                //one way bind, optional
                selectedItems: '=?',        // optional option
                customOptions: '=?',        // optional option
                gridApi: '=?',              // optional returns reference to the grid api interface
                dataServiceFunc: '=service' // data service function that supplies content and column definition
            },
            replace: true,
            transclude: false,
            controller: GridController
        };
    }

    /**
     * this internal controller for this grid directive
     * keeps track of selected items
     * and defines default options for initializing the directive
     */
    GridController.$inject = ['$scope', '$q', 'uiGridConstants', 'gridConstants', 'apiConstants', 'PagesHandler', 'lodash'];
    function GridController($scope, $q, uiGridConstants, gridConstants, apiConstants, PagesHandler, _) {
        $scope.selectedItems = [];
        angular.extend(gridConstants, uiGridConstants);

        // the defaults we'll use for grids
        $scope.defaultOptions = {
            enableColumnResizing: true,
            enableFiltering: false,
            enableGridMenu: false,
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableRowHeaderSelection: false,
            enableRowSelection: true,
            modifierKeysToMultiSelect: false,
            multiSelect: false,
            noUnselect: false,
            selectedItems: $scope.selectedItems,
            showColumnFooter: false,
            showFooter: true,
            showGridFooter: false,
            showSelectionCheckbox: false,
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: gridConstants.ROWS_PER_PAGE,
            useExternalPagination: true,
            enableSorting: false,
            useExternalSorting: false,
            enablePaginationControls: false
        };

        //combine the defaults then the custom overrides
        $scope.gridOptions = {};
        angular.extend($scope.gridOptions, $scope.defaultOptions, $scope.customOptions);

        //  initialize the grid, get the cols (if defined) to display for this grid instance and page one instance of
        //  of the data grid.
        $q.all({
            grid: initGrid(),
            cols: initGridColumns($scope.dataServiceFunc)
        }).then(
            function (init) {
                //  List of columns to add to the ui grid.  Only these data columns will render
                //  in the grid.   If columns is empty, then all columns are rendered (grid default).
                if (init.cols) {
                    angular.extend($scope.gridOptions, {columnDefs: init.cols});
                }
                //TODO : Sorting??

                // update the pages handler with the updated grid options
                $scope.pagesHandler.setGridOptions($scope.gridOptions);

                // load up the initial page
                $scope.pagesHandler.loadCurrentPage();
            },
            function(resp) {
                console.log('Error loading init grid data.  Resp:' + resp);
            }
        );

        //   Function to initialize the grid component
        //
        function initGrid() {

            return $q(function (resolve) {

                //state and handling of grid pages
                var getTotalPagesMethod = function () {
                    if (!$scope.gridOptions.enablePagination) {
                        return null;
                    }
                    return $scope.pagesHandler.getTotalPages();
                };

                // the page handler manages getting  data from the service as needed
                $scope.pagesHandler = new PagesHandler($scope.dataServiceFunc, gridConstants, $scope.gridOptions);

                // gridApi is how we can hook into the grid events, keep api handle on scope
                $scope.gridOptions.onRegisterApi = function (gridApi) {
                    $scope.gridApi = gridApi;

                    //add our api extensions ( TBD -keep our api separate to allow switching grid implementations?)
                    $scope.gridApi.loadPage = $scope.pagesHandler.loadCurrentPage.bind($scope.pagesHandler);
                    $scope.gridApi.updatePageSize = $scope.pagesHandler.updatePageSize.bind($scope.pagesHandler);

                    //set up handling of next/prev page actions
                    gridApi.pagination.on.paginationChanged($scope, $scope.pagesHandler.updatePages.bind($scope.pagesHandler));

                    //override default getTotalPage to support unknown data size until end is reached
                    gridApi.pagination.getTotalPages = function () {
                        if (!$scope.gridOptions.enablePagination) {
                            return null;
                        }
                        return $scope.pagesHandler.getTotalPages();
                    };

                    //note :
                    // full table search is no longer supported in ui-grid,
                    // see http://ui-grid.info/docs/#/tutorial/103_filtering
                    // ui-grid has filtering per column
                    // only in ng-grid we may need to provide it for small tables
                    // will need to add to api for this cross column filtering
                };

                resolve();

            });

        }

        //
        //   Get the grid columns
        //
        function initGridColumns(dataServiceFunc) {

            var deferred = $q.defer();

            //add column alignment classes based on data type : right aligns numbers
            var numberClass = 'ui-grid-number-align';

            function addAlignment(col) {
                if (col.fieldType && !col.cellClass && (col.fieldType.indexOf(apiConstants.NUMERIC) !== -1 ||
                    col.fieldType.indexOf(apiConstants.CURRENCY) !== -1 ||
                    col.fieldType.indexOf(apiConstants.PHONE_NUMBER) !== -1)) {
                    col.cellClass = numberClass;
                }
            }

            if (dataServiceFunc) {
                $q.when(dataServiceFunc(gridConstants.SERVICE_REQ.COLS)).then(
                    function (columns) {
                        // update the alignments for unspecified numeric types
                        _.map(columns, addAlignment);
                        deferred.resolve(columns);
                    },
                    function (resp) {
                        deferred.resolve({cols: null});
                        console.log('error retrieving columns for grid' + resp);
                    }
                );
            }
            else {
                deferred.resolve({cols: null});  // resolve to an empty column array
            }

            return deferred.promise;
        }

    }


})();
