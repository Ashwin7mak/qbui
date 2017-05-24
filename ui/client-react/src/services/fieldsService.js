import constants from './constants';
import BaseService from './baseService';

/**
 * Gets all the fields in an app/table via the api
 * also has get for specific field id from a app/table
 */
class FieldsService extends BaseService {

    constructor() {
        super();

        //  Fields Service API endpoints.
        this.API = {
            GET_FIELD     : `${constants.BASE_URL.PROXY}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.FIELDS}/{2}`,
            GET_FIELDS    : `${constants.BASE_URL.PROXY}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.FIELDS}`,
            DELETE_FIELD  : `${constants.BASE_URL.PROXY}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.FIELDS}/{2}`,
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

    /**
     * Create a field
     *
     * @param appId
     * @param tableId
     * @param field
     * @returns {*}
     */
    createField(appId, tableId, field) {
        let url = super.constructUrl(this.API.GET_FIELDS, [appId, tableId]);
        return super.post(url, field);
    }

    updateField(appId, tableId, field) {
        // TODO: npe if field is undefined
        let url = super.constructUrl(this.API.GET_FIELD, [appId, tableId, field.id]);
        return super.patch(url, field);
    }

    deleteField(appId, tableId, fieldId) {
        let url = super.constructUrl(this.API.DELETE_FIELD, [appId, tableId, fieldId]);
        return super.delete(url);
    }
}

export default FieldsService;
