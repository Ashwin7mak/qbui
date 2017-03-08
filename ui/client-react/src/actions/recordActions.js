/**
 * Any actions related to Record model are defined here. This is responsible for making calls to Node layer api based on the action.
 */
import * as actions from '../constants/actions';
import RecordService from '../services/recordService';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';
import Promise from 'bluebird';
import Locale from '../locales/locales';
import _ from 'lodash';
import {NotificationManager} from 'react-notifications';
import * as CompConsts from '../constants/componentConstants';
import * as query from '../constants/query';
import * as UrlConsts from "../constants/urlConstants";
import * as types from '../actions/types';
import RecordModel from '../models/recordModel';

let logger = new Logger();

let PRE_REQ_DELAY_MS = 1;

/**
 * Add the option to return display values when getting a record from the server
 * You can pass in other options that will be used in addition to the format property.
 * @param options
 * @returns {*}
 * @private
 */
function _withDisplayFormat(options = {}) {
    let displayOptions = {};
    displayOptions[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
    return Object.assign(displayOptions, options);
}

function _logValidationErrors(errors, msgPrefix) {
    if (errors && Array.isArray(errors)) {
        errors.forEach((err) => {
            // make a copy of the error object and then remove the
            // def property as it could contain customer sensitive
            // information in the fieldDef array.
            let errorObj = _.clone(err);
            delete errorObj.def;
            logger.parseAndLogError(LogLevel.ERROR, {data:errorObj}, msgPrefix);
        });
    }
}

//  FLUX Actions...to be migrated..

let recordActions = {
    /**
     * start editing a new record
     */
    //editNewRecord() {
    //    this.dispatch(actions.EDIT_REPORT_RECORD, {recId:UrlConsts.NEW_RECORD_VALUE});
    //},

    /**
     * Action to save a new record. On successful save get a copy of the newly created record from server.
     * @param appId
     * @param tblId
     * @param recordChanges
     * @param fields
     * @param colList - optional list of fids to query for getRecord call.
     * @param showNotificationOnSuccess - true to show success notification.
     */
    //saveNewRecord(appId, tblId, recordChanges, fields, colList = [], showNotificationOnSuccess = false) {
    //    function formatRecordChanges(_recordChanges) {
    //        //save changes in record
    //        let payload = [];
    //        // columns id and new values array
    //        //[{"id":6, "value":"Claire", fieldDef:{}}]
    //        if (_recordChanges) {
    //            Object.keys(_recordChanges).forEach((recKey) => {
    //                //get each columns matching field description
    //                let matchingField = _recordChanges[recKey].fieldDef;
    //
    //                // only post the non built in fields values
    //                if (matchingField && matchingField.builtIn === false) {
    //                    let newValue = _recordChanges[recKey].newVal.value;
    //                    let newDisplay = _recordChanges[recKey].newVal.display;
    //
    //                    let colChange = {};
    //                    colChange.fieldName = _recordChanges[recKey].fieldName;
    //                    colChange.id = +recKey;
    //                    colChange.value = _.cloneDeep(newValue);
    //                    colChange.display = _.cloneDeep(newDisplay);
    //                    colChange.fieldDef = matchingField;
    //                    payload.push(colChange);
    //                }
    //            });
    //        }
    //        return payload;
    //    }
    //    // promise is returned in support of unit testing only
    //    return new Promise((resolve, reject) => {
    //        let record = formatRecordChanges(recordChanges);
    //
    //        if (appId && tblId && record) {
    //            this.dispatch(actions.ADD_RECORD, {appId, tblId, changes:recordChanges});
    //            let recordService = new RecordService();
    //
    //            // save the changes to the record
    //            recordService.createRecord(appId, tblId, record).then(
    //                response => {
    //                    logger.debug('RecordService createRecord success');
    //                    if (response !== undefined && response.data !== undefined && response.data.body !== undefined) {
    //                        let resJson = JSON.parse(response.data.body);
    //                        if (resJson.id) {
    //                            //normally getRecord will only return default columns for the table. so pass in clist for all of report's columns
    //                            let clist = colList ? colList : [];
    //                            if (!clist.length && fields) {
    //                                fields.forEach((field) => {
    //                                    clist.push(field.id);
    //                                });
    //                            }
    //                            clist = clist.join('.');
    //                            this.dispatch(actions.GET_RECORD, {appId, tblId, recId: resJson.id, clist: clist});
    //                            recordService.getRecord(appId, tblId, resJson.id, clist, _withDisplayFormat()).then(
    //                                getResponse => {
    //                                    logger.debug('RecordService getRecord success');
    //                                    this.dispatch(actions.ADD_RECORD_SUCCESS, {appId, tblId, record: getResponse.data, recId: resJson.id});
    //
    //                                    if (!showNotificationOnSuccess) {
    //                                        NotificationManager.success(Locale.getMessage('recordNotifications.recordAdded'), Locale.getMessage('success'),
    //                                            CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
    //                                    }
    //                                    // this tiny delay allows for saving modal to trap inputs otherwise
    //                                    // clicks get queued till after creating
    //                                    Promise.delay(PRE_REQ_DELAY_MS).then(() => {
    //                                        this.dispatch(actions.AFTER_RECORD_EDIT);
    //                                        resolve(resJson.id);
    //                                    });
    //                                },
    //                                getError => {
    //                                    logger.parseAndLogError(LogLevel.ERROR, getError.response, 'recordService.getRecord:');
    //                                    // dispatch the GET_RECORD_FAILED. This is not being acted upon right now in any of the stores
    //                                    this.dispatch(actions.GET_RECORD_FAILED, {appId, tblId, recId, error: getError.response});
    //                                    // this tiny delay allows for saving modal to trap inputs otherwise
    //                                    // clicks get queued till after creating
    //                                    Promise.delay(PRE_REQ_DELAY_MS).then(() => {
    //                                        this.dispatch(actions.AFTER_RECORD_EDIT);
    //                                        reject();
    //                                    });
    //                                }
    //                            );
    //                        }
    //                    } else {
    //                        logger.error('RecordService createRecord call error: no response data value returned');
    //                        this.dispatch(actions.ADD_RECORD_FAILED, {appId, tblId, record, error: new Error('no response data member')});
    //                        // this delay allows for saving modal to trap inputs otherwise
    //                        // clicks get invoked after create
    //                        Promise.delay(PRE_REQ_DELAY_MS).then(() => {
    //                            this.dispatch(actions.AFTER_RECORD_EDIT);
    //                            reject();
    //                        });
    //                    }
    //                },
    //                error => {
    //                    //  if a validation error, print each one individually..
    //                    if (error && error.data && error.data.response && error.data.response.errors) {
    //                        let errors = error.data.response.errors;
    //                        _logValidationErrors(errors, 'recordService.createRecord');
    //                    } else {
    //                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'recordService.createRecord');
    //                    }
    //
    //                    this.dispatch(actions.ADD_RECORD_FAILED, {appId, tblId, record, error: error});
    //                    if (error.response.status === 403) {
    //                        NotificationManager.error(Locale.getMessage('recordNotifications.error.403'), Locale.getMessage('failed'),
    //                            CompConsts.NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);
    //                    }
    //                    if (error.response.status === 500 && _.has(error.response, 'data.response.status')) {
    //                        const {status} = error.response.data.response;
    //                        if (status !== 422) {
    //                            // HTTP data response status 422 means server "validation error" under the general HTTP 500 error
    //                            NotificationManager.error(Locale.getMessage('recordNotifications.error.500'), Locale.getMessage('failed'),
    //                                CompConsts.NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);
    //                        }
    //                    }
    //                    // this delay allows for saving modal to trap inputs otherwise
    //                    // clicks get invoked after create
    //                    Promise.delay(PRE_REQ_DELAY_MS).then(() => {
    //                        this.dispatch(actions.AFTER_RECORD_EDIT);
    //                        reject();
    //                    });
    //                }
    //            );
    //
    //        } else {
    //            var errMessage = 'Missing one or more required input parameters to recordActions.addRecord. AppId:' +
    //                appId + '; TblId:' + tblId + '; recordChanges:' + JSON.stringify(recordChanges) + '; fields:' + JSON.stringify(fields);
    //            logger.error(errMessage);
    //            this.dispatch(actions.ADD_RECORD_FAILED, {error: errMessage});
    //            reject();
    //        }
    //    });
    //},

    /**
     * delete a record
     */

        //  TODO:  MONDAY  migrate deleteRECORD to use redux..
    //deleteRecord(appId, tblId, recId, nameForRecords) {
    //    // promise is returned in support of unit testing only
    //    return new Promise((resolve, reject) => {
    //        if (appId && tblId && (!!(recId === 0 || recId))) {
    //            this.dispatch(actions.DELETE_RECORD, {appId, tblId, recId});
    //            let recordService = new RecordService();
    //
    //            //delete the record
    //            recordService.deleteRecord(appId, tblId, recId).then(
    //                response => {
    //                    logger.debug('RecordService deleteRecord success');
    //                    this.dispatch(actions.DELETE_RECORD_SUCCESS, recId);
    //                    NotificationManager.success(`1 ${nameForRecords} ${Locale.getMessage('recordNotifications.deleted')}`, Locale.getMessage('success'),
    //                        CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
    //                    // this delay allows for saving modal to trap inputs otherwise
    //                    // clicks get invoked after deleting
    //                    Promise.delay(PRE_REQ_DELAY_MS).then(() => {
    //                        this.dispatch(actions.AFTER_RECORD_EDIT);
    //                        resolve();
    //                    });
    //                },
    //                error => {
    //                    logger.parseAndLogError(LogLevel.ERROR, error.response, 'recordService.deleteRecord:');
    //                    this.dispatch(actions.DELETE_RECORD_FAILED, {appId, tblId, recId, error: error});
    //                    NotificationManager.error(`1 ${nameForRecords} ${Locale.getMessage('recordNotifications.notDeleted')}`, Locale.getMessage('failed'),
    //                        CompConsts.NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);
    //                    // this delay allows for saving modal to trap inputs otherwise
    //                    // clicks get invoked after delete
    //                    Promise.delay(PRE_REQ_DELAY_MS).then(() => {
    //                        this.dispatch(actions.AFTER_RECORD_EDIT);
    //                        reject();
    //                    });
    //                }
    //            ).catch(
    //                ex => {
    //                    // TODO - remove catch block and update onPossiblyUnhandledRejection bluebird handler
    //                    logger.logException(ex);
    //                    // this delay allows for saving modal to trap inputs otherwise
    //                    // clicks get invoked after delete
    //                    Promise.delay(PRE_REQ_DELAY_MS).then(() => {
    //                        this.dispatch(actions.AFTER_RECORD_EDIT);
    //                        reject();
    //                    });
    //                }
    //            );
    //        } else {
    //            var errMessage = 'Missing one or more required input parameters to recordActions.deleteRecord. AppId:' +
    //                appId + '; TblId:' + tblId + '; recId:' + recId;
    //            logger.error(errMessage);
    //            this.dispatch(actions.DELETE_RECORD_FAILED, {appId, tblId, recId, error: errMessage});
    //            reject();
    //        }
    //    });
    //},

    ///**
    // * delete records in bulk
    // */
    //deleteRecordBulk(appId, tblId, recIds, nameForRecords) {
    //    // promise is returned in support of unit testing only
    //    return new Promise((resolve, reject) => {
    //        if (appId && tblId && recIds && recIds.length >= 1) {
    //            this.dispatch(actions.DELETE_RECORD_BULK, {appId, tblId, recIds});
    //            let recordService = new RecordService();
    //
    //            //delete the records
    //            recordService.deleteRecordBulk(appId, tblId, recIds).then(
    //                response => {
    //                    logger.debug('RecordService deleteRecordBulk success');
    //                    this.dispatch(actions.DELETE_RECORD_BULK_SUCCESS, recIds);
    //                    let message = recIds.length === 1 ? (`1 ${nameForRecords} ${Locale.getMessage('recordNotifications.deleted')}`) : (`${recIds.length} ${nameForRecords} ${Locale.getMessage('recordNotifications.deleted')}`);
    //                    NotificationManager.success(message, Locale.getMessage('success'), CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
    //                    // this delay allows for saving modal to trap inputs otherwise
    //                    // clicks get invoked after deleting
    //                    Promise.delay(PRE_REQ_DELAY_MS).then(() => {
    //                        this.dispatch(actions.AFTER_RECORD_EDIT);
    //                        resolve();
    //                    });
    //                },
    //                error => {
    //                    logger.parseAndLogError(LogLevel.ERROR, error.response, 'recordService.deleteRecordBulk:');
    //                    this.dispatch(actions.DELETE_RECORD_BULK_FAILED, {appId, tblId, recIds, error: error});
    //                    let message = recIds.length === 1 ? (`1 ${nameForRecords} ${Locale.getMessage('recordNotifications.notDeleted')}`) : (`${recIds.length} ${nameForRecords} ${Locale.getMessage('recordNotifications.notDeleted')}`);
    //                    NotificationManager.error(message, Locale.getMessage('failed'), CompConsts.NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);
    //                    // this delay allows for saving modal to trap inputs otherwise
    //                    // clicks get invoked after delete
    //                    Promise.delay(PRE_REQ_DELAY_MS).then(() => {
    //                        this.dispatch(actions.AFTER_RECORD_EDIT);
    //                        reject();
    //                    });
    //                }
    //            ).catch(
    //                ex => {
    //                    // TODO - remove catch block and update onPossiblyUnhandledRejection bluebird handler
    //                    logger.logException(ex);
    //                    // this delay allows for saving modal to trap inputs otherwise
    //                    // clicks get invoked after delete
    //                    Promise.delay(PRE_REQ_DELAY_MS).then(() => {
    //                        this.dispatch(actions.AFTER_RECORD_EDIT);
    //                        reject();
    //                    });
    //                }
    //            );
    //        } else {
    //            var errMessage = 'Missing one or more required input parameters to recordActions.deleteRecordBulk. AppId:' +
    //                appId + '; TblId:' + tblId + '; recIds:' + recIds ;
    //            logger.error(errMessage);
    //            this.dispatch(actions.DELETE_RECORD_BULK_FAILED, {appId, tblId, recIds, error: errMessage});
    //            reject();
    //        }
    //    });
    //},

    /**
     * Save changes to an existing record. On successful save get a copy of updated record from server.
     * @param appId
     * @param tblId
     * @param recId
     * @param pendEdits
     * @param fields
     * @param colList - optional list of fids to query for getRecord call.
     * @param showNotificationOnSuccess - true to show success notification.
     */
    //saveRecord(appId, tblId, recId, pendEdits, fields, colList, showNotificationOnSuccess = false) {
    //    function createColChange(value, display, field, payload) {
    //        let colChange = {};
    //        colChange.fieldName = field.name;
    //        //the + before field.id is needed turn the field id from string into a number
    //        colChange.id = +field.id;
    //        colChange.value = _.cloneDeep(value);
    //        colChange.display = _.cloneDeep(display);
    //        colChange.fieldDef = field;
    //        payload.push(colChange);
    //    }
    //
    //    function getConstrainedUnchangedValues(_pendEdits, _fields, changes, list) {
    //        // add in any editable fields values that are required or unique
    //        // so that server can validate them if they were created before
    //        // the field's constraint was made. so modifying a record
    //        // via patch will check those fields for validity even if the user
    //        // didn't edit the value
    //        if (_fields) {
    //            _fields.forEach((field) => {
    //                if (changes[field.id] === undefined) {
    //                    if (!field.builtIn && (field.required || field.unique)) {
    //                        if (_pendEdits.originalRecord && _pendEdits.originalRecord.fids && _pendEdits.originalRecord.fids[field.id]) {
    //                            let newValue = _pendEdits.originalRecord.fids[field.id].value;
    //                            if (newValue === null) {
    //                                newValue = "";
    //                            }
    //                            let newDisplay = _pendEdits.originalRecord.fids[field.id].display;
    //                            createColChange(newValue, newDisplay, field, list);
    //                        }
    //                    }
    //                }
    //            });
    //        }
    //    }
    //
    //    function getChanges(_pendEdits, _fields) {
    //        // get the current edited data
    //        let changes = {};
    //        if (_pendEdits.recordChanges) {
    //            changes = _.cloneDeep(_pendEdits.recordChanges);
    //        }
    //
    //
    //        //calls action to save the record changes
    //        // validate happen here or in action
    //
    //        let payload = [];
    //        // columns id and new values array
    //        //[{"id":6, "value":"Claire"}]
    //
    //
    //        Object.keys(changes).forEach((key) => {
    //            let newValue = changes[key].newVal.value;
    //            let newDisplay = changes[key].newVal.display;
    //            if (_.has(_pendEdits, 'originalRecord.fids')) {
    //                if (newValue !== _pendEdits.originalRecord.fids[key].value) {
    //                    //get each columns matching field description
    //                    let matchingField = changes[key].fieldDef;
    //                    createColChange(newValue, newDisplay, matchingField, payload);
    //                }
    //            }
    //        });
    //
    //        getConstrainedUnchangedValues(_pendEdits, _fields, changes, payload);
    //        return payload;
    //    }
    //    // promise is returned in support of unit testing only
    //    return new Promise((resolve, reject) => {
    //        if (appId && tblId && (!!(recId === 0 || recId)) && pendEdits && fields) {
    //            let changes = getChanges(pendEdits, fields);
    //            this.dispatch(actions.SAVE_REPORT_RECORD, {appId, tblId, recId, changes});
    //            let recordService = new RecordService();
    //
    //            //  save the changes to the record
    //            recordService.saveRecord(appId, tblId, recId, changes).then(
    //                response => {
    //                    logger.debug('RecordService saveRecord success');
    //                    let clist = colList ? colList : [];
    //                    if (!clist.length && fields) {
    //                        fields.forEach((field) => {
    //                            clist.push(field.id);
    //                        });
    //                    }
    //                    clist = clist.join('.');
    //                    this.dispatch(actions.GET_RECORD, {appId, tblId, recId, clist: clist});
    //                    recordService.getRecord(appId, tblId, recId, clist, _withDisplayFormat()).then(
    //                        getResponse => {
    //                            logger.debug('RecordService getRecord success');
    //                            //  flux action to update recordPendingEditsStore AND reportDataStore..to be removed
    //                            this.dispatch(actions.SAVE_RECORD_SUCCESS, {appId, tblId, recId, record: getResponse.data});
    //                            if (!showNotificationOnSuccess) {
    //                                NotificationManager.success(Locale.getMessage('recordNotifications.recordSaved'), Locale.getMessage('success'),
    //                                    CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
    //                            }
    //                            // this delay allows for saving modal to trap inputs otherwise
    //                            // clicks get invoked after saving
    //                            Promise.delay(PRE_REQ_DELAY_MS).then(() => {
    //                                this.dispatch(actions.AFTER_RECORD_EDIT);
    //                                let obj = {
    //                                    recId:recId,
    //                                    appId:appId,
    //                                    tblId:tblId,
    //                                    record:getResponse.data
    //                                };
    //                                resolve(obj);
    //                            });
    //                        },
    //                        getError => {
    //                            logger.parseAndLogError(LogLevel.ERROR, getError.response, 'recordService.getRecord:');
    //                            // dispatch the GET_RECORD_FAILED. This is not being acted upon right now in any of the stores
    //                            this.dispatch(actions.GET_RECORD_FAILED, {appId, tblId, recId, error: getError.response});
    //                            // this delay allows for saving modal to trap inputs otherwise
    //                            // clicks get invoked after saving
    //                            Promise.delay(PRE_REQ_DELAY_MS).then(() => {
    //                                this.dispatch(actions.AFTER_RECORD_EDIT);
    //                                reject();
    //                            });
    //                        }
    //                    );
    //                },
    //                error => {
    //                    //  if a validation error, print each one individually..
    //                    if (error && error.data && error.data.response && error.data.response.errors) {
    //                        let errors = error.data.response.errors;
    //                        _logValidationErrors(errors, 'recordService.saveRecord');
    //                    } else {
    //                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'recordService.saveRecord');
    //                    }
    //
    //                    this.dispatch(actions.SAVE_RECORD_FAILED, {appId, tblId, recId, changes, error: error});
    //                    NotificationManager.error(Locale.getMessage('recordNotifications.recordNotSaved'), Locale.getMessage('failed'),
    //                        CompConsts.NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);
    //                        // this delay allows for saving modal to trap inputs otherwise
    //                        // clicks get invoked after saving
    //                    Promise.delay(PRE_REQ_DELAY_MS).then(() => {
    //                        this.dispatch(actions.AFTER_RECORD_EDIT);
    //                        reject();
    //                    });
    //                }
    //            );
    //        } else {
    //            var errMessage = 'Missing one or more required input parameters to recordActions.saveRecord. AppId:' +
    //                appId + '; TblId:' + tblId + '; recId:' + recId + '; pendEdits:' + JSON.stringify(pendEdits) + '; fields:' + fields;
    //            logger.error(errMessage);
    //            this.dispatch(actions.SAVE_RECORD_FAILED, {error: errMessage});
    //            reject();
    //        }
    //    });
    //}
};

//  NEW REDUX ACTIONS BELOW>>>

/**
 * Construct a record store payload
 *
 * @param type - event type
 * @param content - optional content related to event type
 * @returns {{id: *, type: *, content: *}}
 */
function event(id, type, content) {
    return {
        id: id,
        type: type,
        content: content || null
    };
}

function createEditRecordEventObject(appId, tblId, recId, origRec, changes, isInlineEdit, fieldToStartEditing) {
    return {
        appId,
        tblId,
        recId,
        origRec,
        changes,
        isInlineEdit,
        fieldToStartEditing
    };
}

/**
 * Open a record for view or edit.  This will set the current record, previous and
 * next record for navigation when viewing/editing record detail
 *
 * @param recId
 * @param nextRecordId
 * @param previousRecordId
 * @returns {{id, type, content}|{id: *, type: *, content: *}}
 */
export const openRecord = (recId, nextRecordId, previousRecordId) => {
    return event(recId, types.OPEN_RECORD, {recId, nextRecordId, previousRecordId});
};

/**
 * Action called when initiating inline edit of a record from the grid.
 *
 * @param appId
 * @param tblId
 * @param recId
 * @param origRec
 * @param changes
 * @param isInlineEdit
 * @param fieldToStartEditing
 * @returns {{id, type, content}|{id: *, type: *, content: *}}
 */
export const editRecordStart = (appId, tblId, recId, origRec, changes, isInlineEdit, fieldToStartEditing) => {
    //let model = new RecordModel();
    let obj = createEditRecordEventObject(appId, tblId, recId, origRec, changes, isInlineEdit, fieldToStartEditing);
    //model.setEditRecordStart(appId, tblId, recId, obj);
    //return event(recId, types.EDIT_RECORD_START, model.get());
    return event(recId, types.EDIT_RECORD_START, obj);
};

/**
 * Action called when inline editing a record and changing a field element.
 *
 * @param appId
 * @param tblId
 * @param recId
 * @param origRec
 * @param changes
 * @returns {{id, type, content}|{id: *, type: *, content: *}}
 */
export const editRecordChange = (appId, tblId, recId, origRec, changes) => {
    //let model = new RecordModel();
    //model.setEditRecordChange(appId, tblId, recId, origRec, changes);
    //return event(recId, types.EDIT_RECORD_CHANGE, model.get());
    //let model = new RecordModel();
    //model.setEditRecordChange(appId, tblId, recId, origRec, changes);
    let obj = createEditRecordEventObject(appId, tblId, recId, origRec, changes, true, null);
    return event(recId, types.EDIT_RECORD_CHANGE, obj);
};

/**
 * Cancel inline edit of record
 *
 * @param appId
 * @param tblId
 * @param recId
 * @returns {{id, type, content}|{id: *, type: *, content: *}}
 */
export const editRecordCancel = (appId, tblId, recId) => {
    //let model = new RecordModel();
    //model.setEditRecordCancel();
    //return event(recId, types.EDIT_RECORD_CANCEL, model.get());
    return event(recId, types.EDIT_RECORD_CANCEL, {appId, tblId, recId});
};

/**
 * Commit/save changes made to a record from inline edit
 *
 * @param appId
 * @param tblId
 * @param recId
 * @returns {{id, type, content}|{id: *, type: *, content: *}}
 */
// TODO: REMOVE..not using
//export const editRecordCommit = (appId, tblId, recId) => {
//    return event(recId, types.EDIT_RECORD_COMMIT, {appId, tblId, recId});
//};


/**
 * Validates a record when inline editing
 *
 * @param recId
 * @param fieldDef
 * @param fieldLabel
 * @param value
 * @param checkRequired
 * @returns {{id, type, content}|{id: *, type: *, content: *}}
 */
export const editRecordValidateField = (recId, fieldDef, fieldLabel, value, checkRequired) => {
    return event(recId, types.EDIT_RECORD_VALIDATE_FIELD, {recId, fieldDef, fieldLabel, value, checkRequired});
};

/**
 * delete records in bulk
 */
export const deleteRecords = (appId, tblId, recIds, nameForRecords) => {
    return (dispatch) => {
        // we're returning a promise to the caller (not a Redux action) since this is an async action
        // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)
        return new Promise((resolve, reject) => {
            if (appId && tblId && recIds && recIds.length >= 1) {
                //this.dispatch(actions.DELETE_RECORD_BULK, {appId, tblId, recIds});
                dispatch(event(recIds[0], types.DELETE_RECORDS, {appId, tblId, recIds}));

                let recordService = new RecordService();

                //delete the records
                //recordService.deleteRecordBulk(appId, tblId, recIds).then(
                recordService.deleteRecords(appId, tblId, recIds).then(
                    response => {
                        logger.debug('RecordService deleteRecordBulk success');
                        //this.dispatch(actions.DELETE_RECORD_BULK_SUCCESS, recIds);
                        dispatch(event(recIds[0], types.REMOVE_REPORT_RECORDS, {appId, tblId, recIds}));

                        //  send out notification message on the client
                        let message = recIds.length === 1 ? (`1 ${nameForRecords} ${Locale.getMessage('recordNotifications.deleted')}`) : (`${recIds.length} ${nameForRecords} ${Locale.getMessage('recordNotifications.deleted')}`);
                        NotificationManager.success(message, Locale.getMessage('success'), CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);

                        // the delay allows for saving modal to trap inputs otherwise clicks get invoked after delete
                        Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                            //this.dispatch(actions.AFTER_RECORD_EDIT);
                            dispatch(event(recIds[0], types.DELETE_RECORDS_COMPLETE, {appId, tblId, recIds}));
                            resolve();
                        });
                    },
                    error => {
                        logger.parseAndLogError(LogLevel.ERROR, error, 'recordService.deleteRecords:');
                        //this.dispatch(actions.DELETE_RECORDS_ERROR, {appId, tblId, recIds, error: error});

                        //  TODO:  the error object should map to specific records
                        let errors = [];
                        if (_.has(error, 'data.response.errors')) {
                            errors = error.data.response.errors || [];
                        }
                        dispatch(event(recIds[0], types.DELETE_RECORDS_ERROR, {appId, tblId, recIds, errors}));

                        //  send out notification message
                        let message = recIds.length === 1 ? (`1 ${nameForRecords} ${Locale.getMessage('recordNotifications.notDeleted')}`) : (`${recIds.length} ${nameForRecords} ${Locale.getMessage('recordNotifications.notDeleted')}`);
                        NotificationManager.error(message, Locale.getMessage('failed'), CompConsts.NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);

                        // the delay allows for saving modal to trap inputs otherwise clicks get invoked after delete
                        Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                            //this.dispatch(actions.AFTER_RECORD_EDIT);
                            dispatch(event(recIds[0], types.DELETE_RECORDS_COMPLETE, {appId, tblId, recIds}));
                            reject();
                        });
                    }
                );
            } else {
                logger.error(`Missing one or more required input parameters to recordActions.deleteRecords. AppId:${appId}; TblId:/${tblId}; RecId${recIds}`);
                dispatch(event(recIds[0], types.DELETE_RECORDS_ERROR, {appId, tblId, recIds}));

                //  send out notification message
                let message = recIds.length === 1 ? (`1 ${nameForRecords} ${Locale.getMessage('recordNotifications.deleted')}`) : (`${recIds.length} ${nameForRecords} ${Locale.getMessage('recordNotifications.deleted')}`);
                NotificationManager.error(message, Locale.getMessage('failed'), CompConsts.NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);
                reject();
            }
        });
    };
};

