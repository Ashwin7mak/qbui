import constants from './constants';
import commonConstants from '../../../common/src/constants';
import SaveRecordFormatter from '../../../common/src/formatter/saveRecordFormatter';
import BaseService from './baseService';
import NumberUtils from '../utils/numberUtils';
import StringUtils from '../utils/stringUtils';
import * as query from '../constants/query';
import _ from 'lodash';

// TODO: temporary for test...make sure to remove
import Promise from 'bluebird';

class RecordService extends BaseService {

    constructor() {
        super();

        //  Record service API endpoints
        this.API = {
            GET_RECORD         : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.RECORDS}/{2}`,
            GET_RECORDS        : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.RECORDS}`,
            PATCH_RECORD       : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.RECORDS}/{2}`,
            CREATE_RECORD      : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.RECORDS}`,
            DELETE_RECORD      : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.RECORDS}/{2}`,
            DELETE_RECORD_BULK : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.RECORDS}/${constants.BULK}`

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
    getRecords(appId, tableId, optionalParams) {
        let params = {};

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
            if (StringUtils.isNonEmptyString(optionalParams[query.FORMAT_PARAM])) {
                params[query.FORMAT_PARAM] = optionalParams[query.FORMAT_PARAM];
            }
            if (NumberUtils.isInt(optionalParams[query.OFFSET_PARAM]) && NumberUtils.isInt(optionalParams[query.NUMROWS_PARAM])) {
                params[query.OFFSET_PARAM] = optionalParams[query.OFFSET_PARAM];
                params[query.NUMROWS_PARAM] = optionalParams[query.NUMROWS_PARAM];
            }
        }

        let url = super.constructUrl(this.API.GET_RECORDS, [appId, tableId]);
        return super.get(url, {params:params});
    }

    /**
     * Get record by recordId. Optionally pass the clist to specify which fields should be returned
     * @param appId
     * @param tableId
     * @param recId
     * @param clist list of fids delimited by '.'
     * @returns {*}
     */

    getRecord(appId, tableId, recId, clist, optionalParams = {}) {
        let params = {};
        if (StringUtils.isNonEmptyString(clist)) {
            params[query.COLUMNS_PARAM] = clist;
        }
        if (StringUtils.isNonEmptyString(optionalParams[query.FORMAT_PARAM])) {
            params[query.FORMAT_PARAM] = optionalParams[query.FORMAT_PARAM];
        }
        let url = super.constructUrl(this.API.GET_RECORD, [appId, tableId, recId]);
        return super.get(url, {params:params});
    }

    /**
     * Save changes to a record
     *
     * @param appId
     * @param tableId
     * @param recordId
     * @param changes
     * @returns promise
     */
    saveRecord(appId, tableId, recordId, changes) {
        const fixedChanges = SaveRecordFormatter.formatRecordForSaving(changes);

        let url = super.constructUrl(this.API.PATCH_RECORD, [appId, tableId, recordId]);
        return super.patch(url, fixedChanges);
    }


    /**
     * Create a record
     *
     * @param appId
     * @param tableId
     * @param record
     * @returns promise
     */
    createRecord(appId, tableId, record) {
        const fixedRecord = SaveRecordFormatter.formatRecordForSaving(record);

        let url = super.constructUrl(this.API.CREATE_RECORD, [appId, tableId]);
        return super.post(url, fixedRecord);
    }

    /**
     * Delete a record
     *
     * @param appId
     * @param tableId
     * @param recordId
     * @returns promise
     */
    deleteRecord(appId, tableId, recordId) {
        let url = super.constructUrl(this.API.DELETE_RECORD, [appId, tableId, recordId]);
        return super.delete(url);
    }

    /**
     * Delete records in bulk
     *
     * @param appId
     * @param tableId
     * @param recordIds
     * @returns promise
     */
    deleteRecordBulk(appId, tableId, recordIds) {
        let url = super.constructUrl(this.API.DELETE_RECORD_BULK, [appId, tableId]);
        return super.deleteBulk(url, {data: recordIds});
    }

    deleteRecords(appId, tableId, recordIds) {
        return Promise.resolve();
    }

}

export default RecordService;
