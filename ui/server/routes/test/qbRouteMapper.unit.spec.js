/**
 * A test to test the qbRouteMapper is properly modifying the url to route to a given tomcat api
 * Created by cschneider1 on 7/16/15.
 */

'use strict';


var config = require('../../config/environment'),
groupMapper = require('../qbRouteGroupMapper'),
routeMapper = require('../qbRouteMapper')(config, groupMapper),
should = require('should'),
routeConsts = require('../routeConstants'),
assert = require('assert'),
_ = require('lodash'),
sinon = require('sinon'),
recordsApi = require('../../api/quickbase/recordsApi')(config),
requestStub;

/**
 * Unit tests for app generator
 */
describe('Qb Route Mapper Unit Test', function () {

    before(function() {

        requestStub = sinon.stub();
        recordsApi.setRequestObject(requestStub);
        routeMapper.setRecordsApi(recordsApi);
    });

    function pathModificationProvider(){

        return [
            {message: "GET request to record endpoint", request : '/api/v1/apps/fakeApp/tables/fakeTable/records/1', expectedPath : '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1', route: routeConsts.RECORD, method: routeMapper.fetchGetFunctionForRoute(routeConsts.RECORD), expectedDefined: true, httpVerb: 'GET'},
            {message: "GET request to records endpoint", request : '/api/v1/apps/fakeApp/tables/fakeTable/records', expectedPath : '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routeConsts.RECORDS,method: routeMapper.fetchGetFunctionForRoute(routeConsts.RECORDS), expectedDefined: true, httpVerb: 'GET'},
            {message: "GET request to report endpoint", request : '/api/v1/apps/fakeApp/tables/fakeTable/reports/2', expectedPath : '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2', route: routeConsts.REPORT_RESULTS,method: routeMapper.fetchGetFunctionForRoute(routeConsts.REPORT_RESULTS), expectedDefined: true, httpVerb: 'GET'},
            {message: "GET request to health via tomcat all", request: '/api/v1/health', expectedPath : '/api/api/v1/health', route: routeConsts.TOMCAT_ALL, method: routeMapper.fetchAllFunctionForRoute(routeConsts.TOMCAT_ALL), expectedDefined: true, httpVerb: 'GET'},
            {message: "POST request to record endpoint", request: '/api/v1/apps/fakeApp/tables/fakeTable/records', expectedPath : '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routeConsts.RECORD, method: routeMapper.fetchPostFunctionForRoute(routeConsts.RECORD), expectedDefined: false, httpVerb: 'GET'},
            {message: "POST request to records endpoint", request: '/api/v1/apps/fakeApp/tables/fakeTable/records', expectedPath : '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routeConsts.RECORDS, method: routeMapper.fetchPostFunctionForRoute(routeConsts.RECORDS), expectedDefined: false, httpVerb: 'GET'},
            {message: "POST request to report endpoint", request: '/api/v1/apps/fakeApp/tables/fakeTable/reports', expectedPath : '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routeConsts.REPORT_RESULTS, method: routeMapper.fetchPostFunctionForRoute(routeConsts.REPORT_RESULTS), expectedDefined: false, httpVerb: 'GET'},
            {message: "DELETE request to record endpoint", request: '/api/v1/apps/fakeApp/tables/fakeTable/records/1', expectedPath : '/api/api/v1/apps/fakeApp/tables/fakeTable/records/1', route: routeConsts.RECORD, method: routeMapper.fetchDeleteFunctionForRoute(routeConsts.RECORD), expectedDefined: false, httpVerb: 'GET'},
            {message: "DELETE request to records endpoint", request: '/api/v1/apps/fakeApp/tables/fakeTable/records', expectedPath : '/api/api/v1/apps/fakeApp/tables/fakeTable/records', route: routeConsts.RECORDS, method: routeMapper.fetchDeleteFunctionForRoute(routeConsts.RECORDS), expectedDefined: false, httpVerb: 'GET'},
            {message: "DELETE request to report endpoint", request: '/api/v1/apps/fakeApp/tables/fakeTable/reports/1', expectedPath : '/api/api/v1/apps/fakeApp/tables/fakeTable/reports/2', route: routeConsts.REPORT_RESULTS, method: routeMapper.fetchDeleteFunctionForRoute(routeConsts.REPORT_RESULTS), expectedDefined: false, httpVerb: 'GET'},
        ];
    }

    /**
     * Unit test that validates generating an app with a specified number of tables
     */
    describe('test modify path for request',function(){
        pathModificationProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function (done) {
                var expectedPath = entry.expectedPath;

                //mock out the request and response objects with some utility methods they need in this flow
                var originalReq = {
                    param : function(fake){}
                };

                originalReq['method'] =
                originalReq['url'] = entry.request;
                originalReq['route'] = {path: entry.route};
                originalReq['headers'] = {};
                var res = {
                    status : function(fake){
                        return {
                            send : function(fake){}
                        }
                    }
                };

                var method = entry.method;
                var expectedDefined = entry.expectedDefined;

                requestStub.yields(null, {statusCode: 200}, {login: "cleo"});

                if (expectedDefined) {
                    if(method === undefined) {
                        assert.fail();
                    }else {
                        try {
                            method(originalReq, res);
                        }catch(error){
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