import ReportModel from '../../src/models/reportModel';
import ReportModelHelper from '../../src/models/reportModelHelper';
import {__RewireAPI__ as ReportModelRewireAPI} from '../../src/models/reportModel';
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
                    }
                },
                {
                    'Numeric': {
                        id:3, display: '3.0', value: 3
                    }
                },
                {
                    'Text': {
                        id:6, display: 'TestString', value: 'testString'
                    }
                }
            ],
            filteredRecords: [
                {
                    'Record ID#': {
                        id:2, display: '22', value: 22
                    }
                },
                {
                    'Numeric': {
                        id:3, display: '3.0', value: 3
                    }
                },
                {
                    'Text': {
                        id:6, display: 'TestString', value: 'testString'
                    }
                }
            ],
            fields: fields
        }
    };
    const testContent = {
        recId: 2,
        record: [
            {id:2, display:'22', value: 22},
            {id:3, display:'4.0', value:'4'},
            {id:6, display:'TestingString', value:'TestingString'}
        ]
    };

    beforeEach(() => {
        //spyOn(mockValidationMessage, 'getMessage').and.callThrough();
        //spyOn(mockValidationUtils, 'checkFieldValue').and.callThrough();
        //RecordModelRewireAPI.__Rewire__('ValidationMessage', mockValidationMessage);
        //RecordModelRewireAPI.__Rewire__('ValidationUtils', mockValidationUtils);
    });
    afterEach(() => {
        //mockValidationMessage.getMessage.calls.reset();
        //mockValidationUtils.checkFieldValue.calls.reset();
        //RecordModelRewireAPI.__ResetDependency__('ValidationMessage');
        //RecordModelRewireAPI.__ResetDependency__('ValidationUtils');
    });

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
        let currentReport = _.deepClone(testReport);
        let content = _.deepClone(testContent);

        ReportModelHelper.updateReportRecord(currentReport, content);
        let dataRecords = currentReport.data.records;

        // test to ensure the currentReport is updated with the content changes
        expect

    })


});
