import ReportRowTransformer, {__RewireAPI__ as ReportRowTransformerRewireAPI} from 'APP/components/dataTable/reportGrid/reportRowTransformer';
import SchemaConsts from 'COMMON/constants';
import {DEFAULT_RECORD_KEY} from 'APP/constants/schema';



describe('ReportRowTransformer', () => {
    const testRecordId = 3;
    const testFieldId = 'fieldA';
    const testRecord = {1: {id: testFieldId, name: 'some field'}};
    const testIndex = 0;
    const testApiRecord = {'Record ID#': {id: 1, value: testRecordId, display: testRecordId}, 'Text': {id: 2, value: 'text', display: 'text'}};
    const testFields = [
        {
            id: 1,
            defaultValue: null,
            field: 'Record ID#',
            headerName: 'Record ID#',
            fieldDef: {id: 1, name: 'Record ID#', datatypeAttributes: {type: SchemaConsts.NUMERIC}}
        },
        {
            id: 2,
            defaultValue: null,
            field: 'Text',
            headerName: 'Text',
            fieldDef: {id: 2, name: 'Text', datatypeAttributes: {type: SchemaConsts.TEXT}}
        }
    ];

    describe('New', () => {
        let testCases = [
            {
                description: 'creates a new instance of a ReportRowTransformer',
                editingRecordId: null,
                isSelected: false,
                parentId: null,
                isSaving: false,
                editErrors: null,
                expectedIsEditing: false,
                expectedEditingRecordId: null,
                expectedIsSelected: false,
                expectedParentId: null,
                expectedIsSaving: false,
                expectedIsValid: true,
                expectedFieldIsInvalid: false,
                expectedFieldInvalidMessage: null
            },
            {
                description: 'sets editing to true if the currently editing record id matches the id for the record',
                editingRecordId: testRecordId,
                isSelected: false,
                parentId: null,
                isSaving: false,
                editErrors: null,
                expectedIsEditing: true,
                expectedEditingRecordId: testRecordId,
                expectedIsSelected: false,
                expectedParentId: null,
                expectedIsSaving: false,
                expectedIsValid: true,
                expectedFieldIsInvalid: false,
                expectedFieldInvalidMessage: null
            },
            {
                description: 'marks the record and related field as invalid if there are editErrors that match',
                editingRecordId: testRecordId,
                isSelected: false,
                parentId: null,
                isSaving: false,
                editErrors: {ok: false, errors: [{id: testFieldId, isInvalid: true, invalidMessage: 'test error message'}]},
                expectedIsEditing: true,
                expectedEditingRecordId: testRecordId,
                expectedIsSelected: false,
                expectedParentId: null,
                expectedIsSaving: false,
                expectedIsValid: false,
                expectedFieldIsInvalid: true,
                expectedFieldInvalidMessage: 'test error message'
            },
            {
                description: 'does not add validation errors to unrelated fields',
                editingRecordId: testRecordId,
                isSelected: false,
                parentId: null,
                isSaving: false,
                editErrors: {ok: false, errors: [{id: 99, isInvalid: true, invalidMessage: 'test error message'}]},
                expectedIsEditing: true,
                expectedEditingRecordId: testRecordId,
                expectedIsSelected: false,
                expectedParentId: null,
                expectedIsSaving: false,
                expectedIsValid: false,
                expectedFieldIsInvalid: false,
                expectedFieldInvalidMessage: null
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let reportRowTransformer = new ReportRowTransformer({
                    record: testRecord,
                    id: testRecordId,
                    editingRecordId: testCase.editingRecordId,
                    isSelected: testCase.isSelected,
                    parentId: testCase.parentId,
                    isSaving: testCase.isSaving,
                    editErrors: testCase.editErrors
                });

                expect(reportRowTransformer.isEditing).toEqual(testCase.expectedIsEditing);
                expect(reportRowTransformer.isSelected).toEqual(testCase.expectedIsSelected);
                expect(reportRowTransformer.parentId).toEqual(testCase.expectedParentId);
                expect(reportRowTransformer.isSaving).toEqual(testCase.expectedIsSaving);
                expect(reportRowTransformer.isValid).toEqual(testCase.expectedIsValid);
                expect(reportRowTransformer.fieldA.isEditing).toEqual(testCase.expectedIsEditing);
                expect(reportRowTransformer.fieldA.isInvalid).toEqual(testCase.expectedFieldIsInvalid);
                expect(reportRowTransformer.fieldA.invalidMessage).toEqual(testCase.expectedFieldInvalidMessage);
            });
        });
    });

    describe('transformRecordForGrid', () => {
        it('transforms report API data into a row that can be used by the grid', () => {
            const expectedResult = new ReportRowTransformer({
                record: {
                    1: {...testFields[0], value: testRecordId, display: testRecordId, recordId: testRecordId, uniqueElementKey: `${testIndex}-fid-1-recId-${testRecordId}`},
                    2: {...testFields[1], value: 'text', display: 'text', recordId: testRecordId, uniqueElementKey: `${testIndex}-fid-2-recId-${testRecordId}`},
                },
                id: testRecordId,
                editingRecordId: null,
                isSelected: false,
                parentId: null,
                isSaving: false,
                editErrors: null
            });

            let actualResult = ReportRowTransformer.transformRecordForGrid(
                testApiRecord,
                testIndex,
                testFields,
                {
                    primaryKeyFieldName: 'Record ID#',
                    editingRecordId: null,
                    parentId: null,
                }
            );

            expect(actualResult).toEqual(expectedResult);
        });

        it('uses the values for pendEdits if inlineEdit is open and the pendEdits record id matches the current record Id', () => {
            const pendEdits = {
                currentEditingRecordId: testRecordId,
                isInlineEditOpen: true,
                recordChanges: {
                    2: {newVal: {value: 'pendEditValue', display: 'pendingEditDisplay'}}
                }
            };

            let actualResult = ReportRowTransformer.transformRecordForGrid(
                testApiRecord,
                testIndex,
                testFields,
                {primaryKeyFieldName: 'Record ID#', pendEdits: pendEdits}
            );

            expect(actualResult[2].value).toEqual(pendEdits.recordChanges[2].newVal.value);
            expect(actualResult[2].display).toEqual(pendEdits.recordChanges[2].newVal.display);
            expect(actualResult[2].hasFocusOnEditStart).toBeFalsy();
        });

        it('sets hasFocusOnEditStart for a field if the record has not been changed yet and it was the field that initiated the edit', () => {
            const pendEdits = {
                currentEditingRecordId: testRecordId,
                isInlineEditOpen: true,
                recordChanges: {
                    1: {newVal: {value: 'anotherField', display: 'anotherField'}},
                    2: {newVal: {value: 'pendEditValue', display: 'pendingEditDisplay'}}
                },
                fieldToStartEditing: {id: 2}
            };

            let actualResult = ReportRowTransformer.transformRecordForGrid(
                testApiRecord,
                testIndex,
                testFields,
                {primaryKeyFieldName: 'Record ID#', pendEdits: pendEdits}
            );

            expect(actualResult[2].hasFocusOnEditStart).toBeFalsy();
            expect(actualResult[1].hasFocusOnEditStart).toBeFalsy();
        });

        it('does not set hasFocusOnEditStart if the user has started modifying the record (prevents focus from continually moving back to the first field)', () => {
            const pendEdits = {
                currentEditingRecordId: testRecordId,
                isInlineEditOpen: true,
                recordChanges: {},
                fieldToStartEditing: {id: 2}
            };

            let actualResult = ReportRowTransformer.transformRecordForGrid(
                testApiRecord,
                testIndex,
                testFields,
                {primaryKeyFieldName: 'Record ID#', pendEdits: pendEdits}
            );

            expect(actualResult[2].hasFocusOnEditStart).toBeTruthy();
            expect(actualResult[1].hasFocusOnEditStart).toBeFalsy();
        });
    });

    describe('transformRecordsForGrid', () => {
        beforeEach(() => {
            // Mock out Lodash's uniqueId function so it produces a predictable output for tests. Other functions remain the same.
            ReportRowTransformerRewireAPI.__Rewire__('_', Object.assign({}, _, {uniqueId(name) {return name;}}));
        });

        afterEach(() => {
            ReportRowTransformerRewireAPI.__ResetDependency__('_');
        });

        const defaultInfo = {
            primaryKeyFieldName: DEFAULT_RECORD_KEY,
            editingRecordId: null,
            pendEdits: {},
            selectedRows: [],
            parentId: null,
            subHeaderLevel: 0,
            isInlineEditOpen: false
        };

        it('returns an empty array if no records are passed in', () => {
            expect(ReportRowTransformer.transformRecordsForGrid(null, testFields)).toEqual([]);
        });

        it('transforms each record passed in into an instance of a transformed record', () => {
            spyOn(ReportRowTransformer, 'transformRecordForGrid').and.returnValue('transformed');

            let actualResult = ReportRowTransformer.transformRecordsForGrid([testApiRecord], testFields);

            expect(actualResult).toEqual(['transformed']);
            expect(ReportRowTransformer.transformRecordForGrid).toHaveBeenCalledWith(testApiRecord, 0, testFields, defaultInfo);
        });

        it('flattens grouped records', () => {
            spyOn(ReportRowTransformer, 'transformRecordForGrid').and.returnValue('transformed');

            let groupName = 'test group';
            let groupedRecord = {group: groupName, children: [testApiRecord], localized: true};

            let actualResult = ReportRowTransformer.transformRecordsForGrid([groupedRecord], testFields);

            expect(actualResult).toEqual([
                // The group header
                {
                    isSubHeader: true,
                    subHeaderLevel: 0,
                    subHeaderLabel: groupName,
                    localized: true,
                    id: `groupHeader_${groupName}`,
                    parentId: null
                },

                // The record that belongs to that group
                'transformed'
            ]);

            // Transformer only called once for the single child record, but should not be called for the subheader
            expect(ReportRowTransformer.transformRecordForGrid.calls.count()).toEqual(1);
        });

        it('flattens grouped records that are nested more than 1 level deep', () => {
            const level1GroupName = 'level 1';
            const level2GroupName = 'level 2';
            const level2bGroupName = 'level 2b';
            const level3GroupName = 'level 3';
            const regularRowName = 'regular row';

            spyOn(ReportRowTransformer, 'transformRecordForGrid').and.returnValue(regularRowName);

            function buildExepctedGroupHeader(subHeaderName, subHeaderLevel, parentIdName) {
                return {
                    id: `groupHeader_${subHeaderName}`,
                    isSubHeader: true,
                    localized: true,
                    parentId: (parentIdName ? `groupHeader_${parentIdName}` : null),
                    subHeaderLabel: subHeaderName,
                    subHeaderLevel: subHeaderLevel
                };
            }

            let nestedRecords = {
                group: level1GroupName,
                localized: true,
                children: [
                    {
                        group: level2GroupName,
                        localized: true,
                        children: [
                            {
                                group: level3GroupName,
                                localized: true,
                                children: [testApiRecord]
                            }
                        ]
                    },
                    {
                        group: level2bGroupName,
                        localized: true,
                        children: [testApiRecord]
                    },
                ]
            };

            let result = ReportRowTransformer.transformRecordsForGrid([nestedRecords], testFields);

            expect(result.length).toEqual(6);
            expect(result[0]).toEqual(buildExepctedGroupHeader(level1GroupName, 0));
            expect(result[1]).toEqual(buildExepctedGroupHeader(level2GroupName, 1, level1GroupName));
            expect(result[2]).toEqual(buildExepctedGroupHeader(level3GroupName, 2, level2GroupName));
            expect(result[3]).toEqual(regularRowName);
            expect(result[4]).toEqual(buildExepctedGroupHeader(level2bGroupName, 1, level1GroupName));
            expect(result[5]).toEqual(regularRowName);
        });
    });
});
