// Redux action creators for forms

import FormService from '../services/formService';
import Promise from 'bluebird';
import _ from 'lodash';
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
        formData
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

            let promise;

            if (recordId === NEW_RECORD_ID) {
                promise = formService.getForm(appId, tblId, rptId, formType);

            } else {
                promise = formService.getFormAndRecord(appId, tblId, recordId, rptId, formType);
            }

            promise.then(response => {
                response.data.formType = formType;

                if (recordId === NEW_RECORD_ID) {
                    response.data.record = null;
                } else {
                    response.data.recordId = recordId;
                }

                // TODO: using mock data: should retrieve relationships data without the use of
                // globals.
                if (_.get(window, 'relationships.length') > 0) {
                    window.relationships.forEach((relation) => {
                        // if a relathinship in which this form is a parent is defined, mock ReferenceElement
                        if (relation.masterTableId === response.data.formMeta.tableId) {
                            (response.data.formMeta.relationships || []).push(relation);
                            const mockElement =  {
                                ReferenceElement: {
                                    displayOptions: [
                                        "VIEW",
                                        "ADD",
                                        "EDIT"
                                    ],
                                    type: "EMBEDREPORT",
                                    orderIndex: 0,
                                    positionSameRow: false,
                                    relationshipId: 0
                                }
                            };
                            // add as many elements as we have relationships
                            const elements = Array(window.relationships.length).fill(' ').map((el, idx) => {
                                const element = _.cloneDeep(mockElement);
                                _.set(element, 'ReferenceElement.relationshipId', idx);
                                _.set(element, 'ReferenceElement.orderIndex', idx);
                                return element;
                            });
                            const length = Object.keys(response.data.formMeta.tabs[0].sections).length;
                            // inject relationship elements in its own section
                            let sections = response.data.formMeta.tabs[0].sections;
                            sections[length] = Object.assign(_.cloneDeep(sections[0]), {
                                elements: elements,
                                fields: [],
                                orderIndex: length
                            });
                            sections[length].headerElement.FormHeaderElement.displayText = 'Child Reports';
                        }
                    });
                }

                dispatch(loadFormSuccess(formType, response.data));

                resolve();
            }).catch(error => {

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

                if (error.response) {
                    dispatch(loadFormError(formType, error.response.status));
                }

                reject(error);
            });
        });
    };
};
