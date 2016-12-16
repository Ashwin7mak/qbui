/**
 * Test Data for durationFieldValueEditor.unit.spec.js
 * */
(function() {
    'use strict';
    var CONSTS = require('../../../common/src/constants').DURATION_CONSTS;
    var numValue = 55 * Math.random();
    var HHMMSS = "55:55:55";
    var HHMM = "55:55";
    var MMSS = ":55:55";
    var MM = ":55";
    var SS = "::55";
    var HHSS = "55::55";
    var invalidInput = {
        HHMMSS: "5.5:5.5:5.5",
        HHMM: "5.5:5.5",
        MM: ":5.5",
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
                scale: CONSTS.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                /**
                 * If a user does not insert a type, it defaults to scale
                 * */
                type: undefined,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_SECOND
            },
            {
                scale: CONSTS.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.MILLISECONDS,
                MILLIS_PER_TYPE: 1
            },
            {
                scale: CONSTS.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.MS,
                MILLIS_PER_TYPE: 1
            },
            {
                scale: CONSTS.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.SECONDS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_SECOND
            },
            {
                scale: CONSTS.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.SECONDS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_SECOND
            },
            {
                scale: CONSTS.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.MINUTES,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.M,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.HOURS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_HOUR
            },
            {
                scale: CONSTS.SECONDS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.H,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_HOUR
            },
            {
                scale: CONSTS.SECONDS,
                numValue: numValue,
                // numValue: Math.floor(numValue),
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.DAYS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_DAY,
            },
            {
                scale: CONSTS.SECONDS,
                numValue: numValue,
                // numValue: Math.floor(numValue),
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.D,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_DAY,
            },
            {
                scale: CONSTS.SECONDS,
                numValue: numValue,
                // numValue: Math.floor(numValue),
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.WEEKS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_WEEK,
            },
            {
                scale: CONSTS.SECONDS,
                numValue: numValue,
                // numValue: Math.floor(numValue),
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.W,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_WEEK,
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
                type: undefined,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.MILLISECONDS,
                MILLIS_PER_TYPE: 1
            },
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.MS,
                MILLIS_PER_TYPE: 1
            },
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.SECONDS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_SECOND
            },
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.S,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_SECOND
            },
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.MINUTES,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.M,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.HOURS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_HOUR
            },
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.H,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_HOUR
            },
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.DAYS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_DAY
            },
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.D,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_DAY
            },
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.WEEKS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_WEEK
            },
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                type: CONSTS.W,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_WEEK
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
                type: undefined,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_HOUR
            },
            {
                scale: CONSTS.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.MILLISECONDS,
                MILLIS_PER_TYPE: 1
            },
            {
                scale: CONSTS.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.MS,
                MILLIS_PER_TYPE: 1
            },
            {
                scale: CONSTS.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.SECONDS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_SECOND
            },
            {
                scale: CONSTS.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.S,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_SECOND
            },
            {
                scale: CONSTS.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.MINUTES,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.M,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.HOURS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_HOUR
            },
            {
                scale: CONSTS.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.H,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_HOUR
            },
            {
                scale: CONSTS.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.DAYS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_DAY

            },
            {
                scale: CONSTS.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.D,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_DAY
            },
            {
                scale: CONSTS.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.WEEKS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_WEEK
            },
            {
                scale: CONSTS.HOURS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_HOUR,
                type: CONSTS.W,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_WEEK
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
                type: undefined,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_WEEK
            },
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.SECONDS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_SECOND
            },
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.MILLISECONDS,
                MILLIS_PER_TYPE: 1
            },
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.MS,
                MILLIS_PER_TYPE: 1
            },
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.S,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_SECOND
            },
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.MINUTES,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.M,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_MIN
            },
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.HOURS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_HOUR
            },
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.H,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_HOUR
            },
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.DAYS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_DAY
            },
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.D,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_DAY
            },
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.WEEKS,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_WEEK
            },
            {
                scale: CONSTS.WEEKS,
                numValue: numValue,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_WEEK,
                type: CONSTS.W,
                MILLIS_PER_TYPE: CONSTS.MILLIS_PER_WEEK
            },
        ],
        /**
         * A user can input multiple values and types
         * For example 55 weeks 55 days 55 minutes is a valid input
         * */
        multiInputData: [
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                multiInput: {
                    firstInput: CONSTS.WEEKS,
                    secondInput: CONSTS.HOURS,
                    thirdInput: CONSTS.MINUTES
                },
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                momentJSTYPE: {
                    firstInput: CONSTS.WEEKS,
                    secondInput: CONSTS.HOURS,
                    thirdInput: CONSTS.MINUTES
                },
                description: numValue + ' ' + CONSTS.WEEKS + ' ' + numValue + ' ' + CONSTS.HOURS + ' ' + numValue + ' ' + CONSTS.MINUTES
            },
            {
                scale: CONSTS.MINUTES,
                numValue: numValue,
                multiInput: {
                    firstInput: CONSTS.SECONDS,
                    secondInput: CONSTS.HOURS
                },
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                momentJSTYPE: {
                    firstInput: CONSTS.SECONDS,
                    secondInput: CONSTS.HOUR
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
        ],
        timeFormatData: [
            //time format only accepts whole numbers
            {
                scale: CONSTS.MINUTES,
                timeFormatVal: HHMMSS,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                HH: Math.floor(numValue),
                MM: Math.floor(numValue),
                SS: Math.floor(numValue),
            },
            {
                scale: CONSTS.MINUTES,
                timeFormatVal: HHMM,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                HH: Math.floor(numValue),
                MM: Math.floor(numValue),
            },
            {
                scale: CONSTS.MINUTES,
                timeFormatVal: HHSS,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                HH: Math.floor(numValue),
                SS: Math.floor(numValue),
            },
            {
                scale: CONSTS.MINUTES,
                timeFormatVal: MMSS,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                MM: Math.floor(numValue),
                SS: Math.floor(numValue),
            },
            {
                scale: CONSTS.MINUTES,
                timeFormatVal: MM,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                MM: Math.floor(numValue),
            },
            {
                scale: CONSTS.MINUTES,
                timeFormatVal: SS,
                MILLIS_PER_SCALE: CONSTS.MILLIS_PER_MIN,
                SS: Math.floor(numValue),
            },
        ],
        timeFormatDataProvider: [
            //time format only accepts whole numbers
            {
                scale: CONSTS.HHMMSS,
                numValue: Math.floor(numValue),
                // MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: undefined,
                momentJSTYPE: CONSTS.HOURS
            },
            {
                scale: CONSTS.HHMMSS,
                numValue: Math.floor(numValue),
                // MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.MINUTES,
                momentJSTYPE: CONSTS.MINUTES
            },
            {
                scale: CONSTS.HHMM,
                numValue: Math.floor(numValue),
                // MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.MINUTES,
                momentJSTYPE: CONSTS.MINUTES
            },
            {
                scale: CONSTS.MMSS,
                numValue: Math.floor(numValue),
                // MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.MINUTES,
                momentJSTYPE: CONSTS.MINUTES
            },
            {
                scale: CONSTS.MM,
                numValue: Math.floor(numValue),
                // MILLIS_PER_SCALE: CONSTS.MILLIS_PER_SECOND,
                type: CONSTS.MINUTES,
                momentJSTYPE: CONSTS.MINUTES
            },
        ],
        invalidInput: [
            {
                scale: CONSTS.MINUTES,
                invalidInput: invalidInput.HHMMSS,
            },
            {
                scale: CONSTS.MINUTES,
                invalidInput: invalidInput.HHMM,
            },
            {
                scale: CONSTS.MINUTES,

                invalidInput: invalidInput.MM,
            },
            {
                scale: CONSTS.MINUTES,
                invalidInput: invalidInput.bananaNinja,
            },
            {
                scale: CONSTS.MINUTES,
                invalidInput: invalidInput.invalidNoNums,
            },
            {
                scale: CONSTS.MINUTES,
                invalidInput: invalidInput.notAcceptedType,
            },
        ]
    };
}());
