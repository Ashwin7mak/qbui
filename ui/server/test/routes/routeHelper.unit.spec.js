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
            {name: 'test empty url', url: '', id: '1', expectation: ''},
            {name: 'test null url', url: null, id: '1', expectation: null},
            {name: 'test non string url', url: 45, id: '1', expectation: 45},
            {name: 'test invalid url', url: '/non/parsing/url', id: '1', expectation: '/non/parsing/url'},
            {name: 'test valid url with table id', url: '/apps/123', id: '1', expectation: '/apps/123/tables/1'},
            {name: 'test valid url with table id and no leading slash', url: 'apps/123', id: 1, expectation: 'apps/123/tables/1'},
            {name: 'test valid url with table id and no trailing slash', url: '/apps/123/', id: 1, expectation: '/apps/123/tables/1'},
            {name: 'test valid url without table id', url: '/apps/123', id: null, expectation: '/apps/123/tables'}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.getTablesRoute(testCase.url, testCase.id), testCase.expectation);
                done();
            });
        });
    });

    describe('validate getTablesDefaultReportHomepageRoute method', function() {
        var testCases = [
            {name: 'test empty url', url: '', expectation: ''},
            {name: 'test null url', url: null, expectation: null},
            {name: 'test invalid url', url: '/non/parsing/url', expectation: '/non/parsing/url'},
            {name: 'test invalid url - no table', url: '/apps/123', expectation: '/apps/123'},
            {name: 'test invalid url - no table2', url: '/apps/123/', expectation: '/apps/123/'},
            {name: 'test invalid url - no table id', url: '/apps/123/tables', expectation: '/apps/123/tables'},
            {name: 'test valid url', url: '/apps/123/tables/456', expectation: '/apps/123/tables/456/defaulthomepage'}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.getTablesDefaultReportHomepageRoute(testCase.url), testCase.expectation);
                done();
            });
        });
    });

    describe('validate getFieldsRoute method', function() {
        var testCases = [
            {name: 'test empty url', url: '', expectation: ''},
            {name: 'test null url', url: null, id:null, expectation: null},
            {name: 'test invalid url', url: '/non/parsing/url', id: '1', expectation: '/non/parsing/url'},
            {name: 'test invalid url - no table id', url: '/apps/123/tables', id: '1', expectation: '/apps/123/tables'},
            {name: 'test invalid url - no table id2', url: '/apps/123/tables/', id: '1', expectation: '/apps/123/tables/'},
            {name: 'test valid url', url: '/apps/123/tables/456', id: null, expectation: '/apps/123/tables/456/fields'},
            {name: 'test valid url - id=1', url: '/apps/123/tables/456', id: '1', expectation: '/apps/123/tables/456/fields/1'}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.getFieldsRoute(testCase.url, testCase.id), testCase.expectation);
                done();
            });
        });
    });

    describe('validate getFormsRoute method', function() {
        var testCases = [
            {name: 'test empty url', url: '', expectation: ''},
            {name: 'test null url', url: null, id:null, expectation: null},
            {name: 'test invalid url', url: '/non/parsing/url', id: '1', expectation: '/non/parsing/url'},
            {name: 'test invalid url - no table id', url: '/apps/123/tables', id: '1', expectation: '/apps/123/tables'},
            {name: 'test invalid url - no table id2', url: '/apps/123/tables/', id: '1', expectation: '/apps/123/tables/'},
            {name: 'test valid url', url: '/apps/123/tables/456', id: null, expectation: '/apps/123/tables/456/forms'},
            {name: 'test valid url - id=1', url: '/apps/123/tables/456', id: '1', expectation: '/apps/123/tables/456/forms/1'},
            {name: 'test valid url - id=2', url: '/apps/123/tables/456/records/789', id: '2', expectation: '/apps/123/tables/456/forms/2'}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.getFormsRoute(testCase.url, testCase.id), testCase.expectation);
                done();
            });
        });
    });

    describe('validate getRecordsRoute method', function() {
        var testCases = [
            {name: 'test empty url', url: '', expectation: ''},
            {name: 'test null url', url: null, id:null, expectation: null},
            {name: 'test invalid url', url: '/non/parsing/url', id: '1', expectation: '/non/parsing/url'},
            {name: 'test invalid url - no table id', url: '/apps/123/tables', id: '1', expectation: '/apps/123/tables'},
            {name: 'test invalid url - no table id2', url: '/apps/123/tables/', id: '1', expectation: '/apps/123/tables/'},
            {name: 'test valid url', url: '/apps/123/tables/456', id: null, expectation: '/apps/123/tables/456/records'},
            {name: 'test valid url - id=1', url: '/apps/123/tables/456', id: '1', expectation: '/apps/123/tables/456/records/1'},
            {name: 'test valid url - id=2', url: '/apps/123/tables/456/fields/789', id: '2', expectation: '/apps/123/tables/456/records/2'}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.getRecordsRoute(testCase.url, testCase.id), testCase.expectation);
                done();
            });
        });
    });

    describe('validate getReportFacetRoute method', function() {
        var testCases = [
            {name: 'test empty url', url: '', expectation: ''},
            {name: 'test null url', url: null, expectation: null},
            {name: 'test invalid url', url: '/non/parsing/url', expectation: '/non/parsing/url'},
            {name: 'test invalid url - no table', url: '/apps/123', expectation: '/apps/123'},
            {name: 'test invalid url - no table2', url: '/apps/123/', expectation: '/apps/123/'},
            {name: 'test invalid url - no report id', url: '/apps/123/tables/345/reports', expectation: '/apps/123/tables/345/reports'},
            {name: 'test valid url', url: '/apps/123/tables/456/reports/789', expectation: '/apps/123/tables/456/reports/789/facets/results'}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.getReportsFacetRoute(testCase.url), testCase.expectation);
                done();
            });
        });
    });

    describe('validate getReportsRoute method', function() {
        var testCases = [
            {name: 'test empty url', url: '', expectation: ''},
            {name: 'test null url', url: null, id:null, expectation: null},
            {name: 'test invalid url', url: '/non/parsing/url', id: '1', expectation: '/non/parsing/url'},
            {name: 'test invalid url - no table id', url: '/apps/123/tables', id: '1', expectation: '/apps/123/tables'},
            {name: 'test invalid url - no table id2', url: '/apps/123/tables/', id: '1', expectation: '/apps/123/tables/'},
            {name: 'test valid url', url: '/apps/123/tables/456', id: null, expectation: '/apps/123/tables/456/reports'},
            {name: 'test valid url - id=1', url: '/apps/123/tables/456', id: '1', expectation: '/apps/123/tables/456/reports/1'},
            {name: 'test valid url - id=2', url: '/apps/123/tables/456/fields/789', id: '2', expectation: '/apps/123/tables/456/reports/2'}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.getReportsRoute(testCase.url, testCase.id), testCase.expectation);
                done();
            });
        });
    });

    describe('validate getReportsResultsRoute method', function() {
        var testCases = [
            {name: 'test empty url', url: '', expectation: ''},
            {name: 'test null url', url: null, id:'1', expectation: null},
            {name: 'test invalid url', url: '/non/parsing/url', id: '1', expectation: '/non/parsing/url'},
            {name: 'test invalid url - no id', url: '/non/parsing/url', expectation: '/non/parsing/url'},
            {name: 'test invalid url - no table id', url: '/apps/123/tables', id: '1', expectation: '/apps/123/tables'},
            {name: 'test invalid url - no table id2', url: '/apps/123/tables/', id: '1', expectation: '/apps/123/tables/'},
            {name: 'test valid url', url: '/apps/123/tables/456/reports/789', id: null, expectation: '/apps/123/tables/456/reports/789/results'},
            {name: 'test valid url - id=1', url: '/apps/123/tables/456', id: '1', expectation: '/apps/123/tables/456/reports/1/results'},
            {name: 'test valid url - id=2', url: '/apps/123/tables/456/fields/789', id: '2', expectation: '/apps/123/tables/456/reports/2/results'}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.getReportsResultsRoute(testCase.url, testCase.id), testCase.expectation);
                done();
            });
        });
    });

    describe('validate isReportComponentRoute method', function() {
        var testCases = [
            {name: 'test empty url', url: '', expectation: false},
            {name: 'test null url', url: null, expectation: false},
            {name: 'test invalid url', url: '/non/parsing/url', expectation: false},
            {name: 'test valid url - mixed case', url: '/apps/123/tables/456/reports/789/ReportComponents', expectation: true},
            {name: 'test valid url - lower case', url: '/apps/123/tables/456/reports/789/reportcomponents', expectation: true},
            {name: 'test valid url - upper case', url: '/apps/123/tables/456/reports/789/REPORTCOMPONENTS', expectation: true}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.isReportComponentRoute(testCase.url), testCase.expectation);
                done();
            });
        });
    });

});
