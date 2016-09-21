// action creators
import * as actions from '../constants/actions';
import FormService from '../services/formService';
import Promise from 'bluebird';

import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

import { browserHistory } from 'react-router';

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

function updateQueryStringParam(key, value) {
    var baseUrl = [location.protocol, '//', location.host, location.pathname].join(''),
        urlQueryString = document.location.search,
        newParam = key + '=' + value,
        params = '?' + newParam;

    // If the "search" string exists, then build params from it
    if (urlQueryString) {
        let keyRegex = new RegExp('([\?&])' + key + '[^&]*');

        // If param exists already, update it
        if (urlQueryString.match(keyRegex) !== null) {
            params = urlQueryString.replace(keyRegex, "$1" + newParam);
        } else { // Otherwise, add it to end of query string
            params = urlQueryString + '&' + newParam;
        }
    }
    window.history.replaceState({}, "", baseUrl + params);
};
let formActions = {

    openRecordForEdit(appId, tblId, recordId, rptId) {
        console.log('edit', recordId);
        console.log(browserHistory);
        console.log(this);

        updateQueryStringParam("er",recordId);

        this.flux.actions.loadFormAndRecord(appId, tblId, recordId, rptId, "edit").then(() => {
            console.log('loaded form');
            this.dispatch(actions.SHOW_TROWSER);
        });
    },

    loadFormAndRecord(appId, tblId, recordId, rptId, formType) {
        //  promise is returned in support of unit testing only
        return new Promise((resolve, reject) => {
            if (appId && tblId && recordId) {
                this.dispatch(actions.LOAD_FORM_AND_RECORD);

                let formService = new FormService();
                formService.getFormAndRecord(appId, tblId, recordId, rptId, formType).then(
                    (response) => {
                        resolve();
                        this.dispatch(actions.LOAD_FORM_AND_RECORD_SUCCESS, response.data);
                    },
                    (error) => {
                        //  axios upgraded to an error.response object in 0.13.x
                        if (error.response.status === 403) {
                            logger.parseAndLogError(LogLevel.WARN, error.response, 'formService.loadFormAndRecord:');
                        } else {
                            logger.parseAndLogError(LogLevel.ERROR, error.response, 'formService.loadFormAndRecord:');
                        }
                        this.dispatch(actions.LOAD_FORM_AND_RECORD_FAILED, error.response.status);
                        reject();
                    }
                );
            } else {
                logger.error('formService.loadFormAndRecord: Missing required input parameters.');
                reject();
            }
        });
    }
};

export default formActions;
