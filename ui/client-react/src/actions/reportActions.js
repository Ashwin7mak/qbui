import ReportService from '../services/reportService';
import reportModel from '../models/reportModel';
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
 * Retrieve a list of reports for the given app/table.  This function is called primarily when
 * populating the left hand navigation window with the list of reports and when displaying a
 * trowser window that displays all of the reports for a table.
 *
 * @param context - what context is requesting the report list (ie: nav)
 * @param appId - app id
 * @param tblId - table id
 */
export const loadReport = (context, appId, tblId, rptId, format, offset, rows) => {
    // we're returning a promise to the caller (not a Redux action) since this is an async action
    // (this is permitted when we're using redux-thunk middleware which invokes the store dispatch)
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            if (context && appId && tblId && rptId) {
                logger.debug(`ReportAction.loadReport: loading report for appId:${appId}, tableId:${tblId}, rptId:${rptId}`);

                dispatch(event(context, types.LOAD_REPORT, {appId, tblId, rptId}));
                let reportService = new ReportService();

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
                reportService.getReportResults(appId, tblId, rptId, params, format).then(
                    (reportResponse) => {
                        let metaData = reportResponse.data ? reportResponse.data.metaData : null;

                        let model = reportModel.set(appId, metaData, reportResponse.data);
                        model[query.OFFSET_PARAM] = offset;
                        model[query.NUMROWS_PARAM] = rows;

                        dispatch(event(context, types.LOAD_REPORT_SUCCESS, model));
                        resolve();
                    },
                    (reportResponseError) => {
                        logger.parseAndLogError(LogLevel.ERROR, reportResponseError.response, 'reportService.getReport:');
                        dispatch(event(context, actions.LOAD_REPORT_FAILED, reportResponseError));
                        reject();
                    }
                ).catch(ex => {
                    // TODO - remove catch block and update onPossiblyUnhandledRejection bluebird handler
                    logger.logException(ex);
                    reject();
                });
            } else {
                logger.error(`ReportAction.loadReport: Missing one or more required input parameters.  Context:${context}, AppId:${appId}, tableId:${tblId}, rptId:${rptId}`);
                dispatch(event(context, actions.LOAD_REPORT_FAILED, 500));
                reject();
            }
        });
    };
};
