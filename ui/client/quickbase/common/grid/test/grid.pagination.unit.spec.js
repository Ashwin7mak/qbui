describe('Directive: qbseGrid pagination - ', function() {
    'use strict';
    /**
     * Unit test for the grid pagination
     *
     */

    // The problem with testing a directive with a templateUrl is that Angular uses an HTTP request to go
    // get the file. However, in a unit-testing environment, you don't have the full web server environment
    // and can't actually make the HTTP request. So we want to pre-process your HTML template and convert in
    // into Javascript, which can be testing without any need for HTTP requests, this is done in the karma
    // config with ngHtml2JsPreprocessor
    //
    var element, elementHtml, gridConstants;
    var $compile, $rootScope, $element, $scope, $http, $httpBackend, testDataService;
    var expectedTotalRows;

    var minTestRecordsToGenerate = 100;
    var maxTestRecordsToGenerate = 1000;
    var expectedPageSize = 100;
    var normalTestColumnsToGenerate = 6;
    var megaTestColumnsToGenerate = 500;
    var chance = new Chance(12345);

    console.info('qbseGrid pagination values: ');
    console.info('minTestRecords ' + minTestRecordsToGenerate);
    console.info('maxTestRecords ' + maxTestRecordsToGenerate);
    console.info('expectedPageSize ' + expectedPageSize);
    console.info('maxTestColumns ' + normalTestColumnsToGenerate);

    // generate some records and field definitions to use
    function generateTestData(minRecords, maxRecords, maxCols) {
        expectedTotalRows = testDataService.getRandomInt(chance, minRecords, maxRecords);
        console.info(' random expectedTotalRows : ' + expectedTotalRows);

        var config = {
            numRows   : expectedTotalRows,
            numColumns: maxCols
        };
        testDataService.setConfiguredGridData(config);

        return expectedTotalRows;
    }

    // load the directive's module & load the template
    beforeEach(module('qbse.grid', 'test.dataGeneratorService',
        'qbse.templates',
        'ngMockE2E'));


    // mock the containing controller
    beforeEach(inject(function(_$compile_, _$rootScope_, _gridConstants_, _$http_, $injector, TestDataService) {
        //  and a mock scope
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $compile = _$compile_;
        $http = _$http_;
        gridConstants = _gridConstants_;
        testDataService = TestDataService;

        $httpBackend = $injector.get('$httpBackend');

        $scope.settings = {};
        $scope.settings.id = '1';
        $scope.settings.type = 'report';
        $scope.settings.title = 'Grid Test';
        $scope.settings.selectedItems = [];
        $scope.settings.customOptions = {
            showColumnFooter  : true,
            paginationPageSize: expectedPageSize
        };


        $scope.settings.service = TestDataService.dataGridReportService;


        elementHtml =
            '<qbse-grid ' +
            'title={{settings.title}} ' +
            'selected-items="settings.selectedItems" ' +
            'custom-options="settings.customOptions" ' +
            'service="settings.service"> ' +
            'This gets replaced with data - loading...' +
            '</qbse-grid>';

        // create the html dom fragment and process the angular
        $element = angular.element(elementHtml);
        element = $compile($element)($scope);

        $scope.$digest();

    }));

    it('should have a element with a ui-grid', function() {
        // create the html dom fragment and process the angular directive
        generateTestData(minTestRecordsToGenerate, maxTestRecordsToGenerate, normalTestColumnsToGenerate);
        $element = angular.element(elementHtml);
        element = $compile($element)($scope);

        expect(element.find('.ui-grid')).toBeDefined();
    });

    it('qbseGrid should have pagehandler setup and initialized', function() {
        // create the html dom fragment and process the angular directive
        generateTestData(minTestRecordsToGenerate, maxTestRecordsToGenerate, normalTestColumnsToGenerate);
        $element = angular.element(elementHtml);
        element = $compile($element)($scope);
        $scope.$digest();

        var isolateScope = element.isolateScope();

        expect(isolateScope.pagesHandler).not.toBeNull();
        expect(isolateScope.pagesHandler.current.pageNumber).toBe(1);
        expect(isolateScope.pagesHandler.current.pageSize).toBe(expectedPageSize);
        expect(isolateScope.pagesHandler.current.pageTopRow).toBe(0);
    });


    it('should support empty record set', function() {
        // create the html dom fragment and process the angular directive
        var rowsMade = generateTestData(0, 0, normalTestColumnsToGenerate);
        expect(rowsMade).not.toBeNull();
        $element = angular.element(elementHtml);
        element = $compile($element)($scope);
        $scope.$digest();

        var isolateScope = element.isolateScope();

        expect(element.find('.ui-grid')).toBeDefined();
        expect(isolateScope.pagesHandler).not.toBeNull();
        expect(isolateScope.pagesHandler.current.pageNumber).toBe(1);
        expect(isolateScope.pagesHandler.current.pageSize).toBe(expectedPageSize);
        expect(isolateScope.pagesHandler.current.pageTopRow).toBe(0);
        expect(isolateScope.pagesHandler.current.pageBottomRow).toBe(0);

    });

    it('should support empty fields set', function() {
        // create the html dom fragment and process the angular directive
        var rowsMade = generateTestData(1, 200, 0);
        expect(rowsMade).not.toBeNull();
        $element = angular.element(elementHtml);
        element = $compile($element)($scope);
        $scope.$digest();

        var isolateScope = element.isolateScope();

        expect(element.find('.ui-grid')).toBeDefined();
        expect(isolateScope.pagesHandler).not.toBeNull();
        expect(isolateScope.pagesHandler.current.pageNumber).toBe(1);
        expect(isolateScope.pagesHandler.current.pageSize).toBe(expectedPageSize);
        expect(isolateScope.pagesHandler.current.pageTopRow).toBe(0);


    });


    it('should support large fields set', function() {
        // create the html dom fragment and process the angular directive
        var rowsMade = generateTestData(1, 200, megaTestColumnsToGenerate);
        expect(rowsMade).not.toBeNull();
        $element = angular.element(elementHtml);
        element = $compile($element)($scope);
        $scope.$digest();

        var isolateScope = element.isolateScope();

        expect(element.find('.ui-grid')).toBeDefined();
        expect(isolateScope.pagesHandler).not.toBeNull();
        expect(isolateScope.pagesHandler.current.pageNumber).toBe(1);
        expect(isolateScope.pagesHandler.current.pageSize).toBe(expectedPageSize);
        expect(isolateScope.pagesHandler.current.pageTopRow).toBe(0);

    });

    it('should support unfull page', function() {
        // create the html dom fragment and process the angular directive
        var rowsMade = generateTestData(1, expectedPageSize - 1, normalTestColumnsToGenerate);
        expect(rowsMade).not.toBeNull();
        $element = angular.element(elementHtml);
        element = $compile($element)($scope);
        $scope.$digest();

        var isolateScope = element.isolateScope();

        expect(element.find('.ui-grid')).toBeDefined();
        expect(isolateScope.pagesHandler).not.toBeNull();
        expect(isolateScope.pagesHandler.current.pageNumber).toBe(1);
        expect(isolateScope.pagesHandler.current.pageSize).toBe(expectedPageSize);
        expect(isolateScope.pagesHandler.current.pageTopRow).toBe(0);

    });


    describe('paging via next to end ', function() {
        it('qbseGrid should have correct page state at next page', function() {
            // create the html dom fragment and process the angular directive
            generateTestData(minTestRecordsToGenerate, maxTestRecordsToGenerate, normalTestColumnsToGenerate);
            $element = angular.element(elementHtml);
            element = $compile($element)($scope);
            $scope.$digest();

            var isolateScope = element.isolateScope();

            // expect more pages if expectedTotalRows > expectedPageSize
            //var morePages = (expectedTotalRows > expectedPageSize);
            //if (morePages) {
            //    expect(isolateScope.pagesHandler.noNext()).toBeFalsy();
            // } else {
            //    expect(isolateScope.pagesHandler.noNext()).toBeTruthy();
            //}

            // step thru all next pages
            while (!isolateScope.pagesHandler.noNext()) {
                var lastBottom = isolateScope.pagesHandler.current.pageBottomRow;
                isolateScope.gridApi.pagination.nextPage();
                $scope.$digest();
                //validate new current state
                expect(isolateScope.pagesHandler.current.pageTopRow).toBe(Math.min(lastBottom, expectedTotalRows));
                expect(isolateScope.pagesHandler.current.pageBottomRow).toBe(Math.min(lastBottom + expectedPageSize, expectedTotalRows));
            }

            // make sure the total num rows was discovered and valid
            //if (isolateScope.pagesHandler.current.foundEnd) {
            //    expect(isolateScope.pagesHandler.current.totalRows).toBe(expectedTotalRows);
            //}

        });
    });

    describe('paging prev to start ', function() {
        it('qbseGrid should have correct page state at each prev page', function() {
            // create the html dom fragment and process the angular directive
            generateTestData(minTestRecordsToGenerate, maxTestRecordsToGenerate, normalTestColumnsToGenerate);
            $element = angular.element(elementHtml);
            element = $compile($element)($scope);
            $scope.$digest();

            var isolateScope = element.isolateScope();

            // step thru all next pages
            // step thru to the end ...
            while (!isolateScope.pagesHandler.noNext()) {
                isolateScope.gridApi.pagination.nextPage();
                $scope.$digest();
            }

            //... then step back thru prev pages
            while (!isolateScope.pagesHandler.noPrev()) {
                var lastTop = isolateScope.pagesHandler.current.pageTopRow;
                isolateScope.gridApi.pagination.previousPage();
                $scope.$digest();
                //validate new current state
                expect(isolateScope.pagesHandler.current.pageTopRow).toBe(Math.max(lastTop - expectedPageSize, 0));
                expect(isolateScope.pagesHandler.current.pageBottomRow).toBe(lastTop);
            }
            //final update for any async promises
            $rootScope.$digest();

        });
    });

});
