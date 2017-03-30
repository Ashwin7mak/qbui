import AppHistory, {__RewireAPI__ as AppHistoryRewireAPI} from '../../src/globals/appHistory';
import {UNSAVED_RECORD_ID} from '../../src/constants/schema';
import Promise from 'bluebird';
import {ShowAppModal, HideAppModal, SHOW_APP_MODAL_EVENT, HIDE_APP_MODAL_EVENT} from '../../src/components/qbModal/appQbModalFunctions';
import _ from 'lodash';

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
        record: [{
            pendEdits: {
                isPendingEdit: false,
                isInlineEditOpen: false,
                currentEditingAppId: '1',
                currentEditingTableId: '2',
                currentEditingRecordId: '3'
            }
        }],
        forms: [{
            formData: {
                fields: {}
            }
        }],
        report: [{
            data: {
                fields: {}
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
        updateRecord: () => {}
    };

    describe('Test new appHistory instances', () => {
        it('create a new instance of AppHistory and build a history object', () => {
            let appHistory = AppHistory;
            expect(appHistory.history).not.toBeNull();
            expect(appHistory.store).toBeNull();
            expect(appHistory.editRecordCancel).toBeNull();
            expect(appHistory.createRecord).toBeNull();
            expect(appHistory.updateRecord).toBeNull();
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
        });

        it('sets a listener for internal app route changes', () => {
            spyOn(AppHistory.history, 'listenBefore');
            AppHistory.setup(mockStore, mockStoreFunc);
            expect(AppHistory.history.listenBefore).toHaveBeenCalled();
        });

        it('sets a listener for browser chrome route changes (e.g., pasting a link in the URL bar)', () => {
            spyOn(AppHistory.history, 'listenBeforeUnload');
            AppHistory.setup(mockStore, mockStoreFunc);
            expect(AppHistory.history.listenBeforeUnload).toHaveBeenCalled();
        });
    });

    describe('Test getFields function', () => {
        beforeEach(() => {
            spyOn(AppHistory, 'getFieldsFromReportStore');
            spyOn(AppHistory, 'getFieldsFromFormStore');
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
                store.record[0].pendEdits.isInlineEditOpen = testCase.isInlineEditOpen;
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

    describe('verify record save functions', () => {
        beforeEach(() => {
            spyOn(AppHistory, '_continueToDestination');
            spyOn(AppHistory, '_haltRouteChange');
            spyOn(AppHistory, 'showPendingEditsConfirmationModal');
            spyOn(mockStore, 'dispatch').and.callThrough();
            spyOn(mockStoreReject, 'dispatch').and.callThrough();
        });
        afterEach(() => {
            AppHistory._continueToDestination.calls.reset();
            AppHistory._haltRouteChange.calls.reset();
            AppHistory.showPendingEditsConfirmationModal.calls.reset();
            mockStore.dispatch.calls.reset();
            mockStoreReject.dispatch.calls.reset();
            currentModalDetails = null;
        });

        it('routes the user to their specified destination if there are no pending edits', () => {
            AppHistory.setup(mockStore, mockStoreFunc);
            goToNewPage();

            expect(AppHistory._continueToDestination).toHaveBeenCalled();
            expect(mockStore.dispatch).toHaveBeenCalled();
        });

        it('displays a modal which allows a user to choose what they want to do with unsaved changes', () => {
            store.record[0].pendEdits.isPendingEdit = true;
            AppHistory.setup(mockStore, mockStoreFunc);
            goToNewPage();

            expect(AppHistory.showPendingEditsConfirmationModal).toHaveBeenCalled();
        });

        let callBackTestCases = [
            {name:'no save option if redux store is not initialized', store:null, createRecordFunc: null, updateRecordFunc: null},
            {name:'no save option if redux createRecord function is not initialized', store:mockStore, createRecordFunc: mockStoreFunc.createRecord, updateRecordFunc: null},
            {name:'no save option if redux updateRecord function is not initialized', store:mockStore, createRecordFunc: null, updateRecordFunc: mockStoreFunc.updateRecord}
        ];
        callBackTestCases.forEach(testCase => {
            it(testCase.name, () => {
                expect(mockStore.dispatch).not.toHaveBeenCalled();
            });
        });

        let testCases = [
            {'name':'save new record pending edits before navigating', successFlow: true, recId: UNSAVED_RECORD_ID},
            {'name':'save existing record pending edits before navigating', successFlow: true, recId: 1},
            {'name':'halt route change when save new record pending edits error', successFlow: false, recId: UNSAVED_RECORD_ID},
            {'name':'halt route change when existing record pending edits error', successFlow: false, recId: 1}
        ];
        testCases.forEach(testCase => {
            it(testCase.name, (done) => {
                store.record[0].pendEdits.isPendingEdit = true;
                store.record[0].pendEdits.currentEditingRecordId = testCase.recId;
                AppHistory.setup(testCase.successFlow ? mockStore : mockStoreReject, mockStoreFunc);

                goToNewPage();
                AppHistory._saveChanges();

                if (testCase.successFlow) {
                    expect(mockStore.dispatch).toHaveBeenCalled();
                    expect(AppHistory._continueToDestination).toHaveBeenCalled();
                } else {
                    expect(mockStoreReject.dispatch).toHaveBeenCalled();
                    expect(AppHistory._haltRouteChange).toHaveBeenCalled();
                }
                done();
            });
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
