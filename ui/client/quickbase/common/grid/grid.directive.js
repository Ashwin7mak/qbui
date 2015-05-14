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
            'MAX_ROWS_PER_PAGE': 5000,
            'ROWS_PER_PAGE': 100
        })

         // the quickbase grid element directive
        .directive('qbseGrid', GridDirective);

    // its implementation
    function GridDirective() {
        return {
            restrict   : 'E',
            templateUrl: 'quickbase/common/grid/grid.template.html',
            scope      : {
                title: '@?', //one way bind, optional
                items: '=?',
                cols: '=?',
                selectedItems: '=?', // optional option
                customOptions: '=?',  // optional option
                gridApi: '=?',  // optional returns reference to the grid api interface
                service : '=' // data service with supplies content and column definition
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
   GridController.$inject = ['$scope', '$q', '$resource', 'uiGridConstants', 'gridConstants', 'apiConstants', 'PagesHandler', 'lodash' ];
   function GridController($scope, $q, $resource, uiGridConstants, gridConstants, apiConstants, PagesHandler, _){
        $scope.selectedItems = [];
        $scope.validatedItems = [];
        $scope.itemsPromise = $q.defer();
        angular.extend(gridConstants, uiGridConstants);

        if ($scope.service) {
            $scope.dataPromise = $scope.service.getDataPromise();
            $scope.columnInfo = $scope.service.getColumns();
        }

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
            paginationPageSize      : gridConstants.ROWS_PER_PAGE,
            useExternalPagination   : true,
            enableSorting           : false,
            useExternalSorting      : false,
            enablePaginationControls: false
        };

       // user of this directive can provide their own customizations to override the defaults
       // we can control which are allowed here but currently anything goes for overrides
       // in $scope.customOptions;

       $scope.cols =  $scope.columnInfo || [
           {name: 'firstName'},
           {name: 'lastName'},
           {name: 'employed'},
           {name: 'company'}
       ];


       //add alignment based on type
       //right align numbers
       var numberClass = 'ui-grid-number-align';
       function addAlignment(col){
           if (col.fieldType && !col.cellClass &&  (col.fieldType.indexOf(apiConstants.NUMERIC) !== -1 ||
                                 col.fieldType.indexOf(apiConstants.CURRENCY)!== -1 ||
                                 col.fieldType.indexOf(apiConstants.PHONE_NUMBER)!== -1)) {
                   col.cellClass = numberClass;
               }
       }
       // update the alignments for unspecified numeric types
       _.map($scope.cols, addAlignment);


       // the definition of the columns and data
       // in ui-grid terms, required minimally
       $scope.dataOptions = {
           columnDefs: $scope.cols,
           data      : [] // empty until scope.items promise is resolved, and data validated
       };


        //TODO : Sorting initialization

       //combine the defaults then the custom overrides and then required data
       $scope.gridOptions = {};
       angular.extend($scope.gridOptions, $scope.defaultOptions, $scope.customOptions, $scope.dataOptions);

       //state and handling of grid pages
       var getTotalPagesMethod = function() {
           if (!$scope.gridOptions.enablePagination) {
               return null;
           }
           return $scope.pagesHandler.getTotalPages();
       };
       // initially just a file
       //var resource = $resource('quickbase/common/mockdata/1000.json');
       $scope.pagesHandler = new PagesHandler($scope.service, gridConstants, $scope.gridOptions);

        // gridApi is how we can hook into the grid events, keep api handle on scope
        $scope.gridOptions.onRegisterApi = function(gridApi) {
            $scope.gridApi = gridApi;

            //add our api extensions ( TBD -keep our api separate to allow switching grid implementations?)
            $scope.gridApi.loadPage = $scope.pagesHandler.loadCurrentPage.bind($scope.pagesHandler);
            $scope.gridApi.updatePageSize =  $scope.pagesHandler.updatePageSize.bind($scope.pagesHandler);

            //set up handling of sorting and next/prev page actions
            gridApi.core.on.sortChanged($scope, $scope.pagesHandler.sortList.bind($scope.pagesHandler));
            gridApi.pagination.on.paginationChanged($scope,  $scope.pagesHandler.updatePages.bind($scope.pagesHandler));

            //override default getTotalPage to support unknown data size until end is reached
            gridApi.pagination.getTotalPages = getTotalPagesMethod;

            //note :
            // full table search is no longer supported in ui-grid,
            // see http://ui-grid.info/docs/#/tutorial/103_filtering
            // ui-grid has filtering per column
            // only in ng-grid we may need to provide it for small tables
            // will need to add to api for this cross column filtering
        };

       $scope.pagesHandler.loadCurrentPage();

    }



})();
