
/**
 * Any actions related to Record model are defined here. This is responsible for making calls to Node layer api based on the action.
 */

import RecordService from '../services/recordService';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';
import Promise from 'bluebird';
import Locale from '../locales/locales';
import _ from 'lodash';
import {NotificationManager} from 'react-notifications';
import {NOTIFICATION_MESSAGE_DISMISS_TIME, NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME} from '../../../reuse/client/src/scripts/notificationManager';
import {NEW_TABLE_IDS_KEY} from '../constants/localStorage';
import * as query from '../constants/query';
import * as SchemaConstants from "../constants/schema";
import * as types from '../actions/types';

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
            // log validation errors at info level
            logger.parseAndLogError(LogLevel.INFO, {data:errorObj}, msgPrefix);
        });
    }
}

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
 * @param viewContextId the context for this action such as "VIEW" or "DRAWER"
 * @returns {{id, type, content}|{id: *, type: *, content: *}}
 */
export const openRecord = (recId, nextRecordId, previousRecordId, viewContextId) => {
    viewContextId = viewContextId || recId;
    return event(viewContextId, types.OPEN_RECORD, {recId, nextRecordId, previousRecordId});
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
    let obj = createEditRecordEventObject(appId, tblId, recId, origRec, changes, isInlineEdit, fieldToStartEditing);
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
    let obj = createEditRecordEventObject(appId, tblId, recId, origRec, changes, false, null);
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
    return event(recId, types.EDIT_RECORD_CANCEL, {appId, tblId, recId});
};

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
 * Delete a list of records from a table
 *
 * @param appId
 * @param tblId
 * @param recIds
 * @param nameForRecords
 * @returns {Function}
 */
