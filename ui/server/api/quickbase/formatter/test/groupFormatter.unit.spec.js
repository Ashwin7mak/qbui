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
        if (dataType === constants.TEXT || dataType === constants.USER) {
            return (0 | Math.random() * 9e6).toString(36);
        }
        if (dataType === constants.EMAIL_ADDRESS) {
            return (0 | Math.random() * 9e6).toString(36) + '@test.com';
        }
        if (dataType === constants.NUMERIC || dataType === constants.DURATION) {
            return (0 | Math.random() * 10000000);
        }
        if (dataType === constants.DATE || dataType === constants.DATE_TIME) {
            return dateUtils.formatDate(new Date(), '%M-%D-%Y');
        }
        if (dataType === constants.TIME_OF_DAY) {
            return dateUtils.formatDate(new Date(), '%Y-%M-%DT%h:%m:%sZ');
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

            if (dataType === constants.TIME_OF_DAY) {
                if (idx === 1) {
                    field.datatypeAttributes.timeZone = constants.EST_TIMEZONE;
                }
            }

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
            {message: 'invalid grouping specified', numFields: 4, numRecords: 10, gList: 'blah', dataType: constants.TEXT},
            {message: 'Group specified with fid=0', numFields: 4, numRecords: 10, gList: '0:V', dataType: constants.TEXT}
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

    describe('test grouping with mixture of sort only fids and grouping fids', function() {

        var testCases = [
            {message: 'Sort fid is first element in group list', sortList:'3.1:V', expectation: 0},
            {message: 'Sort fid is last element in group list', sortList:'1:V.3', expectation: 1},
            {message: 'Sort fid is last element in group list with secondard sort', sortList:'1:F.3', expectation: 1},
            {message: 'Negative sort fid is last element in group list with secondard sort', sortList:'1:F.-3', expectation: 1},
            {message: 'Sort fid is second element in group list', sortList:'1:V.2.3:V', expectation: 1},
            {message: 'Sort fid is last 2 elements in group list', sortList:'1:V.2:V.3.4', expectation: 2},
            {message: 'Sort fid is middle elements in group list', sortList:'1:V.2:V.3.4.5:V', expectation: 2}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.message, function(done) {
                var setup = setupRecords(5, 5, constants.TEXT, testCase.sortList);
                var groupData = groupFormatter.group(setup.req, setup.fields, setup.records);

                assert.equal(groupData.hasGrouping, testCase.expectation > 0);
                assert.equal(groupData.fields.length, testCase.expectation);
                done();
            });
        });
    });

    describe('Invalid grouping tests', function() {
        var testCases = [
            //  All tests have an invalid group type('ZZ') for each data type
            {message: 'TEXT', numFields: 5, numRecords: 2, gList: '1:ZZ', dataType: constants.TEXT},
            {message: 'USER', numFields: 5, numRecords: 2, gList: '1:ZZ', dataType: constants.USER},
            {message: 'EMAIL_ADDRESS', numFields: 5, numRecords: 2, gList: '1:ZZ', dataType: constants.EMAIL_ADDRESS},
            {message: 'DURATION', numFields: 5, numRecords: 2, gList: '1:ZZ', dataType: constants.DURATION},
            {message: 'TIME_OF_DAY', numFields: 5, numRecords: 2, gList: '1:ZZ', dataType: constants.TIME_OF_DAY},
            {message: 'DATE', numFields: 5, numRecords: 2, gList: '1:ZZ', dataType: constants.DATE},
            {message: 'DATE_TIME', numFields: 5, numRecords: 2, gList: '1:ZZ', dataType: constants.DATE_TIME},
            {message: 'NUMERIC', numFields: 5, numRecords: 2, gList: '1:ZZ', dataType: constants.NUMERIC},
            {message: 'CURRENCY', numFields: 5, numRecords: 2, gList: '1:ZZ', dataType: constants.CURRENCY},
            {message: 'PERCENT', numFields: 5, numRecords: 2, gList: '1:ZZ', dataType: constants.PERCENT},
            {message: 'RATING', numFields: 5, numRecords: 2, gList: '1:ZZ', dataType: constants.RATING}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.message, function(done) {
                var setup = setupRecords(testCase.numFields, testCase.numRecords, testCase.dataType, testCase.gList);
                var groupData = groupFormatter.group(setup.req, setup.fields, setup.records);
                assert.equal(groupData.hasGrouping, false);
                assert.equal(groupData.totalRows, 0);
                done();
            });
        });
    });

    describe('Valid grouping tests', function() {
        var testCases = [
            //  TEXT data type
            {message: 'TEXT: No input records', numFields: 5, numRecords: 0, gList: '1:V', dataType: constants.TEXT},
            {message: 'TEXT: one equals grouping', numFields: 5, numRecords: 1, gList: '1:V', dataType: constants.TEXT},
            {message: 'TEXT: one equals grouping descending', numFields: 5, numRecords: 1, gList: '-1:V', dataType: constants.TEXT},
            {message: 'TEXT: two equals groupings', numFields: 5, numRecords: 2, gList: '1:V.2:V', dataType: constants.TEXT},
            {message: 'TEXT: first word grouping', numFields: 5, numRecords: 2, gList: '1:I', dataType: constants.TEXT},
            {message: 'TEXT: first letter grouping', numFields: 5, numRecords: 2, gList: '1:F.2:F.3:F', dataType: constants.TEXT},
            {message: 'TEXT: multiple grouping against same fid', numFields: 5, numRecords: 2, gList: '1:I.1:V', dataType: constants.TEXT},
            //  USER data type
            {message: 'USER: No input records', numFields: 5, numRecords: 0, gList: '1:V', dataType: constants.USER},
            {message: 'USER: one equals grouping', numFields: 5, numRecords: 1, gList: '1:V', dataType: constants.USER},
            {message: 'USER: two equals groupings', numFields: 5, numRecords: 2, gList: '1:V.2:V', dataType: constants.USER},
            {message: 'USER: first word grouping', numFields: 5, numRecords: 2, gList: '1:I', dataType: constants.USER},
            {message: 'USER: first letter grouping', numFields: 5, numRecords: 2, gList: '1:F.-2:F.3:F', dataType: constants.USER},
            {message: 'USER: multiple grouping against same fid', numFields: 5, numRecords: 2, gList: '1:I.1:V', dataType: constants.USER},
            //  EMAIL_ADDRESS data type
            {message: 'EMAIL_ADDRESS: equals grouping', numFields: 5, numRecords: 2, gList: '1:V', dataType: constants.EMAIL_ADDRESS},
            {message: 'EMAIL_ADDRESS: name grouping', numFields: 5, numRecords: 2, gList: '1:N', dataType: constants.EMAIL_ADDRESS},
            {message: 'EMAIL_ADDRESS: domain grouping', numFields: 5, numRecords: 2, gList: '1:O', dataType: constants.EMAIL_ADDRESS},
            {message: 'EMAIL_ADDRESS: domainTopLevel grouping', numFields: 5, numRecords: 2, gList: '1:C', dataType: constants.EMAIL_ADDRESS},
            //  DURATION data type
            {message: 'DURATION: equals grouping', numFields: 5, numRecords: 2, gList: '1:V', dataType: constants.DURATION},
            {message: 'DURATION: second grouping', numFields: 5, numRecords: 2, gList: '1:s', dataType: constants.DURATION},
            {message: 'DURATION: minute grouping', numFields: 5, numRecords: 2, gList: '1:m', dataType: constants.DURATION},
            {message: 'DURATION: hour grouping', numFields: 5, numRecords: 2, gList: '1:h', dataType: constants.DURATION},
            {message: 'DURATION: week grouping', numFields: 5, numRecords: 2, gList: '1:W', dataType: constants.DURATION},
            {message: 'DURATION: day grouping', numFields: 5, numRecords: 2, gList: '1:D', dataType: constants.DURATION},
            //  TIME OF DAY data type
            {message: 'TIME_OF_DAY: equals grouping', numFields: 5, numRecords: 2, gList: '1:V', dataType: constants.TIME_OF_DAY},
            {message: 'TIME_OF_DAY: second grouping', numFields: 5, numRecords: 2, gList: '1:s', dataType: constants.TIME_OF_DAY},
            {message: 'TIME_OF_DAY: minute grouping', numFields: 5, numRecords: 2, gList: '1:m', dataType: constants.TIME_OF_DAY},
            {message: 'TIME_OF_DAY: hour grouping', numFields: 5, numRecords: 2, gList: '1:h', dataType: constants.TIME_OF_DAY},
            {message: 'TIME_OF_DAY: am_pm grouping', numFields: 5, numRecords: 2, gList: '1:a', dataType: constants.TIME_OF_DAY},
            //  DATE data type
            {message: 'DATE: equals grouping', numFields: 5, numRecords: 2, gList: '1:V', dataType: constants.DATE},
            {message: 'DATE: day grouping', numFields: 5, numRecords: 2, gList: '1:D', dataType: constants.DATE},
            {message: 'DATE: week grouping', numFields: 5, numRecords: 2, gList: '1:W', dataType: constants.DATE},
            {message: 'DATE: month grouping', numFields: 5, numRecords: 2, gList: '1:M', dataType: constants.DATE},
            {message: 'DATE: year grouping', numFields: 5, numRecords: 2, gList: '1:Y', dataType: constants.DATE},
            {message: 'DATE: quarter grouping', numFields: 5, numRecords: 2, gList: '1:Q', dataType: constants.DATE},
            {message: 'DATE: fiscalQtr grouping', numFields: 5, numRecords: 2, gList: '1:U', dataType: constants.DATE},
            {message: 'DATE: fiscalYr grouping', numFields: 5, numRecords: 2, gList: '1:FY', dataType: constants.DATE},
            {message: 'DATE: decade grouping', numFields: 5, numRecords: 2, gList: '1:T', dataType: constants.DATE},
            //  DATE_TIME data type
            {message: 'DATE_TIME: equals grouping', numFields: 5, numRecords: 2, gList: '1:V', dataType: constants.DATE_TIME},
            {message: 'DATE_TIME: day grouping', numFields: 5, numRecords: 2, gList: '1:D', dataType: constants.DATE_TIME},
            {message: 'DATE_TIME: week grouping', numFields: 5, numRecords: 2, gList: '1:W', dataType: constants.DATE_TIME},
            {message: 'DATE_TIME: month grouping', numFields: 5, numRecords: 2, gList: '1:M', dataType: constants.DATE_TIME},
            {message: 'DATE_TIME: year grouping', numFields: 5, numRecords: 2, gList: '1:Y', dataType: constants.DATE_TIME},
            {message: 'DATE_TIME: quarter grouping', numFields: 5, numRecords: 2, gList: '1:Q', dataType: constants.DATE_TIME},
            {message: 'DATE_TIME: fiscalQtr grouping', numFields: 5, numRecords: 2, gList: '1:U', dataType: constants.DATE_TIME},
            {message: 'DATE_TIME: fiscalYr grouping', numFields: 5, numRecords: 2, gList: '1:FY', dataType: constants.DATE_TIME},
            {message: 'DATE_TIME: decade grouping', numFields: 5, numRecords: 2, gList: '1:T', dataType: constants.DATE_TIME},
            //  NUMERIC data type
            {message: 'NUMERIC: equals grouping', numFields: 5, numRecords: 2, gList: '1:V', dataType: constants.NUMERIC},
            {message: 'NUMERIC: thousandth grouping', numFields: 5, numRecords: 2, gList: '1:K', dataType: constants.NUMERIC},
            {message: 'NUMERIC: hundredth grouping', numFields: 5, numRecords: 2, gList: '1:H', dataType: constants.NUMERIC},
            {message: 'NUMERIC: tenth grouping', numFields: 5, numRecords: 2, gList: '1:A', dataType: constants.NUMERIC},
            {message: 'NUMERIC: one grouping', numFields: 5, numRecords: 2, gList: '1:0', dataType: constants.NUMERIC},
            {message: 'NUMERIC: five grouping', numFields: 5, numRecords: 2, gList: '1:B', dataType: constants.NUMERIC},
            {message: 'NUMERIC: ten grouping', numFields: 5, numRecords: 2, gList: '1:1', dataType: constants.NUMERIC},
            {message: 'NUMERIC: hundred grouping', numFields: 5, numRecords: 2, gList: '1:2', dataType: constants.NUMERIC},
            {message: 'NUMERIC: one_k grouping', numFields: 5, numRecords: 2, gList: '1:3', dataType: constants.NUMERIC},
            {message: 'NUMERIC: ten_k grouping', numFields: 5, numRecords: 2, gList: '1:4', dataType: constants.NUMERIC},
            {message: 'NUMERIC: hundred_k grouping', numFields: 5, numRecords: 2, gList: '1:5', dataType: constants.NUMERIC},
            {message: 'NUMERIC: million grouping', numFields: 5, numRecords: 2, gList: '1:6', dataType: constants.NUMERIC},
            //  NUMERIC sub_type
            {message: 'NUMERIC: equals grouping', numFields: 5, numRecords: 2, gList: '1:V', dataType: constants.CURRENCY},
            {message: 'NUMERIC: equals grouping', numFields: 5, numRecords: 2, gList: '1:V', dataType: constants.PERCENT},
            {message: 'NUMERIC: equals grouping', numFields: 5, numRecords: 2, gList: '1:V', dataType: constants.RATING}
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
                    assert.equal(Math.abs(el[0]), groupData.fields[idx].field.id);
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
