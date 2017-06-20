import FieldsService from '../services/fieldsService';
import ReportService from '../services/reportService';
import Promise from 'bluebird';
import NotificationManager from '../../../reuse/client/src/scripts/notificationManager';
import NavigationUtils from '../utils/navigationUtils';
import Locale from '../locales/locales';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

import * as types from '../actions/types';

let logger = new Logger();

/**
 * Update the route of the report builder.
 * @param route
 */
export const updateReportRedirectRoute = route => {
    return {
        type: types.UPDATE_REPORT_REDIRECT_ROUTE,
        content: {route}
    };
};

/**
 * Sets isPendingEdit to false.
 */
export const setReportBuilderPendingEditToFalse = () => {
    return {
        type: types.SET_IS_PENDING_EDIT_TO_FALSE
    };
};

/**
 * Refresh the fields for the field select menu.
 * @param appId
 * @param tblId
 */
export const refreshFieldSelectMenu = (appId, tblId) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            let fieldsService = new FieldsService();
            fieldsService.getFields(appId, tblId)
                .then(response => {
                    logger.debug('FieldsService getFields success');
                    dispatch({type: types.REFRESH_FIELD_SELECT_MENU, content: {response}});
                    resolve();
                }).catch(error => {
                    logger.parseAndLogError(LogLevel.ERROR, error.response, 'fieldsService.getFields:');
                    reject();
                });
        });
    };
};

/**
 * Inserts a placeholder columns in the grid before/after the specified id.
 * Will remove any other placeholder columns in the grid.
 * @param context
 * @param clickedColumnName
 * @param addBeforeColumn
 */
export const insertPlaceholderColumn = (context, clickedColumnName, addBeforeColumn) => {
    return {
        id: context,
        type: types.INSERT_PLACEHOLDER_COLUMN,
        content: {clickedColumnName, addBeforeColumn}
    };
};

/**
 * Add the selected field to the report table.
 * @param context
 * @param requestedColumn
 * @param addBefore
 */
export const addColumnFromExistingField = (context, requestedColumn, addBefore) => {
    return {
        id: context,
        type: types.ADD_COLUMN_FROM_EXISTING_FIELD,
        content: {requestedColumn, addBefore}
    };
};

/**
 * Hide a column based on the column id given.
 * @param context
 * @param clickedId
 */
export const hideColumn = (context, clickedId) => {
    return {
        id: context,
        type: types.HIDE_COLUMN,
        content: {clickedId}
    };
};

/**
 * Enter report builder mode
 */
export const enterBuilderMode = () => {
    return {
        type: types.ENTER_BUILDER_MODE
    };
};

/**
 * Exit report builder mode
 */
export const exitBuilderMode = () => {
    return {
        type: types.EXIT_BUILDER_MODE
    };
};

/**
 * Move a column based on the source and target ids given.
 * @param context
 * @param sourceLabel
 * @param targetLabel
 */
export const moveColumn = (context, sourceLabel, targetLabel) => {
    return {
        id: context,
        type: types.MOVE_COLUMN,
        content: {sourceLabel, targetLabel}
    };
};

/**
 * Change the reportName of the report
 * @param context
 * @param newName - the new report name
 */
export const changeReportName = (context, newName) => {
    return {
        id: context,
        type: types.CHANGE_REPORT_NAME,
        content: {newName}
    };
};

/**
 * Save and updates the report with new data
 * @param appId
 * @param tblId
 * @param rptId
 * @param reportDef
 * @param redirectRoute
 */
export const saveReport = (appId, tblId, rptId, reportDef, redirectRoute) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            if (appId && tblId && rptId) {
                let reportService = new ReportService();
                reportService.updateReport(appId, tblId, rptId, reportDef)
                    .then((response) => {
                        logger.debug('ReportService updateReport success');
                        dispatch({type: types.SET_IS_PENDING_EDIT_TO_FALSE});
                        NavigationUtils.goBackToLocationOrTable(appId, tblId, redirectRoute);
                        NotificationManager.success(Locale.getMessage('report.notification.save.success'), Locale.getMessage('success'));
                        resolve();
                    }, (error) => {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'reportService.updateReport');
                        NotificationManager.error(Locale.getMessage('report.notification.save.error'), Locale.getMessage('failed'));
                        reject();
                    })
                    .catch((ex) => {
                        logger.logException(ex);
                        NotificationManager.error(Locale.getMessage('report.notification.save.error'), Locale.getMessage('failed'));
                        reject();
                    });
            } else {
                logger.error(`reportActions.updateReport: missing required input parameters. appId: ${appId}, tblId: ${tblId}, rptId: ${rptId}`);
                reject();
            }
        });
    };
};
