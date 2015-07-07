/**
 * A test to test the qbRouteMapper is properly modifying the url to route to a given tomcat api
 * Created by cschneider1 on 7/16/15.
 */

'use strict';


var config = require('../../config/environment'),
envMapper = require('../qbRouteGroupMapper'),
routeMapper = require('../qbRouteMapper')(config, envMapper),
should = require('should'),
consts = require('../../api/constants'),
routeConsts = require('../routeConstants'),
assert = require('assert'),
apiBase = require('../../api/test/api.base.js')(config),
_ = require('lodash'),
sinon = require('sinon');

/**
 * Unit tests for app generator
 */
describe('Qb Route Mapper Unit Test', function () {

    function pathModificationProvider(){
        return [
            {message: "GET request to record endpoint", request : apiBase.resolveRecordsEndpoint('fakeApp', 'fakeTable', 1), expectedPath : '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1', method: routeMapper.fetchGetFunctionForRoute(routeConsts.RECORD), expectedDefined: true},
            {message: "GET request to records endpoint", request : apiBase.resolveRecordsEndpoint('fakeApp', 'fakeTable'), expectedPath : '/api/api/v1/apps/fakeApp/tables/fakeTable/records', method: routeMapper.fetchGetFunctionForRoute(routeConsts.RECORDS), expectedDefined: true},
            {message: "GET request to report endpoint", request: apiBase.resolveReportsEndpoint('fakeApp', 'fakeTable', 1), expectedPath : '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/1', method: routeMapper.fetchGetFunctionForRoute(routeConsts.REPORT_RESULTS), expectedDefined: true},
            {message: "GET request to health via tomcat all", request: '/api/v1/health', expectedPath : '/api/api/v1/health', method: routeMapper.fetchGetFunctionForRoute(routeConsts.TOMCAT_ALL), expectedDefined: true},
            {message: "POST request to record endpoint", request: apiBase.resolveRecordsEndpoint('fakeApp', 'fakeTable'), expectedPath : '/api/api/v1/apps/fakeApp/tables/fakeTable/records', method: routeMapper.fetchPostFunctionForRoute(routeConsts.RECORD), expectedDefined: false},
            {message: "POST request to records endpoint", request: apiBase.resolveRecordsEndpoint('fakeApp', 'fakeTable'), expectedPath : '/api/api/v1/apps/fakeApp/tables/fakeTable/records', method: routeMapper.fetchPostFunctionForRoute(routeConsts.RECORDS), expectedDefined: false},
            {message: "POST request to report endpoint", request: apiBase.resolveRecordsEndpoint('fakeApp', 'fakeTable'), expectedPath : '/api/api/v1/apps/fakeApp/tables/fakeTable/records', method: routeMapper.fetchPostFunctionForRoute(routeConsts.REPORT_RESULTS), expectedDefined: false},
            {message: "DELETE request to record endpoint", request: apiBase.resolveRecordsEndpoint('fakeApp', 'fakeTable'), expectedPath : '/api/api/v1/apps/fakeApp/tables/fakeTable/records', method: routeMapper.fetchDeleteFunctionForRoute(routeConsts.RECORD), expectedDefined: false},
            {message: "DELETE request to records endpoint", request: apiBase.resolveRecordsEndpoint('fakeApp', 'fakeTable'), expectedPath : '/api/api/v1/apps/fakeApp/tables/fakeTable/records', method: routeMapper.fetchDeleteFunctionForRoute(routeConsts.RECORDS), expectedDefined: false},
            {message: "DELETE request to report endpoint", request: apiBase.resolveRecordsEndpoint('fakeApp', 'fakeTable'), expectedPath : '/api/api/v1/apps/fakeApp/tables/fakeTable/records', method: routeMapper.fetchDeleteFunctionForRoute(routeConsts.REPORT_RESULTS), expectedDefined: false},
        ];
    }

    /**
     * Unit test that validates generating an app with a specified number of tables
     */
    describe('test modify path for request',function(){
        pathModificationProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function (done) {
                var expectedPath = entry.expectedPath;
                var originalReq = entry.request;
                var method = entry.method;
                var expectedDefined = entry.expectedDefined;


                if(method !== undefined && expectedDefined){
                    method(originalReq);
                }else if(expectedDefined){
                    assert.fail('Method undefined for something we expect to be defined');
                }

                done();
            });
        });
    });
});