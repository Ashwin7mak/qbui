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
            GET_HOMEPAGE  : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.HOMEPAGE}`
        };
    }

    /**
     * Get all data needed to render table home page
     * @param appId
     * @param tableId
     * @returns {Promise.<{data}>}
     */
    getHomePage(appId, tableId, offset, numRows) {
        let url = super.constructUrl(this.API.GET_HOMEPAGE, [appId, tableId]);

        let params = {};
        params[query.OFFSET_PARAM] = NumberUtils.isInt(offset) ? offset : Constants.PAGE.DEFAULT_OFFSET;
        params[query.NUMROWS_PARAM] = NumberUtils.isInt(numRows) ? numRows : Constants.PAGE.DEFAULT_NUM_ROWS;

        return super.get(url, {params:params});
    }
}

export default TableService;
