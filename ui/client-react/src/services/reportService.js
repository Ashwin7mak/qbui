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
            GET_REPORT_META             : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}/{2}`,
            //GET_REPORT                  : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}/{2}/temp`,

            GET_REPORT_RECORDS_COUNT    : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}/{2}/${constants.RECORDSCOUNT}`,
            GET_REPORTS                 : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}`,
            GET_REPORT_COMPONENTS       : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.REPORTS}/{2}/${constants.REPORTCOMPONENTS}`,
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
    getReportMetaData(appId, tableId, reportId) {
        // TODO cache meta data
        let url = super.constructUrl(this.API.GET_REPORT_META, [appId, tableId, reportId]);
        return super.get(url);
    }

    /**
     * Return the report meta data for a given table
     *
     * @param appId
     * @param tableId
     * @param reportId
     * @returns promise
     */
    //getReport(appId, tableId, reportId, format, offset, rows, sortList) {
    //    const existing = this._cached(arguments);
    //    if (existing) {
    //        // use result promise from prior request
    //        return existing;
    //    }
    //
    //    let args = arguments;
    //    let url = super.constructUrl(this.API.GET_REPORT, [appId, tableId, reportId]);
    //    let request;
    //
    //    // For report pagination, if format, offset, rows are defined, set parameters.
    //    if (format !== undefined && offset !== undefined && rows !== undefined) {
    //        let params = {};
    //        if (format === true) {
    //            params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
    //        }
    //        if (StringUtils.isNonEmptyString(sortList)) {
    //            params[query.SORT_LIST_PARAM] = sortList;
    //        }
    //        if (NumberUtils.isInt(offset) && NumberUtils.isInt(rows)) {
    //            params[query.OFFSET_PARAM] = offset;
    //            params[query.NUMROWS_PARAM] = rows;
    //        }
    //        request = super.get(url, {params:params});
    //    } else {
    //        request = super.get(url);
    //    }
    //
    //    if (request) {
    //        request.then((response) => {
    //            cachedReportRequest[this._key(args)].resp = response;
    //            return response;
    //        });
    //    }
    //
    //    // clear old and save a new so that report metadata gets loaded from server whenever app/table/reportId changes
    //    return this._cache(request, arguments);
    //}

    /**
     * Get the count of total number of records for the given report
     * @param appId
     * @param tableId
     * @param reportId
     * @param filter
     * @returns count of all records in the report
     */
    getReportRecordsCount(appId, tableId, reportId) {
        let url = super.constructUrl(this.API.GET_REPORT_RECORDS_COUNT, [appId, tableId, reportId]);
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

    getReportResults(appId, tableId, reportId, optionalparams) {
        let params = {};

        //  is the result set returned formatted/organized for UI display or in 'raw' un-edited format
        if (optionalparams) {
            if (optionalparams[query.FORMAT_PARAM] === true) {
                params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
            }
            if (NumberUtils.isInt(optionalparams[query.OFFSET_PARAM]) && NumberUtils.isInt(optionalparams[query.NUMROWS_PARAM])) {
                params[query.OFFSET_PARAM] = optionalparams[query.OFFSET_PARAM];
                params[query.NUMROWS_PARAM] = optionalparams[query.NUMROWS_PARAM];
            }
        }

        let url = super.constructUrl(this.API.GET_REPORT_RESULTS, [appId, tableId, reportId]);
        return super.get(url, {params:params});
    }

    getDynamicReportResults(appId, tableId, reportId, queryParams) {
        let params = {};
        if (queryParams) {
            if (queryParams[query.FORMAT_PARAM] === true) {
                params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
            }
            if (NumberUtils.isInt(queryParams[query.OFFSET_PARAM]) && NumberUtils.isInt(queryParams[query.NUMROWS_PARAM])) {
                params[query.OFFSET_PARAM] = queryParams[query.OFFSET_PARAM];
                params[query.NUMROWS_PARAM] = queryParams[query.NUMROWS_PARAM];
            }
            if (queryParams.hasOwnProperty(query.SORT_LIST_PARAM)) {
                params[query.SORT_LIST_PARAM] = queryParams[query.SORT_LIST_PARAM];
            }
            if (queryParams.hasOwnProperty(query.QUERY_PARAM)) {
                params[query.QUERY_PARAM] = queryParams[query.QUERY_PARAM];
            }
        }

        let url = super.constructUrl(this.API.GET_REPORT_RESULTS, [appId, tableId, reportId]);
        return super.post(url, {}, {params:params});
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
    //getReportDataAndFacets(appId, tableId, reportId, queryParams) {
    //    return this.getReportData(appId, tableId, reportId, queryParams, true);
    //}

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
    //getReportData(appId, tableId, reportId, optionalparams, includeFacets) {
    //    let params = {};
    //
    //    //  is the result set returned formatted/organized for UI display or in 'raw' un-edited format
    //    if (optionalparams) {
    //        if (optionalparams[query.FORMAT_PARAM] === true) {
    //            params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
    //        }
    //        if (StringUtils.isNonEmptyString(optionalparams[query.QUERY_PARAM])) {
    //            params[query.QUERY_PARAM] = optionalparams[query.QUERY_PARAM];
    //        }
    //        if (StringUtils.isNonEmptyString(optionalparams[query.COLUMNS_PARAM])) {
    //            params[query.COLUMNS_PARAM] = optionalparams[query.COLUMNS_PARAM];
    //        }
    //        if (StringUtils.isNonEmptyString(optionalparams[query.SORT_LIST_PARAM])) {
    //            params[query.SORT_LIST_PARAM] = optionalparams[query.SORT_LIST_PARAM];
    //        }
    //        if (NumberUtils.isInt(optionalparams[query.OFFSET_PARAM]) && NumberUtils.isInt(optionalparams[query.NUMROWS_PARAM])) {
    //            params[query.OFFSET_PARAM] = optionalparams[query.OFFSET_PARAM];
    //            params[query.NUMROWS_PARAM] = optionalparams[query.NUMROWS_PARAM];
    //        }
    //    }
    //
    //    let url = super.constructUrl(includeFacets === true ? this.API.GET_REPORT_COMPONENTS : this.API.GET_REPORT_RESULTS, [appId, tableId, reportId]);
    //    return super.get(url, {params:params});
    //}

    /**
     * Parse a facet Expression to a queryString.
     *
     * @param facetExpression looks like [{fid: fid1, fieldtype:'', values: [value1, value2]}, {fid: fid3, fieldtype:'DATE', values: [value3, value4]}, ... ]
     * @returns promise
     */
    parseFacetExpression(facetExpression) {
        let params = {};
        if (facetExpression) {
            if (facetExpression !== '' && facetExpression.length) {
                params[query.FACET_EXPRESSION] = facetExpression;
            }
        }

        return super.get(this.API.PARSE_FACET_EXPR, {params: params});
    }
}

export default ReportService;
export {cachedReportRequest};
