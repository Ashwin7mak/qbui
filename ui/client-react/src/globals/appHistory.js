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

            // The instance of flux (to get stores and call actions)
            this.flux = null;

            // Properties needed to save records with pending edits
            this.appId = null;
            this.tableId = null;
            this.recordId = null;
            this.pendEdits = null;
            this.fields = null;

            // Keep track of the event listeners so they can be canceled
            this.cancelListenBefore = null;
            this.cancelListenBeforeUnload = null;

            self = this;
        }

        return self;
    }

    /**
     * Setups the singleton for use with flux outside of React. Needs to be run before history can be used.
     * Flux currently has to be passed in because it is difficult to use Fluxxor outside of React. Once we
     * move to Redux, this may not be necessary.
     * @param flux
     */
    setup(flux) {
        self.flux = flux;

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

                if (self.flux) {
                    self.pendEdits = self.flux.store('RecordPendingEditsStore').getState();
                }

                if (this.hasPendingEdits()) {
                    this.showPendingEditsConfirmationModal();
                } else {
                    self._continueToDestination();
                }
            } else {
                return callback();
            }
        });

        // Setup listener for route changes outside of the app (e.g., pasting in a new url)
        self.cancelListenBeforeUnload = self.history.listenBeforeUnload(event => {
            if (self && self.flux) {
                self.pendEdits = self.flux.store('RecordPendingEditsStore').getState();
            }

            // The following text does not need to be internationalized because
            // it will not actually appear in the modal on evergreen browsers.
            if (this.hasPendingEdits()) {
                if (event) {
                    event.returnValue = 'Save changes before leaving?';
                }
                return 'Save changes before leaving?';
            }
        });
    }

    hasPendingEdits() {
        return (self && self.pendEdits && self.pendEdits.isPendingEdit);
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
        if (self.pendEdits.isInlineEditOpen) {
            let fieldsStore = self.flux.store('FieldsStore').getState();
            if (_.has(fieldsStore, 'fields.data')) {
                self.fields = fieldsStore.fields.data;
            }
        } else {
            let formsStore = self.flux.store('FormStore').getState();
            if (_.has(formsStore, 'editFormData.fields')) {
                self.fields = formsStore.editFormData.fields;
            }
        }
    }
    /*
    * All functions below reference 'self' instead of 'this' because of a context change
    * after being called from the modal
    */
    _saveChanges() {
        self._hideModal();

        self.appId = self.pendEdits.currentEditingAppId;
        self.tableId = self.pendEdits.currentEditingTableId;
        self.recordId = self.pendEdits.currentEditingRecordId;

        self.getFields();

        if (self.pendEdits.currentEditingRecordId === UNSAVED_RECORD_ID) {
            self._handleRecordAdd();
        } else {
            self._handleRecordChange();
        }
    }

    _handleRecordAdd() {
        self.flux.actions.saveNewRecord(self.appId, self.tableId, self.pendEdits.recordChanges, self.fields)
            .then(self._onRecordSaved, self._onRecordSavedError);
    }

    _handleRecordChange() {
        self.flux.actions.recordPendingEditsCommit(self.appId, self.tableId, self.recordId);
        self.flux.actions.saveRecord(self.appId, self.tableId, self.recordId, self.pendEdits, self.fields)
            .then(self._onRecordSaved, self._onRecordSavedError);
    }

    _onRecordSaved() {
        self._continueToDestination();
    }

    _onRecordSavedError() {
        self._haltRouteChange();
    }

    _discardChanges() {
        self._hideModal();

        self.flux.actions.recordPendingEditsCancel(self.appId, self.tableId, self.recordId);
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

export default new AppHistory();
