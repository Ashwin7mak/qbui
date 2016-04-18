(function() {
    'use strict';

    var constants = require('../../api/constants');
    var groupTypes = require('../../api/groupTypes');

    module.exports = {

        /**
         * Is the dataType GroupType combination supported.
         *
         * @param dataType
         * @param groupType
         * @returns {boolean}
         */
        isValidGroupType: function(dataType, groupType) {

            switch (dataType) {
            case constants.DATE:
                switch (groupType) {
                case groupTypes.DATE.equals: return true;
                case groupTypes.DATE.day: return true;
                case groupTypes.DATE.week: return true;
                case groupTypes.DATE.month: return true;
                case groupTypes.DATE.year: return true;
                case groupTypes.DATE.quarter: return true;
                case groupTypes.DATE.fiscalQuarter: return true;
                case groupTypes.DATE.fiscalYear: return true;
                case groupTypes.DATE.decade: return true;
                }
                return false;
            case constants.DURATION:
                switch (groupType) {
                case groupTypes.DURATION.equals: return true;
                case groupTypes.DURATION.second: return true;
                case groupTypes.DURATION.minute: return true;
                case groupTypes.DURATION.hour: return true;
                case groupTypes.DURATION.am_pm: return true;
                case groupTypes.DURATION.week: return true;
                case groupTypes.DURATION.day: return true;
                }
                return false;
            case constants.EMAIL_ADDRESS:
                switch (groupType) {
                case groupTypes.EMAIL_ADDRESS.domain: return true;
                case groupTypes.EMAIL_ADDRESS.domain_topLevel: return true;
                case groupTypes.EMAIL_ADDRESS.name: return true;
                }
                return false;
            case constants.NUMERIC:
                switch (groupType) {
                case groupTypes.NUMERIC.equals: return true;
                case groupTypes.NUMERIC.range: return true;
                case groupTypes.NUMERIC.thousandth: return true;
                case groupTypes.NUMERIC.hundredth: return true;
                case groupTypes.NUMERIC.tenth: return true;
                case groupTypes.NUMERIC.one: return true;
                case groupTypes.NUMERIC.five: return true;
                case groupTypes.NUMERIC.ten: return true;
                case groupTypes.NUMERIC.hundred: return true;
                case groupTypes.NUMERIC.one_k: return true;
                case groupTypes.NUMERIC.ten_k: return true;
                case groupTypes.NUMERIC.hundred_k: return true;
                case groupTypes.NUMERIC.million: return true;
                }
                return false;
            case constants.TEXT:
                switch (groupType) {
                case groupTypes.TEXT.equals: return true;
                case groupTypes.TEXT.firstLetter: return true;
                case groupTypes.TEXT.firstWord: return true;
                }
                return false;
            case constants.USER:
                switch (groupType) {
                case groupTypes.USER.equals: return true;
                case groupTypes.USER.firstLetter: return true;
                case groupTypes.USER.firstWord: return true;
                }
                return false;
            }

            return false;

        },

        /**
         * Extract the first word from the given content.
         * Will return the original content if any exception is thrown.
         *
         * @param content
         * @returns first word found in the content.
         */
        getFirstWord: function(content) {
            try {
                return content.split(' ')[0];
            } catch (e) {
                // do nothing..just return the original content
            }
            return content;
        },

        /**
         * Extract the first letter from the given content.
         * Will return the original content if invalid input or
         * an exception is thrown.
         *
         * @param content
         * @returns first letter found in the content.
         */
        getFirstLetter: function(content) {
            try {
                return content.substr(0, 1);
            } catch (e) {
                // do nothing..just return the original content
            }
            return content;
        }
    };

}());
