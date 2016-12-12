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
                type: CONSTS.MILLISECONDS
            },
            {
                scale: CONSTS.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.MS
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
                type: CONSTS.SECONDS,
                description: CONSTS.S
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
                type: CONSTS.M
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
                type: CONSTS.H
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
                type: CONSTS.D
            },
            {
                scale: CONSTS.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.WEEKS
            },
            {
                scale: CONSTS.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.W
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
                type: CONSTS.MILLISECONDS
            },
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.MS
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
                type: CONSTS.S
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
                type: CONSTS.M
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
                type: CONSTS.H
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
                type: CONSTS.D
            },
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.WEEKS
            },
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.W
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
                type: CONSTS.MILLISECONDS
            },
            {
                scale: CONSTS.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.MS
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
                type: CONSTS.S
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
                type: CONSTS.M
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
                type: CONSTS.H
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
                type: CONSTS.D
            },
            {
                scale: CONSTS.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.WEEKS
            },
            {
                scale: CONSTS.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.W
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
                type: CONSTS.MILLISECONDS
            },
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.MS
            },
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.S
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
                type: CONSTS.M
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
                type: CONSTS.H
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
                type: CONSTS.D
            },
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.WEEKS
            },
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.W
            }
        ],
        placeholderData: [
            {
                scale: undefined,
                placeholder: ''
            },
            {
                scale: CONSTS.SMART_UNITS,
                placeholder: CONSTS.PLACEHOLDER.DAYS
            },
            {
                scale: CONSTS.HHMMSS,
                placeholder: CONSTS.PLACEHOLDER.HHMMSS
            },
            {
                scale: CONSTS.HHMM,
                placeholder: CONSTS.PLACEHOLDER.HHMM
            },
            {
                scale: CONSTS.MM,
                placeholder: CONSTS.PLACEHOLDER.MM
            },
            {
                scale: CONSTS.MMSS,
                placeholder: CONSTS.PLACEHOLDER.MMSS

            },
            {
                scale: CONSTS.SECONDS,
                placeholder: CONSTS.PLACEHOLDER.SECONDS

            },
            {
                scale: CONSTS.HOURS,
                placeholder: CONSTS.PLACEHOLDER.HOURS

            },
            {
                scale: CONSTS.DAYS,
                placeholder: CONSTS.PLACEHOLDER.DAYS

            },
            {
                scale: CONSTS.WEEKS,
                placeholder: CONSTS.PLACEHOLDER.WEEKS

            }
        ]
    };
}());
