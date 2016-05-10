import FieldsService from '../../src/services/fieldsService';
import BaseService from '../../src/services/baseService';
import constants from '../../src/services/constants';

describe('FieldsService functions', () => {
    'use strict';
    var fieldsService;

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');
        spyOn(BaseService.prototype, 'get');

        fieldsService = new FieldsService();
    });

    it('test getField function', () => {
        var appId = '123';
        var tableId = '456';
        var fieldId = '7';
        var url = fieldsService.constructUrl(fieldsService.API.GET_FIELD, [appId, tableId, fieldId]);
        fieldsService.getField(appId, tableId, fieldId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url);
    });

    it('test getFields function', () => {
        var appId = '123';
        var tableId = '456';

        var url = fieldsService.constructUrl(fieldsService.API.GET_FIELDS, [appId, tableId]);
        fieldsService.getFields(appId, tableId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url);
    });

});
