import AppHistory, {__RewireAPI__ as AppHistoryRewireAPI} from '../../src/globals/appHistory';
import {UNSAVED_RECORD_ID} from '../../src/constants/schema';
import {ShowAppModal, HideAppModal} from '../../src/components/qbModal/appQbModalFunctions';
import {CONTEXT} from '../../src/actions/context';


let currentModalDetails = null;
let mockActions = {
    ShowAppModal(modalDetails) {
        currentModalDetails = modalDetails;
        return modalDetails;
    },
    HideAppModal(_modalDetails) {return true;},
    clickSaveButton() {
        currentModalDetails.primaryButtonOnClick();
    },
    clickStayButton() {
        currentModalDetails.leftButtonOnClick();
    },
    clickDiscardChanges() {
        currentModalDetails.middleButtonOnClick();
    }
};

describe('AppHistory', () => {

    beforeEach(() => {
        AppHistoryRewireAPI.__Rewire__('ShowAppModal', mockActions.ShowAppModal);
        AppHistoryRewireAPI.__Rewire__('HideAppModal', mockActions.HideAppModal);
    });

    afterEach(() => {
        AppHistoryRewireAPI.__ResetDependency__('ShowAppModal');
        AppHistoryRewireAPI.__ResetDependency__('HideAppModal');
    });

    afterAll(() => {
        AppHistory.reset();
    });

    function goToNewPage() {
        AppHistory.history.push({
            pathname: '/home'
        });
    }

    let store = {
        record: {
            recordIdBeingEdited: 3,
            records: [{
                id: 3,
                pendEdits: {
                    isPendingEdit: false,
                    isInlineEditOpen: false,
                    currentEditingAppId: '1',
                    currentEditingTableId: '2',
                    currentEditingRecordId: '3'
                }
            }]
        },
        forms: [{
            formData: {
                fields: {}
            }
        }],
        report: [{
            id: CONTEXT.REPORT.NAV,
            data: {
                fields: {field: 1, field2: 2, field3: 3}
            }
        }]
    };

    let mockStore = {
        getState: () => {
            return store;
        },
        dispatch: (func) => {
            return {
                then(callbackSuccess, callbackFail) {
                    callbackSuccess();
                }
            };
        }
    };
    let mockStoreReject = {
        getState: () => {
            return store;
        },
        dispatch: (func) => {
            return {
                then(callbackSuccess, callbackFail) {
                    callbackFail();
                }
            };
        }
    };
    let mockStoreFunc = {
        editRecordCancel: () => {},
        createRecord: () => {},
        updateRecord: () => {},
        updateForm: () => {},
        saveReport: () => {},
        saveFormComplete: () => {},
        hideTrowser: () => {},
        showErrorMsgDialog: () => {},
        getNavReport: () => {},
        setFieldsPropertiesPendingEditToFalse: () => {},
        setFormBuilderPendingEditToFalse: () => {},
        setReportBuilderPendingEditToFalse: () => {}
    };

    describe('Test new appHistory instances', () => {
        it('create a new instance of AppHistory and build a history object', () => {
            let appHistory = AppHistory;
            expect(appHistory.history).not.toBeNull();
            expect(appHistory.store).toBeNull();
            expect(appHistory.editRecordCancel).toBeNull();
            expect(appHistory.createRecord).toBeNull();
            expect(appHistory.updateRecord).toBeNull();
            expect(appHistory.updateForm).toBeNull();
            expect(appHistory.saveFormComplete).toBeNull();
            expect(appHistory.hideTrowser).toBeNull();
            expect(appHistory.showErrorMsgDialog).toBeNull();
            expect(appHistory.getNavReport).toBeNull();
            expect(appHistory.setFieldsPropertiesPendingEditToFalse).toBeNull();
            expect(appHistory.setFormBuilderPendingEditToFalse).toBeNull();
            expect(appHistory.setReportBuilderPendingEditToFalse).toBeNull();
        });

        it('Is a singleton class; ensure only one instance created', () => {
            let appHistory1 = AppHistory;
            let appHistory2 = AppHistory;
            appHistory1.appId = 1;
            expect(appHistory2.appId).toEqual(1);
        });
    });

    describe('Test appHistory instance configuration', () => {
        it('sets a reference to the redux store and functions', () => {
            let appHistory = AppHistory;
            appHistory.setup(mockStore, mockStoreFunc);
            expect(appHistory.store).toEqual(mockStore);
            expect(appHistory.editRecordCancel).toBeDefined();
            expect(appHistory.createRecord).toBeDefined();
            expect(appHistory.updateRecord).toBeDefined();
            expect(appHistory.updateForm).toBeDefined();
            expect(appHistory.saveFormComplete).toBeDefined();
            expect(appHistory.hideTrowser).toBeDefined();
            expect(appHistory.showErrorMsgDialog).toBeDefined();
            expect(appHistory.getNavReport).toBeDefined();
            expect(appHistory.setFieldsPropertiesPendingEditToFalse).toBeDefined();
            expect(appHistory.setFormBuilderPendingEditToFalse).toBeDefined();
            expect(appHistory.setReportBuilderPendingEditToFalse).toBeDefined();
        });

        it('sets a listener for internal app route changes', () => {
            spyOn(AppHistory.history, 'block');
            AppHistory.setup(mockStore, mockStoreFunc);
            expect(AppHistory.history.block).toHaveBeenCalled();
        });

        it('sets a listener for browser chrome route changes (e.g., pasting a link in the URL bar)', () => {
            const windowUtilsSpy = {
                addEventListener: {}
            };
            AppHistoryRewireAPI.__Rewire__('WindowUtils', windowUtilsSpy);

            spyOn(windowUtilsSpy, 'addEventListener');
            AppHistory.setup(mockStore, mockStoreFunc);
            expect(windowUtilsSpy.addEventListener).toHaveBeenCalledWith(
                "beforeunload",
                jasmine.any(Function)
            );

            AppHistoryRewireAPI.__ResetDependency__('WindowUtils');
        });
    });

    describe('Test getFields function', () => {
        beforeEach(() => {
            spyOn(AppHistory, 'getFieldsFromReportStore').and.callThrough();
            spyOn(AppHistory, 'getFieldsFromFormStore');
            spyOn(mockStoreFunc, 'getNavReport');
        });
        afterEach(() => {
            AppHistory.getFieldsFromReportStore.calls.reset();
            AppHistory.getFieldsFromFormStore.calls.reset();
        });
        let testCases = [
            {name:'verify get fields from report store', isInlineEditOpen: true},
            {name:'verify get fields from forms store', isInlineEditOpen: false}
        ];
        testCases.forEach(testCase => {
            it(testCase.name, () => {
                store.record.records[0].pendEdits.isInlineEditOpen = testCase.isInlineEditOpen;
                AppHistory.setup(mockStore, mockStoreFunc);
                AppHistory.getFields();
                if (testCase.isInlineEditOpen) {
                    expect(AppHistory.getFieldsFromReportStore).toHaveBeenCalled();
                    expect(AppHistory.getFieldsFromFormStore).not.toHaveBeenCalled();
                } else {
                    expect(AppHistory.getFieldsFromReportStore).not.toHaveBeenCalled();
                    expect(AppHistory.getFieldsFromFormStore).toHaveBeenCalled();
                }
            });
        });

        it(`gets fields from reports store if the id matches ${CONTEXT.REPORT.NAV}`, () => {
            AppHistory.setup(mockStore, mockStoreFunc);
            mockStoreFunc.getNavReport.and.returnValue(store.report[0]);

            let result = AppHistory.getFieldsFromReportStore();

            expect(result).toEqual(store.report[0].data.fields);
        });
    });

    describe('showPendingEditsConfirmationModal', () => {
        it('shows a default confirmation modal for allowing the user to decide what to do if they have unsaved changed', () => {
            let mockShowAppModal = jasmine.createSpy('ShowAppModal');
            AppHistoryRewireAPI.__Rewire__('ShowAppModal', mockShowAppModal);

            AppHistory.showPendingEditsConfirmationModal();
            expect(mockShowAppModal).toHaveBeenCalled();
        });

        it('accepts alternate functions that will be called when various buttons on the modal are clicked', () => {
            let mockShowAppModal = jasmine.createSpy('ShowAppModal');
            AppHistoryRewireAPI.__Rewire__('ShowAppModal', mockShowAppModal);

            let fakeSaveFunction = function() {};
            let fakeDiscardFunction = function() {};
            let fakeCancelFunction = function() {};

            AppHistory.showPendingEditsConfirmationModal(fakeSaveFunction, fakeDiscardFunction, fakeCancelFunction);

            expect(mockShowAppModal).toHaveBeenCalledWith({
                type: 'alert',
                messageI18nKey: 'pendingEditModal.modalBodyMessage',
                primaryButtonI18nKey: 'pendingEditModal.modalSaveButton',
                primaryButtonOnClick: fakeSaveFunction,
                middleButtonI18nKey: 'pendingEditModal.modalDoNotSaveButton',
                middleButtonOnClick: fakeDiscardFunction,
                leftButtonI18nKey: 'pendingEditModal.modalStayButton',
                leftButtonOnClick: fakeCancelFunction
            });
        });
    });

    describe('verify save functions', () => {
        let mockState = {
            fieldsStore: {
                isPendingEdit: false
            },
            formsStore: {
                isPendingEdit: false
            },
            recordStore: {
                isPendingEdit: false
            },
            reportBuilderStore: {
                isPendingEdit: false
            }
        };

        beforeEach(() => {
            spyOn(AppHistory, '_continueToDestination');
            spyOn(AppHistory, '_haltRouteChange');
            spyOn(AppHistory, 'showPendingEditsConfirmationModal');
            spyOn(AppHistory, '_discardChangesForRecord').and.callThrough();
            spyOn(AppHistory, '_discardChangesForFormBuilder').and.callThrough();
            spyOn(AppHistory, '_discardChangesForReportBuilder').and.callThrough();
            spyOn(mockStore, 'dispatch').and.callThrough();
            spyOn(mockStoreReject, 'dispatch').and.callThrough();
            spyOn(AppHistory, '_saveChangesForRecord').and.callThrough();
            spyOn(AppHistory, '_saveChangesForFormBuilder').and.callThrough();
            spyOn(AppHistory, '_saveChangesForReportBuilder').and.callThrough();
            spyOn(mockStoreFunc, 'updateForm');
            spyOn(mockStoreFunc, 'saveReport');
            spyOn(mockStoreFunc, 'createRecord');
            spyOn(mockStoreFunc, 'updateRecord');
            spyOn(mockStoreFunc, 'saveFormComplete');
            spyOn(mockStoreFunc, 'hideTrowser');
            spyOn(mockStoreFunc, 'editRecordCancel');
            spyOn(mockStoreFunc, 'setFieldsPropertiesPendingEditToFalse');
            spyOn(mockStoreFunc, 'setFormBuilderPendingEditToFalse');
            spyOn(mockStoreFunc, 'setReportBuilderPendingEditToFalse');
            spyOn(AppHistory, 'getStores').and.returnValue(mockState);
        });
        afterEach(() => {
            AppHistory.getStores.calls.reset();
            AppHistory._continueToDestination.calls.reset();
            AppHistory._discardChangesForRecord.calls.reset();
            AppHistory._discardChangesForFormBuilder.calls.reset();
            AppHistory._discardChangesForReportBuilder.calls.reset();
            AppHistory._haltRouteChange.calls.reset();
            AppHistory.showPendingEditsConfirmationModal.calls.reset();
            mockStore.dispatch.calls.reset();
            mockStoreReject.dispatch.calls.reset();
            currentModalDetails = null;
        });

        it('displays a modal for record when pendingEdit is true which allows a user to choose what they want to do with unsaved changes', () => {
            spyOn(AppHistory, 'getIsPendingEdit').and.returnValue(true);
            AppHistory.setup(mockStore);
            goToNewPage();

            expect(AppHistory.showPendingEditsConfirmationModal).toHaveBeenCalled();
        });

        it('_saveChanges will save new record pending edits before navigating', () => {
            mockState.recordStore.isPendingEdit = true;
            store.record.records[0].pendEdits.currentEditingRecordId = UNSAVED_RECORD_ID;
            AppHistory.setup(mockStore);

            goToNewPage();
            AppHistory._saveChanges();

            expect(AppHistory._saveChangesForRecord).toHaveBeenCalled();
        });

        it('_saveChanges will save existing record pending edits before navigating', () => {
            mockState.recordStore.isPendingEdit = true;
            store.record.records[0].pendEdits.currentEditingRecordId = 1;
            AppHistory.setup(mockStore);

            goToNewPage();
            AppHistory._saveChanges();

            expect(AppHistory._saveChangesForRecord).toHaveBeenCalled();
        });

        it('_saveChanges will save form builder if there is a pending edit in the forms store', () => {
            mockState.formsStore.isPendingEdit = true;

            goToNewPage();
            AppHistory._saveChanges();

            expect(AppHistory._saveChangesForFormBuilder).toHaveBeenCalled();
        });

        it('_saveChanges will save form builder if there is a pending edit in the fields store', () => {
            mockState.fieldsStore.isPendingEdit = true;

            goToNewPage();
            AppHistory._saveChanges();

            expect(AppHistory._saveChangesForFormBuilder).toHaveBeenCalled();
        });

        it('_saveChanges will save report builder if there is a pending edit in the reportBuilder store', () => {
            mockState.fieldsStore.isPendingEdit = false;
            mockState.formsStore.isPendingEdit = false;
            mockState.recordStore.isPendingEdit = false;
            mockState.reportBuilderStore.isPendingEdit = true;

            goToNewPage();
            AppHistory._saveChanges();

            expect(AppHistory._saveChangesForReportBuilder).toHaveBeenCalled();
        });

        it('_saveChangesForReportBuilder will save invoke saveReport', (done) => {
            mockState.reportBuilderStore.isPendingEdit = true;
            AppHistory.setup(mockStore, mockStoreFunc);

            AppHistory._saveChangesForReportBuilder();

            expect(mockStoreFunc.saveReport).toHaveBeenCalled();
            expect(mockStore.dispatch).toHaveBeenCalled();
            expect(AppHistory._continueToDestination).toHaveBeenCalled();
            done();
        });

        it('will save invoke updateForm if there is a formStore', (done) => {
            mockState.formsStore.formData = {
                formMeta: {
                    appId: 'appId',
                    tableId: 'tableId'
                },
                formType: 'type'
            };
            AppHistory.setup(mockStore, mockStoreFunc);

            AppHistory._saveChangesForFormBuilder();

            expect(mockStoreFunc.updateForm).toHaveBeenCalled();
            expect(mockStore.dispatch).toHaveBeenCalled();
            expect(AppHistory._continueToDestination).toHaveBeenCalled();
            done();
        });

        it('will save invoke createRecord if currentEditingRecordId === null', (done) => {
            mockState.recordStore = {
                currentEditingAppId: 'appId',
                currentEditingTableId: 'tableId',
                currentEditingRecordId: null

            };
            AppHistory.setup(mockStore, mockStoreFunc);

            AppHistory._saveChangesForRecord();

            expect(mockStore.dispatch).toHaveBeenCalled();
            expect(AppHistory._continueToDestination).toHaveBeenCalled();
            expect(mockStoreFunc.createRecord).toHaveBeenCalled();
            expect(mockStoreFunc.saveFormComplete).toHaveBeenCalled();
            expect(mockStoreFunc.hideTrowser).toHaveBeenCalled();
            done();
        });

        it('will save invoke updateRecord if currentEditingRecordId !== null', (done) => {
            mockState.recordStore = {
                currentEditingAppId: 'appId',
                currentEditingTableId: 'tableId',
                currentEditingRecordId: 'recId'

            };
            AppHistory.setup(mockStore, mockStoreFunc);

            AppHistory._saveChangesForRecord();

            expect(mockStore.dispatch).toHaveBeenCalled();
            expect(AppHistory._continueToDestination).toHaveBeenCalled();
            expect(mockStoreFunc.updateRecord).toHaveBeenCalled();
            expect(mockStoreFunc.saveFormComplete).toHaveBeenCalled();
            expect(mockStoreFunc.hideTrowser).toHaveBeenCalled();
            done();
        });

        it('halt route change when save new record pending edits error', () => {
            mockState.recordStore = {
                currentEditingAppId: 'appId',
                currentEditingTableId: 'tableId',
                currentEditingRecordId: 'recId'

            };
            AppHistory.setup(mockStoreReject, mockStoreFunc);

            goToNewPage();
            AppHistory._saveChangesForRecord();

            expect(AppHistory._haltRouteChange).toHaveBeenCalled();
            expect(mockStoreReject.dispatch).toHaveBeenCalled();
        });

        it('halt route change when editing existing record pending edits error', () => {
            mockState.recordStore = {
                currentEditingAppId: 'appId',
                currentEditingTableId: 'tableId',
                currentEditingRecordId: null

            };
            AppHistory.setup(mockStoreReject, mockStoreFunc);

            goToNewPage();
            AppHistory._saveChangesForRecord();

            expect(AppHistory._haltRouteChange).toHaveBeenCalled();
            expect(mockStoreReject.dispatch).toHaveBeenCalled();
        });

        it('_discardChanges will invoke _discardChangesForRecord if recordStore isPendingEdit is true', () => {
            mockState.recordStore.isPendingEdit = true;

            AppHistory.setup(mockStore, mockStoreFunc);
            AppHistory._discardChanges();

            expect(AppHistory._discardChangesForRecord).toHaveBeenCalled();
            expect(mockStore.dispatch).toHaveBeenCalled();
            expect(mockStoreFunc.editRecordCancel).toHaveBeenCalled();
            expect(mockStoreFunc.hideTrowser).toHaveBeenCalled();
        });

        it('_discardChanges will not invoke _discardChangesForRecord if recordStore isPendingEdit is false', () => {
            mockState.fieldsStore.isPendingEdit = false;
            mockState.reportBuilderStore.isPendingEdit = false;
            mockState.formsStore.isPendingEdit = false;
            mockState.recordStore.isPendingEdit = false;

            AppHistory.setup(mockStore, mockStoreFunc);
            AppHistory._discardChanges();

            expect(AppHistory._discardChangesForRecord).not.toHaveBeenCalled();
            expect(mockStore.dispatch).not.toHaveBeenCalled();
            expect(mockStoreFunc.editRecordCancel).not.toHaveBeenCalled();
            expect(mockStoreFunc.hideTrowser).not.toHaveBeenCalled();
        });

        it('_discardChanges will invoke _discardChangesForFormBuilder if formsStore isPendingEdit is true', () => {
            mockState.formsStore.isPendingEdit = true;
            mockState.fieldsStore.isPendingEdit = false;

            AppHistory.setup(mockStore, mockStoreFunc);
            AppHistory._discardChanges();

            expect(AppHistory._discardChangesForFormBuilder).toHaveBeenCalled();
            expect(mockStoreFunc.setFormBuilderPendingEditToFalse).toHaveBeenCalled();
            expect(mockStoreFunc.setFieldsPropertiesPendingEditToFalse).not.toHaveBeenCalled();
        });

        it('_discardChanges will invoke _discardChangesForFormBuilder if fieldsStore isPendingEdit is true', () => {
            mockState.formsStore.isPendingEdit = false;
            mockState.fieldsStore.isPendingEdit = true;

            AppHistory.setup(mockStore, mockStoreFunc);
            AppHistory._discardChanges();

            expect(AppHistory._discardChangesForFormBuilder).toHaveBeenCalled();
            expect(mockStoreFunc.setFieldsPropertiesPendingEditToFalse).toHaveBeenCalled();
            expect(mockStoreFunc.setFormBuilderPendingEditToFalse).not.toHaveBeenCalled();
        });

        it('_discardChanges will not invoke if _discardChangesForFormBuilder isPendingEdit is false for formsStore and fieldsStore', () => {
            mockState.formsStore.isPendingEdit = false;
            mockState.fieldsStore.isPendingEdit = false;

            AppHistory.setup(mockStore, mockStoreFunc);
            AppHistory._discardChanges();

            expect(AppHistory._discardChangesForFormBuilder).not.toHaveBeenCalled();
            expect(mockStoreFunc.setFieldsPropertiesPendingEditToFalse).not.toHaveBeenCalled();
            expect(mockStoreFunc.setFormBuilderPendingEditToFalse).not.toHaveBeenCalled();
        });

        it('_discardChanges will invoke _discardChangesForReportBuilder if reportBuilderStore isPendingEdit is true', () => {
            mockState.reportBuilderStore.isPendingEdit = true;

            AppHistory.setup(mockStore, mockStoreFunc);
            AppHistory._discardChanges();

            expect(AppHistory._discardChangesForReportBuilder).toHaveBeenCalled();
            expect(mockStoreFunc.setReportBuilderPendingEditToFalse).toHaveBeenCalled();
        });

        it('_discardChanges will not invoke _discardChangesForReportBuilder if reportBuilderStore isPendingEdit is false', () => {
            mockState.reportBuilderStore.isPendingEdit = false;
            AppHistory.setup(mockStore, mockStoreFunc);
            AppHistory._discardChanges();

            expect(AppHistory._discardChangesForReportBuilder).not.toHaveBeenCalled();
            expect(mockStoreFunc.setReportBuilderPendingEditToFalse).not.toHaveBeenCalled();
        });
    });
});

describe('qbAppModalFunctions', () => {
    let mockModal = {
        dispatchEvent(event) {}
    };

    describe('ShowAppModal', () => {
        it('allows AppHistory to show a React-based modal using javascript custom events', () => {
            spyOn(document, 'querySelector').and.returnValue(mockModal);
            spyOn(mockModal, 'dispatchEvent');

            ShowAppModal({});

            expect(mockModal.dispatchEvent).toHaveBeenCalled();
        });
    });

    describe('HideAppModal', () => {
        it('allows AppHistory to hide a React-based modal using javascript custom events', () => {
            spyOn(document, 'querySelector').and.returnValue(mockModal);
            spyOn(mockModal, 'dispatchEvent');

            HideAppModal({});

            expect(mockModal.dispatchEvent).toHaveBeenCalled();
        });
    });
});
