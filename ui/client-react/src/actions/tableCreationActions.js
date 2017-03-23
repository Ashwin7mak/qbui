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

export const nextTableCreationPage = () => ({
    type: types.NEXT_TABLE_CREATION_PAGE
});

export const previousTableCreationPage = () => ({
    type: types.PREVIOUS_TABLE_CREATION_PAGE
});

export const tableMenuOpened = () => ({
    type: types.TABLE_CREATION_MENU_OPEN
});

export const tableMenuClosed = () => ({
    type: types.TABLE_CREATION_MENU_CLOSED
});

export const setEditingProperty = (editing) => ({
    type: types.SET_EDITING_PROPERTY,
    editing
});

export const setTableProperty = (property, value, validationError, isUserEdit) => ({
    type: types.SET_TABLE_CREATION_PROPERTY,
    property,
    value,
    validationError,
    isUserEdit
});

export const savingTable = () => ({
    type: types.SAVING_TABLE
});

export const savingTableFailed = () => ({
    type: types.SAVING_TABLE_FAILED
});

export const createdTable = () => ({
    type: types.CREATED_TABLE
});


export const createTable = (appId, tableInfo) => {

    return (dispatch) => {

        return new Promise((resolve, reject) => {

            dispatch(savingTable());

            const tableService = new TableService();

            const promise = tableService.createTableComponents(appId, tableInfo);

            promise.then(response => {

                dispatch(createdTable());
                resolve(response);
            }).catch(error => {
                dispatch(savingTableFailed());
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

export const notifyTableCreated = (notifyTableCreated) => ({
    type: types.NOTIFY_TABLE_CREATED,
    notifyTableCreated
});
