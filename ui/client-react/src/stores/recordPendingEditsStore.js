import * as actions from "../constants/actions";
import Fluxxor from "fluxxor";
import _ from 'lodash';
/**
    keeps track of inline edits in progress made on a record before
    they are committed to database
 **/


let RecordPendingEditsStore = Fluxxor.createStore({

    initialize() {
        this.bindActions(
            actions.RECORD_EDIT_START, this.onRecordEditStart,
            actions.RECORD_EDIT_CHANGE_FIELD, this.onRecordEditChangeField,
            actions.RECORD_EDIT_CANCEL, this.onRecordEditCancel,
            actions.RECORD_EDIT_SAVE, this.onRecordEditSave,
        );
        this._initData();
        this.committedChanges = [];
    },
    _initData() {
        this.pendingEdit = false;
        this.currentEditingRecordId = undefined;
        this.currentEditingAppId = undefined;
        this.currentEditingTableId = undefined;
        this.originalRecord = undefined;
        this.recordChanges = {};
        this.emit('change');
    },

    onRecordEditStart(payload) {
        if (typeof (payload.recId) !== 'undefined') {
            this.currentEditingRecordId = payload.recId.value;
            this.currentEditingAppId = payload.appId;
            this.currentEditingTableId = payload.tblId;
            this.recordChanges = {};
            this.originalRecord = _.cloneDeep(payload.origRec);
        } else {
            this.currentEditingRecordId = undefined;
            this.currentEditingAppId = undefined;
            this.currentEditingTableId = undefined;
            this.recordChanges = {};
            this.originalRecord = undefined;
        }
        this.emit('change');
    },

    onRecordEditCancel() {
        // restore originalRecord?
        this._initData();
        this.emit('change');
    },

    onRecordEditSave(payload) {
        //keep list of changes made to records
        this.currentEditingRecordId = payload.recId.value;
        let entry = '' + this.currentEditingAppId + '/' + this.currentEditingTableId + '/' + this.currentEditingRecordId;
        if (typeof (this.committedChanges[entry] === 'undefined')) {
            this.committedChanges[entry] = [];
        }
        this.committedChanges[entry].push(this.recordChanges);
        this.emit('change');
    },

    onRecordEditChangeField(payload) {
        this.recordChanges[payload.changes.fid] = payload.changes.values;
        this.currentEditingAppId = payload.appId;
        this.currentEditingTableId = payload.tblId;
        this.currentEditingRecordId = payload.recId.value;
        this.pendingEdit = true;
        this.emit('change');
    },

    getState() {
        return {
            recordChanges : this.recordChanges,
            currentEditingAppId : this.currentEditingAppId,
            currentEditingRecordId : this.currentEditingRecordId,
            currentEditingTableId : this.currentEditingTableId,
            originalRecord : this.originalRecord,
            pendingEdit : this.pendingEdit,
            committedChanges : this.committedChanges
        };
    },
});

export default RecordPendingEditsStore;
