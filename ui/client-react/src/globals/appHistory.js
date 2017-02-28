import {useRouterHistory} from "react-router";
import createHistory from 'history/lib/createBrowserHistory';
import {useBeforeUnload} from 'history';
import {UNSAVED_RECORD_ID} from '../constants/schema';
import {ShowAppModal, HideAppModal} from '../components/qbModal/appQbModalFunctions';
//import {editRecordCancel, editRecordCommit} from '../actions/recordActions';
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
            this.flux = null;

            // Properties needed to save records with pending edits
            //this.appId = null;
            //this.tableId = null;
            //this.recordId = null;
            //this.pendEdits = {};
            //this.fields = null;

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
    setup(flux, store, editRecordCancel, editRecordCommit, saveRecord) {
        //  TODO remove once all stores are migrated
        self.flux = flux;

        //  redux store
        self.store = store;
        self.editRecordCancel = editRecordCancel;
        self.editRecordCommit = editRecordCommit;
        self.saveRecord = saveRecord;

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
            if (self.getIsPendingEdit()) {
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
            //  TODO: just getting to work....improve this to support multi records...
            if (Array.isArray(state.record) && state.record.length > 0) {
                if (_.isEmpty(state.record[0]) === false) {
                    pendEdits = state.record[0].pendEdits || {};
                }
            }
        }
        return pendEdits;
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
     * For inline edit on reports get fields from FieldsStore
     * For edit form get fields from FormStore.
     */
    getFields() {
        let fields = null;
        const pendEdits = self.getPendingEditsFromStore();
        if (pendEdits.isInlineEditOpen) {
            let fieldsStore = self.flux.store('FieldsStore').getState();
            if (_.has(fieldsStore, 'fields.data')) {
                fields = fieldsStore.fields.data;
            }
        } else {
            let formsStore = self.flux.store('FormStore').getState();
            if (_.has(formsStore, 'editFormData.fields')) {
                fields = formsStore.editFormData.fields;
            }
        }
        return fields;
    }

    /*
    * All functions below reference 'self' instead of 'this' because of a context change
    * after being called from the modal
    */
    _saveChanges() {
        self._hideModal();

        const pendEdits = self.getPendingEditsFromStore();
        const appId = pendEdits.currentEditingAppId;
        const tableId = pendEdits.currentEditingTableId;
        const recordId = pendEdits.currentEditingRecordId;

        let fields = self.getFields();

        if (pendEdits.currentEditingRecordId === UNSAVED_RECORD_ID) {
            // handle record add
            self.flux.actions.saveNewRecord(appId, tableId, pendEdits.recordChanges, fields)
                .then(self._onRecordSaved, self._onRecordSavedError);
            //self._handleRecordAdd();
        } else {
            //self.store.dispatch(appId, tableId, recordId);
            //self.flux.actions.recordPendingEditsCommit(self.appId, self.tableId, self.recordId);
            //self.flux.actions.saveRecord(appId, tableId, recordId, pendEdits, fields, null, false)
            //    .then(self._onRecordSaved, self._onRecordSavedError);
            //self._handleRecordChange();
            self.store.dispatch(self.saveRecord(appId, tableId, recordId, pendEdits, fields, null, false)).then(
                () => {
                    self._continueToDestination();
                },
                () => {
                    self._haltRouteChange();
                }
            );
        }
    }

    //_handleRecordAdd() {
    //    self.flux.actions.saveNewRecord(self.appId, self.tableId, self.pendEdits.recordChanges, self.fields)
    //        .then(self._onRecordSaved, self._onRecordSavedError);
    //}

    //_handleRecordChange() {
    //    self.store.dispatch(editRecordCommit(self.appId, self.tableId, self.recordId));
    //    //self.flux.actions.recordPendingEditsCommit(self.appId, self.tableId, self.recordId);
    //    self.flux.actions.saveRecord(self.appId, self.tableId, self.recordId, self.pendEdits, self.fields)
    //        .then(self._onRecordSaved, self._onRecordSavedError);
    //}

    //_onRecordSaved() {
    //    self._continueToDestination();
    //}
    //
    //_onRecordSavedError() {
    //    self._haltRouteChange();
    //}

    _discardChanges(hideModal = true) {

        if (hideModal) {
            self._hideModal();
        }

        //  clean up pending edits in store
        const pendEdits = self.getPendingEditsFromStore();
        if (_.isEmpty(pendEdits) === false) {
            self.store.dispatch(self.editRecordCancel(pendEdits.currentEditingAppId, pendEdits.currentEditingTableId, pendEdits.currentEditingRecordId));
        }

        //self.flux.actions.recordPendingEditsCancel(self.appId, self.tableId, self.recordId);
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
