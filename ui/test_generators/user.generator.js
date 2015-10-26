/**
 * Generate a user with a random First, Last, ScreenName, and Email address
 * Created by cschneider1 on 5/29/15.
 */
(function() {
    'use strict';

    var chance = require('chance').Chance();

    chance.mixin({
        user: function(options) {
            var first = options && options.firstName ? options.firstName : chance.first(options);
            var last = options && options.lastName ? options.lastName : chance.last(options);
            var screenName = options && options.screenName ? options.screenName : first.substring(0, 1) + last;
            var email = options && options.email ? options.email : chance.email(options);
            var deactivated = options && (typeof options.deactivated !== 'undefined') ? options.deactivated : chance.bool();

            return {
                firstName  : first,
                lastName   : last,
                screenName : screenName,
                email      : email,
                deactivated: deactivated
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
         *  first: <firstName>
         *  last: <lastName>
         *  screenName: <screenName>
         *  email: <emailAddress>
         *  deactivated: <activityStatus>
         * }
         * </p>
         * These options may be sparsely populated and we will generate values for those keys not present.
         * @param options
         * @returns {*}
         */
        generatePopulatedUser: function(options) {
            return chance.user(options);
        }
    };
}());
