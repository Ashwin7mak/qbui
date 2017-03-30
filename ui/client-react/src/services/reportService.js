import constants from './constants';
import BaseService from './baseService';
import NumberUtils from '../utils/numberUtils';
import StringUtils from '../utils/stringUtils';
import * as query from '../constants/query';
import CommonConstants from '../../../common/src/constants';

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
            GET_REPORT_META             : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}/{2}`,
            GET_REPORT_RECORDS_COUNT    : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}/{2}/${constants.RECORDSCOUNT}`,
            GET_REPORTS                 : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}`,
            GET_REPORT_RESULTS          : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}/{2}/${constants.RESULTS}`,
            GET_INVOKE_RESULTS          : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}/{2}/${constants.INVOKE}`,
            PARSE_FACET_EXPR            : `${constants.BASE_URL.NODE}/${constants.FACETS}/${constants.PARSE}`
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
    getReportMetaData(appId, tableId, reportId) {
        const existing = this._cached(arguments);
        if (existing) {
            // use result promise from prior request
            return existing;
        }

        let args = arguments;
        let url = super.constructUrl(this.API.GET_REPORT_META, [appId, tableId, reportId]);
        let request = super.get(url);

        if (request) {
            request.then((response) => {
                cachedReportRequest[this._key(args)].resp = response;
                return response;
            });
        }

        // clear old and save a new so that report metadata is fetched from
        // server whenever app/table/reportId is changed.
        return this._cache(request, arguments);
    }

    /**
     * Get the count of total number of records for the given report
     *
     * @param appId
     * @param tableId
     * @param reportId
     * @param params
     * @returns count of all records in the report
     */
    getReportRecordsCount(appId, tableId, reportId, params = {}) {
        let url = super.constructUrl(this.API.GET_REPORT_RECORDS_COUNT, [appId, tableId, reportId]);
        return super.get(url, {params});
    }

    /**
     * Call the reports endpoint to get a list of all the reports available for a given table
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
     * Call the report results endpoint
     *
     * @param appId
     * @param tableId
     * @param reportId
     * @param optionalparams
     * @returns {*}
     */
    getReportResults(appId, tableId, reportId, queryParams, format) {
        //  pass all supplied parameters to node
        let params = queryParams || {};

        //  should the report data be formatted
        if (format === true) {
            params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
        }

        // if no/invalid offset or numRows, will set to the defaults.
        if (!NumberUtils.isInt(params[query.OFFSET_PARAM]) || !NumberUtils.isInt(params[query.NUMROWS_PARAM])) {
            params[query.OFFSET_PARAM] =  CommonConstants.PAGE.DEFAULT_OFFSET;
            params[query.NUMROWS_PARAM] = CommonConstants.PAGE.DEFAULT_NUM_ROWS;
        }

        let url = super.constructUrl(this.API.GET_REPORT_RESULTS, [appId, tableId, reportId]);
        return super.get(url, {params:params});
    }

    /**
     * Run a report that uses the default report meta data as a baseline and updates the
     * cList, sList, and/or query for a custom report.
     *
     * @param appId
     * @param tableId
     * @param reportId
     * @param queryParams
     * @param format
     *
     * @returns {*}
     */
    getDynamicReportResults(appId, tableId, reportId, queryParams, format) {
        //  pass all supplied parameters to node
        let params = queryParams || {};

        //  should the report data be formatted
        if (format === true) {
            params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
        }

        // if no/invalid offset or numRows, will set to the defaults.
        if (!NumberUtils.isInt(params[query.OFFSET_PARAM]) || !NumberUtils.isInt(params[query.NUMROWS_PARAM])) {
            params[query.OFFSET_PARAM] = CommonConstants.PAGE.DEFAULT_OFFSET;
            params[query.NUMROWS_PARAM] = CommonConstants.PAGE.DEFAULT_NUM_ROWS;
        }

        //  It's expected that the query Parameters will include the custom settings for
        //  cList, sList and query(if any).  If none are supplied, then the result of the request
        //  is no different than calling 'getReportResults' method as the default report meta
        //  data will be used to generate the report.
        let url = super.constructUrl(this.API.GET_INVOKE_RESULTS, [appId, tableId, reportId]);
        return super.get(url, {params:params});
    }

    /**
     * Parse a facet Expression to a queryString.
     *
     * NOTE: this endpoint calls a NODE only endpoint..no core server references are mad.e
     *
     * @param facetExpression looks like [{fid: fid1, fieldtype:'', values: [value1, value2]}, {fid: fid3, fieldtype:'DATE', values: [value3, value4]}, ... ]
     * @returns promise
     */
    parseFacetExpression(facetExpression) {
        let params = {};
        if (facetExpression) {
            if (Array.isArray(facetExpression) && facetExpression.length > 0) {
                params[query.FACET_EXPRESSION] = facetExpression;
            }
        }

        return super.get(this.API.PARSE_FACET_EXPR, {params: params});
    }
}

export default ReportService;
export {cachedReportRequest};
