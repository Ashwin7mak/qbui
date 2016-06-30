'use strict';

var routeHelper = require('../../src/routes/routeHelper');
var assert = require('assert');
var sinon = require('sinon');
var log = require('../../src/logger').getLogger();

/**
 * Unit tests for User field formatting
 */
describe('Validate RequestHelper unit tests', function() {

    var stubLog;

    beforeEach(function() {
        stubLog = sinon.stub(log, 'error').returns(true);
    });
    afterEach(function() {
        stubLog.restore();
    });

    describe('validate transformUrlRoute method', function() {
        var testCases = [
            {name: 'test empty url', url: '', curRoute:'abc', newRoute:'def', expectation: ''},
            {name: 'test null url', url: null, curRoute:'abc', newRoute:'def', expectation: null},
            {name: 'test empty curRoute', url: 'apps/12/tables/34', curRoute:'', newRoute:'def', expectation: 'def'},
            {name: 'test valid url - test 1', url: 'apps/123/tables/456/component', curRoute:'component', newRoute:'form', expectation: 'apps/123/tables/456/form'},
            {name: 'test valid url - test 2', url: 'apps/123/tables/456/component', curRoute:'components', newRoute:'form', expectation: 'apps/123/tables/456/component'},
            {name: 'test valid url - test 3', url: 'apps/123/TABLES/456/component', curRoute:'component', newRoute:'', expectation: 'apps/123/TABLES/456/'},
            {name: 'test valid url - test 3', url: 'apps/123/TABLES/456/component', curRoute:'table', newRoute:'form/789', expectation: 'apps/123/form/789'}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.transformUrlRoute(testCase.url, testCase.curRoute, testCase.newRoute), testCase.expectation);
                done();
            });
        });
    });

    describe('validate getTablesRoute method', function() {
        var testCases = [
            {name: 'test empty url', url: '', tableId: '1', expectation: ''},
            {name: 'test null url', url: null, tableId: '1', expectation: null},
            {name: 'test invalid url', url: '/non/parsing/url', tableId: '1', expectation: '/non/parsing/url'},
            {name: 'test valid url with table id', url: '/apps/123', tableId: '1', expectation: '/apps/123/tables/1'},
            {name: 'test valid url with table id and no leading slash', url: 'apps/123', tableId: 1, expectation: 'apps/123/tables/1'},
            {name: 'test valid url without table id', url: '/apps/123', tableId: null, expectation: '/apps/123/tables'}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.getTablesRoute(testCase.url, testCase.tableId), testCase.expectation);
                done();
            });
        });
    });

});
