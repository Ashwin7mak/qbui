import AppHistory from '../../src/globals/appHistory';
import {UNSAVED_RECORD_ID} from '../../src/constants/schema';
import Promise from 'bluebird';
import {ShowAppModal, HideAppModal, SHOW_APP_MODAL_EVENT, HIDE_APP_MODAL_EVENT} from '../../src/components/qbModal/appQbModalFunctions';

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
        AppHistory.__Rewire__('ShowAppModal', mockActions.ShowAppModal);
        AppHistory.__Rewire__('HideAppModal', mockActions.HideAppModal);
    });

    afterEach(() => {
        AppHistory.__ResetDependency__('ShowAppModal');
        AppHistory.__ResetDependency__('HideAppModal');
    });

    afterAll(() => {
        AppHistory.reset();
    });

    function goToNewPage() {
        AppHistory.history.push({
            pathname: '/home',
        });
    }

    function buildMockFlux(options = {isPendingEdit: false, currentEditingRecordId: UNSAVED_RECORD_ID, hasErrorOnSave: false, done: null}) {
        return {
            actions: {
                recordPendingEditsCommit() {},
                saveNewRecord(_appId, _tableId, _recordChanges, _fields) {
                    return new Promise((resolve, reject) => {
                        if (options.hasErrorOnSave) {
                            reject();
                        } else {
                            resolve();
                        }

                        if (options.done) {done();}
                    });
                },
                saveRecord(_appId, _tableId, _recordChanges, _fields) {
                    return new Promise((resolve, reject) => {
                        if (options.hasErrorOnSave) {
                            reject();
                        } else {
                            resolve();
                        }

                        if (options.done) {options.done();}
                    });
                },
                recordPendingEditsCancel(_appId, _tableId, _recordId) {
                    if (options.done) {done();}
                }
            },
            store(storeName) {
                return {
                    getState() {
                        if (storeName === 'RecordPendingEditsStore') {
                            return {
                                isPendingEdit: options.isPendingEdit,
                                currentEditingRecordId: options.currentEditingRecordId
                            };
                        } else {
                            return {
                                fields: {data: {}}
                            };
                        }
                    }
                };
            }
        };
    }

    let mockFlux = buildMockFlux();
    let mockFluxWithNewRecord = buildMockFlux({isPendingEdit: true, currentEditingRecordId: UNSAVED_RECORD_ID});

    describe('new', () => {
        it('creates a new instance of AppHistory and builds a history object', () => {
            let appHistory = AppHistory;

            expect(appHistory.history).not.toBeNull();
            expect(appHistory.flux).toBeNull();
        });

        it('is a singleton class, so is only instantiated one time', () => {
            let appHistory1 = AppHistory;
            let appHistory2 = AppHistory;

            appHistory1.appId = 1;

            expect(appHistory2.appId).toEqual(1);
        });
    });

    describe('setup', () => {
        it('sets an instance of fluxxor', () => {
            let appHistory = AppHistory;

            appHistory.setup(mockFlux);

            expect(appHistory.flux).toEqual(mockFlux);
        });

        it('sets a listener for internal app route changes', () => {
            spyOn(AppHistory.history, 'listenBefore');

            AppHistory.setup();

            expect(AppHistory.history.listenBefore).toHaveBeenCalled();
        });

        it('sets a listener for browser chrome route changes (e.g., pasting a link in the URL bar)', () => {
            spyOn(AppHistory.history, 'listenBeforeUnload');

            AppHistory.setup();

            expect(AppHistory.history.listenBeforeUnload).toHaveBeenCalled();
        });
    });

    describe('showPendingEditsConfirmationModal', () => {
        it('shows a default confirmation modal for allowing the user to decide what to do if they have unsaved changed', () => {
            let mockShowAppModal = jasmine.createSpy('ShowAppModal');
            AppHistory.__Rewire__('ShowAppModal', mockShowAppModal);


            AppHistory.showPendingEditsConfirmationModal();

            expect(mockShowAppModal).toHaveBeenCalled();
        });

        it('accepts alternate functions that will be called when various buttons on the modal are clicked', () => {
            let mockShowAppModal = jasmine.createSpy('ShowAppModal');
            AppHistory.__Rewire__('ShowAppModal', mockShowAppModal);

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
        afterEach(() => {
            // Reset the currentModalDetails after each test
            currentModalDetails = null;
        });

        it('routes the user to their specified destination if there are no pending edits', () => {
            AppHistory.setup(mockFlux);

            spyOn(AppHistory, '_continueToDestination');

            goToNewPage();

            expect(AppHistory._continueToDestination).toHaveBeenCalled();
        });

        it('displays a modal which allows a user to choose what they want to do with unsaved changes', () => {
            AppHistory.setup(mockFluxWithNewRecord);

            spyOn(AppHistory, 'showPendingEditsConfirmationModal');

            goToNewPage();

            expect(AppHistory.showPendingEditsConfirmationModal).toHaveBeenCalled();
        });

        it('saves any pending edits before navigating away (existing record)', done => {
            let mockFluxWithPendingEdit = buildMockFlux({isPendingEdit: true, currentEditingAppId: 1, currentEditingRecordId: 1, done: done});
            AppHistory.setup(mockFluxWithPendingEdit);

            spyOn(mockFluxWithPendingEdit.actions, 'saveRecord').and.callThrough();
            spyOn(AppHistory, '_continueToDestination').and.callThrough();

            goToNewPage();
            mockActions.clickSaveButton();

            expect(mockFluxWithPendingEdit.actions.saveRecord).toHaveBeenCalled();
            expect(AppHistory._continueToDestination).toHaveBeenCalled();
        });

        it('halts a route change if there was a problem saving the changes', done => {
            let mockWithError = buildMockFlux({isPendingEdit: true, currentEditingRecordId: 1, hasErrorOnSave: true, done: done});

            AppHistory.setup(mockWithError);

            spyOn(AppHistory, '_onRecordSavedError').and.callThrough();
            spyOn(AppHistory, '_haltRouteChange').and.callThrough();

            goToNewPage();
            mockActions.clickSaveButton();

            expect(AppHistory._onRecordSavedError).toHaveBeenCalled();
            expect(AppHistory._haltRouteChange).toHaveBeenCalled();
        });

        it('cancels changes an continues to destination if user chooses to discard changes', () => {
            let mockFluxWithPendingEdit = buildMockFlux({isPendingEdit: true, currentEditingAppId: 1, currentEditingRecordId: 1});
            AppHistory.setup(mockFluxWithPendingEdit);

            spyOn(mockFluxWithPendingEdit.actions, 'recordPendingEditsCancel').and.callThrough();
            spyOn(AppHistory, '_discardChanges').and.callThrough();
            spyOn(AppHistory, '_continueToDestination').and.callThrough();

            goToNewPage();
            mockActions.clickDiscardChanges();

            expect(mockFluxWithPendingEdit.actions.recordPendingEditsCancel).toHaveBeenCalled();
            expect(AppHistory._discardChanges).toHaveBeenCalled();
            expect(AppHistory._continueToDestination).toHaveBeenCalled();
        });

        it('halts route change if uses chooses to stay on the pay', () => {
            let mockFluxWithPendingEdit = buildMockFlux({isPendingEdit: true, currentEditingAppId: 1, currentEditingRecordId: 1});
            AppHistory.setup(mockFluxWithPendingEdit);

            spyOn(AppHistory, '_haltRouteChange').and.callThrough();

            goToNewPage();
            mockActions.clickStayButton();

            expect(AppHistory._haltRouteChange).toHaveBeenCalled();
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
