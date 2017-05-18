import FieldsService from '../services/fieldsService';
import Promise from 'bluebird';

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

export const toggleFieldSelectMenu = (context) => {
    return event(context, types.TOGGLE_FIELD_SELECT_MENU, {});
}

/**
 * Toggle the field select menu open.
 * @param context
 * @param clickedColumnId
 * @param addBeforeColumn
 */
export const openFieldSelectMenu = (context, clickedColumnId, addBeforeColumn) => {
    return event(context, types.OPEN_FIELD_SELECT_MENU, {clickedColumnId, addBeforeColumn});
};

/**
 * Toggle the field select menu closed.
 * @param context
 */
export const closeFieldSelectMenu = (context) => {
    return event(context, types.CLOSE_FIELD_SELECT_MENU, {});
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
 * @param sourceIndex and targetIndex
 */
export const moveColumn = (context, params) => {
    return event(context, types.MOVE_COLUMN, params);
};
