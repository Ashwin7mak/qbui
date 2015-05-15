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
    beforeEach(module('qbse.grid','gallery.gridExample','test.dataGeneratorService',
        'quickbase/common/grid/grid.template.html',
        'quickbase/common/grid/gridPagination.template.html',
        'ngMockE2E'));


    // mock the containing controller
    beforeEach(inject(function(_$compile_, _$rootScope_, _gridConstants_, _$http_, $injector, TestDataService) {
        //  and a mock scope
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $compile = _$compile_;
        $http = _$http_;
        $httpBackend = $injector.get('$httpBackend');
        gridConstants = _gridConstants_;
        testDataService = TestDataService;

        // expects a promise for the data, so wrap array in a promise
        $scope.settings = {};
        $scope.settings.listid = 100;
        $scope.settings.type = 'test';
        $scope.settings.title = 'Grid Test';
        $scope.settings.selectedItems = [];
        $scope.settings.gridOptionsOverrides = {};
        $scope.settings.testData = TestDataService.defaultData();

        elementHtml =
            '<qbse-grid ' +
            'grid-id="settings.listid" ' +
            'grid-type="settings.type" ' +
            'title={{settings.title}} ' +
                //'items="settings.items" ' +
            'selected-items="settings.selectedItems" ' +
                //'cols="settings.columnDefs" ' +
            'custom-options="settings.gridOptionsOverrides" ' +
            'service="settings.testData"> ' +
            'This gets replaced with data - loading...' +
            '</qbse-grid>';

        // create the html dom fragment and process the angular
        $element = angular.element(elementHtml);
        element = $compile($element)($scope);

    }));

    it('should have a element with a ui-grid', function() {
        $scope.$digest();
        expect(element.find('.ui-grid')).toBeDefined();
    });

    it('should have a column names in header', function() {
        $scope.$digest();
        var header = element.find('.ui-grid-header-cell');
        var headertext = header.text();
        var isolateScope = element.isolateScope();
        isolateScope.dataPromise.then(function() {
            isolateScope.gridOptions.columnDefs.forEach(function(col) {
                if (col.displayName) {
                    expect(headertext).toContain(col.displayName);
                } else if (col.name) {
                    expect(headertext).toContain(col.name);
                }
            });
        });
        $rootScope.$digest();
    });

    it('should have a column data in body', function() {
        $scope.$digest();

        var body = element.find('.ui-grid-viewport');
        var bodytext = body.text();
        var isolateScope = element.isolateScope();
        isolateScope.dataPromise.then(function() {
            isolateScope.gridOptions.data.forEach(function(item) {
                if (item.name) {
                    expect(bodytext).toContain(item.name);
                }
                if (item.count) {
                    expect(bodytext).toContain(item.count);
                }
            });
        });
        $rootScope.$digest();
    });

    it('should have a total rows', function() {
        $scope.$digest();
        var isolateScope = element.isolateScope();
        isolateScope.dataPromise.then(function(data) {
            expect(data.length).toBe(testDataService.defaultRows().length);
        });
        $rootScope.$digest();
    });

    it('should have overridden default option', function() {
        $scope.settings.gridOptionsOverrides = {showColumnFooter: true};
        $scope.$digest();

        var isolateScope = element.isolateScope();
        expect(isolateScope.gridOptions.showColumnFooter).toEqual(true);
        expect(isolateScope.defaultOptions.showColumnFooter).toEqual(false);
    });

});
