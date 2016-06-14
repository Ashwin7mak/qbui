import constants from './constants';
import BaseService from './baseService';
import NumberUtils from '../utils/numberUtils';
import StringUtils from '../utils/stringUtils';
import * as query from '../constants/query';
import Promise from 'bluebird';
import {sampleReportModel} from './sampleReportModel.js';



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
    getHomePage(appId, tableId) {
        let params = {};

        return Promise.resolve({data: sampleReportModel});
        //TODO add a node end point.
        //let url = super.constructUrl(this.API.GET_HOMEPAGE, [appId, tableId]);
        //return super.get(url, {params:params});
    }
}

export default TableService;
