/**
 * Generate a user with a random First, Last, ScreenName, and Email address
 * Created by cschneider1 on 5/29/15.
 */
(function () {

    var consts = require('../server/api/constants');
    var Chance = require('chance');
    var chance = new Chance();

    chance.mixin({
        'user' : function (options){
            var first = options.first ? options.first : chance.first(options);
            var last = options.last ? options.last : chance.last(options);
            var screenName = options.screenName ? options.screenName : first.substring(0,1) + last;
            var email = options.email ? options.email : chance.email(options);
            var deactivated = options.deactivated ? options.deactivated : false;

            return {
                "firstName": first,
                "lastName": last,
                "screenName": screenName,
                "email": email,
                "deactivated" : deactivated
            }
        }
    });

    module.exports = {

        /**
         * Generate a user with random properties
         * @param options
         * @returns {*}
         */
        generateUser: function(){
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
        generatePopulatedUser : function(options){
            return chance.user(options);
        }
    };
}());