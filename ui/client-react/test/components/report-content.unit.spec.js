import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReportContent from '../../src/components/report/dataTable/reportContent';
import CardViewListHolder from '../../src/components/dataTable/cardView/cardViewListHolder';
import AGGrid  from '../../src/components/dataTable/agGrid/agGrid';
import {reactCellRendererFactory} from 'ag-grid-react';
import {NumericFormatter, DateFormatter} from '../../src/components/dataTable/agGrid/formatters';
import _ from 'lodash';
import Locales from '../../src/locales/locales';
import * as DataTypes from '../../src/constants/schema';
import * as GroupTypes from '../../src/constants/groupTypes';

var LocalesMock = {
    getLocale: function() {
        return 'en-us';
    },
    getMessage: function(message) {
        return message;
    },
    getCurrencyCode: function() {
        return 'usd';
    }
};

var AGGridMock = React.createClass({
    render: function() {
        return <div>mock aggrid</div>;
    }
});

var CardViewListHolderMock = React.createClass({
    render() {
        return (
            <div>mock CardViewListHolderMock</div>
        );
    }
});


const header_empty = <div>nothing</div>;

const fakeReportData_empty = {
    loading: false,
    data: {
        name: "",
        filteredRecords: [],
        columns: []
    }
};

const fakeReportData_simple = {
    loading: false,
    data: {
        name: "test",
        groupFields: [],
        filteredRecords: [{
            col_num: 1,
            col_text: "abc",
            col_date: "01-01-2015"
        }],
        columns: [{
            field: "col_num",
            headerName: "col_num"
        },
            {
                field: "col_text",
                headerName: "col_text"
            },
            {
                field: "col_date",
                headerName: "col_date"
            }]
    }
};

const cols_with_numeric_field = [
    {
        "field": "col_num",
        "datatypeAttributes": {
            type: "NUMERIC"
        }
    },
    {
        "field": "col_text"
    },
    {
        "field": "col_date"
    }
];

const cols_with_date_field = [
    {
        "field": "col_num"
    },
    {
        "field": "col_text"
    },
    {
        "field": "col_date",
        "datatypeAttributes": {
            type: "DATE"
        }
    }
];

const cols_with_bold_attrs = [
    {
        "field": "col_num",
        "datatypeAttributes": {
            clientSideAttributes: {"bold": true}
        }
    },
    {
        "field": "col_text"
    },
    {
        "field": "col_date"
    }
];
const cols_with_nowrap_attrs = [
    {
        "columnName": "col_num",
        "datatypeAttributes": {
            clientSideAttributes: {"word-wrap": true}
        }
    },
    {
        "field": "col_text"
    },
    {
        "field": "col_date"
    }
];

const fakeReportData_attributes = {
    loading: false,
    data: {
        name: "test",
        filteredRecords: [{
            col_num: 1,
            col_text: "abc",
            col_date: "01-01-2015"
        }]
    }
};

const flux = {
    actions: {
        scrollingReport(scrolling) { }
    }
};

const fakeReportGroupData_template = {
    loading: false,
    data: {
        name: "test",
        groupFields: [
            {groupType: "V", field:{id: 1, name: 'fieldName1', datatypeAttributes: {type: "TEXT"}}},
        ],
        filteredRecords: [{
            group: "group1",
            children: [{
                col_num: 1,
                col_text: "group1",
                col_date: "01-01-2015"
            }]
        }],
        columns: [
            {field: "col_num", headerName: "col_num"},
            {field: "col_text", headerName: "col_text"},
            {field: "col_date", headerName: "col_date"}
        ]
    }
};

const fakeReportGroupData_recursiveTemplate = {
    loading: false,
    data: {
        name: "test",
        groupFields: [
            {groupType: "V", field:{id: 1, name: 'fieldName1', datatypeAttributes: {type: "TEXT"}}},
            {groupType: "V", field:{id: 2, name: 'fieldName2', datatypeAttributes: {type: "TEXT"}}}
        ],
        filteredRecords: [{
            group: "group1",
            localized: true,
            children: [{
                group: "group2",
                children: [{
                    col_num: 1,
                    col_text: "group2",
                    col_date: "01-01-2015"
                }]
            }]
        }],
        columns: [
            {field: "col_num", headerName: "col_num"},
            {field: "col_text", headerName: "col_text"},
            {field: "col_date", headerName: "col_date"}
        ]
    }
};

