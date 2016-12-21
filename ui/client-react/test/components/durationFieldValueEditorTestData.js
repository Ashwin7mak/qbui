/**
 * Test Data for durationFieldValueEditor.unit.spec.js
 * */
(function() {
    'use strict';
    var CONSTS = require('../../../common/src/constants').DURATION_CONSTS;
    var numValue = 55 * Math.random();
    var HHMMSS = Math.floor(numValue) + ':' + Math.floor(numValue) + ':' + Math.floor(numValue);
    var HHMM = Math.floor(numValue) + ':' + Math.floor(numValue);
    var MMSS = ':' + Math.floor(numValue) + ':' + Math.floor(numValue);
    var MM = ':' + Math.floor(numValue);
    var SS = '::' + Math.floor(numValue);
    var HHSS = Math.floor(numValue) + '::' + Math.floor(numValue);
    var invalidInput = {
        HHMMSS: "55:5.x.5:5.5",
        HHMM: "55:5..5",
        MM: ":5.5.",
        bananaNinja: '1 Banana 6 Ninjas',
        invalidNoNums: 'days',
        invalidMultiTypes: '1 day week',
        notAcceptedType: '23 years',
    };
    module.exports = {
        dataProvider : [
            /**
             * Converts all values to Seconds
             * */
            {
                scale: CONSTS.SCALES.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                /**
                 * If a user does not insert a type, it defaults to scale
                 * */
                type: undefined,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_SECOND
            },
            {
                scale: CONSTS.SCALES.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.SCALES.MILLISECONDS,
                MILLIS_PER_TYPE: 1
            },
            {
                scale: CONSTS.SCALES.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.ACCEPTED_TYPE.MS,
                MILLIS_PER_TYPE: 1
            },
            {
                scale: CONSTS.SCALES.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.SCALES.SECONDS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_SECOND
            },
            {
                scale: CONSTS.SCALES.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.ACCEPTED_TYPE.SECOND,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_SECOND
            },
            {
                scale: CONSTS.SCALES.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.SCALES.MINUTES,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.SCALES.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.ACCEPTED_TYPE.MINUTE,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.SCALES.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.ACCEPTED_TYPE.M,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.SCALES.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.SCALES.HOURS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_HOUR
            },
            {
                scale: CONSTS.SCALES.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.ACCEPTED_TYPE.HOUR,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_HOUR
            },
            {
                scale: CONSTS.SCALES.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.ACCEPTED_TYPE.H,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_HOUR
            },
            {
                scale: CONSTS.SCALES.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.SCALES.DAYS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_DAY,
            },
            {
                scale: CONSTS.SCALES.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.ACCEPTED_TYPE.D,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_DAY,
            },
            {
                scale: CONSTS.SCALES.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.SCALES.WEEKS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_WEEK,
            },
            {
                scale: CONSTS.SCALES.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.ACCEPTED_TYPE.W,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_WEEK,
            },
            /**
             * Converts all values to minutes
             * */
            {
                scale: CONSTS.SCALES.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                /**
                 * If a user does not insert a type, it defaults to scale
                 * */
                type: undefined,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.SCALES.MILLISECONDS,
                MILLIS_PER_TYPE: 1
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.ACCEPTED_TYPE.MS,
                MILLIS_PER_TYPE: 1
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.SCALES.SECONDS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_SECOND
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.ACCEPTED_TYPE.S,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_SECOND
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.SCALES.MINUTES,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.ACCEPTED_TYPE.M,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.SCALES.HOURS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_HOUR
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.ACCEPTED_TYPE.H,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_HOUR
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.SCALES.DAYS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_DAY
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.ACCEPTED_TYPE.D,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_DAY
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.SCALES.WEEKS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_WEEK
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.ACCEPTED_TYPE.W,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_WEEK
            },
            /**
             * Converts all values to hours
             * */
            {
                scale: CONSTS.SCALES.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                /**
                 * If a user does not insert a type, it defaults to scale
                 * */
                type: undefined,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_HOUR
            },
            {
                scale: CONSTS.SCALES.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.ACCEPTED_TYPE.MILLISECONDS,
                MILLIS_PER_TYPE: 1
            },
            {
                scale: CONSTS.SCALES.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.ACCEPTED_TYPE.MS,
                MILLIS_PER_TYPE: 1
            },
            {
                scale: CONSTS.SCALES.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.SCALES.SECONDS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_SECOND
            },
            {
                scale: CONSTS.SCALES.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.ACCEPTED_TYPE.S,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_SECOND
            },
            {
                scale: CONSTS.SCALES.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.SCALES.MINUTES,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.SCALES.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.ACCEPTED_TYPE.M,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.SCALES.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.SCALES.HOURS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_HOUR
            },
            {
                scale: CONSTS.SCALES.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.ACCEPTED_TYPE.H,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_HOUR
            },
            {
                scale: CONSTS.SCALES.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.ACCEPTED_TYPE.DAYS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_DAY

            },
            {
                scale: CONSTS.SCALES.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.ACCEPTED_TYPE.D,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_DAY
            },
            {
                scale: CONSTS.SCALES.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.SCALES.WEEKS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_WEEK
            },
            {
                scale: CONSTS.SCALES.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.ACCEPTED_TYPE.W,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_WEEK
            },
            /**
             * Converts all values to weeks
             * */
            {
                scale: CONSTS.SCALES.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                /**
                 * If a user does not insert a type, it defaults to scale
                 * */
                type: undefined,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_WEEK
            },
            {
                scale: CONSTS.SCALES.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.SCALES.SECONDS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_SECOND
            },
            {
                scale: CONSTS.SCALES.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.ACCEPTED_TYPE.MILLISECONDS,
                MILLIS_PER_TYPE: 1
            },
            {
                scale: CONSTS.SCALES.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.ACCEPTED_TYPE.MS,
                MILLIS_PER_TYPE: 1
            },
            {
                scale: CONSTS.SCALES.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.ACCEPTED_TYPE.S,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_SECOND
            },
            {
                scale: CONSTS.SCALES.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.SCALES.MINUTES,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.SCALES.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.ACCEPTED_TYPE.M,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.SCALES.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.SCALES.HOURS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_HOUR
            },
            {
                scale: CONSTS.SCALES.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.ACCEPTED_TYPE.H,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_HOUR
            },
            {
                scale: CONSTS.SCALES.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.SCALES.DAYS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_DAY
            },
            {
                scale: CONSTS.SCALES.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.ACCEPTED_TYPE.D,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_DAY
            },
            {
                scale: CONSTS.SCALES.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.SCALES.WEEKS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_WEEK
            },
            {
                scale: CONSTS.SCALES.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.ACCEPTED_TYPE.W,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_WEEK
            },
        ],
        /**
         * A user can input multiple values and types
         * For example 55 weeks 55 days 55 minutes is a valid input
         * */
        multiInputData: [
            {
                scale: CONSTS.SCALES.MINUTES,
                numValue: numValue,
                multiInput: {
                    firstInput: CONSTS.SCALES.WEEKS,
                    secondInput: CONSTS.SCALES.HOURS,
                    thirdInput: CONSTS.SCALES.MINUTES
                },
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                MILLIS_PER_TYPE: {
                    firstInput:  CONSTS.MILLIS_PER_WEEK,
                    secondInput:  CONSTS.MILLIS_PER_HOUR,
                    thirdInput: CONSTS.MILLIS_PER_MIN
                },
                description: numValue + ' ' + CONSTS.WEEKS + ' ' + numValue + ' ' + CONSTS.HOURS + ' ' + numValue + ' ' + CONSTS.MINUTES
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                numValue: numValue,
                multiInput: {
                    firstInput: CONSTS.SCALES.SECONDS,
                    secondInput: CONSTS.SCALES.HOURS
                },
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                MILLIS_PER_TYPE: {
                    firstInput:  CONSTS.MILLIS_PER_SECOND,
                    secondInput:  CONSTS.MILLIS_PER_HOUR
                },
                description: numValue + ' ' + CONSTS.SECONDS + ' ' + numValue + ' ' + CONSTS.HOURS
            }
        ],
        placeholderData: [
            {
                scale: undefined,
                placeholder: ''
            },
            {
                scale: CONSTS.SCALES.SMART_UNITS,
                placeholder: CONSTS.PLACEHOLDER.DAYS
            },
            {
                scale: CONSTS.SCALES.HHMMSS,
                placeholder: CONSTS.PLACEHOLDER.HHMMSS
            },
            {
                scale: CONSTS.SCALES.HHMM,
                placeholder: CONSTS.PLACEHOLDER.HHMM
            },
            {
                scale: CONSTS.SCALES.MM,
                placeholder: CONSTS.PLACEHOLDER.MM
            },
            {
                scale: CONSTS.SCALES.MMSS,
                placeholder: CONSTS.PLACEHOLDER.MMSS

            },
            {
                scale: CONSTS.SCALES.SECONDS,
                placeholder: CONSTS.PLACEHOLDER.SECONDS

            },
            {
                scale: CONSTS.SCALES.HOURS,
                placeholder: CONSTS.PLACEHOLDER.HOURS

            },
            {
                scale: CONSTS.SCALES.DAYS,
                placeholder: CONSTS.PLACEHOLDER.DAYS

            },
            {
                scale: CONSTS.SCALES.WEEKS,
                placeholder: CONSTS.PLACEHOLDER.WEEKS

            }
        ],
        timeFormatData: [
            //time format only accepts whole numbers
            {
                scale: CONSTS.SCALES.MINUTES,
                timeFormatVal: HHMMSS,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                HH: Math.floor(numValue),
                MM: Math.floor(numValue),
                SS: Math.floor(numValue),
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                timeFormatVal: HHMM,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                HH: Math.floor(numValue),
                MM: Math.floor(numValue),
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                timeFormatVal: HHSS,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                HH: Math.floor(numValue),
                SS: Math.floor(numValue),
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                timeFormatVal: MMSS,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                MM: Math.floor(numValue),
                SS: Math.floor(numValue),
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                timeFormatVal: MM,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                MM: Math.floor(numValue),
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                timeFormatVal: SS,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                SS: Math.floor(numValue),
            },
        ],
        timeFormatDataProvider: [
            //time format only accepts whole numbers
            {
                scale: CONSTS.SCALES.HHMMSS,
                numValue: Math.floor(numValue),
                type: undefined,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_HOUR
            },
            {
                scale: CONSTS.SCALES.HHMMSS,
                numValue: Math.floor(numValue),
                type: CONSTS.MINUTES,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.SCALES.HHMM,
                numValue: Math.floor(numValue),
                type: CONSTS.MINUTES,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.SCALES.MMSS,
                numValue: Math.floor(numValue),
                type: CONSTS.MINUTES,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.SCALES.MM,
                numValue: Math.floor(numValue),
                type: CONSTS.MINUTES,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
        ],
        invalidInput: [
            {
                scale: CONSTS.SCALES.MINUTES,
                invalidInput: invalidInput.HHMMSS,
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                invalidInput: invalidInput.HHMM,
            },
            {
                scale: CONSTS.SCALES.MINUTES,

                invalidInput: invalidInput.MM,
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                invalidInput: invalidInput.bananaNinja,
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                invalidInput: invalidInput.invalidNoNums,
            },
            {
                scale: CONSTS.SCALES.MINUTES,
                invalidInput: invalidInput.notAcceptedType,
            },
        ]
    };
}());
