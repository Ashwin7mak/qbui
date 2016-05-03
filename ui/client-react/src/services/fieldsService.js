import constants from './constants';
import BaseService from './baseService';

/**
 * Gets all the fields in an app/table via the api
 * also has get for specific field id from a app/table
 */
class FieldsService extends BaseService {

    constructor() {
        super();

        //  Fields Service API endpoints
        this.API = {
            GET_FIELD     : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.FIELDS}/{2}`,
            GET_FIELDS    : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.FIELDS}`
        };
    }

    /**
     * Return a Quickbase field
     *
     * @param appId
     * @param tableId
     * @param fieldId
     * @returns promise
     */
    getField(appId, tableId, fieldId) {
        let url = super.constructUrl(this.API.GET_FIELD, [appId, tableId, fieldId]);
        return super.get(url);
    }

    /**
     * Return all QuickBase fields in a table
     *
     *
     * @param appId
     * @param tableId
     * @returns promise
     */
    getFields(appId, tableId) {
        let url = super.constructUrl(this.API.GET_FIELDS, [appId, tableId]);
        return super.get(url);
    }

}

export default FieldsService;
