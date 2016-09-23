/**
 * Any actions related to Record model are defined here. This is responsible for making calls to Node layer api based on the action.
 */
import * as actions from '../constants/actions';
import RecordService from '../services/recordService';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';
import Promise from 'bluebird';
import Locale from '../locales/locales';
import {NotificationManager} from 'react-notifications';

let logger = new Logger();


//  Custom handling of 'possible unhandled rejection' error,  because we don't want
//  to see an exception in the console output.  The exception is thrown by bluebird
//  because the core application code has no logic implemented to handle a rejected
//  promise.  This is expected as promises are NOT implemented in the application
//  code.  Promises are returned only to support our unit tests, which are expected
//  to implement the appropriate handlers.
Promise.onPossiblyUnhandledRejection(function(err) {
    logger.debug('Bluebird Unhandled rejection', err);
});


let recordActions = {

    /**
     * save a new record
     */
    saveNewRecord(appId, tblId, recordChanges, fields) {
        function getRecord(_recordChanges, _fields) {
            //save changes in record
            let payload = [];
            // columns id and new values array
            //[{"id":6, "value":"Claire"}]
            if (_recordChanges) {
                Object.keys(_recordChanges).forEach((recKey) => {
                    //get each columns matching field description
                    let matchingField = null;
                    if (_fields) {
                        matchingField = _.find(_fields, (field) => {
                            return field.id === +recKey;
                        });
                    }
                    // only post the non built in fields values
                    if (matchingField && matchingField.builtIn === false) {
                        let newValue = _recordChanges[recKey].newVal.value;
                        let newDisplay = _recordChanges[recKey].newVal.display;

                        let colChange = {};
                        colChange.fieldName = _recordChanges[recKey].fieldName;
                        colChange.id = +recKey;
                        colChange.value = _.cloneDeep(newValue);
                        colChange.display = _.cloneDeep(newDisplay);
                        colChange.field = matchingField.datatypeAttributes;
                        if (colChange.field) {
                            colChange.field.required = matchingField.required;
                        }
                        payload.push(colChange);
                    }
                });
            }
            return payload;
        }
            // promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            let record = getRecord(recordChanges, fields);
            if (appId && tblId && record.length) {
                this.dispatch(actions.ADD_RECORD, {appId, tblId, record});
                let recordService = new RecordService();

                // save the changes to the record
                recordService.createRecord(appId, tblId, record).then(
                        response => {
                            logger.debug('RecordService createRecord success:' + JSON.stringify(response));
                            if (response !== undefined && response.data !== undefined && response.data.body !== undefined) {
                                let resJson = JSON.parse(response.data.body);
                                this.dispatch(actions.ADD_RECORD_SUCCESS, {appId, tblId, record, recId: resJson.id});
                                NotificationManager.success(Locale.getMessage('recordNotifications.recordAdded'), Locale.getMessage('success'), 1500);
                                resolve();
                            } else {
                                logger.error('RecordService createRecord call error: no response data value returned');
                                this.dispatch(actions.ADD_RECORD_FAILED, {appId, tblId, record, error: new Error('no response data member')});
                                NotificationManager.error(Locale.getMessage('recordNotifications.recordNotAdded'), Locale.getMessage('failed'), 1500);
                                reject();
                            }
                        },
                        error => {
                            //  axios upgraded to an error.response object in 0.13.x
                            logger.parseAndLogError(LogLevel.ERROR, error.response, 'recordService.createRecord:');
                            this.dispatch(actions.ADD_RECORD_FAILED, {appId, tblId, record, error: error.response});
                            NotificationManager.error(Locale.getMessage('recordNotifications.recordNotAdded'), Locale.getMessage('failed'), 1500);
                            reject();
                        }
                    ).catch(
                        ex => {
                            logger.logException(ex);
                            this.dispatch(actions.ADD_RECORD_FAILED, {appId, tblId, record, error: ex});
                            reject();
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
                        logger.debug('RecordService deleteRecord success:' + JSON.stringify(response));
                        this.dispatch(actions.DELETE_RECORD_SUCCESS, recId);
                        NotificationManager.success(`1 ${nameForRecords} ${Locale.getMessage('recordNotifications.deleted')}`, Locale.getMessage('success'), 2000);
                        resolve();
                    },
                    error => {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'recordService.deleteRecord:');
                        this.dispatch(actions.DELETE_RECORD_FAILED, {appId, tblId, recId, error: error.response});
                        NotificationManager.error(`1 ${nameForRecords} ${Locale.getMessage('recordNotifications.notDeleted')}`, Locale.getMessage('failed'), 3000);
                        reject();
                    }
                ).catch(
                    ex => {
                        logger.logException(ex);
                        this.dispatch(actions.DELETE_RECORD_FAILED, {appId, tblId, recId, error: ex});
                        reject();
                    }
                );
            } else {
                var errMessage = 'Missing one or more required input parameters to recordActions.deleteRecord. AppId:' +
                    appId + '; TblId:' + tblId + '; recId:' + recId ;
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
                        logger.debug('RecordService deleteRecordBulk success:' + JSON.stringify(response));
                        this.dispatch(actions.DELETE_RECORD_BULK_SUCCESS, recIds);
                        let message = recIds.length === 1 ? (`1 ${nameForRecords} ${Locale.getMessage('recordNotifications.deleted')}`) : (`${recIds.length} ${nameForRecords} ${Locale.getMessage('recordNotifications.deleted')}`);
                        NotificationManager.success(message, Locale.getMessage('success'), 2000);
                        resolve();
                    },
                    error => {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'recordService.deleteRecordBulk:');
                        this.dispatch(actions.DELETE_RECORD_BULK_FAILED, {appId, tblId, recIds, error: error.response});
                        let message = recIds.length === 1 ? (`1 ${nameForRecords} ${Locale.getMessage('recordNotifications.notDeleted')}`) : (`${recIds.length} ${nameForRecords} ${Locale.getMessage('recordNotifications.notDeleted')}`);
                        NotificationManager.error(message, Locale.getMessage('failed'), 3000);
                        reject();
                    }
                ).catch(
                    ex => {
                        logger.logException(ex);
                        this.dispatch(actions.DELETE_RECORD_BULK_FAILED, {appId, tblId, recIds, error: ex});
                        reject();
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

    /* the start of editing a record */
    /**
     * save a record
     */
    saveRecord(appId, tblId, recId, pendEdits, fields) {
        function createColChange(value, display, field, payload) {
            let colChange = {};
            colChange.fieldName = field.name;
            //the + before field.id is needed turn the field id from string into a number
            colChange.id = +field.id;
            colChange.value = _.cloneDeep(value);
            colChange.display = _.cloneDeep(display);
            colChange.field = field.datatypeAttributes;
            if (colChange.field) {
                colChange.field.required = field.required;
            }
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
                            if (_pendEdits.originalRecord.fids[field.id]) {
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
                        if (_fields) {
                            let matchingField = _.find(_fields, (field) => {
                                return field.id === +key;
                            });
                            createColChange(newValue, newDisplay, matchingField, payload);
                        }
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
                        logger.debug('RecordService saveRecord success:' + JSON.stringify(response));
                        this.dispatch(actions.SAVE_RECORD_SUCCESS, {appId, tblId, recId, changes});
                        NotificationManager.success(Locale.getMessage('recordNotifications.recordSaved'), Locale.getMessage('success'), 1500);
                        resolve();
                    },
                    error => {
                        //  axios upgraded to an error.response object in 0.13.x
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'recordService.saveRecord:');
                        this.dispatch(actions.SAVE_RECORD_FAILED, {appId, tblId, recId, changes, error: error.response});
                        NotificationManager.error(Locale.getMessage('recordNotifications.recordNotSaved'), Locale.getMessage('failed'), 1500);
                        reject();
                    }
                ).catch(
                    ex => {
                        logger.logException(ex);
                        this.dispatch(actions.SAVE_RECORD_FAILED, {appId, tblId, recId, changes, error: ex});
                        reject();
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
