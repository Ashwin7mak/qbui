/**
 * A test to test the qbRouteMapper is properly modifying the url to route to a given tomcat api
 * Created by cschneider1 on 7/16/15.
 */

'use strict';


var config = require('../../config/environment');
var routeMapper = require('../qbRouteMapper')(config);
var routeConsts = require('../routeConstants');
var assert = require('assert');
var sinon = require('sinon');
var recordsApi = require('../../api/quickbase/recordsApi')(config);
var requestStub;

/**
 * Unit tests for app generator
 */
describe('Qb Route Mapper Unit Test', function() {

    before(function() {

        requestStub = sinon.stub();
        recordsApi.setRequestObject(requestStub);
        routeMapper.setRecordsApi(recordsApi);
    });

    function pathModificationProvider() {
        return [
            {message: 'GET request to record endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1', route: routeConsts.RECORD, method: routeMapper.fetchGetFunctionForRoute(routeConsts.RECORD), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to records endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routeConsts.RECORDS, method: routeMapper.fetchGetFunctionForRoute(routeConsts.RECORDS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to report endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/2', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2', route: routeConsts.REPORT_RESULTS, method: routeMapper.fetchGetFunctionForRoute(routeConsts.REPORT_RESULTS), expectedDefined: true, httpVerb: 'GET'},
            {message: 'GET request to health via tomcat all', request: '/api/v1/health', expectedPath: '/api/api/v1/health', route: routeConsts.TOMCAT_ALL, method: routeMapper.fetchAllFunctionForRoute(routeConsts.TOMCAT_ALL), expectedDefined: true, httpVerb: 'GET'},

            {message: 'POST request to record endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routeConsts.RECORD, method: routeMapper.fetchPostFunctionForRoute(routeConsts.RECORD), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to records endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routeConsts.RECORDS, method: routeMapper.fetchPostFunctionForRoute(routeConsts.RECORDS), expectedDefined: false, httpVerb: 'POST'},
            {message: 'POST request to report endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routeConsts.REPORT_RESULTS, method: routeMapper.fetchPostFunctionForRoute(routeConsts.REPORT_RESULTS), expectedDefined: false, httpVerb: 'POST'},

            {message: 'DELETE request to record endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1', route: routeConsts.RECORD, method: routeMapper.fetchDeleteFunctionForRoute(routeConsts.RECORD), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to records endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routeConsts.RECORDS, method: routeMapper.fetchDeleteFunctionForRoute(routeConsts.RECORDS), expectedDefined: false, httpVerb: 'DELETE'},
            {message: 'DELETE request to report endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2', route: routeConsts.REPORT_RESULTS, method: routeMapper.fetchDeleteFunctionForRoute(routeConsts.REPORT_RESULTS), expectedDefined: false, httpVerb: 'DELETE'},

            {message: 'PUT request to record endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1', route: routeConsts.RECORD, method: routeMapper.fetchPutFunctionForRoute(routeConsts.RECORD), expectedDefined: false, httpVerb: 'PUT'},
            {message: 'PUT request to records endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routeConsts.RECORDS, method: routeMapper.fetchPutFunctionForRoute(routeConsts.RECORDS), expectedDefined: false, httpVerb: 'PUT'},
            {message: 'PUT request to report endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2', route: routeConsts.REPORT_RESULTS, method: routeMapper.fetchPutFunctionForRoute(routeConsts.REPORT_RESULTS), expectedDefined: false, httpVerb: 'PUT'},

            {message: 'PATCH request to record endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1', route: routeConsts.RECORD, method: routeMapper.fetchPatchFunctionForRoute(routeConsts.RECORD), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to records endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/records', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routeConsts.RECORDS, method: routeMapper.fetchPatchFunctionForRoute(routeConsts.RECORDS), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'PATCH request to report endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/1', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2', route: routeConsts.REPORT_RESULTS, method: routeMapper.fetchPatchFunctionForRoute(routeConsts.REPORT_RESULTS), expectedDefined: false, httpVerb: 'PATCH'},

            {message: 'GET request to apps endpoint', request: '/api/v1/apps', expectedPath: '/api/api/v1/apps', route: routeConsts.TOMCAT_ALL, method: routeMapper.fetchAllFunctionForRoute(routeConsts.TOMCAT_ALL), expectedDefined: false, httpVerb: 'GET'},
            {message: 'POST request to apps endpoint', request: '/api/v1/apps/fakeApp', expectedPath: '/api/api/v1/apps/fakeApp', route: routeConsts.TOMCAT_ALL, method: routeMapper.fetchAllFunctionForRoute(routeConsts.TOMCAT_ALL), expectedDefined: false, httpVerb: 'POST'},
            {message: 'PUT request to tables endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable', route: routeConsts.TOMCAT_ALL, method: routeMapper.fetchAllFunctionForRoute(routeConsts.TOMCAT_ALL), expectedDefined: false, httpVerb: 'PUT'},
            {message: 'PATCH request to tables endpoint', request: '/api/v1/apps/fakeApp/tables/fakeTable', expectedPath: '/api/api/v1/apps/fakeApp/tables/fakeTable', route: routeConsts.TOMCAT_ALL, method: routeMapper.fetchAllFunctionForRoute(routeConsts.TOMCAT_ALL), expectedDefined: false, httpVerb: 'PATCH'},
            {message: 'DELETE request to apps endpoint', request: '/api/v1/apps/fakeApp', expectedPath: '/api/api/v1/apps/fakeApp', route: routeConsts.TOMCAT_ALL, method: routeMapper.fetchAllFunctionForRoute(routeConsts.TOMCAT_ALL), expectedDefined: false, httpVerb: 'DELETE'},

        ];
    }

    /**
     * Unit test that validates generating an app with a specified number of tables
     */
    describe('test modify path for request', function() {
        pathModificationProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function(done) {
                var expectedPath = entry.expectedPath;

                //mock out the request and response objects with some utility methods they need in this flow
                var originalReq = {
                    param: function() {}
                };

                originalReq.method =
                        originalReq.url = entry.request;
                originalReq.route = {path: entry.route};
                originalReq.headers = {};
                var res = {
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
        });
    });
});
