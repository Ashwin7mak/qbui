
import Promise from 'bluebird';
import TableService from '../services/tableService';
import ReportModel from '../models/reportModel';

import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';

import * as types from '../actions/types';
import * as query from '../constants/query';

let logger = new Logger();

/**
 * Construct reports store redux store payload
 *
 * @param context - report context id (nav, embedded report, etc)
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
 * Load the table home page for the given app and table.
 *
 * @param context - the context which the report will be loaded
 * @param appId
 * @param tblId
 * @param offset
 * @param rows
 * @returns {Function}
 */
export const loadTableHomePage = (context, appId, tblId, offset, rows) => {
    // we're returning a promise to the caller (not a Redux action) since this is an async action
    // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            if (context && appId && tblId) {
                logger.debug(`TableAction.loadTableHomePage: loading report for appId:${appId}, tableId:${tblId}`);

                dispatch(event(context, types.LOAD_REPORT, {appId, tblId, rptId:null}));
                let tableService = new TableService();

                let params = {};
                params[query.OFFSET_PARAM] = offset;
                params[query.NUMROWS_PARAM] = rows;

                //  Fetch a report.  The response will include:
                //    - report data/grouping data
                //    - report meta data
                //    - report fields
                //    - report facets
                //    - report count
                //
                tableService.getHomePage(appId, tblId, offset, rows).then(
                    (response) => {
                        let metaData = response.data ? response.data.metaData : null;
                        let model = new ReportModel(appId, metaData, response.data, params);
                        dispatch(event(context, types.LOAD_REPORT_SUCCESS, model.get()));
                        resolve();
                    },
                    (error) => {
                        logger.parseAndLogError(LogLevel.ERROR, error.response, 'tableService:getHomePage');
                        dispatch(event(context, types.LOAD_REPORT_FAILED, error));
                        reject();
                    }
                );
            } else {
                logger.error(`TableAction.loadTableHomePage: Missing one or more required input parameters.  Context:${context}, AppId:${appId}, tableId:${tblId}`);
                dispatch(event(context, types.LOAD_REPORT_FAILED, 500));
                reject();
            }
        });
    };
};

