import TableService from '../../src/services/tableService';
import BaseService from '../../src/services/baseService';
import Constants from '../../../common/src/constants';
import * as query from '../../src/constants/query';

describe('TableService functions', () => {
    'use strict';
    var tableService;

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');
        spyOn(BaseService.prototype, 'get');
        spyOn(BaseService.prototype, 'post');
        spyOn(BaseService.prototype, 'patch');

        tableService = new TableService();
    });

    it('test getHomePage function with no paging parameters', () => {
        var appId = '123';
        var tableId = '456';

        var params = {};
        params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
        params[query.OFFSET_PARAM] = Constants.PAGE.DEFAULT_OFFSET;
        params[query.NUMROWS_PARAM] = Constants.PAGE.DEFAULT_NUM_ROWS;

        var url = tableService.constructUrl(tableService.API.GET_HOMEPAGE, [appId, tableId]);
        tableService.getHomePage(appId, tableId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getHomePage function with paging parameters', () => {
        var appId = '123';
        var tableId = '456';

        var params = {};
        params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
        params[query.OFFSET_PARAM] = 10;
        params[query.NUMROWS_PARAM] = 20;

        var url = tableService.constructUrl(tableService.API.GET_HOMEPAGE, [appId, tableId]);
        tableService.getHomePage(appId, tableId, params[query.OFFSET_PARAM], params[query.NUMROWS_PARAM]);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getHomePage function with invalid paging parameters', () => {
        var appId = '123';
        var tableId = '456';

        var params = {};
        params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
        params[query.OFFSET_PARAM] = Constants.PAGE.DEFAULT_OFFSET;
        params[query.NUMROWS_PARAM] = Constants.PAGE.DEFAULT_NUM_ROWS;

        var url = tableService.constructUrl(tableService.API.GET_HOMEPAGE, [appId, tableId]);
        tableService.getHomePage(appId, tableId, 3, 'badNumRowsValue');
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test createTableComponents', () => {
        var appId = '123';
        var table = {name: "name", description: "desc", tableIcon: "icon", tableNoun: "noun"};

        var url = tableService.constructUrl(tableService.API.CREATE_TABLE_COMPONENTS, [appId]);
        tableService.createTableComponents(appId, table);
        expect(BaseService.prototype.post).toHaveBeenCalledWith(url, table);
    });

    it('test updateTable', () => {
        var appId = '123';
        var tableId = '456';
        var table = {name: "name", description: "desc", tableIcon: "icon", tableNoun: "noun"};

        var url = tableService.constructUrl(tableService.API.UPDATE_TABLE, [appId, tableId]);
        tableService.updateTable(appId, tableId, table);
        expect(BaseService.prototype.patch).toHaveBeenCalledWith(url, table);
    });
});
