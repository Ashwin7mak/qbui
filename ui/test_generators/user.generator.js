/**
 * Generate a user with a random First, Last, ScreenName, and Email address
 * Created by cschneider1 on 5/29/15.
 */
(function() {
    'use strict';

    var chance = require('chance').Chance();
    var rawValueGenerator = require('./rawValue.generator');
    var userConsts = require('./user.constants');

    chance.mixin({
        user: function(options) {
            let userId = options && options.id ? options.id : userConsts.DEFAULT_ID;
            let first = options && options.firstName ? options.firstName : chance.first(options);
            let last = options && options.lastName ? options.lastName : chance.last(options);
            let screenName = options && options.screenName ? options.screenName : first.substring(0, 1) + last;
            let email = options && options.email ? options.email : chance.email(options);
            let deactivated = options && (typeof options.deactivated !== 'undefined') ? options.deactivated : false;
            let anonymous = options && (typeof options.anonymous !== 'undefined') ? options.anonymous : false;
            let administrator = options && (typeof options.administrator !== 'undefined') ? options.administrator : false;
            let challengeQuestion = options && (typeof options.challengeQuestion !== 'undefined') ? options.challengeQuestion : "";
            let challengeAnswer = options && (typeof options.challengeAnswer !== 'undefined') ? options.challengeAnswer : "";
            let password = options && (typeof options.password !== 'undefined') ? options.password : "";
            let ticketVersion = options && (typeof options.ticketVersion !== 'undefined') ? options.ticketVersion : userConsts.DEFAULT_TICKET_VERSION;

            return {
                firstName         : first,
                lastName          : last,
                screenName        : screenName,
                email             : email,
                deactivated       : deactivated,
                anonymous         : anonymous,
                administrator     : administrator,
                challengeQuestion : challengeQuestion,
                challengeAnswer   : challengeAnswer,
                password          : password
                //id                : userId,
                // ticketVersion     : ticketVersion
            };
        }
    });

    module.exports = {

        /**
         * Generate a user with random properties
         * @param options
         * @returns {*}
         */
        userToJson: function(user) {
            return JSON.stringify(user);
        },

        /**
         * Generate a user with random properties
         * @param options
         * @returns {*}
         */
        generateUser: function() {
            return chance.user();
        },

        /**
         * Generate a user with certain fields populated with concrete values to generate contrived situations
         * </p>
         * Available options are:
         * {
         *  firstName: <firstName>
         *  lastName: <lastName>
         *  screenName: <screenName>
         *  email: <emailAddress>
         *  deactivated: <activityStatus>
         *  anonymous: <anonymous>
         *  administrator: <administrator>
         *  challengeQuestion: <challengeQuestion>
         *  challengeAnswer: <challengeAnswer>
         *  password: <password>
         * }
         * </p>
         * These options may be sparsely populated and we will generate values for those keys not present.
         * @param options
         * @returns {*}
         */
        generatePopulatedUser: function(options) {
            return chance.user(options);
        },

        /**
         * Generate a list of users with certain fields populated with concrete values to generate contrived situations
         * </p>
         * Available options are:
         * {
         *  id: <id>
         *  firstName: <firstName>
         *  lastName: <lastName>
         *  screenName: <screenName>
         *  email: <emailAddress>
         *  deactivated: <activityStatus>
         *  anonymous: <anonymous>
         *  administrator: <administrator>
         *  challengeQuestion: <challengeQuestion>
         *  challengeAnswer: <challengeAnswer>
         *  password: <password>
         *  ticketVersion: <ticketVersion>
         * }
         * </p>
         * These options may be sparsely populated and we will generate values for those keys not present.
         * @param userIdList
         * @returns {*}
         */
        generatePopulatedDefaultUsers: function(userIdList) {
            let userResultList = [];
            userIdList = typeof userIdList === 'undefined' || userIdList === null ? [] : userIdList;
            userIdList.forEach(userId => {
                //userResultList.push(this.generatePopulatedUser({id: userId}));
                userResultList.push(this.generatePopulatedUser());
            });
            return userResultList;
        },

        /**
         * Generate 5 default users with certain fields populated with concrete values to generate contrived situations
         * </p>
         * Available options are:
         * {
         *  firstName: <firstName>
         *  lastName: <lastName>
         *  screenName: <screenName>
         *  email: <emailAddress>
         *  deactivated: <activityStatus>
         *  anonymous: <anonymous>
         *  administrator: <administrator>
         *  challengeQuestion: <challengeQuestion>
         *  challengeAnswer: <challengeAnswer>
         *  password: <password>
         * }
         * </p>
         * These options may be sparsely populated and we will generate values for those keys not present.
         * @returns {*}
         */
        generateDefaultAdminUsers: function() {
            let userResultList = [];
            Array(5).fill().map((_, i) => {userResultList.push(this.generatePopulatedUser());});
            return userResultList;
        }
    };
}());
