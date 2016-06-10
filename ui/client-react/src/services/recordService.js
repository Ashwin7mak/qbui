import constants from './constants';
import BaseService from './baseService';
import NumberUtils from '../utils/numberUtils';
import StringUtils from '../utils/stringUtils';
import * as query from '../constants/query';

class RecordService extends BaseService {

    constructor() {
        super();

        //  Record service API endpoints
        this.API = {
            GET_RECORD  : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.RECORDS}`
        };
    }

    /**
     * Get all records filtered optionally by query, clist, slist, offset, numRows.
     *
     * @param appId
     * @param tableId
     * @param optionalParams may contain the any of the following -
     *  formatted - is output formatted for UI display or raw data
     *  query - unparsed expression to filter records by
     *  clist - columns to query
     *  slist - sortby columns
     *  glist - groupBy columns
     *  offset - zero based row offset
     *  numRows - number of rows to return on the request
     */
    getRecords(appId, tableId, optionalparams) {
        let params = {};

        if (optionalparams) {
            if (optionalparams[query.FORMAT_PARAM] === true) {
                params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
            }
            if (StringUtils.isNonEmptyString(optionalparams[query.QUERY_PARAM])) {
                params[query.QUERY_PARAM] = optionalparams[query.QUERY_PARAM];
            }
            if (StringUtils.isNonEmptyString(optionalparams[query.COLUMNS_PARAM])) {
                params[query.COLUMNS_PARAM] = optionalparams[query.COLUMNS_PARAM];
            }
            if (StringUtils.isNonEmptyString(optionalparams[query.SORT_LIST_PARAM])) {
                params[query.SORT_LIST_PARAM] = optionalparams[query.SORT_LIST_PARAM];
            }
            if (NumberUtils.isInt(optionalparams[query.OFFSET_PARAM]) && NumberUtils.isInt(optionalparams[query.NUMROWS_PARAM])) {
                params[query.OFFSET_PARAM] = optionalparams[query.OFFSET_PARAM];
                params[query.NUMROWS_PARAM] = optionalparams[query.NUMROWS_PARAM];
            }
        }

        let url = super.constructUrl(this.API.GET_RECORD, [appId, tableId]);
        return super.get(url, {params:params});
    }
}

export default RecordService;
