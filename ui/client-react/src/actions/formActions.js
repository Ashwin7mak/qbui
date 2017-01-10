// Redux action creators for forms

import FormService from '../services/formService';
import Promise from 'bluebird';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';
import WindowLocationUtils from '../utils/windowLocationUtils';
import Locale from '../locales/locales';
import {NotificationManager} from 'react-notifications';
import * as CompConsts from '../constants/componentConstants';
import * as types from '../actions/types';
import * as UrlConsts from "../constants/urlConstants";

let logger = new Logger();

/**
 * form load in progress
 * @param container type of form (edit or view)
 * @returns {{type, container: *}}
 */
export const loadingForm = (container) => {
    return {
        type: types.LOADING_FORM,
        container,
    };
};

/**
 * form load failed
 * @param container
 * @param error error message from server
 * @returns {{type, container: *, error: *}}
 */
export const loadFormError = (container, error) => {
    return {
        type: types.LOAD_FORM_ERROR,
        container,
        error
    };
};

/**
 * form load succeeded
 * @param container
 * @param formData form data returned from server
 * @returns {{type, container: *, formData: *}}
 */
export const loadFormSuccess = (container, formData) => {
    return {
        type: types.LOAD_FORM_SUCCESS,
        container,
        formData
    };
};

/**
 * save form in progress
 * @param container
 * @returns {{type, container: *}}
 */
export const savingForm = (container) => {
    return {
        type: types.SAVE_FORM,
        container
    };
};

/**
 * save form failed
 * @param container
 * @param error error message from server
 * @returns {{type, container: *, error: *}}
 */
export const saveFormError = (container, error) => {
    return {
        type: types.SAVE_FORM_FAILED,
        container,
        error
    };
};

/**
 * save form succeeded
 * @param container
 * @returns {{type, container: *}}
 */
export const saveFormSuccess = (container) => {
    return {
        type: types.SAVE_FORM_SUCCESS,
        container
    };
};

/**
 * UI is syncing the view form to the saved version
 * @returns {{type}}
 */
export const syncingForm = () => {
    return {
        type: types.SYNCING_FORM
    };
};

/**
 * open an existing record for editing
 * @param recId
 * @returns {{type, recId: *}}
 */
export const openRecordForEdit = (recId) => {

    // add editRec query param and let the router take action
    WindowLocationUtils.pushWithQuery(UrlConsts.EDIT_RECORD_KEY, recId);

    // let store know we're editing a record so we can navigate back and forth

    return {
        type: types.EDIT_REPORT_RECORD,
        recId: recId,
    };
};

/**
 * open a new record for editing
 * @param navigateAfterSave go to the new record after saving
 * @returns {{type, recId, navigateAfterSave: boolean}}
 */
export const editNewRecord = (navigateAfterSave = false) => {

    // add editRec=new query param and let the router take action
    WindowLocationUtils.pushWithQuery(UrlConsts.EDIT_RECORD_KEY, UrlConsts.NEW_RECORD_VALUE);

    return {
        type: types.EDIT_REPORT_RECORD,
        recId: UrlConsts.NEW_RECORD_VALUE,
        navigateAfterSave
    };
};

/**
 * load a form, optionally with record data
 * @param appId app
 * @param tblId table
 * @param rptId report
 * @param formType "edit" or "view"
 * @param recordId record ID or "new"
 * @returns {function(*=)}
 */
export const loadForm = (appId, tblId, rptId, formType, recordId) => {

    const NEW_RECORD_ID = "new";

    // we're returning a promise to the caller (not a Redux action) since this is an async action
    // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)

    return (dispatch) => {

        return new Promise((resolve, reject) => {
            if (!appId || !tblId) {
                reject();
            }

            dispatch(loadingForm(formType));

            let formService = new FormService();

            if (recordId === NEW_RECORD_ID) {
                resolve(formService.getForm(appId, tblId, rptId, formType));

            } else {
                resolve(formService.getFormAndRecord(appId, tblId, recordId, rptId, formType));
            }
        }).then(response => {
            if (recordId === NEW_RECORD_ID) {
                response.data.record = null;
            } else {
                response.data.recordId = recordId;
            }

            dispatch(loadFormSuccess(formType, response.data));
        }).catch(error => {

            if (!error) {
                reject(logger.error('formService.loadFormAndRecord: Missing required input parameters.'));
            }

            if (error.response.status === 403) {
                logger.parseAndLogError(LogLevel.WARN, error.response, 'formService.loadForm:');
            } else {
                logger.parseAndLogError(LogLevel.ERROR, error.response, 'formService.loadForm:');
            }

            if (error.response.status === 403) {
                NotificationManager.error(Locale.getMessage('form.error.403'), Locale.getMessage('failed'),
                    CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
            } else {
                NotificationManager.error(Locale.getMessage('recordNotifications.cannotLoad'), Locale.getMessage('failed'),
                    CompConsts.NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);
            }

            // remove the editRec query string since we are not successfully editing the form
            WindowLocationUtils.pushWithoutQuery();

            dispatch(loadFormError(formType, error.response.status));

            reject(error);
        });
    };
};

