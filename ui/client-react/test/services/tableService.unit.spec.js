import TableService from '../../src/services/tableService';
import BaseService from '../../src/services/baseService';
import constants from '../../src/services/constants';

describe('TableService functions', () => {
    'use strict';
    var tableService;

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');
        spyOn(BaseService.prototype, 'get');

        tableService = new TableService();
    });

    xit('test getHomePage function', () => {
        var appId = '123';
        var tableId = '456';
        var url = tableService.constructUrl(tableService.API.GET_HOMEPAGE, [appId, tableId]);
        tableService.getHomePage(appId, tableId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url);
    });
});
