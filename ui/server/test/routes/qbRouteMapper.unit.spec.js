/**
 * A test to test the qbRouteMapper is properly modifying the url to route to a given tomcat api
 * Created by cschneider1 on 7/16/15.
 */
'use strict';

let routes = require('../../src/routes/routeConstants').routes;
let assert = require('assert');
let sinon = require('sinon');
let config = require('../../src/config/environment');
let recordsApi = require('../../src/api/quickbase/recordsApi')(config);
let constants = require('../../../common/src/constants');
let requestStub;

/**
 * Unit tests for app generator
 */
describe('Qb Route Mapper Unit Test', function() {

    before(function() {
        requestStub = sinon.stub();
        recordsApi.setRequestObject(requestStub);
    });

    function corePathModificationProvider(routeMapper, publicRoutesOnly) {
        const testPagingQueryParams = '?' + constants.REQUEST_PARAMETER.OFFSET + '=20&' + constants.REQUEST_PARAMETER.NUM_ROWS + '=40';

        //  none of these routes should be defined if exposing only public routes
        const expectedDefined = publicRoutesOnly ? false : true;
        return [
            //  These https requests are expected to be defined, unless node is configured to expose only public routes
            {message: 'GET request to record endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/records/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1', route: routes.RECORD, method: routeMapper.fetchGetFunctionForRoute(routes.RECORD), expectedDefined: expectedDefined, httpVerb: 'GET'},
            {message: 'GET request to records endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routes.RECORDS, method: routeMapper.fetchGetFunctionForRoute(routes.RECORDS), expectedDefined: expectedDefined, httpVerb: 'GET'},
            {message: 'GET request to paged report record endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/records/1' + testPagingQueryParams, expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1' + testPagingQueryParams, route: routes.RECORD, method: routeMapper.fetchGetFunctionForRoute(routes.RECORD), expectedDefined: expectedDefined, httpVerb: 'GET'},
            {message: 'GET request to table homepage id endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/homepage', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/homepage', route: routes.TABLE_HOMEPAGE_REPORT, method: routeMapper.fetchGetFunctionForRoute(routes.TABLE_HOMEPAGE_REPORT), expectedDefined: expectedDefined, httpVerb: 'GET'},
            {message: 'GET request to form components endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/records/fakeRecord', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord', route: routes.FORM_COMPONENTS, method: routeMapper.fetchGetFunctionForRoute(routes.FORM_COMPONENTS), expectedDefined: expectedDefined, httpVerb: 'GET'},
            {message: 'GET request to form and record components endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', route: routes.FORM_AND_RECORD_COMPONENTS, method: routeMapper.fetchGetFunctionForRoute(routes.FORM_AND_RECORD_COMPONENTS), expectedDefined: expectedDefined, httpVerb: 'GET'},
            {message: 'GET request to report metadata endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/reports/2', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2', route: routes.REPORT_META, method: routeMapper.fetchGetFunctionForRoute(routes.REPORT_META), expectedDefined: expectedDefined, httpVerb: 'GET'},
            {message: 'GET request to report results endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/reports/2/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/results', route: routes.REPORT_RESULTS, method: routeMapper.fetchGetFunctionForRoute(routes.REPORT_RESULTS), expectedDefined: expectedDefined, httpVerb: 'GET'},
            {message: 'GET request to report default results endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/reports/default/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/default/results', route: routes.REPORT_RESULTS, method: routeMapper.fetchGetFunctionForRoute(routes.REPORT_RESULTS), expectedDefined: expectedDefined, httpVerb: 'GET'},
            {message: 'GET request to paged report results endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/reports/2' + testPagingQueryParams, expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2' + testPagingQueryParams, route: routes.REPORT_RESULTS, method: routeMapper.fetchGetFunctionForRoute(routes.REPORT_RESULTS), expectedDefined: expectedDefined, httpVerb: 'GET'},
            {message: 'GET request to report invoke endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/reports/2/invoke', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/invoke', route: routes.REPORT_INVOKE_RESULTS, method: routeMapper.fetchGetFunctionForRoute(routes.REPORT_INVOKE_RESULTS), expectedDefined: expectedDefined, httpVerb: 'GET'},
            {message: 'GET request to report record count endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', route: routes.REPORT_RECORDS_COUNT, method: routeMapper.fetchGetFunctionForRoute(routes.REPORT_RECORDS_COUNT), expectedDefined: expectedDefined, httpVerb: 'GET'},
            {message: 'GET request to apps endpoint', request: '/qbui/apps/fakeApp', expectedPath: '/api/api/v1/apps/fakeApp', route: routes.APPS, method: routeMapper.fetchGetFunctionForRoute(routes.APPS), expectedDefined: expectedDefined, httpVerb: 'GET'},
            {message: 'GET request to app roles endpoint', request: '/qbui/apps/fakeApp/roles', expectedPath: '/api/api/v1/apps/fakeApp/roles', route: routes.APP_ROLES, method: routeMapper.fetchGetFunctionForRoute(routes.APP_ROLES), expectedDefined: expectedDefined, httpVerb: 'GET'},
            {message: 'GET request to app users endpoint', request: '/qbui/apps/fakeApp/users', expectedPath: '/api/api/v1/apps/fakeApp/users', route: routes.APP_USERS, method: routeMapper.fetchGetFunctionForRoute(routes.APP_USERS), expectedDefined: expectedDefined, httpVerb: 'GET'},
            {message: 'GET request to getReqUser endpoint', request: '/qbui/users/reqUser', expectedPath: '/api/api/v1/users/reqUser', route: routes.REQ_USER, method: routeMapper.fetchGetFunctionForRoute(routes.REQ_USER), expectedDefined: expectedDefined, httpVerb: 'GET'},

            {message: 'POST request to table components endpoint', request: '/qbui/apps/1/tables/tableComponents', expectedPath: '/api/api/v1/apps/1/tables/tableComponents', route: routes.TABLE_COMPONENTS, method: routeMapper.fetchPostFunctionForRoute(routes.TABLE_COMPONENTS), expectedDefined: expectedDefined, httpVerb: 'POST'},
            {message: 'POST request to records endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routes.RECORDS, method: routeMapper.fetchPostFunctionForRoute(routes.RECORDS), expectedDefined: expectedDefined, httpVerb: 'POST'},

            {message: 'DELETE request to record endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/records/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1', route: routes.RECORD, method: routeMapper.fetchDeleteFunctionForRoute(routes.RECORD), expectedDefined: expectedDefined, httpVerb: 'DELETE'},
            {message: 'DELETE request to records bulk endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/records/bulk', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/bulk', route: routes.RECORDS_BULK, method: routeMapper.fetchDeleteFunctionForRoute(routes.RECORDS_BULK), expectedDefined: expectedDefined, httpVerb: 'DELETE'},
            {message: 'DELETE request to table endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable', route: routes.TABLE, method: routeMapper.fetchDeleteFunctionForRoute(routes.TABLE), expectedDefined: expectedDefined, httpVerb: 'DELETE'},

            {message: 'PATCH request to record endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/records/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1', route: routes.RECORD, method: routeMapper.fetchPatchFunctionForRoute(routes.RECORD), expectedDefined: expectedDefined, httpVerb: 'PATCH'},
            {message: 'PATCH request to tables endpoint', request: '/qbui/apps/1/tables/2', expectedPath: '/api/api/v1/apps/1/tables/2', route: routes.TABLE, method: routeMapper.fetchPatchFunctionForRoute(routes.TABLE), expectedDefined: expectedDefined, httpVerb: 'PATCH'},

            //  these routes are always expected to NOT be defined for the respective request
            {message: 'GET request to table components endpoint', request: '/qbui/apps/fakeApp/tables/tableComponents', expectedPath: '/api/api/v1/apps/fakeApp/tables/tableComponents', route: routes.TABLE_COMPONENTS, method: routeMapper.fetchGetFunctionForRoute(routes.TABLE_COMPONENTS), expectedDefined: false, httpVerb: 'GET'},
            {message: 'GET request to records bulk endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/records/bulk', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/bulk', route: routes.RECORDS_BULK, method: routeMapper.fetchGetFunctionForRoute(routes.RECORDS_BULK), expectedDefined: false, httpVerb: 'GET'},

            {message: 'POST request to form components endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/records/fakeRecord', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord', route: routes.FORM_COMPONENTS, method: routeMapper.fetchPostFunctionForRoute(routes.FORM_COMPONENTS), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to form and record components endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', route: routes.FORM_AND_RECORD_COMPONENTS, method: routeMapper.fetchPostFunctionForRoute(routes.FORM_AND_RECORD_COMPONENTS), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to record endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/records/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1', route: routes.RECORD, method: routeMapper.fetchPostFunctionForRoute(routes.RECORD), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to records bulk endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/records/bulk', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/bulk', route: routes.RECORDS_BULK, method: routeMapper.fetchPostFunctionForRoute(routes.RECORDS_BULK), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to report metadata endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/reports/2', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2', route: routes.REPORT_META, method: routeMapper.fetchPostFunctionForRoute(routes.REPORT_META), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to report results endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/reports/1/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/1/results', route: routes.REPORT_RESULTS, method: routeMapper.fetchPostFunctionForRoute(routes.REPORT_RESULTS), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to report invoke endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/reports/1/invoke', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/1/invoke', route: routes.REPORT_INVOKE_RESULTS, method: routeMapper.fetchPostFunctionForRoute(routes.REPORT_INVOKE_RESULTS), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to report record count endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', route: routes.REPORT_RECORDS_COUNT, method: routeMapper.fetchPostFunctionForRoute(routes.REPORT_RECORDS_COUNT), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to table homepage id endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/homepage', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/homepage', route: routes.TABLE_HOMEPAGE_REPORT, method: routeMapper.fetchPostFunctionForRoute(routes.TABLE_HOMEPAGE_REPORT), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to apps endpoint', request: '/qbui/apps/fakeApp', expectedPath: '/api/api/v1/apps/fakeApp', route: routes.APPS, method: routeMapper.fetchPostFunctionForRoute(routes.APPS), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to app roles endpoint', request: '/qbui/apps/fakeApp/roles', expectedPath: '/api/api/v1/apps/fakeApp/roles', route: routes.APP_ROLES, method: routeMapper.fetchPostFunctionForRoute(routes.APP_ROLES), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to app users endpoint', request: '/qbui/apps/fakeApp/users', expectedPath: '/api/api/v1/apps/fakeApp/users', route: routes.APP_USERS, method: routeMapper.fetchPostFunctionForRoute(routes.APP_USERS), expectedDefined: false, httpVerb: 'POST'},

            {message: 'DELETE request to form components endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/records/fakeRecord', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord', route: routes.FORM_COMPONENTS, method: routeMapper.fetchGetFunctionForRoute(routes.FORM_COMPONENTS), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to form and record components endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', route: routes.FORM_AND_RECORD_COMPONENTS, method: routeMapper.fetchDeleteFunctionForRoute(routes.FORM_AND_RECORD_COMPONENTS), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to records endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routes.RECORDS, method: routeMapper.fetchDeleteFunctionForRoute(routes.RECORDS), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to report metadata endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/reports/2', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2', route: routes.REPORT_META, method: routeMapper.fetchDeleteFunctionForRoute(routes.REPORT_META), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to report results endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/reports/1/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/results', route: routes.REPORT_RESULTS, method: routeMapper.fetchDeleteFunctionForRoute(routes.REPORT_RESULTS), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to report results endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/reports/1/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/invoke', route: routes.REPORT_INVOKE_RESULTS, method: routeMapper.fetchDeleteFunctionForRoute(routes.REPORT_INVOKE_RESULTS), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to report record count endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', route: routes.REPORT_RECORDS_COUNT, method: routeMapper.fetchDeleteFunctionForRoute(routes.REPORT_RECORDS_COUNT), expectedDefined: false, httpVerb: 'POST'},
            {message: 'DELETE request to table homepage id endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/homepage', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/homepage', route: routes.TABLE_HOMEPAGE_REPORT, method: routeMapper.fetchDeleteFunctionForRoute(routes.TABLE_HOMEPAGE_REPORT), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to apps endpoint', request: '/qbui/apps/fakeApp', expectedPath: '/api/api/v1/apps/fakeApp', route: routes.APPS, method: routeMapper.fetchDeleteFunctionForRoute(routes.APPS), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to app roles endpoint', request: '/qbui/apps/fakeApp/roles', expectedPath: '/api/api/v1/apps/fakeApp/roles', route: routes.APP_ROLES, method: routeMapper.fetchDeleteFunctionForRoute(routes.APP_ROLES), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to tables endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable', route: routes.TABLE, method: routeMapper.fetchDeleteFunctionForRoute(routes.TABLE), expectedDefined: false, httpVerb: 'DELETE'},

            {message: 'PATCH request to form components endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/records/fakeRecord', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord', route: routes.FORM_COMPONENTS, method: routeMapper.fetchGetFunctionForRoute(routes.FORM_COMPONENTS), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to form and record components endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/fakeRecord/formComponents', route: routes.FORM_AND_RECORD_COMPONENTS, method: routeMapper.fetchPatchFunctionForRoute(routes.FORM_AND_RECORD_COMPONENTS), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to records endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routes.RECORDS, method: routeMapper.fetchPatchFunctionForRoute(routes.RECORDS), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to records bulk endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/records/bulk', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/bulk', route: routes.RECORDS_BULK, method: routeMapper.fetchPatchFunctionForRoute(routes.RECORDS_BULK), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to report metadata endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/reports/2', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2', route: routes.REPORT_META, method: routeMapper.fetchPatchFunctionForRoute(routes.REPORT_META), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to report results endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/reports/1/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/results', route: routes.REPORT_RESULTS, method: routeMapper.fetchPatchFunctionForRoute(routes.REPORT_RESULTS), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to report results endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/reports/1/results', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/invoke', route: routes.REPORT_INVOKE_RESULTS, method: routeMapper.fetchPatchFunctionForRoute(routes.REPORT_INVOKE_RESULTS), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to report record count endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2/recordsCount', route: routes.REPORT_RECORDS_COUNT, method: routeMapper.fetchPatchFunctionForRoute(routes.REPORT_RECORDS_COUNT), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to table homepage id endpoint', request: '/qbui/apps/fakeApp/tables/fakeTable/homepage', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/homepage', route: routes.TABLE_HOMEPAGE_REPORT, method: routeMapper.fetchPatchFunctionForRoute(routes.TABLE_HOMEPAGE_REPORT), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to apps endpoint', request: '/qbui/apps/fakeApp', expectedPath: '/api/api/v1/apps/fakeApp', route: routes.APPS, method: routeMapper.fetchPatchFunctionForRoute(routes.APPS), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to app roles endpoint', request: '/qbui/apps/fakeApp/roles', expectedPath: '/api/api/v1/apps/fakeApp/roles', route: routes.APP_ROLES, method: routeMapper.fetchPatchFunctionForRoute(routes.APP_ROLES), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to app users endpoint', request: '/qbui/apps/fakeApp/users', expectedPath: '/api/api/v1/apps/fakeApp/users', route: routes.APP_USERS, method: routeMapper.fetchPatchFunctionForRoute(routes.APP_USERS), expectedDefined: false, httpVerb: 'PATCH'}
        ];
    }

    function nodePathProvider(routeMapper, publicRoutesOnly) {
        //  none of these routes should be defined if exposing only public routes
        const expectedDefined = publicRoutesOnly ? false : true;
        return [
            {message: 'GET request to resolve facets', request: '/qbui/facets/parse', expectedPath: '/qbui/facets/parse', route: routes.FACET_EXPRESSION_PARSE, method: routeMapper.fetchGetFunctionForRoute(routes.FACET_EXPRESSION_PARSE), expectedDefined: expectedDefined, httpVerb: 'GET'},
            //  node health check is expected to always be available
            {message: 'GET request to Node health check endpoint', request: '/qbui/health', expectedPath: '/qbui/health', route: routes.QBUI_HEALTH, method: routeMapper.fetchGetFunctionForRoute(routes.QBUI_HEALTH), expectedDefined: true, httpVerb: 'GET'}
        ];
    }

    function apiPathModificationProvider(routeMapper) {
        // these routes should always be defined
        return [
            //  test CORE
            {message: 'GET request to Core api', request: '/api/api/v1/someUrl', expectedPath: '/api/api/v1/someUrl', route: routes.CORE_ENGINE, method: routeMapper.fetchAllFunctionForRoute(routes.CORE_ENGINE), expectedDefined: true, httpVerb: 'GET'},
            {message: 'POST request to Core api', request: '/api/api/v1/someUrl', expectedPath: '/api/api/v1/someUrl', route: routes.CORE_ENGINE, method: routeMapper.fetchAllFunctionForRoute(routes.CORE_ENGINE), expectedDefined: true, httpVerb: 'POST'},
            {message: 'PATCH request to Core api', request: '/api/api/v1/someUrl', expectedPath: '/api/api/v1/someUrl', route: routes.CORE_ENGINE, method: routeMapper.fetchAllFunctionForRoute(routes.CORE_ENGINE), expectedDefined: true, httpVerb: 'PATCH'},
            {message: 'PUT request to Core api', request: '/api/api/v1/someUrl', expectedPath: '/api/api/v1/someUrl', route: routes.CORE_ENGINE, method: routeMapper.fetchAllFunctionForRoute(routes.CORE_ENGINE), expectedDefined: true, httpVerb: 'PUT'},
            {message: 'DELETE request Core EE api', request: '/api/api/v1/someUrl', expectedPath: '/api/api/v1/someUrl', route: routes.CORE_ENGINE, method: routeMapper.fetchAllFunctionForRoute(routes.CORE_ENGINE), expectedDefined: true, httpVerb: 'DELETE'},
            //  test EE
            {message: 'GET request to EE api', request: '/ee/v1/someUrl', expectedPath: '/ee/v1/someUrl', route: routes.EXPERIENCE_ENGINE, method: routeMapper.fetchAllFunctionForRoute(routes.EXPERIENCE_ENGINE), expectedDefined: true, httpVerb: 'GET'},
            {message: 'POST request to EE api', request: '/ee/v1/someUrl', expectedPath: '/ee/v1/someUrl', route: routes.EXPERIENCE_ENGINE, method: routeMapper.fetchAllFunctionForRoute(routes.EXPERIENCE_ENGINE), expectedDefined: true, httpVerb: 'POST'},
            {message: 'PATCH request to EE api', request: '/ee/v1/someUrl', expectedPath: '/ee/v1/someUrl', route: routes.EXPERIENCE_ENGINE, method: routeMapper.fetchAllFunctionForRoute(routes.EXPERIENCE_ENGINE), expectedDefined: true, httpVerb: 'PATCH'},
            {message: 'PUT request to EE api', request: '/ee/v1/someUrl', expectedPath: '/ee/v1/someUrl', route: routes.EXPERIENCE_ENGINE, method: routeMapper.fetchAllFunctionForRoute(routes.EXPERIENCE_ENGINE), expectedDefined: true, httpVerb: 'PUT'},
            {message: 'DELETE request to EE api', request: '/ee/v1/someUrl', expectedPath: '/ee/v1/someUrl', route: routes.EXPERIENCE_ENGINE, method: routeMapper.fetchAllFunctionForRoute(routes.EXPERIENCE_ENGINE), expectedDefined: true, httpVerb: 'DELETE'},
        ];
    }

    function automationModificationProvider(routeMapper)  {
        // these routes should always be defined
        return [
            {message: 'GET request to automation engine health check', request: '/we/api/v1/health', expectedPath: '/we/api/v1/health', route: routes.AUTOMATION_ENGINE, method: routeMapper.fetchAllFunctionForRoute(routes.AUTOMATION_ENGINE), expectedDefined: true, httpVerb: 'GET'}
        ];
    }

    function publicEndpointsProvider(routeMapper)  {
        // these routes should always be defined
        return [
            {message: 'GET request to public app roles', request: '/apps/fakeApp/roles', expectedPath: '/api/api/v1/apps/fakeApp/roles', route: routes.PUBLIC_ROLES, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_ROLES), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public app user roles', request: '/apps/fakeApp/roles/fakeRole/users', expectedPath: '/api/api/v1/apps/fakeApp/roles/fakeRole/users', route: routes.PUBLIC_ROLES, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_ROLES), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public apps', request: '/apps', expectedPath: '/api/api/v1/apps', route: routes.PUBLIC_APPS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_APPS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public apps with id', request: '/apps/1', expectedPath: '/api/api/v1/apps/1', route: routes.PUBLIC_APPS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_APPS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public fields', request: '/apps/fakeApp/tables/fakeTable/fields', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/fields', route: routes.PUBLIC_FIELDS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_FIELDS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public fields with id', request: '/apps/fakeApp/tables/fakeTable/fields/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/fields/1', route: routes.PUBLIC_FIELDS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_FIELDS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public forms', request: '/apps/fakeApp/tables/fakeTable/forms', expectedPath: '/ee/v1/apps/fakeApp/tables/fakeTable/forms', route: routes.PUBLIC_FORMS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_FORMS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public forms with id', request: '/apps/fakeApp/tables/fakeTable/forms/1', expectedPath: '/ee/v1/apps/fakeApp/tables/fakeTable/forms/1', route: routes.PUBLIC_FORMS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_FORMS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public realms', request: '/realms', expectedPath: '/api/api/v1/realms', route: routes.PUBLIC_REALMS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_REALMS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public realms with id', request: '/realms/1', expectedPath: '/api/api/v1/realms/1', route: routes.PUBLIC_REALMS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_REALMS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public records', request: '/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routes.PUBLIC_RECORDS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_RECORDS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public records with id', request: '/apps/fakeApp/tables/fakeTable/records/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1', route: routes.PUBLIC_RECORDS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_RECORDS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public relationships', request: '/apps/fakeApp/relationships', expectedPath: '/api/api/v1/apps/fakeApp/relationships', route: routes.PUBLIC_RELATIONSHIPS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_RELATIONSHIPS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public dependent relationships', request: '/apps/fakeApp/relationships/1/dependents', expectedPath: '/api/api/v1/apps/fakeApp/relationships/1/dependents', route: routes.PUBLIC_RELATIONSHIPS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_RELATIONSHIPS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public reports', request: '/apps/fakeApp/tables/fakeTable/reports', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports', route: routes.PUBLIC_REPORTS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_REPORTS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public reports with id', request: '/apps/fakeApp/tables/fakeTable/reports/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/1', route: routes.PUBLIC_REPORTS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_REPORTS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public table properties', request: '/apps/fakeApp/tables/fakeTable/tableproperties', expectedPath: '/ee/v1/apps/fakeApp/tables/fakeTable/tableproperties', route: routes.PUBLIC_TABLE_PROPERTIES, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_TABLE_PROPERTIES), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public table properties homepageId', request: '/apps/fakeApp/tables/fakeTable/tableproperties/1', expectedPath: '/ee/v1/apps/fakeApp/tables/fakeTable/tableproperties/1', route: routes.PUBLIC_TABLE_PROPERTIES, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_TABLE_PROPERTIES), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public tables', request: '/apps/fakeApp/tables', expectedPath: '/api/api/v1/apps/fakeApp/tables', route: routes.PUBLIC_TABLES, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_TABLES), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public tables with id', request: '/apps/fakeApp/tables/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/1', route: routes.PUBLIC_TABLES, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_TABLES), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public ticket', request: '/ticket', expectedPath: '/api/api/v1/ticket', route: routes.PUBLIC_TICKET, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_TICKET), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public ticket verify', request: '/ticket/verify', expectedPath: '/api/api/v1/ticket/verify', route: routes.PUBLIC_TICKET, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_TICKET), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public users', request: '/users', expectedPath: '/api/api/v1/users', route: routes.PUBLIC_USERS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_USERS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public users with id', request: '/users/1', expectedPath: '/api/api/v1/users/1', route: routes.PUBLIC_USERS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_USERS), expectedDefined: true, httpVerb: 'GET'},

            {message: 'GET request to public workflow manager', request: '/apps/fakeApp/workflow/flows', expectedPath: '/we/api/v1/apps/fakeApp/workflow/flows', route: routes.PUBLIC_WORKFLOW_FLOW_MGR, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_WORKFLOW_FLOW_MGR), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public workflow automation api', request: '/workflow/apps/fakeApp/api', expectedPath: '/we/workflow/apps/fakeApp/api', route: routes.PUBLIC_WORKFLOW_AUTOMATION_API, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_WORKFLOW_AUTOMATION_API), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public workflow automation invoke', request: '/workflow/apps/fakeApp/invokes', expectedPath: '/we/workflow/apps/fakeApp/invokes', route: routes.PUBLIC_WORKFLOW_AUTOMATION_INVOKE, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_WORKFLOW_AUTOMATION_INVOKE), expectedDefined: true, httpVerb: 'GET'},

            {message: 'GET request to public health', request: '/health', expectedPath: '/api/api/v1/health', route: routes.PUBLIC_HEALTH, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_HEALTH), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to public operations', request: '/operations', expectedPath: '/api/api/v1/operations', route: routes.PUBLIC_OPERATIONS, method: routeMapper.fetchAllFunctionForRoute(routes.PUBLIC_OPERATIONS), expectedDefined: true, httpVerb: 'GET'},

            {message: 'GET request to core swagger resources', request: '/api/swagger-resources/resource', expectedPath: '/api/swagger-resources/resource', route: routes.SWAGGER_RESOURCES, method: routeMapper.fetchGetFunctionForRoute(routes.SWAGGER_RESOURCES), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to core swagger v2', request: '/api/v2/api-docs', expectedPath: '/api/v2/api-docs', route: routes.SWAGGER_V2, method: routeMapper.fetchGetFunctionForRoute(routes.SWAGGER_V2), expectedDefined: true, httpVerb: 'GET'}
        ];
    }

    function featureSwitchesPathModificationProvider(routeMapper, publicRoutesOnly) {
        //  none of these routes should be defined if exposing only public routes
        const expectedDefined = publicRoutesOnly ? false : true;
        return [
            {message: 'GET request to the feature states endpoint', request: '/qbui/featureStates', expectedPath: '/api/api/v1/featureStates', route: routes.FEATURE_STATES, method: routeMapper.fetchGetFunctionForRoute(routes.FEATURE_STATES), expectedDefined: expectedDefined, httpVerb: 'GET'},
        ];
    }

    function governanceModificationProvider(routeMapper, publicRoutesOnly) {
        //  none of these routes should be defined if exposing only public routes
        const expectedDefined = publicRoutesOnly ? false : true;
        return [
            {message: 'GET request to governance users endpoint', request: '/api/governance/v1/12345/users', expectedPath: '/api/governance/v1/12345/users', route: routes.GOVERNANCE_ACCOUNT_USERS, method: routeMapper.fetchGetFunctionForRoute(routes.GOVERNANCE_ACCOUNT_USERS), expectedDefined: expectedDefined, httpVerb: 'GET'},
            {message: 'GET request to governance context endpoint', request: '/api/governance/v1/context', expectedPath: '/api/governance/v1/context', route: routes.GOVERNANCE_CONTEXT, method: routeMapper.fetchGetFunctionForRoute(routes.GOVERNANCE_CONTEXT), expectedDefined: expectedDefined, httpVerb: 'GET'}
        ];
    }

    /**
     * Unit test that validates generating an app with a specified number of tables
     */
    describe('test modify path for request with all routes', function() {
        let routeMapper = require('../../src/routes/qbRouteMapper')(config);
        routeMapper.setRecordsApi(recordsApi);
        routeMapper.setRequest(requestStub);

        corePathModificationProvider(routeMapper, config.publicRoutesOnly).forEach(function(entry) {
            runTestCase(entry);
        });
        nodePathProvider(routeMapper, config.publicRoutesOnly).forEach(function(entry) {
            runTestCase(entry);
        });
        apiPathModificationProvider(routeMapper).forEach(function(entry) {
            runTestCase(entry);
        });
        automationModificationProvider(routeMapper).forEach(function(entry) {
            runTestCase(entry);
        });
        featureSwitchesPathModificationProvider(routeMapper, config.publicRoutesOnly).forEach(function(entry) {
            runTestCase(entry);
        });
        governanceModificationProvider(routeMapper, config.publicRoutesOnly).forEach(function(entry) {
            runTestCase(entry);
        });
        publicEndpointsProvider(routeMapper).forEach(function(entry) {
            runTestCase(entry);
        });
    });

    describe('test modify path for request with public routes only', function() {
        config.publicRoutesOnly = true;
        let routeMapper = require('../../src/routes/qbRouteMapper')(config);
        routeMapper.setRecordsApi(recordsApi);
        routeMapper.setRequest(requestStub);

        corePathModificationProvider(routeMapper, config.publicRoutesOnly).forEach(function(entry) {
            runTestCase(entry);
        });
        nodePathProvider(routeMapper, config.publicRoutesOnly).forEach(function(entry) {
            runTestCase(entry);
        });
        apiPathModificationProvider(routeMapper).forEach(function(entry) {
            runTestCase(entry);
        });
        automationModificationProvider(routeMapper).forEach(function(entry) {
            runTestCase(entry);
        });
        featureSwitchesPathModificationProvider(routeMapper, config.publicRoutesOnly).forEach(function(entry) {
            runTestCase(entry);
        });
        governanceModificationProvider(routeMapper, config.publicRoutesOnly).forEach(function(entry) {
            runTestCase(entry);
        });
        publicEndpointsProvider(routeMapper).forEach(function(entry) {
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



    function featureSwitchesPathModificationProviderNegative(routeMapper, publicRoutesOnly) {
        //  none of these routes should be defined if exposing only public routes
        const expectedDefined = publicRoutesOnly ? false : true;
        return [
            {message: 'GET request to the feature switches endpoint', request: '/qbui/admin/featureSwitches', expectedPath: '/api/api/v1/admin/featureSwitches', route: routes.FEATURE_SWITCHES, method: routeMapper.fetchGetFunctionForRoute(routes.FEATURE_SWITCHES), expectedDefined: expectedDefined, httpVerb: 'GET'},
            {message: 'POST request to feature switches endpoint', request: '/qbui/admin/featureSwitches', expectedPath: '/api/api/v1/admin/featureSwitches', route: routes.FEATURE_SWITCHES, method: routeMapper.fetchPostFunctionForRoute(routes.FEATURE_SWITCHES), expectedDefined: expectedDefined, httpVerb: 'POST'},
            {message: 'PUT request to feature switches endpoint', request: '/qbui/admin/featureSwitches/1', expectedPath: '/api/api/v1/admin/featureSwitches/1', route: routes.FEATURE_SWITCH, method: routeMapper.fetchPutFunctionForRoute(routes.FEATURE_SWITCH), expectedDefined: expectedDefined, httpVerb: 'PUT'},
            {message: 'POST request to feature switches bulk endpoint', request: '/qbui/admin/featureSwitches/bulk', expectedPath: '/api/api/v1/admin/featureSwitches/bulk', route: routes.FEATURE_SWITCHES_BULK, method: routeMapper.fetchPostFunctionForRoute(routes.FEATURE_SWITCHES_BULK), expectedDefined: expectedDefined, httpVerb: 'POST'},

            {message: 'POST request to feature overrides endpoint', request: '/qbui/admin/featureSwitches/1/overrides', expectedPath: '/api/api/v1/admin/featureSwitches/1/overrides', route: routes.FEATURE_OVERRIDES, method: routeMapper.fetchPostFunctionForRoute(routes.FEATURE_OVERRIDES), expectedDefined: expectedDefined, httpVerb: 'POST'},
            {message: 'PUT request to feature overrides endpoint', request: '/qbui/admin/featureSwitches/1/overrides/1', expectedPath: '/api/api/v1/admin/featureSwitches/1/overrides/1', route: routes.FEATURE_OVERRIDE, method: routeMapper.fetchPutFunctionForRoute(routes.FEATURE_OVERRIDE), expectedDefined: expectedDefined, httpVerb: 'PUT'},
            {message: 'POST request to feature overrides bulk endpoint', request: '/qbui/admin/featureSwitches/1/overrides/bulk', expectedPath: '/api/api/v1/admin/featureSwitches/1/overrides/bulk', route: routes.FEATURE_OVERRIDES_BULK, method: routeMapper.fetchPostFunctionForRoute(routes.FEATURE_OVERRIDES_BULK), expectedDefined: expectedDefined, httpVerb: 'POST'}
        ];
    }

    /**
     * ensure we dont accidentally enable service based feature switch endpoints.
     * @param entry
     */
    describe('test feasture switch service based endpoints are not enabled', function() {
        config.publicRoutesOnly = true;
        let routeMapper = require('../../src/routes/qbRouteMapper')(config);
        routeMapper.setRequest(requestStub);
        featureSwitchesPathModificationProviderNegative(routeMapper, config.publicRoutesOnly).forEach(function(entry) {
            runTestCase(entry);
        });
    });

    /**
     * ensure that the path is undefined
     * @param entry
     */
    function runTestCaseNegative(entry) {
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
                    done();
                } else {
                    assert.fail();
                }
            }
            done();
        });
    }
});
