/**
 * A test to test the qbRouteMapper is properly modifying the url to route to a given tomcat api
 * Created by cschneider1 on 7/16/15.
 */

'use strict';


//var config = require('../../config/environment');
var groupMapper = require('../../src/routes/qbRouteGroupMapper');
var routeGroups = require('../../src/routes/routeGroups');
var routes = require('../../src/routes/routeConstants').routes;
var assert = require('assert');

/**
 * Unit tests for app generator
 */
describe('Group Route Mapper Unit Test', function() {

    function routeIsEnabledForGroupProvider() {
        return [
            //LIGHTHOUSE V1 ROUTE GROUP
            {message: 'LH_V1, ' + routes.APPS + ' GET', routeGroup: routeGroups.LH_V1, route: routes.APPS, method: 'get', expectedOutput: true},
            {message: 'LH_V1, ' + routes.APP_USERS + ' GET', routeGroup: routeGroups.LH_V1, route: routes.APP_USERS, method: 'get', expectedOutput: true},
            {message: 'LH_V1, ' + routes.FORM_COMPONENTS + ' GET', routeGroup: routeGroups.LH_V1, route: routes.FORM_COMPONENTS, method: 'get', expectedOutput: true},
            {message: 'LH_V1, ' + routes.FORM_AND_RECORD_COMPONENTS + ' GET', routeGroup: routeGroups.LH_V1, route: routes.FORM_AND_RECORD_COMPONENTS, method: 'get', expectedOutput: true},
            {message: 'LH_V1, ' + routes.RECORD + ' GET', routeGroup: routeGroups.LH_V1, route: routes.RECORD, method: 'get', expectedOutput: true},
            {message: 'LH_V1, ' + routes.RECORDS + ' GET', routeGroup: routeGroups.LH_V1, route: routes.RECORDS, method: 'get', expectedOutput: true},
            {message: 'LH_V1, ' + routes.RECORDS_BULK + ' GET', routeGroup: routeGroups.LH_V1, route: routes.RECORDS_BULK, method: 'get', expectedOutput: false},
            {message: 'LH_V1, ' + routes.REPORT_RESULTS + ' GET', routeGroup: routeGroups.LH_V1, route: routes.REPORT_RESULTS, method: 'get', expectedOutput: true},
            {message: 'LH_V1, ' + routes.REPORT_INVOKE_RESULTS + ' GET', routeGroup: routeGroups.LH_V1, route: routes.REPORT_INVOKE_RESULTS, method: 'get', expectedOutput: true},
            {message: 'LH_V1, ' + routes.REPORT_META + ' GET', routeGroup: routeGroups.LH_V1, route: routes.REPORT_META, method: 'get', expectedOutput: true},
            {message: 'LH_V1, ' + routes.REPORT_RECORDS_COUNT + ' GET', routeGroup: routeGroups.LH_V1, route: routes.REPORT_RECORDS_COUNT, method: 'get', expectedOutput: true},
            {message: 'LH_V1, ' + routes.TABLE_HOMEPAGE_REPORT + ' GET', routeGroup: routeGroups.LH_V1, route: routes.TABLE_HOMEPAGE_REPORT, method: 'get', expectedOutput: true},
            {message: 'LH_V1, ' + routes.CORE_ENGINE + ' GET', routeGroup: routeGroups.LH_V1, route: routes.CORE_ENGINE, method: 'get', expectedOutput: true},
            {message: 'LH_V1, ' + routes.EXPERIENCE_ENGINE + ' GET', routeGroup: routeGroups.LH_V1, route: routes.EXPERIENCE_ENGINE, method: 'get', expectedOutput: true},

            {message: 'LH_V1, ' + routes.APPS + ' POST', routeGroup: routeGroups.LH_V1, route: routes.APPS, method: 'post', expectedOutput: false},
            {message: 'LH_V1, ' + routes.APP_USERS + ' POST', routeGroup: routeGroups.LH_V1, route: routes.APP_USERS, method: 'post', expectedOutput: false},
            {message: 'LH_V1, ' + routes.FORM_COMPONENTS + ' POST', routeGroup: routeGroups.LH_V1, route: routes.FORM_COMPONENTS, method: 'post', expectedOutput: false},
            {message: 'LH_V1, ' + routes.FORM_AND_RECORD_COMPONENTS + ' POST', routeGroup: routeGroups.LH_V1, route: routes.FORM_AND_RECORD_COMPONENTS, method: 'post', expectedOutput: false},
            {message: 'LH_V1, ' + routes.RECORD + ' POST', routeGroup: routeGroups.LH_V1, route: routes.RECORD, method: 'post', expectedOutput: false},
            {message: 'LH_V1, ' + routes.RECORDS + ' POST', routeGroup: routeGroups.LH_V1, route: routes.RECORDS, method: 'post', expectedOutput: true},
            {message: 'LH_V1, ' + routes.RECORDS_BULK + ' POST', routeGroup: routeGroups.LH_V1, route: routes.RECORDS_BULK, method: 'post', expectedOutput: false},
            {message: 'LH_V1, ' + routes.REPORT_RESULTS + ' POST', routeGroup: routeGroups.LH_V1, route: routes.REPORT_RESULTS, method: 'post', expectedOutput: false},
            {message: 'LH_V1, ' + routes.REPORT_INVOKE_RESULTS + ' POST', routeGroup: routeGroups.LH_V1, route: routes.REPORT_INVOKE_RESULTS, method: 'post', expectedOutput: false},
            {message: 'LH_V1, ' + routes.REPORT_META + ' POST', routeGroup: routeGroups.LH_V1, route: routes.REPORT_META, method: 'post', expectedOutput: false},
            {message: 'LH_V1, ' + routes.REPORT_RECORDS_COUNT + ' POST', routeGroup: routeGroups.LH_V1, route: routes.REPORT_RECORDS_COUNT, method: 'post', expectedOutput: false},
            {message: 'LH_V1, ' + routes.TABLE_HOMEPAGE_REPORT + ' POST', routeGroup: routeGroups.LH_V1, route: routes.TABLE_HOMEPAGE_REPORT, method: 'post', expectedOutput: false},
            {message: 'LH_V1, ' + routes.CORE_ENGINE + ' POST', routeGroup: routeGroups.LH_V1, route: routes.CORE_ENGINE, method: 'post', expectedOutput: true},
            {message: 'LH_V1, ' + routes.EXPERIENCE_ENGINE + ' POST', routeGroup: routeGroups.LH_V1, route: routes.EXPERIENCE_ENGINE, method: 'post', expectedOutput: true},

            {message: 'LH_V1, ' + routes.APPS + ' DELETE', routeGroup: routeGroups.LH_V1, route: routes.APPS, method: 'delete', expectedOutput: false},
            {message: 'LH_V1, ' + routes.APP_USERS + ' DELETE', routeGroup: routeGroups.LH_V1, route: routes.APP_USERS, method: 'delete', expectedOutput: false},
            {message: 'LH_V1, ' + routes.FORM_COMPONENTS + ' DELETE', routeGroup: routeGroups.LH_V1, route: routes.FORM_COMPONENTS, method: 'delete', expectedOutput: false},
            {message: 'LH_V1, ' + routes.FORM_AND_RECORD_COMPONENTS + ' DELETE', routeGroup: routeGroups.LH_V1, route: routes.FORM_AND_RECORD_COMPONENTS, method: 'delete', expectedOutput: false},
            {message: 'LH_V1, ' + routes.RECORD + ' DELETE', routeGroup: routeGroups.LH_V1, route: routes.RECORD, method: 'delete', expectedOutput: true},
            {message: 'LH_V1, ' + routes.RECORDS + ' DELETE', routeGroup: routeGroups.LH_V1, route: routes.RECORDS, method: 'delete', expectedOutput: false},
            {message: 'LH_V1, ' + routes.RECORDS_BULK + ' DELETE', routeGroup: routeGroups.LH_V1, route: routes.RECORDS_BULK, method: 'delete', expectedOutput: true},
            {message: 'LH_V1, ' + routes.REPORT_RESULTS + ' DELETE', routeGroup: routeGroups.LH_V1, route: routes.REPORT_RESULTS, method: 'delete', expectedOutput: false},
            {message: 'LH_V1, ' + routes.REPORT_INVOKE_RESULTS + ' DELETE', routeGroup: routeGroups.LH_V1, route: routes.REPORT_INVOKE_RESULTS, method: 'delete', expectedOutput: false},
            {message: 'LH_V1, ' + routes.REPORT_META + ' DELETE', routeGroup: routeGroups.LH_V1, route: routes.REPORT_META, method: 'delete', expectedOutput: false},
            {message: 'LH_V1, ' + routes.REPORT_RECORDS_COUNT + ' DELETE', routeGroup: routeGroups.LH_V1, route: routes.REPORT_RECORDS_COUNT, method: 'delete', expectedOutput: false},
            {message: 'LH_V1, ' + routes.TABLE_HOMEPAGE_REPORT + ' DELETE', routeGroup: routeGroups.LH_V1, route: routes.TABLE_HOMEPAGE_REPORT, method: 'delete', expectedOutput: false},
            {message: 'LH_V1, ' + routes.CORE_ENGINE + ' DELETE', routeGroup: routeGroups.LH_V1, route: routes.CORE_ENGINE, method: 'delete', expectedOutput: true},
            {message: 'LH_V1, ' + routes.EXPERIENCE_ENGINE + ' DELETE', routeGroup: routeGroups.LH_V1, route: routes.EXPERIENCE_ENGINE, method: 'delete', expectedOutput: true},

            {message: 'LH_V1, ' + routes.APPS + ' PATCH', routeGroup: routeGroups.LH_V1, route: routes.APPS, method: 'patch', expectedOutput: false},
            {message: 'LH_V1, ' + routes.APP_USERS + ' PATCH', routeGroup: routeGroups.LH_V1, route: routes.APP_USERS, method: 'patch', expectedOutput: false},
            {message: 'LH_V1, ' + routes.FORM_COMPONENTS + ' PATCH', routeGroup: routeGroups.LH_V1, route: routes.FORM_COMPONENTS, method: 'patch', expectedOutput: false},
            {message: 'LH_V1, ' + routes.FORM_AND_RECORD_COMPONENTS + ' PATCH', routeGroup: routeGroups.LH_V1, route: routes.FORM_AND_RECORD_COMPONENTS, method: 'patch', expectedOutput: false},
            {message: 'LH_V1, ' + routes.RECORD + ' PATCH', routeGroup: routeGroups.LH_V1, route: routes.RECORD, method: 'patch', expectedOutput: true},
            {message: 'LH_V1, ' + routes.RECORDS + ' PATCH', routeGroup: routeGroups.LH_V1, route: routes.RECORDS, method: 'patch', expectedOutput: false},
            {message: 'LH_V1, ' + routes.RECORDS_BULK + ' PATCH', routeGroup: routeGroups.LH_V1, route: routes.RECORDS_BULK, method: 'patch', expectedOutput: false},
            {message: 'LH_V1, ' + routes.REPORT_RESULTS + ' PATCH', routeGroup: routeGroups.LH_V1, route: routes.REPORT_RESULTS, method: 'patch', expectedOutput: false},
            {message: 'LH_V1, ' + routes.REPORT_INVOKE_RESULTS + ' PATCH', routeGroup: routeGroups.LH_V1, route: routes.REPORT_INVOKE_RESULTS, method: 'patch', expectedOutput: false},
            {message: 'LH_V1, ' + routes.REPORT_META + ' PATCH', routeGroup: routeGroups.LH_V1, route: routes.REPORT_META, method: 'patch', expectedOutput: false},
            {message: 'LH_V1, ' + routes.REPORT_RECORDS_COUNT + ' PATCH', routeGroup: routeGroups.LH_V1, route: routes.REPORT_RECORDS_COUNT, method: 'patch', expectedOutput: false},
            {message: 'LH_V1, ' + routes.TABLE_HOMEPAGE_REPORT + ' PATCH', routeGroup: routeGroups.LH_V1, route: routes.TABLE_HOMEPAGE_REPORT, method: 'patch', expectedOutput: false},
            {message: 'LH_V1, ' + routes.CORE_ENGINE + ' PATCH', routeGroup: routeGroups.LH_V1, route: routes.CORE_ENGINE, method: 'patch', expectedOutput: true},
            {message: 'LH_V1, ' + routes.EXPERIENCE_ENGINE + ' PATCH', routeGroup: routeGroups.LH_V1, route: routes.EXPERIENCE_ENGINE, method: 'patch', expectedOutput: true},

            {message: 'LH_V1, ' + routes.APPS + ' PUT', routeGroup: routeGroups.LH_V1, route: routes.APPS, method: 'put', expectedOutput: false},
            {message: 'LH_V1, ' + routes.APP_USERS + ' PUT', routeGroup: routeGroups.LH_V1, route: routes.APP_USERS, method: 'put', expectedOutput: false},
            {message: 'LH_V1, ' + routes.FORM_COMPONENTS + ' PUT', routeGroup: routeGroups.LH_V1, route: routes.FORM_COMPONENTS, method: 'put', expectedOutput: false},
            {message: 'LH_V1, ' + routes.FORM_AND_RECORD_COMPONENTS + ' PUT', routeGroup: routeGroups.LH_V1, route: routes.FORM_AND_RECORD_COMPONENTS, method: 'put', expectedOutput: false},
            {message: 'LH_V1, ' + routes.RECORD + ' PUT', routeGroup: routeGroups.LH_V1, route: routes.RECORD, method: 'put', expectedOutput: false},
            {message: 'LH_V1, ' + routes.RECORDS + ' PUT', routeGroup: routeGroups.LH_V1, route: routes.RECORDS, method: 'put', expectedOutput: false},
            {message: 'LH_V1, ' + routes.RECORDS_BULK + ' PUT', routeGroup: routeGroups.LH_V1, route: routes.RECORDS_BULK, method: 'put', expectedOutput: false},
            {message: 'LH_V1, ' + routes.REPORT_RESULTS + ' PUT', routeGroup: routeGroups.LH_V1, route: routes.REPORT_RESULTS, method: 'put', expectedOutput: false},
            {message: 'LH_V1, ' + routes.REPORT_INVOKE_RESULTS + ' PUT', routeGroup: routeGroups.LH_V1, route: routes.REPORT_INVOKE_RESULTS, method: 'put', expectedOutput: false},
            {message: 'LH_V1, ' + routes.REPORT_META + ' PUT', routeGroup: routeGroups.LH_V1, route: routes.REPORT_META, method: 'put', expectedOutput: false},
            {message: 'LH_V1, ' + routes.REPORT_RECORDS_COUNT + ' PUT', routeGroup: routeGroups.LH_V1, route: routes.REPORT_RECORDS_COUNT, method: 'put', expectedOutput: false},
            {message: 'LH_V1, ' + routes.TABLE_HOMEPAGE_REPORT + ' PUT', routeGroup: routeGroups.LH_V1, route: routes.TABLE_HOMEPAGE_REPORT, method: 'put', expectedOutput: false},
            {message: 'LH_V1, ' + routes.CORE_ENGINE + ' PUT', routeGroup: routeGroups.LH_V1, route: routes.CORE_ENGINE, method: 'put', expectedOutput: false},
            {message: 'LH_V1, ' + routes.EXPERIENCE_ENGINE + ' PUT', routeGroup: routeGroups.LH_V1, route: routes.EXPERIENCE_ENGINE, method: 'put', expectedOutput: true},
            //DEBUG
            {message: 'DEBUG, ' + routes.APPS + ' GET', routeGroup: routeGroups.DEBUG, route: routes.APPS, method: 'get', expectedOutput: true},
            {message: 'DEBUG, ' + routes.APP_USERS + ' GET', routeGroup: routeGroups.DEBUG, route: routes.APP_USERS, method: 'get', expectedOutput: true},
            {message: 'DEBUG, ' + routes.RECORD + ' GET', routeGroup: routeGroups.DEBUG, route: routes.RECORD, method: 'get', expectedOutput: true},
            {message: 'DEBUG, ' + routes.RECORDS + ' GET', routeGroup: routeGroups.DEBUG, route: routes.RECORDS, method: 'get', expectedOutput: true},
            {message: 'DEBUG, ' + routes.RECORDS_BULK + ' GET', routeGroup: routeGroups.DEBUG, route: routes.RECORDS_BULK, method: 'get', expectedOutput: true},
            {message: 'DEBUG, ' + routes.REPORT_RESULTS + ' GET', routeGroup: routeGroups.DEBUG, route: routes.REPORT_RESULTS, method: 'get', expectedOutput: true},
            {message: 'DEBUG, ' + routes.REPORT_META + ' GET', routeGroup: routeGroups.DEBUG, route: routes.REPORT_META, method: 'get', expectedOutput: true},
            {message: 'DEBUG, ' + routes.APP_USERS + ' POST', routeGroup: routeGroups.DEBUG, route: routes.APP_USERS, method: 'post', expectedOutput: false},
            {message: 'DEBUG, ' + routes.APPS + ' POST', routeGroup: routeGroups.DEBUG, route: routes.APPS, method: 'post', expectedOutput: false},
            {message: 'DEBUG, ' + routes.RECORD + ' POST', routeGroup: routeGroups.DEBUG, route: routes.RECORD, method: 'post', expectedOutput: true},
            {message: 'DEBUG, ' + routes.RECORDS + ' POST', routeGroup: routeGroups.DEBUG, route: routes.RECORDS, method: 'post', expectedOutput: true},
            {message: 'DEBUG, ' + routes.RECORDS_BULK + ' POST', routeGroup: routeGroups.DEBUG, route: routes.RECORDS_BULK, method: 'post', expectedOutput: true},
            {message: 'DEBUG, ' + routes.REPORT_RESULTS + ' POST', routeGroup: routeGroups.DEBUG, route: routes.REPORT_RESULTS, method: 'post', expectedOutput: true},
            {message: 'DEBUG, ' + routes.REPORT_INVOKE_RESULTS + ' POST', routeGroup: routeGroups.DEBUG, route: routes.REPORT_INVOKE_RESULTS, method: 'post', expectedOutput: true},
            {message: 'DEBUG, ' + routes.REPORT_META + ' POST', routeGroup: routeGroups.DEBUG, route: routes.REPORT_META, method: 'post', expectedOutput: true},
            {message: 'DEBUG, ' + routes.APPS + ' DELETE', routeGroup: routeGroups.DEBUG, route: routes.APPS, method: 'delete', expectedOutput: false},
            {message: 'DEBUG, ' + routes.APP_USERS + ' DELETE', routeGroup: routeGroups.DEBUG, route: routes.APP_USERS, method: 'delete', expectedOutput: false},
            {message: 'DEBUG, ' + routes.RECORD + ' DELETE', routeGroup: routeGroups.DEBUG, route: routes.RECORD, method: 'delete', expectedOutput: true},
            {message: 'DEBUG, ' + routes.RECORDS + ' DELETE', routeGroup: routeGroups.DEBUG, route: routes.RECORDS, method: 'delete', expectedOutput: true},
            {message: 'DEBUG, ' + routes.RECORDS_BULK + ' DELETE', routeGroup: routeGroups.DEBUG, route: routes.RECORDS_BULK, method: 'delete', expectedOutput: true},
            {message: 'DEBUG, ' + routes.REPORT_RESULTS + ' DELETE', routeGroup: routeGroups.DEBUG, route: routes.REPORT_RESULTS, method: 'delete', expectedOutput: true},
            {message: 'DEBUG, ' + routes.REPORT_META + ' DELETE', routeGroup: routeGroups.DEBUG, route: routes.REPORT_META, method: 'delete', expectedOutput: true},
            {message: 'DEBUG, ' + routes.APPS + ' PATCH', routeGroup: routeGroups.DEBUG, route: routes.APPS, method: 'patch', expectedOutput: false},
            {message: 'DEBUG, ' + routes.APP_USERS + ' PATCH', routeGroup: routeGroups.DEBUG, route: routes.APP_USERS, method: 'patch', expectedOutput: false},
            {message: 'DEBUG, ' + routes.RECORD + ' PATCH', routeGroup: routeGroups.DEBUG, route: routes.RECORD, method: 'patch', expectedOutput: true},
            {message: 'DEBUG, ' + routes.RECORDS + ' PATCH', routeGroup: routeGroups.DEBUG, route: routes.RECORDS, method: 'patch', expectedOutput: true},
            {message: 'DEBUG, ' + routes.RECORDS_BULK + ' PATCH', routeGroup: routeGroups.DEBUG, route: routes.RECORDS_BULK, method: 'patch', expectedOutput: true},
            {message: 'DEBUG, ' + routes.REPORT_RESULTS + ' PATCH', routeGroup: routeGroups.DEBUG, route: routes.REPORT_RESULTS, method: 'patch', expectedOutput: true},
            {message: 'DEBUG, ' + routes.REPORT_META + ' PATCH', routeGroup: routeGroups.DEBUG, route: routes.REPORT_META, method: 'patch', expectedOutput: true},
            {message: 'DEBUG, ' + routes.APPS + ' PUT', routeGroup: routeGroups.DEBUG, route: routes.APPS, method: 'put', expectedOutput: false},
            {message: 'DEBUG, ' + routes.APP_USERS + ' PUT', routeGroup: routeGroups.DEBUG, route: routes.APP_USERS, method: 'put', expectedOutput: false},
            {message: 'DEBUG, ' + routes.RECORD + ' PUT', routeGroup: routeGroups.DEBUG, route: routes.RECORD, method: 'put', expectedOutput: true},
            {message: 'DEBUG, ' + routes.RECORDS + ' PUT', routeGroup: routeGroups.DEBUG, route: routes.RECORDS, method: 'put', expectedOutput: true},
            {message: 'DEBUG, ' + routes.RECORDS_BULK + ' PUT', routeGroup: routeGroups.DEBUG, route: routes.RECORDS_BULK, method: 'put', expectedOutput: true},
            {message: 'DEBUG, ' + routes.REPORT_RESULTS + ' PUT', routeGroup: routeGroups.DEBUG, route: routes.REPORT_RESULTS, method: 'put', expectedOutput: true},
            {message: 'DEBUG, ' + routes.REPORT_META + ' PUT', routeGroup: routeGroups.DEBUG, route: routes.REPORT_META, method: 'put', expectedOutput: true}
        ];
    }

    /**
     * Unit test that validates generating an app with a specified number of tables
     */
    describe('test that we are properly enabling routes for a given route group', function() {
        routeIsEnabledForGroupProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function(done) {
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
