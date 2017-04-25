'use strict';

var assert = require('assert');
var sinon = require('sinon');
var durationValidator = require('../../src/validator/durationValidator');
var DURATION_CONSTS = require('../../src/constants').DURATION_CONSTS;
var dataErrorCodes = require('../../src/dataEntryErrorCodes');

describe('durationValidator', () => {
    describe('validateAndReturnResults', () => {
        let fieldName = 'duration';
        let invalidDuration = DURATION_CONSTS.ACCEPTED_TYPE.DURATION_TYPE_INVALID_INPUT;

        let def = {
            fieldDef: {
                datatypeAttributes: {
                    scale: DURATION_CONSTS.SCALES.SMART_UNITS
                }
            }
        };

        let expectedResult = {

            code: dataErrorCodes.INVALID_ENTRY,
            data: {
                fieldName: "duration",
                value: "Days",
            },
            messageId: "invalidMsg.duration.timeFormat"
        };

        let previousResults = {
            def: def,
            error: {
                code: null
            },
        };

        it('returns a result', () => {
            assert.deepEqual(durationValidator.validateAndReturnResults(invalidDuration, 'duration', previousResults).error, expectedResult);
        });

    });
});
