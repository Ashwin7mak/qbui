/**
 * A test to test our test generation code
 * Created by cschneider1 on 6/1/15.
 */
(function() {
    'use strict';

    var userGenerator = require('../user.generator');
    var userConsts = require('../user.constants');
    var assert = require('assert');

    /**
     * Unit tests for user generator
     */
    describe('User generator unit test', function() {

        /**
         * Unit test that validates generating a user with no options present
         */
        describe('test generating an app with a specified number of tables', function() {
            var user = userGenerator.generateUser();

            if (!user[userConsts.ID]) {
                assert.fail('User should be generated with an ID');
            }

            if (!user[userConsts.FIRST]) {
                assert.fail('User should be generated with a first name');
            }

            if (!user[userConsts.LAST]) {
                assert.fail('User should be generated with a last name');
            }

            if (!user[userConsts.SCREEN_NAME]) {
                assert.fail('User should be generated with a screen name');
            }

            if (!user[userConsts.EMAIL]) {
                assert.fail('User should be generated with an email');
            }

            if (typeof user[userConsts.DEACTIVATED] === 'undefined') {
                assert.fail('User should be generated with a deactivated value');
            }

            if (typeof user[userConsts.ANONYMOUS] === 'undefined') {
                assert.fail('User should be generated with an anonymous value');
            }

            if (typeof user[userConsts.ADMINISTRATOR] === 'undefined') {
                assert.fail('User should be generated with an administrator value');
            }

            if (typeof user[userConsts.CHALLENGE_QUESTION] === 'undefined') {
                assert.fail('User should be generated with a challenge question value');
            }

            if (typeof user[userConsts.CHALLENGE_ANSWER] === 'undefined') {
                assert.fail('User should be generated with a challenge answer value');
            }

            if (typeof user[userConsts.PASSWORD] === 'undefined') {
                assert.fail('User should be generated with a password value');
            }

            if (typeof user[userConsts.TICKET_VERSION] === 'undefined') {
                assert.fail('User should be generated with a ticket version value');
            }
        });

        function userWithOverridesGenerator() {
            return [
                {message: 'Generate user override user id', userOptions: {id: '58462000'}, expectedKeyValue: {id: '58462000'}},
                {message: 'Generate user override first name', userOptions: {firstName: 'Cleo'}, expectedKeyValue: {firstName: 'Cleo'}},
                {message: 'Generate user override last name', userOptions: {lastName: 'Schneider'}, expectedKeyValue: {lastName: 'Schneider'}},
                {message: 'Generate user override screen name', userOptions: {screenName: 'cschneider'}, expectedKeyValue: {screenName: 'cschneider'}},
                {message: 'Generate user override email', userOptions: {email: 'cleo_schneider@intuit.com'}, expectedKeyValue: {email: 'cleo_schneider@intuit.com'}},
                {message: 'Generate user override anonymous', userOptions: {anonymous: false}, expectedKeyValue: {anonymous: false}},
                {message: 'Generate user override deactivated', userOptions: {deactivated: false}, expectedKeyValue: {deactivated: false}},
                {message: 'Generate user override administrator', userOptions: {administrator: false}, expectedKeyValue: {administrator: false}},
                {message: 'Generate user override challengeQuestion', userOptions: {challengeQuestion: "This is a challenge question"}, expectedKeyValue: {challengeQuestion: "This is a challenge question"}},
                {message: 'Generate user override challengeAnswer', userOptions: {challengeAnswer: "This is a challenge answer"}, expectedKeyValue: {challengeAnswer: "This is a challenge answer"}},
                {message: 'Generate user override password', userOptions: {password: "ob32"}, expectedKeyValue: {password: "ob32"}},
                {message: 'Generate user override ticket version', userOptions: {ticketVersion: 0}, expectedKeyValue: {ticketVersion: 0}},
                {message: 'Generate user override everything',
                    userOptions: {id: '58462000', firstName: 'Cleo', lastName: 'Schneider', screenName: 'cschneider', email: 'cleo_schneider@intuit.com', deactivated: true, anonymous: false, administrator: false, challengeQuestion: "question", challengeAnswer: "answer", password: "encoded password", ticketVersion:0},
                    expectedKeyValue: {id: '58462000', firstName: 'Cleo', lastName: 'Schneider', screenName: 'cschneider', email: 'cleo_schneider@intuit.com', deactivated: true, anonymous: false, administrator: false, challengeQuestion: "question", challengeAnswer: "answer", password: "encoded password", ticketVersion:0}}
            ];
        }

        /**
         * Unit test that validates generating a user with a specified number of tables and a specified number of fields
         */
        describe('test generating a user with some defined values', function() {
            userWithOverridesGenerator().forEach(function(entry) {
                it('Test case: ' + entry.message, function(done) {
                    var options = entry.userOptions;
                    var expectedKeyValuePairs = entry.expectedKeyValue;

                    var user = userGenerator.generatePopulatedUser(options);

                    if (!user[userConsts.ID]) {
                        assert.fail('User should be generated with an ID');
                    }

                    if (!user[userConsts.FIRST]) {
                        assert.fail('User should be generated with a first name');
                    }

                    if (!user[userConsts.LAST]) {
                        assert.fail('User should be generated with a last name');
                    }

                    if (!user[userConsts.SCREEN_NAME]) {
                        assert.fail('User should be generated with a screen name');
                    }

                    if (!user[userConsts.EMAIL]) {
                        assert.fail('User should be generated with a email');
                    }

                    if (typeof user[userConsts.DEACTIVATED] === 'undefined') {
                        assert.fail('User should be generated with a deactivated value');
                    }

                    if (typeof user[userConsts.ANONYMOUS] === 'undefined') {
                        assert.fail('User should be generated with a anonymous value');
                    }

                    if (typeof user[userConsts.ADMINISTRATOR] === 'undefined') {
                        assert.fail('User should be generated with a administrator value');
                    }

                    if (typeof user[userConsts.CHALLENGE_QUESTION] === 'undefined') {
                        assert.fail('User should be generated with a challenge question value');
                    }

                    if (typeof user[userConsts.CHALLENGE_ANSWER] === 'undefined') {
                        assert.fail('User should be generated with a challenge answer value');
                    }

                    if (typeof user[userConsts.PASSWORD] === 'undefined') {
                        assert.fail('User should be generated with a password value');
                    }

                    if (typeof user[userConsts.TICKET_VERSION] === 'undefined') {
                        assert.fail('User should be generated with a ticket version value');
                    }

                    if (expectedKeyValuePairs[userConsts.ID] && expectedKeyValuePairs[userConsts.ID] !== user[userConsts.ID]) {
                        assert.fail('Expected id ' + expectedKeyValuePairs[userConsts.ID] + ' to match actual id ' + user[userConsts.ID]);
                    }

                    if (expectedKeyValuePairs[userConsts.FIRST] && expectedKeyValuePairs[userConsts.FIRST] !== user[userConsts.FIRST]) {
                        assert.fail('Expected first name ' + expectedKeyValuePairs[userConsts.FIRST] + ' to match actual first name ' + user[userConsts.FIRST]);
                    }

                    if (expectedKeyValuePairs[userConsts.LAST] && expectedKeyValuePairs[userConsts.LAST] !== user[userConsts.LAST]) {
                        assert.fail('Expected last name ' + expectedKeyValuePairs[userConsts.LAST] + ' to match actual last name ' + user[userConsts.LAST]);
                    }

                    if (expectedKeyValuePairs[userConsts.SCREEN_NAME] && expectedKeyValuePairs[userConsts.SCREEN_NAME] !== user[userConsts.SCREEN_NAME]) {
                        assert.fail('Expected screen name ' + expectedKeyValuePairs[userConsts.SCREEN_NAME] + ' to match actual screen name ' + user[userConsts.SCREEN_NAME]);
                    }

                    if (expectedKeyValuePairs[userConsts.EMAIL] && expectedKeyValuePairs[userConsts.EMAIL] !== user[userConsts.EMAIL]) {
                        assert.fail('Expected email ' + expectedKeyValuePairs[userConsts.EMAIL] + ' to match actual email ' + user[userConsts.EMAIL]);
                    }

                    if (typeof expectedKeyValuePairs[userConsts.DEACTIVATED] !== 'undefined' && expectedKeyValuePairs[userConsts.DEACTIVATED] !== user[userConsts.DEACTIVATED]) {
                        assert.fail('Expected deactivated = ' + expectedKeyValuePairs[userConsts.DEACTIVATED] + ' to match actual deactivated = ' + user[userConsts.DEACTIVATED]);
                    }

                    if (typeof expectedKeyValuePairs[userConsts.ANONYMOUS] !== 'undefined' && expectedKeyValuePairs[userConsts.ANONYMOUS] !== user[userConsts.ANONYMOUS]) {
                        assert.fail('Expected deactivated = ' + expectedKeyValuePairs[userConsts.ANONYMOUS] + ' to match actual anonymous = ' + user[userConsts.ANONYMOUS]);
                    }

                    if (typeof expectedKeyValuePairs[userConsts.ADMINISTRATOR] !== 'undefined' && expectedKeyValuePairs[userConsts.ADMINISTRATOR] !== user[userConsts.ADMINISTRATOR]) {
                        assert.fail('Expected deactivated = ' + expectedKeyValuePairs[userConsts.ADMINISTRATOR] + ' to match actual administrator = ' + user[userConsts.ADMINISTRATOR]);
                    }

                    if (typeof expectedKeyValuePairs[userConsts.CHALLENGE_QUESTION] !== 'undefined' && expectedKeyValuePairs[userConsts.CHALLENGE_QUESTION] !== user[userConsts.CHALLENGE_QUESTION]) {
                        assert.fail('Expected deactivated = ' + expectedKeyValuePairs[userConsts.CHALLENGE_QUESTION] + ' to match actual challenge question = ' + user[userConsts.CHALLENGE_QUESTION]);
                    }

                    if (typeof expectedKeyValuePairs[userConsts.CHALLENGE_ANSWER] !== 'undefined' && expectedKeyValuePairs[userConsts.CHALLENGE_ANSWER] !== user[userConsts.CHALLENGE_ANSWER]) {
                        assert.fail('Expected deactivated = ' + expectedKeyValuePairs[userConsts.CHALLENGE_ANSWER] + ' to match actual challenge answer = ' + user[userConsts.CHALLENGE_ANSWER]);
                    }

                    if (typeof expectedKeyValuePairs[userConsts.PASSWORD] !== 'undefined' && expectedKeyValuePairs[userConsts.PASSWORD] !== user[userConsts.PASSWORD]) {
                        assert.fail('Expected deactivated = ' + expectedKeyValuePairs[userConsts.PASSWORD] + ' to match actual password = ' + user[userConsts.PASSWORD]);
                    }

                    if (typeof expectedKeyValuePairs[userConsts.TICKET_VERSION] !== 'undefined' && expectedKeyValuePairs[userConsts.TICKET_VERSION] !== user[userConsts.TICKET_VERSION]) {
                        assert.fail('Expected deactivated = ' + expectedKeyValuePairs[userConsts.TICKET_VERSION] + ' to match actual ticket version = ' + user[userConsts.TICKET_VERSION]);
                    }
                    done();
                });
            });
        });


        function userWithIDListGenerator() {
            return [
                {message: 'Generate default user list with provided user ids', userListOptions: [1000001, 1000002, 1000003, 1000004, 1000005], expectedUserListSize: 5},
                {message: 'Generate empty user list when no user ids is provided', userListOptions: [], expectedUserListSize: 0},
                {message: 'Generate empty user list when no user ids is provided', userListOptions:  null, expectedUserListSize: 0}
            ];
        }

        /**
         * Unit test that validates generating a list of users with a specified user id field
         */
        describe('test generating a list of users with provided user ID list', function() {
            userWithIDListGenerator().forEach(entry => {
                it('Test case to create a list of default users: (' + entry.message + ')', function(done) {
                    let userList = userGenerator.generatePopulatedDefaultUsers(entry.userListOptions);
                    assert.equal(userList.length, entry.expectedUserListSize, 'Expected return user list does not match expected result');
                    done();
                });
            });
        });
    });
}());

