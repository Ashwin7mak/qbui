import * as types from '../actions/types';
import constants from '../../../common/src/constants';
import TableService from '../services/tableService';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';
import AppHistory from '../globals/appHistory';
import Locale from '../locales/locales';
import UrlUtils from '../utils/urlUtils';
import {NotificationManager} from 'react-notifications';

/**
 * Actions related to table properties and settings page
 * @type {Logger}
 */

const logger = new Logger();

/**
 * expand the icon chooser from a button to a searchable grid
 */
export const openIconChooser = () => ({
    type: types.TABLE_PROPS_ICON_CHOOSER_OPEN,
    isOpen: true
});

/**
 * collapse the icon chooser
 */
export const closeIconChooser = () => ({
    type: types.TABLE_PROPS_ICON_CHOOSER_OPEN,
    isOpen: false
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
export const setTableProperty = (property, value, pendingValidationError, validationError, isUserEdit) => ({
    type: types.SET_TABLE_PROPS,
    property,
    value,
    pendingValidationError,
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
 * table was succesfully saved
 */
export const tableSaved = (tableInfo) => ({
    type: types.TABLE_SAVED,
    tableInfo
});

/**
 * delete failed
 */
export const deletingTableFailed = () => ({
    type: types.DELETING_TABLE_FAILED
});

/**
 * table was succesfully deleted
 */
export const tableDeleted = () => ({
    type: types.TABLE_DELETED
});

export const resetEditedTableProperties = () => ({
    type: types.RESET_TABLE_PROPS
});

/**
 * update the table on the server
 * @param appId
 * @param tableInfo
 * @returns {function(*=)}
 */
export const updateTable = (appId, tableId, tableInfo) => {

    return (dispatch) => {

        return new Promise((resolve, reject) => {

            dispatch(savingTable());

            const tableService = new TableService();
            //convert the tableInfo object that looks like {name: {value: <tableName>, editing: false}, description: {value: <>, editing: true} ...} into {name: <>, description: <>, ...}
            let newTableInfo = {};
            Object.keys(tableInfo).forEach(function(key, index) {
                newTableInfo[key] = tableInfo[key].value;
            });

            const promise = tableService.updateTable(appId, tableId, newTableInfo);

            promise.then(response => {
                dispatch(tableSaved(tableInfo));
                resolve(response);
            }).catch(error => {
                dispatch(savingTableFailed(error));
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

export const deleteTable = (appId, tableId) => {
    return (dispatch) => {

        return new Promise((resolve, reject) => {

            dispatch(savingTable());
            const tableService = new TableService();
            tableService.deleteTable(appId, tableId).then((response) => {
                dispatch(tableDeleted());
                // navigate to app home page
                let link = UrlUtils.getAppHomePageLink(appId);
                AppHistory.history.push(link);
                resolve(response);
            }).catch(error => {
                dispatch(deletingTableFailed(error));
                NotificationManager.error(Locale.getMessage('tableEdit.tableDeleteFailed'), Locale.getMessage('failed'));
                if (error.response) {
                    if (error.response.status === constants.HttpStatusCode.FORBIDDEN) {
                        logger.parseAndLogError(LogLevel.WARN, error.response, 'tableService.deleteTable:');
                    } else {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'tableService.deleteTable:');
                    }
                }
                reject(error);
            });
        });
    };
};

export const loadTableProperties = (tableInfo) => ({
    type: types.LOADED_TABLE_PROPS,
    tableInfo
});

/**
 * someone (the app homepage currently) needs to pop up a notification
 * @param notify true if notification is needed, false if the notification has been performed
 */
export const notifyTableDeleted = (notify) => ({
    type: types.NOTIFY_TABLE_DELETED,
    notifyTableDeleted: notify
});
