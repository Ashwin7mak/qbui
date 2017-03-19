import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {ReportContent, __RewireAPI__ as ReportContentRewireAPI} from '../../src/components/report/dataTable/reportContent';

import _ from 'lodash';
import Locales from '../../src/locales/locales';
import * as SchemaConsts from '../../src/constants/schema';
import * as GroupTypes from '../../../common/src/groupTypes';
import Promise from 'bluebird';
import {APP_ROUTE} from '../../src/constants/urlConstants';
import {CONTEXT} from '../../src/actions/context';

Promise.onPossiblyUnhandledRejection(function(err) {
    return err;
});

//TODO Code hygiene: Clean up names with underscores, replace with camelcase. Tracked at https://quickbase.atlassian.net/browse/MB-501
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

class WindowLocationUtilsMock {
    static pushWithQuery(key, recId) { }
}

var ReportGridMock = React.createClass({
    render: function() {
        return <div>mock reportgrid</div>;
    }
});


const header_empty = <div>nothing</div>;

const fakeReportData_empty = {
    loading: false,
    data: {
        name: "",
        filteredRecords: [],
        columns: [],
        recordsCount: 0
    }
};
const fakeReportData_emptyData = {
    loading: true
};

const fakeReportData_selectedRowsData = {
    loading: true,
    selectedRows: [1, 5]
};

const fakeReportData_simple = {
    appId: "1",
    tblId: "2",
    rptId: "3",
    loading: false,
    countingTotalRecords: false,
    data: {
        name: "test",
        groupFields: [],
        recordsCount:10,
        filteredRecords: [{
            col_num: {value: 1, id: 4},
            col_text: {value: 'abc', id: 5},
            col_date: {value: '01-01-2015', id: 6},
            col_req: {value: null, id: 8},
            id: {value: 100, id: 7}
        }],
        records: [{
            col_num: {value: 1, id: 4},
            col_text: {value: 'abc', id: 5},
            col_date: {value: '01-01-2015', id: 6},
            col_req: {value: null, id: 8},
            "Record ID#": {value: 100, id: 7}
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
        },
        {
            field: "col_req",
            headerName: "col_req"
        }
        ]
    }
};

const fakeReportDataFields_simple = {
    fields: {
        data: [
            {
                "datatypeAttributes": {
                    "type": "NUMERIC", "clientSideAttributes": {"width": 50, "bold": false, "word_wrap": false},
                    "decimalPlaces": 0, "treatNullAsZero": true, "unitsDescription": ""
                },
                "id": 4, "name": "col_num", "type": "SCALAR",  "builtIn": false,
                "dataIsCopyable": true, "includeInQuickSearch": true, "appearsByDefault": false, "userEditableValue": true,
                "required": false, "defaultValue": {}, "multiChoiceSourceAllowed": false
            },
            {
                "datatypeAttributes": {
                    "type": "TEXT", "clientSideAttributes": {"width": 50, "bold": true, "word_wrap": false, "max_chars": 0},
                    "htmlAllowed": false
                }, "id": 5, "name": "abc", "type": "SCALAR", "builtIn": false,
                "dataIsCopyable": true, "includeInQuickSearch": true, "appearsByDefault": true, "userEditableValue": true,
                "required": false, "defaultValue": {}, "multiChoiceSourceAllowed": false
            },
            {
                "datatypeAttributes": {
                    "type": "DATE_TIME", "clientSideAttributes": {"width": 50, "bold": false, "word_wrap": false},
                    "showMonthAsName": false, "showDayOfWeek": false, "hideYearIfCurrent": false, "dateFormat": "MM-dd-uuuu",
                    "showTime": true, "showTimeZone": false, "timeZone": "America/Los_Angeles"
                }, "id": 6, "name": "col_date", "type": "SCALAR", "builtIn": false,
                "dataIsCopyable": true, "includeInQuickSearch": true, "appearsByDefault": false, "userEditableValue": true,
                "required": true, "defaultValue": {}, "multiChoiceSourceAllowed": false
            },
            {
                "datatypeAttributes": {
                    "type": "NUMERIC", "clientSideAttributes": {"width": 50, "bold": false, "word_wrap": false},
                    "decimalPlaces": 0, "treatNullAsZero": true, "unitsDescription": ""
                }, "id": 7, "name": "Record ID#", "type": "SCALAR",  "builtIn": true,
                "dataIsCopyable": true, "includeInQuickSearch": true, "appearsByDefault": false, "userEditableValue": false,
                "required": true, "unique": true, "indexed": true, "keyField": true, "defaultValue": {},
                "multiChoiceSourceAllowed": false
            },
            //a required field in the report
            {
                "datatypeAttributes": {
                    "type": "TEXT", "clientSideAttributes": {"width": 50, "bold": true, "word_wrap": false, "max_chars": 0},
                    "htmlAllowed": false
                }, "id": 8, "name": "abc", "type": "SCALAR", "builtIn": false,
                "dataIsCopyable": true, "includeInQuickSearch": true, "appearsByDefault": true, "userEditableValue": true,
                "required": true, "defaultValue": {}, "multiChoiceSourceAllowed": false
            },
            //a unique field not in the report
            {
                "datatypeAttributes": {
                    "type": "TEXT", "clientSideAttributes": {"width": 50, "bold": true, "word_wrap": false, "max_chars": 0},
                    "htmlAllowed": false
                }, "id": 9, "name": "abc", "type": "SCALAR", "builtIn": false,
                "dataIsCopyable": true, "includeInQuickSearch": true, "appearsByDefault": true, "userEditableValue": true,
                "unique": true, "defaultValue": {}, "multiChoiceSourceAllowed": false
            },

        ]
    }
};

const fakeReportData_pagedData  = {
    loading: false,
    countingTotalRecords: false,
    numRows:5,
    offset:0,
    pageOffset:1,
    data: {
        name: "testingPageRender",
        records: [
            {
                col_num: 1,
                col_text: "Design",
                col_date: "01-01-2015"
            },
            {
                col_num: 2,
                col_text: "Development",
                col_date: "02-02-2015"
            }, {
                col_num: 3,
                col_text: "Planning",
                col_date: "03-03-2015"
            },
            {
                col_num: 4,
                col_text: "Design",
                col_date: "01-01-2015"
            },
            {
                col_num: 5,
                col_text: "Development",
                col_date: "02-02-2015"
            }, {
                col_num: 6,
                col_text: "Planning",
                col_date: "03-03-2015"
            },            {
                col_num: 7,
                col_text: "Design",
                col_date: "01-01-2015"
            },
            {
                col_num: 8,
                col_text: "Development",
                col_date: "02-02-2015"
            }, {
                col_num: 9,
                col_text: "Planning",
                col_date: "03-03-2015"
            },            {
                col_num: 10,
                col_text: "Design",
                col_date: "01-01-2015"
            }
        ],
        filteredRecords: [],
        columns: [
            {
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
            }],
        recordsCount: 10,
        filteredRecordsCount: 0
    }
};


