import constants from './constants';
import BaseService from './baseService';
import * as query from '../constants/query';
import Promise from 'bluebird';

class FormService extends BaseService {

    constructor() {
        super();

        //  Record service API endpoints
        this.API = {
            GET_FORM_COMPONENTS  : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.RECORDS}/{2}/${constants.FORMCOMPONENTS}`
        };
    }

    /**
     * Get form meta and record data
     *
     * @param appId
     * @param tableId
     * @param recordId
     * @param formType
     */
    getFormAndRecord(appId, tableId, recordId, formType) {
        let params = {};

        //  if no form type specified, will default to VIEW
        if (formType) {
            params[query.FORM_TYPE] = formType;
        } else {
            // TODO: evaluate whether this should throw an error if not set
            params[query.FORM_TYPE] = query.VIEW_FORM_TYPE;
        }

        //  always want formatted data
        params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;

        let url = super.constructUrl(this.API.GET_FORM_COMPONENTS, [appId, tableId, recordId]);
        return super.get(url, {params:params});
    }
}

export default FormService;
