/**
 * A test to test the qbRouteMapper is properly modifying the url to route to a given tomcat api
 * Created by cschneider1 on 7/16/15.
 */
'use strict';

var config = require('../../src/config/environment');
var routeMapper = require('../../src/routes/qbRouteMapper')(config);
var routeConsts = require('../../src/routes/routeConstants');
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
            {message: 'GET request to record endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1', route: routeConsts.RECORD, method: routeMapper.fetchGetFunctionForRoute(routeConsts.RECORD), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to records endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routeConsts.RECORDS, method: routeMapper.fetchGetFunctionForRoute(routeConsts.RECORDS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to records bulk endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/bulk', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/bulk', route: routeConsts.RECORDS_BULK, method: routeMapper.fetchGetFunctionForRoute(routeConsts.RECORDS_BULK), expectedDefined: false, httpVerb: 'GET'},
            {message: 'GET request to paged report record endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/1' + testPagingQueryParams, expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1' + testPagingQueryParams, route: routeConsts.RECORD, method: routeMapper.fetchGetFunctionForRoute(routeConsts.RECORD), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to table homepage id endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/homepage', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/homepage', route: routeConsts.TABLE_HOMEPAGE_REPORT, method: routeMapper.fetchGetFunctionForRoute(routeConsts.TABLE_HOMEPAGE_REPORT), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to form components endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord', route: routeConsts.FORM_COMPONENTS, method: routeMapper.fetchGetFunctionForRoute(routeConsts.FORM_COMPONENTS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to form and record components endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', route: routeConsts.FORM_AND_RECORD_COMPONENTS, method: routeMapper.fetchGetFunctionForRoute(routeConsts.FORM_AND_RECORD_COMPONENTS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to report metadata endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/2', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2', route: routeConsts.REPORT_META, method: routeMapper.fetchGetFunctionForRoute(routeConsts.REPORT_META), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to report results endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/2/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/results', route: routeConsts.REPORT_RESULTS, method: routeMapper.fetchGetFunctionForRoute(routeConsts.REPORT_RESULTS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to report default results endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/default/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/default/results', route: routeConsts.REPORT_RESULTS, method: routeMapper.fetchGetFunctionForRoute(routeConsts.REPORT_RESULTS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to paged report results endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/2' + testPagingQueryParams, expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2' + testPagingQueryParams, route: routeConsts.REPORT_RESULTS, method: routeMapper.fetchGetFunctionForRoute(routeConsts.REPORT_RESULTS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to report invoke endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/2/invoke', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/invoke', route: routeConsts.REPORT_INVOKE_RESULTS, method: routeMapper.fetchGetFunctionForRoute(routeConsts.REPORT_INVOKE_RESULTS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to report record count endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', route: routeConsts.REPORT_RECORDS_COUNT, method: routeMapper.fetchGetFunctionForRoute(routeConsts.REPORT_RECORDS_COUNT), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to health via tomcat all', request: '/api/v1/health', expectedPath: '/api/api/v1/health', route: routeConsts.TOMCAT_ALL, method: routeMapper.fetchAllFunctionForRoute(routeConsts.TOMCAT_ALL), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to resolve facets', request: '/api/n/v1/facets/parse', expectedPath: '/api/api/n/v1/facets/parse', route: routeConsts.FACET_EXPRESSION_PARSE, method: routeMapper.fetchGetFunctionForRoute(routeConsts.FACET_EXPRESSION_PARSE), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to apps endpoint', request: '/api/l/v1/apps/fakeApp', expectedPath: '/api/api/l/v1/apps/fakeApp', route: routeConsts.APPS, method: routeMapper.fetchGetFunctionForRoute(routeConsts.APPS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to app roles endpoint', request: '/api/l/v1/apps/fakeApp/roles', expectedPath: '/api/api/l/v1/apps/fakeApp/roles', route: routeConsts.APP_ROLES, method: routeMapper.fetchGetFunctionForRoute(routeConsts.APP_ROLES), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to getReqUser endpoint', request: '/api/l/v1/users/reqUser', expectedPath: '/api/api/l/v1/users/reqUser', route: routeConsts.REQ_USER, method: routeMapper.fetchGetFunctionForRoute(routeConsts.REQ_USER), expectedDefined: true, httpVerb: 'GET'},

            {message: 'POST request to form components endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord', route: routeConsts.FORM_COMPONENTS, method: routeMapper.fetchGetFunctionForRoute(routeConsts.FORM_COMPONENTS), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to form and record components endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', route: routeConsts.FORM_AND_RECORD_COMPONENTS, method: routeMapper.fetchPostFunctionForRoute(routeConsts.FORM_AND_RECORD_COMPONENTS), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to record endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routeConsts.RECORD, method: routeMapper.fetchPostFunctionForRoute(routeConsts.RECORD), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to records endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/v1/apps/fakeApp/tables/fakeTable/records', route: routeConsts.RECORDS, method: routeMapper.fetchPostFunctionForRoute(routeConsts.RECORDS), expectedDefined: true, httpVerb: 'POST'},
            {message: 'POST request to records bulk endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/bulk', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/bulk', route: routeConsts.RECORDS_BULK, method: routeMapper.fetchPostFunctionForRoute(routeConsts.RECORDS_BULK), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to report metadata endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/2', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2', route: routeConsts.REPORT_META, method: routeMapper.fetchPostFunctionForRoute(routeConsts.REPORT_META), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to report results endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/1/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/1/results', route: routeConsts.REPORT_RESULTS, method: routeMapper.fetchPostFunctionForRoute(routeConsts.REPORT_RESULTS), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to report invoke endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/1/invoke', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/1/invoke', route: routeConsts.REPORT_INVOKE_RESULTS, method: routeMapper.fetchPostFunctionForRoute(routeConsts.REPORT_INVOKE_RESULTS), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to report record count endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', route: routeConsts.REPORT_RECORDS_COUNT, method: routeMapper.fetchPostFunctionForRoute(routeConsts.REPORT_RECORDS_COUNT), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to table homepage id endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/homepage', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/homepage', route: routeConsts.TABLE_HOMEPAGE_REPORT, method: routeMapper.fetchPostFunctionForRoute(routeConsts.TABLE_HOMEPAGE_REPORT), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to apps endpoint', request: '/api/l/v1/apps/fakeApp', expectedPath: '/api/api/l/v1/apps/fakeApp', route: routeConsts.APPS, method: routeMapper.fetchPostFunctionForRoute(routeConsts.APPS), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to app roles endpoint', request: '/api/l/v1/apps/fakeApp/roles', expectedPath: '/api/api/l/v1/apps/fakeApp/roles', route: routeConsts.APP_ROLES, method: routeMapper.fetchPostFunctionForRoute(routeConsts.APP_ROLES), expectedDefined: false, httpVerb: 'POST'},

            {message: 'DELETE request to form components endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord', route: routeConsts.FORM_COMPONENTS, method: routeMapper.fetchGetFunctionForRoute(routeConsts.FORM_COMPONENTS), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to form and record components endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', route: routeConsts.FORM_AND_RECORD_COMPONENTS, method: routeMapper.fetchDeleteFunctionForRoute(routeConsts.FORM_AND_RECORD_COMPONENTS), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to record endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1', route: routeConsts.RECORD, method: routeMapper.fetchDeleteFunctionForRoute(routeConsts.RECORD), expectedDefined: true, httpVerb: 'DELETE'},
            {message: 'DELETE request to records endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routeConsts.RECORDS, method: routeMapper.fetchDeleteFunctionForRoute(routeConsts.RECORDS), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to records bulk endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/bulk', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/bulk', route: routeConsts.RECORDS_BULK, method: routeMapper.fetchDeleteFunctionForRoute(routeConsts.RECORDS_BULK), expectedDefined: true, httpVerb: 'DELETE'},
            {message: 'DELETE request to report metadata endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/2', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2', route: routeConsts.REPORT_META, method: routeMapper.fetchDeleteFunctionForRoute(routeConsts.REPORT_META), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to report results endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/1/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/results', route: routeConsts.REPORT_RESULTS, method: routeMapper.fetchDeleteFunctionForRoute(routeConsts.REPORT_RESULTS), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to report results endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/1/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/invoke', route: routeConsts.REPORT_INVOKE_RESULTS, method: routeMapper.fetchDeleteFunctionForRoute(routeConsts.REPORT_INVOKE_RESULTS), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to report record count endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', route: routeConsts.REPORT_RECORDS_COUNT, method: routeMapper.fetchDeleteFunctionForRoute(routeConsts.REPORT_RECORDS_COUNT), expectedDefined: false, httpVerb: 'POST'},
            {message: 'DELETE request to table homepage id endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/homepage', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/homepage', route: routeConsts.TABLE_HOMEPAGE_REPORT, method: routeMapper.fetchDeleteFunctionForRoute(routeConsts.TABLE_HOMEPAGE_REPORT), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to apps endpoint', request: '/api/l/v1/apps/fakeApp', expectedPath: '/api/api/l/v1/apps/fakeApp', route: routeConsts.APPS, method: routeMapper.fetchDeleteFunctionForRoute(routeConsts.APPS), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to app roles endpoint', request: '/api/l/v1/apps/fakeApp/roles', expectedPath: '/api/api/l/v1/apps/fakeApp/roles', route: routeConsts.APP_ROLES, method: routeMapper.fetchDeleteFunctionForRoute(routeConsts.APP_ROLES), expectedDefined: false, httpVerb: 'DELETE'},

            {message: 'PUT request to form components endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord', route: routeConsts.FORM_COMPONENTS, method: routeMapper.fetchGetFunctionForRoute(routeConsts.FORM_COMPONENTS), expectedDefined: false, httpVerb: 'PUT'},
            {message: 'PUT request to form and record components endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', route: routeConsts.FORM_AND_RECORD_COMPONENTS, method: routeMapper.fetchPutFunctionForRoute(routeConsts.FORM_AND_RECORD_COMPONENTS), expectedDefined: false, httpVerb: 'PUT'},
            {message: 'PUT request to record endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1', route: routeConsts.RECORD, method: routeMapper.fetchPutFunctionForRoute(routeConsts.RECORD), expectedDefined: false, httpVerb: 'PUT'},
            {message: 'PUT request to records endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routeConsts.RECORDS, method: routeMapper.fetchPutFunctionForRoute(routeConsts.RECORDS), expectedDefined: false, httpVerb: 'PUT'},
            {message: 'PUT request to records bulk endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/bulk', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/bulk', route: routeConsts.RECORDS_BULK, method: routeMapper.fetchPutFunctionForRoute(routeConsts.RECORDS_BULK), expectedDefined: false, httpVerb: 'PUT'},
            {message: 'PUT request to report metadata endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/2', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2', route: routeConsts.REPORT_META, method: routeMapper.fetchPutFunctionForRoute(routeConsts.REPORT_META), expectedDefined: false, httpVerb: 'PUT'},
            {message: 'PUT request to report results endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/1/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/results', route: routeConsts.REPORT_RESULTS, method: routeMapper.fetchPutFunctionForRoute(routeConsts.REPORT_RESULTS), expectedDefined: false, httpVerb: 'PUT'},
            {message: 'PUT request to report results endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/1/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/invoke', route: routeConsts.REPORT_INVOKE_RESULTS, method: routeMapper.fetchPutFunctionForRoute(routeConsts.REPORT_INVOKE_RESULTS), expectedDefined: false, httpVerb: 'PUT'},
            {message: 'PUT request to report record count endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', route: routeConsts.REPORT_RECORDS_COUNT, method: routeMapper.fetchPutFunctionForRoute(routeConsts.REPORT_RECORDS_COUNT), expectedDefined: false, httpVerb: 'PUT'},
            {message: 'PUT request to table homepage id endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/homepage', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/homepage', route: routeConsts.TABLE_HOMEPAGE_REPORT, method: routeMapper.fetchPutFunctionForRoute(routeConsts.TABLE_HOMEPAGE_REPORT), expectedDefined: false, httpVerb: 'PUT'},
            {message: 'PUT request to apps endpoint', request: '/api/l/v1/apps/fakeApp', expectedPath: '/api/api/l/v1/apps/fakeApp', route: routeConsts.APPS, method: routeMapper.fetchPutFunctionForRoute(routeConsts.APPS), expectedDefined: false, httpVerb: 'PUT'},
            {message: 'PUT request to app roles endpoint', request: '/api/l/v1/apps/fakeApp/roles', expectedPath: '/api/api/l/v1/apps/fakeApp/roles', route: routeConsts.APP_ROLES, method: routeMapper.fetchPutFunctionForRoute(routeConsts.APP_ROLES), expectedDefined: false, httpVerb: 'PUT'},

            {message: 'PATCH request to form components endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord', route: routeConsts.FORM_COMPONENTS, method: routeMapper.fetchGetFunctionForRoute(routeConsts.FORM_COMPONENTS), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to form and record components endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', route: routeConsts.FORM_AND_RECORD_COMPONENTS, method: routeMapper.fetchPatchFunctionForRoute(routeConsts.FORM_AND_RECORD_COMPONENTS), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to record endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/1', expectedPath: '/api/v1/apps/fakeApp/tables/fakeTable/records/1', route: routeConsts.RECORD, method: routeMapper.fetchPatchFunctionForRoute(routeConsts.RECORD), expectedDefined: true, httpVerb: 'PATCH'},
            {message: 'PATCH request to records endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routeConsts.RECORDS, method: routeMapper.fetchPatchFunctionForRoute(routeConsts.RECORDS), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to records bulk endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/bulk', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/bulk', route: routeConsts.RECORDS_BULK, method: routeMapper.fetchPatchFunctionForRoute(routeConsts.RECORDS_BULK), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to report metadata endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/2', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2', route: routeConsts.REPORT_META, method: routeMapper.fetchPatchFunctionForRoute(routeConsts.REPORT_META), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to report results endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/1/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/results', route: routeConsts.REPORT_RESULTS, method: routeMapper.fetchPatchFunctionForRoute(routeConsts.REPORT_RESULTS), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to report results endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/1/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/invoke', route: routeConsts.REPORT_INVOKE_RESULTS, method: routeMapper.fetchPatchFunctionForRoute(routeConsts.REPORT_INVOKE_RESULTS), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to report record count endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', route: routeConsts.REPORT_RECORDS_COUNT, method: routeMapper.fetchPatchFunctionForRoute(routeConsts.REPORT_RECORDS_COUNT), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to table homepage id endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/homepage', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/homepage', route: routeConsts.TABLE_HOMEPAGE_REPORT, method: routeMapper.fetchPatchFunctionForRoute(routeConsts.TABLE_HOMEPAGE_REPORT), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to apps endpoint', request: '/api/l/v1/apps/fakeApp', expectedPath: '/api/api/l/v1/apps/fakeApp', route: routeConsts.APPS, method: routeMapper.fetchPatchFunctionForRoute(routeConsts.APPS), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to app roles endpoint', request: '/api/l/v1/apps/fakeApp/roles', expectedPath: '/api/api/l/v1/apps/fakeApp/roles', route: routeConsts.APP_ROLES, method: routeMapper.fetchPatchFunctionForRoute(routeConsts.APP_ROLES), expectedDefined: false, httpVerb: 'PATCH'},

            {message: 'GET request to apps endpoint', request: '/api/v1/apps', expectedPath: '/api/api/v1/apps', route: routeConsts.TOMCAT_ALL, method: routeMapper.fetchAllFunctionForRoute(routeConsts.TOMCAT_ALL), expectedDefined: false, httpVerb: 'GET'},
            {message: 'GET request to app users endpoint', request: '/api/v1/apps/fakeApp/users', expectedPath: '/api/api/v1/apps/fakeApp/users', route: routeConsts.APP_USERS, method: routeMapper.fetchGetFunctionForRoute(routeConsts.APP_USERS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'POST request to apps endpoint', request: '/api/v1/apps/fakeApp', expectedPath: '/api/api/v1/apps/fakeApp', route: routeConsts.TOMCAT_ALL, method: routeMapper.fetchAllFunctionForRoute(routeConsts.TOMCAT_ALL), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to app users endpoint', request: '/api/v1/apps/fakeApp/users', expectedPath: '/api/api/v1/apps/fakeApp/users', route: routeConsts.APP_USERS, method: routeMapper.fetchPostFunctionForRoute(routeConsts.APP_USERS), expectedDefined: false, httpVerb: 'POST'},
            {message: 'PUT request to tables endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable', route: routeConsts.TOMCAT_ALL, method: routeMapper.fetchAllFunctionForRoute(routeConsts.TOMCAT_ALL), expectedDefined: false, httpVerb: 'PUT'},
            {message: 'PUT request to app users endpoint', request: '/api/v1/apps/fakeApp/users', expectedPath: '/api/api/v1/apps/fakeApp/users', route: routeConsts.APP_USERS, method: routeMapper.fetchPutFunctionForRoute(routeConsts.APP_USERS), expectedDefined: false, httpVerb: 'PUT'},
            {message: 'PATCH request to tables endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable', route: routeConsts.TOMCAT_ALL, method: routeMapper.fetchAllFunctionForRoute(routeConsts.TOMCAT_ALL), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to app users endpoint', request: '/api/v1/apps/fakeApp/users', expectedPath: '/api/api/v1/apps/fakeApp/users', route: routeConsts.APP_USERS, method: routeMapper.fetchPatchFunctionForRoute(routeConsts.APP_USERS), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'DELETE request to apps endpoint', request: '/api/v1/apps/fakeApp', expectedPath: '/api/api/v1/apps/fakeApp', route: routeConsts.TOMCAT_ALL, method: routeMapper.fetchAllFunctionForRoute(routeConsts.TOMCAT_ALL), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to app users endpoint', request: '/api/v1/apps/fakeApp/users', expectedPath: '/api/api/v1/apps/fakeApp/users', route: routeConsts.APP_USERS, method: routeMapper.fetchDeleteFunctionForRoute(routeConsts.APP_USERS), expectedDefined: false, httpVerb: 'DELETE'},

            {message: 'GET request to the health check endpoint', request: '/api/v1/health', expectedPath: '/api/api/v1/health', route: routeConsts.HEALTH_CHECK, method: routeMapper.fetchGetFunctionForRoute(routeConsts.HEALTH_CHECK), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to the swagger api endpoint', request: '/api/v1/someEndpoint', expectedPath: '/api/v1/someEndpoint', route: routeConsts.SWAGGER_API, method: routeMapper.fetchGetFunctionForRoute(routeConsts.SWAGGER_API), expectedDefined: true, httpVerb: 'GET'}
        ];
    }

    function eePathModificationProvider() {
        return [
            {message: 'GET request to the swagger experience engine api endpoint', request: '/ee/v1/someEndpoint', expectedPath: '/ee/v1/someEndpoint', route: routeConsts.SWAGGER_API_EE, method: routeMapper.fetchGetFunctionForRoute(routeConsts.SWAGGER_API_EE), expectedDefined: true, httpVerb: 'GET'}
        ];
    }

    function featureSwitchesPathModificationProvider() {
        return [
            {message: 'GET request to the feature states endpoint', request: '/api/v1/featureStates', expectedPath: '/api/v1/featureStates', route: routeConsts.FEATURE_STATES, method: routeMapper.fetchGetFunctionForRoute(routeConsts.FEATURE_STATES), expectedDefined: true, httpVerb: 'GET'},

            {message: 'GET request to the feature switches endpoint', request: '/api/v1/admin/featureSwitches', expectedPath: '/api/api/v1/admin/featureSwitches', route: routeConsts.FEATURE_SWITCHES, method: routeMapper.fetchGetFunctionForRoute(routeConsts.FEATURE_SWITCHES), expectedDefined: true, httpVerb: 'GET'},
            {message: 'POST request to feature switches endpoint', request: '/api/v1/admin/featureSwitches', expectedPath: '/api/v1/admin/featureSwitches', route: routeConsts.FEATURE_SWITCHES, method: routeMapper.fetchPostFunctionForRoute(routeConsts.FEATURE_SWITCHES), expectedDefined: true, httpVerb: 'POST'},
            {message: 'PUT request to feature switches endpoint', request: '/api/v1/admin/featureSwitches/1', expectedPath: '/api/v1/admin/featureSwitches/1', route: routeConsts.FEATURE_SWITCH, method: routeMapper.fetchPutFunctionForRoute(routeConsts.FEATURE_SWITCH), expectedDefined: true, httpVerb: 'PUT'},
            {message: 'POST request to feature switches bulk endpoint', request: '/api/v1/admin/featureSwitches/bulk', expectedPath: '/api/v1/admin/featureSwitches/bulk', route: routeConsts.FEATURE_SWITCHES_BULK, method: routeMapper.fetchPostFunctionForRoute(routeConsts.FEATURE_SWITCHES_BULK), expectedDefined: true, httpVerb: 'POST'},

            {message: 'POST request to feature overrides endpoint', request: '/api/v1/admin/featureSwitches/1/overrides', expectedPath: '/api/v1/admin/featureSwitches/1/overrides', route: routeConsts.FEATURE_OVERRIDES, method: routeMapper.fetchPostFunctionForRoute(routeConsts.FEATURE_OVERRIDES), expectedDefined: true, httpVerb: 'POST'},
            {message: 'PUT request to feature overrides endpoint', request: '/api/v1/admin/featureSwitches/1/overrides/1', expectedPath: '/api/v1/admin/featureSwitches/1/overrides/1', route: routeConsts.FEATURE_OVERRIDE, method: routeMapper.fetchPutFunctionForRoute(routeConsts.FEATURE_OVERRIDE), expectedDefined: true, httpVerb: 'PUT'},
            {message: 'POST request to feature overrides bulk endpoint', request: '/api/v1/admin/featureSwitches/1/overrides/bulk', expectedPath: '/api/v1/admin/featureSwitches/1/overrides/bulk', route: routeConsts.FEATURE_OVERRIDES_BULK, method: routeMapper.fetchPostFunctionForRoute(routeConsts.FEATURE_OVERRIDES_BULK), expectedDefined: true, httpVerb: 'POST'},

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
        featureSwitchesPathModificationProvider().forEach(function(entry) {
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
                    assert.equal(originalReq.url, expectedPath);
                }
            }
            done();
        });
    }
});
