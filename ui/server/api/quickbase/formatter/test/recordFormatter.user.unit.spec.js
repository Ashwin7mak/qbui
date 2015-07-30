'use strict';

var should = require('should');
var recordFormatter = require('./../recordFormatter')();
var assert = require('assert');

/**
 * Unit tests for User field formatting
 */
describe('User record formatter unit test', function () {

    /**
     * DataProvider containing Records, FieldProperties and record display expectations User fields
     */
    function userDataProvider() {
        var userString = '{"userId":"RYVP73_UB", "firstName":"dave", "lastName":"isaman", "screenName":"disaman", "email":"disaman@intuit.com", ' +
            '"deactivated":false, "anonymous":false, "administrator":false, "intuitID":"rc0isu4jlxqmjvqfhnp9", "userProps":null, ' +
            '"sysRights":null, "challengeQuestion":"who is your favorite scrum team?", "challengeAnswer":"blue", ' +
            '"password":"rxrr4z2ci1pvwhax2lr1", "placeHolderId":null, "ticketVersion":0}';
        var user = JSON.parse(userString);
        var fullName = "dave isaman";
        var lastThenFirst = "isaman, dave";
        var userName = "disaman";
        var userId = "RYVP73_UB";

        /**
         * FieldInfo and expectations for no flags
         */
        var fieldInfo_NoFlags = [{
            "id": 7,
            "name": "user",
            "type":"SCALAR",
            "datatypeAttributes": {
                "type": "USER"
            }
          }];

        var recordInputUser =  [[{
            "id": 7,
            "value": user}]];
        var expectedUser_NoFlags = [[{
            "id": 7,
            "value": user,
            "display": lastThenFirst}]];

        /**
         * FieldInfo and expectations for enabled flag: .datatypeAttributes.userDisplayFormat = FULL_NAME
         */
        var fieldInfo_FullNameFormat = JSON.parse(JSON.stringify(fieldInfo_NoFlags));
        fieldInfo_FullNameFormat[0].datatypeAttributes.userDisplayFormat = "FIRST_THEN_LAST";
        var expectedUser_FullNameFormat = JSON.parse(JSON.stringify(expectedUser_NoFlags));
        expectedUser_FullNameFormat[0][0].display = fullName;

        /**
         * FieldInfo and expectations for disabled flag: .datatypeAttributes.userDisplayFormat = LAST_THEN_FIRST
         */
        var fieldInfo_LastThenFirstFormat = JSON.parse(JSON.stringify(fieldInfo_NoFlags));
        fieldInfo_LastThenFirstFormat[0].datatypeAttributes.userDisplayFormat = "LAST_THEN_FIRST";
        var expectedUser_LastThenFirstFormat = JSON.parse(JSON.stringify(expectedUser_NoFlags));
        expectedUser_LastThenFirstFormat[0][0].display = lastThenFirst;

        /**
         * FieldInfo and expectations for flag: .datatypeAttributes.userDisplayFormat = USER_NAME
         */
        var fieldInfo_UserNameFormat = JSON.parse(JSON.stringify(fieldInfo_NoFlags));
        fieldInfo_UserNameFormat[0].datatypeAttributes.userDisplayFormat = "SCREEN_NAME";
        var expectedUser_UserNameFormat = JSON.parse(JSON.stringify(expectedUser_NoFlags));
        expectedUser_UserNameFormat[0][0].display = userName;

        /**
         * FieldInfo and expectations for flag: .datatypeAttributes.userDisplayFormat = USER_NAME
         */
        var fieldInfo_UserIdFormat = JSON.parse(JSON.stringify(fieldInfo_NoFlags));
        fieldInfo_UserIdFormat[0].datatypeAttributes.userDisplayFormat = "USER_ID";
        var expectedUser_UserIdFormat = JSON.parse(JSON.stringify(expectedUser_NoFlags));
        expectedUser_UserIdFormat[0][0].display = userId;

        /**
         * Expectations for empty and null URL values
         */
        var recordsNull = JSON.parse(JSON.stringify(recordInputUser));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedUser_NoFlags));
        expectedNull[0][0].value = null;
        expectedNull[0][0].display = "";

        var recordsEmpty = JSON.parse(JSON.stringify(recordInputUser));
        recordsEmpty[0][0].value = "";
        var expectedEmpty = JSON.parse(JSON.stringify(expectedUser_NoFlags));
        expectedEmpty[0][0].value = "";
        expectedEmpty[0][0].display = "";

        var cases =[
            // No flags
            { message: "User - user with no flags", records: recordInputUser, fieldInfo: fieldInfo_NoFlags, expectedRecords: expectedUser_NoFlags },

            // FullName DisplayFormat flag
            { message: "User - user with 'fullName' flag", records: recordInputUser, fieldInfo: fieldInfo_FullNameFormat, expectedRecords: expectedUser_FullNameFormat },

            // LastThenFirst DisplayFormat flag
            { message: "User - user with 'lastThenFirst' flag", records: recordInputUser, fieldInfo: fieldInfo_LastThenFirstFormat, expectedRecords: expectedUser_LastThenFirstFormat },

            // UserName DisplayFormat flag
            { message: "User - user with 'userName' flag", records: recordInputUser, fieldInfo: fieldInfo_UserNameFormat, expectedRecords: expectedUser_UserNameFormat },

            // UserName DisplayFormat flag
            { message: "User - user with 'userId' flag", records: recordInputUser, fieldInfo: fieldInfo_UserIdFormat, expectedRecords: expectedUser_UserIdFormat },

            // Null and Empty User strings
            { message: "User - null -> empty string", records: recordsNull, fieldInfo: fieldInfo_NoFlags, expectedRecords: expectedNull },
            { message: "User - empty string -> empty string", records: recordsEmpty, fieldInfo: fieldInfo_NoFlags, expectedRecords: expectedEmpty }
        ];

        return cases;
    }

    /**
     * Unit test that validates User records formatting with various field property flags set
     */
    describe('should format an User record with various properties for display',function(){
        userDataProvider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
                done();
            });
        });
    });
});
