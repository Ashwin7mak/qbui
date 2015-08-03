'use strict';

var should = require('should');
var recordFormatter = require('./../recordFormatter')();
var assert = require('assert');

describe('Percent record formatter unit test', function () {
    /**
     * DataProvider containing Records, FieldProperties and record display expectations for percent field
     */
    function provider() {
        var numberDecimalOnly = .74765432;

        //Incomplete number
        var defaultRecordInput =  [[{
            id: 7,
            value: numberDecimalOnly}]];
        var defaultRecordExp = [[{
            id: 7,
            value: numberDecimalOnly,
            display: ''}]];

        // Setup the record inputs
        var recordInputDecimalOnly = JSON.parse(JSON.stringify(defaultRecordInput));

        var noFlagsFieldInfo = [{
            id: 7,
            name: 'percent',
            datatypeAttributes: {
                type: 'PERCENT',
                decimalPlaces: 2,
                clientSideAttributes: {}
            },
            type:'SCALAR'
        }];

        var expectedDecimal_NoFlags = JSON.parse(JSON.stringify(defaultRecordExp));
        expectedDecimal_NoFlags[0][0].value = numberDecimalOnly;
        expectedDecimal_NoFlags[0][0].display = '0.75%';


        var cases =[
            { message: 'Numeric - decimal with no format', records: recordInputDecimalOnly, fieldInfo: noFlagsFieldInfo, expectedRecords: expectedDecimal_NoFlags }
        ];

        return cases;
    }

    describe('should format a percent record with various properties for display',function(){
        provider().forEach(function(entry){
            it('Test case: ' + entry.message, function (done) {
                var formattedRecords = recordFormatter.formatRecords(entry.records, entry.fieldInfo);
                assert.deepEqual(formattedRecords, entry.expectedRecords, entry.message);
                done();
            });
        });
    });
});