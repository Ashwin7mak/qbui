import constants from './constants';
import BaseService from './baseService';
import NumberUtils from '../utils/numberUtils';

class ReportService extends BaseService {

    constructor() {
        super();
    }

    /**
     * Return a report for a specific table
     *
     * @param appId
     * @param tableId
     * @param reportId
     * @returns {*}
     */
    getReport(appId, tableId, reportId) {
        return super.get(constants.APPS + '/' + appId + '/' + constants.TABLES + '/' + tableId + '/' + constants.REPORTS + '/' + reportId);
    }

    /**
     * Get all reports available for a specific table
     *
     * @param appId
     * @param tableId
     * @returns {*}
     */
    getReports(appId, tableId) {
        return super.get(constants.APPS + '/' + appId + '/' + constants.TABLES + '/' + tableId + '/' + constants.REPORTS);
    }

    /**
     * Execute a report for a given table.
     *
     * @param appId
     * @param tableId
     * @param reportId
     * @param formatted - is output formatted for UI display or the raw data
     * @param offset - zero based row offset
     * @param rows - number of rows to return on the request
     */
    getReportResults(appId, tableId, reportId, formatted, offset, rows) {
        let params = {};
        if (formatted === true) {
            params.format = 'display';  // default is 'raw'
        }
        if (NumberUtils.isInt(offset) && NumberUtils.isInt(rows)) {
            params.offset = offset;
            params.numRows = rows;
        }
        return super.get(constants.APPS + '/' + appId + '/' + constants.TABLES + '/' + tableId + '/' + constants.REPORTS + '/' + reportId + '/' + constants.RESULTS, {params:params});
    }

    /**
     * Resolve a facet Expression to a queryString.
     * @param facetExpression looks like [{fid: fid1, fieldtype:'', values: [value1, value2]}, {fid: fid2, fieldtype:'', values: [value3, value4]}, {fid: fid3, fieldtype:'DATE', values: [value3, value4]}]
     */
    resolveFacetExpression(facetExpression){
        let params = {};
        if (facetExpression) {
            params.facetexpression = facetExpression;
        }
        return super.get(constants.FACETS,  {params: params});
    }
}

export default ReportService;
