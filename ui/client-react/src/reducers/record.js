import * as types from '../actions/types';
import RecordModel from '../models/recordModel';
import ValidationUtils from '../../../common/src/validationUtils';
import ValidationMessage from '../utils/validationMessage';
import {NEW_RECORD_VALUE} from "../constants/urlConstants";
import _ from 'lodash';

/**
 * Manage array of record states
 *
 * @param state - array of states
 * @param action - event type
 * @returns {Array}
 */
const record = (state = [], action) => {

    //  Store can be configured to hold just one record
    //  or array of records.
    const singleRecordStore = true;

    /**
     * Create a deep clone of the state array.  If the new state obj
     * id/context is not found, add to the end of the array.
     * Otherwise, replace the existing entry with its new state.
     *
     * @param obj - data object associated with new state
     * @returns {*}
     */
    function newState(obj) {
        // reducer - no mutations against current state!
        const stateList = _.cloneDeep(state);

        //  if obj is undefined/null, there's nothing to do..
        if (obj) {
            //  ensure obj id is stored as a numeric..unless it's a new record
            if (obj.id !== NEW_RECORD_VALUE) {
                obj.id = +obj.id;
            }
            if (singleRecordStore === true) {
                if (stateList.length === 0) {
                    stateList.push(obj);
                } else {
                    stateList[0] = obj;
                }
            } else {
                //  does the state already hold an entry for the record context/id
                const index = _.findIndex(stateList, rec => rec.id === obj.id);
                if (index !== -1) {
                    stateList[index] = obj;
                } else {
                    stateList.push(obj);
                }
            }
        }
        return stateList;
    }

    /**
     * Retrieve the record from the state and return a cloned
     * object
     *
     * @param id
     * @returns {*}
     */
    function getRecordFromState(id) {
        const recId = (id === NEW_RECORD_VALUE ? id : +id);  // ensure always looking up id as a numeric..unless it's a new record
        const index = _.findIndex(state, rec => rec.id === recId);
        if (index !== -1) {
            return _.cloneDeep(state[index]);
        }
        return null;
    }

    function getEntryKey(currentRecd) {
        return '' + currentRecd.currentEditingAppId + '/' + currentRecd.currentEditingTableId + '/' + currentRecd.currentEditingRecordId;
    }

    //  what record action is being requested
    switch (action.type) {
        case types.DELETE_RECORDS: {
            // TODO: not sure if need to set 'saving' on state on each when deleting
            const ids = action.content.recIds;
            let states = [];
            ids.forEach((recId) => {
                let currentRecd = getRecordFromState(recId);
                if (!currentRecd) {
                    currentRecd = {
                        id: recId
                    };
                }

                //  initialize a new record model object used for delete
                let model = new RecordModel(action.content.appId, action.content.tblId, action.content.recId);
                model.setSaving(true);
                currentRecd.pendEdits = model.get();

                states.push(currentRecd);
            });
            return states.length > 0 ? states : state;
        }
        case types.DELETE_RECORDS_COMPLETE: {
            // TODO: not sure if need to set 'saving' on state on each when deleting
            //
            //  TODO: make sure state is not getting mutated!!!!
            const ids = action.content.recIds;
            let states = null;
            ids.forEach((recId) => {
                let currentRecd = getRecordFromState(recId);
                if (_.has(currentRecd, 'pendEdits')) {
                    let model = new RecordModel();
                    model.set(currentRecd.pendEdits);
                    model.setSaving(false);
                    states = newState(currentRecd);
                }
            });
            return states || state;
        }
        case types.DELETE_RECORDS_ERROR: {
            //  update errors..if any
            let states = null;
            let errors = action.content.errors;
            if (errors) {
                const ids = action.content.recIds;
                ids.forEach((recId) => {
                    let currentRecd = getRecordFromState(recId);
                    if (_.has(currentRecd, 'pendEdits')) {
                        let model = new RecordModel();
                        model.set(currentRecd.pendEdits);
                        model.setErrors(errors);
                        states = newState(currentRecd);
                    }
                });
            }
            return states || state;
        }
        case types.OPEN_RECORD: {
            const obj = {
                id: action.id,
                recId: action.content.recId,
                nextRecordId: action.content.nextRecordId,
                previousRecordId: action.content.previousRecordId,
                navigateAfterSave: action.navigateAfterSave || false,
                nextOrPreviousEdit: action.nextOrPreviousEdit || ''
            };
            return newState(obj);
        }
        case types.SAVE_RECORD: {
            let currentRecd = getRecordFromState(action.id);
            let model;
            if (_.has(currentRecd, 'pendEdits')) {
                //TODO: fix this..messy
                const pendEdits = currentRecd.pendEdits;

                // saving an existing record
                model = new RecordModel();
                model.set(pendEdits);

                //  any inline edit changes...this is replacing commit..
                if (pendEdits.isPendingEdit) {
                    let entry = getEntryKey(pendEdits);
                    if (typeof (pendEdits.commitChanges[entry]) === 'undefined') {
                        pendEdits.commitChanges[entry] = {};
                    }
                    if (typeof (pendEdits.commitChanges[entry].changes) === 'undefined') {
                        pendEdits.commitChanges[entry].changes = [];
                    }
                    pendEdits.commitChanges[entry].changes.push(pendEdits.recordChanges);
                    pendEdits.commitChanges[entry].status = '...'; //status is pending response from server
                }

                model.setRecordChanges(action.content.appId, action.content.tblId, action.content.recId, action.content.changes);
            } else {
                // saving a new record
                currentRecd = {
                    id: action.id
                };
                model = new RecordModel(action.content.appId, action.content.tblId);
                model.setRecordChanges(action.content.appId, action.content.tblId, action.content.recId, action.content.changes);
            }
            currentRecd.pendEdits = model.get();
            return newState(currentRecd);
        }
        case types.SAVE_RECORD_SUCCESS: {
            let currentRecd = getRecordFromState(action.id);
            if (currentRecd) {
                //TODO: fix this..messy
                currentRecd.currentEditingRecordId = action.content.recId;
                let entry = getEntryKey(currentRecd);

                //  new save is not going to have any commit changes..
                if (typeof (currentRecd.pendEdits.commitChanges[entry]) === 'undefined') {
                    currentRecd.pendEdits.commitChanges[entry] = {};
                }
                if (typeof (currentRecd.pendEdits.commitChanges[entry].changes) === 'undefined') {
                    currentRecd.pendEdits.commitChanges[entry].changes = [];
                }
                currentRecd.pendEdits.commitChanges[entry].changes.push(currentRecd.pendEdits.recordChanges);

                //  TODO: setting status though it doesn't look like it's referenced anywhere..not sure why it's set.
                if (typeof (currentRecd.pendEdits.commitChanges[entry]) !== 'undefined') {
                    currentRecd.pendEdits.commitChanges[entry].status = types.SAVE_RECORD_SUCCESS;
                }

                currentRecd.pendEdits.updateRecordInReportGrid = true;

                currentRecd.pendEdits.isPendingEdit = false;
                currentRecd.pendEdits.isInlineEditOpen = false;
                currentRecd.pendEdits.recordEditOpen = false;
                currentRecd.pendEdits.recordChanges = {};
                //TODO fix this..
                currentRecd.pendEdits.editErrors = {
                    ok: true,
                    errors:[]
                };
                currentRecd.pendEdits.saving = false;
                return newState(currentRecd);
            }
            return state;
        }
        case types.SAVE_RECORD_ERROR:
        {
            let currentRecd = getRecordFromState(action.id);
            if (_.has(currentRecd, 'pendEdits')) {
                let errors = action.content.errors;
                if (errors) {
                    let model = new RecordModel();
                    model.set(currentRecd.pendEdits);
                    model.setErrors(errors);
                    model.currentEditingRecordId = action.content.recId;
                    model.hasAttemptedSave = true;

                    //  toDO: not sure this is really necessary..but carrying over from flux implementation
                    let entry = getEntryKey(currentRecd);
                    if (typeof (currentRecd.pendEdits.commitChanges[entry]) === 'undefined') {
                        currentRecd.pendEdits.commitChanges[entry] = {};
                    }
                    if (typeof (currentRecd.pendEdits.commitChanges[entry]) !== 'undefined') {
                        currentRecd.pendEdits.commitChanges[entry].status = types.SAVE_RECORD_ERROR;
                    }

                    return newState(currentRecd);
                }
            }
            return state;
        }
        case types.SAVE_RECORD_COMPLETE: {
            // TODO: not sure if need to set 'saving' on state on each when deleting
            //
            //  TODO: make sure state is not getting mutated!!!!
            let currentRecd = getRecordFromState(action.id);
            if (_.has(currentRecd, 'pendEdits')) {
                let model = new RecordModel();
                model.set(currentRecd.pendEdits);
                model.setSaving(false);
                return newState(currentRecd);
            }
            return state;
        }
        case types.EDIT_RECORD_START: {
            //  check if record is already in the store..
            let currentRecd = getRecordFromState(action.id);
            if (!currentRecd) {
                currentRecd = {
                    id: action.id
                };
            }

            //  initialize a new record model object used for pending changes
            let model = new RecordModel();
            const content = action.content || {};
            model.setEditRecordStart(content);

            currentRecd.pendEdits = model.get();
            return newState(currentRecd);
        }
        case types.EDIT_RECORD_CHANGE: {
            //  get a clone of the current record
            let currentRecd = getRecordFromState(action.id);
            if (!currentRecd) {
                currentRecd = {
                    id: action.id
                };
            }

            //  initialize pending edits model object
            let model;
            if (_.has(currentRecd, 'pendEdits')) {
                model = new RecordModel();
                model.set(currentRecd.pendEdits);
            } else {
                model = new RecordModel();
                const content = action.content || {};
                model.setEditRecordStart(content);
            }

            //  update the model with the content changes
            const changes = action.content.changes || {};
            model.setEditRecordChange(changes);

            //  set the pending changes object
            currentRecd.pendEdits = model.get();
            return newState(currentRecd);
        }
        case types.EDIT_RECORD_COMMIT: {
            //  get a cloned copy of record in the store..its expected that EDIT_RECORD_START
            //  and/or EDIT_RECORD_CHANGE has already been called, populated the
            //  store with the record.
            const currentRecd = getRecordFromState(action.id);
            if (_.has(currentRecd, 'pendEdits') && currentRecd.pendEdits.isPendingEdit) {
                //TODO: move into model method?
                const pendEdits = currentRecd.pendEdits;
                let entry = getEntryKey(pendEdits);
                if (typeof (pendEdits.commitChanges[entry]) === 'undefined') {
                    pendEdits.commitChanges[entry] = {};
                }
                if (typeof (pendEdits.commitChanges[entry].changes) === 'undefined') {
                    pendEdits.commitChanges[entry].changes = [];
                }
                pendEdits.commitChanges[entry].changes.push(pendEdits.recordChanges);
                pendEdits.commitChanges[entry].status = '...'; //status is pending response from server
                return newState(currentRecd);
            }
            return state;
        }
        case types.EDIT_RECORD_VALIDATE_FIELD: {
            const currentRecd = getRecordFromState(action.id);
            if (currentRecd && _.has(currentRecd, 'pendEdits')) {
                //TODO: move into model method?
                let content = action.content;
                let pendEdits = currentRecd.pendEdits;
                let recentlyChangedFieldId = (_.has(content, 'fieldDef') ? content.fieldDef.id : null);

                // clear outdated validation results
                if (recentlyChangedFieldId) {
                    // Get out if we can't find a valid field ID
                    pendEdits.editErrors.errors = pendEdits.editErrors.errors.filter(error => {
                        return error.id !== recentlyChangedFieldId;
                    });

                    if (pendEdits.editErrors.errors.length === 0) {
                        pendEdits.editErrors.ok = true;
                    }
                }

                let results = ValidationUtils.checkFieldValue(content, content.fieldLabel, content.value, content.checkRequired);
                if (results.isInvalid) {
                    // Make sure the id is added so that forms can correctly detect which field to mark as invalid
                    // and so that the id can be found by the _clearOutdatedValidationResults method
                    if (!results.id && _.has(results, 'def.fieldDef')) {
                        results.id = results.def.fieldDef.id;
                    }

                    if (!results.invalidMessage && _.has(results, 'error.messageId')) {
                        results.invalidMessage = ValidationMessage.getMessage(results);
                    }

                    pendEdits.editErrors.ok = false;
                    pendEdits.editErrors.errors.push(results);
                }
                return newState(currentRecd);
            }

            return state;
        }
        case types.EDIT_RECORD_CANCEL: {
            const currentRecd = getRecordFromState(action.id);
            if (_.has(currentRecd, 'pendEdits')) {
                delete currentRecd.pendEdits;
            }
            return newState(currentRecd);
        }
        default:
            // by default, return existing state
            return state;
    }
};

export default record;
