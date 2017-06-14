/* eslint-disable keyword-spacing */
// Redux action creators for forms

import FormService from '../services/formService';
import Promise from 'bluebird';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';
import {WindowHistoryUtils} from '../utils/windowHistoryUtils';
import Locale from '../locales/locales';
import NotificationManager from '../../../reuse/client/src/scripts/notificationManager';
import * as types from '../actions/types';
import NavigationUtils from '../utils/navigationUtils';
import FieldUtils from '../utils/fieldUtils';
import {NEW_FORM_RECORD_ID} from '../constants/schema';
import _ from 'lodash';
import {convertFormToArrayForClient, convertFormToObjectForServer, addRelationshipFieldProps} from './actionHelpers/transformFormData';
import {saveAllNewFields, updateAllFieldsWithEdits, deleteField} from './fieldsActions';


let logger = new Logger();

/*
 Redux event for saving a form
 */
function event(id, type, content) {
    return {
        id: id,
        type: type,
        content: content || null
    };
}

export const updateFormRedirectRoute = route => {
    return {
        type: types.UPDATE_FORM_REDIRECT_ROUTE,
        redirectRoute: route
    };
};


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
export const loadFormSuccess = (id, formData, appId, tblId) => {
    return {
        id,
        type: types.LOAD_FORM_SUCCESS,
        formData: convertFormToArrayForClient(formData),
        appId,
        tblId
    };
};

/**
 * UI should refresh the view form to the saved version
 * @param id
 * @param recordId newly saved record ID
 * @returns {{id: *, type, recordId: *}}
 */
export const syncForm = (id, recordId) => {
    return {
        id,
        type: types.SYNC_FORM,
        recordId
    };
};

/**
 * open the 'modal working' spinner/window when saving a form or form record.
 *
 * @param container
 * @returns {{type, container: *}}
 */
export const saveForm = (id) => {
    return {
        id,
        type: types.SAVE_FORM
    };
};

/**
 * hide the 'modal working' spinner/window when completing a form save request.
 */
export const saveFormComplete = (id) => {
    return {
        id,
        type: types.SAVE_FORM_COMPLETE
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
export const loadForm = (appId, tblId, rptId, formType, recordId, context) => {

    // we're returning a promise to the caller (not a Redux action) since this is an async action
    // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)

    context = context || formType;

    return (dispatch) => {

        return new Promise((resolve, reject) => {
            if (!appId || !tblId) {
                reject();
            }

            dispatch(loadingForm(context));

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

                    addRelationshipFieldProps(appId, tblId, response.data.formMeta, response.data.fields);

                    dispatch(loadFormSuccess(context, response.data, appId, tblId));
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
                        NotificationManager.error(Locale.getMessage('form.error.403'), Locale.getMessage('failed'));
                    } else {
                        NotificationManager.error(Locale.getMessage('recordNotifications.cannotLoad'), Locale.getMessage('failed'));
                    }

                    // remove the editRec query string since we are not successfully editing the form
                    WindowHistoryUtils.pushWithoutQuery();
                    dispatch(loadFormError(formType, error.response.status));

                    reject(error);
                }
            ).catch((ex) => {
                logger.logException(ex);
                NotificationManager.error(Locale.getMessage('recordNotifications.cannotLoad'), Locale.getMessage('failed'));
                // remove the editRec query string since we are not successfully editing the form
                WindowHistoryUtils.pushWithoutQuery();
                reject(ex);
            });
        });
    };
};

/**
 * Private function for addFieldToForm, not exported
 * */
const buildField = (field, id) => {
    id = id || _.uniqueId('newField_');
    //FormFieldElement is needed for both existing fields and new fields for experience engine
    return _.merge({}, {
        id: id,
        edit: true,
        FormFieldElement: {
            positionSameRow: false,
            fieldId: id
        }
    }, field);
};

/**
 * Adds a field to the form
 * @param formId
 * @param appId
 * @param tblId
 * @param newLocation
 * @param field
 * @returns {{id, type, content}|*}
 */
