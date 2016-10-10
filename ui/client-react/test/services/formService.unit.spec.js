import FormService from '../../src/services/formService';
import BaseService from '../../src/services/baseService';
import constants from '../../src/services/constants';
import * as query from '../../src/constants/query';

describe('FormService functions', () => {
    'use strict';
    var formService;

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');
        spyOn(BaseService.prototype, 'get');

        formService = new FormService();
    });

    it('test getFormAndRecord function with type defined', () => {
        var appId = 1;
        var tblId = 2;
        var recId = 3;
        var rptId = 4;
        var type = query.ADD_FORM_TYPE;

        var params = {};
        params[query.REPORT_ID_PARAM] = rptId;
        params[query.FORM_TYPE_PARAM] = type;
        params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;

        var url = formService.constructUrl(formService.API.GET_FORM_COMPONENTS, [appId, tblId, recId]);

        formService.getFormAndRecord(appId, tblId, recId, rptId, type);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getFormAndRecord function without type defined', () => {
        var appId = 1;
        var tblId = 2;
        var recId = 3;
        var rptId = 4;

        var params = {};
        params[query.REPORT_ID_PARAM] = rptId;
        params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
        params[query.FORM_TYPE_PARAM] = query.VIEW_FORM_TYPE;

        var url = formService.constructUrl(formService.API.GET_FORM_COMPONENTS, [appId, tblId, recId]);

        formService.getFormAndRecord(appId, tblId, recId, rptId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getFormAndRecord function without reportId and view type defined', () => {
        var appId = 1;
        var tblId = 2;
        var recId = 3;

        var params = {};
        params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
        params[query.FORM_TYPE_PARAM] = query.VIEW_FORM_TYPE;

        var url = formService.constructUrl(formService.API.GET_FORM_COMPONENTS, [appId, tblId, recId]);

        formService.getFormAndRecord(appId, tblId, recId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

});
