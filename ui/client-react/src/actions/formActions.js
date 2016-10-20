// action creators
import * as actions from '../constants/actions';
import FormService from '../services/formService';
import Promise from 'bluebird';

import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';
import WindowLocationUtils from '../utils/windowLocationUtils';
import * as UrlConsts from "../constants/urlConstants";
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



let formActions = {

    /**
     * edit an existing record
     * @param recordId
     */
    openRecordForEdit(recId) {

        // let flux know we're editing a record so we can navigate back and forth
        this.dispatch(actions.EDIT_REPORT_RECORD, {recId});

        // add editRec query param and let the router take action
        WindowLocationUtils.pushWithQuery(UrlConsts.EDIT_RECORD_KEY, recId);
    },

    /**
     * start editing a new record
     */
    editNewRecord(navigateAfterSave = false) {

        this.dispatch(actions.EDIT_REPORT_RECORD, {recId:UrlConsts.NEW_RECORD_VALUE, navigateAfterSave});

        // add editRec=new query param and let the router take action
        WindowLocationUtils.pushWithQuery(UrlConsts.EDIT_RECORD_KEY, UrlConsts.NEW_RECORD_VALUE);
    },

    /**
     * save form has been initiated (actual saving is done via record action)
     */
    savingForm() {
        this.dispatch(actions.SAVE_FORM);
    },

    /**
     * save form failed
     * @param errorStatus
     */
    saveFormFailed(errorStatus) {
        this.dispatch(actions.SAVE_FORM_FAILED, errorStatus);
    },

    /**
     * save form succeeded
     */
    saveFormSuccess() {
        this.dispatch(actions.SAVE_FORM_SUCCESS);
    },

    syncingForm() {
        this.dispatch(actions.SYNCING_FORM);
    },

    /**
     * load form for new record
     * @param appId
     * @param tblId
     * @param rptId
     * @param formType
     */
    loadForm(appId, tblId, rptId, formType, isEdit = false) {

        let loadAction = actions.LOAD_FORM;
        let successAction = actions.LOAD_FORM_SUCCESS;
        let failedAction = actions.LOAD_FORM_FAILED;
        if (isEdit) {
            loadAction = actions.LOAD_EDIT_FORM;
            successAction = actions.LOAD_EDIT_FORM_SUCCESS;
            failedAction = actions.LOAD_EDIT_FORM_FAILED;
        }
        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            if (appId && tblId) {
                this.dispatch(loadAction);

                let formService = new FormService();
                formService.getForm(appId, tblId, rptId, formType).then(
                    (response) => {
                        resolve();

                        response.data.record = null;
                        this.dispatch(successAction, response.data);
                    },
                    (error) => {
                        //  axios upgraded to an error.response object in 0.13.x
                        if (error.response.status === 403) {
                            logger.parseAndLogError(LogLevel.WARN, error.response, 'formService.loadForm:');
                        } else {
                            logger.parseAndLogError(LogLevel.ERROR, error.response, 'formService.loadForm:');
                        }
                        this.dispatch(failedAction, error.response.status);
                        reject();
                    }
                );
            } else {
                logger.error('formService.loadFormAndRecord: Missing required input parameters.');
                reject();
            }
        });
    },

    /**
     * load form and record data for edit
     * @param appId
     * @param tblId
     * @param recordId
     * @param rptId
     * @param formType
     */
    loadFormAndRecord(appId, tblId, recordId, rptId, formType, isEdit = false) {
        let loadAction = actions.LOAD_FORM_AND_RECORD;
        let successAction = actions.LOAD_FORM_AND_RECORD_SUCCESS;
        let failedAction = actions.LOAD_FORM_AND_RECORD_FAILED;
        if (isEdit) {
            loadAction = actions.LOAD_EDIT_FORM_AND_RECORD;
            successAction = actions.LOAD_EDIT_FORM_AND_RECORD_SUCCESS;
            failedAction = actions.LOAD_EDIT_FORM_AND_RECORD_FAILED;
        }

        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            if (appId && tblId && recordId) {
                this.dispatch(loadAction);

                let formService = new FormService();
                formService.getFormAndRecord(appId, tblId, recordId, rptId, formType).then(
                    (response) => {
                        resolve();

                        // store record id since form component needs it and it's not in the response
                        response.data.recordId = recordId;
                        this.dispatch(successAction, response.data);
                    },
                    (error) => {
                        //  axios upgraded to an error.response object in 0.13.x
                        if (error.response.status === 403) {
                            logger.parseAndLogError(LogLevel.WARN, error.response, 'formService.loadFormAndRecord:');
                        } else {
                            logger.parseAndLogError(LogLevel.ERROR, error.response, 'formService.loadFormAndRecord:');
                        }

                        // remove the editRec query string since we are not successfully editing the form
                        WindowLocationUtils.pushWithoutQuery();
                        this.dispatch(failedAction, error.response.status);

                        if (error.response.status === 403) {
                            NotificationManager.error(Locale.getMessage('form.error.403'), Locale.getMessage('failed'), 1500);
                        } else {
                            NotificationManager.error(Locale.getMessage('recordNotifications.cannotLoad'), Locale.getMessage('failed'), 1500);
                        }

                        reject();
                    }
                );
            } else {
                logger.error('formService.loadFormAndRecord: Missing required input parameters.');
                reject();
            }
        });
    }
};

export default formActions;
