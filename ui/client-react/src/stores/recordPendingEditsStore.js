import * as actions from "../constants/actions";
import Fluxxor from "fluxxor";
import _ from 'lodash';
import Logger from '../utils/logger';
var logger = new Logger();

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
            actions.SAVE_REPORT_RECORD, this.onSaveRecord,
            actions.SAVE_REPORT_RECORD_SUCCESS, this.onSaveRecordSuccess,
            actions.SAVE_REPORT_RECORD_FAILED, this.onSaveRecordFailed,
        );
        this._initData();
        this.commitChanges = [];
    },
    _initData() {
        this.isPendingEdit = false;
        this.currentEditingRecordId = null;
        this.currentEditingAppId = null;
        this.currentEditingTableId = null;
        this.originalRecord = null;
        this.recordChanges = {};
    },
    onRecordEditStart(payload) {
        if (typeof (payload.recId) !== 'undefined') {
            this.currentEditingRecordId = payload.recId;
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
    onRecordEditChangeField(payload) {
        if (typeof (this.recordChanges[payload.changes.fid]) === 'undefined') {
            this.recordChanges[payload.changes.fid] = {};
        }
        this.recordChanges[payload.changes.fid].oldVal = payload.changes.values.oldVal;
        this.recordChanges[payload.changes.fid].newVal = payload.changes.values.newVal;
        this.recordChanges[payload.changes.fid].fieldName = payload.changes.fieldName;
        this.currentEditingAppId = payload.appId;
        this.currentEditingTableId = payload.tblId;
        this.currentEditingRecordId = payload.recId;
        this.isPendingEdit = true;
        this.emit('change');
    },
    onRecordEditCancel() {
        // record wasn't saved
        this._initData();
        this.emit('change');
    },
    onRecordEditSave(payload) {
        if (this.isPendingEdit) {
            //keep list of changes made to records
            this.currentEditingRecordId = payload.recId;
            let entry = this._getEntryKey();
            if (typeof (this.commitChanges[entry]) === 'undefined') {
                this.commitChanges[entry] = {};
            }
            if (typeof (this.commitChanges[entry].changes) === 'undefined') {
                this.commitChanges[entry].changes = [];
            }
            this.commitChanges[entry].changes.push(this.recordChanges);
            this.commitChanges[entry].status = '...'; //status is pending response from server

            this.emit('change');
        }
    },
    onSaveRecord(payload) {
        this.currentEditingAppId = payload.appId;
        this.currentEditingTableId = payload.tblId;
        this.currentEditingRecordId = payload.recId;
        let changes = payload.changes;
        logger.debug('saving changes: ' + JSON.stringify(payload));
    },
    onSaveRecordSuccess(payload) {
        this.currentEditingRecordId = payload.recId;
        let entry = this._getEntryKey();
        if (typeof (this.commitChanges[entry]) !== 'undefined') {
            this.commitChanges[entry].status = actions.SAVE_REPORT_RECORD_SUCCESS;
        }
        this.emit('change');

    },
    onSaveRecordFailed(payload) {
        this.currentEditingRecordId = payload.recId;
        let entry = this._getEntryKey();
        if (typeof (this.commitChanges[entry]) !== 'undefined') {
            this.commitChanges[entry].status = actions.SAVE_REPORT_RECORD_FAILED;
        }
        this.emit('change');
    },
    _getEntryKey() {
        return '' + this.currentEditingAppId + '/' + this.currentEditingTableId + '/' + this.currentEditingRecordId;
    },
    getState() {
        return {
            isPendingEdit : this.isPendingEdit,
            currentEditingAppId : this.currentEditingAppId,
            currentEditingTableId : this.currentEditingTableId,
            currentEditingRecordId : this.currentEditingRecordId,
            originalRecord : this.originalRecord,
            recordChanges : this.recordChanges,
            commitChanges : this.commitChanges
        };
    },
});

export default RecordPendingEditsStore;
