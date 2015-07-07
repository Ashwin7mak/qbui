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
            {message: 'LH_V1, '+ routeConsts.RECORD, routeGroup: routeGroups.LH_V1,  route: routeConsts.RECORD, expectedOutput: true},
            {message: 'LH_V1, '+ routeConsts.RECORDS, routeGroup: routeGroups.LH_V1, route: routeConsts.RECORDS, expectedOutput: true},
            {message: 'LH_V1, '+ routeConsts.REPORT_RESULTS, routeGroup: routeGroups.LH_V1, route: routeConsts.REPORT_RESULTS, expectedOutput: true},
            {message: 'LH_V1, '+ routeConsts.SWAGGER_API, routeGroup: routeGroups.LH_V1, route: routeConsts.SWAGGER_API, expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.SWAGGER_RESOURCES, routeGroup: routeGroups.LH_V1, route: routeConsts.SWAGGER_RESOURCES, expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.SWAGGER_IMAGES, routeGroup: routeGroups.LH_V1, route: routeConsts.SWAGGER_IMAGES, expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.SWAGGER_DOCUMENTATION, routeGroup: routeGroups.LH_V1, route: routeConsts.SWAGGER_DOCUMENTATION, expectedOutput: false},
            {message: 'LH_V1, '+ routeConsts.TOMCAT_ALL, routeGroup: routeGroups.LH_V1, route: routeConsts.TOMCAT_ALL, expectedOutput: false},

            //DEBUG
            {message: 'DEBUG, '+ routeConsts.RECORD, routeGroup: routeGroups.DEBUG, route: routeConsts.RECORD, expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.RECORDS, routeGroup: routeGroups.DEBUG, route: routeConsts.RECORDS, expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.REPORT_RESULTS, routeGroup: routeGroups.DEBUG, route: routeConsts.REPORT_RESULTS, expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.SWAGGER_API, routeGroup: routeGroups.DEBUG, route: routeConsts.SWAGGER_API, expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.SWAGGER_RESOURCES, routeGroup: routeGroups.DEBUG, route: routeConsts.SWAGGER_RESOURCES, expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.SWAGGER_IMAGES, routeGroup: routeGroups.DEBUG, route: routeConsts.SWAGGER_IMAGES, expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.SWAGGER_DOCUMENTATION, routeGroup: routeGroups.DEBUG, route: routeConsts.SWAGGER_DOCUMENTATION, expectedOutput: true},
            {message: 'DEBUG, '+ routeConsts.TOMCAT_ALL, routeGroup: routeGroups.DEBUG, route: routeConsts.TOMCAT_ALL, expectedOutput: true}
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

                var isEnabled = groupMapper.routeIsEnabled(routeGroup, route);
                assert.equal(isEnabled, expectedOutput, 'Found unexpected route enabled or disabled.');
                done();
            });
        });
    });
});