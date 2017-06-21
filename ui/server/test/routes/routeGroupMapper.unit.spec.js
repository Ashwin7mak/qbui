/**
 * A test to test the qbRouteMapper is properly modifying the url to route to a given tomcat api
 * Created by cschneider1 on 7/16/15.
 */

'use strict';

let groupMapper = require('../../src/routes/qbRouteGroupMapper');
let routeGroups = require('../../src/routes/routeGroups');
let assert = require('assert');

let routeConstants = require('../../src/routes/routeConstants');
let routes = routeConstants.routes;
let publicRoutes = routeConstants.publicEndPoints;

/**
 * Unit tests for app generator
 */
describe('Group Route Mapper Unit Test', function() {

    //  test method routes
    function routeIsEnabledForGroupProvider() {
        let testRoutes = [];

        //  for each route, define the request methods supported
        testRoutes.push({message:'LH_V1: ' + routes.APPS, routeGroup:routeGroups.LH_V1, route:routes.APPS, DELETE:false, GET:true, POST:true, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.APP_USERS, routeGroup:routeGroups.LH_V1, route:routes.APP_USERS, DELETE:false, GET:true, POST:false, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.APP_ROLES, routeGroup:routeGroups.LH_V1, route:routes.APP_ROLES, DELETE:false, GET:true, POST:false, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.FEATURE_OVERRIDE, routeGroup:routeGroups.LH_V1, route:routes.FEATURE_OVERRIDE, DELETE:false, GET:false, POST:false, PUT:true, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.FEATURE_OVERRIDES, routeGroup:routeGroups.LH_V1, route:routes.FEATURE_OVERRIDES, DELETE:false, GET:false, POST:true, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.FEATURE_OVERRIDES_BULK, routeGroup:routeGroups.LH_V1, route:routes.FEATURE_OVERRIDES_BULK, DELETE:false, GET:false, POST:true, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.FEATURE_STATES, routeGroup:routeGroups.LH_V1, route:routes.FEATURE_STATES, DELETE:false, GET:true, POST:false, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.FEATURE_SWITCH, routeGroup:routeGroups.LH_V1, route:routes.FEATURE_SWITCH, DELETE:false, GET:false, POST:false, PUT:true, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.FEATURE_SWITCHES, routeGroup:routeGroups.LH_V1, route:routes.FEATURE_SWITCHES, DELETE:false, GET:true, POST:true, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.FEATURE_SWITCHES_BULK, routeGroup:routeGroups.LH_V1, route:routes.FEATURE_SWITCHES_BULK, DELETE:false, GET:false, POST:true, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.FORM_COMPONENTS, routeGroup:routeGroups.LH_V1, route:routes.FORM_COMPONENTS, DELETE:false, GET:true, POST:false, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.FORM_AND_RECORD_COMPONENTS, routeGroup:routeGroups.LH_V1, route:routes.FORM_AND_RECORD_COMPONENTS, DELETE:false, GET:true, POST:false, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.RECORD, routeGroup:routeGroups.LH_V1, route:routes.RECORD, DELETE:true, GET:true, POST:false, PUT:false, PATCH:true});
        testRoutes.push({message:'LH_V1: ' + routes.RECORDS, routeGroup:routeGroups.LH_V1, route:routes.RECORDS, DELETE:false, GET:true, POST:true, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.REPORT_META, routeGroup:routeGroups.LH_V1, route:routes.REPORT_META, DELETE:false, GET:true, POST:false, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.REPORT_RESULTS, routeGroup:routeGroups.LH_V1, route:routes.REPORT_RESULTS, DELETE:false, GET:true, POST:false, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.REPORT_INVOKE_RESULTS, routeGroup:routeGroups.LH_V1, route:routes.REPORT_INVOKE_RESULTS, DELETE:false, GET:true, POST:false, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.REPORT_RECORDS_COUNT, routeGroup:routeGroups.LH_V1, route:routes.REPORT_RECORDS_COUNT, DELETE:false, GET:true, POST:false, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.FACET_EXPRESSION_PARSE, routeGroup:routeGroups.LH_V1, route:routes.FACET_EXPRESSION_PARSE, DELETE:false, GET:true, POST:false, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.TABLE, routeGroup:routeGroups.LH_V1, route:routes.TABLE, DELETE:true, GET:false, POST:false, PUT:false, PATCH:true});
        testRoutes.push({message:'LH_V1: ' + routes.TABLE_COMPONENTS, routeGroup:routeGroups.LH_V1, route:routes.TABLE_COMPONENTS, DELETE:false, GET:false, POST:true, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.TABLE_HOMEPAGE_REPORT, routeGroup:routeGroups.LH_V1, route:routes.TABLE_HOMEPAGE_REPORT, DELETE:false, GET:true, POST:false, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.REQ_USER, routeGroup:routeGroups.LH_V1, route:routes.REQ_USER, DELETE:false, GET:true, POST:false, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.QBUI_HEALTH, routeGroup:routeGroups.LH_V1, route:routes.QBUI_HEALTH, DELETE:false, GET:true, POST:false, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.GOVERNANCE_ACCOUNT_USERS, routeGroup:routeGroups.LH_V1, route:routes.GOVERNANCE_ACCOUNT_USERS, DELETE:false, GET:true, POST:false, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.GOVERNANCE_CONTEXT, routeGroup:routeGroups.LH_V1, route:routes.GOVERNANCE_CONTEXT, DELETE:false, GET:true, POST:false, PUT:false, PATCH:false});

        testRoutes.push({message:'LH_V1: ' + routes.SWAGGER_CORE, routeGroup:routeGroups.LH_V1, route:routes.SWAGGER_CORE, DELETE:false, GET:true, POST:false, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.SWAGGER_EE, routeGroup:routeGroups.LH_V1, route:routes.SWAGGER_EE, DELETE:false, GET:true, POST:false, PUT:false, PATCH:false});
        testRoutes.push({message:'LH_V1: ' + routes.SWAGGER_WE, routeGroup:routeGroups.LH_V1, route:routes.SWAGGER_WE, DELETE:false, GET:true, POST:false, PUT:false, PATCH:false});

        testRoutes.push({message:'LH_V1: ' + routes.CORE_ENGINE, routeGroup:routeGroups.LH_V1, route:routes.CORE_ENGINE, DELETE:true, GET:true, POST:true, PUT:true, PATCH:true});
        testRoutes.push({message:'LH_V1: ' + routes.EXPERIENCE_ENGINE, routeGroup:routeGroups.LH_V1, route:routes.EXPERIENCE_ENGINE, DELETE:true, GET:true, POST:true, PUT:true, PATCH:true});
        testRoutes.push({message:'LH_V1: ' + routes.WORKFLOW_ENGINE, routeGroup:routeGroups.LH_V1, route:routes.WORKFLOW_ENGINE, DELETE:true, GET:true, POST:true, PUT:true, PATCH:true});
        testRoutes.push({message:'LH_V1: ' + routes.AUTOMATION_ENGINE, routeGroup:routeGroups.LH_V1, route:routes.AUTOMATION_ENGINE, DELETE:true, GET:true, POST:true, PUT:true, PATCH:true});

        //  public endpoints
        publicRoutes.forEach(publicRoute => {
            testRoutes.push({message:'LH_V1: ' + publicRoute.route, routeGroup:routeGroups.LH_V1, route:publicRoute.route, DELETE:true, GET:true, POST:true, PUT:true, PATCH:true});
        });

        return testRoutes;
    }

    /**
     * Unit test that validates generating an app with a specified number of tables
     */
    describe('test that we are properly enabling routes for a given route group', function() {
        routeIsEnabledForGroupProvider().forEach(function(entry) {
            it(entry.message, function(done) {
                let route = entry.route;
                let routeGroup = entry.routeGroup;
                let methods = ['DELETE', 'GET', 'PATCH', 'POST', 'PUT'];

                methods.forEach(testMethod => {
                    let isEnabled = groupMapper.routeIsEnabled(routeGroup, route, testMethod);
                    assert.equal(isEnabled, entry[testMethod], 'Expected route to be configured as ' + isEnabled + ' for method: ' + testMethod);
                });
                done();
            });
        });
    });
});
