import AppHistory from '../../src/globals/appHistory';
import {UNSAVED_RECORD_ID} from '../../src/constants/schema';
import Promise from 'bluebird';

let mockFunctions = {
    ShowAppModal(modalDetails) {
        return modalDetails;
    },
    HideAppModal(_modalDetails) {return true;}
};

fdescribe('AppHistory', () => {

    beforeAll(() => {
        AppHistory.__Rewire__('ShowAppModal', mockFunctions.ShowAppModal);
        AppHistory.__Rewire__('HideAppModal', mockFunctions.HideAppModal);
    });

    afterAll(() => {
        AppHistory.__ResetDependency__('ShowAppModal');
        AppHistory.__ResetDependency__('HideAppModal');
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

    afterEach(() => {
        // Reset the singleton before each test
        AppHistory.reset();
    });

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

    it('routes the user to their specified destination if there are no pending edits', () => {
        AppHistory.setup(mockFlux);

        spyOn(AppHistory, '_continueToDestination');

        goToNewPage();

        expect(AppHistory._continueToDestination).toHaveBeenCalled();
    });

    it('displays a modal which allows a user to choose what they want to do with unsaved changes', () => {
        AppHistory.setup(mockFluxWithNewRecord);

        spyOn(AppHistory, '_showModal');

        goToNewPage();

        expect(AppHistory._showModal).toHaveBeenCalled();
    });

    // it('saves any pending edits before navigating away (existing record)', done => {
    //     let mockFluxWithPendingEdit = buildMockFlux({isPendingEdit: true, currentEditingAppId: 1, currentEditingRecordId: 1, done: done});
    //     let appHistory = AppHistory.setup(mockFluxWithPendingEdit);
    //
    //     spyOn(mockFluxWithPendingEdit.actions, 'saveRecord').and.callThrough();
    //     spyOn(AppHistory, '_continueToDestination').and.callThrough();
    //
    //     goToNewPage();
    //
    //     expect(mockFluxWithPendingEdit.actions.saveRecord).toHaveBeenCalled();
    //     expect(AppHistory._continueToDestination).toHaveBeenCalled();
    // });

    // it('halts a route change if there was a problem saving the changes', done => {
    //     let mockWithError = buildMockFlux({isPendingEdit: true, currentEditingRecordId: 1, hasErrorOnSave: true, done: done});
    //
    //     AppHistory.setup(mockWithError);
    //
    //     spyOn(AppHistory, '_onRecordSavedError').and.callThrough();
    //     spyOn(AppHistory, '_haltRouteChange').and.callThrough();
    //
    //
    //     goToNewPage();
    //
    //     expect(AppHistory._onRecordSavedError).toHaveBeenCalled();
    //     expect(AppHistory._haltRouteChange).toHaveBeenCalled();
    // });
});

