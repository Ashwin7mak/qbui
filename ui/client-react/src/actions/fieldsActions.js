// action creators
import _ from 'lodash';
import FieldsService from '../services/fieldsService';
import AppService from '../services/appService';
import Promise from 'bluebird';
import * as types from '../actions/types';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';
import {getFields} from '../reducers/fields';
import {transformFieldBeforeSave} from './actionHelpers/transformFormData';
import FormService from '../services/formService';
import Consts from '../../../common/src/constants';

let logger = new Logger();

/**
 * Construct fields store payload
 *
 * @param appId - appId for fields
 * @param tblId - tblId for fields
 * @param type - event type
 * @param content - optional content related to event type
 * @returns {{id: *, type: *, content: *}}
 */
function event(appId, tblId, type, content) {
    return {
        appId,
        tblId,
        type,
        content: content || null
    };
}

export const updateFieldId = (oldFieldId, newFieldId, formId = null, appId, tblId) => {
    return {
        type: types.UPDATE_FIELD_ID,
        oldFieldId,
        newFieldId,
        formId,
        appId,
        tblId
    };
};

/**
 - * setFieldsPropertiesPendingEditToFalse sets isPendingEdits to false
 - * @param formId
 - * @returns {{id, type, content}|*}
 - */
export const setFieldsPropertiesPendingEditToFalse = () => {
    return {
        type: types.SET_IS_PENDING_EDIT_TO_FALSE
    };
};

/**
 * Construct fields store update payload
 * @param field
 * @param appId
 * @param tableId
 * @returns {{appId: *, tblId: *, field: *, type}}
 */
export const updateField = (field, appId, tableId) => {
    return {
        appId: appId,
        tblId: tableId,
        field: field,
        type: types.UPDATE_FIELD
    };
};

/**
 * save a parent/child field relationship on an app
 * @param appId
 * @param fieldId
 * @param detailTableId
 * @param parentTableId
 * @param parentFieldId
 * @returns {promise}
 */
function createRelationship(appId, fieldId, detailTableId, parentTableId, parentFieldId) {
    const relationship = {
        appId,
        masterAppId: appId,
        masterTableId: parentTableId,
        masterFieldId: parentFieldId,
        detailAppId: appId,
        detailTableId: detailTableId,
        detailFieldId: fieldId,
        description: "Referential integrity relationship between Master / Child Tables",
        referentialIntegrity: false,
        cascadeDelete: false
    };
    const appService = new AppService();
    return appService.createRelationship(appId, relationship);
}

/**
 * Constant defining header element
 * @param displayText
 */
const headerElement = (displayText = 'Tab1-Section1') =>({
    FormHeaderElement: {
        displayText: displayText,
        type: 'HEADER'
    }
});

/**
 * Constant defining the childReportElement on a given form.
 * @param relationshipId
 */
const childReportElement = (relationshipId = 0) => ({
    ChildReportElement: {
        displayOptions: [
            "VIEW",
            "ADD",
            "EDIT"
        ],
        displayText:null,
        reportType:"EMBED_TABLE_REPORT",
        type: Consts.REPORT_FORM_TYPE.CHILD_REPORT,
        orderIndex: 0,
        positionSameRow: false,
        relationshipId: relationshipId
    }
});

export const saveNewField = (appId, tblId, field, formId = null) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            if (appId && tblId && field) {
                let fieldsService = new FieldsService();

                const oldFieldId = field.id;
                const fieldCopy = transformFieldBeforeSave(field);
                delete fieldCopy.id;
                delete fieldCopy.isPendingEdit;

                fieldsService.createField(appId, tblId, fieldCopy).then(
                    (response) => {

                        const fieldId = response.data.id;

                        dispatch(updateFieldId(oldFieldId, fieldId, formId, appId, tblId));

                        if (field.parentTableId) {
                            createRelationship(appId, fieldId, tblId, field.parentTableId, field.parentFieldId).then(
                                (relationshipResponse) => {
                                    return relationshipResponse.data.id;
                                }
                            ).then(function(relationshipId) {
                                let formService = new FormService();
                                formService.getForm(appId, field.parentTableId).then(
                                    (formResponse) =>{
                                        let formMeta = formResponse.data.formMeta;
                                        let sections = formMeta.tabs[0].sections;
                                        let childReportExists = null;
                                        Object.keys(sections).forEach((sectionKey) =>{
                                            if (_.has(sections[sectionKey], 'headerElement.FormHeaderElement.displayText')) {
                                                if (_.includes(_.map(sections[sectionKey], 'headerElement.FormHeaderElement.displayText'), field.childTableName)) {
                                                    childReportExists = true;
                                                }
                                            }
                                        });
                                        if (childReportExists) {
                                            return null;
                                        } else {
                                            let length = Object.keys(sections).length;
                                            sections[length] = Object.assign(_.cloneDeep(sections[0]), {
                                                headerElement: headerElement(field.childTableName),
                                                elements: {0: childReportElement(relationshipId)},
                                                fields:[],
                                                orderIndex: length
                                            });
                                            return formMeta;
                                        }
                                    }
                                ).then(function(updatedForm) {
                                    if (updatedForm) {
                                        formService.updateForm(appId, field.parentTableId, updatedForm).then(
                                            () => resolve()
                                        );
                                    } else {
                                        resolve();
                                    }
                                }).catch(error =>{
                                    logger.parseAndLogError(LogLevel.ERROR, error, 'get/UpdateForm');
                                    reject();
                                });
                            }
                            ).catch(error => {
                                // unable to create a relationship, delete the field since it is not useful
                                logger.parseAndLogError(LogLevel.ERROR, error, 'fieldsService.createRelationship:');
                                fieldsService.deleteField(appId, tblId, fieldId);
                                reject();
                            });
                        } else {
                            resolve();
                        }
                    },
                    (errorResponse) => {
                        //  axios upgraded to an error.response object in 0.13.x
                        let error = errorResponse.response;
                        logger.parseAndLogError(LogLevel.ERROR, error, 'fieldsService.createField:');
                        dispatch(event(appId, tblId, types.LOAD_FIELDS_ERROR, {error:error}));
                        reject();
                    }
                ).catch(error => {
                    logger.error(error);
                    return Promise.reject(error);
                });
            } else {
                logger.error('fieldsService.getFields: Missing required input parameters.');
                let error = {
                    statusText:'Missing required input parameters to load fields',
                    status:500
                };
                dispatch(event(appId, tblId, types.LOAD_FIELDS_ERROR, {error:error}));
                reject();
            }
        });
    };
};

