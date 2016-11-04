// action creators
import * as actions from '../constants/actions';
import FieldsService from '../services/fieldsService';
import Promise from 'bluebird';

import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

//  Custom handling of 'possible unhandled rejection' error,  because we don't want
//  to see an exception in the console output.  The exception is thrown by bluebird
//  because the core application code has no logic implemented to handle a rejected
//  promise.  This is expected as promises are NOT implemented in the application
//  code.  Promises are returned only to support our unit tests, which are expected
//  to implement the appropriate handlers.
Promise.onPossiblyUnhandledRejection(function(err) {
    let logger = new Logger();
    logger.debug('Bluebird Unhandled rejection', err);
});

let fieldsActions = {

    loadFields: function(appId, tblId) {
        let logger = new Logger();

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
