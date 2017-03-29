import {useRouterHistory} from "react-router";
import createHistory from 'history/lib/createBrowserHistory';
import {useBeforeUnload} from 'history';
import {UNSAVED_RECORD_ID} from '../constants/schema';
import {ShowAppModal, HideAppModal} from '../components/qbModal/appQbModalFunctions';
import _ from 'lodash';

// Uses singleton pattern
// Only one instance of this class may be instantiated so that the same history can be used
// throughout the app
// Better than a global variable because a singleton can be scoped and only used when imported
let self = null; // eslint-disable-line

/**
 * This singleton class maintains the current customized browserHistory that includes event listeners
 * for when a route changes. This helps us detect if there are pending edits to a form before redirecting.
 */
class AppHistory {
    constructor() {
        if (!self) {
            // A custom browser history object that can be used by React Router
            this.history = useRouterHistory(useBeforeUnload(createHistory))();

            // get redux stores and call actions
            this.store = null;
            this.editRecordCancel = null;
            this.createRecord = null;
            this.updateRecord = null;

            // Keep track of the event listeners so they can be canceled
            this.cancelListenBefore = null;
            this.cancelListenBeforeUnload = null;

            self = this;
        }

        return self;
    }

    /**
     * Setups the singleton for use with Redux store outside of React.
     * @param redux store
     */
    setup(store, storeFunc) {
        //  redux store
        self.store = store;
        if (storeFunc) {
            self.editRecordCancel = storeFunc.editRecordCancel;
            self.createRecord = storeFunc.createRecord;
            self.updateRecord = storeFunc.updateRecord;
        }

        self._setupHistoryListeners();

        return self;
    }

    /**
     * Clears the AppHistory singleton and event listeners
     */
    reset() {
        if (self && self.cancelListenBefore) {self.cancelListenBefore();}
        if (self && self.cancelListenBeforeUnload) {self.cancelListenBeforeUnload();}
        self = null; // eslint-disable-line
    }

    /**
     * Add the global listeners to route changes
     * @private
     */
    _setupHistoryListeners() {
        // Setup listener for route changes within the app
        self.cancelListenBefore = self.history.listenBefore((location, callback) => {
            if (self) {
                self.callback = callback;
                if (self.getIsPendingEdit()) {
                    self.showPendingEditsConfirmationModal();
                } else {
                    // cancel any pending pending edits that don't require confirmation, i.e. started inline editing
                    self._discardChanges(false);
                }
            } else {
                return callback();
            }
        });

        // Setup listener for route changes outside of the app (e.g., pasting in a new url)
        self.cancelListenBeforeUnload = self.history.listenBeforeUnload(event => {
            if (self && self.getIsPendingEdit()) {
                // No need to internationalize as it will not appear in the modal on evergreen browsers.
                if (event) {
                    event.returnValue = 'Save changes before leaving?';
                }
                return 'Save changes before leaving?';
            }
        });
    }

    getIsPendingEdit() {
        const pendEdits = self.getPendingEditsFromStore();
        return pendEdits.isPendingEdit === true;
    }

    getPendingEditsFromStore() {
        let pendEdits = {};
        if (self.store) {
            const state = self.store.getState();
            //  fetch the 1st record in the store
            //  TODO: revisit to ensure appropriate support for store with multiple records
            if (Array.isArray(state.record) && state.record.length > 0) {
                const recordStore = state.record[0];
                if (_.isEmpty(recordStore) === false) {
                    pendEdits = recordStore.pendEdits || {};
                }
            }
        }
        return pendEdits;
    }

    getFieldsFromFormStore() {
        let fields = [];
        if (self.store) {
            const state = self.store.getState();
            if (Array.isArray(state.forms) && state.forms.length > 0) {
                //  fetch the 1st form in the store
                //  TODO: revisit to ensure appropriate support for store with multiple forms
                if (_.isEmpty(state.forms[0]) === false) {
                    const formsStore = state.forms[0];
                    if (_.has(formsStore, 'formData.fields')) {
                        fields = formsStore.formData.fields;
                    }
                }
            }
        }
        return fields;
    }

