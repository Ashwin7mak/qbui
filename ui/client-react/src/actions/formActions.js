// action creators
import * as actions from '../constants/actions';
import FormService from '../services/formService';
import Promise from 'bluebird';

import Logger from '../utils/logger';
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

    loadFormAndRecord: function(appId, tblId, recordId, formType) {
        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            if (appId && tblId && recordId) {
                this.dispatch(actions.LOAD_FORM_AND_RECORD);

                //this.dispatch(actions.LOAD_FORM_AND_RECORD_SUCCESS);
                //TODO: make the real call after node supports the end point.
                let formService = new FormService();
                formService.getFormAndRecord(appId, tblId, recordId, formType).then(
                    (response) => {
                        this.dispatch(actions.LOAD_FORM_AND_RECORD_SUCCESS, response.data);
                        resolve();
                    },
                    (error) => {
                        logger.debug('FormService getFormAndRecord error:' + JSON.stringify(error));
                        this.dispatch(actions.LOAD_FORM_AND_RECORD_FAILED);
                        reject();
                    }
                ).catch((ex) => {
                    logger.debug('FormService getFormAndRecord exception:' + JSON.stringify(ex));
                    this.dispatch(actions.LOAD_FORM_AND_RECORD_FAILED);
                    reject();
                });
            } else {
                logger.error('Missing required input parameters for formService.getFormAndRecord.');
                this.dispatch(actions.LOAD_FORM_AND_RECORD_FAILED);
                reject();
            }
        });
    }
};

export default formActions;
