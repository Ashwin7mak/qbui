'use strict';

var should = require('should');
var recordFormatter = require('./../recordFormatter')();
var assert = require('assert');

/**
 * Unit tests for ReportLink field formatting
 */
describe('ReportLink record formatter unit test', function () {

    /**
     * DataProvider containing Records, FieldProperties and record display expectations ReportLink fields
     */
    function reportLinkDataProvider() {

        var httpURL = "http://www.intuit.com";
        var httpWOProto = httpURL.split("//")[1];
        var httpsURL = "https://www.google.com";
        var httpsWOProto = httpsURL.split("//")[1];
        var noProtoURL = "www.quickbase.com/some/url/location.html";
        var linkText = "some link text";

        /**
         * FieldInfo and expectations for no flags
         */
        var fieldInfo_NoFlags = [{
            "id": 7,
            "name": "reportLink",
            "type": "REPORT_LINK",
            "clientSideAttributes": {
            }
        }];
        var recordInputHttpURL =  [[{
            "id": 7,
            "value": httpURL}]];
        var expectedHttpURL_NoFlags = [[{
            "id": 7,
            "value": httpURL,
            "display": httpURL}]];

        var recordInputHttpsURL = JSON.parse(JSON.stringify(recordInputHttpURL));
        recordInputHttpsURL[0][0].value = httpsURL;
        var expectedHttpsURL_NoFlags = [[{
            "id": 7,
            "value": httpsURL,
            "display": httpsURL}]];

        var recordInputNoProtoURL = JSON.parse(JSON.stringify(recordInputHttpURL));
        recordInputNoProtoURL[0][0].value = noProtoURL;
        var expectedNoProtoURL_NoFlags = [[{
            "id": 7,
            "value": noProtoURL,
            "display": noProtoURL}]];

        /**
         * FieldInfo and expectations for enabled flag: displayProtocol = true
         */
        var fieldInfo_DontShowHTTPEnabled = JSON.parse(JSON.stringify(fieldInfo_NoFlags));
        fieldInfo_DontShowHTTPEnabled[0].displayProtocol = false;
        var expectedHttpURL_DontShowHTTPEnabled = JSON.parse(JSON.stringify(expectedHttpURL_NoFlags));
        expectedHttpURL_DontShowHTTPEnabled[0][0].display = httpWOProto;
        var expectedHttpsURL_DontShowHTTPEnabled = JSON.parse(JSON.stringify(expectedHttpsURL_NoFlags));
        expectedHttpsURL_DontShowHTTPEnabled[0][0].display = httpsWOProto;
        var expectedNoProtoURL_DontShowHTTPEnabled = JSON.parse(JSON.stringify(expectedNoProtoURL_NoFlags));

        /**
         * FieldInfo and expectations for disabled flag: displayProtocol = false
         */
        var fieldInfo_DontShowHTTPDisabled = JSON.parse(JSON.stringify(fieldInfo_NoFlags));
        fieldInfo_DontShowHTTPDisabled[0].displayProtocol = true;
        var expectedHttpURL_DontShowHTTPDisabled = JSON.parse(JSON.stringify(expectedHttpURL_NoFlags));
        var expectedHttpsURL_DontShowHTTPDisabled = JSON.parse(JSON.stringify(expectedHttpsURL_NoFlags));
        var expectedNoProtoURL_DontShowHTTPDisabled = JSON.parse(JSON.stringify(expectedNoProtoURL_NoFlags));

        /**
         * FieldInfo and expectations for flag: linkText
         */
        var fieldInfo_LinkTextFlag = JSON.parse(JSON.stringify(fieldInfo_NoFlags));
        fieldInfo_LinkTextFlag[0].linkText = linkText;
        var expectedHttpURL_LinkTextFlag = JSON.parse(JSON.stringify(expectedHttpURL_NoFlags));
        expectedHttpURL_LinkTextFlag[0][0].display = linkText;
        var expectedHttpsURL_LinkTextFlag = JSON.parse(JSON.stringify(expectedHttpsURL_NoFlags));
        expectedHttpsURL_LinkTextFlag[0][0].display = linkText;
        var expectedNoProtoURL_LinkTextFlag = JSON.parse(JSON.stringify(expectedNoProtoURL_NoFlags));
        expectedNoProtoURL_LinkTextFlag[0][0].display = linkText;

        /**
         * FieldInfo and expectations for all flags
         */
        var fieldInfo_AllFlags = JSON.parse(JSON.stringify(fieldInfo_NoFlags));
        fieldInfo_AllFlags[0].displayProtocol = true;
        fieldInfo_AllFlags[0].linkText = linkText;
        var expectedHttpURL_AllFlags = JSON.parse(JSON.stringify(expectedHttpURL_NoFlags));
        expectedHttpURL_AllFlags[0][0].display = linkText;
        var expectedHttpsURL_AllFlags = JSON.parse(JSON.stringify(expectedHttpsURL_NoFlags));
        expectedHttpsURL_AllFlags[0][0].display = linkText;
        var expectedNoProtoURL_AllFlags = JSON.parse(JSON.stringify(expectedNoProtoURL_NoFlags));
        expectedNoProtoURL_AllFlags[0][0].display = linkText;

        /**
         * Expectations for empty and null URL values
         */
        var recordsNull = JSON.parse(JSON.stringify(recordInputHttpURL));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedHttpURL_NoFlags));
        expectedNull[0][0].display = "";
        expectedNull[0][0].value = null;

        var recordsEmpty = JSON.parse(JSON.stringify(recordInputHttpURL));
        recordsEmpty[0][0].value = "";
        var expectedEmpty = JSON.parse(JSON.stringify(expectedHttpURL_NoFlags));
        expectedEmpty[0][0].display = "";
        expectedEmpty[0][0].value = "";

        var cases =[
            // No flags
            { message: "ReportLink - http url with no flags", records: recordInputHttpURL, fieldInfo: fieldInfo_NoFlags, expectedRecords: expectedHttpURL_NoFlags },
            { message: "ReportLink - https url with no flags", records: recordInputHttpsURL, fieldInfo: fieldInfo_NoFlags, expectedRecords: expectedHttpsURL_NoFlags },
            { message: "ReportLink - no protocol url with no flags", records: recordInputNoProtoURL, fieldInfo: fieldInfo_NoFlags, expectedRecords: expectedNoProtoURL_NoFlags },

            // Don't Show Http flag enabled
            { message: "ReportLink - http url with 'don't show Http' flag", records: recordInputHttpURL, fieldInfo: fieldInfo_DontShowHTTPEnabled, expectedRecords: expectedHttpURL_DontShowHTTPEnabled },
            { message: "ReportLink - https url with 'don't show Http' flag", records: recordInputHttpsURL, fieldInfo: fieldInfo_DontShowHTTPEnabled, expectedRecords: expectedHttpsURL_DontShowHTTPEnabled },
            { message: "ReportLink - no protocol url with 'don't show Http' flag", records: recordInputNoProtoURL, fieldInfo: fieldInfo_DontShowHTTPEnabled, expectedRecords: expectedNoProtoURL_DontShowHTTPEnabled },

            // Don't Show Http flag disabled
            { message: "ReportLink - http url with 'don't show Http' flag disabled", records: recordInputHttpURL, fieldInfo: fieldInfo_DontShowHTTPDisabled, expectedRecords: expectedHttpURL_DontShowHTTPDisabled },
            { message: "ReportLink - https url with 'don't show Http' flag disabled", records: recordInputHttpsURL, fieldInfo: fieldInfo_DontShowHTTPDisabled, expectedRecords: expectedHttpsURL_DontShowHTTPDisabled },
            { message: "ReportLink - no protocol url with 'don't show Http' flag disabled", records: recordInputNoProtoURL, fieldInfo: fieldInfo_DontShowHTTPDisabled, expectedRecords: expectedNoProtoURL_DontShowHTTPDisabled },

            // LinkText flag
            { message: "ReportLink - http url with 'link text' flag", records: recordInputHttpURL, fieldInfo: fieldInfo_LinkTextFlag, expectedRecords: expectedHttpURL_LinkTextFlag },
            { message: "ReportLink - https url with 'link text' flag", records: recordInputHttpsURL, fieldInfo: fieldInfo_LinkTextFlag, expectedRecords: expectedHttpsURL_LinkTextFlag },
            { message: "ReportLink - no protocol url with 'link text' flag", records: recordInputNoProtoURL, fieldInfo: fieldInfo_LinkTextFlag, expectedRecords: expectedNoProtoURL_LinkTextFlag },

            // All flags
            { message: "ReportLink - http url with all flags", records: recordInputHttpURL, fieldInfo: fieldInfo_AllFlags, expectedRecords: expectedHttpURL_AllFlags },
            { message: "ReportLink - https url with all flags", records: recordInputHttpsURL, fieldInfo: fieldInfo_AllFlags, expectedRecords: expectedHttpsURL_AllFlags },
            { message: "ReportLink - no protocol url with all flags", records: recordInputNoProtoURL, fieldInfo: fieldInfo_AllFlags, expectedRecords: expectedNoProtoURL_AllFlags },

            // Null and Empty URL strings
            { message: "ReportLink - null -> empty string", records: recordsNull, fieldInfo: fieldInfo_NoFlags, expectedRecords: expectedNull },
            { message: "ReportLink - empty string -> empty string", records: recordsEmpty, fieldInfo: fieldInfo_NoFlags, expectedRecords: expectedEmpty },
        ];

        return cases;
    }

    /**
     * Unit test that validates ReportLink records formatting with various field property flags set
     */
    describe('should format an ReportLink record with various properties for display',function(){
        reportLinkDataProvider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                //console.log('entry: ' + JSON.stringify(entry));
                //console.log('formatted value: ' + JSON.stringify(formattedRecords));
                assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
                done();
            });
        });
    });
});