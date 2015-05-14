'use strict';

var should = require('should');
var recordFormatter = require('./../recordFormatter')();
var assert = require('assert');

/**
 * Unit tests for FileAttachment field formatting
 */
describe('FileAttachment record formatter unit test', function () {

    /**
     * DataProvider containing Records, FieldProperties and record display expectations FileAttachment fields
     */
    function fileAttachmentDataProvider() {

        var localFile = "c:/local/package/file/batFile.bat";
        var urlFile = "www.intuit.com/some/file/zipFile.zip";
        var httpsURLFile = "https://www.intuit.com/some/file/zipFile.zip";
        var linkText = "some link text";

        /**
         * FieldInfo and expectations for no flags
         */
        var fieldInfo_NoFlags = [{
            "id": 7,
            "name": "file",
            "type": "FILE_ATTACHMENT"
         }];

        var recordInputLocalFile =  [[{
            "id": 7,
            "value": localFile}]];
        var recordInputURLFile = JSON.parse(JSON.stringify(recordInputLocalFile));
        recordInputURLFile[0][0].value = urlFile;
        var recordInputHttpsURLFile = JSON.parse(JSON.stringify(recordInputLocalFile));
        recordInputHttpsURLFile[0][0].value = httpsURLFile;

        var expectedLocalFile_NoFlags = [[{
            "id": 7,
            "value": localFile,
            "display": localFile}]];
        var expectedURLFile_NoFlags = JSON.parse(JSON.stringify(expectedLocalFile_NoFlags));
        expectedURLFile_NoFlags[0][0].value = urlFile;
        expectedURLFile_NoFlags[0][0].display = urlFile;
        var expectedHttpsURLFile_NoFlags = JSON.parse(JSON.stringify(expectedLocalFile_NoFlags));
        expectedHttpsURLFile_NoFlags[0][0].value = httpsURLFile;
        expectedHttpsURLFile_NoFlags[0][0].display = httpsURLFile;


        /**
         * FieldInfo and expectations for all flags
         */
        var fieldInfo_AllFlags = JSON.parse(JSON.stringify(fieldInfo_NoFlags));
        fieldInfo_AllFlags[0].linkText = linkText;
        var expectedLocalFile_AllFlags = JSON.parse(JSON.stringify(expectedLocalFile_NoFlags));
        expectedLocalFile_AllFlags[0][0].value = localFile;
        expectedLocalFile_AllFlags[0][0].display = linkText;
        var expectedURLFile_AllFlags = JSON.parse(JSON.stringify(expectedLocalFile_NoFlags));
        expectedURLFile_AllFlags[0][0].value = urlFile;
        expectedURLFile_AllFlags[0][0].display = linkText;
        var expectedHttpsURLFile_AllFlags = JSON.parse(JSON.stringify(expectedLocalFile_NoFlags));
        expectedHttpsURLFile_AllFlags[0][0].value = httpsURLFile;
        expectedHttpsURLFile_AllFlags[0][0].display = linkText;

        /**
         * Expectations for empty and null URL values
         */
        var recordsNull = JSON.parse(JSON.stringify(recordInputLocalFile));
        recordsNull[0][0].value = null;
        var expectedNull = JSON.parse(JSON.stringify(expectedLocalFile_NoFlags));
        expectedNull[0][0].display = "";
        expectedNull[0][0].value = null;

        var recordsEmpty = JSON.parse(JSON.stringify(recordInputLocalFile));
        recordsEmpty[0][0].value = "";
        var expectedEmpty = JSON.parse(JSON.stringify(expectedLocalFile_NoFlags));
        expectedEmpty[0][0].display = "";
        expectedEmpty[0][0].value = "";

        var cases =[
            // No flags
            { message: "FileAttachment - local file with no flags", records: recordInputLocalFile, fieldInfo: fieldInfo_NoFlags, expectedRecords: expectedLocalFile_NoFlags },
            { message: "FileAttachment - http url file with no flags", records: recordInputURLFile, fieldInfo: fieldInfo_NoFlags, expectedRecords: expectedURLFile_NoFlags },
            { message: "FileAttachment - https url file with no flags", records: recordInputHttpsURLFile, fieldInfo: fieldInfo_NoFlags, expectedRecords: expectedHttpsURLFile_NoFlags },

            // All flags
            { message: "FileAttachment - local file with all flags", records: recordInputLocalFile, fieldInfo: fieldInfo_AllFlags, expectedRecords: expectedLocalFile_AllFlags },
            { message: "FileAttachment - http url file with all flags", records: recordInputURLFile, fieldInfo: fieldInfo_AllFlags, expectedRecords: expectedURLFile_AllFlags },
            { message: "FileAttachment - https url file with all flags", records: recordInputHttpsURLFile, fieldInfo: fieldInfo_AllFlags, expectedRecords: expectedHttpsURLFile_AllFlags },

            // Null and Empty File strings
            { message: "FileAttachment - null -> empty string", records: recordsNull, fieldInfo: fieldInfo_NoFlags, expectedRecords: expectedNull },
            { message: "FileAttachment - empty string -> empty string", records: recordsEmpty, fieldInfo: fieldInfo_NoFlags, expectedRecords: expectedEmpty }
        ];

        return cases;
    }

    /**
     * Unit test that validates FileAttachment records formatting with various field property flags set
     */
    describe('should format an FileAttachment record with various properties for display',function(){
        fileAttachmentDataProvider().forEach(function(entry){
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