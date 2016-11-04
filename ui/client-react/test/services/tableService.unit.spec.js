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
});
