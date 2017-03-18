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
        dispatch: (func) => {}
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

    describe('user selects an action when leaving a dirty form', () => {
        beforeEach(() => {
            spyOn(AppHistory, '_continueToDestination');
            spyOn(AppHistory, 'showPendingEditsConfirmationModal');
            spyOn(mockStore, 'dispatch').and.callThrough();
        });
        afterEach(() => {
            AppHistory._continueToDestination.calls.reset();
            AppHistory.showPendingEditsConfirmationModal.calls.reset();
            mockStore.dispatch.calls.reset();
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

        //it('saves any pending edits before navigating away (edit from form)', () => {
        //    store.record[0].pendEdits.isPendingEdit = true;
        //    store.record[0].pendEdits.currentEditingRecordId = 1;
        //    AppHistory.setup(mockStore, mockStoreFunc);
        //
        //    goToNewPage();
        //    mockActions.clickSaveButton();
        //
        //    expect(AppHistory._continueToDestination).toHaveBeenCalled();
        //    expect(mockStore.dispatch).toHaveBeenCalled();
        //});
        //
        //it('saves any pending edits before navigating away (existing record)', () => {
        //    let mockFluxWithPendingEdit = buildMockFlux({isPendingEdit: true, currentEditingRecordId: 1, isInlineEditOpen: true});
        //    AppHistory.setup(mockFluxWithPendingEdit);
        //
        //    spyOn(mockFluxWithPendingEdit.actions, 'saveRecord').and.callThrough();
        //    spyOn(AppHistory, '_continueToDestination').and.callThrough();
        //
        //    goToNewPage();
        //    mockActions.clickSaveButton();
        //    expect(mockFluxWithPendingEdit.actions.saveRecord).toHaveBeenCalledWith(undefined, undefined, 1, {isPendingEdit: true, currentEditingRecordId: 1, isInlineEditOpen: true}, "reportFields");
        //    expect(AppHistory._continueToDestination).toHaveBeenCalled();
        //});
        //
        //it('halts a route change if there was a problem saving the changes', () => {
        //    let mockWithError = buildMockFlux({isPendingEdit: true, currentEditingRecordId: 1, hasErrorOnSave: true});
        //
        //    AppHistory.setup(mockWithError);
        //
        //    spyOn(AppHistory, '_onRecordSavedError').and.callThrough();
        //    spyOn(AppHistory, '_haltRouteChange').and.callThrough();
        //
        //    goToNewPage();
        //    mockActions.clickSaveButton();
        //
        //    expect(AppHistory._onRecordSavedError).toHaveBeenCalled();
        //    expect(AppHistory._haltRouteChange).toHaveBeenCalled();
        //});
        //
        //it('cancels changes an continues to destination if user chooses to discard changes', () => {
        //    let mockFluxWithPendingEdit = buildMockFlux({isPendingEdit: true, currentEditingRecordId: 1});
        //    AppHistory.setup(mockFluxWithPendingEdit);
        //
        //    spyOn(mockFluxWithPendingEdit.actions, 'recordPendingEditsCancel').and.callThrough();
        //    spyOn(AppHistory, '_discardChanges').and.callThrough();
        //    spyOn(AppHistory, '_continueToDestination').and.callThrough();
        //
        //    goToNewPage();
        //    mockActions.clickDiscardChanges();
        //
        //    expect(mockFluxWithPendingEdit.actions.recordPendingEditsCancel).toHaveBeenCalled();
        //    expect(AppHistory._discardChanges).toHaveBeenCalled();
        //    expect(AppHistory._continueToDestination).toHaveBeenCalled();
        //});
        //
        //it('halts route change if uses chooses to stay on the page', () => {
        //    let mockFluxWithPendingEdit = buildMockFlux({isPendingEdit: true, currentEditingRecordId: 1});
        //    AppHistory.setup(mockFluxWithPendingEdit);
        //
        //    spyOn(AppHistory, '_haltRouteChange').and.callThrough();
        //
        //    goToNewPage();
        //    mockActions.clickStayButton();
        //
        //    expect(AppHistory._haltRouteChange).toHaveBeenCalled();
        //});
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
