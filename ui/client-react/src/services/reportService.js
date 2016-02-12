import constants from './constants';
import BaseService from './baseService';
import NumberUtils from '../utils/numberUtils';

class ReportService extends BaseService {

    constructor() {
        super();

        //  Report service API endpoints
        this.API = {
            GET_REPORT          : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}/{2}`,
            GET_REPORTS         : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}`,
            GET_REPORT_RESULTS  : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}/{2}/${constants.RESULTS}`,
            PARSE_FACET_EXPR    : `${constants.BASE_URL.NODE}/${constants.FACETS}/${constants.PARSE}`
        };
    }

    /**
     * Return the report meta data for a given table
     *
     * @param appId
     * @param tableId
     * @param reportId
     * @returns promise
     */
    getReport(appId, tableId, reportId) {
        let url = super.constructUrl(this.API.GET_REPORT, [appId, tableId, reportId]);
        return super.get(url);
    }

    /**
     * Get all reports available for a given table
     *
     * @param appId
     * @param tableId
     * @returns promise
     */
    getReports(appId, tableId) {
        let url = super.constructUrl(this.API.GET_REPORTS, [appId, tableId]);
        return super.get(url);
    }

    /**
     * Return the report data for a given table.
     *
     * @param appId
     * @param tableId
     * @param reportId
     * @param formatted - is output formatted for UI display or the raw data
     * @param offset - zero based row offset
     * @param rows - number of rows to return on the request
     * @returns promise
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

        let url = super.constructUrl(this.API.GET_REPORT_RESULTS, [appId, tableId, reportId]);
        return super.get(url, {params:params});
    }

    /**
     * Parse a facet Expression to a queryString.
     *
     * @param facetExpression looks like [{fid: fid1, fieldtype:'', values: [value1, value2]}, {fid: fid2, fieldtype:'', values: [value3, value4]}, {fid: fid3, fieldtype:'DATE', values: [value3, value4]}]
     * @returns promise
     */
    parseFacetExpression(facetExpression) {
        let params = {};
        if (facetExpression) {
            params.facetexpression = facetExpression;
        }

        return super.get(this.API.PARSE_FACET_EXPR, {params: params});
    }
}

export default ReportService;