export const deleteRecord = (appId, tblId, recId, nameForRecords) => {
    return deleteRecords(appId, tblId, [recId], nameForRecords);
};

/**
 * Create a new record
 *
 * @param appId
 * @param tblId
 * @param params
 *    context - is the record added in a report context
 *    recordChanges - new record
 *    fields
 *    colList
 *    showNotificationOnSuccess
 * @returns {Function}
 */
export const createRecord = (appId, tblId, params = {}) => {
    function formatRecordChanges(_recordChanges) {
        //save changes in record
        let payload = [];
        // columns id and new values array
        //[{"id":6, "value":"Claire", fieldDef:{}}]
        if (_recordChanges) {
            Object.keys(_recordChanges).forEach((recKey) => {
                //get each columns matching field description
                if (_recordChanges[recKey]) {
                    let matchingField = _recordChanges[recKey].fieldDef;

                    // only post the non built in fields values
                    if (matchingField && matchingField.builtIn === false) {
                        let newValue = _recordChanges[recKey].newVal.value;
                        let newDisplay = _recordChanges[recKey].newVal.display;

                        let colChange = {};
                        colChange.fieldName = _recordChanges[recKey].fieldName;
                        colChange.id = +recKey;
                        colChange.value = _.cloneDeep(newValue);
                        colChange.display = _.cloneDeep(newDisplay);
                        colChange.fieldDef = matchingField;
                        payload.push(colChange);
                    }
                }
            });
        }
        return payload;
    }

    return (dispatch) => {
        // promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            let changes = params.recordChanges;
            let record = formatRecordChanges(changes);
            let recId = UrlConsts.NEW_RECORD_VALUE;

            if (appId && tblId && record && params.fields) {
                //this.dispatch(actions.ADD_RECORD, {appId, tblId, changes});
                dispatch(event(recId, types.SAVE_RECORD, {appId, tblId, recId, changes}));

                let recordService = new RecordService();

                // save the changes to the record
                recordService.createRecord(appId, tblId, record).then(
                    response => {
                        logger.debug('RecordService createRecord success');
                        if (response !== undefined && response.data !== undefined && response.data.body !== undefined) {
                            let resJson = JSON.parse(response.data.body);
                            if (resJson.id) {
                                //normally getRecord will only return default columns for the table. so pass in clist for all of report's columns
                                let clist = params.colList ? params.colList : [];
                                if (!clist.length && params.fields) {
                                    params.fields.forEach((field) => {
                                        clist.push(field.id);
                                    });
                                }
                                clist = clist.join('.');
                                //no listener
                                //this.dispatch(actions.GET_RECORD, {appId, tblId, recId: resJson.id, clist: clist});
                                recordService.getRecord(appId, tblId, resJson.id, clist, _withDisplayFormat()).then(
                                    getResponse => {
                                        logger.debug('RecordService getRecord success');
                                        //this.dispatch(actions.ADD_RECORD_SUCCESS, {
                                        //    appId,
                                        //    tblId,
                                        //    record: getResponse.data,
                                        //    recId: resJson.id
                                        //});
                                        // TODO: fix context
                                        let report = {
                                            context: 'NAV',
                                            recId:recId,
                                            newRecId: resJson.id,
                                            record:getResponse.data
                                        };
                                        dispatch(event(recId, types.SAVE_RECORD_SUCCESS, {appId, tblId, recId, report}));

                                        if (params.showNotificationOnSuccess) {
                                            NotificationManager.success(Locale.getMessage('recordNotifications.recordAdded'), Locale.getMessage('success'),
                                                CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
                                        }
                                        // this tiny delay allows for saving modal to trap inputs otherwise
                                        // clicks get queued till after creating
                                        Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                                            //this.dispatch(actions.AFTER_RECORD_EDIT);
                                            dispatch(event(recId, types.SAVE_RECORD_COMPLETE, {appId, tblId, recId}));
                                            let obj = {
                                                recId:resJson.id,
                                                appId:appId,
                                                tblId:tblId,
                                                record:getResponse.data
                                            };
                                            resolve(obj);
                                        });
                                    },
                                    getError => {
                                        logger.parseAndLogError(LogLevel.ERROR, getError.response, 'recordService.getRecord:');
                                        // dispatch the GET_RECORD_FAILED. This is not being acted upon right now in any of the stores
                                        //this.dispatch(actions.GET_RECORD_FAILED, {
                                        //    appId,
                                        //    tblId,
                                        //    recId,
                                        //    error: getError.response
                                        //});
                                        let errors = [];
                                        if (_.has(getError, 'data.response.errors')) {
                                            errors = getError.data.response.errors || [];
                                        }
                                        dispatch(event(recId, types.SAVE_RECORD_ERROR, {appId, tblId, recId, errors}));

                                        // this tiny delay allows for saving modal to trap inputs otherwise
                                        // clicks get queued till after creating
                                        Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                                            //this.dispatch(actions.AFTER_RECORD_EDIT);
                                            dispatch(event(recId, types.SAVE_RECORD_COMPLETE, {appId, tblId, recId}));
                                            reject();
                                        });
                                    }
                                );
                            }
                        } else {
                            logger.error('RecordService createRecord call error: no response data value returned');
                            //this.dispatch(actions.ADD_RECORD_FAILED, {
                            //    appId,
                            //    tblId,
                            //    record,
                            //    error: new Error('no response data member')
                            //});
                            let errors = [{id:1, def:{fieldName:'No response'}, isInvalid:true, txt:'No data object return by server'}];
                            dispatch(event(recId, types.SAVE_RECORD_ERROR, {appId, tblId, recId, errors}));

                            // this delay allows for saving modal to trap inputs otherwise
                            // clicks get invoked after create
                            Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                                //this.dispatch(actions.AFTER_RECORD_EDIT);
                                dispatch(event(recId, types.SAVE_RECORD_COMPLETE, {appId, tblId, recId}));
                                reject();
                            });
                        }
                    },
                    error => {
                        //  if a validation error, print each one individually..
                        if (error && error.data && error.data.response && error.data.response.errors) {
                            let errors = error.data.response.errors;
                            _logValidationErrors(errors, 'recordService.createRecord');
                        } else {
                            logger.parseAndLogError(LogLevel.ERROR, error.response, 'recordService.createRecord');
                        }

                        //this.dispatch(actions.ADD_RECORD_FAILED, {appId, tblId, record, error: error});
                        let errors = [];
                        if (_.has(error, 'data.response.errors')) {
                            errors = error.data.response.errors || [];
                        }
                        dispatch(event(recId, types.SAVE_RECORD_ERROR, {appId, tblId, recId, errors}));

                        let errStatus = error.response ? error.response.status : null;
                        if (errStatus === 403) {
                            NotificationManager.error(Locale.getMessage('recordNotifications.error.403'), Locale.getMessage('failed'),
                                CompConsts.NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);
                        }
                        if (errStatus === 500 && _.has(error.response, 'data.response.status')) {
                            const {status} = error.response.data.response;
                            if (status !== 422) {
                                // HTTP data response status 422 means server "validation error" under the general HTTP 500 error
                                NotificationManager.error(Locale.getMessage('recordNotifications.error.500'), Locale.getMessage('failed'),
                                    CompConsts.NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);
                            }
                        }
                        // this delay allows for saving modal to trap inputs otherwise
                        // clicks get invoked after create
                        Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                            //this.dispatch(actions.AFTER_RECORD_EDIT);
                            dispatch(event(recId, types.SAVE_RECORD_COMPLETE, {appId, tblId, recId}));
                            reject();
                        });
                    }
                );

            } else {
                var errMessage = 'Missing one or more required input parameters to recordActions.addRecord. AppId:' +
                    appId + '; TblId:' + tblId + '; changes:' + JSON.stringify(changes) + '; fields:' + JSON.stringify(params.fields);
                logger.error(errMessage);
                //this.dispatch(actions.ADD_RECORD_FAILED, {error: errMessage});
                dispatch(event(recId, types.SAVE_RECORD_ERROR, {appId, tblId, recId}));
                reject();
            }
        });
    };
};

