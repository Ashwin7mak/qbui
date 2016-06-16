/**
 * A test to test our test generation code
 * Created by cschneider1 on 6/1/15.
 */
(function() {
    'use strict';

    var fieldGenerator = require('../field.generator');
    var fieldConsts = require('../field.constants');
    var consts = require('../../server/src/api/constants');
    var assert = require('assert');

    /**
     * Unit tests for field generator
     */
    describe('Field generator unit test', function() {
        /**
         * DataProvider containing Records, FieldProperties and record display expectations PhoneNumber fields
         */
        function provider() {

            return [
                {message: 'checkbox field', fieldType: consts.SCALAR, dataType: consts.CHECKBOX},
                {message: 'text field', fieldType: consts.SCALAR, dataType: consts.TEXT},
                {message: 'phone number field', fieldType: consts.SCALAR, dataType: consts.PHONE_NUMBER},
                {message: 'date field', fieldType: consts.SCALAR, dataType: consts.DATE},
                {message: 'formula duration field', fieldType: consts.FORMULA, dataType: consts.DURATION},
                {message: 'formula date field', fieldType: consts.FORMULA, dataType: consts.DATE},
                {message: 'duration field', fieldType: consts.SCALAR, dataType: consts.DURATION},
                {message: 'formula time of day field', fieldType: consts.FORMULA, dataType: consts.TIME_OF_DAY},
                {message: 'time of day field', fieldType: consts.SCALAR, dataType: consts.TIME_OF_DAY},
                {message: 'numeric field', fieldType: consts.SCALAR, dataType: consts.NUMERIC},
                {message: 'formula numeric field', fieldType: consts.FORMULA, dataType: consts.NUMERIC},
                {message: 'currency field', fieldType: consts.SCALAR, dataType: consts.CURRENCY},
                {message: 'rating field', fieldType: consts.SCALAR, dataType: consts.RATING},
                {message: 'formula currency field', fieldType: consts.FORMULA, dataType: consts.CURRENCY},
                {message: 'percent field', fieldType: consts.SCALAR, dataType: consts.PERCENT},
                {message: 'formula percent field', fieldType: consts.FORMULA, dataType: consts.PERCENT},
                {message: 'url field', fieldType: consts.SCALAR, dataType: consts.URL},
                {message: 'email address field', fieldType: consts.SCALAR, dataType: consts.EMAIL_ADDRESS},
                {message: 'user field', fieldType: consts.SCALAR, dataType: consts.USER},
                {message: 'formula user field', fieldType: consts.FORMULA, dataType: consts.USER},
                {message: 'file attachment field', fieldType: consts.CONCRETE, dataType: consts.FILE_ATTACHMENT},
                {message: 'report link field', fieldType: consts.REPORT_LINK, dataType: consts.URL},
                {message: 'summary field', fieldType: consts.SUMMARY, dataType: consts.NUMERIC},
                {message: 'lookup field', fieldType: consts.LOOKUP, dataType: consts.NUMERIC},
                {message: 'formula phone number field', fieldType: consts.FORMULA, dataType: consts.PHONE_NUMBER},
                {message: 'formula url field', fieldType: consts.FORMULA, dataType: consts.URL},
                {message: 'formula checkbox field', fieldType: consts.FORMULA, dataType: consts.CHECKBOX},
                {message: 'formula text field', fieldType: consts.FORMULA, dataType: consts.TEXT},
                {message: 'formula email address field', fieldType: consts.FORMULA, dataType: consts.EMAIL_ADDRESS}
            ];
        }

        /**
         * Unit test that validates generating fields by type
         */
        describe('should create a base field of a particular type', function() {
            provider().forEach(function(entry) {
                it('Test case: ' + entry.message, function(done) {
                    var field = fieldGenerator.generateBaseField(entry.fieldType, entry.dataType);

                    if (!field[fieldConsts.fieldKeys.NAME]) {
                        assert.fail('Fields should be generated with a name');
                    }

                    if (!field[fieldConsts.fieldKeys.TYPE]) {
                        assert.fail('Fields should be generated with a type');
                    }

                    assert.equal(field[fieldConsts.fieldKeys.TYPE], entry.fieldType, 'The type passed should now appear on the object' + field);
                    done();
                });
            });
        });

        /**
         * Unit test that validates generating fields by type
         */
        describe('should create a base field and apply defaults for a particular type', function() {
            provider().forEach(function(entry) {
                it('Test case: ' + entry.message, function(done) {
                    var field = fieldGenerator.generateBaseField(entry.fieldType, entry.dataType);
                    fieldGenerator.applyDefaults(field);

                    if (!field[fieldConsts.fieldKeys.NAME]) {
                        assert.fail('Fields should be generated with a name');
                    }

                    if (!field[fieldConsts.fieldKeys.TYPE]) {
                        assert.fail('Fields should be generated with a type');
                    }

                    if (field[fieldConsts.fieldKeys.BUILT_IN] === true) {
                        assert.fail('Fields should be have builtin set after applying defaults');
                    }

                    if (!field[fieldConsts.fieldKeys.DATA_IS_COPYABLE]) {
                        assert.fail('Fields should have dataIsCopyable set after applying defaults');
                    }

                    if (!field[fieldConsts.fieldKeys.INCLUDE_IN_QUICKSEARCH]) {
                        assert.fail('Fields should have includeInQuicksearch set after applying defaults');
                    }

                    var fieldIsValidWithDefaultValues = fieldGenerator.validateFieldProperties(field);
                    assert.equal(fieldIsValidWithDefaultValues, true, 'Found field property that is not valid for' + JSON.stringify(field));
                    done();
                });
            });
        });

    });


}());
