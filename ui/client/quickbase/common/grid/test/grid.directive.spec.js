describe('Directive: qbseGrid', function() {
    'use strict';
    /**
     * Unit test for the grid component
     *
     */
     // load the directive's module & load the template
    beforeEach(module('qbse.grid', 'common.gridExample',
        'quickbase/common/grid/grid.template.html',
        'quickbase/common/grid/gridPagination.template.html'));

    // The problem with testing a directive with a templateUrl is that Angular uses an HTTP request to go
    // get the file. However, in a unit-testing environment, you don't have the full web server environment
    // and can't actually make the HTTP request. So we want to pre-process your HTML template and convert in
    // into Javascript, which can be testing without any need for HTTP requests, this is done in the karma
    // config with ngHtml2JsPreprocessor
    //
    var element, elementHtml, gridConstants, dataArray;
    var $compile, $rootScope, $element, $q, $scope;

    // mock the containing controller
    beforeEach(inject(function(_$compile_, _$rootScope_, _$q_, _gridConstants_) {
        //  and a mock scope
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $compile = _$compile_;
        $q = _$q_;
        gridConstants = _gridConstants_;
        elementHtml =
            '<qbse-grid ' +
            'grid-id="listid" ' +
            'grid-type=type" ' +
            'title={{title}} ' +
            'items="settings.items" ' +
            'selected-items="settings.selectedItems" ' +
            'cols="settings.columnDefs" ' +
            'custom-options="settings.gridOptionsOverrides"> ' +
            'This gets replaced with data - loading...' +
            '</qbse-grid>';

        // set up some example data for the grid
        dataArray = [{'name': 'Indigo', 'count': 7}, {'name': 'Cyan', 'count': 5},
            {'name': 'Agave', 'count': 8}];
        $scope.settings = {};
        $scope.listid = 100;
        $scope.type = 'test';
        $scope.title = 'test Title';

        // expects a promise for the data, so wrap array in a promise
        $scope.settings.items = $q.when(dataArray);
        $scope.settings.selectedItems = [];
        $scope.settings.columnDefs = [{'name': 'name', 'displayName': 'Team'},
            {'name': 'count', 'displayName': 'Size'}];
        $scope.settings.gridOptionsOverrides = {};

        // create the html dom fragment and process the angular
        $element = angular.element(elementHtml);
        element = $compile($element)($scope);

    }));

    it('qbseGrid should have a element with a ui-grid', function() {
        $scope.$digest();
        expect(element.find('.ui-grid')).toBeDefined();
    });

    it('qbseGrid should have a column names in header', function() {
        $scope.$digest();
        var header = element.find('.ui-grid-header-cell');
        var headertext = header.text();
        var isolateScope = element.isolateScope();
        isolateScope.itemsPromise.promise.then(function() {
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

    it('qbseGrid should have a column data in body', function() {
        $scope.$digest();
        var body = element.find('.ui-grid-viewport');
        var bodytext = body.text();
        var isolateScope = element.isolateScope();
        isolateScope.itemsPromise.promise.then(function() {
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

    it('qbseGrid should have a total rows', function() {
        $scope.$digest();
        var isolateScope = element.isolateScope();
        isolateScope.itemsPromise.promise.then(function() {
            expect(isolateScope.origTotalRows).toBe(dataArray.length);
        });
        $rootScope.$digest();
    });

    it('qbseGrid should have overridden default option', function() {
        $scope.settings.gridOptionsOverrides = {showColumnFooter: true};
        $scope.$digest();

        var isolateScope = element.isolateScope();
        expect(isolateScope.gridOptions.showColumnFooter).toEqual(true);
        expect(isolateScope.defaultOptions.showColumnFooter).toEqual(false);
    });

    it('qbseGrid should have limited to max rows', function() {
        var largeList = [];
        for (var i = 0; i <= gridConstants.MAX_ROWS_PER_PAGE; i++) {
            largeList.push({item: i});
        }
        $scope.settings.columnDefs = [{'name': 'index'}];
        $scope.settings.items = $q.when(largeList);
        $scope.$digest();

        // make sure the validated data is truncated to the maxrows limit
        var isolateScope = element.isolateScope();
        isolateScope.itemsPromise.promise.then(function(gottenData) {
            expect(isolateScope.tooManyToShow).toEqual(true);
            expect(gottenData.length).toEqual(gridConstants.MAX_ROWS_PER_PAGE);
        });

        // must hand-crank the digest cycle to process deferreds
        // see ;http://brianmcd.com/2014/03/27/a-tip-for-angular-unit-tests-with-promises.html
        $rootScope.$digest();
    });

});
