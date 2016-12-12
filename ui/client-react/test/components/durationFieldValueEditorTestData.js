/**
 * Test Data for durationFieldValueEditor.unit.spec.js
 * */
(function() {
    'use strict';
    var CONSTS = require('../../../common/src/constants').DURATION_CONSTS;
    var numValue = 55;
    module.exports = {
        dataProvider : [
            /**
             * Converts all values to Seconds
             * */
            {
                scale: CONSTS.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                /**
                 * If a user does not insert a type, it defaults to scale
                 * */
                type: undefined,
            },
            {
                scale: CONSTS.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.SECONDS,
                description: CONSTS.SECONDS
            },
            {
                scale: CONSTS.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.MINUTES
            },
            {
                scale: CONSTS.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.HOURS
            },
            {
                scale: CONSTS.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.DAYS
            },
            {
                scale: CONSTS.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.WEEKS
            },
            /**
             * Converts all values to minutes
             * */
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                /**
                 * If a user does not insert a type, it defaults to scale
                 * */
                type: undefined
            },
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.SECONDS
            },
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.MINUTES
            },
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.HOURS
            },
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.DAYS
            },
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.WEEKS
            },
            /**
             * Converts all values to hours
             * */
            {
                scale: CONSTS.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                /**
                 * If a user does not insert a type, it defaults to scale
                 * */
                type: undefined
            },
            {
                scale: CONSTS.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.SECONDS
            },
            {
                scale: CONSTS.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.MINUTES
            },
            {
                scale: CONSTS.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.HOURS
            },
            {
                scale: CONSTS.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.DAYS
            },
            {
                scale: CONSTS.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.WEEKS
            },
            /**
             * Converts all values to weeks
             * */
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                /**
                 * If a user does not insert a type, it defaults to scale
                 * */
                type: undefined
            },
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.SECONDS
            },
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.MINUTES
            },
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.HOURS
            },
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.DAYS
            },
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.WEEKS
            }
        ]
    };
}());
