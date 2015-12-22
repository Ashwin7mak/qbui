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
     * @param formatted - is output formatted for UI display or the raw data
     * @param optionalParams may contain the any of the following -
     * @param query - unparsed expression to filter records by
     * @param clist - columns to query
     * @param slist - sortby columns
     * @param offset - zero based row offset
     * @param rows - number of rows to return on the request
     */
    getRecords(appId, tableId, formatted, optionalparams) {
        let params = {};
        if (formatted === true) {
            params.format = 'display';  // default is 'raw'
        }
        if (optionalparams) {
            if (StringUtils.isString(optionalparams.query)) {
                params.query = optionalparams.query;
            }
            if (StringUtils.isString(optionalparams.clist)) {
                params.clist = optionalparams.clist;
            }
            if (StringUtils.isString(optionalparams.slist)) {
                params.slist = optionalparams.slist;
            }
            if (NumberUtils.isInt(optionalparams.offset) && NumberUtils.isInt(optionalparams.rows)) {
                params.offset = optionalparams.offset;
                params.numRows = optionalparams.rows;
            }
        }
        return super.get(constants.APPS + '/' + appId + '/' + constants.TABLES + '/' + tableId + '/' + constants.RECORDS, {params:params});
    }
}

export default RecordService;
