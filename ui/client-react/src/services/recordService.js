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
            GET_RECORD         : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.RECORDS}`,
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

    /**
     * replace user objects in value property with user IDs
     * @param changes record or changes containing objects with value keys
     * @returns copy of changes with user objects replaced with user ID strings
     */
    convertUserValueObjectsToIds(changes) {

        const fixedChanges = _.cloneDeep(changes);

        // patching user fields expects user ID only on server not the user object we got originally

        if (_.isArray(fixedChanges)) {
            fixedChanges.forEach(change => {
                if (_.has(change, 'fieldDef.datatypeAttributes.type') && change.fieldDef.datatypeAttributes.type === "USER") {
                    change.value = change.value ? change.value.userId : "";
                }
            });
        }

        return fixedChanges;
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

        const fixedChanges = this.convertUserValueObjectsToIds(changes);

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
        let url = super.constructUrl(this.API.CREATE_RECORD, [appId, tableId]);

        const fixedRecord = this.convertUserValueObjectsToIds(record);

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

}

export default RecordService;
