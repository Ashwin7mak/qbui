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
 * Construct reports store payload
 *
 * @param context - context
 * @param type - event type
 * @param content - optional content related to event type
 * @returns {{id: *, type: *, content: *}}
 */
function event(context, type, content) {
    let id = context;
    return {
        id: id,
        type: type,
        content: content || null
    };
}

/**
 * Update the route of the report builder.
 * @param context
 * @param route
 */
export const updateReportRedirectRoute = (context, route) => {
    return event(context, types.UPDATE_REPORT_REDIRECT_ROUTE, {route});
};

/**
 * Sets isPendingEdit to false.
 * @param context
 */
export const setReportBuilderPendingEditToFalse = (context) => {
    return event(context, types.SET_IS_PENDING_EDIT_TO_FALSE);
};

/**
 * Refresh the fields for the field select menu.
 * @param context
 * @param appId
 * @param tblId
 */
export const refreshFieldSelectMenu = (context, appId, tblId) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            let fieldsService = new FieldsService();
            fieldsService.getFields(appId, tblId)
                .then(response => {
                    logger.debug('FieldsService getFields success');
                    dispatch(event(context, types.REFRESH_FIELD_SELECT_MENU, {response}));
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
 * @param clickedColumnId
 * @param addBeforeColumn
 */
export const insertPlaceholderColumn = (context, clickedColumnId, addBeforeColumn) => {
    return event(context, types.INSERT_PLACEHOLDER_COLUMN, {clickedColumnId, addBeforeColumn});
};

/**
 * Add the selected field to the report table.
 * @param context
 * @param requestedColumn
 * @param addBefore
 */
export const addColumnFromExistingField = (context, requestedColumn, addBefore) => {
    return event(context, types.ADD_COLUMN_FROM_EXISTING_FIELD, {requestedColumn, addBefore});
};

/**
 * Hide a column based on the column id given.
 * @param context
 * @param clickedId
 */
export const hideColumn = (context, clickedId) => {
    return event(context, types.HIDE_COLUMN, {clickedId});
};

/**
 * Enter report builder mode
 * @param context
 */
export const enterBuilderMode = (context) => {
    return event(context, types.ENTER_BUILDER_MODE, {});
};

/**
 * Exit report builder mode
 * @param context
 */
export const exitBuilderMode = (context) => {
    return event(context, types.EXIT_BUILDER_MODE, {});
};

/**
 * Move a column based on the source and target ids given.
 * @param context
 * @param sourceLabel
 * @param targetLabel
 */
export const moveColumn = (context, sourceLabel, targetLabel) => {
    return event(context, types.MOVE_COLUMN, {sourceLabel, targetLabel});
};

export const draggingColumnStart = sourceLabel => {
    return {
        type: types.DRAGGING_COLUMN_START,
        content: {sourceLabel}
    };
};

export const draggingColumnEnd = () => {
    return {
        type: types.DRAGGING_COLUMN_END
    };
};

/**
 * Change the reportName of the report
 * @param context
 * @param newName - the new report name
 */
export const changeReportName = (context, newName) => {
    return event(context, types.CHANGE_REPORT_NAME, {newName});
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
                        dispatch(event(null, types.SET_IS_PENDING_EDIT_TO_FALSE));
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
