import ReportModelHelper from '../../src/models/reportModelHelper';
import * as SchemaConstants from '../../src/constants/schema';
import _ from 'lodash';

describe('Record Model', () => {

    const dataTypeAttributesNumeric = {
        type: 'NUMERIC',
        clientSideAttributes: {
            bold: false
        }
    };
    const dataTypeAttributesText = {
        type: 'SCALAR',
        clientSideAttributes: {
            bold: false,
            max_chars: 50,
            type: 'TEXT'
        }
    };
    const dataTypeAttributesDuration = {
        scale: 'Smart units',
        type: 'DURATION',
        clientSideAttributes: {
            bold: false
        }
    };
    const multiChoice = {
        choices: [
            {
                coercedValue: {
                    value: 'value'
                },
                displayValue: 'displayValue'
            }
        ]
    };

    const fields = [
        {id:2, builtIn:true, name:'Record ID#', datatypeAttributes:dataTypeAttributesNumeric},
        {id:3, builtIn:false, name:'Numeric', datatypeAttributes:dataTypeAttributesNumeric},
        {id:4, builtIn:false, name:'TextMultiChoice', datatypeAttributes:dataTypeAttributesText, multipleChoice: multiChoice},
        {id:6, builtIn:false, name:'Text', datatypeAttributes:dataTypeAttributesText},
        {id:8, builtIn:false, name:'Duration', datatypeAttributes:dataTypeAttributesDuration}
    ];

    const testReport = {
        data: {
            hasGrouping: false,
            keyField: {
                id: 2,
                name: 'Record ID#'
            },
            records: [
                {
                    'Record ID#': {
                        id:2, display: '22', value: 22
                    },
                    'Numeric': {
                        id:3, display: '3.0', value: 3
                    },
                    'Text': {
                        id:6, display: 'TestString', value: 'testString'
                    }
                }
            ],
            filteredRecords: [
                {
                    'Record ID#': {
                        id:2, display: '22', value: 22
                    },
                    'Numeric': {
                        id:3, display: '3.0', value: 3
                    },
                    'Text': {
                        id:6, display: 'TestString', value: 'testString'
                    }
                }
            ],
            fields: fields
        }
    };
    const updateTestContent = {
        recId: 22,
        record: [
            {id:2, display:'22', value: 22},
            {id:3, display:'4.0', value:'4'},
            {id:6, display:'TestingString', value:'TestingString'}
        ]
    };
    const addTestContent = {
        newRecId: 30,
        recId: SchemaConstants.UNSAVED_RECORD_ID,
        record: [
            {id:2, display:SchemaConstants.UNSAVED_RECORD_ID, value: SchemaConstants.UNSAVED_RECORD_ID},
            {id:3, display:'4.0', value:'4'},
            {id:6, display:'TestingString', value:'TestingString'}
        ]
    };

    const reportColumnsTests = [
        {name:'display all field columns', fidList: [2, 3, 4, 6, 8], notInFidList: []},
        {name:'display all field columns except built-in', fidList: [3, 4, 6, 8], notInFidList: [2]},
        {name:'display only built-in columns', fidList: [2], notInFidList: [3, 4, 6, 8]}
    ];
    reportColumnsTests.forEach(reportColumnTest => {
        it(reportColumnTest.name, () => {
            let columns = ReportModelHelper.getReportColumns(fields, reportColumnTest.fidList, []);
            expect(columns.length).toEqual(reportColumnTest.fidList.length);
            reportColumnTest.fidList.forEach(fid => {
                const findIdx = _.findIndex(columns, function(c) {return c.id === fid;});
                expect(findIdx !== -1).toBeTruthy();
            });
            reportColumnTest.notInFidList.forEach(fid => {
                const findIdx = _.findIndex(columns, function(c) {return c.id === fid;});
                expect(findIdx === -1).toBeTruthy();
            });
        });
    });


    it('update Report record method', () => {
        let currentReport = _.cloneDeep(testReport);
        let content = _.cloneDeep(updateTestContent);

        ReportModelHelper.updateReportRecord(currentReport, content);

        //  retrieve the updated record
        let updatedRecord = currentReport.data.records[0];

        // test to ensure each element in the record is updated with new content value
        Object.keys(updatedRecord).forEach((fieldName) => {
            let recd = _.find(content.record, function(r) {
                if (updatedRecord[fieldName].id === r.id) {
                    expect(updatedRecord[fieldName].value).toEqual(r.value);
                    expect(updatedRecord[fieldName].display).toEqual(r.display);
                }
            });
        });
    });

    it('delete Report record method', () => {
        let currentReport = _.cloneDeep(testReport);
        expect(currentReport.data.records.length).toEqual(1);

        //  delete record id not in report
        ReportModelHelper.deleteRecordFromReport(currentReport.data, 2);
        expect(currentReport.data.records.length).toEqual(1);

        //  delete record in report
        ReportModelHelper.deleteRecordFromReport(currentReport.data, 22);
        expect(currentReport.data.records.length).toEqual(0);
    });

    it('Get Report data method', () => {
        let reportData = ReportModelHelper.getReportData();
        expect(reportData.length).toEqual(0);

        reportData = ReportModelHelper.getReportData(fields, []);
        expect(reportData.length).toEqual(0);
    });


    it('add Report record method after specified row', () => {
        let currentReport = _.cloneDeep(testReport);
        let content = _.cloneDeep(addTestContent);

        //  1 record in the report
        expect(currentReport.data.records.length).toEqual(1);

        //  add the new record after the existing
        content.afterRecId = 22;

        ReportModelHelper.addReportRecord(currentReport, content);

        //  expect the new record to be added in the report
        expect(currentReport.data.records.length).toEqual(2);
        expect(currentReport.data.filteredRecords.length).toEqual(2);

        //  expect the new record to be added after the existing
        expect(currentReport.data.records[0][currentReport.data.keyField.name].value).toEqual(22);
        expect(currentReport.data.records[1][currentReport.data.keyField.name].value).toEqual(content.recId);
    });

    it('add Report record method as top row in report', () => {
        let currentReport = _.cloneDeep(testReport);
        let content = _.cloneDeep(addTestContent);

        //  1 record in the report
        expect(currentReport.data.records.length).toEqual(1);

        ReportModelHelper.addReportRecord(currentReport, content);

        //  expect the new record to be added in the report
        expect(currentReport.data.records.length).toEqual(2);
        expect(currentReport.data.filteredRecords.length).toEqual(2);

        //  expect the new record to be added after the existing
        expect(currentReport.data.records[0][currentReport.data.keyField.name].value).toEqual(content.recId);
        expect(currentReport.data.records[1][currentReport.data.keyField.name].value).toEqual(22);
    });

    it('add Report record method to an empty report', () => {
        let currentReport = _.cloneDeep(testReport);
        let content = _.cloneDeep(addTestContent);

        // clear out the records
        currentReport.data.records = [];
        currentReport.data.filteredRecords = [];

        //  0 record in the report
        expect(currentReport.data.records.length).toEqual(0);

        ReportModelHelper.addReportRecord(currentReport, content);

        //  expect the new record to be added in the report
        expect(currentReport.data.records.length).toEqual(1);
        expect(currentReport.data.filteredRecords.length).toEqual(1);

        //  expect the new record to be added after the existing
        expect(currentReport.data.records[0][currentReport.data.keyField.name].value).toEqual(content.recId);
    });

});
