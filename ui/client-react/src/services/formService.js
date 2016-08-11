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
    getFormAndRecord(appId, tableId, recordId, rptId, formType) {
        let params = {};

        //  report id is optional
        if (rptId) {
            params[query.REPORT_ID_PARAM] = rptId;
        }

        //  if no form type specified, will default to VIEW
        if (formType) {
            params[query.FORM_TYPE_PARAM] = formType;
        } else {
            params[query.FORM_TYPE_PARAM] = query.VIEW_FORM_TYPE;
        }

        //  always want formatted data
        params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;

        let url = super.constructUrl(this.API.GET_FORM_COMPONENTS, [appId, tableId, recordId]);
        return super.get(url, {params:params});
    }
}

export default FormService;
