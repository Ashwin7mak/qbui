/**
 * Created by rbeyer on 12/01/16.
 */
(function() {
    'use strict';

    module.exports = {
        /**
         *
         * A helper method that creates a new name=value pairing for a cookie
         * @param hostname: the character used as the delimiter
         * @returns {*}
         */
        getSubdomain: function(hostname) {
            return hostname.split(".").shift();
        },

        /**
         *
         * A helper method that returns the domain for a given hostname
         * To get the real domain we need to split on the '.' character
         * And then take the last 2 entries in the array
         * Example: team.quickbase.com
         * Example returns {quickbase.com}
         * @param hostname: the character used as the delimiter
         * @returns {string}
         */
        getDomain: function(hostname) {
            var hostnameSplit = hostname.split(".");
            var domainAndTLD = hostnameSplit.pop(); //we can't assume that we are deployed on TLD .com
            domainAndTLD = hostnameSplit.pop() + "." + domainAndTLD;
            return domainAndTLD;
        }
    };

}());
