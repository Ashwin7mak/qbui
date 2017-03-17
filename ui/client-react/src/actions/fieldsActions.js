// action creators
import * as actions from '../constants/actions';
import FieldsService from '../services/fieldsService';
import Promise from 'bluebird';
import * as types from '../actions/types';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

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
function event(app, tbl, type, content) {
    return {
        appId:app,
        tblId:tbl,
        type: type,
        content: content || null
    };
}

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

let fieldsActions = {

    loadFields: function(appId, tblId) {

        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            if (appId && tblId) {
                this.dispatch(actions.LOAD_FIELDS);
                let fieldsService = new FieldsService();

                fieldsService.getFields(appId, tblId).then(
                    (response) => {
                        this.dispatch(actions.LOAD_FIELDS_SUCCESS, {appId, tblId, data: response.data});
                        resolve();
                    },
                    (error) => {
                        //  axios upgraded to an error.response object in 0.13.x
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'fieldsService.getFields:');
                        this.dispatch(actions.LOAD_FIELDS_FAILED, error.response.status);
                        reject();
                    }
                ).catch((ex) => {
                    // TODO - remove catch block and update onPossiblyUnhandledRejection bluebird handler
                    logger.logException(ex);
                    reject();
                });
            } else {
                logger.error('fieldsService.getFields: Missing required input parameters.');
                this.dispatch(actions.LOAD_FIELDS_FAILED, 500);
                reject();
            }
        });
    }
};

export default fieldsActions;