/**
 * Save changes to an existing record.
 * On successful save get a copy of updated record from server that is passed to the caller
 *
 * @param appId
 * @param tblId
 * @param recId
 * @param params
 *   context - is the record update in the context of a report
 *   pendEdits - any pending edits
 *   fields
 *   colList - optional list of fids to query for getRecord call.
 *   showNotificationOnSuccess - true to show success notification.
 */
export const updateRecord = (appId, tblId, recId, params = {}) => {
    function createColChange(value, display, field, payload) {
        let colChange = {};
        colChange.fieldName = field.name;
        colChange.id = +field.id;     //the + before field.id is needed to turn field id from string into a number
        colChange.value = _.cloneDeep(value);
        colChange.display = _.cloneDeep(display);
        colChange.fieldDef = field;
        payload.push(colChange);
    }

    function getConstrainedUnchangedValues(_pendEdits, _fields, changes, list) {
        // add in any editable fields values that are required or unique so that server can validate them if they
        // were created before the field's constraint was made. So modifying a record via patch will check those
        // fields for validity even if the user didn't edit the value.
        if (_fields) {
            _fields.forEach((field) => {
                if (changes[field.id] === undefined) {
                    if (!field.builtIn && (field.required || field.unique)) {
                        if (_pendEdits.originalRecord && _pendEdits.originalRecord.fids && _pendEdits.originalRecord.fids[field.id]) {
                            let newValue = _pendEdits.originalRecord.fids[field.id].value;
                            if (newValue === null) {
                                newValue = "";
                            }
                            let newDisplay = _pendEdits.originalRecord.fids[field.id].display;
                            createColChange(newValue, newDisplay, field, list);
                        }
                    }
                }
            });
        }
    }

    function getChanges(_pendEdits, _fields) {
        // get the current edited data
        let changes = {};
        if (_pendEdits.recordChanges) {
            changes = _.cloneDeep(_pendEdits.recordChanges);
        }

        let payload = [];
        Object.keys(changes).forEach((key) => {
            if (changes[key].newVal) {
                let newValue = changes[key].newVal.value;
                let newDisplay = changes[key].newVal.display;
                if (_.has(_pendEdits, 'originalRecord.fids')) {
                    if (_pendEdits.originalRecord.fids.hasOwnProperty(key)) {
                        if (newValue !== _pendEdits.originalRecord.fids[key].value) {
                            //get each columns matching field description
                            let matchingField = changes[key].fieldDef;
                            createColChange(newValue, newDisplay, matchingField, payload);
                        }
                    }
                }
            }
        });

        getConstrainedUnchangedValues(_pendEdits, _fields, changes, payload);
        return payload;
    }


    return (dispatch) => {
        // we're returning a promise to the caller (not a Redux action) since this is an async action
        // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)
        return new Promise((resolve, reject) => {
            if (appId && tblId && (!!(recId === 0 || recId)) && params.pendEdits && params.fields) {

                let changes = getChanges(params.pendEdits, params.fields);
                //this.dispatch(actions.SAVE_REPORT_RECORD, {appId, tblId, recId, changes});
                dispatch(event(recId, types.SAVE_RECORD, {appId, tblId, recId, changes}));
                let recordService = new RecordService();

                //  save the changes to the record
                recordService.saveRecord(appId, tblId, recId, changes).then(
                    response => {
                        logger.debug('RecordService saveRecord success');

                        let clist = params.colList ? params.colList : [];
                        if (!clist.length) {
                            params.fields.forEach((field) => {
                                clist.push(field.id);
                            });
                        }
                        clist = clist.join('.');
                        // NO Listener..
                        //this.dispatch(actions.GET_RECORD, {appId, tblId, recId, clist: clist});

                        recordService.getRecord(appId, tblId, recId, clist, _withDisplayFormat()).then(
                            getResponse => {
                                logger.debug('RecordService getRecord success');
                                //  flux action to update recordPendingEditsStore AND reportDataStore..to be removed
                                //this.dispatch(actions.SAVE_RECORD_SUCCESS, {appId, tblId, recId, record: getResponse.data});
                                //dispatch(event(recId, types.SAVE_RECORD_SUCCESS, {appId, tblId, recId}));
                                let report = {
                                    context: params.context,
                                    recId:recId,
                                    record:getResponse.data
                                };
                                dispatch(event(recId, types.SAVE_RECORD_SUCCESS, {appId, tblId, recId, report}));
                                //TODO look at have SAVE_RECORD_SUCCESS in Report store to update report...will need to supply
                                // content of the record save so that we know which store updates...if done, can remove resolve(obj)..
                                if (params.showNotificationOnSuccess) {
                                    NotificationManager.success(Locale.getMessage('recordNotifications.recordSaved'), Locale.getMessage('success'),
                                        CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
                                }

                                // delay the response object so that the state gets updated with success settings
                                Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                                    //this.dispatch(actions.AFTER_RECORD_EDIT);
                                    //dispatch(event(recId, types.SAVE_RECORD_COMPLETE, {appId, tblId, recId}));
                                    let obj = {
                                        recId:recId,
                                        appId:appId,
                                        tblId:tblId,
                                        record:getResponse.data
                                    };
                                    resolve(obj);
                                });
                            },
                            getError => {
                                logger.parseAndLogError(LogLevel.ERROR, getError.response, 'recordService.getRecord:');
                                // dispatch the GET_RECORD_FAILED. This is not being acted upon right now in any of the stores
                                //this.dispatch(actions.GET_RECORD_FAILED, {appId, tblId, recId, error: getError.response});
                                let errors = [];
                                if (_.has(getError, 'data.response.errors')) {
                                    errors = getError.data.response.errors || [];
                                }
                                dispatch(event(recId, types.SAVE_RECORD_ERROR, {appId, tblId, recId, errors: errors}));
                                // this delay allows for saving modal to trap inputs otherwise clicks get invoked and error message
                                // icon in action column does not render.
                                Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                                    //dispatch(event(recId, types.SAVE_RECORD_COMPLETE, {appId, tblId, recId}));
                                    reject();
                                });
                            }
                        );
                    },
                    error => {
                        //  if a validation error, print each one individually..
                        if (error && error.data && error.data.response && error.data.response.errors) {
                            let errors = error.data.response.errors;
                            _logValidationErrors(errors, 'recordService.saveRecord');
                        } else {
                            logger.parseAndLogError(LogLevel.ERROR, error.response, 'recordService.saveRecord');
                        }

                        //this.dispatch(actions.SAVE_RECORD_FAILED, {appId, tblId, recId, changes, error: error});
                        let errors = [];
                        if (_.has(error, 'data.response.errors')) {
                            errors = error.data.response.errors || [];
                        }
                        dispatch(event(recId, types.SAVE_RECORD_ERROR, {appId, tblId, recId, errors: errors}));
                        NotificationManager.error(Locale.getMessage('recordNotifications.recordNotSaved'), Locale.getMessage('failed'),
                            CompConsts.NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);
                        // this delay allows for saving modal to trap inputs otherwise clicks get invoked and error message
                        // icon in action column does not render.
                        Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                            //dispatch(event(recId, types.SAVE_RECORD_COMPLETE, {appId, tblId, recId}));
                            reject();
                        });
                    }
                );
            } else {
                var errMessage = 'Missing one or more required input parameters to recordActions.updateRecord. AppId:' +
                    appId + '; TblId:' + tblId + '; recId:' + recId + '; pendEdits:' + JSON.stringify(params.pendEdits) + '; fields:' + params.fields;
                logger.error(errMessage);
                //this.dispatch(actions.SAVE_RECORD_FAILED, {error: errMessage});
                dispatch(event(recId, types.SAVE_RECORD_ERROR, {appId, tblId, recId}));
                reject();
            }
        });
    };
};

export default recordActions;

