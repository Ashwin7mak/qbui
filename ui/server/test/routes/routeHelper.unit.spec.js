'use strict';

var routeHelper = require('../../src/routes/routeHelper');
var assert = require('assert');
var sinon = require('sinon');
var log = require('../../src/logger').getLogger();
var constants = require('../../../common/src/constants');

/**
 * Unit tests for User field formatting
 */
describe('Validate RouteHelper unit tests', function() {

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

    describe('validate getAppUsersRoute method', function() {
        var testCases = [
            {name: 'test empty url', url: '', expectation: ''},
            {name: 'test null url', url: null, expectation: null},
            {name: 'test invalid url', url: '/non/parsing/url', expectation: '/non/parsing/url'},
            {name: 'test invalid url - no app', url: '/apps/', expectation: '/apps/'},
            {name: 'test valid url', url: '/apps/123/users', expectation: '/apps/123/users'}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.getReportsCountRoute(testCase.url, testCase.id), testCase.expectation);
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

    describe('validate getRecordsCountRoute method', function() {
        var testCases = [
            {name: 'test empty url', url: '', expectation: ''},
            {name: 'test null url', url: null, expectation: null},
            {name: 'test invalid url', url: '/non/parsing/url', id: '1', expectation: '/non/parsing/url'},
            {name: 'test invalid url - no table id', url: '/apps/123/tables', id: '1', expectation: '/apps/123/tables'},
            {name: 'test invalid url - no table id2', url: '/apps/123/tables/', id: '1', expectation: '/apps/123/tables/'},
            {name: 'test valid url', url: '/apps/123/tables/456', id: null, expectation: '/apps/123/tables/456/records/countQuery'},
            {name: 'test valid url - id=1', url: '/apps/123/tables/456', id: '1', expectation: '/apps/123/tables/456/records/countQuery'},
            {name: 'test valid url - id=2', url: '/apps/123/tables/456/fields/789', id: '2', expectation: '/apps/123/tables/456/records/countQuery'}
        ];
        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.getRecordsCountRoute(testCase.url), testCase.expectation);
                done();
            });
        });
    });

    describe('validate getReportCountRoute method', function() {
        var testCases = [
            {name: 'test empty url', url: '', id: '', expectation: ''},
            {name: 'test null url', url: null, id: null, expectation: null},
            {name: 'test invalid url', url: '/non/parsing/url', id: null, expectation: '/non/parsing/url'},
            {name: 'test invalid url - no table', url: '/apps/123', id: null, expectation: '/apps/123'},
            {name: 'test invalid url - no table2', url: '/apps/123/', id: null, expectation: '/apps/123/'},
            {name: 'test invalid url - no report id', url: '/apps/123/tables/345/reports', id: null, expectation: '/apps/123/tables/345/reports'},
            {name: 'test valid url', url: '/apps/123/tables/456/reports/789', id: null, expectation: '/apps/123/tables/456/reports/789/count'},
            {name: 'test valid url 2', url: '/apps/123/tables/456/reports/789/results', expectation: '/apps/123/tables/456/reports/789/count'},
            {name: 'test valid url with id', url: '/apps/123/tables/234/reports/5', id: 5, expectation: '/apps/123/tables/234/reports/5/count'},
            {name: 'test valid default url', url: '/apps/123/tables/234/reports/' + constants.SYNTHETIC_TABLE_REPORT.ID, id: null, expectation: '/apps/123/tables/234/reports/default/count'},
            {name: 'test invalid default url with default id', url: '/apps/123', id: constants.SYNTHETIC_TABLE_REPORT.ID, expectation: '/apps/123'},
            {name: 'test valid default url with default id', url: '/apps/123/tables/234/reports/' + constants.SYNTHETIC_TABLE_REPORT.ID, id: constants.SYNTHETIC_TABLE_REPORT.ID, expectation: '/apps/123/tables/234/reports/default/count'},
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.getReportsCountRoute(testCase.url, testCase.id), testCase.expectation);
                done();
            });
        });
    });

    describe('validate getReportFacetRoute method', function() {
        var testCases = [
            {name: 'test empty url with no reportId', url: '', reportId: null, expectation: ''},
            {name: 'test null url with no reportId', url: null, reportId: null, expectation: null},
            {name: 'test invalid url with no reportId', url: '/non/parsing/url', reportId: null, expectation: '/non/parsing/url'},
            {name: 'test invalid url with no reportId - no table', url: '/apps/123', reportId: null, expectation: '/apps/123'},
            {name: 'test invalid url with no reportId - no table2', url: '/apps/123/', reportId: null, expectation: '/apps/123/'},
            {name: 'test invalid url with no reportId - no report id', url: '/apps/123/tables/345/reports', reportId: null, expectation: '/apps/123/tables/345/reports'},
            {name: 'test valid url with no reportId', url: '/apps/123/tables/456/reports/789', reportId: null, expectation: '/apps/123/tables/456/reports/789/facets/results'},
            {name: 'test empty url with reportId', url: '', reportId: '1', expectation: ''},
            {name: 'test null url with reportId', url: null, reportId: '1', expectation: null},
            {name: 'test invalid url with reportId', url: '/non/parsing/url', reportId: '1', expectation: '/non/parsing/url'},
            {name: 'test invalid url with reportId - no table', url: '/apps/123', reportId: '1', expectation: '/apps/123'},
            {name: 'test invalid url with reportId - no table2', url: '/apps/123/', reportId: '1', expectation: '/apps/123/'},
            {name: 'test invalid url with reportId', url: '/apps/123/tables/345/reports/789', reportId: '1', expectation: '/apps/123/tables/345/reports/1/facets/results'},
            {name: 'test valid url with reportId', url: '/apps/123/tables/456/homepage', reportId: '1', expectation: '/apps/123/tables/456/reports/1/facets/results'},
            {name: 'test valid default report url with reportId', url: '/apps/123/tables/456', reportId: constants.SYNTHETIC_TABLE_REPORT.ID, expectation: '/apps/123/tables/456/reports/default/facets/results'},
            {name: 'test valid default report url', url: '/apps/123/tables/456/reports/' + constants.SYNTHETIC_TABLE_REPORT.ID, expectation: '/apps/123/tables/456/reports/default/facets/results'}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.getReportsFacetRoute(testCase.url, testCase.reportId), testCase.expectation);
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
            {name: 'test valid url - id=2', url: '/apps/123/tables/456/fields/789', id: '2', expectation: '/apps/123/tables/456/reports/2'},
            {name: 'test valid default report url', url: '/apps/123/tables/456', id: constants.SYNTHETIC_TABLE_REPORT.ID, expectation: '/apps/123/tables/456/reports/default'}
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
            {name: 'test valid url - id=2', url: '/apps/123/tables/456/fields/789', id: '2', expectation: '/apps/123/tables/456/reports/2/results'},
            {name: 'test valid default report url', url: '/apps/123/tables/456/reports/' + constants.SYNTHETIC_TABLE_REPORT.ID, id: null, expectation: '/apps/123/tables/456/reports/default/results'},
            {name: 'test valid url', url: '/apps/123/tables/456/reports/' + constants.SYNTHETIC_TABLE_REPORT.ID, id: constants.SYNTHETIC_TABLE_REPORT.ID, expectation: '/apps/123/tables/456/reports/default/results'}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.getReportsResultsRoute(testCase.url, testCase.id), testCase.expectation);
                done();
            });
        });
    });

    describe('validate dynamic getReportsResultsRoute method', function() {
        var testCases = [
            {name: 'test empty url', url: '', expectation: ''},
            {name: 'test null url', url: null, expectation: null},
            {name: 'test invalid url', url: '/non/parsing/url', expectation: '/non/parsing/url'},
            {name: 'test invalid url - no table id', url: '/apps/123/tables', expectation: '/apps/123/tables'},
            {name: 'test valid url', url: '/apps/123/tables/456', expectation: '/apps/123/tables/456/reports/invoke'}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.getInvokeReportRoute(testCase.url, testCase.id), testCase.expectation);
                done();
            });
        });
    });

    describe('validate isReportResultsRoute method', function() {
        var testCases = [
            {name: 'test empty url', url: '', expectation: false},
            {name: 'test null url', url: null, expectation: false},
            {name: 'test invalid url', url: '/non/parsing/url', expectation: false},
            {name: 'test valid url - mixed case no leading slash', url: 'apps/123/tables/456/Reports/789/results', expectation: true},
            {name: 'test valid url - mixed case with domain', url: 'https://somedomain/apps/123/tables/456/Reports/789/results', expectation: true},
            {name: 'test valid url - mixed case', url: '/apps/123/tables/456/reports/789/results', expectation: true},
            {name: 'test valid url - lower case', url: '/apps/123/tables/456/reports/789/Results', expectation: true},
            {name: 'test valid url - upper case', url: '/apps/123/tables/456/reports/789/RESULTS', expectation: true}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.isReportResultsRoute(testCase.url), testCase.expectation);
                done();
            });
        });
    });

    describe('validate isFormComponentRoute method', function() {
        var testCases = [
            {name: 'test empty url', url: '', expectation: false},
            {name: 'test null url', url: null, expectation: false},
            {name: 'test invalid url', url: '/non/parsing/url', expectation: false},
            {name: 'test valid url - mixed case no leading slash', url: 'apps/123/tables/456/Records/789/FormComponents', expectation: true},
            {name: 'test valid url - mixed case with domain', url: 'https://somedomain/apps/123/tables/456/Records/789/FormComponents', expectation: true},
            {name: 'test valid url - mixed case', url: '/apps/123/tables/456/records/789/FormComponents', expectation: true},
            {name: 'test valid url - lower case', url: '/apps/123/tables/456/records/789/formcomponents', expectation: true},
            {name: 'test valid url - upper case', url: '/apps/123/tables/456/records/789/FORMCOMPONENTS', expectation: true}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.isFormsComponentRoute(testCase.url), testCase.expectation);
                done();
            });
        });
    });

    describe('validate isRecordsRoute method', function() {
        var testCases = [
            {name: 'test empty url', url: '', expectation: false},
            {name: 'test null url', url: null, expectation: false},
            {name: 'test invalid url', url: '/apps/123/tables/456/reports/2', expectation: false},
            {name: 'test valid url - mixed case no leading slash', url: 'apps/123/tables/456/Records', expectation: true},
            {name: 'test valid url - mixed case with domain', url: 'https://somedomain/apps/123/tables/456/Records', expectation: true},
            {name: 'test valid url - mixed case', url: '/apps/123/tables/456/Records', expectation: true},
            {name: 'test valid url - lower case', url: '/apps/123/tables/456/records/1', expectation: true},
            {name: 'test valid url - upper case', url: '/APPS/123/TABLES/456/RECORDS', expectation: true}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.isRecordsRoute(testCase.url), testCase.expectation);
                done();
            });
        });
    });

    describe('validate isFieldsRoute method', function() {
        var testCases = [
            {name: 'test empty url', url: '', expectation: false},
            {name: 'test null url', url: null, expectation: false},
            {name: 'test invalid url', url: '/apps/123/tables/456/reports/2', expectation: false},
            {name: 'test valid url - mixed case no leading slash', url: 'apps/123/tables/456/Fields', expectation: true},
            {name: 'test valid url - mixed case with domain', url: 'https://somedomain/apps/123/tables/456/Fields', expectation: true},
            {name: 'test valid url - lower case; no field id', url: '/apps/123/tables/456/fields', expectation: true},
            {name: 'test valid url - lower case', url: '/apps/123/tables/456/fields/1', expectation: true},
            {name: 'test valid url - upper case', url: '/APPS/123/TABLES/456/FIELDS', expectation: true}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.isFieldsRoute(testCase.url), testCase.expectation);
                done();
            });
        });
    });

    describe('validate isTableHomePageRoute method', function() {
        var testCases = [
            {name: 'test empty url', url: '', expectation: false},
            {name: 'test null url', url: null, expectation: false},
            {name: 'test invalid url', url: '/apps/123/tables/456/reports/2', expectation: false},
            {name: 'test valid url - mixed case no leading slash', url: 'apps/123/tables/456/homePage', expectation: true},
            {name: 'test valid url - mixed case with domain', url: 'https://somedomain/apps/123/tables/456/homepage', expectation: true},
            {name: 'test valid url - upper case', url: '/APPS/123/TABLES/456/HOMEPAGE', expectation: true}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.isTableHomePageRoute(testCase.url), testCase.expectation);
                done();
            });
        });
    });

    describe('validate getApplicationStackPreferenceRoute method', function() {
        var testCases = [
            {name: 'test no app id', appId: '', expectation: '/db'},
            {name: 'test undefined app id', expectation: '/db'},
            {name: 'test get app preference with undefined value', appId: '12345', isPost: false, expectation: '/db/12345?a=JBI_GetAdminRedirectToV3'},
            {name: 'test get app preference with value', appId: '12345', isPost: false, value: '1',  expectation: '/db/12345?a=JBI_GetAdminRedirectToV3'},
            {name: 'test get app preference with only appId', appId: '12345',  expectation: '/db/12345?a=JBI_GetAdminRedirectToV3'},
            {name: 'test set app preference with empty value', appId: '12345', isPost: true, value: '',  expectation: '/db/12345?a=JBI_SetAdminRedirectToV3&value='},
            {name: 'test set app preference with undefined value', appId: '12345', isPost: true, expectation: '/db/12345?a=JBI_SetAdminRedirectToV3&value=undefined'},
            {name: 'test set app preference', appId: '12345', isPost: true, value: '1', expectation: '/db/12345?a=JBI_SetAdminRedirectToV3&value=1'}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                assert.equal(routeHelper.getApplicationStackPreferenceRoute(testCase.appId, testCase.isPost, testCase.value), testCase.expectation);
                done();
            });
        });
    });

});
