// action creators
import * as actions from '../constants/actions';
import FieldsService from '../services/fieldsService';
import Promise from 'bluebird';

import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

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
