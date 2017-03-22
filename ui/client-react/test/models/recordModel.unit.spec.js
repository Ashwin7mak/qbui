import RecordModel from '../../src/models/recordModel';
import {__RewireAPI__ as ReportModelRewireAPI} from '../../src/models/recordModel';
import {UNSAVED_RECORD_ID} from "../../src/constants/schema";

const appId = '1';
const tblId = '2';
const recId = 3;

const mockValidationMessage = {
    getMessage: () => {
        return 'message';
    }
};
const mockValidationUtils = {
    checkFieldValue: () => {
        return {
            id: 3,
            isInvalid: true,
            error: {
                messageId: 1
            }
        };
    }
};

describe('Record Model', () => {
    beforeEach(() => {
        spyOn(mockValidationMessage, 'getMessage').and.callThrough();
        spyOn(mockValidationUtils, 'checkFieldValue').and.callThrough();
        ReportModelRewireAPI.__Rewire__('ValidationMessage', mockValidationMessage);
        ReportModelRewireAPI.__Rewire__('ValidationUtils', mockValidationUtils);
    });
    afterEach(() => {
        mockValidationMessage.getMessage.calls.reset();
        mockValidationUtils.checkFieldValue.calls.reset();
        ReportModelRewireAPI.__ResetDependency__('ValidationMessage');
        ReportModelRewireAPI.__ResetDependency__('ValidationUtils');
    });

    it('Initialize record model object', () => {
        let recordModel = new RecordModel(appId, tblId, recId);
        let model = recordModel.get();
        expect(model.appId).toEqual(appId);
        expect(model.tblId).toEqual(tblId);
        expect(model.recId).toEqual(recId);
    });

    it('Initialize record model object with no input', () => {
        let recordModel = new RecordModel();
        let model = recordModel.get();
        expect(model.appId).toEqual(null);
        expect(model.tblId).toEqual(null);
        expect(model.recId).toEqual(null);
    });

    it('verify setEditRecordStart method with no inline edit', () => {
        let recordModel = new RecordModel();
        const obj = {
            appId: appId,
            tblId: tblId,
            recId: recId,
            origRec: {
                fids: [
                    {'8': {
                        value: 'original',
                        display: 'original display'
                    }}
                ]
            },
            changes: {}
        };
        recordModel.setEditRecordStart(obj);
        let model = recordModel.get();

        expect(model.appId).toEqual(obj.appId);
        expect(model.tblId).toEqual(obj.tblId);
        expect(model.recId).toEqual(obj.recId);
        expect(model.currentEditingAppId).toEqual(obj.appId);
        expect(model.currentEditingTableId).toEqual(obj.tblId);
        expect(model.currentEditingRecordId).toEqual(obj.recId);
        expect(model.originalRecord).toEqual(obj.origRec);
        expect(model.recordChanges).toEqual(obj.changes);
        expect(model.recordEditOpen).toEqual(true);
        expect(model.isInlineEditOpen).toEqual(false);
    });

    it('verify setEditRecordStart method with inline edit', () => {
        let recordModel = new RecordModel();
        const obj = {
            appId: appId,
            tblId: tblId,
            recId: recId,
            origRec: {
                fids: [
                    {'8': {
                        value: 'original',
                        display: 'original display'
                    }}
                ]
            },
            changes: {},
            isInlineEdit: true
        };
        recordModel.setEditRecordStart(obj);
        let model = recordModel.get();

        expect(model.appId).toEqual(obj.appId);
        expect(model.tblId).toEqual(obj.tblId);
        expect(model.recId).toEqual(obj.recId);
        expect(model.currentEditingAppId).toEqual(obj.appId);
        expect(model.currentEditingTableId).toEqual(obj.tblId);
        expect(model.currentEditingRecordId).toEqual(obj.recId);
        expect(model.originalRecord).toEqual(obj.origRec);
        expect(model.recordChanges).toEqual(obj.changes);
        expect(model.recordEditOpen).toEqual(true);
        expect(model.isInlineEditOpen).toEqual(true);
    });

    it('verify setEditRecordValidate method with errors', () => {
        let recordModel = new RecordModel();
        const obj = {
            appId: appId,
            tblId: tblId,
            recId: recId,
            origRec: {
                fids: [
                    {'8': {
                        value: 'original',
                        display: 'original display'
                    }}
                ]
            }
        };
        recordModel.setEditRecordStart(obj);

        const content = {
            fieldLabel: 'fieldLabel',
            value: '1',
            checkRequired: false
        };
        recordModel.setEditRecordValidate(content);
        let model = recordModel.get();

        expect(model.editErrors.ok).toBeFalsy();
        expect(mockValidationMessage.getMessage).toHaveBeenCalled();
        expect(model.editErrors.errors.length).toEqual(1);
    });

    it('verify setEditRecordChange method with original record and changes', () => {
        let recordModel = new RecordModel();
        const obj = {
            appId: appId,
            tblId: tblId,
            recId: recId,
            origRec: {
                fids: [
                    {'8': {
                        value: 'original',
                        display: 'original display'
                    }}
                ]
            }
        };
        recordModel.setEditRecordStart(obj);

        const changes = {
            values: {
                oldVal: {
                    value: 'original'
                },
                newVal: {
                    value: 'changes'
                }
            },
            fieldName: 'textField',
            fieldDef: 'fieldDef',
            fid: 8
        };
        recordModel.setEditRecordChange(changes);
        let model = recordModel.get();

        expect(model.isPendingEdit).toBeTruthy();
    });

    it('verify setEditRecordChange method with original record and no changes', () => {
        let recordModel = new RecordModel();
        const obj = {
            appId: appId,
            tblId: tblId,
            recId: recId,
            origRec: {
                fids: [
                    {'8': {
                        value: 'original',
                        display: 'original display'
                    }}
                ]
            }
        };
        recordModel.setEditRecordStart(obj);

        const changes = {
            values: {
                oldVal: {
                    value: 'original'
                },
                newVal: {
                    value: 'original'
                }
            },
            fieldName: 'textField',
            fieldDef: 'fieldDef',
            fid: 8
        };
        recordModel.setEditRecordChange(changes);
        let model = recordModel.get();

        expect(model.isPendingEdit).toBeFalsy();
    });

    it('verify setRecordChanges method', () => {
        let recordModel = new RecordModel();
        const obj = {
            appId: appId,
            tblId: tblId,
            recId: recId,
            origRec: {
                fids: [
                    {'8': {
                        value: 'original',
                        display: 'original display'
                    }}
                ]
            }
        };
        recordModel.setEditRecordStart(obj);

        const changes = {
            values: {
                oldVal: {
                    value: 'original'
                },
                newVal: {
                    value: 'changes'
                }
            },
            fieldName: 'textField',
            fieldDef: 'fieldDef',
            fid: 8
        };
        recordModel.setEditRecordChange(changes);
        recordModel.setRecordChanges(appId, tblId, UNSAVED_RECORD_ID, changes);
        const model = recordModel.get();

        expect(model.recordChanges).toEqual(changes);
        expect(model.saving).toBeTruthy();
    });

    it('verify setEditRecordSaveSuccess method', () => {
        let recordModel = new RecordModel();
        const obj = {
            appId: appId,
            tblId: tblId,
            recId: recId,
            origRec: {
                fids: [
                    {'8': {
                        value: 'original',
                        display: 'original display'
                    }}
                ]
            }
        };
        recordModel.setEditRecordStart(obj);

        const changes = {
            values: {
                oldVal: {
                    value: 'original'
                },
                newVal: {
                    value: 'changes'
                }
            },
            fieldName: 'textField',
            fieldDef: 'fieldDef',
            fid: 8
        };
        recordModel.setEditRecordChange(changes);
        recordModel.setRecordSaveSuccess(obj.appId, obj.tblId, obj.recId);

        let model = recordModel.get();

        expect(model.updateRecordInReportGrid).toBeTruthy();
        expect(model.isPendingEdit).toBeFalsy();
        expect(model.recordEditOpen).toBeFalsy();
    });

    it('verify record save errors with edit error list', () => {
        const errors = [{
            isInvalid: true,
            error: {
                messageId: 1,
                data: 'error data'
            }
        }];

        let recordModel = new RecordModel(appId, tblId, recId);
        const obj = {
            appId: appId,
            tblId: tblId,
            recId: recId,
            origRec: {
                fids: [
                    {'8': {
                        value: 'original',
                        display: 'original display'
                    }}
                ]
            },
            changes: {},
            isInlineEdit: true
        };
        recordModel.setEditRecordStart(obj);
        recordModel.setRecordSaveError(obj.appId, obj.tblId, obj.recId, errors);

        let model = recordModel.get();
        expect(model.hasAttemptedSave).toBeTruthy();
        expect(model.recordEditOpen).toBeTruthy();
        expect(model.saving).toBeFalsy();

        expect(model.editErrors.ok).toBeFalsy();
        expect(mockValidationMessage.getMessage).toHaveBeenCalled();
        expect(model.editErrors.errors.length).toEqual(1);
    });

    it('verify record save errors with no edit error list', () => {
        const errors = [];

        let recordModel = new RecordModel(appId, tblId, recId);
        const obj = {
            appId: appId,
            tblId: tblId,
            recId: recId,
            origRec: {
                fids: [
                    {'8': {
                        value: 'original',
                        display: 'original display'
                    }}
                ]
            },
            changes: {},
            isInlineEdit: true
        };
        recordModel.setEditRecordStart(obj);
        recordModel.setRecordSaveError(obj.appId, obj.tblId, obj.recId, errors);

        let model = recordModel.get();
        expect(model.hasAttemptedSave).toBeTruthy();
        expect(model.recordEditOpen).toBeTruthy();
        expect(model.saving).toBeFalsy();

        expect(model.editErrors.ok).toBeTruthy();
        expect(mockValidationMessage.getMessage).not.toHaveBeenCalled();
        expect(model.editErrors.errors.length).toEqual(0);
    });

    it('verify edit record cancel', () => {
        let recordModel = new RecordModel(appId, tblId, recId);
        const obj = {
            appId: appId,
            tblId: tblId,
            recId: recId,
            origRec: {
                fids: [
                    {'8': {
                        value: 'original',
                        display: 'original display'
                    }}
                ]
            },
            changes: {},
            isInlineEdit: true
        };
        recordModel.setEditRecordStart(obj);
        let model = recordModel.get();
        expect(model.appId).toBe(obj.appId);
        expect(model.tblId).toBe(obj.tblId);
        expect(model.recId).toBe(obj.recId);
        expect(model.isInlineEditOpen).toEqual(true);

        recordModel.setEditRecordCancel();
        model = recordModel.get();
        expect(model.appId).toBeNull();
        expect(model.tblId).toBeNull();
        expect(model.recId).toBeNull();
        expect(model.isInlineEditOpen).toEqual(false);
    });

    let savingStateTestCases = [
        {name:'set saving state to true and implied no init', state: true, noInit: null, expectation: true, editErrors: true},
        {name:'set saving state to false and implied no init', state: false, noInit: null, expectation: false, editErrors: true},
        {name:'set saving state to true and explicit no initialize', state: true, noInit: false, expectation: true, editErrors: true},
        {name:'set saving state to true and initialize', state: true, noInit: true, expectation: true, editErrors: false},
        {name:'set saving state to false and initialize', state: false, noInit: true, expectation: false, editErrors: false}
    ];
    savingStateTestCases.forEach(testCase => {
        it(testCase.name, () => {
            let recordModel = new RecordModel(appId, tblId, recId);
            const errors = [{
                isInvalid: true,
                error: {
                    messageId: 1,
                    data: 'error data'
                }
            }];
            recordModel.setErrors(errors);

            recordModel.setSaving(testCase.state, testCase.noInit);
            const model = recordModel.get();
            expect(model.saving).toBe(testCase.expectation);
            expect(model.editErrors.ok).toBe(testCase.editErrors);
        });
    });


});