describe('ReportContent grouping functions', () => {
    let component;
    let localizeNumberSpy;
    let localizeDateSpy;
    let localeGetMessageSpy;

    beforeEach(() => {
        ReportContent.__Rewire__('AGGrid', AGGridMock);
        ReportContent.__Rewire__('Locales', LocalesMock);
        localizeNumberSpy = spyOn(ReportContent.prototype.__reactAutoBindMap, 'formatNumber').and.callFake(function(val) {return val;});
        localizeDateSpy = spyOn(ReportContent.prototype.__reactAutoBindMap, 'formatDate').and.callFake(function(date) {return date;});
        localeGetMessageSpy = spyOn(LocalesMock, 'getMessage').and.callThrough();
    });

    afterEach(() => {
        ReportContent.__ResetDependency__('AGGrid');
        ReportContent.__ResetDependency__('Locales');
        localizeNumberSpy.calls.reset();
        localizeDateSpy.calls.reset();
        localeGetMessageSpy.calls.reset();
    });

    var groupByNumberCases = [
        {name: 'null numeric', dataType: DataTypes.NUMERIC, groupType: GroupTypes.COMMON.equals, group: null, localizeNumberSpy: 0, localeMessageSpy: 1, expected: 'groupHeader.empty'},
        {name: 'empty numeric', dataType: DataTypes.NUMERIC, groupType: GroupTypes.COMMON.equals, group: '', localizeNumberSpy: 0, localeMessageSpy: 1, expected: 'groupHeader.empty'},
        //  group by the equals group type
        {name: 'valid numeric - equals', dataType: DataTypes.NUMERIC, groupType: GroupTypes.COMMON.equals, group: '100', localizeNumberSpy: 1, localeMessageSpy: 0, expected: '100'},
        {name: 'valid currency - equals', dataType: DataTypes.CURRENCY, groupType: GroupTypes.COMMON.equals, group: '10.50', localizeNumberSpy: 1, localeMessageSpy: 0, expected: '10.50'},
        {name: 'valid percent - equals', dataType: DataTypes.PERCENT, groupType: GroupTypes.COMMON.equals, group: '.98', localizeNumberSpy: 1, localeMessageSpy: 0, expected: '.98'},
        //  group by a non-equals group type
        {name: 'valid numeric - one', dataType: DataTypes.NUMERIC, groupType: GroupTypes.GROUP_TYPE.numeric.one, group: '1', localizeNumberSpy: 1, localeMessageSpy: 0, expected: '1'},
        {name: 'valid numeric - five', dataType: DataTypes.NUMERIC, groupType: GroupTypes.GROUP_TYPE.numeric.five, group: '15', localizeNumberSpy: 1, localeMessageSpy: 0, expected: '15'},
        {name: 'valid numeric - ten', dataType: DataTypes.NUMERIC, groupType: GroupTypes.GROUP_TYPE.numeric.ten, group: '20', localizeNumberSpy: 1, localeMessageSpy: 0, expected: '20'},
        {name: 'valid numeric - hundred', dataType: DataTypes.NUMERIC, groupType: GroupTypes.GROUP_TYPE.numeric.hundred, group: '100', localizeNumberSpy: 1, localeMessageSpy: 0, expected: '100'},
        {name: 'valid numeric - one_k', dataType: DataTypes.NUMERIC, groupType: GroupTypes.GROUP_TYPE.numeric.one_k, group: '1000', localizeNumberSpy: 1, localeMessageSpy: 0, expected: '1000'},
        {name: 'valid numeric - ten_k', dataType: DataTypes.NUMERIC, groupType: GroupTypes.GROUP_TYPE.numeric.ten_k, group: '10000', localizeNumberSpy: 1, localeMessageSpy: 0, expected: '10000'},
        {name: 'valid numeric - hundred_k', dataType: DataTypes.NUMERIC, groupType: GroupTypes.GROUP_TYPE.numeric.hundred_k, group: '100000', localizeNumberSpy: 1, localeMessageSpy: 0, expected: '100000'},
        {name: 'valid numeric - million', dataType: DataTypes.NUMERIC, groupType: GroupTypes.GROUP_TYPE.numeric.million, group: '1000000', localizeNumberSpy: 1, localeMessageSpy: 0, expected: '1000000'},
        //  group by a non-equals currency and percent
        {name: 'valid currency - five', dataType: DataTypes.CURRENCY, groupType: GroupTypes.GROUP_TYPE.numeric.five, group: '10.50', localizeNumberSpy: 1, localeMessageSpy: 0, expected: '10.50'},
        {name: 'valid percent - five', dataType: DataTypes.PERCENT, groupType: GroupTypes.GROUP_TYPE.numeric.five, group: '.98', localizeNumberSpy: 1, localeMessageSpy: 0, expected: '.98'},
        //  group by a range
        {name: 'valid numeric range - tenth', dataType: DataTypes.NUMERIC, groupType: GroupTypes.GROUP_TYPE.numeric.tenth, group: '2.1,2.2', localizeNumberSpy: 2, localeMessageSpy: 1, expected: 'groupHeader.numeric.range'},
        {name: 'valid numeric range - hundredth', dataType: DataTypes.NUMERIC, groupType: GroupTypes.GROUP_TYPE.numeric.hundredth, group: '2.10,2.11', localizeNumberSpy: 2, localeMessageSpy: 1, expected: 'groupHeader.numeric.range'},
        {name: 'valid numeric range - thousandth', dataType: DataTypes.NUMERIC, groupType: GroupTypes.GROUP_TYPE.numeric.thousandth, group: '2.101,2.102', localizeNumberSpy: 2, localeMessageSpy: 1, expected: 'groupHeader.numeric.range'},
        //
        {name: 'invalid numeric range..bad delimiter', dataType: DataTypes.NUMERIC, groupType: GroupTypes.COMMON.equals, group: '2.00:2.10', localizeNumberSpy: 1, localeMessageSpy: 0, expected: '2.00:2.10'}
    ];

    groupByNumberCases.forEach(function(test) {
        it('Test case: ' + test.name, function() {
            let reportData = _.cloneDeep(fakeReportGroupData_template);

            reportData.data.groupFields[0].field.datatypeAttributes.type = test.dataType;
            reportData.data.groupFields[0].groupType = test.groupType;
            reportData.data.filteredRecords[0].group = test.group;
            reportData.data.filteredRecords[0].localized = false;

            component = TestUtils.renderIntoDocument(<ReportContent flux={flux}
                                                                    reportData={reportData} reportHeader={header_empty}/>);

            //  validate the returned grouped header
            expect(reportData.data.filteredRecords[0].group).toEqual(test.expected);

            //  validate whether the locale.getMessage and localizeNumber method is called
            expect(localizeNumberSpy.calls.count()).toEqual(test.localizeNumberSpy);
            expect(localeGetMessageSpy.calls.count()).toEqual(test.localeMessageSpy);

            //  the localize date method should not be called for a number
            expect(localizeDateSpy.calls.count()).toEqual(0);
        });
    });

    var groupByTimeOfDayCases = [
        {name: 'null duration', groupType: GroupTypes.COMMON.equals, group: null, localeMessageSpy: 1, expected: 'groupHeader.empty'},
        {name: 'empty duration', groupType: GroupTypes.COMMON.equals, group: '', localeMessageSpy: 1, expected: 'groupHeader.empty'},
        //  group by an AM time
        {name: 'valid equal timeOfDay AM', groupType: GroupTypes.GROUP_TYPE.timeOfDay.equals, group: '1464879417', localeMessageSpy: 0, expected: '10:56:57 AM'},
        {name: 'valid second timeOfDay AM', groupType: GroupTypes.GROUP_TYPE.timeOfDay.second, group: '1464879417', localeMessageSpy: 0, expected: '10:56:57 AM'},
        {name: 'valid minute timeOfDay AM', groupType: GroupTypes.GROUP_TYPE.timeOfDay.minute, group: '1464879360', localeMessageSpy: 0, expected: '10:56 AM'},
        {name: 'valid hour timeOfDay AM', groupType: GroupTypes.GROUP_TYPE.timeOfDay.hour, group: '1464876000', localeMessageSpy: 0, expected: '10:00 AM'},
        {name: 'valid AmPm timeOfDay AM', groupType: GroupTypes.GROUP_TYPE.timeOfDay.am_pm, group: '1464840000', localeMessageSpy: 0, expected: 'AM'},
        //  group by a PM time
        {name: 'valid equal timeOfDay PM', groupType: GroupTypes.GROUP_TYPE.timeOfDay.equals, group: '1464889938', localeMessageSpy: 0, expected: '1:52:18 PM'},
        {name: 'valid second timeOfDay PM', groupType: GroupTypes.GROUP_TYPE.timeOfDay.second, group: '1464889938', localeMessageSpy: 0, expected: '1:52:18 PM'},
        {name: 'valid minute timeOfDay PM', groupType: GroupTypes.GROUP_TYPE.timeOfDay.minute, group: '1464889920', localeMessageSpy: 0, expected: '1:52 PM'},
        {name: 'valid hour timeOfDay PM', groupType: GroupTypes.GROUP_TYPE.timeOfDay.hour, group: '1464886800', localeMessageSpy: 0, expected: '1:00 PM'},
        {name: 'valid AmPm timeOfDay PM', groupType: GroupTypes.GROUP_TYPE.timeOfDay.am_pm, group: '1464926399', localeMessageSpy: 0, expected: 'PM'}
    ];

    groupByTimeOfDayCases.forEach(function(test) {
        it('Test case: ' + test.name, function() {
            let reportData = _.cloneDeep(fakeReportGroupData_template);

            reportData.data.groupFields[0].field.datatypeAttributes.type = DataTypes.TIME_OF_DAY;
            reportData.data.groupFields[0].groupType = test.groupType;
            reportData.data.filteredRecords[0].group = test.group;
            reportData.data.filteredRecords[0].localized = false;

            component = TestUtils.renderIntoDocument(<ReportContent flux={flux}
                                                                    reportData={reportData} reportHeader={header_empty}/>);

            //  validate the returned grouped header
            expect(reportData.data.filteredRecords[0].group).toEqual(test.expected);

            //  validate whether the locale.getMessage method is called
            expect(localeGetMessageSpy.calls.count()).toEqual(test.localeMessageSpy);

            //  localize number and date should not be called for time of day
            expect(localizeNumberSpy.calls.count()).toEqual(0);
            expect(localizeDateSpy.calls.count()).toEqual(0);
        });
    });

    var groupByTextCases = [
        {name: 'null text', groupType: GroupTypes.COMMON.equals, group: null, localeMessageSpy: 1, expected: 'groupHeader.empty'},
        {name: 'empty text', groupType: GroupTypes.COMMON.equals, group: '', localeMessageSpy: 1, expected: 'groupHeader.empty'},
        {name: 'valid text - equals', groupType: GroupTypes.COMMON.equals, group: 'abc', localeMessageSpy: 0, expected: 'abc'}
    ];

    groupByTextCases.forEach(function(test) {
        it('Test case: ' + test.name, function() {
            let reportData = _.cloneDeep(fakeReportGroupData_template);

            reportData.data.groupFields[0].field.datatypeAttributes.type = DataTypes.TEXT;
            reportData.data.groupFields[0].groupType = test.groupType;
            reportData.data.filteredRecords[0].group = test.group;
            reportData.data.filteredRecords[0].localized = false;

            component = TestUtils.renderIntoDocument(<ReportContent flux={flux}
                                                                    reportData={reportData} reportHeader={header_empty}/>);

            //  validate the returned grouped header
            expect(reportData.data.filteredRecords[0].group).toEqual(test.expected);

            //  validate whether the locale.getMessage method is called
            expect(localeGetMessageSpy.calls.count()).toEqual(test.localeMessageSpy);

            //  localize number and date should not be called for text
            expect(localizeNumberSpy.calls.count()).toEqual(0);
            expect(localizeDateSpy.calls.count()).toEqual(0);
        });
    });

    var groupByDateCases = [
        {name: 'null date', dataType: DataTypes.DATE, groupType: GroupTypes.COMMON.equals, group: null, localizeDateSpy: 0, localeMessageSpy: 1, expected: 'groupHeader.empty'},
        {name: 'empty date', dataType: DataTypes.DATE, groupType: GroupTypes.COMMON.equals, group: '', localizeDateSpy: 0, localeMessageSpy: 1, expected: 'groupHeader.empty'},
        {name: 'valid date - equals', dataType: DataTypes.DATE, groupType: GroupTypes.COMMON.equals, group: '05-10-2016', localizeDateSpy: 1, localeMessageSpy: 0, expected: '05-10-2016'},
        {name: 'valid date - day', dataType: DataTypes.DATE, groupType: GroupTypes.GROUP_TYPE.date.day, group: '05-10-2016', localizeDateSpy: 1, localeMessageSpy: 0, expected: '05-10-2016'},
        {name: 'valid date - fiscalYr', dataType: DataTypes.DATE, groupType: GroupTypes.GROUP_TYPE.date.fiscalYear, group: '2016', localizeDateSpy: 0, localeMessageSpy: 1, expected: 'groupHeader.abbr.fiscalYear2016'},
        {name: 'valid date - week', dataType: DataTypes.DATE, groupType: GroupTypes.GROUP_TYPE.date.week, group: '05-10-2016', localizeDateSpy: 1, localeMessageSpy: 1, expected: 'groupHeader.date.week'},
        {name: 'valid date - month', dataType: DataTypes.DATE, groupType: GroupTypes.GROUP_TYPE.date.month, group: 'May,2016', localizeDateSpy: 0, localeMessageSpy: 2, expected: 'groupHeader.date.month'},
        {name: 'valid date - quarter', dataType: DataTypes.DATE, groupType: GroupTypes.GROUP_TYPE.date.quarter, group: '1,2016', localizeDateSpy: 0, localeMessageSpy: 2, expected: 'groupHeader.date.quarter'},
        {name: 'valid date - fiscalQtr', dataType: DataTypes.DATE, groupType: GroupTypes.GROUP_TYPE.date.fiscalQuarter, group: '1,2016', localizeDateSpy: 0, localeMessageSpy: 3, expected: 'groupHeader.date.quarter'},
        {name: 'valid date - year', dataType: DataTypes.DATE, groupType: GroupTypes.GROUP_TYPE.date.year, group: '2016', localizeDateSpy: 0, localeMessageSpy: 0, expected: '2016'},
        {name: 'valid date - decade', dataType: DataTypes.DATE, groupType: GroupTypes.GROUP_TYPE.date.decade, group: '2010', localizeDateSpy: 0, localeMessageSpy: 0, expected: '2010'},
        //
        {name: 'empty datetime', dataType: DataTypes.DATE_TIME, groupType: GroupTypes.COMMON.equals, group: '', localizeDateSpy: 0, localeMessageSpy: 1, expected: 'groupHeader.empty'},
        {name: 'valid datetime - equals', dataType: DataTypes.DATE_TIME, groupType: GroupTypes.COMMON.equals, group: '05-10-2016', localizeDateSpy: 1, localeMessageSpy: 0, expected: '05-10-2016'},
        {name: 'valid datetime - day', dataType: DataTypes.DATE_TIME, groupType: GroupTypes.GROUP_TYPE.date.day, group: '05-10-2016', localizeDateSpy: 1, localeMessageSpy: 0, expected: '05-10-2016'},
        {name: 'valid datetime - fiscalYr', dataType: DataTypes.DATE_TIME, groupType: GroupTypes.GROUP_TYPE.date.fiscalYear, group: '2016', localizeDateSpy: 0, localeMessageSpy: 1, expected: 'groupHeader.abbr.fiscalYear2016'},
        {name: 'valid datetime - week', dataType: DataTypes.DATE_TIME, groupType: GroupTypes.GROUP_TYPE.date.week, group: '05-10-2016', localizeDateSpy: 1, localeMessageSpy: 1, expected: 'groupHeader.date.week'},
        {name: 'valid datetime - month', dataType: DataTypes.DATE_TIME, groupType: GroupTypes.GROUP_TYPE.date.month, group: 'May,2016', localizeDateSpy: 0, localeMessageSpy: 2, expected: 'groupHeader.date.month'},
        {name: 'valid datetime - quarter', dataType: DataTypes.DATE_TIME, groupType: GroupTypes.GROUP_TYPE.date.quarter, group: '1,2016', localizeDateSpy: 0, localeMessageSpy: 2, expected: 'groupHeader.date.quarter'},
        {name: 'valid datetime - fiscalQtr', dataType: DataTypes.DATE_TIME, groupType: GroupTypes.GROUP_TYPE.date.fiscalQuarter, group: '1,2016', localizeDateSpy: 0, localeMessageSpy: 3, expected: 'groupHeader.date.quarter'},
        {name: 'valid datetime - year', dataType: DataTypes.DATE_TIME, groupType: GroupTypes.GROUP_TYPE.date.year, group: '2016', localizeDateSpy: 0, localeMessageSpy: 0, expected: '2016'},
        {name: 'valid datetime - decade', dataType: DataTypes.DATE_TIME, groupType: GroupTypes.GROUP_TYPE.date.decade, group: '2010', localizeDateSpy: 0, localeMessageSpy: 0, expected: '2010'},
    ];

    groupByDateCases.forEach(function(test) {
        it('Test case: ' + test.name, function() {
            let reportData = _.cloneDeep(fakeReportGroupData_template);

            reportData.data.groupFields[0].field.datatypeAttributes.type = test.dataType;
            reportData.data.groupFields[0].groupType = test.groupType;
            reportData.data.filteredRecords[0].group = test.group;
            reportData.data.filteredRecords[0].localized = false;

            component = TestUtils.renderIntoDocument(<ReportContent flux={flux}
                                                                    reportData={reportData} reportHeader={header_empty}/>);

            //  validate the returned grouped header
            expect(reportData.data.filteredRecords[0].group).toEqual(test.expected);

            //  validate whether the locale.getMessage and localizeDate method is called
            expect(localeGetMessageSpy.calls.count()).toEqual(test.localeMessageSpy);
            expect(localizeDateSpy.calls.count()).toEqual(test.localizeDateSpy);

            //  localize number should not be called for date
            expect(localizeNumberSpy.calls.count()).toEqual(0);
        });
    });

    var groupByDurationCases = [
        {name: 'null duration', groupType: GroupTypes.COMMON.equals, group: null, localeMessageSpy: 1, expected: 'groupHeader.empty'},
        {name: 'empty duration', groupType: GroupTypes.COMMON.equals, group: '', localeMessageSpy: 1, expected: 'groupHeader.empty'},
        {name: 'valid equal duration - 1 second', groupType: GroupTypes.COMMON.equals, group: '1,s', localeMessageSpy: 1, expected: 'groupHeader.duration.second'},
        {name: 'valid equal duration - >1 second', groupType: GroupTypes.COMMON.equals, group: '30,s', localeMessageSpy: 1, expected: 'groupHeader.duration.seconds'},
        {name: 'valid equal duration - 1 minute', groupType: GroupTypes.COMMON.equals, group: '1,m', localeMessageSpy: 1, expected: 'groupHeader.duration.minute'},
        {name: 'valid equal duration - >1 minute', groupType: GroupTypes.COMMON.equals, group: '30,m', localeMessageSpy: 1, expected: 'groupHeader.duration.minutes'},
        {name: 'valid equal duration - 1 hour', groupType: GroupTypes.COMMON.equals, group: '1,h', localeMessageSpy: 1, expected: 'groupHeader.duration.hour'},
        {name: 'valid equal duration - >1 hour', groupType: GroupTypes.COMMON.equals, group: '30,h', localeMessageSpy: 1, expected: 'groupHeader.duration.hours'},
        {name: 'valid equal duration - 1 day', groupType: GroupTypes.COMMON.equals, group: '1,D', localeMessageSpy: 1, expected: 'groupHeader.duration.day'},
        {name: 'valid equal duration - >1 day', groupType: GroupTypes.COMMON.equals, group: '30,D', localeMessageSpy: 1, expected: 'groupHeader.duration.days'},
        {name: 'valid equal duration - 1 week', groupType: GroupTypes.COMMON.equals, group: '1,W', localeMessageSpy: 1, expected: 'groupHeader.duration.week'},
        {name: 'valid equal duration - >1 week', groupType: GroupTypes.COMMON.equals, group: '30,W', localeMessageSpy: 1, expected: 'groupHeader.duration.weeks'},
        {name: 'invalid equal duration', groupType: GroupTypes.COMMON.equals, group: '30', localeMessageSpy: 0, expected: '30'},
        {name: 'valid second duration - 10 seconds', groupType: GroupTypes.GROUP_TYPE.duration.second, group: '10', localeMessageSpy: 1, expected: 'groupHeader.duration.seconds'},
        {name: 'valid second duration - 10 minutes', groupType: GroupTypes.GROUP_TYPE.duration.minute, group: '10', localeMessageSpy: 1, expected: 'groupHeader.duration.minutes'},
        {name: 'valid second duration - 10 hours', groupType: GroupTypes.GROUP_TYPE.duration.hour, group: '10', localeMessageSpy: 1, expected: 'groupHeader.duration.hours'},
        {name: 'valid second duration - 10 days', groupType: GroupTypes.GROUP_TYPE.duration.day, group: '10', localeMessageSpy: 1, expected: 'groupHeader.duration.days'},
        {name: 'valid second duration - 10 weeks', groupType: GroupTypes.GROUP_TYPE.duration.week, group: '10', localeMessageSpy: 1, expected: 'groupHeader.duration.weeks'}
    ];

    groupByDurationCases.forEach(function(test) {
        it('Test case: ' + test.name, function() {
            let reportData = _.cloneDeep(fakeReportGroupData_template);

            reportData.data.groupFields[0].field.datatypeAttributes.type = DataTypes.DURATION;
            reportData.data.groupFields[0].groupType = test.groupType;
            reportData.data.filteredRecords[0].group = test.group;
            reportData.data.filteredRecords[0].localized = false;

            component = TestUtils.renderIntoDocument(<ReportContent flux={flux}
                                                                    reportData={reportData} reportHeader={header_empty}/>);

            //  validate the returned grouped header
            expect(reportData.data.filteredRecords[0].group).toEqual(test.expected);

            //  validate whether the locale.getMessage method is called
            expect(localeGetMessageSpy.calls.count()).toEqual(test.localeMessageSpy);

            //  localize number and date should not be called for text
            expect(localizeNumberSpy.calls.count()).toEqual(0);
            expect(localizeDateSpy.calls.count()).toEqual(0);
        });
    });

    it('Test case: Recursive test', function() {
        let localizeGroupingSpy = spyOn(ReportContent.prototype.__reactAutoBindMap, 'localizeGroupingHeaders').and.callThrough();
        let reportData = fakeReportGroupData_recursiveTemplate;

        component = TestUtils.renderIntoDocument(<ReportContent flux={flux}
                                                                reportData={reportData} reportHeader={header_empty}/>);

        expect(localizeGroupingSpy.calls.count()).toEqual(2);
    });

});

