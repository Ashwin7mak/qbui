import * as types from '../actions/types';
import RecordModel from '../models/recordModel';
import ValidationMessage from '../utils/validationMessage';
import {NEW_RECORD_VALUE} from "../constants/urlConstants";
import {UNSAVED_RECORD_ID} from "../constants/schema";
import _ from 'lodash';


/**
 * Manage array of record states
 * record state looks like following:
 * {
 *   recordIdBeingEdited: id,
 *   records : [array of records....]
 * }
 * example :
 * {
 *      recordIdBeingEdited : 3
 *      records : [
 *                  {
 *                      id : "DRAWER10299", => if in a drawer id has a drawer context
 *                      recId : "4",
 *                      nextRecordId : 5,
 *                      previousRecordId : null,
 *                      navigateAfterSave : false,
 *                      nextOrPreviousEdit : ""
 *                  },
 *                  {
 *                      id : 2, => if not in a drawer id is numeric
 *                      recId : 2,
 *                      nextRecordId : 3,
 *                      previousRecordId : 1,
 *                      navigateAfterSave : false,
 *                      nextOrPreviousEdit : ""
 *                  }
 *               ]
 *  }
 * @param state - array of records and id of currently edited record
 * @param action - event type
 * @returns {Object}
 */
const record = (state = {}, action) => {

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
        const stateClone = _.cloneDeep(state);

        //  if obj is undefined/null, there's nothing to do..
        if (obj) {
            //  ensure obj id is stored as a numeric..unless it's a new record or a record in a drawer
            obj.id = (obj.id === NEW_RECORD_VALUE || obj.id === UNSAVED_RECORD_ID ? NEW_RECORD_VALUE : obj.id);
            if (!stateClone.records) {
                stateClone.records = [];
            }
                //  does the state already hold an entry for the record context/id
            const index = _.findIndex(stateClone.records, rec => rec.id.toString() === obj.id.toString());
            if (index !== -1) {
                stateClone.records[index] = obj;
            } else {
                stateClone.records.push(obj);
            }
        }
        return stateClone;
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
        const index = _.findIndex(state.records, rec => rec.id.toString() === recId.toString());
        if (index !== -1) {
            return _.cloneDeep(state.records[index]);
        }
        return null;
    }

    //  what record action is being requested
    switch (action.type) {
    case types.DELETE_RECORDS: {
        const ids = action.content.recIds;
        let states = {};
        states.recordIdBeingEdited = '';
        states.records = [];
        ids.forEach((recId) => {
            let currentRecd = getRecordFromState(recId);
            if (!currentRecd) {
                currentRecd = {
                    id: recId
                };
            }

            //  for each delete, initialize a new record model object
            let model = new RecordModel(action.content.appId, action.content.tblId, recId);
            model.setSaving(true);
            currentRecd.pendEdits = model.get();
            states.records.push(currentRecd);
        });
        return states;
    }
    case types.DELETE_RECORDS_COMPLETE: {
        const ids = action.content.recIds;
        let states = {};
        states.recordIdBeingEdited = '';
        states.records = [];
        ids.forEach((recId) => {
            let currentRecd = getRecordFromState(recId);
            if (_.has(currentRecd, 'pendEdits')) {
                let model = new RecordModel();
                model.set(currentRecd.pendEdits);
                model.setSaving(false);

                currentRecd.pendEdits = model.get();
                states.records.push(currentRecd);
            }
        });
        return states;
    }
    case types.DELETE_RECORDS_ERROR: {
        let states = {};
        let errors = action.content.errors;
        if (Array.isArray(errors) && errors.length > 0) {
            states.recordIdBeingEdited = '';
            states.records = [];
            const ids = action.content.recIds;
            ids.forEach((recId) => {
                let currentRecd = getRecordFromState(recId);
                if (_.has(currentRecd, 'pendEdits')) {
                    let model = new RecordModel();
                    model.set(currentRecd.pendEdits);
                    model.setErrors(errors);

                    currentRecd.pendEdits = model.get();
                    states.records.push(currentRecd);
                }
            });
        }
        return _.has(states, 'records') && states.records.length > 0 ? states : state;
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
            if (_.has(currentRecd, 'pendEdits.recordChanges')) {
                currentRecd.pendEdits.recordChanges = {}; //clear the form for next edit
            }
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
            savedState.recordIdBeingEdited = NEW_RECORD_VALUE;
        }
        return savedState ? savedState : state;
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

        let savedState = newState(currentRecd);
        savedState.recordIdBeingEdited = getRecordIdBeingEdited(action.id);
        return savedState;
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
        let savedState = newState(currentRecd);
        savedState.recordIdBeingEdited = getRecordIdBeingEdited(action.id);
        return savedState;
    }
    case types.EDIT_RECORD_VALIDATE_FIELD: {
        const currentRecd = getRecordFromState(action.id);
        if (_.has(currentRecd, 'pendEdits')) {
            let model = new RecordModel();
            model.set(currentRecd.pendEdits);
            model.setEditRecordValidate(action.content);
            let savedState = newState(currentRecd);
            savedState.recordIdBeingEdited = getRecordIdBeingEdited(action.id);
            return savedState;
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
            let model = new RecordModel();
            model.setEditRecordCancel(currentRecd.appId, currentRecd.tblId, currentRecd.recId);
            currentRecd.pendEdits = model.get();
            return newState(currentRecd);
        }
        return state;
    }
    default:
        // by default, return existing state
        return state;
    }
};

/**
 * converts id to number and returns value if id not equal to null/new else returns new
 * @param id
 * @returns number or 'new'
 */
function getRecordIdBeingEdited(id) {
    return id === NEW_RECORD_VALUE || id === UNSAVED_RECORD_ID ? NEW_RECORD_VALUE : +id;
}
export default record;

/***
 * return the pendEdits of the matched record
 * if recId is passed in , that is used to get the record from the record store
 * else record state's recordIdBeingEdited is used to get the record from the record store
 * @param record state
 * @param recId
 * @returns {{}}
 */
export const getPendEdits = (recordState, recId) => {
    /**
     * return empty object if either is true
     * record state or records in the state is undefined
     * recId and recordIdBeingEdited both are undefined
     */
    if (!recordState || !recordState.records || (!recId && !recordState.recordIdBeingEdited)) {
        return {};
    }
    // the record returned is the one having the id matching recId if passed in or record state's recordIdBeingEdited
    const recordId = recId || recordState.recordIdBeingEdited.toString();
    const recordCurrentlyEdited = _.find(recordState.records,
        rec=>rec.id.toString() === recordId);
    return (recordCurrentlyEdited ? recordCurrentlyEdited.pendEdits : {}) || {};
};

/***
 * returns record matching the rec Id from the records array passed in
 * @param records array
 * @param recId (should always be a string)
 * @returns {{}}
 */
export const getRecord = (records, recId) => {
    return  _.find(records, rec=>rec.id.toString() === recId) || {};
};
