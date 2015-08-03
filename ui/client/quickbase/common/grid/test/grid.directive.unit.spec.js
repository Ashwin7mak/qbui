describe('Directive: qbseGrid', function() {
    'use strict';
    /**
     * Unit test for the grid component
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
        $scope.settings.customOptions = {showColumnFooter: true};
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
        expect(element.find('.ui-grid')).toBeDefined();
    });

    it('should have a column names in header', function() {

        var header = element.find('.ui-grid-header-cell');
        var headertext = header.text();
        var isolateScope = element.isolateScope();

        isolateScope.gridOptions.columnDefs.forEach(function(col) {
            if (col.displayName) {
                expect(headertext).toContain(col.displayName);
            } else if (col.name) {
                expect(headertext).toContain(col.name);
            }
        });

    });

    it('should have a column data in body', function() {
        var body = element.find('.ui-grid-viewport');
        var bodytext = body.text();
        var isolateScope = element.isolateScope();

        isolateScope.gridOptions.data.forEach(function(item) {
            if (item.name) {
                expect(bodytext).toContain(item.name);
            }
            if (item.count) {
                expect(bodytext).toContain(item.count);
            }
        });

    });

    it('should have a total rows', function() {
        var isolateScope = element.isolateScope();
        expect(isolateScope.gridOptions.data.length).toBe(testDataService.getDataArray().length);

    });

    it('should have overridden default option', function() {
        $scope.settings.gridOptionsOverrides = {showColumnFooter: true};

        var isolateScope = element.isolateScope();
        expect(isolateScope.gridOptions.showColumnFooter).toEqual(true);
        expect(isolateScope.defaultOptions.showColumnFooter).toEqual(false);
    });

});
