import FormService from '../../src/services/formService';
import BaseService from '../../src/services/baseService';
import constants from '../../src/services/constants';

describe('FormService functions', () => {
    'use strict';
    var formService;

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');
        spyOn(BaseService.prototype, 'get');

        formService = new FormService();
    });

    // it('test getFormAndRecord function', () => {
    //     var appId = '123';
    //     var tableId = '456';
    //     var recordId = '10';
    //     var url = formService.constructUrl(formService.API.GET_FORM_AND_RECORD, [appId, tableId, recordId]);
    //     formService.getFormAndRecord(appId, tableId, recordId);
    //     expect(BaseService.prototype.get).toHaveBeenCalledWith(url);
    // });
});
