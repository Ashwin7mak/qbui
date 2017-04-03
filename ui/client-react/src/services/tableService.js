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
            GET_HOMEPAGE            : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.HOMEPAGE}`,
            CREATE_TABLE_COMPONENTS : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/${constants.TABLECOMPONENTS}`,
            UPDATE_TABLE            : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}`
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

    /**
     * create a table and related components
     * @param appId
     * @param table object of structure {name: "name", description: "desc", tableIcon: "icon", tableNoun: "noun"}
     */
    createTableComponents(appId, tableInfo) {
        let url = super.constructUrl(this.API.CREATE_TABLE_COMPONENTS, [appId]);

        return super.post(url, tableInfo);
    }

    updateTable(appId, tableId, table) {
        let url = super.constructUrl(this.API.UPDATE_TABLE, [appId, tableId]);
        //mock data
        table = {name: "name", description: "desc", tableIcon: "icon", tableNoun: "noun"};
        return super.patch(url, table);
    }
}

export default TableService;
