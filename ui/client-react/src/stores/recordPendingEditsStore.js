import * as actions from "../constants/actions";
import Fluxxor from "fluxxor";
import _ from 'lodash';
import Logger from '../utils/logger';
import ValidationUtils from '../../../common/src/validationUtils';
import ValidationMessage from '../utils/validationMessage';
import Constants from '../../../common/src/constants';
var logger = new Logger();

const [DTS_ERR0R_CODE, DTS_ERROR_MESSAGES_CODE] = [Constants.HttpStatusCode.INTERNAL_SERVER_ERROR, Constants.ERROR_CODE.DTS_ERROR_CODE];

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
            actions.DELETE_RECORD, this.onStartEdit,
            actions.DELETE_RECORD_BULK, this.onStartEdit,
            actions.DELETE_RECORD_FAILED, this.onDeleteRecordFailed,
            actions.DELETE_RECORD_BULK_FAILED, this.onDeleteRecordBulkFailed,
            actions.ADD_RECORD, this.onSaveAddedRecord,
            actions.ADD_RECORD_SUCCESS, this.onAddRecordSuccess,
            actions.ADD_RECORD_FAILED, this.onAddRecordFailed,
            actions.AFTER_RECORD_EDIT, this.onAfterEdit,
            actions.DTS_ERROR_MODAL, this.onDTSErrorModal
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
        this.recordEditOpen = undefined;
        this.currentEditingRecordId = null;
        this.currentEditingAppId = null;
        this.currentEditingTableId = null;
        this.originalRecord = null;
        this.recordChanges = {};
        this.showDTSErrorModal = false;
        this.dtsErrorModalTID = "No Transaction ID Available";
        this.editErrors = {
            ok: true,
            errors:[]
        };
        this.saving = false;
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
     * Checks if a field actually has changes (i.e., prevents change detection if a user picks the same item from a
     * dropdown as they had originally selected)
     * @param payload
     * @returns {boolean}
     */
    _hasChanges(payload) {
        if (_.has(payload, 'changes.values') && _.has(this.originalRecord, 'fids')) {
            return (
                // If the new and previous values are the same, but different from the original, then the change
                // has already been registered by pendEdits. Therefore, we check to make sure the change is different
                // from both the previous value AND the original value.
                this._isDifferentThanOriginalFieldValue(payload) && this._isDifferentThanPreviousValue(payload)
            );
        }

        // Assume there was a change if not all required properties are present.
        // This is primarily for testing purposes.
        return true;
    },

    /**
     * Checks if the newest value is different than the previous one
     * @param payload
     * @returns {boolean}
     * @private
     */
    _isDifferentThanPreviousValue(payload) {
        let {newVal, oldVal} = payload.changes.values;

        // Cannot check for differences if one of the objects doesn't exist. Assume a change in that case.
        if (!newVal || !oldVal) {
            return true;
        }

        // Some components modify display values and some modify the underlying value so we check for both
        return (newVal.value !== oldVal.value || newVal.display !== oldVal.display);
    },

    /**
     * Checks if the newest value is different than the original record
     * @param payload
     * @returns {boolean}
     * @private
     */
    _isDifferentThanOriginalFieldValue(payload) {
        let {newVal} = payload.changes.values;

        // If there is no newValue object then assume a change
        if (!newVal) {
            return true;
        }

        let originalRecord = this.originalRecord.fids[payload.changes.fid];
        let originalRecordValue = null;
        let originalRecordDisplay = null;
        if (originalRecord) {
            originalRecordValue = originalRecord.value;
            originalRecordDisplay = originalRecord.display;
        }
        return (newVal.value !== originalRecordValue || newVal.display !== originalRecordDisplay);
    },

    /**
     * If there were previously changes, but user put the values back to the original
     * then we need to remove those from pendingEdits.
     * @param payload
     * @private
     */
    _removePriorChangesIfTheyExist(payload) {
        if (this.recordChanges && this.recordChanges[payload.changes.fid] && !this._isDifferentThanOriginalFieldValue(payload)) {
            delete this.recordChanges[payload.changes.fid];

            // If there are no remaining changes, then the record is not pending edits anymore
            if (Object.keys(this.recordChanges).length === 0) {
                this.isPendingEdit = false;
            }

            this.emit('change');
        }
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

        if (this._hasChanges(payload)) {
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
        } else {
            this._removePriorChangesIfTheyExist(payload);
        }
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
        this.onStartEdit();
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
    handleErrors(payload) {
        this.getServerErrs(payload);
        if (payload.error) {
            if (payload.error.statusCode === DTS_ERR0R_CODE && payload.error.errorMessages[0].code === DTS_ERROR_MESSAGES_CODE) {
                this.onDTSErrorModal(payload);
            }
        }
    },
    getServerErrs(payload) {
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
    onDTSErrorModal(payload) {
        this.dtsErrorModalTID = payload.error ? payload.error.tid : this.dtsErrorModalTID;
        this.showDTSErrorModal = true;
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
        this.handleErrors(payload);
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
        this.onStartEdit();
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

        this.handleErrors(payload);
        this.emit('change');
    },
    onDeleteRecordFailed(payload) {
        this.handleErrors(payload);
        this.emit('change');
    },
    onDeleteRecordBulkFailed(payload) {
        this.handleErrors(payload);
        this.emit('change');
    },
    onStartEdit(emit = true) {
        this.saving = true;
        if (emit) {
            this.emit('change');
        }
    },
    onAfterEdit() {
        this.saving = false;
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
            editErrors: this.editErrors,
            showDTSErrorModal: this.showDTSErrorModal,
            dtsErrorModalTID: this.dtsErrorModalTID,
            saving: this.saving
        };
    },
});

export default RecordPendingEditsStore;
