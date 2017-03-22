import constants from './constants';
import BaseService from './baseService';
import NumberUtils from '../utils/numberUtils';
import Constants from '../../../common/src/constants';
import * as query from '../constants/query';
import Promise from 'bluebird';

class TableService extends BaseService {

    constructor() {
        super();

        //  Record service API endpoints
        this.API = {
            GET_HOMEPAGE  : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.HOMEPAGE}`,
            CREATE_TABLE  : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}`
        };
    }

    /**
     * Get all data needed to render table home page report
     *
     * @param appId
     * @param tableId
     * @returns {Promise.<{data}>}
     */
    getHomePage(appId, tableId, offset, numRows) {
        let url = super.constructUrl(this.API.GET_HOMEPAGE, [appId, tableId]);
        let params = {};

        //  always return data formatted for display
        params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;

        // if no/invalid offset or numRows, will set to the defaults.
        if (NumberUtils.isInt(offset) && NumberUtils.isInt(numRows)) {
            params[query.OFFSET_PARAM] = offset;
            params[query.NUMROWS_PARAM] = numRows;
        } else {
            params[query.OFFSET_PARAM] =  Constants.PAGE.DEFAULT_OFFSET;
            params[query.NUMROWS_PARAM] = Constants.PAGE.DEFAULT_NUM_ROWS;
        }

        return super.get(url, {params:params});
    }

    createTable(appId, tableProps) {
        let url = super.constructUrl(this.API.CREATE_TABLE, [appId]);

        return super.put(url, tableProps);
    }
}

export default TableService;
