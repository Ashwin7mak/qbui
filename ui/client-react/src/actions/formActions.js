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
import {NEW_FORM_RECORD_ID} from '../constants/schema';
import {convertFormToArrayForClient, convertFormToObjectForServer} from './actionHelpers/transformFormData';

let logger = new Logger();

/**
 * form load in progress
 * @param container type of form (edit or view)
 * @returns {{type, container: *}}
 */
export const loadingForm = (id) => {
    return {
        id,
        type: types.LOADING_FORM
    };
};

/**
 * form load failed
 * @param container
 * @param error error message from server
 * @returns {{type, container: *, error: *}}
 */
export const loadFormError = (id, error) => {
    return {
        id,
        type: types.LOAD_FORM_ERROR,
        error
    };
};

/**
 * form load succeeded
 * @param container
 * @param formData form data returned from server
 * @returns {{type, container: *, formData: *}}
 */
export const loadFormSuccess = (id, formData) => {
    return {
        id,
        type: types.LOAD_FORM_SUCCESS,
        formData: convertFormToArrayForClient(formData)
    };
};

/**
 * UI is syncing the view form to the saved version
 * @returns {{type}}
 */
export const syncForm = (id) => {
    return {
        id,
        type: types.SYNC_FORM
    };
};

/**
 * save form in progress
 * @param container
 * @returns {{type, container: *}}
 */
//TODO: MOVE TO RECORDS ACTION..THIS IS FIRED WHEN SAVING A RECORD
export const savingForm = (id) => {
    return {
        id,
        type: types.SAVE_FORM
    };
};

/**
 * save form failed
 * @param container
 * @param error error message from server
 * @returns {{type, container: *, error: *}}
 */
//TODO: MOVE TO RECORDS ACTION..THIS IS FIRED WHEN SAVING A RECORD
export const saveFormError = (id, error) => {
    return {
        id,
        type: types.SAVE_FORM_FAILED,
        error
    };
};

/**
 * save form succeeded
 * @param container
 * @returns {{type, container: *}}
 */
//TODO: MOVE TO RECORDS ACTION..THIS IS FIRED WHEN SAVING A RECORD
export const saveFormSuccess = (id) => {
    return {
        id,
        type: types.SAVE_FORM_SUCCESS
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

    // we're returning a promise to the caller (not a Redux action) since this is an async action
    // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)

    return (dispatch) => {

        return new Promise((resolve, reject) => {
            if (!appId || !tblId) {
                reject();
            }

            dispatch(loadingForm(formType));

            let formService = new FormService();

            let promise;

            if (recordId === NEW_FORM_RECORD_ID) {
                promise = formService.getForm(appId, tblId, rptId, formType);

            } else {
                promise = formService.getFormAndRecord(appId, tblId, recordId, rptId, formType);
            }

            promise.then(
                response => {
                    response.data.formType = formType;

                    if (recordId === NEW_FORM_RECORD_ID) {
                        response.data.record = null;
                    } else {
                        response.data.recordId = recordId;
                    }

                    dispatch(loadFormSuccess(formType, response.data));
                    resolve(response.data);
                },
                (error) => {
                    if (error.response) {
                        if (error.response.status === 403) {
                            logger.parseAndLogError(LogLevel.WARN, error.response, 'formService.loadForm:');
                        } else {
                            logger.parseAndLogError(LogLevel.ERROR, error.response, 'formService.loadForm:');
                        }
                    }

                    if (error.response && error.response.status === 403) {
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
                }
            ).catch((ex) => {
                logger.logException(ex);
                NotificationManager.error(Locale.getMessage('recordNotifications.cannotLoad'), Locale.getMessage('failed'),
                    CompConsts.NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);
                // remove the editRec query string since we are not successfully editing the form
                WindowLocationUtils.pushWithoutQuery();
                reject(ex);
            });
        });
    };
};

/**
 * Move a field from one position on a form to a different position
 * @param formId
 * @param newLocation
 * @param draggedItemProps
 * @returns {{id, type, content}|*}
 */
export const moveFieldOnForm = (formId, newLocation, draggedItemProps) => {
    return event(formId, types.MOVE_FIELD, {
        newLocation,
        draggedItemProps
    });
};

/**
 * Removes a field from the form
 */
export const removeFieldFromForm = (formId, location) => {
    return event(formId, types.REMOVE_FIELD, {
        location
    });
};

/**
 * Create a new form
 *
 * @param appId
 * @param tblId
 * @param formType
 * @param form
 */
export const createForm = (appId, tblId, formType, form) => {
    return saveForm(appId, tblId, formType, form, true);
};

/**
 * Update an existing form layout
 *
 * @param appId
 * @param tblId
 * @param formType
 * @param form
 */
export const updateForm = (appId, tblId, formType, form) => {
    return saveForm(appId, tblId, formType, form, false);
};

// we're returning a promise to the caller (not a Redux action) since this is an async action
// (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)
function saveForm(appId, tblId, formType, formMeta, isNew) {

    return (dispatch) => {
        return new Promise((resolve, reject) => {
            if (appId && tblId) {
                let form = convertFormToObjectForServer(formMeta);

                logger.debug(`Saving form -- appId:${appId}, tableId:${tblId}, isNew:${isNew}`);

                //  TODO: refactor once record events are moved out..
                dispatch(event(formType, types.SAVING_FORM));

                let formService = new FormService();

                let formPromise = isNew ? formService.createForm(appId, tblId, form) : formService.updateForm(appId, tblId, form);
                formPromise.then(
                    (response) => {
                        logger.debug('FormService saveForm success');
                        //  for now return the original form..
                        dispatch(event(formType, types.SAVING_FORM_SUCCESS, convertFormToArrayForClient({formMeta: response.data}).formMeta));

                        NotificationManager.success(Locale.getMessage('form.notification.save.success'), Locale.getMessage('success'),
                            CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);

                        resolve();
                    },
                    (error) => {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'formService.getReports:');
                        dispatch(event(formType, types.SAVING_FORM_ERROR, error.response ? error.response.status : error.response));

                        NotificationManager.error(Locale.getMessage('form.notification.save.error'), Locale.getMessage('failed'),
                            CompConsts.NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);

                        reject(error);
                    }
                ).catch((ex) => {
                    logger.logException(ex);
                    NotificationManager.error(Locale.getMessage('form.notification.save.error'), Locale.getMessage('failed'),
                        CompConsts.NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);
                    reject(ex);
                });
            } else {
                logger.error(`formActions.saveForm: Missing required input parameters.  appId: ${appId}, tableId: ${tblId}`);
                dispatch(event(form.id, types.SAVING_FORM_ERROR, '500'));
                reject();
            }
        });
    };
}

/*
 Redux event for saving a form
 TODO: refactor once record events moved
 */
function event(id, type, content) {
    return {
        id: id,
        type: type,
        content: content || null
    };
}
