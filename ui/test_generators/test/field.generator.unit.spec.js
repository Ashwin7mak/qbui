/**
 * A test to test our test generation code
 * Created by cschneider1 on 6/1/15.
 */
'use strict';

var should = require('should');
var fieldGenerator = require('../field.generator');
var fieldConsts = require('../field.constants');
var consts = require('../../server/api/constants');
var assert = require('assert');

/**
 * Unit tests for field generator
 */
describe('Field generator unit test', function () {
    /**
     * DataProvider containing Records, FieldProperties and record display expectations PhoneNumber fields
     */
    function provider() {

        return [
            {message: "checkbox field", fieldType: consts.CHECKBOX},
            {message: "text field", fieldType: consts.TEXT},
            {message: "multi line text field", fieldType: consts.MULTI_LINE_TEXT},
            {message: "phone number field", fieldType: consts.PHONE_NUMBER},
            {message: "date field", fieldType: consts.DATE},
            {message: "formula duration field", fieldType: consts.FORMULA_DURATION},
            {message: "formula date field", fieldType: consts.FORMULA_DATE},
            {message: "duration field", fieldType: consts.DURATION},
            {message: "formula time of day field", fieldType: consts.FORMULA_TIME_OF_DAY},
            {message: "time of day field", fieldType: consts.TIME_OF_DAY},
            {message: "numeric field", fieldType: consts.NUMERIC},
            {message: "formula numeric field", fieldType: consts.FORMULA_NUMERIC},
            {message: "currency field", fieldType: consts.CURRENCY},
            {message: "rating field", fieldType: consts.RATING},
            {message: "formula currency field", fieldType: consts.FORMULA_CURRENCY},
            {message: "percent field", fieldType: consts.PERCENT},
            {message: "formula percent field", fieldType: consts.FORMULA_PERCENT},
            {message: "url field", fieldType: consts.URL},
            {message: "email address field", fieldType: consts.EMAIL_ADDRESS},
            {message: "user field", fieldType: consts.USER},
            {message: "formula user field", fieldType: consts.FORMULA_USER},
            {message: "file attachment field", fieldType: consts.FILE_ATTACHMENT},
            {message: "report link field", fieldType: consts.REPORT_LINK},
            {message: "summary field", fieldType: consts.SUMMARY},
            {message: "lookup field", fieldType: consts.LOOKUP},
            {message: "formula phone number field", fieldType: consts.FORMULA_PHONE_NUMBER},
            {message: "formula url field", fieldType: consts.FORMULA_URL},
            {message: "formula checkbox field", fieldType: consts.FORMULA_CHECKBOX},
            {message: "formula text field", fieldType: consts.FORMULA_TEXT},
            {message: "formula email address field", fieldType: consts.FORMULA_EMAIL_ADDRESS}
        ];
    }

    /**
     * Unit test that validates generating fields by type
     */
    describe('should create a base field of a particular type',function(){
        provider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var field = fieldGenerator.generateBaseField(entry.fieldType);

                console.log('field: ' + JSON.stringify(field));

                if(!field[fieldConsts.fieldKeys.NAME]){
                    assert.fail('Fields should be generated with a name');
                }

                if(!field[fieldConsts.fieldKeys.TYPE]){
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
    describe('should create a base field and apply defaults for a particular type',function(){
        provider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var field = fieldGenerator.generateBaseField(entry.fieldType);
                fieldGenerator.applyDefaults(field);
                console.log('field: ' + JSON.stringify(field));

                if(!field[fieldConsts.fieldKeys.NAME]){
                    assert.fail('Fields should be generated with a name');
                }

                if(!field[fieldConsts.fieldKeys.TYPE]){
                    assert.fail('Fields should be generated with a type');
                }

                if(field[fieldConsts.fieldKeys.BUILT_IN] == true){
                    assert.fail('Fields should be have builtin set after applying defaults');
                }

                if(!field[fieldConsts.fieldKeys.DATA_IS_COPYABLE] == true){
                    assert.fail('Fields should have dataIsCopyable set after applying defaults');
                }

                if(!field[fieldConsts.fieldKeys.INCLUDE_IN_QUICKSEARCH] == true){
                    assert.fail('Fields should have includeInQuicksearch set after applying defaults');
                }

                var fieldIsValidWithDefaultValues = fieldGenerator.validateFieldProperties(field);
                assert.equal(fieldIsValidWithDefaultValues, true, 'Found field property that is not valid for' + JSON.stringify(field));
                done();
            });
        });
    });

});


