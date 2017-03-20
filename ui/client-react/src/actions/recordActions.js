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
import NotificationManager from '../../../reuse/client/src/scripts/notificationManager';
import * as query from '../constants/query';
import * as UrlConsts from "../constants/urlConstants";

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

let recordActions = {
    /**
     * start editing a new record
     */
    editNewRecord() {
        this.dispatch(actions.EDIT_REPORT_RECORD, {recId:UrlConsts.NEW_RECORD_VALUE});
    },

    /**
     * Action to save a new record. On successful save get a copy of the newly created record from server.
     * @param appId
     * @param tblId
     * @param recordChanges
     * @param fields
     * @param colList - optional list of fids to query for getRecord call.
     * @param showNotificationOnSuccess - true to show success notification.
     */
    saveNewRecord(appId, tblId, recordChanges, fields, colList = [], showNotificationOnSuccess = false) {
        function formatRecordChanges(_recordChanges) {
            //save changes in record
            let payload = [];
            // columns id and new values array
            //[{"id":6, "value":"Claire", fieldDef:{}}]
            if (_recordChanges) {
                Object.keys(_recordChanges).forEach((recKey) => {
                    //get each columns matching field description
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
                });
            }
            return payload;
        }
        // promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            let record = formatRecordChanges(recordChanges);

            if (appId && tblId && record) {
                this.dispatch(actions.ADD_RECORD, {appId, tblId, changes:recordChanges});
                let recordService = new RecordService();

                // save the changes to the record
                recordService.createRecord(appId, tblId, record).then(
                    response => {
                        logger.debug('RecordService createRecord success');
                        if (response !== undefined && response.data !== undefined && response.data.body !== undefined) {
                            let resJson = JSON.parse(response.data.body);
                            if (resJson.id) {
                                //normally getRecord will only return default columns for the table. so pass in clist for all of report's columns
                                let clist = colList ? colList : [];
                                if (!clist.length && fields) {
                                    fields.forEach((field) => {
                                        clist.push(field.id);
                                    });
                                }
                                clist = clist.join('.');
                                this.dispatch(actions.GET_RECORD, {appId, tblId, recId: resJson.id, clist: clist});
                                recordService.getRecord(appId, tblId, resJson.id, clist, _withDisplayFormat()).then(
                                    getResponse => {
                                        logger.debug('RecordService getRecord success');
                                        this.dispatch(actions.ADD_RECORD_SUCCESS, {appId, tblId, record: getResponse.data, recId: resJson.id});

                                        if (!showNotificationOnSuccess) {
                                            NotificationManager.success(Locale.getMessage('recordNotifications.recordAdded'), Locale.getMessage('success'));
                                        }
                                        // this tiny delay allows for saving modal to trap inputs otherwise
                                        // clicks get queued till after creating
                                        Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                                            this.dispatch(actions.AFTER_RECORD_EDIT);
                                            resolve(resJson.id);
                                        });
                                    },
                                    getError => {
                                        logger.parseAndLogError(LogLevel.ERROR, getError.response, 'recordService.getRecord:');
                                        // dispatch the GET_RECORD_FAILED. This is not being acted upon right now in any of the stores
                                        this.dispatch(actions.GET_RECORD_FAILED, {appId, tblId, recId, error: getError.response});
                                        // this tiny delay allows for saving modal to trap inputs otherwise
                                        // clicks get queued till after creating
                                        Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                                            this.dispatch(actions.AFTER_RECORD_EDIT);
                                            reject();
                                        });
                                    }
                                );
                            }
                        } else {
                            logger.error('RecordService createRecord call error: no response data value returned');
                            this.dispatch(actions.ADD_RECORD_FAILED, {appId, tblId, record, error: new Error('no response data member')});
                            // this delay allows for saving modal to trap inputs otherwise
                            // clicks get invoked after create
                            Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                                this.dispatch(actions.AFTER_RECORD_EDIT);
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

                        this.dispatch(actions.ADD_RECORD_FAILED, {appId, tblId, record, error: error});
                        if (error.response.status === 403) {
                            NotificationManager.error(Locale.getMessage('recordNotifications.error.403'), Locale.getMessage('failed'));
                        }
                        if (error.response.status === 500 && _.has(error.response, 'data.response.status')) {
                            const {status} = error.response.data.response;
                            if (status !== 422) {
                                // HTTP data response status 422 means server "validation error" under the general HTTP 500 error
                                NotificationManager.error(Locale.getMessage('recordNotifications.error.500'), Locale.getMessage('failed'));
                            }
                        }
                        // this delay allows for saving modal to trap inputs otherwise
                        // clicks get invoked after create
                        Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                            this.dispatch(actions.AFTER_RECORD_EDIT);
                            reject();
                        });
                    }
                );

            } else {
                var errMessage = 'Missing one or more required input parameters to recordActions.addRecord. AppId:' +
                    appId + '; TblId:' + tblId + '; recordChanges:' + JSON.stringify(recordChanges) + '; fields:' + JSON.stringify(fields);
                logger.error(errMessage);
                this.dispatch(actions.ADD_RECORD_FAILED, {error: errMessage});
                reject();
            }
        });
    },

    /**
     * delete a record
     */
    deleteRecord(appId, tblId, recId, nameForRecords) {
        // promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            if (appId && tblId && (!!(recId === 0 || recId))) {
                this.dispatch(actions.DELETE_RECORD, {appId, tblId, recId});
                let recordService = new RecordService();

                //delete the record
                recordService.deleteRecord(appId, tblId, recId).then(
                    response => {
                        logger.debug('RecordService deleteRecord success');
                        this.dispatch(actions.DELETE_RECORD_SUCCESS, recId);
                        NotificationManager.success(`1 ${nameForRecords} ${Locale.getMessage('recordNotifications.deleted')}`, Locale.getMessage('success'));
                        // this delay allows for saving modal to trap inputs otherwise
                        // clicks get invoked after deleting
                        Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                            this.dispatch(actions.AFTER_RECORD_EDIT);
                            resolve();
                        });
                    },
                    error => {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'recordService.deleteRecord:');
                        this.dispatch(actions.DELETE_RECORD_FAILED, {appId, tblId, recId, error: error});
                        NotificationManager.error(`1 ${nameForRecords} ${Locale.getMessage('recordNotifications.notDeleted')}`, Locale.getMessage('failed'));
                        // this delay allows for saving modal to trap inputs otherwise
                        // clicks get invoked after delete
                        Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                            this.dispatch(actions.AFTER_RECORD_EDIT);
                            reject();
                        });
                    }
                ).catch(
                    ex => {
                        // TODO - remove catch block and update onPossiblyUnhandledRejection bluebird handler
                        logger.logException(ex);
                        // this delay allows for saving modal to trap inputs otherwise
                        // clicks get invoked after delete
                        Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                            this.dispatch(actions.AFTER_RECORD_EDIT);
                            reject();
                        });
                    }
                );
            } else {
                var errMessage = 'Missing one or more required input parameters to recordActions.deleteRecord. AppId:' +
                    appId + '; TblId:' + tblId + '; recId:' + recId;
                logger.error(errMessage);
                this.dispatch(actions.DELETE_RECORD_FAILED, {appId, tblId, recId, error: errMessage});
                reject();
            }
        });
    },

    /**
     * delete records in bulk
     */
    deleteRecordBulk(appId, tblId, recIds, nameForRecords) {
        // promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            if (appId && tblId && recIds && recIds.length >= 1) {
                this.dispatch(actions.DELETE_RECORD_BULK, {appId, tblId, recIds});
                let recordService = new RecordService();

                //delete the records
                recordService.deleteRecordBulk(appId, tblId, recIds).then(
                    response => {
                        logger.debug('RecordService deleteRecordBulk success');
                        this.dispatch(actions.DELETE_RECORD_BULK_SUCCESS, recIds);
                        let message = recIds.length === 1 ? (`1 ${nameForRecords} ${Locale.getMessage('recordNotifications.deleted')}`) : (`${recIds.length} ${nameForRecords} ${Locale.getMessage('recordNotifications.deleted')}`);
                        NotificationManager.success(message, Locale.getMessage('success'));
                        // this delay allows for saving modal to trap inputs otherwise
                        // clicks get invoked after deleting
                        Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                            this.dispatch(actions.AFTER_RECORD_EDIT);
                            resolve();
                        });
                    },
                    error => {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'recordService.deleteRecordBulk:');
                        this.dispatch(actions.DELETE_RECORD_BULK_FAILED, {appId, tblId, recIds, error: error});
                        let message = recIds.length === 1 ? (`1 ${nameForRecords} ${Locale.getMessage('recordNotifications.notDeleted')}`) : (`${recIds.length} ${nameForRecords} ${Locale.getMessage('recordNotifications.notDeleted')}`);
                        NotificationManager.error(message, Locale.getMessage('failed'));
                        // this delay allows for saving modal to trap inputs otherwise
                        // clicks get invoked after delete
                        Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                            this.dispatch(actions.AFTER_RECORD_EDIT);
                            reject();
                        });
                    }
                ).catch(
                    ex => {
                        // TODO - remove catch block and update onPossiblyUnhandledRejection bluebird handler
                        logger.logException(ex);
                        // this delay allows for saving modal to trap inputs otherwise
                        // clicks get invoked after delete
                        Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                            this.dispatch(actions.AFTER_RECORD_EDIT);
                            reject();
                        });
                    }
                );
            } else {
                var errMessage = 'Missing one or more required input parameters to recordActions.deleteRecordBulk. AppId:' +
                    appId + '; TblId:' + tblId + '; recIds:' + recIds ;
                logger.error(errMessage);
                this.dispatch(actions.DELETE_RECORD_BULK_FAILED, {appId, tblId, recIds, error: errMessage});
                reject();
            }
        });
    },

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
    saveRecord(appId, tblId, recId, pendEdits, fields, colList, showNotificationOnSuccess = false) {
        function createColChange(value, display, field, payload) {
            let colChange = {};
            colChange.fieldName = field.name;
            //the + before field.id is needed turn the field id from string into a number
            colChange.id = +field.id;
            colChange.value = _.cloneDeep(value);
            colChange.display = _.cloneDeep(display);
            colChange.fieldDef = field;
            payload.push(colChange);
        }

        function getConstrainedUnchangedValues(_pendEdits, _fields, changes, list) {
            // add in any editable fields values that are required or unique
            // so that server can validate them if they were created before
            // the field's constraint was made. so modifying a record
            // via patch will check those fields for validity even if the user
            // didn't edit the value
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


            //calls action to save the record changes
            // validate happen here or in action

            let payload = [];
            // columns id and new values array
            //[{"id":6, "value":"Claire"}]


            Object.keys(changes).forEach((key) => {
                let newValue = changes[key].newVal.value;
                let newDisplay = changes[key].newVal.display;
                if (_.has(_pendEdits, 'originalRecord.fids')) {
                    if (newValue !== _pendEdits.originalRecord.fids[key].value) {
                        //get each columns matching field description
                        let matchingField = changes[key].fieldDef;
                        createColChange(newValue, newDisplay, matchingField, payload);
                    }
                }
            });

            getConstrainedUnchangedValues(_pendEdits, _fields, changes, payload);
            return payload;
        }
        // promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            if (appId && tblId && (!!(recId === 0 || recId)) && pendEdits && fields) {
                let changes = getChanges(pendEdits, fields);
                this.dispatch(actions.SAVE_REPORT_RECORD, {appId, tblId, recId, changes});
                let recordService = new RecordService();

                //  save the changes to the record
                recordService.saveRecord(appId, tblId, recId, changes).then(
                    response => {
                        logger.debug('RecordService saveRecord success');
                        let clist = colList ? colList : [];
                        if (!clist.length && fields) {
                            fields.forEach((field) => {
                                clist.push(field.id);
                            });
                        }
                        clist = clist.join('.');
                        this.dispatch(actions.GET_RECORD, {appId, tblId, recId, clist: clist});
                        recordService.getRecord(appId, tblId, recId, clist, _withDisplayFormat()).then(
                            getResponse => {
                                logger.debug('RecordService getRecord success');
                                this.dispatch(actions.SAVE_RECORD_SUCCESS, {appId, tblId, recId, record: getResponse.data});
                                if (!showNotificationOnSuccess) {
                                    NotificationManager.success(Locale.getMessage('recordNotifications.recordSaved'), Locale.getMessage('success'));
                                }
                                // this delay allows for saving modal to trap inputs otherwise
                                // clicks get invoked after saving
                                Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                                    this.dispatch(actions.AFTER_RECORD_EDIT);
                                    resolve(recId);
                                });
                            },
                            getError => {
                                logger.parseAndLogError(LogLevel.ERROR, getError.response, 'recordService.getRecord:');
                                // dispatch the GET_RECORD_FAILED. This is not being acted upon right now in any of the stores
                                this.dispatch(actions.GET_RECORD_FAILED, {appId, tblId, recId, error: getError.response});
                                // this delay allows for saving modal to trap inputs otherwise
                                // clicks get invoked after saving
                                Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                                    this.dispatch(actions.AFTER_RECORD_EDIT);
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

                        this.dispatch(actions.SAVE_RECORD_FAILED, {appId, tblId, recId, changes, error: error});
                        NotificationManager.error(Locale.getMessage('recordNotifications.recordNotSaved'), Locale.getMessage('failed'));
                            // this delay allows for saving modal to trap inputs otherwise
                            // clicks get invoked after saving
                        Promise.delay(PRE_REQ_DELAY_MS).then(() => {
                            this.dispatch(actions.AFTER_RECORD_EDIT);
                            reject();
                        });
                    }
                );
            } else {
                var errMessage = 'Missing one or more required input parameters to recordActions.saveRecord. AppId:' +
                    appId + '; TblId:' + tblId + '; recId:' + recId + '; pendEdits:' + JSON.stringify(pendEdits) + '; fields:' + fields;
                logger.error(errMessage);
                this.dispatch(actions.SAVE_RECORD_FAILED, {error: errMessage});
                reject();
            }
        });
    }
};

export default recordActions;

