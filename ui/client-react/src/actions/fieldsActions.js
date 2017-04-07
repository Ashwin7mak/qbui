// action creators
import _ from 'lodash';
import FieldsService from '../services/fieldsService';
import Promise from 'bluebird';
import * as types from '../actions/types';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';
import {getFields} from '../reducers/fields';

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

export const updateFieldId = (oldFieldId, newFieldId, formId = null) => {
    return {
        type: types.UPDATE_FIELD_ID,
        oldFieldId,
        newFieldId,
        formId
    };
};

export const updateField = field => {
    return {
        type: types.UPDATE_FIELD,
        field
    };
};

export const saveNewField = (appId, tblId, field, formId = null) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            if (appId && tblId && field) {
                let fieldsService = new FieldsService();

                const oldFieldId = field.id;
                delete field.id;
                delete field.isPendingEdits;

                fieldsService.createField(appId, tblId, field).then(
                    (response) => {
                        dispatch(updateFieldId(oldFieldId, response.data.id, formId));
                        resolve();
                    },
                    (errorResponse) => {
                        //  axios upgraded to an error.response object in 0.13.x
                        let error = errorResponse.response;
                        logger.parseAndLogError(LogLevel.ERROR, error, 'fieldsService.createField:');
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

export const updateFieldProperties = (appId, tblId, field) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            if (appId && tblId && field) {
                let fieldsService = new FieldsService();

                delete field.isPendingEdits;

                fieldsService.updateField(appId, tblId, field).then(
                    (response) => {
                        //TODO: some action needs to get emitted
                        resolve();
                    },
                    (errorResponse) => {
                        //  axios upgraded to an error.response object in 0.13.x
                        let error = errorResponse.response;
                        logger.parseAndLogError(LogLevel.ERROR, error, 'fieldsService.createField:');
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

export const updateAllFieldsWithEdits = (appId, tableId) => {
    return (dispatch, getState) => {
        let fields = getFields(getState().fields);
        const fieldPromises = fields.filter(field => field.isPendingEdits).map(field => dispatch(updateFieldProperties(appId, tableId, field)));

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

export const saveAllNewFields = (appId, tableId, formId = null) => {
    return (dispatch, getState) => {
        let fields = getFields(getState().fields);
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
                        dispatch(event(appId, tblId, types.LOAD_FIELDS_SUCCESS, {fields:response.data}));
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