const fakeReportDataFields_unsaved = {
    fields: {
        data: [
            {
                "datatypeAttributes": {
                    "type": "TEXT", "clientSideAttributes": {"width": 50, "bold": true, "word_wrap": false, "max_chars": 0},
                    "htmlAllowed": false
                }, "id": 5, "name": "abc", "type": "SCALAR", "builtIn": false,
                "dataIsCopyable": true, "includeInQuickSearch": true, "appearsByDefault": true, "userEditableValue": true,
                "required": false, "defaultValue": {}, "multiChoiceSourceAllowed": false
            },

            {
                "datatypeAttributes": {
                    "type": "NUMERIC", "clientSideAttributes": {"width": 50, "bold": false, "word_wrap": false},
                    "decimalPlaces": 0, "treatNullAsZero": true, "unitsDescription": ""
                }, "id": 7, "name": "Record ID#", "type": "SCALAR",  "builtIn": true,
                "dataIsCopyable": true, "includeInQuickSearch": true, "appearsByDefault": false, "userEditableValue": false,
                "required": true, "unique": true, "indexed": true, "keyField": true, "defaultValue": {},
                "multiChoiceSourceAllowed": false
            }
        ]
    }
};

const fakeReportData_unsaved = {
    loading: false,
    countingTotalRecords: false,
    recordsCount:1,
    data: {
        name: "test unsaved",
        groupFields: [],
        filteredRecords: [{
            col_text: {value: 'abc', id: 5},
            id: {value: SchemaConsts.UNSAVED_RECORD_ID, id: 7},
        }],
        columns: [{
            field: "col_text",
            headerName: "col_text"
        }]
    }
};


let map = new Map();
fakeReportDataFields_unsaved.fields.data.forEach((field) => {
    map.set(field.id, field);
});
fakeReportData_unsaved.data.fieldsMap = map;

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
            clientSideAttributes: {"word_wrap": true}
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
            col_num: {value: 1, id: 4},
            col_text: {value: 'abc', id: 5},
            col_date: {value: '01-01-2015', id: 6},
            id: {value: 100, id: 7},
        }],
    }
};

const fakeReportFooter = {
    props: {
        getNextReportPage: function() {

        },
        getPreviousReportPage: function() {

        },
        pageStart:0,
        pageEnd:10
    }
};
const selectedRowIds = [
    1,
    2
];

let doneFunction = null; // Holds the done function for an asynchronous test so it can be called in the mock flux
const flux = {
    actions: {
        scrollingReport(scrolling) {
        },
        mark: ()=> {
        },
        measure: ()=> {
        },
        logMeasurements : ()=> {
        }
    }
};

//  redux dispatch methods
const props = {
    appId: '1',
    tblId: '2',
    reactabular: true,
    flux: flux,
    record: [
        {pendEdits: {}}
    ],
    report: [],
    selectReportRecords: () => {},
    openRecord: () => {},
    editRecordStart: () => {},
    editRecordCancel: () => {},
    editRecordChange: () => {},
    editRecordValidateField: () => {},
    addBlankRecordToReport: () => {},
    deleteRecord: () => {},
    updateRecord: () => {},
    createRecord: () => {}
};

