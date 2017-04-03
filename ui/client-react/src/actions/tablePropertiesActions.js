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
    type: types.TABLE_PROPS_MENU_OPEN
});

export const tableMenuClosed = () => ({
    type: types.TABLE_PROPS_MENU_CLOSED
});

/**
 * track which property is currently being edited
 * @param editing ('name', 'description' etc.)
 */
export const setEditingProperty = (editing) => ({
    type: types.SET_PROPS_EDITING_PROPERTY,
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
    type: types.SET_TABLE_PROPS,
    property,
    value,
    validationError,
    isUserEdit
});

/**
 * save in progress
 */
export const updatingTable = () => ({
    type: types.UPDATING_TABLE
});

/**
 * save failed
 */
export const updatingTableFailed = () => ({
    type: types.UPDATING_TABLE_FAILED
});

/**
 * table was succesfully created
 */
export const updatedTable = () => ({
    type: types.UPDATED_TABLE
});

export const loadedTable = (tableInfo) => ({
    type: types.LOADED_TABLE_PROPS,
    tableInfo
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

            dispatch(updatingTable());

            const tableService = new TableService();
            //convert the tableInfo object that looks like {name: {value: <tableName>, editing: false}, description: {value: <>, editing: true} ...} into {name: <>, description: <>, ...}
            let newTableInfo = {};
            Object.keys(tableInfo).forEach(function(key, index) {
                newTableInfo[key] = tableInfo[key].value;
            });

            const promise = tableService.updateTable(appId, tableId, newTableInfo);

            promise.then(response => {
                dispatch(updatedTable());
                resolve(response);
            }).catch(error => {
                dispatch(updatingTableFailed());
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

export const loadTableProperties = (tableInfo) => {
    return (dispatch) => {
        tableInfo.tableNoun = "noun";
        tableInfo.description = "";
        tableInfo.icon = "report-table";
        dispatch(loadedTable(tableInfo));
    };
};
