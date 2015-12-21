import constants from './constants';
import BaseService from './baseService';
import NumberUtils from '../utils/numberUtils';
import StringUtils from '../utils/stringUtils';

class RecordService extends BaseService {

    constructor() {
        super();
    }

    /**
     * Get all records filtered optionally by query, clist, slist, offset, numRows.
     *
     * @param appId
     * @param tableId
     * @param reportId
     * @param formatted - is output formatted for UI display or the raw data
     * @param optionalParams may contain the any of the following -
     * @param query - unparsed expression to filter records by
     * @param clist - columns to query
     * @param slist - sortby columns
     * @param offset - zero based row offset
     * @param rows - number of rows to return on the request
     */
    getRecords(appId, tableId, reportId, formatted, optionalparams) {
        let params = {};
        if (formatted === true) {
            params.format = 'display';  // default is 'raw'
        }

        if (StringUtils.isString(optionalparams.query)){
            params.query = optionalparams.query;
        }
        if (StringUtils.isString(optionalparams.clist)){
            params.clist = optionalparams.clist;
        }
        if (StringUtils.isString(optionalparams.slist)){
            params.slist = optionalparams.query;
        }
        if (NumberUtils.isInt(optionalparams.offset) && NumberUtils.isInt(optionalparams.rows)) {
            params.offset = optionalparams.offset;
            params.numRows = optionalparams.rows;
        }
        return super.get(constants.APPS + '/' + appId + '/' + constants.TABLES + '/' + tableId + '/' + constants.RECORDS, {params:params});
    }

    /**
     * Used when user filters a report on a facet. The request has the report which is being filtered, facetexpression of what has been selected so far.
     *
     * @param appId
     * @param tableId
     * @param reportId
     * @param formatted - is output formatted for UI display or the raw data
     * @param report may contain the any of the following attributes (generally a part of Report model)-
     * @param query - unparsed expression to filter records by
     * @param clist - columns to query
     * @param slist - sortby columns
     * @param offset - zero based row offset
     * @param rows - number of rows to return on the request
     * @param facetexpression - expression representing all the facets selected by user so far example [{fid: fid1, values: value1, value2}, {fid: fid2, values: value3, value4}, ..]
     */
    filterReport(appId, tableId, reportId, formatted, report, queryString) {
        let params = {};
        if (formatted === true) {
            params.format = 'display';  // default is 'raw'
        }

        if (StringUtils.isString(report.query)){
            params.query = report.query;
            if (StringUtils.isString(queryString)) {
                params.query += "AND" + queryString;
            }
        }
        else if (StringUtils.isString(queryString)) {
            params.query = queryString;
        }
        if (StringUtils.isString(report.clist)){
            params.clist = report.clist;
        }
        if (StringUtils.isString(report.slist)){
            params.slist = report.query;
        }
        if (NumberUtils.isInt(report.offset) && NumberUtils.isInt(report.rows)) {
            params.offset = report.offset;
            params.numRows = report.rows;
        }
        return super.get(constants.APPS + '/' + appId + '/' + constants.TABLES + '/' + tableId + '/' + constants.RECORDS, {params:params});
    }

}

export default RecordService;
