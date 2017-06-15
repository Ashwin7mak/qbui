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
        spyOn(BaseService.prototype, 'patch');
        spyOn(BaseService.prototype, 'post');
        spyOn(BaseService.prototype, 'delete');
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

    it('test createField function', () => {
        var appId = '123';
        var tableId = '456';
        var field = {id: 1};
        var url = fieldsService.constructUrl(fieldsService.API.GET_FIELDS, [appId, tableId]);
        fieldsService.createField(appId, tableId, field);
        expect(BaseService.prototype.post).toHaveBeenCalledWith(url, field);
    });

    it('test updateField function', () => {
        var appId = '123';
        var tableId = '456';
        var field = {id: 1};
        var url = fieldsService.constructUrl(fieldsService.API.GET_FIELD, [appId, tableId, field.id]);
        fieldsService.updateField(appId, tableId, field);
        expect(BaseService.prototype.patch).toHaveBeenCalledWith(url, field);
    });

    it('test deleteField function', () => {
        var appId = '123';
        var tableId = '456';
        var fieldId = '7';
        var url = fieldsService.constructUrl(fieldsService.API.DELETE_FIELD, [appId, tableId, fieldId]);
        fieldsService.deleteField(appId, tableId, fieldId);
        expect(BaseService.prototype.delete).toHaveBeenCalledWith(url);
    });

});
