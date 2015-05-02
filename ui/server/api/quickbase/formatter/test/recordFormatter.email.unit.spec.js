'use strict';

var should = require('should');
var recordFormatter = require('./../recordFormatter')();
var assert = require('assert');

/**
 * Unit tests for EmailAddress field formatting
 */
describe('Email address record formatter unit test', function () {

    /**
     * Helper method to generate random strings
     */
    function generateRandomString(size) {
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        var text = '';
        for (var i = 0; i < size; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    /**
     * DataProvider containing Records, FieldProperties and record display expectations EmailAddress fields
     */
    function emailDataProvider() {
        var fullEmail = "firstName_lastName@quickbase.com";
        var linkText = "some link text";

        // Generate a maximum email address
        // Maximum valid email length is 256 which equals -> firstName(100) + "_"(1) + lastName (100) + domain(55)
        var domain = "@" + generateRandomString(50) + ".com";
        var firstName = generateRandomString(100);
        var lastName = generateRandomString(100);
        var fullName = firstName + "_" + lastName;
        var maxEmail =  fullName + domain;

        /**
         * FieldInfo and expectations for flag: no flags
         */
        var fieldInfo_NoFlags = [{
            "id": 7,
            "name": "email",
            "type": "EMAIL_ADDRESS",
            "clientSideAttributes": {
            }
        }];

        // Various email address inputs
        var inputEmailRecord =  [[{
            "id": 7,
            "value": fullEmail}]];
        var expectedEmail_NoFlags = [[{
            "id": 7,
            "value": fullEmail,
            "display": fullEmail}]];

        var maxEmailRecord =  [[{
            "id": 7,
            "value": maxEmail}]];
        var expectedMaxEmail_NoFlags = [[{
            "id": 7,
            "value": maxEmail,
            "display": maxEmail}]];

        /**
         * FieldInfo and expectations for flag: entire email flag
         */
        var fieldInfo_EntireEmail = JSON.parse(JSON.stringify(fieldInfo_NoFlags));
        fieldInfo_EntireEmail[0].clientSideAttributes.format = "WHOLE";
        var expectedEmail_EntireEmailFlag = JSON.parse(JSON.stringify(expectedEmail_NoFlags));
        var expectedMaxEmail_EntireEmailFlag = JSON.parse(JSON.stringify(expectedMaxEmail_NoFlags));

        /**
         * FieldInfo and expectations for flag: before @ flag
         */
        var fieldInfo_BeforeAtSign = JSON.parse(JSON.stringify(fieldInfo_NoFlags));
        fieldInfo_BeforeAtSign[0].clientSideAttributes.format = "UP_TO_AT_SIGN";
        var expectedEmail_BeforeAtSignFlag = JSON.parse(JSON.stringify(expectedEmail_NoFlags));
        expectedEmail_BeforeAtSignFlag[0].display = "firstName_lastName";
        var expectedMaxEmail_BeforeAtSignFlag = JSON.parse(JSON.stringify(expectedMaxEmail_NoFlags));
        expectedMaxEmail_BeforeAtSignFlag[0].display = fullName;

        /**
         * FieldInfo and expectations for flag: before first "_" flag
         */
        var fieldInfo_BeforeUnderscore = JSON.parse(JSON.stringify(fieldInfo_NoFlags));
        fieldInfo_BeforeUnderscore[0].clientSideAttributes.format = "UP_TO_UNDERSCORE";
        var expectedEmail_BeforeUnderscoreFlag = JSON.parse(JSON.stringify(expectedEmail_NoFlags));
        expectedEmail_BeforeUnderscoreFlag[0].display = "firstName";
        var expectedMaxEmail_BeforeUnderscoreFlag = JSON.parse(JSON.stringify(expectedMaxEmail_NoFlags));
        expectedMaxEmail_BeforeUnderscoreFlag[0].display = firstName;

        /**
         * FieldInfo and expectations for flag: link text flag
         */
        var fieldInfo_LinkText = JSON.parse(JSON.stringify(fieldInfo_NoFlags));
        fieldInfo_LinkText[0].clientSideAttributes.linkText = linkText;
        var expectedEmail_LinkTextFlag = JSON.parse(JSON.stringify(expectedEmail_NoFlags));
        expectedEmail_LinkTextFlag[0].display = linkText;
        var expectedMaxEmail_LinkTextFlag = JSON.parse(JSON.stringify(expectedMaxEmail_NoFlags));
        expectedMaxEmail_LinkTextFlag[0].display = linkText;

        /**
         * FieldInfo and expectations for flag: all flags
         */
        var fieldInfo_AllFlags = JSON.parse(JSON.stringify(fieldInfo_NoFlags));
        fieldInfo_AllFlags[0].clientSideAttributes.format = "WHOLE";
        fieldInfo_AllFlags[0].clientSideAttributes.linkText = linkText;
        var expectedEmail_AllFlags = JSON.parse(JSON.stringify(expectedEmail_NoFlags));
        expectedEmail_AllFlags[0].display = linkText;
        var expectedMaxEmail_AllFlags = JSON.parse(JSON.stringify(expectedMaxEmail_NoFlags));
        expectedMaxEmail_AllFlags[0].display = linkText;

        var recordsNull = JSON.parse(JSON.stringify(inputEmailRecord));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedEmail_NoFlags));
        expectedNull[0][0].display = "";
        expectedNull[0][0].value = null;

        var recordsEmpty = JSON.parse(JSON.stringify(inputEmailRecord));
        recordsEmpty[0][0].value = "";
        var expectedEmpty = JSON.parse(JSON.stringify(expectedEmail_NoFlags));
        expectedEmpty[0][0].display = "";
        expectedEmpty[0][0].value = "";

        var cases =[
            // Standard email
            { message: "Email - standard email with no flags", records: inputEmailRecord, fieldInfo: fieldInfo_NoFlags, expectedRecords: expectedEmail_NoFlags },
            { message: "Email - standard email with 'entire email' flag", records: inputEmailRecord, fieldInfo: fieldInfo_EntireEmail, expectedRecords: expectedEmail_EntireEmailFlag },
            { message: "Email - standard email with 'before @' flag", records: inputEmailRecord, fieldInfo: fieldInfo_BeforeAtSign, expectedRecords: expectedEmail_BeforeAtSignFlag },
            { message: "Email - standard email with 'before _' flag", records: inputEmailRecord, fieldInfo: fieldInfo_BeforeUnderscore, expectedRecords: expectedEmail_BeforeUnderscoreFlag },
            { message: "Email - standard email with link text flag", records: inputEmailRecord, fieldInfo: fieldInfo_LinkText, expectedRecords: expectedEmail_LinkTextFlag },
            { message: "Email - standard email with all flags", records: inputEmailRecord, fieldInfo: fieldInfo_AllFlags, expectedRecords: expectedEmail_AllFlags },

            // Maximum valid email
            { message: "Email - maximum email with no flags", records: maxEmailRecord, fieldInfo: fieldInfo_NoFlags, expectedRecords: expectedMaxEmail_NoFlags },
            { message: "Email - maximum email with 'entire email' flag", records: maxEmailRecord, fieldInfo: fieldInfo_EntireEmail, expectedRecords: expectedMaxEmail_EntireEmailFlag },
            { message: "Email - maximum email with 'before @' flag", records: maxEmailRecord, fieldInfo: fieldInfo_BeforeAtSign, expectedRecords: expectedMaxEmail_BeforeAtSignFlag },
            { message: "Email - maximum email with 'before _' flag", records: maxEmailRecord, fieldInfo: fieldInfo_BeforeUnderscore, expectedRecords: expectedMaxEmail_BeforeUnderscoreFlag },
            { message: "Email - maximum email with link text flag", records: maxEmailRecord, fieldInfo: fieldInfo_LinkText, expectedRecords: expectedMaxEmail_LinkTextFlag },
            { message: "Email - maximum email with all flags", records: maxEmailRecord, fieldInfo: fieldInfo_AllFlags, expectedRecords: expectedMaxEmail_AllFlags },


            { message: "Email - null -> empty string", records: recordsNull, fieldInfo: fieldInfo_NoFlags, expectedRecords: expectedNull },
            { message: "Email - empty string -> empty string", records: recordsEmpty, fieldInfo: fieldInfo_NoFlags, expectedRecords: expectedEmpty },
        ];

        return cases;
    }

    /**
     * Unit test that validates EmailAddress records formatting with various field property flags set
     */
    describe('should format an email address record with various properties for display',function(){
        emailDataProvider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                //console.log('expected: ' + JSON.stringify(entry.expectedRecords));
                //console.log('actual  : ' + JSON.stringify(formattedRecords));
                assert.equal(JSON.stringify(formattedRecords), JSON.stringify(entry.expectedRecords), entry.message);
                done();
            });
        });
    });
});