// Redux action creators

import FormService from '../services/formService';
import Promise from 'bluebird';

import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';
import WindowLocationUtils from '../utils/windowLocationUtils';
import * as UrlConsts from "../constants/urlConstants";
import Locale from '../locales/locales';
import {NotificationManager} from 'react-notifications';
import * as CompConsts from '../constants/componentConstants';

let logger = new Logger();

export const loadingForm = (id) => {
    return {
        type: 'LOADING_FORM',
        id,
    };
};
export const loadFormError = (id, error) => {
    return {
        type: 'LOAD_FORM_ERROR',
        id,
        error
    };
};
export const loadFormSuccess = (id, formData) => {
    return {
        type: 'LOAD_FORM_SUCCESS',
        id,
        formData
    };
};

export const savingForm = () => {
    return {
        type: 'SAVING_FORM',
    };
};
export const saveFormError = (error) => {
    return {
        type: 'SAVE_FORM_ERROR',
        error
    };
};
export const saveFormSuccess = () => {
    return {
        type: 'SAVE_FORM_SUCCESS'
    };
};

export const syncingForm = () => {
    return {
        type: 'SYNCING_FORM'
    };
};
export const openRecordForEdit = (recId) => {

    // add editRec query param and let the router take action
    WindowLocationUtils.pushWithQuery(UrlConsts.EDIT_RECORD_KEY, recId);

    // let flux know we're editing a record so we can navigate back and forth

    return {
        type: 'EDIT_REPORT_RECORD',
        recId: recId,
    };
};

export const editNewRecord = (navigateAfterSave = false) => {

    // add editRec=new query param and let the router take action
    WindowLocationUtils.pushWithQuery(UrlConsts.EDIT_RECORD_KEY, UrlConsts.NEW_RECORD_VALUE);

    return {
        type: 'EDIT_REPORT_RECORD',
        recId: UrlConsts.NEW_RECORD_VALUE,
        navigateAfterSave
    };
};

export const loadForm = (appId, tblId, rptId, formType, recordId) => {

    // redux-thunk allows us to return a function (returning a promise) instead of an action
    return (dispatch) => {

        return new Promise((resolve, reject) => {
            if (appId && tblId) {
                dispatch(loadingForm(formType));

                let formService = new FormService();

                let promise;

                if (recordId !== "new") {
                    promise = formService.getFormAndRecord(appId, tblId, recordId, rptId, formType);
                } else {
                    promise = formService.getForm(appId, tblId, rptId, formType);
                }
                promise.then(
                    (response) => {
                        resolve();

                        if (recordId === "new") {
                            response.data.record = null;
                        } else {
                            response.data.recordId = recordId;
                        }

                        dispatch(loadFormSuccess(formType, response.data));
                    },
                    (error) => {
                        //  axios upgraded to an error.response object in 0.13.x
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

                        reject();
                    }
                );
            } else {
                logger.error('formService.loadFormAndRecord: Missing required input parameters.');
                reject();
            }
        });
    };
};

