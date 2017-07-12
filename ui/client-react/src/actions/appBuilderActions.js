import * as types from '../actions/types';
import AppService from '../services/appService';
import Logger from '../utils/logger';

/**
 * Create new app event.   Used to inform that a new
 * app is getting created on the servers.
 */
export const createNewApp = () => ({
    type: types.CREATE_APP
});

/**
 * A new app was successfully saved
 *
 * @param app
 */
export const createAppSuccess = (app) => ({
    type: types.CREATE_APP_SUCCESS,
    app: app
});

/**
 * An error was thrown when creating an app
 */
export const createAppFailed = () => ({
    type: types.CREATE_APP_FAILED
});

/**
 * create the app on the server
 *
 * @param app object
 * @returns {function(*=)}
 */
export const createApp = (app) => {

    return (dispatch) => {

        const logger = new Logger();

        return new Promise((resolve, reject) => {
            dispatch(createNewApp());
            const appService = new AppService();
            appService.createApp(app).then(
                response => {
                    //  TODO: not sure if this is the correct response in include in event
                    dispatch(createAppSuccess(response.data));
                    resolve(response);
                }
            ).catch(error => {
                dispatch(createAppFailed());
                logger.logException(error, 'appBulderActions:createNewApp');
                reject(error);
            });
        });
    };
};
/**
 * setAppProperty captures the value from the inputs on appCreationPanel
 * It is used to set the properties needed for creating a new app
 * @param property
 * @param value
 * @param pendingValidationError
 * @param validationError
 * */
export const setAppProperty = (property, value, pendingValidationError, validationError, hasFocus) => ({
    type: types.SET_APP_PROPERTY,
    property,
    value,
    pendingValidationError,
    validationError,
    hasFocus
});

export const showAppCreationDialog = () => ({
    type: types.SHOW_APP_CREATION_DIALOG
});

export const hideAppCreationDialog = () => ({
    type: types.HIDE_APP_CREATION_DIALOG
});

export const openIconChooserForApp = () => ({
    type: types.OPEN_ICON_CHOOSER_FOR_APP
});

export const closeIconChooserForApp = () => ({
    type: types.CLOSE_ICON_CHOOSER_FOR_APP
});
