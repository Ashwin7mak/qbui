import constants from './constants';
import BaseService from './baseService';
import NumberUtils from '../utils/numberUtils';
import StringUtils from '../utils/stringUtils';
import * as query from '../constants/query';

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
            GET_REPORT                  : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}/{2}`,
            GET_REPORTS                 : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}`,
            GET_REPORT_COMPONENTS       : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}/{2}/${constants.REPORTCOMPONENTS}`,
            GET_REPORT_RECORDS_COUNT    : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}/{2}/${constants.RECORDSCOUNT}`,
            GET_REPORT_RESULTS          : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}/{2}/${constants.RESULTS}`,
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
     * Return a completely hydrated report.  This is defined as the report data, report
     * facet data and other report data used by the UI.
     *
     * This method is intended to be called the 1st time a report is loaded as it will fetch
     * all the components that makeup a report.
     *
     * @param appId
     * @param tableId
     * @param reportId
     * @param queryParams
     *   formatted - is output formatted for UI display or for raw data
     *   offset - zero based row offset
     *   rows - number of rows to return on the request
     *   glist - grouping data
     * @returns promise
     */
    getReportDataAndFacets(appId, tableId, reportId, queryParams) {
        return this.getReportData(appId, tableId, reportId, queryParams, true);
    }

    getReportRecordsCount(appId, tableId, reportId) {
        let url = super.constructUrl(this.API.GET_REPORT_RECORDS_COUNT, [appId, tableId, reportId]);
        return super.get(url, {});

    }
    
    /**
     * Return the data records for a given report.
     *
     * @param appId
     * @param tableId
     * @param reportId
     * @param queryParams
     *   formatted - is output formatted for UI display or for raw data
     *   offset - zero based row offset
     *   rows - number of rows to return on the request
     *   glist - grouping data
     * @param includeFacets - include facet data in result
     * @returns promise
     */
    getReportData(appId, tableId, reportId, optionalParams, includeFacets) {
        let params = this._setOptionalParams(optionalParams);

        let url = super.constructUrl(includeFacets === true ? this.API.GET_REPORT_COMPONENTS : this.API.GET_REPORT_RESULTS, [appId, tableId, reportId]);
        return super.get(url, {params:params});
    }

    _setOptionalParams(optionalParams) {
        let params = {};
        //  is the result set returned formatted/organized for UI display or in 'raw' un-edited format
        if (optionalParams) {
            if (optionalParams[query.FORMAT_PARAM] === true) {
                params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
            }
            if (StringUtils.isNonEmptyString(optionalParams[query.QUERY_PARAM])) {
                params[query.QUERY_PARAM] = optionalParams[query.QUERY_PARAM];
            }
            if (StringUtils.isNonEmptyString(optionalParams[query.COLUMNS_PARAM])) {
                params[query.COLUMNS_PARAM] = optionalParams[query.COLUMNS_PARAM];
            }
            if (StringUtils.isNonEmptyString(optionalParams[query.SORT_LIST_PARAM])) {
                params[query.SORT_LIST_PARAM] = optionalParams[query.SORT_LIST_PARAM];
            }
            if (NumberUtils.isInt(optionalParams[query.OFFSET_PARAM]) && NumberUtils.isInt(optionalParams[query.NUMROWS_PARAM])) {
                params[query.OFFSET_PARAM] = optionalParams[query.OFFSET_PARAM];
                params[query.NUMROWS_PARAM] = optionalParams[query.NUMROWS_PARAM];
            }
        }
        return params;
    }
    /**
     * Parse a facet Expression to a queryString.
     *
     * @param facetExpression looks like [{fid: fid1, fieldtype:'', values: [value1, value2]}, {fid: fid3, fieldtype:'DATE', values: [value3, value4]}, ... ]
     * @returns promise
     */
    parseFacetExpression(facetExpression) {
        let params = {};
        if (facetExpression) {
            params[query.FACET_EXPRESSION] = facetExpression;
        }

        return super.get(this.API.PARSE_FACET_EXPR, {params: params});
    }
}

export default ReportService;
export {cachedReportRequest};
