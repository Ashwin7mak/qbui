/**
 * A test to test our test generation code
 * Created by cschneider1 on 6/1/15.
 */
'use strict';

var should = require('should');
var relationshipGenerator = require('../relationship.generator');
var relationshipConsts = require('../relationship.constants');
var consts = require('../../server/api/constants');
var appGenerator = require('../app.generator');
var _ = require('lodash');
var assert = require('assert');

/**
 * Unit tests for relationship generator
 */
describe('User generator unit test', function () {

    function relationshipProvider(){
        var tableMap = {};
        tableMap['App1Table1'] = {};
        tableMap['App1Table2'] = {};
        tableMap['App1Table3'] = {};
        tableMap['App1Table4'] = {};

        tableMap['App1Table1']['textField1'] = consts.TEXT;
        tableMap['App1Table1']['numericField1'] = consts.NUMERIC;
        tableMap['App1Table1']['dateField1'] = consts.DATE;

        tableMap['Table2']['dateField2'] = consts.DATE;

        tableMap['Table3']['numericField3'] = consts.NUMERIC;

        tableMap['Table4']['numericField3'] = consts.TEXT;

        appGenerator.generateAppWithTablesFromMap();
        return [
            {message: "Generate a relationship on App1->Table1->dateField1", userOptions : {firstName: 'Cleo'}, expectedKeyValue: { firstName: 'Cleo'}},
            {message: "Generate user override last name", userOptions : {lastName: 'Schneider'}, expectedKeyValue: { lastName: 'Schneider'}},
            {message: "Generate user override screen name", userOptions : {screenName: 'cschneider'}, expectedKeyValue: { screenName: 'cschneider'}},
            {message: "Generate user override email", userOptions : {email: 'cleo_schneider@intuit.com'}, expectedKeyValue: { email: 'cleo_schneider@intuit.com'}},
            {message: "Generate user override deactivated", userOptions : {deactivated: true}, expectedKeyValue: { deactivated: true}},
            {message: "Generate user override everything", userOptions : {firstName: 'Cleo', lastName: 'Schneider', screenName: 'cschneider', email: 'cleo_schneider@intuit.com', deactivated: true}, expectedKeyValue: { firstName: 'Cleo', lastName: 'Schneider', screenName: 'cschneider', email: 'cleo_schneider@intuit.com', deactivated: true} }
        ];
    }

    /**
     * Unit test that validates generating a user with a specified number of tables and a specified number of fields
     */
    describe('test generating a user with some defined values',function(){
        userWithOverridesGenerator().forEach(function(entry) {
            it('Test case: ' + entry.message, function (done) {
                var options = entry.userOptions;
                var expectedKeyValuePairs = entry.expectedKeyValue;

                var user = userGenerator.generatePopulatedUser(options);

                console.log('app: ' + JSON.stringify(user));

                if(!user[userConsts.FIRST]){
                    assert.fail('User should be generated with a first name');
                }

                if(!user[userConsts.LAST]){
                    assert.fail('User should be generated with a last name');
                }

                if(!user[userConsts.SCREEN_NAME]){
                    assert.fail('User should be generated with a screen name');
                }

                if(!user[userConsts.EMAIL]){
                    assert.fail('User should be generated with a email');
                }

                if(typeof user[userConsts.DEACTIVATED] === 'undefined'){
                    assert.fail('User should be generated with a deactivated value');
                }

                if(expectedKeyValuePairs[userConsts.FIRST] && expectedKeyValuePairs[userConsts.FIRST] !== user[userConsts.FIRST]){
                    assert.fail('Expected first name ' + expectedKeyValuePairs[userConsts.FIRST] + ' to match actual first name ' + user[userConsts.FIRST]);
                }

                if(expectedKeyValuePairs[userConsts.LAST] && expectedKeyValuePairs[userConsts.LAST] !== user[userConsts.LAST]){
                    assert.fail('Expected last name ' + expectedKeyValuePairs[userConsts.LAST] + ' to match actual last name ' + user[userConsts.LAST]);
                }

                if(expectedKeyValuePairs[userConsts.SCREEN_NAME] && expectedKeyValuePairs[userConsts.SCREEN_NAME] !== user[userConsts.SCREEN_NAME]){
                    assert.fail('Expected screen name ' + expectedKeyValuePairs[userConsts.SCREEN_NAME] + ' to match actual screen name ' + user[userConsts.SCREEN_NAME]);
                }

                if(expectedKeyValuePairs[userConsts.EMAIL] && expectedKeyValuePairs[userConsts.EMAIL] !== user[userConsts.EMAIL]){
                    assert.fail('Expected first email ' + expectedKeyValuePairs[userConsts.EMAIL] + ' to match actual email ' + user[userConsts.EMAIL]);
                }

                if(typeof expectedKeyValuePairs[userConsts.DEACTIVATED] !== 'undefined' && expectedKeyValuePairs[userConsts.DEACTIVATED] !== user[userConsts.DEACTIVATED] ){
                    assert.fail('Expected deactivated = ' + expectedKeyValuePairs[userConsts.DEACTIVATED] + ' to match actual deactivated = ' + user[userConsts.DEACTIVATED]);
                }

                done();
            });
        });
    });
});