export const addFieldToForm = (formId, appId, tblId, newLocation, field) => {
    return {
        type: types.ADD_FIELD,
        id: formId,
        appId,
        tblId,
        content: {
            newLocation,
            field: buildField(field, field.id)
        }
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
 * Selects a field on a form
 * @param formId
 * @param location
 * @returns {{id, type, content}|*}
 */
export const selectFieldOnForm = (formId, location) => {
    return event(formId, types.SELECT_FIELD, {location});
};

/**
 * Deselects a field on a form
 * @param formId
 * @param location
 * @returns {{id, type, content}|*}
 */
export const deselectField = (formId, location) => {
    return event(formId, types.DESELECT_FIELD, {location});
};

/**
 * Removes a field from the form
 * @param formId
 * @param field
 * @param location
 * @returns {{id, type, content}|*}
 */
export const removeFieldFromForm = (formId, field, location) => {
    return {id: formId, type: types.REMOVE_FIELD, field, location};
};

/**
 * Move a field up one position on a form
 * @param formId
 * location
 * @returns {{id, type, content}|*}
 */
export const keyboardMoveFieldUp = (formId, location) => {
    return event(formId, types.KEYBOARD_MOVE_FIELD_UP, {
        location
    });
};

/**
 * Move a field down one position on a form
 * @param formId
 * location
 * @returns {{id, type, content}|*}
 */
export const keyboardMoveFieldDown = (formId, location) => {
    return event(formId, types.KEYBOARD_MOVE_FIELD_DOWN, {
        location
    });
};

/**
 * Toggles children tabIndex for formBuilder's form
 * @param formId
 * @returns {{id, type, content}|*}
 */
export const toggleFormBuilderChildrenTabIndex = (formId, currentTabIndex) => {
    return event(formId, types.TOGGLE_FORM_BUILDER_CHILDREN_TABINDEX, {
        currentTabIndex
    });
};

/**
 * Toggles children tabIndex for formBuilder's toolPalette
 * @param formId
 * @returns {{id, type, content}|*}
 */
export const toggleToolPaletteChildrenTabIndex = (formId, currentTabIndex) => {
    return event(formId, types.TOGGLE_TOOL_PALETTE_BUILDER_CHILDREN_TABINDEX, {
        currentTabIndex
    });
};

/**
 * endDraggingState updates the dragging state to false for drag and drop
 * @param formId
 * @returns {{id, type, content}|*}
 */
export const endDraggingState = (formId) => {
    return event(formId, types.END_DRAG);
};

/**
 * isInDraggingState updates the dragging state to true for drag and drop
 * @param formId
 * @returns {{id, type, content}|*}
 */
export const isInDraggingState = (formId) => {
    return event(formId, types.IS_DRAGGING);
};

/**
 - * setFormBuilderPendingEditToFalse sets isPendingEdits to false
 - * @param formId
 - * @returns {{id, type, content}|*}
 - */
export const setFormBuilderPendingEditToFalse = (formId) => {
    return event(formId, types.SET_IS_PENDING_EDIT_TO_FALSE);
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
    return saveTheForm(appId, tblId, formType, form, true);
};


/**
 * when relationship is deleted, update parent form with a section for default report of the child table
 * @param relationshipId
 * @param childTableName
 * @param parentTableId
 */
export const  removeRelationshipFromForm = (relationship) => {
    return new Promise((resolve, reject) => {
        if (relationship) {

            let formService = new FormService();
            formService.getForm(relationship.masterAppId, relationship.masterTableId).then(
                (formResponse) => {
                    let formMeta = formResponse.data.formMeta;
                    if (formMeta.tabs[0] && formMeta.tabs[0].sections) {
                        let sections = formMeta.tabs[0].sections;
                        let sectionToBeDeleted = null;
                        Object.keys(sections).forEach((sectionKey) => {
                            if(_.includes(_.map(_.map(_.get(sections[sectionKey], 'elements'), 'ChildReportElement'), 'relationshipId'), relationship.id)) {
                                sectionToBeDeleted = sectionKey;
                            }
                        });
                        if (sectionToBeDeleted) {
                            sections[sectionToBeDeleted] = undefined;
                            formService.updateForm(relationship.masterAppId, relationship.masterTableId, formMeta).then(
                                () => resolve()
                            ).catch(error => {
                                logger.parseAndLogError(LogLevel.ERROR, error, 'Error updating form to delete section showing child report');
                                reject();
                            });
                        } else {
                            resolve();
                        }
                    }else{
                        resolve();
                    }
                }
            ).catch(error => {
                logger.parseAndLogError(LogLevel.ERROR, error, 'error trying to update forms');
                reject();
            });
        }else{
            resolve();
        }
    });
};


/**
 * Delete detail field from child table, find the relationship info associated with the detail field and
 * update the parent form to remove the section that displays child report
 * @param appId
 * @param childTableId
 * @param field
 * @param formMeta
 * @returns {function(*, *)}
 */
export const  deleteDetailFieldUpdateParentForm = (appId, childTableId, fieldId, formMeta) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            dispatch(deleteField(appId, childTableId, fieldId));

            if (Array.isArray(formMeta.relationships) && formMeta.relationships.length > 0) {
                let relatedRelationship = _.find(formMeta.relationships, (rel) => rel.detailTableId === childTableId  && rel.detailFieldId === fieldId);
                if  (relatedRelationship) {
                    removeRelationshipFromForm(relatedRelationship).then(
                        () => resolve()
                    ).catch(error => {
                        logger.parseAndLogError(LogLevel.ERROR, error, 'error deleting section from parent form');
                        reject();
                    });
                }
            }else {
                resolve();
            }
        });
    };
};