const fakeReportGroupData_template = {
    loading: false,
    data: {
        name: "test",
        groupFields: [
            {groupType: "V", field: {id: 1, name: 'fieldName1', datatypeAttributes: {type: "TEXT"}}},
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
            {groupType: "V", field: {id: 1, name: 'fieldName1', datatypeAttributes: {type: "TEXT"}}},
            {groupType: "V", field: {id: 2, name: 'fieldName2', datatypeAttributes: {type: "TEXT"}}}
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
        ReportContentRewireAPI.__Rewire__('ReportGrid', ReportGridMock);
        ReportContentRewireAPI.__Rewire__('Locales', LocalesMock);
        localizeNumberSpy = spyOn(ReportContent.prototype, 'formatNumber').and.callFake(function(val) {
            return val;
        });
        localizeDateSpy = spyOn(ReportContent.prototype, 'formatDate').and.callFake(function(date, opts) {
            return date;
        });
        localeGetMessageSpy = spyOn(LocalesMock, 'getMessage').and.callThrough();
    });

    afterEach(() => {
        ReportContentRewireAPI.__ResetDependency__('ReportGrid');
        ReportContentRewireAPI.__ResetDependency__('Locales');
        localizeNumberSpy.calls.reset();
        localizeDateSpy.calls.reset();
        localeGetMessageSpy.calls.reset();

        //  initialize redux stores
        props.reports = [];
        props.record = [
            {pendEdits: {}}
        ];
    });

    var groupByNumberCases = [
        {name: 'null numeric', dataType: SchemaConsts.NUMERIC, groupType: GroupTypes.COMMON.equals, group: null, localizeNumberSpy: 0, localeMessageSpy: 4, expected: 'groupHeader.empty'},
        {name: 'empty numeric', dataType: SchemaConsts.NUMERIC, groupType: GroupTypes.COMMON.equals, group: '', localizeNumberSpy: 0, localeMessageSpy: 4, expected: 'groupHeader.empty'},
        //  group by the equals group type
        {name: 'valid numeric - equals', dataType: SchemaConsts.NUMERIC, groupType: GroupTypes.COMMON.equals, group: '100', localizeNumberSpy: 0, localeMessageSpy: 3, expected: '100'},
        {name: 'valid currency - equals', dataType: SchemaConsts.CURRENCY, groupType: GroupTypes.COMMON.equals, group: '10.50', localizeNumberSpy: 0, localeMessageSpy: 3, expected: '10.50'},
        {name: 'valid percent - equals', dataType: SchemaConsts.PERCENT, groupType: GroupTypes.COMMON.equals, group: '.98', localizeNumberSpy: 0, localeMessageSpy: 3, expected: '.98'},
        //  group by a non-equals group type
        {name: 'valid numeric - one', dataType: SchemaConsts.NUMERIC, groupType: GroupTypes.GROUP_TYPE.NUMERIC.one, group: '1', localizeNumberSpy: 0, localeMessageSpy: 3, expected: '1'},
        {name: 'valid numeric - five', dataType: SchemaConsts.NUMERIC, groupType: GroupTypes.GROUP_TYPE.NUMERIC.five, group: '15', localizeNumberSpy: 0, localeMessageSpy: 3, expected: '15'},
        {name: 'valid numeric - ten', dataType: SchemaConsts.NUMERIC, groupType: GroupTypes.GROUP_TYPE.NUMERIC.ten, group: '20', localizeNumberSpy: 0, localeMessageSpy: 3, expected: '20'},
        {name: 'valid numeric - hundred', dataType: SchemaConsts.NUMERIC, groupType: GroupTypes.GROUP_TYPE.NUMERIC.hundred, group: '100', localizeNumberSpy: 0, localeMessageSpy: 3, expected: '100'},
        {name: 'valid numeric - one_k', dataType: SchemaConsts.NUMERIC, groupType: GroupTypes.GROUP_TYPE.NUMERIC.one_k, group: '1000', localizeNumberSpy: 0, localeMessageSpy: 3, expected: '1000'},
        {name: 'valid numeric - ten_k', dataType: SchemaConsts.NUMERIC, groupType: GroupTypes.GROUP_TYPE.NUMERIC.ten_k, group: '10000', localizeNumberSpy: 0, localeMessageSpy: 3, expected: '10000'},
        {name: 'valid numeric - hundred_k', dataType: SchemaConsts.NUMERIC, groupType: GroupTypes.GROUP_TYPE.NUMERIC.hundred_k, group: '100000', localizeNumberSpy: 0, localeMessageSpy: 3, expected: '100000'},
        {name: 'valid numeric - million', dataType: SchemaConsts.NUMERIC, groupType: GroupTypes.GROUP_TYPE.NUMERIC.million, group: '1000000', localizeNumberSpy: 0, localeMessageSpy: 3, expected: '1000000'},
        //  group by a non-equals currency and percent
        {name: 'valid currency - five', dataType: SchemaConsts.CURRENCY, groupType: GroupTypes.GROUP_TYPE.NUMERIC.five, group: '10.50', localizeNumberSpy: 0, localeMessageSpy: 3, expected: '10.50'},
        {name: 'valid percent - five', dataType: SchemaConsts.PERCENT, groupType: GroupTypes.GROUP_TYPE.NUMERIC.five, group: '.98', localizeNumberSpy: 0, localeMessageSpy: 3, expected: '.98'},
        //  group by a range
        {name: 'valid numeric range - tenth', dataType: SchemaConsts.NUMERIC, groupType: GroupTypes.GROUP_TYPE.NUMERIC.tenth, group: '2.1,2.2', localizeNumberSpy: 0, localeMessageSpy: 4, expected: 'groupHeader.numeric.range'},
        {name: 'valid numeric range - hundredth', dataType: SchemaConsts.NUMERIC, groupType: GroupTypes.GROUP_TYPE.NUMERIC.hundredth, group: '2.10,2.11', localizeNumberSpy: 0, localeMessageSpy: 4, expected: 'groupHeader.numeric.range'},
        {name: 'valid numeric range - thousandth', dataType: SchemaConsts.NUMERIC, groupType: GroupTypes.GROUP_TYPE.NUMERIC.thousandth, group: '2.101,2.102', localizeNumberSpy: 0, localeMessageSpy: 4, expected: 'groupHeader.numeric.range'},
        //
        {name: 'invalid numeric range..bad delimiter', dataType: SchemaConsts.NUMERIC, groupType: GroupTypes.COMMON.equals, group: '2.00:2.10', localizeNumberSpy: 0, localeMessageSpy: 3, expected: '2.00:2.10'}
    ];

    groupByNumberCases.forEach(function(test) {
        it('Test case: ' + test.name, function() {
            let reportData = _.cloneDeep(fakeReportGroupData_template);

            reportData.data.groupFields[0].field.datatypeAttributes.type = test.dataType;
            reportData.data.groupFields[0].groupType = test.groupType;
            reportData.data.filteredRecords[0].group = test.group;
            reportData.data.filteredRecords[0].localized = false;

            props.report[0] = reportData;
            component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                    pendEdits={{}}
                                                                    reportData={reportData}
                                                                    reportHeader={header_empty}
                                                                    reportFooter={fakeReportFooter}/>);

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
        {name: 'null duration', groupType: GroupTypes.COMMON.equals, group: null, localeMessageSpy: 4, localeDateSpy: 0, expected: 'groupHeader.empty'},
        {name: 'empty duration', groupType: GroupTypes.COMMON.equals, group: '', localeMessageSpy: 4, localeDateSpy: 0, expected: 'groupHeader.empty'},
        {name: 'bad duration', groupType: GroupTypes.COMMON.equals, group: '01/01/2016', localeMessageSpy: 3, localeDateSpy: 0, expected: '01/01/2016'},
        {name: 'bad duration', groupType: GroupTypes.COMMON.equals, group: '01/01/2016 18:51', localeMessageSpy: 3, localeDateSpy: 0, expected: '01/01/2016 18:51'},

        {name: 'valid equal timeOfDay PM', groupType: GroupTypes.GROUP_TYPE.TIME_OF_DAY.equals, group: '18:51:21', localeMessageSpy: 3, localeDateSpy: 0, expected: new Date(1970, 1, 1, 18, 51, 21)},
        {name: 'valid second timeOfDay PM', groupType: GroupTypes.GROUP_TYPE.TIME_OF_DAY.second, group: '18:51:21', localeMessageSpy: 3, localeDateSpy: 0, expected: new Date(1970, 1, 1, 18, 51, 21)},
        {name: 'valid minute timeOfDay PM', groupType: GroupTypes.GROUP_TYPE.TIME_OF_DAY.minute, group: '18:51', localeMessageSpy: 3, localeDateSpy: 0, expected: new Date(1970, 1, 1, 18, 51, 0)},
        {name: 'valid hour timeOfDay PM', groupType: GroupTypes.GROUP_TYPE.TIME_OF_DAY.hour, group: '18:00', localeMessageSpy: 3, localeDateSpy: 0, expected: new Date(1970, 1, 1, 18, 0, 0)},
        {name: 'valid AmPm timeOfDay PM', groupType: GroupTypes.GROUP_TYPE.TIME_OF_DAY.am_pm, group: '23:59:59', localeMessageSpy: 4, localeDateSpy: 0, expected: 'groupHeader.pm'},
        {name: 'valid AmPm timeOfDay AM', groupType: GroupTypes.GROUP_TYPE.TIME_OF_DAY.am_pm, group: '00:00:00', localeMessageSpy: 4, localeDateSpy: 0, expected: 'groupHeader.am'}
    ];

    groupByTimeOfDayCases.forEach(function(test) {
        it('Test case: ' + test.name, function() {
            let reportData = _.cloneDeep(fakeReportGroupData_template);

            reportData.data.groupFields[0].field.datatypeAttributes.type = SchemaConsts.TIME_OF_DAY;
            reportData.data.groupFields[0].groupType = test.groupType;
            reportData.data.filteredRecords[0].group = test.group;
            reportData.data.filteredRecords[0].localized = false;

            props.report[0] = reportData;
            component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                    reportData={reportData}
                                                                    reportHeader={header_empty}
                                                                    reportFooter={fakeReportFooter}/>);

            //  validate the returned grouped header
            expect(reportData.data.filteredRecords[0].group).toEqual(test.expected);

            //  validate whether the locale.getMessage method is called
            expect(localeGetMessageSpy.calls.count()).toEqual(test.localeMessageSpy);
            expect(localizeDateSpy.calls.count()).toEqual(test.localeDateSpy);

            //  localize number and date should not be called for time of day
            expect(localizeNumberSpy.calls.count()).toEqual(0);
        });
    });

    var groupByTextCases = [
        {name: 'null text', groupType: GroupTypes.COMMON.equals, group: null, localeMessageSpy: 4, expected: 'groupHeader.empty'},
        {name: 'empty text', groupType: GroupTypes.COMMON.equals, group: '', localeMessageSpy: 4, expected: 'groupHeader.empty'},
        {name: 'valid text - equals', groupType: GroupTypes.COMMON.equals, group: 'abc', localeMessageSpy: 3, expected: 'abc'}
    ];

    groupByTextCases.forEach(function(test) {
        it('Test case: ' + test.name, function() {
            let reportData = _.cloneDeep(fakeReportGroupData_template);

            reportData.data.groupFields[0].field.datatypeAttributes.type = SchemaConsts.TEXT;
            reportData.data.groupFields[0].groupType = test.groupType;
            reportData.data.filteredRecords[0].group = test.group;
            reportData.data.filteredRecords[0].localized = false;

            props.report[0] = reportData;
            component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                    reportData={reportData}
                                                                    reportHeader={header_empty}
                                                                    reportFooter={fakeReportFooter}/>);

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
        {name: 'null date', dataType: SchemaConsts.DATE, groupType: GroupTypes.COMMON.equals, group: null, localizeDateSpy: 0, localeMessageSpy: 4, expected: 'groupHeader.empty'},
        {name: 'empty date', dataType: SchemaConsts.DATE, groupType: GroupTypes.COMMON.equals, group: '', localizeDateSpy: 0, localeMessageSpy: 4, expected: 'groupHeader.empty'},
        {name: 'valid date - equals', dataType: SchemaConsts.DATE, groupType: GroupTypes.COMMON.equals, group: '05-10-2016', localizeDateSpy: 0, localeMessageSpy: 3, expected: '05-10-2016'},
        {name: 'valid date - day', dataType: SchemaConsts.DATE, groupType: GroupTypes.GROUP_TYPE.DATE.day, group: '05-10-2016', localizeDateSpy: 0, localeMessageSpy: 3, expected: '05-10-2016'},
        {name: 'valid date - fiscalYr', dataType: SchemaConsts.DATE, groupType: GroupTypes.GROUP_TYPE.DATE.fiscalYear, group: '2016', localizeDateSpy: 0, localeMessageSpy: 4, expected: 'groupHeader.abbr.fiscalYear2016'},
        {name: 'valid date - week', dataType: SchemaConsts.DATE, groupType: GroupTypes.GROUP_TYPE.DATE.week, group: '05-10-2016', localizeDateSpy: 0, localeMessageSpy: 4, expected: 'groupHeader.date.week'},
        {name: 'valid date - month', dataType: SchemaConsts.DATE, groupType: GroupTypes.GROUP_TYPE.DATE.month, group: 'May,2016', localizeDateSpy: 0, localeMessageSpy: 5, expected: 'groupHeader.date.month'},
        {name: 'valid date - quarter', dataType: SchemaConsts.DATE, groupType: GroupTypes.GROUP_TYPE.DATE.quarter, group: '1,2016', localizeDateSpy: 0, localeMessageSpy: 5, expected: 'groupHeader.date.quarter'},
        {name: 'valid date - fiscalQtr', dataType: SchemaConsts.DATE, groupType: GroupTypes.GROUP_TYPE.DATE.fiscalQuarter, group: '1,2016', localizeDateSpy: 0, localeMessageSpy: 6, expected: 'groupHeader.date.quarter'},
        {name: 'valid date - year', dataType: SchemaConsts.DATE, groupType: GroupTypes.GROUP_TYPE.DATE.year, group: '2016', localizeDateSpy: 0, localeMessageSpy: 3, expected: '2016'},
        {name: 'valid date - decade', dataType: SchemaConsts.DATE, groupType: GroupTypes.GROUP_TYPE.DATE.decade, group: '2010', localizeDateSpy: 0, localeMessageSpy: 3, expected: '2010'},
        //
        {name: 'empty datetime', dataType: SchemaConsts.DATE_TIME, groupType: GroupTypes.COMMON.equals, group: '', localizeDateSpy: 0, localeMessageSpy: 4, expected: 'groupHeader.empty'},
        {name: 'valid datetime - equals', dataType: SchemaConsts.DATE_TIME, groupType: GroupTypes.COMMON.equals, group: '05-10-2016 07:45', localizeDateSpy: 0, localeMessageSpy: 3, expected: '05-10-2016 07:45'},
        {name: 'valid datetime - day', dataType: SchemaConsts.DATE_TIME, groupType: GroupTypes.GROUP_TYPE.DATE.day, group: '05-10-2016', localizeDateSpy: 0, localeMessageSpy: 3, expected: '05-10-2016'},
        {name: 'valid datetime - fiscalYr', dataType: SchemaConsts.DATE_TIME, groupType: GroupTypes.GROUP_TYPE.DATE.fiscalYear, group: '2016', localizeDateSpy: 0, localeMessageSpy: 4, expected: 'groupHeader.abbr.fiscalYear2016'},
        {name: 'valid datetime - week', dataType: SchemaConsts.DATE_TIME, groupType: GroupTypes.GROUP_TYPE.DATE.week, group: '05-10-2016', localizeDateSpy: 0, localeMessageSpy: 4, expected: 'groupHeader.date.week'},
        {name: 'valid datetime - month', dataType: SchemaConsts.DATE_TIME, groupType: GroupTypes.GROUP_TYPE.DATE.month, group: 'May,2016', localizeDateSpy: 0, localeMessageSpy: 5, expected: 'groupHeader.date.month'},
        {name: 'valid datetime - quarter', dataType: SchemaConsts.DATE_TIME, groupType: GroupTypes.GROUP_TYPE.DATE.quarter, group: '1,2016', localizeDateSpy: 0, localeMessageSpy: 5, expected: 'groupHeader.date.quarter'},
        {name: 'valid datetime - fiscalQtr', dataType: SchemaConsts.DATE_TIME, groupType: GroupTypes.GROUP_TYPE.DATE.fiscalQuarter, group: '1,2016', localizeDateSpy: 0, localeMessageSpy: 6, expected: 'groupHeader.date.quarter'},
        {name: 'valid datetime - year', dataType: SchemaConsts.DATE_TIME, groupType: GroupTypes.GROUP_TYPE.DATE.year, group: '2016', localizeDateSpy: 0, localeMessageSpy: 3, expected: '2016'},
        {name: 'valid datetime - decade', dataType: SchemaConsts.DATE_TIME, groupType: GroupTypes.GROUP_TYPE.DATE.decade, group: '2010', localizeDateSpy: 0, localeMessageSpy: 3, expected: '2010'},
    ];

    groupByDateCases.forEach(function(test) {
        it('Test case: ' + test.name, function() {
            let reportData = _.cloneDeep(fakeReportGroupData_template);

            reportData.data.groupFields[0].field.datatypeAttributes.type = test.dataType;
            reportData.data.groupFields[0].groupType = test.groupType;
            reportData.data.filteredRecords[0].group = test.group;
            reportData.data.filteredRecords[0].localized = false;

            props.report[0] = reportData;
            component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                    reportData={reportData}
                                                                    reportHeader={header_empty}
                                                                    reportFooter={fakeReportFooter}/>);


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
        {name: 'null duration', groupType: GroupTypes.COMMON.equals, group: null, localeMessageSpy: 4, expected: 'groupHeader.empty'},
        {name: 'empty duration', groupType: GroupTypes.COMMON.equals, group: '', localeMessageSpy: 4, expected: 'groupHeader.empty'},
        {name: 'valid equal duration - 1 second', groupType: GroupTypes.COMMON.equals, group: '1,s', localeMessageSpy: 3, expected: '1'},
        {name: 'valid equal duration - >1 second', groupType: GroupTypes.COMMON.equals, group: '30,s', localeMessageSpy: 3, expected: '30'},
        {name: 'valid equal duration - 1 minute', groupType: GroupTypes.COMMON.equals, group: '1,m', localeMessageSpy: 3, expected: '1'},
        {name: 'valid equal duration - >1 minute', groupType: GroupTypes.COMMON.equals, group: '30,m', localeMessageSpy: 3, expected: '30'},
        {name: 'valid equal duration - 1 hour', groupType: GroupTypes.COMMON.equals, group: '1,h', localeMessageSpy: 3, expected: '1'},
        {name: 'valid equal duration - >1 hour', groupType: GroupTypes.COMMON.equals, group: '30,h', localeMessageSpy: 3, expected: '30'},
        {name: 'valid equal duration - 1 day', groupType: GroupTypes.COMMON.equals, group: '1,D', localeMessageSpy: 3, expected: '1'},
        {name: 'valid equal duration - >1 day', groupType: GroupTypes.COMMON.equals, group: '30,D', localeMessageSpy: 3, expected: '30'},
        {name: 'valid equal duration - 1 week', groupType: GroupTypes.COMMON.equals, group: '1,W', localeMessageSpy: 3, expected: '1'},
        {name: 'valid equal duration - >1 week', groupType: GroupTypes.COMMON.equals, group: '30,W', localeMessageSpy: 3, expected: '30'},
        {name: 'invalid equal duration', groupType: GroupTypes.COMMON.equals, group: '30', localeMessageSpy: 3, expected: '30'},
        {name: 'valid second duration - 10 seconds', groupType: GroupTypes.GROUP_TYPE.DURATION.second, group: '10', localeMessageSpy: 4, expected: 'groupHeader.duration.seconds'},
        {name: 'valid second duration - 10 minutes', groupType: GroupTypes.GROUP_TYPE.DURATION.minute, group: '10', localeMessageSpy: 4, expected: 'groupHeader.duration.minutes'},
        {name: 'valid second duration - 10 hours', groupType: GroupTypes.GROUP_TYPE.DURATION.hour, group: '10', localeMessageSpy: 4, expected: 'groupHeader.duration.hours'},
        {name: 'valid second duration - 10 days', groupType: GroupTypes.GROUP_TYPE.DURATION.day, group: '10', localeMessageSpy: 4, expected: 'groupHeader.duration.days'},
        {name: 'valid second duration - 10 weeks', groupType: GroupTypes.GROUP_TYPE.DURATION.week, group: '10', localeMessageSpy: 4, expected: 'groupHeader.duration.weeks'}
    ];

    groupByDurationCases.forEach(function(test) {
        it('Test case: ' + test.name, function() {
            let reportData = _.cloneDeep(fakeReportGroupData_template);

            reportData.data.groupFields[0].field.datatypeAttributes.type = SchemaConsts.DURATION;
            reportData.data.groupFields[0].groupType = test.groupType;
            reportData.data.filteredRecords[0].group = test.group;
            reportData.data.filteredRecords[0].localized = false;

            props.report[0] = reportData;
            component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                    reportData={reportData}
                                                                    reportHeader={header_empty}
                                                                    reportFooter={fakeReportFooter}/>);


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
        let localizeGroupingSpy = spyOn(ReportContent.prototype, 'localizeGroupingHeaders').and.callThrough();
        let reportData = fakeReportGroupData_recursiveTemplate;

        props.report[0] = reportData;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={reportData}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);

        expect(localizeGroupingSpy.calls.count()).toEqual(0);
    });

});

describe('ReportContent grouping functions exception handling', () => {
    let component;
    let localizeNumberSpy;
    let localizeDateSpy;
    let localeGetMessageSpy;

    beforeEach(() => {
        ReportContentRewireAPI.__Rewire__('ReportGrid', ReportGridMock);
        ReportContentRewireAPI.__Rewire__('Locales', LocalesMock);
        localizeNumberSpy = spyOn(ReportContent.prototype, 'formatNumber').and.throwError();
        localizeDateSpy = spyOn(ReportContent.prototype, 'formatDate').and.throwError();
        localeGetMessageSpy = spyOn(LocalesMock, 'getMessage').and.callThrough();
    });

    afterEach(() => {
        ReportContentRewireAPI.__ResetDependency__('Locales');
        ReportContentRewireAPI.__ResetDependency__('ReportGridMock');
        localizeNumberSpy.calls.reset();
        localizeDateSpy.calls.reset();
        localeGetMessageSpy.calls.reset();

        //  initialize redux stores
        props.reports = [];
        props.record = [
            {pendEdits: {}}
        ];
    });

    var groupTestExceptionCases = [
        {name: 'exception handling formatting date', dataType: SchemaConsts.DATE, groupType: GroupTypes.GROUP_TYPE.DATE.equals, group: '05-10-2016', localizeDateSpy: 0, localizeNumberSpy: 0, expected: '05-10-2016'},
        {name: 'exception handling formatting number', dataType: SchemaConsts.NUMERIC, groupType: GroupTypes.GROUP_TYPE.DATE.equals, group: '1234', localizeDateSpy: 0, localizeNumberSpy: 0, expected: '1234'}
    ];

    groupTestExceptionCases.forEach(function(test) {
        it('Test case: ' + test.name, function() {
            let reportData = _.cloneDeep(fakeReportGroupData_template);

            reportData.data.groupFields[0].field.datatypeAttributes.type = test.dataType;
            reportData.data.groupFields[0].groupType = test.groupType;
            reportData.data.filteredRecords[0].group = test.group;
            reportData.data.filteredRecords[0].localized = false;

            props.report[0] = reportData;
            component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                    reportData={reportData}
                                                                    reportHeader={header_empty}
                                                                    reportFooter={fakeReportFooter}/>);

            //  validate the returned grouped header matches the input
            expect(reportData.data.filteredRecords[0].group).toEqual(test.expected);

            expect(localizeDateSpy.calls.count()).toEqual(test.localizeDateSpy);
            expect(localizeNumberSpy.calls.count()).toEqual(test.localizeNumberSpy);
            expect(localeGetMessageSpy.calls.count()).toEqual(3);
        });
    });
});

describe('ReportContent functions', () => {
    'use strict';
    var dtsErrorModalClass = ".dtsErrorModal";
    var component;

    beforeEach(() => {
        ReportContentRewireAPI.__Rewire__('ReportGrid', ReportGridMock);
        ReportContentRewireAPI.__Rewire__('Locales', LocalesMock);
        ReportContentRewireAPI.__Rewire__('WindowLocationUtils', WindowLocationUtilsMock);

        spyOn(WindowLocationUtilsMock, 'pushWithQuery').and.callThrough();
        //   spy on redux methods
        spyOn(props, 'selectReportRecords').and.callThrough();
        spyOn(props, 'openRecord').and.callThrough();
        spyOn(props, 'editRecordStart').and.callThrough();
        spyOn(props, 'editRecordCancel').and.callThrough();
        spyOn(props, 'editRecordChange').and.callThrough();
        spyOn(props, 'editRecordValidateField').and.callThrough();
        spyOn(props, 'addBlankRecordToReport').and.callThrough();
        spyOn(props, 'deleteRecord').and.callThrough();
        spyOn(props, 'updateRecord').and.callThrough();
        spyOn(props, 'createRecord').and.callThrough();
    });

    afterEach(() => {
        ReportContentRewireAPI.__ResetDependency__('Locales');
        ReportContentRewireAPI.__ResetDependency__('ReportGrid');
        ReportContentRewireAPI.__ResetDependency__('WindowLocationUtils');

        WindowLocationUtilsMock.pushWithQuery.calls.reset();
        props.selectReportRecords.calls.reset();
        props.openRecord.calls.reset();
        props.editRecordStart.calls.reset();
        props.editRecordCancel.calls.reset();
        props.editRecordChange.calls.reset();
        props.editRecordValidateField.calls.reset();
        props.addBlankRecordToReport.calls.reset();
        props.deleteRecord.calls.reset();
        props.updateRecord.calls.reset();
        props.createRecord.calls.reset();

        //  initialize redux stores
        props.reports = [];
        props.record = [
            {pendEdits: {}}
        ];
    });

    it('test render of component', () => {
        props.report[0] = fakeReportData_empty;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_empty}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of empty component', () => {
        props.report[0] = fakeReportData_empty;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_empty}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportGridMock).length).toEqual(1);
    });

    it('test hide of footer on row selection', () => {
        props.report[0] = fakeReportData_empty;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_emptyData}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}
                                                                selectedRows={selectedRowIds}/>);
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportGridMock).length).toEqual(1);
        var reportNavigation = TestUtils.scryRenderedDOMComponentsWithClass(component, "reportNavigation");
        expect(reportNavigation.length).toEqual(0);
    });

    it('test render of empty data', () => {
        props.report[0] = fakeReportData_empty;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_emptyData}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportGridMock).length).toEqual(1);
    });

    it('test render with keyField', () => {
        props.report[0] = fakeReportData_empty;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_emptyData}
                                                                fields={{keyField : {name: 'testId'}}}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportGridMock).length).toEqual(1);
    });


    it('test getOrigRec', () => {
        let keyField = "id";
        let origRec = Object.assign({}, fakeReportData_simple.data.filteredRecords[0]);
        let modifiedRec = _.merge({}, origRec, {col_num: {value:44}});
        let origRecExpect = {
            names: Object.assign({}, fakeReportData_simple.data.filteredRecords[0]),
            fids: {
                4: origRec[Object.keys(origRec).find((key) => {return (origRec[key].id === 4);})],
                5: origRec[Object.keys(origRec).find((key) => {return (origRec[key].id === 5);})],
                6: origRec[Object.keys(origRec).find((key) => {return (origRec[key].id === 6);})],
                7: origRec[Object.keys(origRec).find((key) => {return (origRec[key].id === 7);})],
                8: origRec[Object.keys(origRec).find((key) => {return (origRec[key].id === 8);})]
            }
        };

        props.report[0] = fakeReportData_simple;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_simple}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}
                                                                primaryKeyName={keyField} />);
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportGridMock).length).toEqual(1);
        let result = component.getOrigRec(modifiedRec[keyField].value);
        expect(result).toEqual(origRecExpect);
    });

    it('test getOrigGroupedRec with reportData', () => {
        let keyField = "id";
        let origRec = Object.assign({}, fakeReportData_simple.data.filteredRecords[0]);
        let modifiedRec = _.merge({}, origRec, {col_num: {value:44}});
        let origGroupRecExpect = {
            names: Object.assign({}, fakeReportData_simple.data.filteredRecords[0]),
            fids: {
                4: origRec[Object.keys(origRec).find((key) => {return (origRec[key].id === 4);})],
                5: origRec[Object.keys(origRec).find((key) => {return (origRec[key].id === 5);})],
                6: origRec[Object.keys(origRec).find((key) => {return (origRec[key].id === 6);})],
                7: origRec[Object.keys(origRec).find((key) => {return (origRec[key].id === 7);})],
                8: origRec[Object.keys(origRec).find((key) => {return (origRec[key].id === 8);})]
            }
        };

        props.report[0] = fakeReportData_simple;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_simple}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}
                                                                primaryKeyName={keyField} />);
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportGridMock).length).toEqual(1);
        let result = component.getOrigGroupedRec(modifiedRec[keyField].value);
        expect(result).toEqual(origGroupRecExpect);
    });

    it('test getOrigGroupedRec with no reportData', () => {
        let keyField = "id";
        let origRec = Object.assign({}, fakeReportData_simple.data.filteredRecords[0]);
        let modifiedRec = _.merge({}, origRec, {col_num: {value:44}});
        let origGroupRecNullExpect = {names: {}, fids: {}};

        props.report[0] = {};
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={{}}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}
                                                                primaryKeyName={keyField} />);
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportGridMock).length).toEqual(1);
        let result = component.getOrigGroupedRec(modifiedRec[keyField].value);
        expect(result).toEqual(origGroupRecNullExpect);
    });

    it('test validateRecord', () => {
        let validatedRecord = {ok: true, errors: []};
        props.report[0] = fakeReportData_empty;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_empty}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let result = component.validateRecord(null);
        expect(result).toEqual(validatedRecord);
    });

    it('test cancelRecordDelete', () => {
        let confirmDeletesDialogOpen = false;
        props.report[0] = fakeReportData_empty;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_empty}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        component.cancelRecordDelete();
        let result = component.state.confirmDeletesDialogOpen;
        expect(result).toEqual(confirmDeletesDialogOpen);
    });

    it('test handleValidateFieldValue with fieldDef', () => {
        props.report[0] = fakeReportData_empty;
        props.record[0].pendEdits = {
            isInlineEditOpen: true,
            currentEditingRecordId: 3
        };
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_empty}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        component.handleValidateFieldValue("fieldDef", "fieldName", "value", false);
        expect(props.editRecordValidateField).toHaveBeenCalled();
    });
    it('test handleValidateFieldValue with fieldDef but no recId', () => {
        props.report[0] = fakeReportData_empty;
        props.record[0].pendEdits = {
            isInlineEditOpen: true
        };
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
            reportData={fakeReportData_empty}
            reportHeader={header_empty}
            reportFooter={fakeReportFooter}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        component.handleValidateFieldValue("fieldDef", "fieldName", "value", false);
        expect(props.editRecordValidateField).not.toHaveBeenCalled();
    });

    it('test handleValidateFieldValue null fieldDef', () => {
        let error = 'Field Def not provided for field validation in reportContent';
        let handleValidateFieldValue = Promise.reject(error);

        props.report[0] = fakeReportData_empty;
        props.record[0].pendEdits = {
            isInlineEditOpen: true,
            currentEditingRecordId: 3
        };
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_empty}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let result = component.handleValidateFieldValue(null, "fieldName", "value", false);
        expect(result).toEqual(handleValidateFieldValue);
        expect(props.editRecordValidateField).not.toHaveBeenCalled();
    });

    it('test selectRows', () => {
        props.report[0] = fakeReportData_empty;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_empty}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        component.selectRows();
        expect(props.selectReportRecords).toHaveBeenCalled();
    });

    it('test toggleSelectedRow with id not in list', () => {
        fakeReportData_emptyData.selectedRows = [];
        props.report[0] = fakeReportData_empty;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_empty}
                                                                reportHeader={header_empty}
                                                                selectedRows={selectedRowIds}
                                                                reportFooter={fakeReportFooter}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        component.toggleSelectedRow(1);
        expect(props.selectReportRecords).toHaveBeenCalledWith(CONTEXT.REPORT.NAV, [1]);
    });
    it('test toggleSelectedRow with id in list', () => {
        props.report[0] = fakeReportData_selectedRowsData;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
            reportData={fakeReportData_selectedRowsData}
            reportHeader={header_empty}
            selectedRows={selectedRowIds}
            reportFooter={fakeReportFooter}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        component.toggleSelectedRow(1);
        expect(props.selectReportRecords).toHaveBeenCalledWith(CONTEXT.REPORT.NAV, [5]);

        // cleanup
        fakeReportData_emptyData.selectedRows = [];
    });

    it('test openRecordForEdit', () => {
        props.report[0] = fakeReportData_empty;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_empty}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        component.openRecordForEditInTrowser(1);
        expect(props.openRecord).toHaveBeenCalled();
        expect(WindowLocationUtilsMock.pushWithQuery).toHaveBeenCalled();
    });

    it('test onScrollRecords', () => {
        spyOn(flux.actions, 'scrollingReport');
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_empty}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        component.onScrollRecords();
        expect(flux.actions.scrollingReport).toHaveBeenCalled();
    });

    it('test isNumericDataType returns true', () => {
        let isNumericValue = true;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_empty}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let result = component.isNumericDataType(SchemaConsts.NUMERIC);
        expect(result).toEqual(isNumericValue);
        result = component.isNumericDataType(SchemaConsts.CURRENCY);
        expect(result).toEqual(isNumericValue);
        result = component.isNumericDataType(SchemaConsts.PERCENT);
        expect(result).toEqual(isNumericValue);
        result = component.isNumericDataType(SchemaConsts.RATING);
        expect(result).toEqual(isNumericValue);
    });

    it('test isDateDataType returns true', () => {
        let isDateValue = true;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_empty}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let result = component.isDateDataType(SchemaConsts.DATE);
        expect(result).toEqual(isDateValue);
        result = component.isDateDataType(SchemaConsts.DATE_TIME);
        expect(result).toEqual(isDateValue);
    });

    it('test isNumericDataType returns false', () => {
        let isNumericValue = false;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_empty}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let result = component.isNumericDataType(SchemaConsts.DATE);
        expect(result).toEqual(isNumericValue);
    });

    it('test isDateDataType returns false', () => {
        let isDateValue = false;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_empty}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let result = component.isDateDataType(SchemaConsts.NUMERIC);
        expect(result).toEqual(isDateValue);
    });

    it('test parseTimeOfDay with valid data returns parsedDate', () => {
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_empty}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        //test with only hh:mm
        let timeOfDay = "13:37";
        let expectedTimeOfDay = new Date(1970, 1, 1, '13', '37', 0);
        let result = component.parseTimeOfDay(timeOfDay);
        expect(result).toEqual(expectedTimeOfDay);
        //test with hh:mm:ss
        timeOfDay = "13:37:99";
        expectedTimeOfDay = new Date(1970, 1, 1, '13', '37', '99');
        result = component.parseTimeOfDay(timeOfDay);
        expect(result).toEqual(expectedTimeOfDay);
    });

    it('test parseTimeOfDay with non-string value returns null', () => {
        let timeOfDay = 13.37;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_empty}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let result = component.parseTimeOfDay(timeOfDay);
        expect(result).toBeNull();
    });

    it('test parseTimeOfDay with incorrect format value returns null', () => {
        let timeOfDay = "13:37:00:00";
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_empty}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let result = component.parseTimeOfDay(timeOfDay);
        expect(result).toBeNull();
    });

    it('test handleEditRecordStart existing record', () => {
        let keyField = "id";
        let origRec = Object.assign({}, fakeReportData_simple.data.filteredRecords[0]);

        props.report[0] = fakeReportData_simple;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_simple}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}
                                                                primaryKeyName={keyField} />);
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportGridMock).length).toEqual(1);

        component.handleEditRecordStart(origRec[keyField].value);
        expect(props.editRecordStart).toHaveBeenCalled();
    });

    it('test handleEditRecordStart unsaved record', () => {
        let keyField = 'id';
        let appId = '1';
        let tblId = '2';
        let origRec = Object.assign({}, fakeReportData_unsaved.data.filteredRecords[0]);

        props.report[0] = fakeReportData_unsaved;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_unsaved}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}
                                                                primaryKeyName={keyField} />);
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportGridMock).length).toEqual(1);
        component.handleEditRecordStart(origRec[keyField].value);
        expect(props.editRecordStart).toHaveBeenCalled();
    });

    it('test handleEditRecordCancel', () => {
        let keyField = "id";
        let origRec = Object.assign({}, fakeReportData_simple.data.filteredRecords[0]);

        props.report[0] = fakeReportData_simple;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_simple}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}
                                                                primaryKeyName={keyField} />);
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportGridMock).length).toEqual(1);
        component.handleEditRecordCancel(origRec[keyField].value);
        expect(props.editRecordCancel).toHaveBeenCalled();
    });

    it('test handleFieldChange', () => {
        let keyField = "id";
        let edits = {recordChanges:{
            4:{
                fieldName : 'col_num',
                newVal: {value:"hi", display:"there"}
            }
        },
            originalRecord: {fids:{
                4: {value: 'older'}
            }
            }
        };

        props.report[0] = fakeReportData_simple;
        props.record[0].pendEdits = edits;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_simple}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}
                                                                primaryKeyName={keyField}/>);
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportGridMock).length).toEqual(1);
        component.handleFieldChange({recId: 100, fid:4});
        expect(props.editRecordChange).toHaveBeenCalled();
    });

    it('test handleRecordDelete', () => {
        let keyField = "id";
        let origRec = Object.assign({}, fakeReportData_simple.data.records[0]);

        props.report[0] = fakeReportData_simple;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_simple}
                                                                primaryKeyName="col_text"
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter} />);
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportGridMock).length).toEqual(1);
        component.handleRecordDelete(origRec);
        component.deleteRecord();
        expect(props.deleteRecord).toHaveBeenCalled();
    });

    it('test handleRecordSaveClicked', () => {
        let keyField = "id";
        let edits = {recordChanges:{
            4:{
                fieldName : 'col_num',
                newVal: {value:"hi", display:"there"}
            }
        },
            originalRecord: {fids:{
                4: {value: 'older'}}
            }
        };
        let fieldsData = {
            fields : {
                data: [
                    {
                        id: 4,
                        builtIn: false
                    },
                    {
                        id: 5,
                        builtIn: true
                    }
                ]
            }
        };

        props.report[0] = fakeReportData_simple;
        props.record[0].pendEdits = edits;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_simple}
                                                                fields={fieldsData}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}
                                                                primaryKeyName={keyField} />);
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportGridMock).length).toEqual(1);
        let result = component.handleRecordSaveClicked({value: SchemaConsts.UNSAVED_RECORD_ID});
        expect(props.createRecord).toHaveBeenCalled();
    });

    it('test handleFieldChange undefined fid', () => {
        let keyField = "id";
        let edits = {
            recordChanges:{
            },
            originalRecord: {fids:{
                4: {value: 'older'}}
            }
        };

        props.report[0] = fakeReportData_simple;
        props.record[0].pendEdits = edits;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_simple}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}
                                                                primaryKeyName={keyField}/>);
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportGridMock).length).toEqual(1);
        component.handleFieldChange({recId: 100, fid:4});
        expect(props.editRecordChange).toHaveBeenCalled();
    });

    it('test handleRecordNewBlank on clean', () => {
        let keyField = "id";
        let edits = {
            isPendingEdit: false,
            recordChanges:{
            },
            originalRecord: {fids:{
                4: {value: 'older'}}
            }
        };

        props.report[0] = fakeReportData_simple;
        props.record[0].pendEdits = edits;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_simple}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}
                                                                primaryKeyName={keyField}/>);
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportGridMock).length).toEqual(1);

        component.handleRecordNewBlank(101);
        expect(props.addBlankRecordToReport).toHaveBeenCalled();
    });

    it('test handleRecordNewBlank on dirty', () => {
        let appId = '123';
        let tbleId = '456';
        let recordId = 101;
        let keyField = "id";
        let edits = {
            isPendingEdit: true,
            recordChanges:{
            },
            originalRecord: {fids:{
                4: {value: 'older'}}
            }
        };

        props.report[0] = fakeReportData_simple;
        props.record[0].pendEdits = edits;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_simple}
                                                                fields={fakeReportDataFields_simple}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}
                                                                primaryKeyName={keyField} />);
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportGridMock).length).toEqual(1);
        component.handleRecordNewBlank({value: recordId});

        expect(props.updateRecord).toHaveBeenCalled();
        // add back once new blank report record code is turned on..
        //expect(props.newBlankReportRecord).toHaveBeenCalledWith(CONTEXT.REPORT.NAV, appId, tbleId, recordId, false);
    });

    it('test handleRecordAdd', () => {
        let keyField = "id";
        let attrs = {setting: true};
        let fieldsData = {
            fields : {
                data: [
                    {
                        id: 4,
                        name: 'col_num',
                        builtIn: false,
                        datatypeAttributes :attrs
                    },
                    {
                        id: 5,
                        name :  'col_builtin',
                        builtIn: true
                    }
                ]
            }
        };
        let edits = {
            recordChanges:{
                4:{
                    fieldName : 'col_num',
                    fieldDef : fieldsData.fields.data[0],
                    newVal: {value:"hi", display:"there"}
                },
                5:{
                    fieldName : 'col_builtin',
                    fieldDef : fieldsData.fields.data[1],
                    newVal: {value:"5", display:"no edit"}
                }
            }
        };


        let newRec = [{
            fieldName: 'col_num',
            id: 4,
            value: "hi",
            display: "there",
            fieldDef: fieldsData.fields.data[0]
        }
        ];

        props.report[0] = fakeReportData_simple;
        props.record[0].pendEdits = edits;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_simple}
                                                                fields={fieldsData}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}
                                                                primaryKeyName={keyField}/>);
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportGridMock).length).toEqual(1);
        component.handleRecordAdd(edits.recordChanges);
        expect(props.createRecord).toHaveBeenCalled();
    });

    it('test handleRecordChange', () => {
        let keyField = "id";
        let edits = {recordChanges:{
            4:{
                fieldName : 'col_num',
                fieldDef : {
                    name: 'col_num',
                    id: 4
                },
                newVal: {value:"hi", display:"there"}
            }
        },
            originalRecord: {fids:{
                4: {value: 'older'},
                8: {value: null}
            }
            }
        };

        props.report[0] = fakeReportData_simple;
        props.record[0].pendEdits = edits;
        component = TestUtils.renderIntoDocument(
            <ReportContent {...props}
                           reportData={fakeReportData_simple}
                           fields={fakeReportDataFields_simple}
                           reportHeader={header_empty}
                           reportFooter={fakeReportFooter}
                           primaryKeyName={keyField} />);
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportGridMock).length).toEqual(1);
        component.handleRecordChange({value:100});

        let colList = [];
        fakeReportDataFields_simple.fields.data.forEach((field) => {
            colList.push(field.id);
        });
        let params = {
            context: CONTEXT.REPORT.NAV,
            pendEdits: edits,
            fields: fakeReportDataFields_simple.fields.data,
            colList: colList,
            showNotificationOnSuccess: true
        };
        expect(props.updateRecord).toHaveBeenCalledWith(props.appId, props.tblId, 100, params);
    });

    it('test render of data without attributes', () => {
        props.report[0] = fakeReportData_simple;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_simple}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);
        var grid = TestUtils.scryRenderedComponentsWithType(component, ReportGridMock);
        expect(grid.length).toEqual(1);
        grid = grid[0];
        expect(grid.props.records.length).toEqual(fakeReportData_simple.data.filteredRecords.length);
        expect(_.intersection(grid.props.columns, fakeReportData_simple.data.columns).length).toEqual(fakeReportData_simple.data.columns.length);
    });

    it('test startPerfTiming', () => {
        props.report[0] = fakeReportData_simple;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_simple}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);
        spyOn(flux.actions, 'mark');
        component.startPerfTiming({reportData: {
            loading : true
        }});
        expect(flux.actions.mark).toHaveBeenCalled();
    });

    it('test capturePerfTiming', () => {
        props.report[0] = fakeReportData_simple;
        component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                reportData={fakeReportData_simple}
                                                                reportHeader={header_empty}
                                                                reportFooter={fakeReportFooter}/>);
        spyOn(flux.actions, 'measure');
        spyOn(flux.actions, 'logMeasurements');
        component.capturePerfTiming({reportData: {
            loading : true
        }});
        expect(flux.actions.measure).toHaveBeenCalled();
        expect(flux.actions.logMeasurements).toHaveBeenCalled();
    });

    describe('handleRecordDelete', () => {
        let recordId = 4;
        let mockRecord = {
            'Another Field': {
                value: 900
            }
        };

        let testCases = [
            {
                description: 'deletes the selected record based on the id',
                primaryKeyFieldName: 'Record ID#'
            },
            {
                description: 'handles the record ID even if the record ID column name has changed',
                primaryKeyFieldName: 'Record ID#'
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let mockRecordForCurrentTest = Object.assign({}, mockRecord);
                mockRecordForCurrentTest[testCase.primaryKeyFieldName] = {value: recordId};

                props.report[0] = fakeReportData_simple;
                component = TestUtils.renderIntoDocument(<ReportContent {...props}
                                                                        reportData={fakeReportData_simple}
                                                                        reportHeader={header_empty}
                                                                        primaryKeyName={testCase.primaryKeyFieldName} />);
                spyOn(component, 'setState');
                component.handleRecordDelete(mockRecordForCurrentTest);

                expect(component.setState).toHaveBeenCalledWith({selectedRecordId: recordId});
                expect(component.setState).toHaveBeenCalledWith({confirmDeletesDialogOpen: true});
            });
        });
    });
});
