/**
 * A test to test the qbRouteMapper is properly modifying the url to route to a given tomcat api
 * Created by cschneider1 on 7/16/15.
 */
'use strict';

var config = require('../../src/config/environment');
var routeMapper = require('../../src/routes/qbRouteMapper')(config);
var routes = require('../../src/routes/routeConstants').routes;
var assert = require('assert');
var sinon = require('sinon');
var recordsApi = require('../../src/api/quickbase/recordsApi')(config);
var constants = require('../../../common/src/constants');
var requestStub;

/**
 * Unit tests for app generator
 */
describe('Qb Route Mapper Unit Test', function() {

    before(function() {
        requestStub = sinon.stub();
        recordsApi.setRequestObject(requestStub);
        routeMapper.setRecordsApi(recordsApi);
        routeMapper.setRequest(requestStub);
    });

    function corePathModificationProvider() {
        var defaultPagingQueryParams = '?' + constants.REQUEST_PARAMETER.OFFSET + '=' + constants.PAGE.DEFAULT_OFFSET;
        var testPagingQueryParams = '?' + constants.REQUEST_PARAMETER.OFFSET + '=20';
        testPagingQueryParams += '&' + constants.REQUEST_PARAMETER.NUM_ROWS + '=40';
        return [
            {message: 'GET request to record endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/records/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1', route: routes.RECORD, method: routeMapper.fetchGetFunctionForRoute(routes.RECORD), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to records endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routes.RECORDS, method: routeMapper.fetchGetFunctionForRoute(routes.RECORDS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to records bulk endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/records/bulk', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/bulk', route: routes.RECORDS_BULK, method: routeMapper.fetchGetFunctionForRoute(routes.RECORDS_BULK), expectedDefined: false, httpVerb: 'GET'},

            {message: 'GET request to paged report record endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/records/1' + testPagingQueryParams, expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1' + testPagingQueryParams, route: routes.RECORD, method: routeMapper.fetchGetFunctionForRoute(routes.RECORD), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to table homepage id endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/homepage', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/homepage', route: routes.TABLE_HOMEPAGE_REPORT, method: routeMapper.fetchGetFunctionForRoute(routes.TABLE_HOMEPAGE_REPORT), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to form components endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/records/fakeRecord', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord', route: routes.FORM_COMPONENTS, method: routeMapper.fetchGetFunctionForRoute(routes.FORM_COMPONENTS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to form and record components endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', route: routes.FORM_AND_RECORD_COMPONENTS, method: routeMapper.fetchGetFunctionForRoute(routes.FORM_AND_RECORD_COMPONENTS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to report metadata endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/reports/2', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2', route: routes.REPORT_META, method: routeMapper.fetchGetFunctionForRoute(routes.REPORT_META), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to report results endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/reports/2/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/results', route: routes.REPORT_RESULTS, method: routeMapper.fetchGetFunctionForRoute(routes.REPORT_RESULTS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to report default results endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/reports/default/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/default/results', route: routes.REPORT_RESULTS, method: routeMapper.fetchGetFunctionForRoute(routes.REPORT_RESULTS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to paged report results endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/reports/2' + testPagingQueryParams, expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2' + testPagingQueryParams, route: routes.REPORT_RESULTS, method: routeMapper.fetchGetFunctionForRoute(routes.REPORT_RESULTS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to report invoke endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/reports/2/invoke', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/invoke', route: routes.REPORT_INVOKE_RESULTS, method: routeMapper.fetchGetFunctionForRoute(routes.REPORT_INVOKE_RESULTS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to report record count endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', route: routes.REPORT_RECORDS_COUNT, method: routeMapper.fetchGetFunctionForRoute(routes.REPORT_RECORDS_COUNT), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to table components endpoint', request: '/qb/apps/fakeApp/tables/tableComponents', expectedPath: '/api/api/v1/apps/fakeApp/tables/tableComponents', route: routes.TABLE_COMPONENTS, method: routeMapper.fetchGetFunctionForRoute(routes.TABLE_COMPONENTS), expectedDefined: false, httpVerb: 'GET'},
            {message: 'GET request to resolve facets', request: '/n/v1/facets/parse', expectedPath: '/n/v1/facets/parse', route: routes.FACET_EXPRESSION_PARSE, method: routeMapper.fetchGetFunctionForRoute(routes.FACET_EXPRESSION_PARSE), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to apps endpoint', request: '/qb/apps/fakeApp', expectedPath: '/api/api/v1/apps/fakeApp', route: routes.APPS, method: routeMapper.fetchGetFunctionForRoute(routes.APPS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to app roles endpoint', request: '/qb/apps/fakeApp/roles', expectedPath: '/api/api/v1/apps/fakeApp/roles', route: routes.APP_ROLES, method: routeMapper.fetchGetFunctionForRoute(routes.APP_ROLES), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to getReqUser endpoint', request: '/qb/users/reqUser', expectedPath: '/api/api/v1/users/reqUser', route: routes.REQ_USER, method: routeMapper.fetchGetFunctionForRoute(routes.REQ_USER), expectedDefined: true, httpVerb: 'GET'},

            {message: 'POST request to form components endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/records/fakeRecord', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord', route: routes.FORM_COMPONENTS, method: routeMapper.fetchPostFunctionForRoute(routes.FORM_COMPONENTS), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to form and record components endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', route: routes.FORM_AND_RECORD_COMPONENTS, method: routeMapper.fetchPostFunctionForRoute(routes.FORM_AND_RECORD_COMPONENTS), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to record endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routes.RECORD, method: routeMapper.fetchPostFunctionForRoute(routes.RECORD), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to records bulk endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/records/bulk', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/bulk', route: routes.RECORDS_BULK, method: routeMapper.fetchPostFunctionForRoute(routes.RECORDS_BULK), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to report metadata endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/reports/2', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2', route: routes.REPORT_META, method: routeMapper.fetchPostFunctionForRoute(routes.REPORT_META), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to report results endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/reports/1/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/1/results', route: routes.REPORT_RESULTS, method: routeMapper.fetchPostFunctionForRoute(routes.REPORT_RESULTS), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to report invoke endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/reports/1/invoke', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/1/invoke', route: routes.REPORT_INVOKE_RESULTS, method: routeMapper.fetchPostFunctionForRoute(routes.REPORT_INVOKE_RESULTS), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to report record count endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', route: routes.REPORT_RECORDS_COUNT, method: routeMapper.fetchPostFunctionForRoute(routes.REPORT_RECORDS_COUNT), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to table homepage id endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/homepage', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/homepage', route: routes.TABLE_HOMEPAGE_REPORT, method: routeMapper.fetchPostFunctionForRoute(routes.TABLE_HOMEPAGE_REPORT), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to apps endpoint', request: '/qb/apps/fakeApp', expectedPath: '/api/api/v1/apps/fakeApp', route: routes.APPS, method: routeMapper.fetchPostFunctionForRoute(routes.APPS), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to app roles endpoint', request: '/qb/apps/fakeApp/roles', expectedPath: '/api/api/v1/apps/fakeApp/roles', route: routes.APP_ROLES, method: routeMapper.fetchPostFunctionForRoute(routes.APP_ROLES), expectedDefined: false, httpVerb: 'POST'},

            {message: 'DELETE request to form components endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/records/fakeRecord', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord', route: routes.FORM_COMPONENTS, method: routeMapper.fetchGetFunctionForRoute(routes.FORM_COMPONENTS), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to form and record components endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', route: routes.FORM_AND_RECORD_COMPONENTS, method: routeMapper.fetchDeleteFunctionForRoute(routes.FORM_AND_RECORD_COMPONENTS), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to record endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/records/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1', route: routes.RECORD, method: routeMapper.fetchDeleteFunctionForRoute(routes.RECORD), expectedDefined: true, httpVerb: 'DELETE'},
            {message: 'DELETE request to records endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routes.RECORDS, method: routeMapper.fetchDeleteFunctionForRoute(routes.RECORDS), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to records bulk endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/records/bulk', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/bulk', route: routes.RECORDS_BULK, method: routeMapper.fetchDeleteFunctionForRoute(routes.RECORDS_BULK), expectedDefined: true, httpVerb: 'DELETE'},
            {message: 'DELETE request to report metadata endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/reports/2', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2', route: routes.REPORT_META, method: routeMapper.fetchDeleteFunctionForRoute(routes.REPORT_META), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to report results endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/reports/1/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/results', route: routes.REPORT_RESULTS, method: routeMapper.fetchDeleteFunctionForRoute(routes.REPORT_RESULTS), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to report results endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/reports/1/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/invoke', route: routes.REPORT_INVOKE_RESULTS, method: routeMapper.fetchDeleteFunctionForRoute(routes.REPORT_INVOKE_RESULTS), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to report record count endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', route: routes.REPORT_RECORDS_COUNT, method: routeMapper.fetchDeleteFunctionForRoute(routes.REPORT_RECORDS_COUNT), expectedDefined: false, httpVerb: 'POST'},
            {message: 'DELETE request to table homepage id endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/homepage', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/homepage', route: routes.TABLE_HOMEPAGE_REPORT, method: routeMapper.fetchDeleteFunctionForRoute(routes.TABLE_HOMEPAGE_REPORT), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to apps endpoint', request: '/qb/apps/fakeApp', expectedPath: '/api/api/v1/apps/fakeApp', route: routes.APPS, method: routeMapper.fetchDeleteFunctionForRoute(routes.APPS), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to app roles endpoint', request: '/qb/apps/fakeApp/roles', expectedPath: '/api/api/v1/apps/fakeApp/roles', route: routes.APP_ROLES, method: routeMapper.fetchDeleteFunctionForRoute(routes.APP_ROLES), expectedDefined: false, httpVerb: 'DELETE'},

            {message: 'PATCH request to form components endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/records/fakeRecord', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord', route: routes.FORM_COMPONENTS, method: routeMapper.fetchGetFunctionForRoute(routes.FORM_COMPONENTS), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to form and record components endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', route: routes.FORM_AND_RECORD_COMPONENTS, method: routeMapper.fetchPatchFunctionForRoute(routes.FORM_AND_RECORD_COMPONENTS), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to record endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/records/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1', route: routes.RECORD, method: routeMapper.fetchPatchFunctionForRoute(routes.RECORD), expectedDefined: true, httpVerb: 'PATCH'},
            {message: 'PATCH request to records endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routes.RECORDS, method: routeMapper.fetchPatchFunctionForRoute(routes.RECORDS), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to records bulk endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/records/bulk', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/bulk', route: routes.RECORDS_BULK, method: routeMapper.fetchPatchFunctionForRoute(routes.RECORDS_BULK), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to report metadata endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/reports/2', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2', route: routes.REPORT_META, method: routeMapper.fetchPatchFunctionForRoute(routes.REPORT_META), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to report results endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/reports/1/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/results', route: routes.REPORT_RESULTS, method: routeMapper.fetchPatchFunctionForRoute(routes.REPORT_RESULTS), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to report results endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/reports/1/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/invoke', route: routes.REPORT_INVOKE_RESULTS, method: routeMapper.fetchPatchFunctionForRoute(routes.REPORT_INVOKE_RESULTS), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to report record count endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', route: routes.REPORT_RECORDS_COUNT, method: routeMapper.fetchPatchFunctionForRoute(routes.REPORT_RECORDS_COUNT), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to table homepage id endpoint', request: '/qb/apps/fakeApp/tables/fakeTable/homepage', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/homepage', route: routes.TABLE_HOMEPAGE_REPORT, method: routeMapper.fetchPatchFunctionForRoute(routes.TABLE_HOMEPAGE_REPORT), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to apps endpoint', request: '/qb/apps/fakeApp', expectedPath: '/api/api/v1/apps/fakeApp', route: routes.APPS, method: routeMapper.fetchPatchFunctionForRoute(routes.APPS), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to app roles endpoint', request: '/qb/apps/fakeApp/roles', expectedPath: '/api/api/v1/apps/fakeApp/roles', route: routes.APP_ROLES, method: routeMapper.fetchPatchFunctionForRoute(routes.APP_ROLES), expectedDefined: false, httpVerb: 'PATCH'},
            //
            {message: 'GET request to app users endpoint', request: '/qb/apps/fakeApp/users', expectedPath: '/api/api/v1/apps/fakeApp/users', route: routes.APP_USERS, method: routeMapper.fetchGetFunctionForRoute(routes.APP_USERS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'POST request to app users endpoint', request: '/qb/apps/fakeApp/users', expectedPath: '/api/api/v1/apps/fakeApp/users', route: routes.APP_USERS, method: routeMapper.fetchPostFunctionForRoute(routes.APP_USERS), expectedDefined: false, httpVerb: 'POST'},
            {message: 'PUT request to app users endpoint', request: '/qb/apps/fakeApp/users', expectedPath: '/api/api/v1/apps/fakeApp/users', route: routes.APP_USERS, method: routeMapper.fetchPutFunctionForRoute(routes.APP_USERS), expectedDefined: false, httpVerb: 'PUT'},
            {message: 'PATCH request to app users endpoint', request: '/qb/apps/fakeApp/users', expectedPath: '/api/api/v1/apps/fakeApp/users', route: routes.APP_USERS, method: routeMapper.fetchPatchFunctionForRoute(routes.APP_USERS), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'DELETE request to app users endpoint', request: '/qb/apps/fakeApp/users', expectedPath: '/api/api/v1/apps/fakeApp/users', route: routes.APP_USERS, method: routeMapper.fetchDeleteFunctionForRoute(routes.APP_USERS), expectedDefined: false, httpVerb: 'DELETE'},
            //
            {message: 'POST request to table components endpoint', request: '/qb/apps/1/tables/tableComponents', expectedPath: '/api/api/v1/apps/1/tables/tableComponents', route: routes.TABLE_COMPONENTS, method: routeMapper.fetchPostFunctionForRoute(routes.TABLE_COMPONENTS), expectedDefined: true, httpVerb: 'POST'},
            {message: 'PATCH request to tables endpoint', request: '/qb/apps/1/tables/2', expectedPath: '/api/api/v1/apps/1/tables/2', route: routes.TABLE, method: routeMapper.fetchPatchFunctionForRoute(routes.TABLE), expectedDefined: true, httpVerb: 'PATCH'},
            {message: 'GET request to Node/Express health check endpoint', request: '/api/v1/qbuiHealth', expectedPath: '/api/v1/qbuiHealth', route: routes.QBUI_HEALTH_CHECK, method: routeMapper.fetchGetFunctionForRoute(routes.QBUI_HEALTH_CHECK), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to the health check endpoint', request: '/qb/health', expectedPath: '/api/api/v1/health', route: routes.HEALTH_CHECK, method: routeMapper.fetchGetFunctionForRoute(routes.HEALTH_CHECK), expectedDefined: true, httpVerb: 'GET'}
        ];
    }

    function eePathModificationProvider() {
        return [
            {message: 'GET request to EE health via Experience Engine all', request: '/ee/v1/health', expectedPath: '/ee/v1/health', route: routes.EXPERIENCE_ENGINE, method: routeMapper.fetchAllFunctionForRoute(routes.EXPERIENCE_ENGINE), expectedDefined: true, httpVerb: 'GET'},
            {message: 'POST request to EE api via Experience Engine all', request: '/ee/v1/someUrl', expectedPath: '/ee/v1/someUrl', route: routes.EXPERIENCE_ENGINE, method: routeMapper.fetchAllFunctionForRoute(routes.EXPERIENCE_ENGINE), expectedDefined: true, httpVerb: 'POST'},
            {message: 'PATCH request to EE api via Experience Engine all', request: '/ee/v1/someUrl', expectedPath: '/ee/v1/someUrl', route: routes.EXPERIENCE_ENGINE, method: routeMapper.fetchAllFunctionForRoute(routes.EXPERIENCE_ENGINE), expectedDefined: true, httpVerb: 'PATCH'},
            {message: 'PUT request to EE api via Experience Engine all', request: '/ee/v1/someUrl', expectedPath: '/ee/v1/someUrl', route: routes.EXPERIENCE_ENGINE, method: routeMapper.fetchAllFunctionForRoute(routes.EXPERIENCE_ENGINE), expectedDefined: true, httpVerb: 'PUT'},
            {message: 'DELETE request to EE api via Experience Engine all', request: '/ee/v1/someUrl', expectedPath: '/ee/v1/someUrl', route: routes.EXPERIENCE_ENGINE, method: routeMapper.fetchAllFunctionForRoute(routes.EXPERIENCE_ENGINE), expectedDefined: true, httpVerb: 'DELETE'}
        ];
    }

    function automationModificationProvider()  {
        return [
            {message: 'GET request to automation engine health check', request: '/we/api/api/v1/health', expectedPath: '/we/api/api/v1/health', route: routes.AUTOMATION_ENGINE, method: routeMapper.fetchAllFunctionForRoute(routes.AUTOMATION_ENGINE), expectedDefined: true, httpVerb: 'GET'}
        ];
    }

    function publicEndpointsProvider()  {
        return [
            {message: 'GET request to public fields', request: '/apps/fakeApp/tables/fakeTable/fields', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/fields', route: routes.PUBLIC_FIELDS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_FIELDS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public fields with id', request: '/apps/fakeApp/tables/fakeTable/fields/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/fields/1', route: routes.PUBLIC_FIELDS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_FIELDS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public forms', request: '/apps/fakeApp/tables/fakeTable/forms', expectedPath: '/ee/v1/apps/fakeApp/tables/fakeTable/forms', route: routes.PUBLIC_FORMS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_FORMS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public forms with id', request: '/apps/fakeApp/tables/fakeTable/forms/1', expectedPath: '/ee/v1/apps/fakeApp/tables/fakeTable/forms/1', route: routes.PUBLIC_FORMS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_FORMS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public records', request: '/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routes.PUBLIC_RECORDS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_RECORDS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public records with id', request: '/apps/fakeApp/tables/fakeTable/records/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1', route: routes.PUBLIC_RECORDS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_RECORDS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public reports', request: '/apps/fakeApp/tables/fakeTable/reports', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports', route: routes.PUBLIC_REPORTS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_REPORTS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public table properties', request: '/apps/fakeApp/tables/fakeTable/tableproperties', expectedPath: '/ee/v1/apps/fakeApp/tables/fakeTable/tableproperties', route: routes.PUBLIC_TABLE_PROPERTIES, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_TABLE_PROPERTIES), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public table properties homepageId', request: '/apps/fakeApp/tables/fakeTable/tableproperties/1', expectedPath: '/ee/v1/apps/fakeApp/tables/fakeTable/tableproperties/1', route: routes.PUBLIC_TABLE_PROPERTIES, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_TABLE_PROPERTIES), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public tables', request: '/apps/fakeApp/tables', expectedPath: '/api/api/v1/apps/fakeApp/tables', route: routes.PUBLIC_TABLES, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_TABLES), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public tables with id', request: '/apps/fakeApp/tables/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/1', route: routes.PUBLIC_TABLES, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_TABLES), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public relationships', request: '/apps/fakeApp/relationships', expectedPath: '/api/api/v1/apps/fakeApp/relationships', route: routes.PUBLIC_RELATIONSHIPS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_RELATIONSHIPS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public roles', request: '/apps/fakeApp/roles', expectedPath: '/api/api/v1/apps/fakeApp/roles', route: routes.PUBLIC_ROLES, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_ROLES), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public user roles', request: '/apps/fakeApp/roles/fakeRole/users', expectedPath: '/api/api/v1/apps/fakeApp/roles/fakeRole/users', route: routes.PUBLIC_ROLES, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_ROLES), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public apps', request: '/apps', expectedPath: '/api/api/v1/apps', route: routes.PUBLIC_APPS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_APPS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public apps with id', request: '/apps/1', expectedPath: '/api/api/v1/apps/1', route: routes.PUBLIC_APPS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_APPS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public health', request: '/health', expectedPath: '/api/api/v1/health', route: routes.PUBLIC_HEALTH, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_HEALTH), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public operations', request: '/operations', expectedPath: '/api/api/v1/operations', route: routes.PUBLIC_OPERATIONS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_OPERATIONS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public realms', request: '/realms', expectedPath: '/api/api/v1/realms', route: routes.PUBLIC_REALMS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_REALMS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public realms with id', request: '/realms/1', expectedPath: '/api/api/v1/realms/1', route: routes.PUBLIC_REALMS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_REALMS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public ticket', request: '/ticket', expectedPath: '/api/api/v1/ticket', route: routes.PUBLIC_TICKET, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_TICKET), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public users', request: '/users', expectedPath: '/api/api/v1/users', route: routes.PUBLIC_USERS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_USERS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public users with id', request: '/users/1', expectedPath: '/api/api/v1/users/1', route: routes.PUBLIC_USERS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_USERS), expectedDefined: true, httpVerb: 'GET'},

            {message: 'GET request to public workflow manager', request: '/apps/fakeApp/workflow/flows', expectedPath: '/we/api/v1/apps/fakeApp/workflow/flows', route: routes.PUBLIC_WORKFLOW_FLOW_MGR, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_WORKFLOW_FLOW_MGR), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public workflow automation', request: '/workflow/apps/fakeApp', expectedPath: '/workflow/apps/fakeApp', route: routes.PUBLIC_WORKFLOW_AUTOMATION, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_WORKFLOW_AUTOMATION), expectedDefined: true, httpVerb: 'GET'}
        ];
    }

    function featureSwitchesPathModificationProvider() {
        return [
            {message: 'GET request to the feature states endpoint', request: '/qb/featureStates', expectedPath: '/api/api/v1/featureStates', route: routes.FEATURE_STATES, method: routeMapper.fetchGetFunctionForRoute(routes.FEATURE_STATES), expectedDefined: true, httpVerb: 'GET'},

            {message: 'GET request to the feature switches endpoint', request: '/qb/admin/featureSwitches', expectedPath: '/api/api/v1/admin/featureSwitches', route: routes.FEATURE_SWITCHES, method: routeMapper.fetchGetFunctionForRoute(routes.FEATURE_SWITCHES), expectedDefined: true, httpVerb: 'GET'},
            {message: 'POST request to feature switches endpoint', request: '/qb/admin/featureSwitches', expectedPath: '/api/api/v1/admin/featureSwitches', route: routes.FEATURE_SWITCHES, method: routeMapper.fetchPostFunctionForRoute(routes.FEATURE_SWITCHES), expectedDefined: true, httpVerb: 'POST'},
            {message: 'PUT request to feature switches endpoint', request: '/qb/admin/featureSwitches/1', expectedPath: '/api/api/v1/admin/featureSwitches/1', route: routes.FEATURE_SWITCH, method: routeMapper.fetchPutFunctionForRoute(routes.FEATURE_SWITCH), expectedDefined: true, httpVerb: 'PUT'},
            {message: 'POST request to feature switches bulk endpoint', request: '/qb/admin/featureSwitches/bulk', expectedPath: '/api/api/v1/admin/featureSwitches/bulk', route: routes.FEATURE_SWITCHES_BULK, method: routeMapper.fetchPostFunctionForRoute(routes.FEATURE_SWITCHES_BULK), expectedDefined: true, httpVerb: 'POST'},

            {message: 'POST request to feature overrides endpoint', request: '/qb/admin/featureSwitches/1/overrides', expectedPath: '/api/api/v1/admin/featureSwitches/1/overrides', route: routes.FEATURE_OVERRIDES, method: routeMapper.fetchPostFunctionForRoute(routes.FEATURE_OVERRIDES), expectedDefined: true, httpVerb: 'POST'},
            {message: 'PUT request to feature overrides endpoint', request: '/qb/admin/featureSwitches/1/overrides/1', expectedPath: '/api/api/v1/admin/featureSwitches/1/overrides/1', route: routes.FEATURE_OVERRIDE, method: routeMapper.fetchPutFunctionForRoute(routes.FEATURE_OVERRIDE), expectedDefined: true, httpVerb: 'PUT'},
            {message: 'POST request to feature overrides bulk endpoint', request: '/qb/admin/featureSwitches/1/overrides/bulk', expectedPath: '/api/api/v1/admin/featureSwitches/1/overrides/bulk', route: routes.FEATURE_OVERRIDES_BULK, method: routeMapper.fetchPostFunctionForRoute(routes.FEATURE_OVERRIDES_BULK), expectedDefined: true, httpVerb: 'POST'}
        ];
    }

    function governanceModificationProvider() {
        return [
            {message: 'GET request to governance users endpoint', request: '/api/governance/v1/12345/users', expectedPath: '/api/governance/v1/12345/users', route: routes.GOVERNANCE_ACCOUNT_USERS, method: routeMapper.fetchGetFunctionForRoute(routes.GOVERNANCE_ACCOUNT_USERS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to governance context endpoint', request: '/api/governance/v1/context', expectedPath: '/api/governance/v1/context', route: routes.GOVERNANCE_CONTEXT, method: routeMapper.fetchGetFunctionForRoute(routes.GOVERNANCE_CONTEXT), expectedDefined: true, httpVerb: 'GET'}
        ];
    }

    /**
     * Unit test that validates generating an app with a specified number of tables
     */
    describe('test modify path for request', function() {
        corePathModificationProvider().forEach(function(entry) {
            runTestCase(entry);
        });
        eePathModificationProvider().forEach(function(entry) {
            runTestCase(entry);
        });
        automationModificationProvider().forEach(function(entry) {
            runTestCase(entry);
        });
        featureSwitchesPathModificationProvider().forEach(function(entry) {
            runTestCase(entry);
        });
        governanceModificationProvider().forEach(function(entry) {
            runTestCase(entry);
        });
        publicEndpointsProvider().forEach(function(entry) {
            runTestCase(entry);
        });
    });

    function runTestCase(entry) {
        it('Test case: ' + entry.message, function(done) {
            var expectedPath = entry.expectedPath;

            //mock out the request and response objects with some utility methods they need in this flow
            var originalReq = {
                params: {
                    reportId: entry.request && entry.request.indexOf('default/results') !== -1 ? 'default' : '1'
                }
            };

            originalReq.method = originalReq.url = entry.request;
            originalReq.route = {path: entry.route};
            originalReq.headers = {};

            var res = {
                send: function() {
                    return '';
                },
                status: function() {
                    return {
                        send: function() {}
                    };
                }
            };

            var method = entry.method;
            var expectedDefined = entry.expectedDefined;

            requestStub.yields(null, {statusCode: 200}, {login: 'cleo'});

            if (expectedDefined) {
                if (method === undefined) {
                    assert.fail();
                } else {
                    try {
                        method(originalReq, res);
                    } catch (error) {
                        //ignore errors, we shouldn't have fully formed objects
                    }
                    //verify that we have properly mutated the request string
                    assert.equal(originalReq.url, expectedPath, entry.message);
                }
            }
            done();
        });
    }
});
