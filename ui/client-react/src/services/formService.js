import constants from './constants';
import BaseService from './baseService';
import NumberUtils from '../utils/numberUtils';
import StringUtils from '../utils/stringUtils';
import * as query from '../constants/query';
import Promise from 'bluebird';
import {sampleFormJSON} from '../components/QBForm/fakeData.js';

class RecordService extends BaseService {

    constructor() {
        super();

        //  Record service API endpoints
        this.API = {
            GET_FORM_AND_RECORD  : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.FORMANDRECORD}`
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
    getFormAndRecord(appId, tableId, recordId, formType) {
        let params = {};

        if (formType) {
            params[query.FORM_TYPE] = formType;
        }

        return Promise.resolve({data: sampleFormJSON});
        //TODO add a node end point.
        //let url = super.constructUrl(this.API.GET_FORM_AND_RECORD, [appId, tableId]);
        //return super.get(url, {params:params});
    }
}

export default RecordService;