export const deleteMarkedFields = (appId, tblId, formMeta) => {
    return (dispatch, getState) => {
        let fields = formMeta.fieldsToDelete;

        const fieldPromises = formMeta.fieldsToDelete ? fields.map(field =>  dispatch(deleteDetailFieldUpdateParentForm(appId, tblId, field, formMeta))) : [];
        if (fieldPromises.length === 0) {
            logger.info('No fields deleted with deleteMarkedFields for : `{appId}`, tbl: `{tblId}`');
            return Promise.resolve();
        }

        return Promise.all(fieldPromises).then(() => {
            logger.debug('All promises processed in deleteMarkedFields against app: `{appId}`, tbl: `{tblId}`');
        }).catch(error => {
            logger.error(error);
        });
    };
};

/**
 * Update an existing form layout
 *
 * @param appId
 * @param tblId
 * @param formType
 * @param form
 * @param redirectRoute
 * @param shouldRedirectOnSave
 */
export const updateForm = (appId, tblId, formType, form, redirectRoute, shouldRedirectOnSave = true) => {
    return saveTheForm(appId, tblId, formType, form, false, redirectRoute, shouldRedirectOnSave);
};

// we're returning a promise to the caller (not a Redux action) since this is an async action
// (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)
function saveTheForm(appId, tblId, formType, formMeta, isNew, redirectRoute, shouldRedirectOnSave) {
    return (dispatch, getState) => {
        dispatch(event(formType, types.SAVING_FORM));

        return dispatch(saveAllNewFields(appId, tblId, formType))
            .then(() => dispatch(updateAllFieldsWithEdits(appId, tblId)))
            .then(() => dispatch(deleteMarkedFields(appId, tblId, formMeta)))
            .then(() => {
                return new Promise((resolve, reject) => {
                    if (appId && tblId) {
                        // Get the newest version of the form from state if it exists in state
                        let form = formMeta;
                        if (getState().forms && getState().forms[formType]) {
                            form = getState().forms[formType].formData.formMeta;
                        }
                        form = convertFormToObjectForServer(form);

                        logger.debug(`Saving form -- appId:${appId}, tableId:${tblId}, isNew:${isNew}`);

                        let formService = new FormService();

                        let formPromise = isNew ? formService.createForm(appId, tblId, form) : formService.updateForm(appId, tblId, form);
                        formPromise.then(
                            (response) => {
                                logger.debug('FormService saveTheForm success');
                                //  for now return the original form..
                                dispatch(event(formType, types.SAVING_FORM_SUCCESS, convertFormToArrayForClient({formMeta: response.data}).formMeta));

                                if (shouldRedirectOnSave) {
                                    NavigationUtils.goBackToLocationOrTable(appId, tblId, redirectRoute);
                                }

                                NotificationManager.success(Locale.getMessage('form.notification.save.success'), Locale.getMessage('success'));
                                resolve();
                            },
                            (error) => {
                                logger.parseAndLogError(LogLevel.ERROR, error.response, 'formService.getReports:');
                                dispatch(event(formType, types.SAVING_FORM_ERROR, error.response ? error.response.status : error.response));
                                NotificationManager.error(Locale.getMessage('form.notification.save.error'), Locale.getMessage('failed'));
                                reject(error);
                            }
                        ).catch((ex) => {
                            logger.logException(ex);
                            NotificationManager.error(Locale.getMessage('form.notification.save.error'), Locale.getMessage('failed'));
                            reject(ex);
                        });
                    } else {
                        logger.error(`formActions.saveTheForm: Missing required input parameters.  appId: ${appId}, tableId: ${tblId}`);
                        dispatch(event(form.id, types.SAVING_FORM_ERROR, '500'));
                        reject();
                    }
                });
            });
    };
}

export const unloadForm = (id) => {
    return {
        id,
        type: types.UNLOAD_FORM
    };
};



