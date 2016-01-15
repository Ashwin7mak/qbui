import constants from './constants';
import BaseService from './baseService';
import NumberUtils from '../utils/numberUtils';
import StringUtils from '../utils/stringUtils';

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
            if (StringUtils.isNonEmptyString(optionalparams.query)) {
                params.query = optionalparams.query;
            }
            if (StringUtils.isNonEmptyString(optionalparams.clist)) {
                params.clist = optionalparams.clist;
            }
            if (StringUtils.isNonEmptyString(optionalparams.slist)) {
                params.slist = optionalparams.slist;
            }
            if (NumberUtils.isInt(optionalparams.offset) && NumberUtils.isInt(optionalparams.rows)) {
                params.offset = optionalparams.offset;
                params.numRows = optionalparams.rows;
            }
        }

        let url = super.constructUrl(this.API.GET_RECORD, [appId, tableId]);
        return super.get(url, {params:params});
    }
}

export default RecordService;
