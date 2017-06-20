import * as types from '../actions/types';

export const showAppCreationDialog = () => ({
    type: types.SHOW_APP_CREATION_DIALOG
});

export const hideAppCreationDialog = () => ({
    type: types.HIDE_APP_CREATION_DIALOG
});

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
                    dispatch(createAppSuccess(response));
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
