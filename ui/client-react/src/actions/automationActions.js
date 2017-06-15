import AutomationService from '../services/automationService';
import Promise from 'bluebird';
import _ from 'lodash';

import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

import * as types from '../actions/types';
import {CONTEXT} from '../actions/context';
import NotificationManager from '../../../reuse/client/src/scripts/notificationManager';
import Locale from '../locales/locales';

let logger = new Logger();

/**
 * Construct automation store redux store payload
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

/**
 * Retrieve an automation.
 *
 * @param appId - app id
 * @param automationId - automation id
 */
export const loadAutomation = (appId, automationId) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            if (appId && automationId) {
                logger.debug(`AutomationsAction.loadAutomation: loading automation for appId: ${appId} and automationId: ${automationId}`);

                dispatch(event(null, types.LOAD_AUTOMATION, {appId: appId, automationId: automationId}));

                let automationService = new AutomationService();
                automationService.getAutomation(appId, automationId)
                    .then((response) => {
                        logger.debug('AutomationService getAutomation success');
                        dispatch(event(null, types.LOAD_AUTOMATION_SUCCESS, response.data));
                        resolve();
                    })
                    .catch((error) => {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'automationService.getAutomation:');
                        dispatch(event(null, types.LOAD_AUTOMATION_FAILED, error));
                        reject();
                    });
            } else {
                logger.error(`automationService.getAutomation: Missing required input parameters.  appId: ${appId}, automationId: ${automationId}`);
                dispatch(event(null, types.LOAD_AUTOMATION_FAILED, 500));
                reject();
            }
        });
    };
};

/**
 * Save an automation.
 *
 * @param appId - app id
 * @param automationId - automation id
 * @param automation - the automation to save
 */
export const saveAutomation = (appId, automationId, automation) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            if (appId && automationId) {
                logger.debug(`AutomationsAction.saveAutomation: saving automation for appId: ${appId} and automationId: ${automationId}`);

                dispatch(event(null, types.SAVE_AUTOMATION, {appId: appId, automationId: automationId, automation: automation}));

                let automationService = new AutomationService();
                automationService.saveAutomation(appId, automationId, automation)
                    .then((response) => {
                        logger.debug('AutomationService saveAutomation success');
                        NotificationManager.success(Locale.getMessage('automation.saveAutomation.success'), Locale.getMessage('success'));
                        dispatch(event(null, types.SAVE_AUTOMATION_SUCCESS, response.data));
                        resolve();
                    })
                    .catch((error) => {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'automationService.saveAutomation:');
                        NotificationManager.error(Locale.getMessage('automation.saveAutomation.error'), Locale.getMessage('failed'));
                        dispatch(event(null, types.SAVE_AUTOMATION_FAILED, error));
                        reject();
                    });
            } else {
                logger.error(`automationService.saveAutomation: Missing required input parameters.  appId: ${appId}, automationId: ${automationId}`);
                NotificationManager.error(Locale.getMessage('automation.saveAutomation.error'), Locale.getMessage('failed'));
                dispatch(event(null, types.SAVE_AUTOMATION_FAILED, 500));
                reject();
            }
        });
    };
};

export const testAutomation = (automationName, appId) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            if (automationName && appId) {
                logger.debug(`AutomationsAction.testAutomation: Testing automation with Automation ID : ${automationName}`);
                dispatch(event(automationName, appId, types.TEST_AUTOMATION));
                let automationService = new AutomationService();
                automationService.invokeAutomation(appId, automationName, null)
                    .then((response) => {
                        logger.debug('AutomationService testAutomationSuccess');
                        NotificationManager.info(Locale.getMessage('automation.testAutomation.success'), Locale.getMessage('success'));
                        dispatch(event(automationName, types.TEST_AUTOMATION_SUCCESS, response.data));
                        resolve();
                    })
                    .catch((error) => {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'AutomationService.testAutomation');
                        NotificationManager.error(Locale.getMessage('automation.testAutomation.error'), Locale.getMessage('failed'));
                        dispatch(event(automationName, types.TEST_AUTOMATION_FAILED, error));
                        reject();
                    });
            } else {
                logger.error(`AutomationService.testAutomation: Missing required input parameters. Automation ID : ${automationName}`);
                dispatch(event(automationName, types.TEST_AUTOMATION_FAILED, error));
                NotificationManager.error(Locale.getMessage('automation.testautomation.error'), Locale.getMessage('failed'));
                reject();
            }
        });
    };
};

export const changeAutomationEmailTo = (newTo) => {
    return (dispatch) => dispatch(event(null, types.CHANGE_AUTOMATION_EMAIL_TO, {newTo}));
};

export const changeAutomationEmailSubject = (newSubject) => {
    return (dispatch) => dispatch(event(null, types.CHANGE_AUTOMATION_EMAIL_SUBJECT, {newSubject}));
};

export const changeAutomationEmailBody = (newBody) => {
    return (dispatch) => dispatch(event(null, types.CHANGE_AUTOMATION_EMAIL_BODY, {newBody}));
};
