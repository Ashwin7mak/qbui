import * as types from '../actions/types';
import constants from '../../../common/src/constants';
import TableService from '../services/tableService';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

const logger = new Logger();

export const showTableCreationDialog = () => ({
    type: types.SHOW_TABLE_CREATION_DIALOG
});

export const hideTableCreationDialog = () => ({
    type: types.HIDE_TABLE_CREATION_DIALOG
});

export const showTableReadyDialog = () => ({
    type: types.SHOW_TABLE_READY_DIALOG
});

export const hideTableReadyDialog = () => ({
    type: types.HIDE_TABLE_READY_DIALOG
});

/**
 * expand the icon chooser from a button to a searchable grid
 */
export const openIconChooser = () => ({
    type: types.TABLE_ICON_CHOOSER_OPEN,
    isOpen: true
});

/**
 * collapse the icon chooser
 */
export const closeIconChooser = () => ({
    type: types.TABLE_ICON_CHOOSER_OPEN,
    isOpen: false
});

/**
 * track which property is currently being edited
 * @param editing ('name', 'description' etc.)
 */
export const setEditingProperty = (editing) => ({
    type: types.SET_EDITING_PROPERTY,
    editing
});

/**
 * update a table property
 * @param property 'name', 'description' etc.
 * @param value input value
 * @param pendingValidationError pending validation error message if user left field (or null if none)
 * @param validationError validation error message to display (or null if none)
 * @param isUserEdit is a user edit (edit was initiated by the user)
 */
export const setTableProperty = (property, value, pendingValidationError, validationError, isUserEdit) => ({
    type: types.SET_TABLE_CREATION_PROPERTY,
    property,
    value,
    pendingValidationError,
    validationError,
    isUserEdit
});

/**
 * save in progress
 */
export const creatingTable = () => ({
    type: types.CREATING_TABLE
});

/**
 * save failed
 */
export const creatingTableFailed = () => ({
    type: types.CREATING_TABLE_FAILED
});

/**
 * table was succesfully created
 */
export const createdTable = () => ({
    type: types.CREATED_TABLE
});

/**
 * create the table on the server
 * @param appId
 * @param tableInfo
 * @returns {function(*=)}
 */
export const createTable = (appId, tableInfo) => {

    return (dispatch) => {

        return new Promise((resolve, reject) => {

            dispatch(creatingTable());

            const tableService = new TableService();

            const promise = tableService.createTableComponents(appId, tableInfo);

            promise.then(response => {
                dispatch(createdTable());
                resolve(response);
            }).catch(error => {
                dispatch(creatingTableFailed());
                if (error.response) {
                    if (error.response.status === constants.HttpStatusCode.FORBIDDEN) {
                        logger.parseAndLogError(LogLevel.WARN, error.response, 'tableService.createTable:');
                    } else {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'tableService.createTable:');
                    }
                }
                reject(error);
            });
        });
    };
};

/**
 * someone (the form builder currently) needs to pop up a notification
 * @param notify true if notification is needed, false if the notification has been performed
 */
export const notifyTableCreated = (notify) => ({
    type: types.NOTIFY_TABLE_CREATED,
    notifyTableCreated: notify
});