export const updateFieldProperties = (appId, tblId, field) => {

    return (dispatch) => {
        return new Promise((resolve, reject) => {
            if (appId && tblId && field) {
                let fieldsService = new FieldsService();

                const fieldCopy = transformFieldBeforeSave(field);
                delete fieldCopy.isPendingEdit;

                fieldsService.updateField(appId, tblId, fieldCopy).then(
                    (response) => {
                        //TODO: some action needs to get emitted
                        resolve();
                    },
                    (errorResponse) => {
                        //  axios upgraded to an error.response object in 0.13.x
                        let error = errorResponse.response;
                        logger.parseAndLogError(LogLevel.ERROR, error, 'fieldsService.createField:');
                        dispatch(event(appId, tblId, types.LOAD_FIELDS_ERROR, {error}));
                        reject();
                    }
                );
            } else {
                logger.error('fieldsService.getFields: Missing required input parameters.');
                let error = {
                    statusText:'Missing required input parameters to load fields',
                    status:500
                };
                dispatch(event(appId, tblId, types.LOAD_FIELDS_ERROR, {error}));
                reject();
            }
        });
    };
};

export const updateAllFieldsWithEdits = (appId, tableId) => {
    return (dispatch, getState) => {
        let fields = getFields(getState(), appId, tableId);

        const fieldPromises = fields.filter(field => field.isPendingEdit).map(field => dispatch(updateFieldProperties(appId, tableId, field)));
        if (fieldPromises.length === 0) {
            logger.info('No new fields to add when calling updateAllFieldsWithEdit against app: `{appId}`, tbl: `{tableId}`');
            return Promise.resolve();
        }

        return Promise.all(fieldPromises).then(() => {
            logger.debug('All promises processed in updateAllFieldsWithEdit against app: `{appId}`, tbl: `{tableId}`');
        }).catch(error => {
            logger.error(error);
        });
    };
};

export const deleteField = (appId, tableId, fieldId) => {
    return (dispatch, getState) => {
        let fieldService = new FieldsService();
        return fieldService.deleteField(appId, tableId, fieldId);
    };
};

export const saveAllNewFields = (appId, tableId, formId = null) => {
    return (dispatch, getState) => {
        let fields = getFields(getState(), appId, tableId);
        const fieldPromises = fields.filter(field => _.isString(field.id) && field.id.includes('newField')).map(field => dispatch(saveNewField(appId, tableId, field, formId)));

        if (fieldPromises.length === 0) {
            logger.info('No new fields to add when calling saveAllNewFields against app: `{appId}`, tbl: `{tableId}`');
            return Promise.resolve();
        }

        return Promise.all(fieldPromises).then(() => {
            logger.debug('All promises processed in saveAllNewFields against app: `{appId}`, tbl: `{tableId}`');
        }).catch(error => {
            logger.error(error);
        });
    };
};

export const loadFields = (appId, tblId) => {
    // we're returning a promise to the caller (not a Redux action) since this is an async action
    // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            if (appId && tblId) {
                dispatch(event(appId, tblId, types.LOAD_FIELDS));
                let fieldsService = new FieldsService();

                fieldsService.getFields(appId, tblId).then(
                    (response) => {
                        const fields = response.data;
                        dispatch(event(appId, tblId, types.LOAD_FIELDS_SUCCESS, {fields}));
                        resolve();
                    },
                    (errorResponse) => {
                        //  axios upgraded to an error.response object in 0.13.x
                        let error = errorResponse.response;
                        logger.parseAndLogError(LogLevel.ERROR, error, 'fieldsService.getFields:');
                        dispatch(event(appId, tblId, types.LOAD_FIELDS_ERROR, {error:error}));
                        reject();
                    }
                );
            } else {
                logger.error('fieldsService.getFields: Missing required input parameters.');
                let error = {
                    statusText:'Missing required input parameters to load fields',
                    status:500
                };
                dispatch(event(appId, tblId, types.LOAD_FIELDS_ERROR, {error:error}));
                reject();
            }
        });
    };
};
