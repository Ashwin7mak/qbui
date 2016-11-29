/**
 * Created by rbeyer on 11/28/16.
 */
(function() {
    'use strict';

    var defaultDelimiter = "|";
    var qbClassicDelimiter = "~";

    module.exports = {
        /****************************** QB Classic Cookie Methods ******************************/
        createQBClassicNameValuePair: function(name, value) {
            return this.createNameValuePair(name, value, qbClassicDelimiter);
        },

        addQBClassicNameValuePair: function(cookieValue, name, value) {
            return this.addNameValuePair(cookieValue, name, value, qbClassicDelimiter);
        },


        /****************************** QB Default Cookie Methods ******************************/
        /**
         *
         * A helper method that creates a new name=value pairing for a cookie
         * @param name: the name for the name=value you want to add
         * @param value: the value of the name=value you want to add
         * @param delimiter: the character used as the delimiter
         * @returns {*}
         */
        createNameValuePair: function(name, value, delimiter) {
            if (delimiter) {
                return delimiter + name + "=" + value + delimiter;
            } else {
                return defaultDelimiter + name + "=" + value + defaultDelimiter;
            }
        },

        /**
         *
         * A helper method that appends a new name=value pairing to the cookie value
         * @param cookieValue: the cookie's value field
         * @param name: the name for the name=value you want to add
         * @param value: the value of the name=value you want to add
         * @param delimiter: the character used as the delimiter
         * @returns {*}
         */
        addNameValuePair: function(cookieValue, name, value, delimiter) {
            if (delimiter) {
                return cookieValue + name + "=" + value + delimiter;
            } else {
                return cookieValue + name + "=" + value + defaultDelimiter;
            }
        },

        /**
         *
         * A helper method that searches a name=value string for a given name
         * If it is found, return true, else false
         * @param cookieValue: the cookie's value field
         * @param match: the name for the name=value you want to add
         * @returns {*}
         */
        searchCookieValue: function(cookieValue, match) {
            return cookieValue.search.indexOf(match) !== -1;
        }
    };

}());
