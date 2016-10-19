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
 * This singleton class maintains the current customized broswerHistory that includes event listeners
 * for when a route changes. This helps us detect if there are pending edits to a form before redirecting.
 */
class AppHistory {
    constructor() {
        if (!self) {
            self = this;

            this.history = useRouterHistory(useBeforeUnload(createHistory))();

            this.flux = null;
            this.appId = null;
            this.tableId = null;
            this.recordId = null;
            this.pendEdits = null;
            this.fields = null;
        }

        return self;
    }

    /**
     * Setups the singleton for use with flux outside of React. Needs to be run before history can be used.
     * @param flux
     */
    setup(flux) {
        this.flux = flux;

        this._setupHistoryListeners();

        return self;
    }

    _setupHistoryListeners() {
        // Setup listener for route changes within the app
        this.history.listenBefore((location, callback) => {
            this._checkForFlux();

            this.callback = callback;
            this.pendEdits = this.flux.store('RecordPendingEditsStore').getState();

            if (this.pendEdits.isPendingEdit) {
                // window.confirm('hello world');
                this._saveChanges();
            } else {
                return this.callback();
            }
        });

        // Setup listener for route changes outside of the app (e.g., pasting in a new url)
        this.history.listenBeforeUnload(() => {
            this._checkForFlux();

            if (this.pendEdits.isPendingEdit) {
                return 'DONT LEAVE ME!!';
            }
        });
    }

    _checkForFlux() {
        if (!this.flux) {
            throw new Error('Flux instance was not provided during setup. Please run setup on AppHistory before using in a router.');
        }
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
        this.callback();
    };

    _onRecordSavedError() {
        console.log('THERE WAS A PROBLEM SAVING THE RECORD');
        this.callback(false);
    }

    _discardChanges() {
        this.flux.actions.recordPendingEditsCancel(this.appId, this.tableId, this.recordId);
        this.callback();
    }

    _cancel() {
        this.callback(false);
    }
}

export default new AppHistory();
