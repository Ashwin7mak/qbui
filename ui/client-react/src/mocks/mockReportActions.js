import ReportModel from '../models/reportModel';
import {reportData} from './reports';

import * as query from '../constants/query';

export const loadDynamicEmbeddedReport = (context, appId, tblId, rptId, format, filter, queryParams) => {
    return (dispatch) => {
        let metaData = reportData.metaData || null;

        let params = {};
        params[query.OFFSET_PARAM] = queryParams[query.OFFSET_PARAM];
        params[query.NUMROWS_PARAM] = queryParams[query.NUMROWS_PARAM];
        params.filter = filter;

        let model = new ReportModel(appId, metaData, reportData, params);

        dispatch({
            id: context,
            type: 'LOAD_EMBEDDED_REPORT_SUCCESS',
            content: model.get()
        });
    };
};
