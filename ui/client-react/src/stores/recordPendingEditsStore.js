import * as actions from "../constants/actions";
import Fluxxor from "fluxxor";
import _ from 'lodash';
import Logger from '../utils/logger';
import ValidationUtils from '../../../common/src/validationUtils';
import ValidationMessage from "../utils/validationMessage";

var logger = new Logger();

/**
   RecordPendingEditsStore keeps track of inline edits in progress made on a record    before they are committed to database
 **/


let RecordPendingEditsStore = Fluxxor.createStore({

    initialize() {
        this.bindActions(
            actions.RECORD_EDIT_START, this.onRecordEditStart,
            actions.RECORD_EDIT_CHANGE_FIELD, this.onRecordEditChangeField,
            actions.RECORD_EDIT_CANCEL, this.onRecordEditCancel,
            actions.RECORD_EDIT_SAVE, this.onRecordEditSave,
            actions.RECORD_EDIT_VALIDATE_FIELD, this.onRecordEditValidateField,
            actions.SAVE_REPORT_RECORD, this.onSaveRecord,
            actions.SAVE_RECORD_SUCCESS, this.onSaveRecordSuccess,
            actions.SAVE_RECORD_FAILED, this.onSaveRecordFailed,
            actions.ADD_RECORD, this.onSaveAddedRecord,
            actions.ADD_RECORD_SUCCESS, this.onAddRecordSuccess,
            actions.ADD_RECORD_FAILED, this.onAddRecordFailed
        );
        this._initData();
        this.commitChanges = [];
    },

    /**
     * internal reset of any pending edits
     * in we have case of multiple reports with edits in progress
     * will need to use map to report instances
     * @private
     */
    _initData() {
        this.isPendingEdit = false;
        this.isInlineEditOpen = false;
        this.recordEditOpen = false;
        this.currentEditingRecordId = null;
        this.currentEditingAppId = null;
        this.currentEditingTableId = null;
        this.originalRecord = null;
        this.recordChanges = {};
        this.editErrors = {
            ok: true,
            errors:[]
        };
    },

    /**
     * On the beginning of an inline edit
     * keeps note of the app/table/rec context and any original data
     * or initial changes for the record
     * @param payload -
     *      app/tbl/recIds
     *      origRec - if editing an existing record the original rec values
     *      or
     *      changes - if adding a new record the initial default new record values
     */
    onRecordEditStart(payload) {
        if (typeof (payload.recId) !== 'undefined') {
            this.currentEditingRecordId = payload.recId;
            this.currentEditingAppId = payload.appId;
            this.currentEditingTableId = payload.tblId;
            this.recordChanges =  _.cloneDeep(payload.changes);
            this.originalRecord = _.cloneDeep(payload.origRec);
        } else {
            this.currentEditingRecordId = undefined;
            this.currentEditingAppId = undefined;
            this.currentEditingTableId = undefined;
            this.recordChanges = payload.changes ? _.cloneDeep(payload.changes) : {};
            this.originalRecord = undefined;
        }
        //TODO when a record gets into edit state it might already have errors so this should be populated with those
        this.editErrors = {
            ok: true,
            errors:[]
        };
        this.recordEditOpen = true;

        if (payload.isInlineEdit) {
            this.isInlineEditOpen = true;
        }

        this.emit('change');
    },

    /**
     * On the change of a fields value not yet committed
     * @param payload -
     *      app/tbl/recIds
     *      changes:
     *          fid  - field id of the change
     *          values - {oldVal : {}, newVal : {}
     *          fieldName - name of the field that has a new value
     */
    onRecordEditChangeField(payload) {
        if (typeof (this.recordChanges[payload.changes.fid]) === 'undefined') {
            this.recordChanges[payload.changes.fid] = {};
        }
        this.recordChanges =  _.cloneDeep(this.recordChanges);
        this.recordChanges[payload.changes.fid].oldVal = payload.changes.values.oldVal;
        this.recordChanges[payload.changes.fid].newVal = payload.changes.values.newVal;
        this.recordChanges[payload.changes.fid].fieldName = payload.changes.fieldName;
        this.recordChanges[payload.changes.fid].fieldDef = payload.changes.fieldDef;
        this.currentEditingAppId = payload.appId;
        this.currentEditingTableId = payload.tblId;
        this.currentEditingRecordId = payload.recId;
        this.isPendingEdit = true;
        this.emit('change');
    },

    /**
     * Called when a field is validated typically on blur.
     * editErrors is an object of type {fid, {isInvalid, invalidMessgage}}
     * @param def
     * @param value
     * @param checkRequired
     */
    onRecordEditValidateField(payload) {
        if (!this.editErrors) {
            this.editErrors = {
                ok: true,
                errors:[]
            };
        }
        let results = ValidationUtils.checkFieldValue(payload, payload.fieldLabel, payload.value, payload.checkRequired);
        if (results.isInvalid) {
            this.editErrors.ok = false;
            this.editErrors.errors.push(results);
        }
        this.emit('change');
    },

    /**
     * On the cancellation of pending edit
     */
    onRecordEditCancel() {
        // record wasn't saved nothing pending

        if (this.isInlineEditOpen) {
            this.isInlineEditOpen = false;
        }
        this.recordEditOpen = false;
        this._initData();
        this.emit('change');
    },

    /**
     * On request to save pending changes to an existing record
     * @param payload
     *  - recId that has changed
     */
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

    /**
     * On saving changes debug log changes
     * does not emit change
     * @param payload
     *      app/tbl/recIds
     *      changes - array of changed rec values
     */
    onSaveRecord(payload) {
        this.currentEditingAppId = payload.appId;
        this.currentEditingTableId = payload.tblId;
        this.currentEditingRecordId = payload.recId;
        let changes = payload.changes;
        logger.debug('saving changes: ' + JSON.stringify(payload));
    },

    /**
     * On successful save of pending changes on an existing record
     * note the committed success and set pendingEdits to false
     * @param payload - the recid
     */
    onSaveRecordSuccess(payload) {
        this.currentEditingRecordId = payload.recId;
        let entry = this._getEntryKey();
        if (typeof (this.commitChanges[entry]) !== 'undefined') {
            this.commitChanges[entry].status = actions.SAVE_RECORD_SUCCESS;
        }
        this.isPendingEdit = false;
        this.isInlineEditOpen = false;
        this.recordEditOpen = false;
        this.recordChanges = {};
        this.editErrors = {
            ok: true,
            errors:[]
        };
        this.emit('change');

    },

    getServerErrs(payload) {
        // init no errors
        this.editErrors = {
            ok: true,
            errors:[]
        };

        // get errors from payload if not ok
        if (_.has(payload, 'error.data.response.errors') && payload.error.data.response.errors.length !== 0) {
            this.editErrors.errors = payload.error.data.response.errors;
            this.editErrors.ok = false;
            // fill in client message
            this.editErrors.errors.forEach(fieldError => {
                fieldError.invalidMessage = ValidationMessage.getMessage(fieldError);
            });
        }
    },

    /**
     * On failure to save pending changes for an existing record
     * note the committed failure
     * @param payload - recid
     */
    onSaveRecordFailed(payload) {
        this.currentEditingRecordId = payload.recId;
        let entry = this._getEntryKey();
        if (typeof (this.commitChanges[entry]) !== 'undefined') {
            this.commitChanges[entry].status = actions.SAVE_RECORD_FAILED;
        }
        this.getServerErrs(payload);
        this.recordEditOpen = true;
        this.emit('change');
    },

    /**
     * On request to save pending changes for a new record
     * @param payload
     *  - recId that has changed
     */
    onSaveAddedRecord(payload) {
        this.currentEditingAppId = payload.appId;
        this.currentEditingTableId = payload.tblId;
        this.currentEditingRecordId = null;
        this.recordChanges = payload.changes;
        logger.debug('saving added record: ' + JSON.stringify(payload));
    },

    /**
     * On successful save of pending changes for a new record
     * notes the committed success and sets pendingEdits to false
     * @param payload - the recId
     */
    onAddRecordSuccess(payload) {
        this.currentEditingRecordId = payload.recId;
        let entry = this._getEntryKey();
        if (typeof (this.commitChanges[entry]) === 'undefined') {
            this.commitChanges[entry] = {};
        }
        if (typeof (this.commitChanges[entry].changes) === 'undefined') {
            this.commitChanges[entry].changes = [];
        }
        this.commitChanges[entry].changes.push(this.recordChanges);
        if (typeof (this.commitChanges[entry]) !== 'undefined') {
            this.commitChanges[entry].status = actions.ADD_RECORD_SUCCESS;
        }
        this.isPendingEdit = false;

        if (this.isInlineEditOpen) {
            this.isInlineEditOpen = false;
        }
        this.recordEditOpen = false;
        this.recordChanges = {};
        this.editErrors = {
            ok: true,
            errors:[]
        };
        this.emit('change');

    },

    /**
     * On failure to save pending changes for a new record
     * notes the failure
     * @param payload - the recid
     */
    onAddRecordFailed(payload) {
        this.currentEditingRecordId = payload.recId;
        //TBD what if no recId for new rec on fail
        let entry = this._getEntryKey();
        if (typeof (this.commitChanges[entry]) === 'undefined') {
            this.commitChanges[entry] = {};
        }
        if (typeof (this.commitChanges[entry]) !== 'undefined') {
            this.commitChanges[entry].status = actions.ADD_RECORD_FAILED;
        }
        this.getServerErrs(payload);

        this.emit('change');
    },

    /**
     * create a key for pending edit commitChanges map from the current context
     * of app/table/record
     *
     * @returns {string}
     * @private
     */
    _getEntryKey() {
        return '' + this.currentEditingAppId + '/' + this.currentEditingTableId + '/' + this.currentEditingRecordId;
    },

    /**
     * returns the pending record edit store object
     * @returns state of pending edits
     */
    getState() {
        return {
            isPendingEdit : this.isPendingEdit,
            isInlineEditOpen : this.isInlineEditOpen,
            recordEditOpen : this.recordEditOpen,
            currentEditingAppId : this.currentEditingAppId,
            currentEditingTableId : this.currentEditingTableId,
            currentEditingRecordId : this.currentEditingRecordId,
            originalRecord : this.originalRecord,
            recordChanges : this.recordChanges,
            commitChanges : this.commitChanges,
            editErrors: this.editErrors
        };
    },
});

export default RecordPendingEditsStore;
