import * as types from '../actions/types';
import constants from '../../../common/src/constants';
import TableService from '../services/tableService';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

const logger = new Logger();


/**
 * a dropdown menu was opened, UI may need to enable CSS overflow
 * until it closes
 */
export const tableMenuOpened = () => ({
    type: types.TABLE_CREATION_MENU_OPEN
});

export const tableMenuClosed = () => ({
    type: types.TABLE_CREATION_MENU_CLOSED
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
 * @param validationError validation error message (or null if none)
 * @param isUserEdit is a user edit (edit was initiated by the user)
 */
export const setTableProperty = (property, value, validationError, isUserEdit) => ({
    type: types.SET_TABLE_PROPERTY,
    property,
    value,
    validationError,
    isUserEdit
});

/**
 * save in progress
 */
export const savingTable = () => ({
    type: types.SAVING_TABLE
});

/**
 * save failed
 */
export const savingTableFailed = () => ({
    type: types.SAVING_TABLE_FAILED
});

/**
 * table was succesfully created
 */
export const updatedTable = () => ({
    type: types.UPDATED_TABLE
});

/**
 * create the table on the server
 * @param appId
 * @param tableInfo
 * @returns {function(*=)}
 */
export const updateTable = (appId, tableId, tableInfo) => {

    return (dispatch) => {

        return new Promise((resolve, reject) => {

            dispatch(savingTable());

            const tableService = new TableService();

            const promise = tableService.updateTable(appId, tableId, tableInfo);

            promise.then(response => {
                dispatch(updatedTable());
                resolve(response);
            }).catch(error => {
                dispatch(savingTableFailed());
                if (error.response) {
                    if (error.response.status === constants.HttpStatusCode.FORBIDDEN) {
                        logger.parseAndLogError(LogLevel.WARN, error.response, 'tableService.updateTable:');
                    } else {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'tableService.updateTable:');
                    }
                }
                reject(error);
            });
        });
    };
};

export const getTableProperties = (appId, tableId) => {

    return (dispatch) => {

        return new Promise((resolve, reject) => {
            const tableService = new TableService();
            resolve({name: "name", description: "desc", tableIcon: "icon", tableNoun: "noun"});
            //const promise = tableService.updateTable(appId, tableInfo);
            //
            //promise.then(response => {
            //    dispatch(updatedTable());
            //    resolve(response);
            //}).catch(error => {
            //    dispatch(savingTableFailed());
            //    if (error.response) {
            //        if (error.response.status === constants.HttpStatusCode.FORBIDDEN) {
            //            logger.parseAndLogError(LogLevel.WARN, error.response, 'tableService.updateTable:');
            //        } else {
            //            logger.parseAndLogError(LogLevel.ERROR, error.response, 'tableService.updateTable:');
            //        }
            //    }
            //    reject(error);
            //});
        });
    };
};

/**
 * someone (the form builder currently) needs to pop up a notification
 * @param notify true if notification is needed, false if the notification has been performed
 */
export const notifyTableUpdated = (notify) => ({
    type: types.NOTIFY_TABLE_UPDATED,
    notifyTableUpdated: notify
});
