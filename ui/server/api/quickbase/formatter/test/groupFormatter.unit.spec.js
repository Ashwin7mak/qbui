/**
 * Created by dhatch on 4/15/16.
 */

var assert = require('assert');
var constants = require('../../../constants');
var groupFormatter = require('./../groupFormatter');
var groupUtils = require('../../../../components/utility/groupUtils');
var dateUtils = require('../../../../components/utility/dateUtils');

describe('Validate GroupFormatter unit tests', function() {

    function generateData(dataType) {
        if (dataType === constants.TEXT || dataType === constants.USER || dataType === constants.EMAIL_ADDRESS) {
            return (0 | Math.random() * 9e6).toString(36);
        }
        if (dataType === constants.NUMERIC) {
            return (0 | Math.random() * 10000000);
        }
        if (dataType === constants.DATE) {
            return dateUtils.formatDate(new Date(), '%M/%D/%Y %h:%m');
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

    describe('test no grouping because of insufficient or invalid input data', function() {
        var testCases = [
            {message: 'Null glist parameter', numFields: 3, numRecords: 5, gList: null, dataType: constants.TEXT},
            {message: 'Empty glist parameter', numFields: 3, numRecords: 5, gList: '', dataType: constants.TEXT},
            {message: 'No input fields', numFields: 0, numRecords: 5, gList: '1:V', dataType: constants.TEXT},
            {message: 'No grouping specified', numFields: 4, numRecords: 10, gList: '1.2', dataType: constants.TEXT},
            {message: 'invalid TEXT grouping specified', numFields: 4, numRecords: 10, gList: '1:?', dataType: constants.TEXT},
            {message: 'invalid TEXT grouping specified', numFields: 4, numRecords: 10, gList: 'blah', dataType: constants.TEXT}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.message, function(done) {
                var setup = setupRecords(testCase.numFields, testCase.numRecords, testCase.dataType, testCase.gList);
                var groupData = groupFormatter.group(setup.req, setup.fields, setup.records);
                assert.equal(groupData.hasGrouping, false);
                assert.equal(groupData.fields.length, 0);
                assert.equal(groupData.totalRows, 0);
                done();
            });
        });
    });

    describe('test no grouping because of null input', function() {
        var setup = setupRecords(3, 5, constants.TEXT, '1:V');
        var testCases = [
            {message: 'Null fields parameter', req:setup.req, fields:null, records:setup.records},
            {message: 'Null fields parameter', req:setup.req, fields:setup.fields, records:null},
            {message: 'Null fields parameter', req:setup.req, fields:null, records:null}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.message, function(done) {
                var groupData = groupFormatter.group(testCase.req, testCase.fields, testCase.records);
                assert.equal(groupData.hasGrouping, false);
                assert.equal(groupData.fields.length, 0);
                assert.equal(groupData.totalRows, 0);
                done();
            });
        });
    });

    describe('Valid grouping tests', function() {
        var testCases = [
            //  TEXT data type
            {message: 'TEXT: No input records', numFields: 5, numRecords: 0, gList: '1:V', dataType: constants.TEXT},
            {message: 'TEXT: Input with one equals grouping', numFields: 5, numRecords: 1, gList: '1:V', dataType: constants.TEXT},
            {message: 'TEXT: Input with two equals groupings', numFields: 5, numRecords: 2, gList: '1:V.2:V', dataType: constants.TEXT},
            {message: 'TEXT: Input with one first word grouping', numFields: 5, numRecords: 2, gList: '1:I', dataType: constants.TEXT},
            {message: 'TEXT: Input with three first letter grouping', numFields: 5, numRecords: 2, gList: '1:F.2:F.3:F', dataType: constants.TEXT},
            {message: 'TEXT: Input with multiple grouping against same fid', numFields: 5, numRecords: 2, gList: '1:I.1:V', dataType: constants.TEXT},
            //  USER data type
            {message: 'USER: No input records', numFields: 5, numRecords: 0, gList: '1:V', dataType: constants.USER},
            {message: 'USER: Input with one equals grouping', numFields: 5, numRecords: 1, gList: '1:V', dataType: constants.USER},
            {message: 'USER: Input with two equals groupings', numFields: 5, numRecords: 2, gList: '1:V.2:V', dataType: constants.USER},
            {message: 'USER: Input with one first word grouping', numFields: 5, numRecords: 2, gList: '1:I', dataType: constants.USER},
            {message: 'USER: Input with three first letter grouping', numFields: 5, numRecords: 2, gList: '1:F.2:F.3:F', dataType: constants.USER},
            {message: 'USER: Input with multiple grouping against same fid', numFields: 5, numRecords: 2, gList: '1:I.1:V', dataType: constants.USER},
            //  DATE data type
            {message: 'DATE: Input with multiple grouping against same fid', numFields: 5, numRecords: 2, gList: '1:V', dataType: constants.DATE},
            //  NUMERIC data type
            {message: 'NUMERIC: Input with multiple grouping against same fid', numFields: 5, numRecords: 2, gList: '1:V', dataType: constants.NUMERIC}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.message, function(done) {
                var setup = setupRecords(testCase.numFields, testCase.numRecords, testCase.dataType, testCase.gList);
                var groupData = groupFormatter.group(setup.req, setup.fields, setup.records);
                assert.equal(groupData.hasGrouping, true);
                assert.equal(groupData.totalRows, testCase.numRecords);

                //  keep track of how many unique fids are in the gList parameter
                var map = new Map();

                //  the order of the fids in the list must match the order in the groupData.fields array
                var groupList = testCase.gList.split(constants.REQUEST_PARAMETER.LIST_DELIMITER);
                for (var idx = 0; idx < groupList.length; idx++) {
                    var el = groupList[idx].split(constants.REQUEST_PARAMETER.GROUP_DELIMITER);
                    assert.equal(el[0], groupData.fields[idx].field.id);
                    assert.equal(el[1], groupData.fields[idx].groupType);

                    //  add the fid to the map.
                    map.set(el[0]);
                }

                //  number of valid group list elements must match the number of elements in the groupData.fields array
                assert.equal(groupList.length, groupData.fields.length);

                //  the gridColumns array should not include the fields being grouped
                assert.equal(testCase.numFields - map.size, groupData.gridColumns.length);
                done();
            });
        });
    });

});
