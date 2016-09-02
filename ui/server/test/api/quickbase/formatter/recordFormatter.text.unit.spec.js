'use strict';

var recordFormatter = require('../../../../src/api/quickbase/formatter/recordFormatter')();
var assert = require('assert');

/**
 * Unit tests for Text field formatting
 */
describe('Text record formatter unit test', function() {

    //Generates and returns a random string of specified length
    function generateRandomString(size) {
        var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var text = '';
        for (var i = 0; i < size; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    /**
     * DataProvider containing Records, FieldProperties and record display expectations Text fields
     */
    function dataProvider() {

        var smallText = generateRandomString(5);
        var maxText = generateRandomString(4000);

        var inputSmallRecord = [[{
            id   : 7,
            value: smallText
        }]];
        var expectedSmallRecord =
                [[{
                    id     : 7,
                    value  : smallText,
                    display: smallText
                }]];

        // Text string of 4000 characters
        var inputMaxRecord = [[{
            id   : 7,
            value: maxText
        }]];
        var expectedMaxRecord =
                [[{
                    id     : 7,
                    value  : maxText,
                    display: maxText
                }]];

        //Empty records
        var emptyRecord = [[{
            id   : 7,
            value: ''
        }]];
        var expectedEmptyRecord =
                [[{
                    id     : 7,
                    value  : '',
                    display: ''
                }]];

        //null record value
        var nullRecord = [[{
            id   : 7,
            value: null
        }]];
        var nullExpectedRecord =
                [[{
                    id     : 7,
                    value  : null,
                    display: ''
                }]];

        return [
            {message: 'Text - small text', records: inputSmallRecord, expectedRecords: expectedSmallRecord},
            {message: 'Text - maximum text', records: inputMaxRecord, expectedRecords: expectedMaxRecord},
            {message: 'Text - empty text', records: emptyRecord, expectedRecords: expectedEmptyRecord},
            {message: 'Text - null text', records: nullRecord, expectedRecords: nullExpectedRecord}
        ];
    }

    /**
     * Unit test that validates Text records formatting
     */
    describe('should format a text for display', function() {
        var fieldInfo = [
            {
                id                  : 7,
                name                : 'text',
                datatypeAttributes: {
                    type: 'TEXT'
                },
                type                : 'SCALAR'
            }
        ];
        dataProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function(done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, fieldInfo);
                assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
                done();
            });
        });
    });

    /**
     * DataProvider containing Records, FieldProperties and record display expectations Text fields
     */
    function htmlTestDataProvider() {

        //with no html record value
        var noHtmlRecord = [[{
            id   : 7,
            value: "hello this is plain text"
        }]];
        var noHtmlExpectedRecord =
            [[{
                id     : 7,
                value  : "hello this is plain text",
                display: "hello this is plain text"
            }]];

        //with allowed html record value
        var withHtmlRecord = [[{
            id   : 7,
            value: "hello <blockquote>test</blockquote>  < strong> ok< / strong><"
        }]];
        var withHtmlExpectedRecord =
            [[{
                id     : 7,
                value  : "hello <blockquote>test</blockquote>  < strong> ok< / strong><",
                display: "hello <blockquote>test</blockquote>  < strong> ok< / strong>&lt;"
            }]];

        //with allowed html record value
        var onlyBannedHtmlRecord = [[{
            id   : 7,
            value: "  <script>not allowed</script>"
        }]];

        var onlyBannedHtmlExpectedRecord =
            [[{
                id     : 7,
                value  : "  <script>not allowed</script>",
                display: "  &lt;script&gt;not allowed&lt;/script&gt;"
            }]];

        //with allowed html record value
        var withBannedHtmlRecord = [[{
            id   : 7,
            value: "hello <blockquote>test</blockquote> other stuff <embed>not allowed</embed>"
        }]];
        var withBannedHtmlExpectedRecord =
            [[{
                id     : 7,
                value  : "hello <blockquote>test</blockquote> other stuff <embed>not allowed</embed>",
                display: "hello <blockquote>test</blockquote> other stuff &lt;embed&gt;not allowed&lt;/embed&gt;"
            }]];

        return [
            {message: 'Text - allowed html text', records: noHtmlRecord, expectedRecords: noHtmlExpectedRecord},
            {message: 'Text - allowed html text', records: withHtmlRecord, expectedRecords: withHtmlExpectedRecord},
            {message: 'Text - not allowed html text', records: onlyBannedHtmlRecord, expectedRecords: onlyBannedHtmlExpectedRecord},
            {message: 'Text - both allowed and not allowed html text', records: withBannedHtmlRecord, expectedRecords: withBannedHtmlExpectedRecord}
        ];
    }


    /**
     * Unit test that validates Text with html allowed records formatting
     */
    describe('should format a text with html for display', function() {
        var fieldInfo = [
            {
                id                  : 7,
                name                : 'text',
                datatypeAttributes: {
                    type: 'TEXT',
                    htmlAllowed: true
                },
                type                : 'SCALAR'
            }
        ];
        htmlTestDataProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function(done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, fieldInfo);
                assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
                done();
            });
        });
    });
});
