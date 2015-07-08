/**
 * A test to test the qbRouteMapper is properly modifying the url to route to a given tomcat api
 * Created by cschneider1 on 7/16/15.
 */

'use strict';


var config = require('../../config/environment'),
    groupMapper = require('../qbRouteGroupMapper'),
    routeGroups = require('../routeGroups'),
    should = require('should'),
    routeConsts = require('../routeConstants'),
    assert = require('assert'),
    _ = require('lodash');

/**
 * Unit tests for app generator
 */
describe('Group Route Mapper Unit Test', function () {

    function routeIsEnabledForGroupProvider(){

        return [
            //LIGHTHOUSE V1 ROUTE GROUP
            {message: 'LH_V1, '+ routeConsts.RECORD + ' GET', routeGroup: routeGroups.LH_V1,  route: routeConsts.RECORD, method: 'get', expectedOutput: true},
            {message: 'LH_V1, '+ routeConsts.RECORDS + ' GET', routeGroup: routeGroups.LH_V1, route: routeConsts.RECORDS, method: 'get', expectedOutput: true},
            {message: 'LH_V1, '+ routeConsts.REPORT_RESULTS + ' GET', routeGroup: routeGroups.LH_V1, route: routeConsts.REPORT_RESULTS, method: 'get', expectedOutput: true},
            {message: 'LH_V1, '+ routeConsts.SWAGGER_API + ' GET', routeGroup: routeGroups.LH_V1, route: routeConsts.SWAGGER_API, method: 'get', expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.SWAGGER_RESOURCES + ' GET', routeGroup: routeGroups.LH_V1, route: routeConsts.SWAGGER_RESOURCES, method: 'get', expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.SWAGGER_IMAGES + ' GET', routeGroup: routeGroups.LH_V1, route: routeConsts.SWAGGER_IMAGES, method: 'get', expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.SWAGGER_DOCUMENTATION + ' GET', routeGroup: routeGroups.LH_V1, route: routeConsts.SWAGGER_DOCUMENTATION, method: 'get', expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.TOMCAT_ALL + ' GET', routeGroup: routeGroups.LH_V1, route: routeConsts.TOMCAT_ALL, method: 'get', expectedOutput: true},
            {message: 'LH_V1, '+ routeConsts.RECORD + ' POST', routeGroup: routeGroups.LH_V1,  route: routeConsts.RECORD, method: 'post', expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.RECORDS + ' POST', routeGroup: routeGroups.LH_V1, route: routeConsts.RECORDS, method: 'post', expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.REPORT_RESULTS + ' POST', routeGroup: routeGroups.LH_V1, route: routeConsts.REPORT_RESULTS, method: 'post', expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.SWAGGER_API + ' POST', routeGroup: routeGroups.LH_V1, route: routeConsts.SWAGGER_API, method: 'post', expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.SWAGGER_RESOURCES + ' POST', routeGroup: routeGroups.LH_V1, route: routeConsts.SWAGGER_RESOURCES, method: 'post', expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.SWAGGER_IMAGES + ' POST', routeGroup: routeGroups.LH_V1, route: routeConsts.SWAGGER_IMAGES, method: 'post', expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.SWAGGER_DOCUMENTATION + ' POST', routeGroup: routeGroups.LH_V1, route: routeConsts.SWAGGER_DOCUMENTATION, method: 'post', expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.TOMCAT_ALL + ' POST', routeGroup: routeGroups.LH_V1, route: routeConsts.TOMCAT_ALL, method: 'post', expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.RECORD + ' DELETE', routeGroup: routeGroups.LH_V1,  route: routeConsts.RECORD, method: 'delete', expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.RECORDS + ' DELETE', routeGroup: routeGroups.LH_V1, route: routeConsts.RECORDS, method: 'delete', expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.REPORT_RESULTS + ' DELETE', routeGroup: routeGroups.LH_V1, route: routeConsts.REPORT_RESULTS, method: 'delete', expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.SWAGGER_API + ' DELETE', routeGroup: routeGroups.LH_V1, route: routeConsts.SWAGGER_API, method: 'delete', expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.SWAGGER_RESOURCES + ' DELETE', routeGroup: routeGroups.LH_V1, route: routeConsts.SWAGGER_RESOURCES, method: 'delete', expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.SWAGGER_IMAGES + ' DELETE', routeGroup: routeGroups.LH_V1, route: routeConsts.SWAGGER_IMAGES, method: 'delete', expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.SWAGGER_DOCUMENTATION + ' DELETE', routeGroup: routeGroups.LH_V1, route: routeConsts.SWAGGER_DOCUMENTATION, method: 'delete', expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.TOMCAT_ALL + ' DELETE', routeGroup: routeGroups.LH_V1, route: routeConsts.TOMCAT_ALL, method: 'delete', expectedOutput: false},

            //DEBUG
            {message: 'DEBUG, '+ routeConsts.RECORD + ' GET', routeGroup: routeGroups.DEBUG, route: routeConsts.RECORD, method: 'get', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.RECORDS + ' GET', routeGroup: routeGroups.DEBUG, route: routeConsts.RECORDS, method: 'get', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.REPORT_RESULTS + ' GET', routeGroup: routeGroups.DEBUG, route: routeConsts.REPORT_RESULTS, method: 'get', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.SWAGGER_API + ' GET', routeGroup: routeGroups.DEBUG, route: routeConsts.SWAGGER_API, method: 'get', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.SWAGGER_RESOURCES + ' GET', routeGroup: routeGroups.DEBUG, route: routeConsts.SWAGGER_RESOURCES, method: 'get', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.SWAGGER_IMAGES + ' GET', routeGroup: routeGroups.DEBUG, route: routeConsts.SWAGGER_IMAGES, method: 'get', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.SWAGGER_DOCUMENTATION + ' GET', routeGroup: routeGroups.DEBUG, route: routeConsts.SWAGGER_DOCUMENTATION, method: 'get', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.TOMCAT_ALL + ' GET', routeGroup: routeGroups.DEBUG, route: routeConsts.TOMCAT_ALL, method: 'get', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.RECORD + ' POST', routeGroup: routeGroups.DEBUG, route: routeConsts.RECORD, method: 'post', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.RECORDS + ' POST', routeGroup: routeGroups.DEBUG, route: routeConsts.RECORDS, method: 'post', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.REPORT_RESULTS + ' POST', routeGroup: routeGroups.DEBUG, route: routeConsts.REPORT_RESULTS, method: 'post', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.SWAGGER_API + ' POST', routeGroup: routeGroups.DEBUG, route: routeConsts.SWAGGER_API, method: 'post', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.SWAGGER_RESOURCES + ' POST', routeGroup: routeGroups.DEBUG, route: routeConsts.SWAGGER_RESOURCES, method: 'post', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.SWAGGER_IMAGES + ' POST', routeGroup: routeGroups.DEBUG, route: routeConsts.SWAGGER_IMAGES, method: 'post', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.SWAGGER_DOCUMENTATION + ' POST', routeGroup: routeGroups.DEBUG, route: routeConsts.SWAGGER_DOCUMENTATION, method: 'post', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.TOMCAT_ALL + ' POST', routeGroup: routeGroups.DEBUG, route: routeConsts.TOMCAT_ALL, method: 'post', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.RECORD + ' DELETE', routeGroup: routeGroups.DEBUG, route: routeConsts.RECORD, method: 'delete', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.RECORDS + ' DELETE', routeGroup: routeGroups.DEBUG, route: routeConsts.RECORDS, method: 'delete', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.REPORT_RESULTS + ' DELETE', routeGroup: routeGroups.DEBUG, route: routeConsts.REPORT_RESULTS, method: 'delete', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.SWAGGER_API + ' DELETE', routeGroup: routeGroups.DEBUG, route: routeConsts.SWAGGER_API, method: 'delete', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.SWAGGER_RESOURCES + ' DELETE', routeGroup: routeGroups.DEBUG, route: routeConsts.SWAGGER_RESOURCES, method: 'delete', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.SWAGGER_IMAGES + ' DELETE', routeGroup: routeGroups.DEBUG, route: routeConsts.SWAGGER_IMAGES, method: 'delete', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.SWAGGER_DOCUMENTATION + ' DELETE', routeGroup: routeGroups.DEBUG, route: routeConsts.SWAGGER_DOCUMENTATION, method: 'delete', expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.TOMCAT_ALL + ' DELETE', routeGroup: routeGroups.DEBUG, route: routeConsts.TOMCAT_ALL, method: 'delete', expectedOutput: true}
        ];
    }

    /**
     * Unit test that validates generating an app with a specified number of tables
     */
    describe('test that we are properly enabling routes for a given route group',function(){
        routeIsEnabledForGroupProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function (done) {
                var route = entry.route;
                var routeGroup = entry.routeGroup;
                var expectedOutput = entry.expectedOutput;
                var method = entry.method;

                var isEnabled = groupMapper.routeIsEnabled(routeGroup, route, method);
                assert.equal(isEnabled, expectedOutput, 'Found unexpected route enabled or disabled.');
                done();
            });
        });
    });
});