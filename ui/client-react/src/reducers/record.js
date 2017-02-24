import * as types from '../actions/types';
import RecordModel from '../models/recordModel';
import ValidationUtils from '../../../common/src/validationUtils';
import ValidationMessage from '../utils/validationMessage';
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
        const index = _.findIndex(state, rec => rec.id === id);
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
        //case types.EDIT_RECORD: {
        //    const obj = {
        //        id: action.id,
        //        recId: action.content.recId,
        //        nextEditRecordId: action.content.nextRecordId,
        //        previousEditRecordId: action.content.previousRecordId,
        //        nextOrPreviousEdit: action.nextOrPrevious,
        //        navigateAfterSave: action.navigateAfterSave
        //    };
        //    return newState(obj);
        //}
        case types.SAVE_RECORD: {
            const obj = {
                id: action.id,
                appId: action.content.appId,
                tblId: action.content.tblId,
                recId: action.content.recId,
                changes: action.content.changes
            };
            return newState(obj);
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
                const pendEdits = currentRecd.pendEdits;
                let entry = getEntryKey(pendEdits);
                if (typeof (pendEdits.commitChanges[entry]) === 'undefined') {
                    pendEdits.commitChanges[entry] = {};
                }
                if (typeof (pendEdits[entry].changes) === 'undefined') {
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
