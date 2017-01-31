/**
 * Any actions related to inline (or other?) Editing a record are defined here. This is responsible for triggering start change and
 * end of pending record edit action.
 */
import * as actions from '../constants/actions';

let recordPendingEditsActions = {

    /* the start of editing a record */
    recordPendingEditsStart(appId, tblId, recId, origRec, changes, isInlineEdit = false) {
        this.dispatch(actions.RECORD_EDIT_START, {appId, tblId, recId, origRec, changes, isInlineEdit});
    },
    /* the change of a field while editing a record */
    recordPendingEditsChangeField(appId, tblId, recId, changes) {
        this.dispatch(actions.RECORD_EDIT_CHANGE_FIELD, {appId, tblId, recId, changes});
    },
    /* cancel editing a record */
    recordPendingEditsCancel(appId, tblId, recId) {
        // TODO - temp disable to avoid issue with redux..mutating state exception
        //this.dispatch(actions.RECORD_EDIT_CANCEL, {appId, tblId, recId});
    },
    /* committing changes from editing a record */
    recordPendingEditsCommit(appId, tblId, recId) {
        this.dispatch(actions.RECORD_EDIT_SAVE, {appId, tblId, recId});
    },
    /* validate a field when editing a record */
    recordPendingValidateField(fieldDef, fieldLabel, value, checkRequired) {
        this.dispatch(actions.RECORD_EDIT_VALIDATE_FIELD, {fieldDef, fieldLabel, value, checkRequired});
    }
};

export default recordPendingEditsActions;
