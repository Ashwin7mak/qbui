import {useRouterHistory} from "react-router";
import createHistory from 'history/lib/createBrowserHistory';
import {useBeforeUnload} from 'history';
import {UNSAVED_RECORD_ID} from '../constants/schema';

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
                this._saveChanges();
            } else {
                return this._continueToDestination();
            }
        });

        // Setup listener for route changes outside of the app (e.g., pasting in a new url)
        this.cancelListenBeforeUnload = this.history.listenBeforeUnload(event => {
            if (this.pendEdits.isPendingEdit) {
                event.returnValue = 'DONT LEAVE ME!!!';
                return 'DONT LEAVE ME!!';
            }
        });
    }

    _saveChanges() {
        this.appId = this.pendEdits.currentEditingAppId;
        this.tableId = this.pendEdits.currentEditingTableId;
        this.recordId = this.pendEdits.currentEditingRecordId;

        this.fields = this.flux.store('FieldsStore').getState().fields.data;

        if (this.pendEdits.currentEditingRecordId === UNSAVED_RECORD_ID) {
            this._handleRecordAdd();
        } else {
            this._handleRecordChange();
        }
    }

    _handleRecordAdd() {
        this.flux.actions.saveNewRecord(this.appId, this.tableId, this.pendEdits.recordChanges, this.fields)
            .then(this._onRecordSaved, this._onRecordSavedError);
    }

    _handleRecordChange() {
        this.flux.actions.recordPendingEditsCommit(this.appId, this.tableId, this.recordId);
        this.flux.actions.saveRecord(this.appId, this.tableId, this.recordId, this.pendEdits, this.fields)
            .then(this._onRecordSaved, this._onRecordSavedError);
    }

    _onRecordSaved() {
        this._continueToDestination();
    }

    _onRecordSavedError() {
        this._haltRouteChange();
    }

    // Turn this back on once the user is asked if they want to cancel with a modal
    // _discardChanges() {
    //     this.flux.actions.recordPendingEditsCancel(this.appId, this.tableId, this.recordId);
    //     this._continueToDestination();
    // }

    _continueToDestination() {
        this.callback();
    }

    _haltRouteChange() {
        this.callback(false);
    }
}

export default new AppHistory();
