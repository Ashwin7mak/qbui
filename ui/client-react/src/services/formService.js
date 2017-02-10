import constants from './constants';
import BaseService from './baseService';
import * as query from '../constants/query';
import Promise from 'bluebird';

class FormService extends BaseService {

    constructor() {
        super();

        //  Record service API endpoints
        this.API = {
            //  FUTURE experience engine endpoints
            GET_FORM      : `${constants.BASE_URL.EXPERIENCE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.FORMS}/{2}`,
            GET_FORMS     : `${constants.BASE_URL.EXPERIENCE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.FORMS}`,
            GET_FORM_TYPE : `${constants.BASE_URL.EXPERIENCE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.FORMS}/${constants.FORMS_TYPE}/{2}`,
            //  core engine endpoints
            GET_FORM_COMPONENTS  : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.RECORDS}/{2}/${constants.FORMCOMPONENTS}`,
            GET_FORM_COMPONENTS_ONLY  : `${constants.BASE_URL.QUICKBASE}/${constants.APPS}/{0}/${constants.TABLES}/{1}/${constants.FORMCOMPONENTS}`
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

    getForm(appId, tableId, rptId, formType) {
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

        let url = super.constructUrl(this.API.GET_FORM_COMPONENTS_ONLY, [appId, tableId]);

        return super.get(url, {params:params});
    }

    /**
     * Create a new form
     *
     * @param appId
     * @param tableId
     * @param form - the new form object
     */
    createForm(appId, tableId, form) {
        let url = super.constructUrl(this.API.GET_FORMS, [appId, tableId]);
        return super.post(url, form);
    }

    /**
     * Update an existing form
     *
     * @param appId
     * @param tableId
     * @param form - the updated form object
     */
    updateForm(appId, tableId, form) {
        // get the form id from the form object
        let formId = form ? form.formId : {};

        //  construct the put url
        let url = super.constructUrl(this.API.GET_FORM, [appId, tableId, formId]);
        return super.put(url, form);
    }
}

export default FormService;