    getFieldsFromReportStore() {
        let fields = [];
        if (self.store) {
            const state = self.store.getState();
            if (Array.isArray(state.report) && state.report.length > 0) {
                //  fetch the 1st report in the store
                //  TODO: revisit to ensure appropriate support for store with multiple reports
                if (_.isEmpty(state.report[0]) === false) {
                    const reportStore = state.report[0];
                    if (_.has(reportStore, 'data.fields')) {
                        fields = reportStore.data.fields;
                    }
                }
            }
        }
        return fields;
    }

    /**
     * Displays a modal that asks a user about unsaved changes
     * @param onSave Function that handles if the user wants to save changes and then continue
     * @param onDisard Function that handles if the user wants to discard changes and then continue
     * @param onCancel Function that handles if the user wants to cancel navigation
     */
    showPendingEditsConfirmationModal(onSave, onDiscard, onCancel) {
        ShowAppModal({
            type: 'alert',
            messageI18nKey: 'pendingEditModal.modalBodyMessage',
            primaryButtonI18nKey: 'pendingEditModal.modalSaveButton',
            primaryButtonOnClick: (onSave ? onSave : self._saveChanges),
            middleButtonI18nKey: 'pendingEditModal.modalDoNotSaveButton',
            middleButtonOnClick: (onDiscard ? onDiscard : self._discardChanges),
            leftButtonI18nKey: 'pendingEditModal.modalStayButton',
            leftButtonOnClick: (onCancel ? onCancel : self._haltRouteChange)
        });
    }

    _hideModal() {
        HideAppModal();
    }

    /*
     * Helper method to get fields from the right store.
     * For inline edit on reports get fields from ReportStore
     * Otherwise, get fields from FormStore.
     */
    getFields() {
        let fields = null;
        const pendEdits = self.getPendingEditsFromStore();
        if (pendEdits.isInlineEditOpen) {
            fields = self.getFieldsFromReportStore();
        } else {
            fields = self.getFieldsFromFormStore();
        }
        return fields;
    }

    /*
    * All functions below reference 'self' instead of 'this' because of a context change
    * after being called from the modal
    */
    _saveChanges() {
        self._hideModal();

        if (self.store && _.isFunction(self.createRecord) && _.isFunction(self.updateRecord)) {
            const pendEdits = self.getPendingEditsFromStore();
            const appId = pendEdits.currentEditingAppId;
            const tableId = pendEdits.currentEditingTableId;
            const recordId = pendEdits.currentEditingRecordId;

            let fields = self.getFields();

            if (pendEdits.currentEditingRecordId === UNSAVED_RECORD_ID) {
                let params = {
                    context: null,
                    recordChanges: pendEdits.recordChanges,
                    fields: fields,
                    colList: [],
                    showNotificationOnSuccess: false,
                    addNewRow: false
                };
                self.store.dispatch(self.createRecord(appId, tableId, params)).then(
                    () => {
                        self._continueToDestination();
                    },
                    () => {
                        self._haltRouteChange();
                    }
                );
            } else {
                let params = {
                    context: null,              // no report context to worry about...
                    pendEdits: pendEdits,
                    fields: fields,
                    colList: null,
                    showNotificationOnSuccess: false,
                    addNewRow: false
                };
                self.store.dispatch(self.updateRecord(appId, tableId, recordId, params)).then(
                    () => {
                        self._continueToDestination();
                    },
                    () => {
                        self._haltRouteChange();
                    }
                );
            }
        }
    }

    _discardChanges(hideModal = true) {

        if (hideModal) {
            self._hideModal();
        }

        if (self.store && _.isFunction(self.editRecordCancel)) {
            //  clean up pending edits in store
            const pendEdits = self.getPendingEditsFromStore();
            if (_.isEmpty(pendEdits) === false) {
                self.store.dispatch(self.editRecordCancel(pendEdits.currentEditingAppId, pendEdits.currentEditingTableId, pendEdits.currentEditingRecordId));
            }
        }
        self._continueToDestination();
    }

    _continueToDestination() {
        self.callback();
    }

    _haltRouteChange() {
        self._hideModal();
        self.callback(false);
    }
}

export default (new AppHistory());
