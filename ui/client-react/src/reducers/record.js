import * as types from '../actions/types';
import RecordModel from '../models/recordModel';
import ValidationMessage from '../utils/validationMessage';
import {NEW_RECORD_VALUE} from "../constants/urlConstants";
import {UNSAVED_RECORD_ID} from "../constants/schema";
import _ from 'lodash';


/**
 * Manage array of record states
 *
 * @param state - array of states
 * @param action - event type
 * @returns {Array}
 */
const record = (state = [], action) => {

    //  Store can be configured to hold just one record or array of records.
    //  NOTE: until a need to do so, only 1 record in the store
    const singleRecordStore = false;

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
            obj.id = (obj.id === NEW_RECORD_VALUE || obj.id === UNSAVED_RECORD_ID ? NEW_RECORD_VALUE : obj.id);

            //  TODO: the id is currently the record id, which is fine when only holding 1 record
            //  TODO: or working on the same table, but this will need to be refactored and set to
            //  TODO: the appId/tblId/recId composite to ensure no collision when working on records
            //  TODO: with the same recId but from different tables.
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
     * Retrieve the record from the state and return a clone object
     *
     * @param id
     * @returns {*}
     */
    function getRecordFromState(id) {
        //  TODO: the id is currently the record id, which is fine when only holding 1 record
        //  TODO: or working on the same table, but this will need to be refactored and set to
        //  TODO: the appId/tblId/recId composite to ensure no collision when working on records
        //  TODO: with the same recId but from different tables.
        //
        // ensure always looking up id as a numeric..unless it's a new record
        const recId = (id === NEW_RECORD_VALUE || id === UNSAVED_RECORD_ID ? NEW_RECORD_VALUE : +id);
        const index = _.findIndex(state, rec => rec.id === recId);
        if (index !== -1) {
            return _.cloneDeep(state[index]);
        }
        return null;
    }

    //  what record action is being requested
    switch (action.type) {
    case types.DELETE_RECORDS: {
        const ids = action.content.recIds;
        let states = [];
        ids.forEach((recId) => {
            let currentRecd = getRecordFromState(recId);
            if (!currentRecd) {
                currentRecd = {
                    id: recId
                };
            }

            //  for each delete, initialize a new record model object
            let model = new RecordModel(action.content.appId, action.content.tblId, action.content.recId);
            model.setSaving(true);
            currentRecd.pendEdits = model.get();

            states.push(currentRecd);
        });
        return states.length > 0 ? states : state;
    }
    case types.DELETE_RECORDS_COMPLETE: {
        const ids = action.content.recIds;
        let states = [];
        ids.forEach((recId) => {
            let currentRecd = getRecordFromState(recId);
            if (_.has(currentRecd, 'pendEdits')) {
                let model = new RecordModel();
                model.set(currentRecd.pendEdits);
                model.setSaving(false);

                currentRecd.pendEdits = model.get();
                states.push(currentRecd);
            }
        });
        return states.length > 0 ? states : state;
    }
    case types.DELETE_RECORDS_ERROR: {
        let states = [];
        let errors = action.content.errors;
        if (Array.isArray(errors) && errors.length > 0) {
            const ids = action.content.recIds;
            ids.forEach((recId) => {
                let currentRecd = getRecordFromState(recId);
                if (_.has(currentRecd, 'pendEdits')) {
                    let model = new RecordModel();
                    model.set(currentRecd.pendEdits);
                    model.setErrors(errors);

                    currentRecd.pendEdits = model.get();
                    states.push(currentRecd);
                }
            });
        }
        return states.length > 0 ? states : state;
    }
    case types.OPEN_RECORD: {
        const obj = {
            id: action.id,
            recId: action.content.recId,
            nextRecordId: action.content.nextRecordId,
            previousRecordId: action.content.previousRecordId,
            navigateAfterSave: action.content.navigateAfterSave || false,
            nextOrPreviousEdit: action.content.nextOrPreviousEdit || ''
        };
        return newState(obj);
    }
    case types.SAVE_RECORD: {
        let currentRecd = getRecordFromState(action.id);
        let model;
        if (_.has(currentRecd, 'pendEdits')) {
            // saving an existing record
            model = new RecordModel();
            model.set(currentRecd.pendEdits);
            model.setRecordChanges(action.content.appId, action.content.tblId, action.content.recId, action.content.changes);
        } else {
            // saving a new record
            currentRecd = {
                id: action.id
            };
            model = new RecordModel(action.content.appId, action.content.tblId);
            model.setRecordChanges(action.content.appId, action.content.tblId, action.content.recId, action.content.changes);
            currentRecd.pendEdits = model.get();
        }
        return newState(currentRecd);
    }
    case types.SAVE_RECORD_SUCCESS: {
        //  NOTE: this event is listened to in the report reducer to avoid multiple grid renders.
        let savedState = null;
        let currentRecd = getRecordFromState(action.id);
        if (currentRecd) {
            let model = new RecordModel();
            model.set(currentRecd.pendEdits);
            model.setRecordSaveSuccess(action.content.appId, action.content.tblId, action.content.recId);
            model.setSaving(false);
            savedState = newState(currentRecd);
        }

        // if adding a new row via inline edit after saving a record, need to add that row
        if (action.content.addNewRow === true) {
            // the new row shouldn't be there, but we'll check anyways
            let newRecd = getRecordFromState(UNSAVED_RECORD_ID);
            if (!newRecd) {
                newRecd = {
                    id: UNSAVED_RECORD_ID
                };
            }

            //  initialize a new record model object
            let model = new RecordModel();
            let obj = {
                appId: action.content.appId,
                tblId: action.content.tblId,
                recId: UNSAVED_RECORD_ID,
                isInlineEdit: true,
                fieldToStartEditing: _.has(currentRecd, 'pendEdits') ? currentRecd.pendEdits.fieldToStartEditing : null
            };
            model.setEditRecordStart(obj);
            newRecd.pendEdits = model.get();
            savedState = newState(newRecd);
        }
        return Array.isArray(savedState) ? savedState : state;
    }
    case types.SAVE_RECORD_ERROR: {
        let currentRecd = getRecordFromState(action.id);
        if (_.has(currentRecd, 'pendEdits')) {
            let errors = action.content.errors;
            if (errors) {
                let model = new RecordModel();
                model.set(currentRecd.pendEdits);
                model.setRecordSaveError(action.content.appId, action.content.tblId, action.content.recId, errors);
                return newState(currentRecd);
            }
        }
        return state;
    }
    case types.SAVE_RECORD_COMPLETE: {
        let currentRecd = getRecordFromState(action.id);
        if (_.has(currentRecd, 'pendEdits')) {
            let model = new RecordModel();
            model.set(currentRecd.pendEdits);
            model.setSaving(false, true);
            if (_.get(currentRecd.pendEdits, 'editErrors.ok')) {
                delete currentRecd.pendEdits;
            }
            return newState(currentRecd);
        }
        return state;
    }
    case types.EDIT_RECORD_START: {
        let currentRecd = getRecordFromState(action.id);
        //  if no record in store, create a new one
        if (!currentRecd) {
            currentRecd = {
                id: action.id
            };
        }

        //  initialize a new record model object used for pending changes
        let model = new RecordModel();
        model.setEditRecordStart(action.content || {});

        //  set currentRecd with the pendEdits model
        currentRecd.pendEdits = model.get();

        return newState(currentRecd);
    }
    case types.EDIT_RECORD_CHANGE: {
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
        model.setEditRecordChange(action.content.changes);

        //  could be a new model instance, so need to set the pending changes object
        currentRecd.pendEdits = model.get();
        return newState(currentRecd);
    }
    case types.EDIT_RECORD_VALIDATE_FIELD: {
        const currentRecd = getRecordFromState(action.id);
        if (_.has(currentRecd, 'pendEdits')) {
            let model = new RecordModel();
            model.set(currentRecd.pendEdits);
            model.setEditRecordValidate(action.content);
            return newState(currentRecd);
        }
        return state;
    }
    case types.EDIT_RECORD_CANCEL: {
        const currentRecd = getRecordFromState(action.id);
        if (_.has(currentRecd, 'pendEdits')) {
            delete currentRecd.pendEdits;
            return newState(currentRecd);
        }
        return state;
    }
    case types.REMOVE_BLANK_REPORT_RECORD: {
        //  NOTE: this event is listened to in the report reducer to avoid multiple grid renders.
        let recId = action.content.recId;
        const currentRecd = getRecordFromState(recId);
        if (_.has(currentRecd, 'pendEdits')) {
            delete currentRecd.pendEdits;
            return newState(currentRecd);
        }
        return state;
    }
    default:
        // by default, return existing state
        return state;
    }
};
export default record;