describe('ReportContent grouping functions exception handling', () => {
    let component;
    let localizeNumberSpy;
    let localizeDateSpy;
    let localeGetMessageSpy;

    beforeEach(() => {
        ReportContent.__Rewire__('AGGrid', AGGridMock);
        ReportContent.__Rewire__('Locales', LocalesMock);
        localizeNumberSpy = spyOn(ReportContent.prototype.__reactAutoBindMap, 'formatNumber').and.throwError();
        localizeDateSpy = spyOn(ReportContent.prototype.__reactAutoBindMap, 'formatDate').and.throwError();
        localeGetMessageSpy = spyOn(LocalesMock, 'getMessage').and.callThrough();
    });

    afterEach(() => {
        ReportContent.__ResetDependency__('AGGrid');
        ReportContent.__ResetDependency__('Locales');
        localizeNumberSpy.calls.reset();
        localizeDateSpy.calls.reset();
        localeGetMessageSpy.calls.reset();
    });

    var groupTestExceptionCases = [
        {name: 'exception handling formatting date', dataType: DataTypes.DATE, groupType: GroupTypes.GROUP_TYPE.date.equals, group: '05-10-2016', localizeDateSpy: 1, localizeNumberSpy: 0, expected: '05-10-2016'},
        {name: 'exception handling formatting number', dataType: DataTypes.NUMERIC, groupType: GroupTypes.GROUP_TYPE.date.equals, group: '1234', localizeDateSpy: 0, localizeNumberSpy: 1, expected: '1234'}
    ];

    groupTestExceptionCases.forEach(function(test) {
        it('Test case: ' + test.name, function() {
            let reportData = _.cloneDeep(fakeReportGroupData_template);

            reportData.data.groupFields[0].field.datatypeAttributes.type = test.dataType;
            reportData.data.groupFields[0].groupType = test.groupType;
            reportData.data.filteredRecords[0].group = test.group;
            reportData.data.filteredRecords[0].localized = false;

            component = TestUtils.renderIntoDocument(<ReportContent flux={flux}
                                                                    reportData={reportData} reportHeader={header_empty}/>);

            //  validate the returned grouped header matches the input
            expect(reportData.data.filteredRecords[0].group).toEqual(test.expected);

            expect(localizeDateSpy.calls.count()).toEqual(test.localizeDateSpy);
            expect(localizeNumberSpy.calls.count()).toEqual(test.localizeNumberSpy);
            expect(localeGetMessageSpy.calls.count()).toEqual(0);
        });
    });
});

