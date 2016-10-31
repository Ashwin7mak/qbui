import {useRouterHistory} from "react-router";
import createHistory from 'history/lib/createBrowserHistory';
import {useBeforeUnload} from 'history';
import {UNSAVED_RECORD_ID} from '../constants/schema';
import {ShowAppModal, HideAppModal} from '../components/qbModal/appQbModalFunctions';

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
            self = this;

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
        this.flux = flux;

        this._setupHistoryListeners();

        return self;
    }

    /**
     * Clears the AppHistory singleton and event listeners
     */
    reset() {
        if (this.cancelListenBefore) {this.cancelListenBefore();}
        if (this.cancelListenBeforeUnload) {this.cancelListenBeforeUnload();}

        self = null; // eslint-disable-line
        return new AppHistory();
    }

    /**
     * Add the global listeners to route changes
     * @private
     */
    _setupHistoryListeners() {
        // Setup listener for route changes within the app
        this.cancelListenBefore = this.history.listenBefore((location, callback) => {
            this.callback = callback;
            this.pendEdits = this.flux.store('RecordPendingEditsStore').getState();

            if (this.pendEdits.isPendingEdit) {
                this._showModal();
            } else {
                return this._continueToDestination();
            }
        });

        // Setup listener for route changes outside of the app (e.g., pasting in a new url)
        this.cancelListenBeforeUnload = this.history.listenBeforeUnload(event => {
            this.pendEdits = this.flux.store('RecordPendingEditsStore').getState();

            // The following text does not need to be internationalized because
            // it will not actually appear in the modal on evergreen browsers.
            if (this.pendEdits.isPendingEdit) {
                if (event) {
                    event.returnValue = 'Save changes before leaving?';
                }
                return 'Save changes before leaving?';
            }
        });
    }

    _showModal() {
        ShowAppModal({
            type: 'alert',
            messageI18nKey: 'pendingEditModal.modalBodyMessage',
            primaryButtonI18nKey: 'pendingEditModal.modalSaveButton',
            primaryButtonOnClick: this._saveChanges,
            middleButtonI18nKey: 'pendingEditModal.modalDoNotSaveButton',
            middleButtonOnClick: this._discardChanges,
            leftButtonI18nKey: 'pendingEditModal.modalStayButton',
            leftButtonOnClick: this._haltRouteChange
        });
    }

    _hideModal() {
        HideAppModal();
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

        self.fields = self.flux.store('FieldsStore').getState().fields.data;

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
