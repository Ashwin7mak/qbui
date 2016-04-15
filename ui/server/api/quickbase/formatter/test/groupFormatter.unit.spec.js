/**
 * Created by dhatch on 4/15/16.
 */

var assert = require('assert');
var constants = require('../../../constants');
var groupFormatter = require('./../groupFormatter');

describe('Validate GroupFormatter unit tests', function() {

    function generateData(dataType) {
        if (dataType === constants.TEXT) {
            return (0 | Math.random() * 9e6).toString(36);
        }
        return '';
    }

    function setupRecords(numOfFields, numOfRecords, dataType, gList) {
        var setup = {
            fields: [],
            records: [],
            req: ''
        };

        var field;
        for (var idx = 1; idx <= numOfFields; idx++) {
            field = {
                id: idx,
                name: 'fieldName_' + idx,
                datatypeAttributes: {
                    type: dataType
                }
            };
            setup.fields.push(field);
        }

        for (var x = 1; x <= numOfRecords; x++) {
            var record = [];
            var genData = generateData(dataType);
            for (var y = 0; y < setup.fields.length; y++) {
                field = {
                    id: setup.fields[y].id,
                    display: genData,
                    value: genData
                };
                record.push(field);
            }
            setup.records.push(record);
        }

        setup.req = {
            param: function(param) {
                return gList;
            }
        };

        return setup;
    }

    it('test no grouping because of insufficient input data', function() {
        var testCases = [
            {message: 'Null glist parameter', numFields: 3, numRecords: 5, gList: null, dataType: constants.TEXT},
            {message: 'Empty glist parameter', numFields: 3, numRecords: 5, gList: '', dataType: constants.TEXT},
            {message: 'No input fields', numFields: 0, numRecords: 5, gList: '1:V', dataType: constants.TEXT},
            {message: 'No grouping specified', numFields: 4, numRecords: 10, gList: '1,2', dataType: constants.TEXT}
        ];

        testCases.forEach(function(testCase) {
            var setup = setupRecords(testCase.numFields, testCase.numRecords, testCase.dataType, testCase.gList);
            var groupData = groupFormatter.group(setup.req, setup.fields, setup.records);
            assert.equal(groupData.hasGrouping, false);
            assert.equal(groupData.fields.length, 0);
            assert.equal(groupData.totalRows, 0);
        });
    });


    it('test no grouping because of invalid grouping data', function() {
        var testCases = [
            {message: 'invalid TEXT grouping specified', numFields: 4, numRecords: 10, gList: '1:?', dataType: constants.TEXT}
        ];

        testCases.forEach(function(testCase) {
            var setup = setupRecords(testCase.numFields, testCase.numRecords, testCase.dataType, testCase.gList);
            var groupData = groupFormatter.group(setup.req, setup.fields, setup.records);
            assert.equal(groupData.hasGrouping, true);
           // assert.equal(groupData.totalRows, 0);
        });
    });

    it('test no grouping because of null input', function() {
        var setup = setupRecords(3, 5, constants.TEXT, '1:V');
        var testCases = [
            {message: 'Null fields parameter', req:setup.req, fields:null, records:setup.records},
            {message: 'Null fields parameter', req:setup.req, fields:setup.fields, records:null},
            {message: 'Null fields parameter', req:setup.req, fields:null, records:null}
        ];

        testCases.forEach(function(testCase) {
            var groupData = groupFormatter.group(testCase.req, testCase.fields, testCase.records);
            assert.equal(groupData.hasGrouping, false);
            assert.equal(groupData.fields.length, 0);
            assert.equal(groupData.totalRows, 0);
        });
    });

    it('test grouping - TEXT fields', function() {
        var testCases = [
            {message: 'No input records', numFields: 5, numRecords: 0, gList: '1:V', dataType: constants.TEXT},
            {message: 'Input with one equals grouping', numFields: 5, numRecords: 1, gList: '1:V', dataType: constants.TEXT},
            {message: 'Input with two equals groupings', numFields: 5, numRecords: 2, gList: '1:V.2:V', dataType: constants.TEXT},
            {message: 'Input with two first letter grouping', numFields: 5, numRecords: 2, gList: '1:F', dataType: constants.TEXT},
            {message: 'Input with two first word grouping', numFields: 5, numRecords: 2, gList: '1:I', dataType: constants.TEXT}
        ];

        testCases.forEach(function(testCase) {
            var setup = setupRecords(testCase.numFields, testCase.numRecords, testCase.dataType, testCase.gList);
            var groupData = groupFormatter.group(setup.req, setup.fields, setup.records);
            assert.equal(groupData.hasGrouping, true);
            assert.equal(groupData.totalRows, testCase.numRecords);
        });
    });

});