describe('ReportContent functions', () => {
    'use strict';

    var component;

    beforeEach(() => {
        ReportContent.__Rewire__('AGGrid', AGGridMock);
        ReportContent.__Rewire__('Locales', LocalesMock);
    });

    afterEach(() => {
        ReportContent.__ResetDependency__('AGGrid');
        ReportContent.__ResetDependency__('Locales');
    });

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<ReportContent flux={flux}
            reportData={fakeReportData_empty} reportHeader={header_empty}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of empty component', () => {
        component = TestUtils.renderIntoDocument(<ReportContent flux={flux}
            reportData={fakeReportData_empty} reportHeader={header_empty}/>);
        expect(TestUtils.scryRenderedComponentsWithType(component, AGGridMock).length).toEqual(1);
    });

    it('test render of data without attributes', () => {
        component = TestUtils.renderIntoDocument(<ReportContent flux={flux}
            reportData={fakeReportData_simple}  reportHeader={header_empty}/>);
        var agGrid = TestUtils.scryRenderedComponentsWithType(component, AGGridMock);
        expect(agGrid.length).toEqual(1);
        agGrid = agGrid[0];
        expect(agGrid.props.records.length).toEqual(fakeReportData_simple.data.filteredRecords.length);
        expect(_.intersection(agGrid.props.columns, fakeReportData_simple.data.columns).length).toEqual(fakeReportData_simple.data.columns.length);
    });

    it('test render of CardViewListHolder for touch context', () => {
        ReportContent.__Rewire__('CardViewListHolder', CardViewListHolderMock);

        var TestParent = React.createFactory(React.createClass({

            childContextTypes: {
                touch: React.PropTypes.bool
            },
            getChildContext: function() {
                return {touch:true};
            },
            getInitialState() {
                return {reportData:fakeReportData_simple, reportHeader:header_empty};
            },
            render() {
                return <ReportContent ref="refReportContent" flux={flux} reportData={this.state.reportData} reportHeader={this.state.reportHeader}/>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());

        parent.setState({
            reportData: fakeReportData_simple,
            reportHeader: header_empty
        });

        var cardViewListMock = TestUtils.scryRenderedComponentsWithType(parent.refs.refReportContent, CardViewListHolderMock);
        expect(cardViewListMock.length).toEqual(1);
        ReportContent.__ResetDependency__('CardViewListHolder');
    });

});

