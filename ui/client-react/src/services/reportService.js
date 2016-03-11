import constants from './constants';
import BaseService from './baseService';
import NumberUtils from '../utils/numberUtils';

// a new service is constructed with each actions request..
// so cachedReportRequest is a global, should be able to keep with reportService
// unless this needs to be recreated we can hygiene later..
//cache
var cachedReportRequest = {};

class ReportService extends BaseService {

    constructor() {
        super();

        //  Report service API endpoints
        this.API = {
            GET_REPORT              : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}/{2}`,
            GET_REPORTS             : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}`,
            GET_REPORT_COMPONENTS   : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}/{2}/${constants.REPORTCOMPONENTS}`,
            GET_REPORT_RESULTS      : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}/{2}/${constants.RESULTS}`,
            PARSE_FACET_EXPR        : `${constants.BASE_URL.NODE}/${constants.FACETS}/${constants.PARSE}`
        };
    }

    /**
     * clear report metadata from cache
     * @private
     */
    _clear() {
        cachedReportRequest = {};
    }

    /**
     * get a key for a given signature to locateitem in cache
     * @param signature any value that can be stringified
     * @private
     */
    _key(signature) {
        return JSON.stringify(signature);
    }

    /**
     * add a request to the report cache to reduce server fetches
     * @param request - the payload (a request) that will be bypassed when found in cache
     * @param signature - the unique information for the report
     * @returns {promise}
     * @private
     */
    _cache(request, signature) {
        this._clear();
        if (signature) {
            const key = this._key(signature);
            cachedReportRequest[key] = {};
            cachedReportRequest[key].rq = request;
        }
        return request;
    }

    /**
     * look up signature in the cache
     * @param signature
     * @returns return the request promise  or undefined if not found
     * @private
     */
    _cached(signature) {
        const key = this._key(signature);
        return cachedReportRequest[key] ? cachedReportRequest[key].rq : undefined;
    }

    /**
     * to support unit tests mainly get the cache
     * @returns {{}}
     */
    _getCache() {
        return cachedReportRequest;
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
        const existing = this._cached(arguments);
        if (existing) {
            // use result promise from prior request
            return existing;
        }

        let args = arguments;
        let url = super.constructUrl(this.API.GET_REPORT, [appId, tableId, reportId]);
        const request = super.get(url);
        if (request) {
            request.then((response) => {
                cachedReportRequest[this._key(args)].resp = response;
                return response;
            });
        }

        // clear old and save a new so that report metadata gets loaded from server whenever app/table/reportId changes
        return this._cache(request, arguments);
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
     * Return the records and facets list for a given report.
     * Ideally this should be used the 1st time a report is loaded to get all the pieces required to render the report.
     *
     * @param appId
     * @param tableId
     * @param reportId
     * @param formatted - is output formatted for UI display or the raw data
     * @param offset - zero based row offset
     * @param rows - number of rows to return on the request
     * @returns promise
     */
    getReportDataAndFacets(appId, tableId, reportId, formatted, offset, rows) {
        let params = {};
        if (formatted === true) {
            params.format = 'display';  // default is 'raw'
        }
        if (NumberUtils.isInt(offset) && NumberUtils.isInt(rows)) {
            params.offset = offset;
            params.numRows = rows;
        }

        let url = super.constructUrl(this.API.GET_REPORT_COMPONENTS, [appId, tableId, reportId]);
        return super.get(url, {params:params});
    }

    /**
     * Return the records for a given report.
     *
     * @param appId
     * @param tableId
     * @param reportId
     * @param formatted - is output formatted for UI display or the raw data
     * @param offset - zero based row offset
     * @param rows - number of rows to return on the request
     * @returns promise
     */
    getReportData(appId, tableId, reportId, formatted, offset, rows) {
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
export {cachedReportRequest};
