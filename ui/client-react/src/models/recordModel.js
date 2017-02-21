import _ from 'lodash';

class RecordModel {

    constructor() {
        this.init();
    }

    init() {
        this.model = {};
        this.model.appId = null;
        this.model.tblId = null;
        this.model.recId = null;
        this.model.isPendingEdit = false;
        this.model.isInlineEditOpen = false;

        this.model.recordEditOpen = false;
        this.model.currentEditingRecordId = null;
        this.model.currentEditingAppId = null;
        this.model.currentEditingTableId = null;
        this.model.originalRecord = null;
        this.model.recordChanges = {};
        this.model.commitChanges = [];

        //TODO: needed?
        this.model.showDTSErrorModal = false;
        this.model.dtsErrorModalTID = "No Transaction ID Available";
        this.model.editErrors = {
            ok: true,
            errors:[]
        };
        this.model.fieldToStartEditing = null;
        this.model.saving = false;
        this.model.hasAttemptedSave = false;
    }

    get() {
        return this.model;
    }

    setEditRecordStart(appId, tblId, recId, obj) {
        this.model.appId = appId || null;
        this.model.tblId = tblId || null;
        this.model.recId = recId || null;
        if (this.model.recId) {
            this.model.currentEditingAppId = this.model.appId;
            this.model.currentEditingTableId = this.model.tblId;
            this.model.currentEditingRecordId = this.model.recId;
        }

        this.model.originalRecord = obj.origRec ? _.cloneDeep(obj.origRec) : null;
        this.model.recordChanges = obj.changes ? _.cloneDeep(obj.changes) : {};
        this.model.fieldToStartEditing = obj.fieldToStartEditing || null;

        this.model.recordEditOpen = true;
        this.model.isInlineEditOpen = obj.isInlineEdit || false;
    }

    setEditRecordChange(appId, tblId, recId, origRec, changes) {
        if (typeof (this.model.recordChanges[changes.fid]) === 'undefined') {
            this.model.recordChanges[changes.fid] = {};
        }

        if (hasChanges(changes, origRec)) {
            this.model.recordChanges =  _.cloneDeep(this.model.recordChanges);
            this.model.recordChanges[changes.fid].oldVal = changes.values.oldVal;
            this.model.recordChanges[changes.fid].newVal = changes.values.newVal;
            this.model.recordChanges[changes.fid].fieldName = changes.fieldName;
            this.model.recordChanges[changes.fid].fieldDef = changes.fieldDef;
            this.model.currentEditingAppId = appId;
            this.model.currentEditingTableId = tblId;
            this.model.currentEditingRecordId = recId;
            this.model.isPendingEdit = true;
        } else {
            if (this.model.recordChanges && this.model.recordChanges[changes.fid] && !isDifferentThanOriginalFieldValue(changes, origRec)) {
                delete this.model.recordChanges[changes.fid];
            }
            // If there are no remaining changes, then the record is not pending edits anymore
            if (Object.keys(this.model.recordChanges).length === 0) {
                this.model.isPendingEdit = false;
            }
        }
    }

    setEditRecordCancel(appId, tblId, recId) {
        this.init();
        this.model.appId = appId;
        this.model.tblId = tblId;
        this.model.recId = recId;
    }
}

/**
 * Checks if a field actually has changes (i.e., prevents change detection if a user picks the same item from a
 * dropdown as they had originally selected)
 * @param payload
 * @returns {boolean}
 */
function hasChanges(changes, origRec) {
    if (_.has(changes, 'values') && _.has(origRec, 'fids')) {
        return (
            // If the new and previous values are the same, but different from the original, then the change
            // has already been registered by pendEdits. Therefore, we check to make sure the change is different
            // from both the previous value AND the original value.
            isDifferentThanOriginalFieldValue(changes, origRec) && isDifferentThanPreviousValue(changes, origRec)
        );
    }

    // Assume there was a change if not all required properties are present.
    // This is primarily for testing purposes.
    return true;
}

/**
 * Checks if the newest value is different than the previous one
 * @param payload
 * @returns {boolean}
 * @private
 */
function isDifferentThanPreviousValue(changes) {
    let {newVal, oldVal} = changes.values;

    // We treat '', null, undefined as equivalent since it represents a blank input or a
    // dropdown with no selection.
    const isOldValFalsy = !oldVal || (oldVal && !oldVal.value && oldVal.value !== 0);
    const isNewValFalsy = !newVal || (newVal && !newVal.value && newVal.value !== 0);
    if (isOldValFalsy && isNewValFalsy) {
        // both oldValue and newValue is falsy, no change
        return false;
    } else if (isOldValFalsy || isNewValFalsy) {
        // when only one of newValue or oldValue is falsy
        return true;
    } else {
        return (!_.isEqual(newVal.value, oldVal.value));
    }
}

/**
 * Checks if the newest value is different than the original record
 * @param payload
 * @returns {boolean}
 * @private
 */
function isDifferentThanOriginalFieldValue(changes, origRec) {
    let {newVal} = changes.values;

    // If there is no newValue object then assume a change
    if (!newVal) {
        return true;
    }

    let originalRecord = origRec.fids[changes.fid];
    let originalRecordValue = null;
    let originalRecordDisplay = null;
    if (originalRecord) {
        originalRecordValue = originalRecord.value;
        originalRecordDisplay = originalRecord.display;
    }

    // We treat '', null, undefined as equivalent since it represents a blank input or a
    // dropdown with no selection.
    const isOldValFalsy = !originalRecord || (!originalRecordValue && originalRecordValue !== 0);
    const isNewValFalsy = !newVal || (newVal && !newVal.value && newVal.value !== 0);
    if (isOldValFalsy && isNewValFalsy) {
        return false;
    } else if (isOldValFalsy || isNewValFalsy) {
        // when only one of newValue or oldValue is falsy
        return true;
    } else {
        return (!_.isEqual(newVal.value, originalRecordValue));
    }
}

export default RecordModel;
