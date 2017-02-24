import ReportModel from '../models/reportModel';
import {reportData} from './reports';

export const loadDynamicReport = (context, appId, tblId, rptId, format, filter, queryParams) => {
    return (dispatch) => {
        let metaData = reportData.data.metaData || null;

        let params = {};
        params[query.OFFSET_PARAM] = queryParams[query.OFFSET_PARAM];
        params[query.NUMROWS_PARAM] = queryParams[query.NUMROWS_PARAM];
        params.filter = filter;

        let model = new ReportModel(appId, metaData, reportResponse.data, params);

        dispatch({
            id: context,
            type: 'LOAD_EMBEDDED_REPORT_SUCCESS',
            content: model.get()
        });
    };
};
