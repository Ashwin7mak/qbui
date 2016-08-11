// action creators
import * as actions from '../constants/actions';
import FormService from '../services/formService';
import Promise from 'bluebird';

import Logger from '../utils/logger';
let logger = new Logger();

import {sampleFormJSON} from '../mocks/forms.js';

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

    loadFormAndRecord: function(appId, tblId, recordId, rptId, formType) {
        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            if (appId && tblId && recordId) {
                this.dispatch(actions.LOAD_FORM_AND_RECORD);

                let formService = new FormService();
                formService.getFormAndRecord(appId, tblId, recordId, rptId, formType).then(
                    (response) => {
                        //  TODO: temporary until new endpoint is in place and forms data is always returned..
                        if (!response) {
                            response = {data:sampleFormJSON};
                        }
                        this.dispatch(actions.LOAD_FORM_AND_RECORD_SUCCESS, response.data);
                        resolve();
                    },
                    (error) => {
                        logger.error('FormService getFormAndRecord error:' + JSON.stringify(error), error);
                        this.dispatch(actions.LOAD_FORM_AND_RECORD_FAILED);
                        reject();
                    }
                ).catch((ex) => {
                    logger.error('FormService getFormAndRecord exception:' + JSON.stringify(ex), ex);
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
