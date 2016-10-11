/**
 * Created by dhatch on 4/15/16.
 */

var assert = require('assert');
var constants = require('../../../../../common/src/constants');
var groupFormatter = require('../../../../src/api/quickbase/formatter/groupFormatter');
var groupUtils = require('../../../../src/utility/groupUtils');
var dateUtils = require('../../../../src/utility/dateUtils');

var groupTypes = require('../../../../../common/src/groupTypes').GROUP_TYPE;

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
            req: {}
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

        setup.req.url = "?sortList=" + gList;

        return setup;
    }

    function setupGroupedRecords(numOfFields, numOfRecords, numOfGroups, dataType, gList) {
        var setup = {
            fields: [],
            records: [],
            req: {}
        };

        var groups = [];
        for (var group = 1; group <= numOfGroups; group++) {
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

                //  it's the same fields for all the groups, so only add the fields
                //  to the array when processing the first group.
                if (group === 1) {
                    setup.fields.push(field);
                }
            }

            var groupRecords = {
                records: [],
                summaryRef: ['Group Name ' + group]
            };
            for (var x = 1; x <= numOfRecords; x++) {
                var record = [];
                var genData = generateData(dataType);
                for (var z = 0; z < setup.fields.length; z++) {
                    field = {
                        id: setup.fields[z].id,
                        value: genData
                    };
                    record.push(field);
                }
                groupRecords.records.push(record);
            }
            groups.push(groupRecords);
        }

        setup.records = {
            groups: groups,
            type: 'GROUP'
        };

        setup.req.url = "?sortList=" + gList;

        return setup;
    }

    describe('test no grouping because of insufficient or invalid input data', function() {
        var groupByEquals = groupTypes.COMMON.equals;
        var testCases = [
            {message: 'Null glist parameter', numFields: 3, numRecords: 5, gList: null, dataType: constants.TEXT},
            {message: 'Empty glist parameter', numFields: 3, numRecords: 5, gList: '', dataType: constants.TEXT},
            {message: 'No input fields', numFields: 0, numRecords: 5, gList: '1:' + groupByEquals, dataType: constants.TEXT},
            {message: 'No grouping specified', numFields: 4, numRecords: 10, gList: '1.2', dataType: constants.TEXT},
            {message: 'invalid TEXT grouping specified', numFields: 4, numRecords: 10, gList: '1:?', dataType: constants.TEXT},
            {message: 'invalid grouping specified', numFields: 4, numRecords: 10, gList: 'blah', dataType: constants.TEXT},
            {message: 'Group specified with fid=0', numFields: 4, numRecords: 10, gList: '0:' + groupByEquals, dataType: constants.TEXT}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.message, function(done) {
                var setup = setupRecords(testCase.numFields, testCase.numRecords, testCase.dataType, testCase.gList);
                var groupData = groupFormatter.group(setup.req, setup.fields, setup.records);
                assert.equal(groupData.hasGrouping, false);
                assert.equal(groupData.gridData.length, 0);
                assert.equal(groupData.totalRows, 0);
                done();
            });
        });
    });

    describe('test no grouping because of null input', function() {
        var setup = setupRecords(3, 5, constants.TEXT, '1:' + groupTypes.COMMON.equals);
        var testCases = [
            {message: 'Null fields parameter', req:setup.req, fields:null, records:setup.records},
            {message: 'Null records parameter', req:setup.req, fields:setup.fields, records:null},
            {message: 'Null field and records parameter', req:setup.req, fields:null, records:null}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.message, function(done) {
                var groupData = groupFormatter.group(testCase.req, testCase.fields, testCase.records);
                assert.equal(groupData.hasGrouping, false);
                assert.equal(groupData.gridData.length, 0);
                assert.equal(groupData.totalRows, 0);
                done();
            });
        });
    });

    describe('test grouping with mixture of sort only fids and grouping fids', function() {
        var groupByEquals = groupTypes.COMMON.equals;
        var groupByFirst = groupTypes.TEXT.firstLetter;
        var testCases = [
            {message: 'Sort fid is first element in group list', sortList:'3.1:' + groupByEquals, expectation: 0},
            {message: 'Sort fid is last element in group list', sortList:'1:' + groupByEquals + '.3', expectation: 1},
            {message: 'Sort fid is last element in group list with secondary sort', sortList:'1:' + groupByFirst + '.3', expectation: 1},
            {message: 'Negative sort fid is last element in group list with multi secondary sort', sortList:'1:' + groupByFirst + '.2.-3', expectation: 1},
            {message: 'Sort fid is second element in group list', sortList:'1:' + groupByEquals + '.2.3:' + groupByEquals, expectation: 1},
            {message: 'Sort fid is last 2 elements in group list', sortList:'1:' + groupByEquals + '.2:' + groupByEquals + '.3.4', expectation: 2},
            {message: 'Sort fid is middle elements in group list', sortList:'1:' + groupByEquals + '.2:' + groupByEquals + '.3.4.5:' + groupByEquals, expectation: 2}
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
        var groupByEquals = '1:' + groupTypes.COMMON.equals;
        var groupByEquals2 = '2:' + groupTypes.COMMON.equals;

        var groupByTextWord = '1:' + groupTypes.TEXT.firstWord;
        var groupByTextFirstLetter = '1:' + groupTypes.TEXT.firstLetter;

        var groupByUserWord = '1:' + groupTypes.USER.firstWord;
        var groupByUserFirstLetter = '1:' + groupTypes.USER.firstLetter;

        var groupByName = '1:' + groupTypes.EMAIL_ADDRESS.name;
        var groupByDomain = '1:' + groupTypes.EMAIL_ADDRESS.domain;
        var groupByDomainTop = '1:' + groupTypes.EMAIL_ADDRESS.domain_topLevel;

        var groupByDurationSecond = '1:' + groupTypes.DURATION.second;
        var groupByDurationMinute = '1:' + groupTypes.DURATION.minute;
        var groupByDurationHour = '1:' + groupTypes.DURATION.hour;
        var groupByDurationWeek = '1:' + groupTypes.DURATION.week;
        var groupByDurationDay = '1:' + groupTypes.DURATION.day;

        var groupByTimeOfDaySecond = '1:' + groupTypes.TIME_OF_DAY.second;
        var groupByTimeOfDayMinute = '1:' + groupTypes.TIME_OF_DAY.minute;
        var groupByTimeOfDayHour = '1:' + groupTypes.TIME_OF_DAY.hour;
        var groupByAmPm = '1:' + groupTypes.TIME_OF_DAY.am_pm;

        var groupByDateDay = '1:' + groupTypes.DATE.day;
        var groupByDateWeek = '1:' + groupTypes.DATE.week;
        var groupByDateMonth = '1:' + groupTypes.DATE.month;
        var groupByDateQuarter = '1:' + groupTypes.DATE.quarter;
        var groupByDateFiscalQtr = '1:' + groupTypes.DATE.fiscalQuarter;
        var groupByDateYear = '1:' + groupTypes.DATE.year;
        var groupByDateFiscalYr = '1:' + groupTypes.DATE.fiscalYear;
        var groupByDateDecade = '1:' + groupTypes.DATE.decade;

        var groupByValue = '1:' + groupTypes.NUMERIC.value;
        var groupByTenth = '1:' + groupTypes.NUMERIC.tenth;
        var groupByHundredth = '1:' + groupTypes.NUMERIC.hundredth;
        var groupByThousandth = '1:' + groupTypes.NUMERIC.thousandth;
        var groupByOne = '1:' + groupTypes.NUMERIC.one;
        var groupByFive = '1:' + groupTypes.NUMERIC.five;
        var groupByTen = '1:' + groupTypes.NUMERIC.ten;
        var groupByHundred = '1:' + groupTypes.NUMERIC.hundred;
        var groupBy1k = '1:' + groupTypes.NUMERIC.one_k;
        var groupBy10k = '1:' + groupTypes.NUMERIC.ten_k;
        var groupBy100k = '1:' + groupTypes.NUMERIC.hundred_k;
        var groupByMillion = '1:' + groupTypes.NUMERIC.million;

        var testCases = [
            //  TEXT data type
            {message: 'TEXT: No input records', numFields: 5, numRecords: 0, gList: groupByEquals, dataType: constants.TEXT},
            {message: 'TEXT: one equals grouping', numFields: 5, numRecords: 1, gList: groupByEquals, dataType: constants.TEXT},
            {message: 'TEXT: one equals grouping descending', numFields: 5, numRecords: 1, gList: '-' + groupByEquals, dataType: constants.TEXT},
            {message: 'TEXT: two equals groupings', numFields: 5, numRecords: 2, gList: groupByEquals + '.' + groupByEquals2, dataType: constants.TEXT},
            {message: 'TEXT: first word grouping', numFields: 5, numRecords: 2, gList: groupByTextWord, dataType: constants.TEXT},
            {message: 'TEXT: first letter grouping', numFields: 5, numRecords: 2, gList: groupByTextFirstLetter, dataType: constants.TEXT},
            {message: 'TEXT: multiple grouping against same fid', numFields: 5, numRecords: 2, gList: groupByTextWord + '.' + groupByEquals, dataType: constants.TEXT},
            //  USER data type
            {message: 'USER: No input records', numFields: 5, numRecords: 0, gList: groupByEquals, dataType: constants.USER},
            {message: 'USER: one equals grouping', numFields: 5, numRecords: 1, gList: groupByEquals, dataType: constants.USER},
            {message: 'USER: two equals groupings', numFields: 5, numRecords: 2, gList: groupByEquals + '.' + groupByEquals2, dataType: constants.USER},
            {message: 'USER: first word grouping', numFields: 5, numRecords: 2, gList: groupByUserWord, dataType: constants.USER},
            {message: 'USER: first letter grouping', numFields: 5, numRecords: 2, gList: groupByUserFirstLetter, dataType: constants.USER},
            {message: 'USER: multiple grouping against same fid', numFields: 5, numRecords: 2, gList: groupByUserWord + '.' + groupByEquals, dataType: constants.USER},
            //  EMAIL_ADDRESS data type
            {message: 'EMAIL_ADDRESS: equals grouping', numFields: 5, numRecords: 2, gList: groupByEquals, dataType: constants.EMAIL_ADDRESS},
            {message: 'EMAIL_ADDRESS: name grouping', numFields: 5, numRecords: 2, gList: groupByName, dataType: constants.EMAIL_ADDRESS},
            {message: 'EMAIL_ADDRESS: domain grouping', numFields: 5, numRecords: 2, gList: groupByDomain, dataType: constants.EMAIL_ADDRESS},
            {message: 'EMAIL_ADDRESS: domainTopLevel grouping', numFields: 5, numRecords: 2, gList: groupByDomainTop, dataType: constants.EMAIL_ADDRESS},
            //  DURATION data type
            {message: 'DURATION: equals grouping', numFields: 5, numRecords: 2, gList: groupByEquals, dataType: constants.DURATION},
            {message: 'DURATION: second grouping', numFields: 5, numRecords: 2, gList: groupByDurationSecond, dataType: constants.DURATION},
            {message: 'DURATION: minute grouping', numFields: 5, numRecords: 2, gList: groupByDurationMinute, dataType: constants.DURATION},
            {message: 'DURATION: hour grouping', numFields: 5, numRecords: 2, gList: groupByDurationHour, dataType: constants.DURATION},
            {message: 'DURATION: week grouping', numFields: 5, numRecords: 2, gList: groupByDurationWeek, dataType: constants.DURATION},
            {message: 'DURATION: day grouping', numFields: 5, numRecords: 2, gList: groupByDurationDay, dataType: constants.DURATION},
            //  TIME OF DAY data type
            {message: 'TIME_OF_DAY: equals grouping', numFields: 5, numRecords: 2, gList: groupByEquals, dataType: constants.TIME_OF_DAY},
            {message: 'TIME_OF_DAY: second grouping', numFields: 5, numRecords: 2, gList: groupByTimeOfDaySecond, dataType: constants.TIME_OF_DAY},
            {message: 'TIME_OF_DAY: minute grouping', numFields: 5, numRecords: 2, gList: groupByTimeOfDayMinute, dataType: constants.TIME_OF_DAY},
            {message: 'TIME_OF_DAY: hour grouping', numFields: 5, numRecords: 2, gList: groupByTimeOfDayHour, dataType: constants.TIME_OF_DAY},
            {message: 'TIME_OF_DAY: am_pm grouping', numFields: 5, numRecords: 2, gList: groupByAmPm, dataType: constants.TIME_OF_DAY},
            //  DATE data type
            {message: 'DATE: equals grouping', numFields: 5, numRecords: 2, gList: groupByEquals, dataType: constants.DATE},
            {message: 'DATE: day grouping', numFields: 5, numRecords: 2, gList: groupByDateDay, dataType: constants.DATE},
            {message: 'DATE: week grouping', numFields: 5, numRecords: 2, gList: groupByDateWeek, dataType: constants.DATE},
            {message: 'DATE: month grouping', numFields: 5, numRecords: 2, gList: groupByDateMonth, dataType: constants.DATE},
            {message: 'DATE: year grouping', numFields: 5, numRecords: 2, gList: groupByDateYear, dataType: constants.DATE},
            {message: 'DATE: quarter grouping', numFields: 5, numRecords: 2, gList: groupByDateQuarter, dataType: constants.DATE},
            {message: 'DATE: fiscalQtr grouping', numFields: 5, numRecords: 2, gList: groupByDateFiscalQtr, dataType: constants.DATE},
            {message: 'DATE: fiscalYr grouping', numFields: 5, numRecords: 2, gList: groupByDateFiscalYr, dataType: constants.DATE},
            {message: 'DATE: decade grouping', numFields: 5, numRecords: 2, gList: groupByDateDecade, dataType: constants.DATE},
            //  DATE_TIME data type
            {message: 'DATE_TIME: equals grouping', numFields: 5, numRecords: 2, gList: groupByEquals, dataType: constants.DATE_TIME},
            {message: 'DATE_TIME: day grouping', numFields: 5, numRecords: 2, gList: groupByDateDay, dataType: constants.DATE_TIME},
            {message: 'DATE_TIME: week grouping', numFields: 5, numRecords: 2, gList: groupByDateWeek, dataType: constants.DATE_TIME},
            {message: 'DATE_TIME: month grouping', numFields: 5, numRecords: 2, gList: groupByDateMonth, dataType: constants.DATE_TIME},
            {message: 'DATE_TIME: year grouping', numFields: 5, numRecords: 2, gList: groupByDateYear, dataType: constants.DATE_TIME},
            {message: 'DATE_TIME: quarter grouping', numFields: 5, numRecords: 2, gList: groupByDateQuarter, dataType: constants.DATE_TIME},
            {message: 'DATE_TIME: fiscalQtr grouping', numFields: 5, numRecords: 2, gList: groupByDateFiscalQtr, dataType: constants.DATE_TIME},
            {message: 'DATE_TIME: fiscalYr grouping', numFields: 5, numRecords: 2, gList: groupByDateFiscalYr, dataType: constants.DATE_TIME},
            {message: 'DATE_TIME: decade grouping', numFields: 5, numRecords: 2, gList: groupByDateDecade, dataType: constants.DATE_TIME},
            //  NUMERIC data type
            {message: 'NUMERIC: equals grouping', numFields: 5, numRecords: 2, gList: groupByEquals, dataType: constants.NUMERIC},
            {message: 'NUMERIC: value grouping', numFields: 5, numRecords: 2, gList: groupByValue, dataType: constants.NUMERIC},
            {message: 'NUMERIC: thousandth grouping', numFields: 5, numRecords: 2, gList: groupByThousandth, dataType: constants.NUMERIC},
            {message: 'NUMERIC: hundredth grouping', numFields: 5, numRecords: 2, gList: groupByHundredth, dataType: constants.NUMERIC},
            {message: 'NUMERIC: tenth grouping', numFields: 5, numRecords: 2, gList: groupByTenth, dataType: constants.NUMERIC},
            {message: 'NUMERIC: one grouping', numFields: 5, numRecords: 2, gList: groupByOne, dataType: constants.NUMERIC},
            {message: 'NUMERIC: five grouping', numFields: 5, numRecords: 2, gList: groupByFive, dataType: constants.NUMERIC},
            {message: 'NUMERIC: ten grouping', numFields: 5, numRecords: 2, gList: groupByTen, dataType: constants.NUMERIC},
            {message: 'NUMERIC: hundred grouping', numFields: 5, numRecords: 2, gList: groupByHundred, dataType: constants.NUMERIC},
            {message: 'NUMERIC: one_k grouping', numFields: 5, numRecords: 2, gList: groupBy1k, dataType: constants.NUMERIC},
            {message: 'NUMERIC: ten_k grouping', numFields: 5, numRecords: 2, gList: groupBy10k, dataType: constants.NUMERIC},
            {message: 'NUMERIC: hundred_k grouping', numFields: 5, numRecords: 2, gList: groupBy100k, dataType: constants.NUMERIC},
            {message: 'NUMERIC: million grouping', numFields: 5, numRecords: 2, gList: groupByMillion, dataType: constants.NUMERIC},
            //  NUMERIC sub_type
            {message: 'NUMERIC: equals grouping currency', numFields: 5, numRecords: 2, gList: groupByEquals, dataType: constants.CURRENCY},
            {message: 'NUMERIC: equals grouping percent', numFields: 5, numRecords: 2, gList: groupByEquals, dataType: constants.PERCENT},
            {message: 'NUMERIC: equals grouping rating', numFields: 5, numRecords: 2, gList: groupByEquals, dataType: constants.RATING}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.message, function(done) {
                var numberOfGroups = 2;
                var format = (testCase.numRecords === 1);

                var setup = setupRecords(testCase.numFields, testCase.numRecords, testCase.dataType, testCase.gList);
                var groupSetup = setupGroupedRecords(testCase.numFields, testCase.numRecords, numberOfGroups, testCase.dataType, testCase.gList);

                var groupData = groupFormatter.group(setup.req, setup.fields, setup.records);
                var coreGroupData = groupFormatter.organizeGroupingData(groupSetup.req, groupSetup.fields, groupSetup.records, format);

                assert.equal(groupData.hasGrouping, true);
                assert.equal(coreGroupData.hasGrouping, true);

                assert.equal(groupData.totalRows, testCase.numRecords);
                assert.equal(coreGroupData.totalRows, testCase.numRecords * numberOfGroups);

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
                assert.equal(groupList.length, coreGroupData.fields.length);

                //  the gridColumns array should not include the fields being grouped
                assert.equal(testCase.numFields - map.size, groupData.gridColumns.length);
                assert.equal(testCase.numFields - map.size, coreGroupData.gridColumns.length);
                done();
            });
        });
    });

});
