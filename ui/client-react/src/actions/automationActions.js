import AutomationService from '../services/automationService';
import Promise from 'bluebird';
import _ from 'lodash';

import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

import * as types from '../actions/types';
import {CONTEXT} from '../actions/context';

let logger = new Logger();

/**
 * Construct reports store redux store payload
 *
 * @param context - report context id (nav, embedded report, etc)
 * @param type - event type
 * @param content - optional content related to event type
 * @returns {{id: *, type: *, content: *}}
 */
function event(context, type, content) {
    return {
        context: context,
        type: type,
        content: content || null
    };
}

/**
 * Retrieve a list of automations for the given app.
 *
 * @param appId - app id
 */
export const loadAutomations = (context, appId) => {
    // we're returning a promise to the caller (not a Redux action) since this is an async action
    // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            if (context && appId) {
                logger.debug(`AutomationsAction.loadAutomations: loading automation list for appId: ${appId}`);

                dispatch(event(context, types.LOAD_AUTOMATIONS, appId));

                let automationService = new AutomationService();
                automationService.getAutomations(appId)
                    .then((response) => {
                        logger.debug('AutomationService getAutomations success');
                        dispatch(event(context, types.LOAD_AUTOMATIONS_SUCCESS, response.data));
                        resolve();
                    })
                    .catch((error) => {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'automationService.getAutomations:');
                        dispatch(event(context, types.LOAD_AUTOMATIONS_FAILED, error));
                        reject();
                    });
            } else {
                logger.error(`automationService.getAutomations: Missing required input parameters.  appId: ${appId}`);
                dispatch(event(null, types.LOAD_AUTOMATIONS_FAILED, 500));
                reject();
            }
        });
    };
};
