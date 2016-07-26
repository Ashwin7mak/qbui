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
        var rptId = 3;
        var type = query.ADD_FORM_TYPE;

        var params = {};
        params[query.FORM_TYPE] = type;
        params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;

        var url = formService.constructUrl(formService.API.GET_FORM_COMPONENTS, [appId, tblId, rptId]);

        formService.getFormAndRecord(appId, tblId, rptId, type);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getFormAndRecord function without type defined', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;

        var params = {};
        params[query.FORM_TYPE] = query.VIEW_FORM_TYPE;
        params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;

        var url = formService.constructUrl(formService.API.GET_FORM_COMPONENTS, [appId, tblId, rptId]);

        formService.getFormAndRecord(appId, tblId, rptId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

});