export const deleteRecords = (appId, tblId, recIds, nameForRecords) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            if (appId && tblId && (Array.isArray(recIds) && recIds.length > 0)) {
                dispatch(event(recIds[0], types.DELETE_RECORDS, {appId, tblId, recIds}));

                let recordService = new RecordService();
                recordService.deleteRecords(appId, tblId, recIds).then(
                    response => {
                        logger.debug('RecordService deleteRecords success');
                        dispatch(event(recIds[0], types.REMOVE_REPORT_RECORDS, {appId, tblId, recIds}));

                        //  send out notification message on the client
                        let message = Locale.getPluralizedMessage('recordNotifications.deleted', {value: recIds.length, nameForRecord: ''});
                        NotificationManager.success(message, Locale.getMessage('success'), NOTIFICATION_MESSAGE_DISMISS_TIME);

                        // the delay allows for saving modal to trap inputs otherwise clicks get invoked after delete
                        Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                            dispatch(event(recIds[0], types.DELETE_RECORDS_COMPLETE, {appId, tblId, recIds}));
                            resolve();
                        });
                    },
                    error => {
                        logger.parseAndLogError(LogLevel.ERROR, error, 'recordService.deleteRecords:');

                        let errors = [];
                        if (_.has(error, 'data.response.errors')) {
                            errors = error.data.response.errors || [];
                        }
                        dispatch(event(recIds[0], types.DELETE_RECORDS_ERROR, {appId, tblId, recIds, errors}));

                        //  send out notification message
                        let message = `${recIds.length} ${nameForRecords} ${Locale.getMessage('recordNotifications.notDeleted')}`;
                        NotificationManager.error(message, Locale.getMessage('failed'), NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);

                        // the delay allows for saving modal to trap inputs otherwise clicks get invoked after delete
                        Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                            dispatch(event(recIds[0], types.DELETE_RECORDS_COMPLETE, {appId, tblId, recIds}));
                            reject();
                        });
                    }
                );
            } else {
                logger.error(`Missing one or more required input parameters to recordActions.deleteRecords. AppId:${appId}; TblId:${tblId}; RecId${recIds}`);
                let message = `0 ${nameForRecords} ${Locale.getMessage('recordNotifications.notDeleted')}`;
                NotificationManager.error(message, Locale.getMessage('failed'), NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);
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
    function formatRecordChanges(_recordChanges, fields) {
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

            //  add any fields not included in the recordChanges list to the payload that is sent
            //  to the server.  This means we check all fields(minus built-ins) for validity
            //  even if the user didn't explicitly enter a value.
            if (fields) {
                fields.forEach((field) => {
                    if (_recordChanges[field.id] === undefined) {
                        if (!field.builtIn) {
                            let colChange = {};
                            colChange.fieldName = field.name;
                            colChange.id = +field.id;     //the + before field.id is needed to turn field id from string into a number
                            colChange.value = '';
                            colChange.display = '';
                            colChange.fieldDef = field;
                            payload.push(colChange);
                        }
                    }
                });
            }
        }
        return payload;
    }

    return (dispatch) => {
        // promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {

            let changes = params.recordChanges;
            let fields = params.fields;

            if (appId && tblId && fields) {
                let record = formatRecordChanges(changes, fields);
                let recId = SchemaConstants.UNSAVED_RECORD_ID;

                dispatch(event(recId, types.SAVE_RECORD, {appId, tblId, recId, changes}));

                let recordService = new RecordService();
                recordService.createRecord(appId, tblId, record).then(
                    response => {

                        // when a record has been added, stop showing the new table UI
                        // since the records array may be empty due to loading, empty filtering etc...
                        if (window.sessionStorage) {
                            let newTables = window.sessionStorage.getItem(NEW_TABLE_IDS_KEY);
                            let tableIds = newTables ? newTables.split(",") : [];

                            if (tableIds.indexOf(tblId) !== -1) {
                                _.pull(tableIds, tblId);
                                window.sessionStorage.setItem(NEW_TABLE_IDS_KEY, tableIds.join(","));
                            }
                        }

                        logger.debug('RecordService createRecord success');
                        let resJson = _.has(response, 'data.body') ? JSON.parse(response.data.body) : {};

                        // normally getRecord will only return default columns for the table, so
                        // pass in clist for all of report's columns.
                        let clist = params.colList ? params.colList : [];
                        if (!clist.length && params.fields) {
                            params.fields.forEach((field) => {
                                clist.push(field.id);
                            });
                        }
                        clist = clist.join('.');
                        recordService.getRecord(appId, tblId, resJson.id, clist, _withDisplayFormat()).then(
                            getResponse => {
                                logger.debug('RecordService getRecord success');
                                // TODO: fix context
                                let report = {
                                    context: 'NAV',
                                    recId:recId,
                                    newRecId: resJson.id,
                                    record:getResponse.data
                                };

                                // is this an inline edit save and we want to add a new row in the grid
                                const addNewRow = params.addNewRow || false;
                                dispatch(event(recId, types.SAVE_RECORD_SUCCESS, {appId, tblId, recId, report, addNewRow}));

                                if (params.showNotificationOnSuccess) {
                                    NotificationManager.success(Locale.getMessage('recordNotifications.recordAdded'), Locale.getMessage('success'),
                                        NOTIFICATION_MESSAGE_DISMISS_TIME);
                                }

                                // this tiny delay allows for saving modal to trap inputs otherwise
                                // clicks get queued till after creating
                                Promise.delay(PRE_REQ_DELAY_MS).then(() => {
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
                                let errors = [];
                                if (_.has(getError, 'data.response.errors')) {
                                    errors = getError.data.response.errors || [];
                                }
                                dispatch(event(recId, types.SAVE_RECORD_ERROR, {appId, tblId, recId, errors}));

                                NotificationManager.error(Locale.getMessage('recordNotifications.recordNotSaved'), Locale.getMessage('failed'),
                                    NOTIFICATION_MESSAGE_DISMISS_TIME);

                                // this tiny delay allows for saving modal to trap inputs otherwise
                                // clicks get queued till after creating
                                Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                                    dispatch(event(recId, types.SAVE_RECORD_COMPLETE, {appId, tblId, recId}));
                                    reject();
                                });
                            }
                        );
                    },
                    error => {
                        let errors = [];
                        if (_.has(error, 'data.response.errors')) {
                            errors = error.data.response.errors || [];
                        }

                        //  if a validation error, print each one individually..
                        if (errors.length > 0) {
                            _logValidationErrors(errors, 'recordService.createRecord');
                        } else {
                            logger.parseAndLogError(LogLevel.ERROR, error.response, 'recordService.createRecord');
                        }

                        dispatch(event(recId, types.SAVE_RECORD_ERROR, {appId, tblId, recId, errors}));

                        let errStatus = error.response ? error.response.status : null;
                        if (errStatus === 403) {
                            NotificationManager.error(Locale.getMessage('recordNotifications.error.403'), Locale.getMessage('failed'),
                                NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);
                        } else {
                            /*eslint no-lonely-if:0 */
                            if (errStatus === 500 && _.has(error.response, 'data.response.status')) {
                                const {status} = error.response.data.response;
                                if (status !== 422) {
                                    // HTTP data response status 422 means server "validation error" under the general HTTP 500 error
                                    NotificationManager.error(Locale.getMessage('recordNotifications.error.500'), Locale.getMessage('failed'),
                                        NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);
                                }
                            } else {
                                //  need to render some message to the user
                                NotificationManager.error(Locale.getMessage('recordNotifications.error.500'), Locale.getMessage('failed'),
                                    NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);
                            }
                        }
                        // this delay allows for saving modal to trap inputs otherwise
                        // clicks get invoked after create
                        Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                            dispatch(event(recId, types.SAVE_RECORD_COMPLETE, {appId, tblId, recId}));
                            reject();
                        });
                    }
                );
            } else {
                var errors = 'Missing one or more required input parameters. AppId:' +
                    appId + '; TblId:' + tblId + '; fields:' + JSON.stringify(params.fields);
                logger.error(errors);
                NotificationManager.error(Locale.getMessage('recordNotifications.recordNotSaved'), Locale.getMessage('failed'),
                    NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);
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

    function getConstrainedUnchangedValues(pendEdits, fields, changes, list) {
        // add in any editable fields values so that the node server can validate any defined field constraint. This
        // means modifying a record via patch will check those fields for validity even if the user didn't edit the value.
        // We what is behavior as a field attribute could of changed (ie: make a field required that previously was not)
        // and it now fails validation.
        if (fields) {
            fields.forEach((field) => {
                if (changes[field.id] === undefined) {
                    if (!field.builtIn) { //} && (field.required || field.unique)) {
                        if (pendEdits.originalRecord && pendEdits.originalRecord.fids && pendEdits.originalRecord.fids[field.id]) {
                            let newValue = pendEdits.originalRecord.fids[field.id].value;
                            if (_.isNil(newValue)) {
                                newValue = '';
                            }
                            let newDisplay = pendEdits.originalRecord.fids[field.id].display;
                            if (_.isNil(newDisplay)) {
                                newDisplay = '';
                            }
                            createColChange(newValue, newDisplay, field, list);
                        }
                    }
                }
            });
        }
    }

    function getChanges(pendEdits, fields) {
        // get the current edited data
        let changes = {};
        if (pendEdits.recordChanges) {
            changes = _.cloneDeep(pendEdits.recordChanges);
        }

        let payload = [];
        Object.keys(changes).forEach((key) => {
            if (changes[key].newVal) {
                let newValue = changes[key].newVal.value;
                let newDisplay = changes[key].newVal.display;
                if (_.has(pendEdits, 'originalRecord.fids')) {
                    if (pendEdits.originalRecord.fids.hasOwnProperty(key)) {
                        if (newValue !== pendEdits.originalRecord.fids[key].value) {
                            let matchingField = _.find(fields, field => field.id === pendEdits.originalRecord.fids[key].id);
                            createColChange(newValue, newDisplay, matchingField, payload);
                        }
                    }
                }
            }
        });

        getConstrainedUnchangedValues(pendEdits, fields, changes, payload);
        return payload;
    }


    return (dispatch) => {
        // we're returning a promise to the caller (not a Redux action) since this is an async action
        // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)
        return new Promise((resolve, reject) => {
            if (appId && tblId && (!!(recId === 0 || recId)) && params.pendEdits && params.fields) {

                let changes = getChanges(params.pendEdits, params.fields);
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

                        recordService.getRecord(appId, tblId, recId, clist, _withDisplayFormat()).then(
                            getResponse => {
                                logger.debug('RecordService getRecord success');
                                let report = {
                                    context: params.context,
                                    recId:recId,
                                    record:getResponse.data
                                };

                                // is this an inline edit save and we want to add a new row in the grid
                                const addNewRow = params.addNewRow || false;
                                dispatch(event(recId, types.SAVE_RECORD_SUCCESS, {appId, tblId, recId, report, addNewRow}));
                                if (params.showNotificationOnSuccess) {
                                    NotificationManager.success(Locale.getMessage('recordNotifications.recordSaved'), Locale.getMessage('success'),
                                        NOTIFICATION_MESSAGE_DISMISS_TIME);
                                }

                                // delay the response object so that the state gets updated with success settings
                                Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                                    dispatch(event(recId, types.SAVE_RECORD_COMPLETE, {appId, tblId, recId}));
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
                                let errors = [];
                                if (_.has(getError, 'data.response.errors')) {
                                    errors = getError.data.response.errors || [];
                                }
                                dispatch(event(recId, types.SAVE_RECORD_ERROR, {appId, tblId, recId, errors: errors}));

                                NotificationManager.error(Locale.getMessage('recordNotifications.recordNotSaved'), Locale.getMessage('failed'),
                                    NOTIFICATION_MESSAGE_DISMISS_TIME);

                                // this delay allows for saving modal to trap inputs otherwise clicks get invoked and error message
                                // icon in action column does not render.
                                Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                                    reject();
                                });
                            }
                        );
                    },
                    error => {
                        let errors = [];
                        if (_.has(error, 'data.response.errors')) {
                            errors = error.data.response.errors || [];
                        }

                        //  if a validation error, print each one individually..
                        if (errors.length > 0) {
                            _logValidationErrors(errors, 'recordService.saveRecord');
                        } else {
                            logger.parseAndLogError(LogLevel.ERROR, error.response, 'recordService.saveRecord');
                        }

                        dispatch(event(recId, types.SAVE_RECORD_ERROR, {appId, tblId, recId, errors: errors}));
                        NotificationManager.error(Locale.getMessage('recordNotifications.recordNotSaved'), Locale.getMessage('failed'),
                            NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);

                        // this delay allows for saving modal to trap inputs otherwise clicks get invoked and error message
                        // icon in action column does not render.
                        Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                            reject();
                        });
                    }
                );
            } else {
                var errMessage = 'Missing one or more required input parameters to recordActions.updateRecord. AppId:' +
                    appId + '; TblId:' + tblId + '; recId:' + recId + '; pendEdits:' + JSON.stringify(params.pendEdits) + '; fields:' + params.fields;
                logger.error(errMessage);

                NotificationManager.error(Locale.getMessage('recordNotifications.recordNotSaved'), Locale.getMessage('failed'),
                    NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);

                reject();
            }
        });
    };
};


/**
 * Add a child record for a parent record with related value
 * @param context
 * @param appId
 * @param tblId
 * @param rptId
 * @param detailFid
 * @param parentValue
 * @returns {{id: *, type: *, content: *}}
 */
export const addChildRecord = (context, appId, tblId, rptId, detailFid, parentValue)=> {
    return event(context, types.ADD_CHILD_RECORD, {appId, tblId, rptId, detailFid, parentValue});
};
