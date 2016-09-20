import TableService from '../../src/services/tableService';
import BaseService from '../../src/services/baseService';
import Constants from '../../../common/src/constants';

describe('TableService functions', () => {
    'use strict';
    var tableService;

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');
        spyOn(BaseService.prototype, 'get');

        tableService = new TableService();
    });

    it('test getHomePage function', () => {
        var appId = '123';
        var tableId = '456';
        var offset = Constants.PAGE.DEFAULT_OFFSET;
        var numRows = Constants.PAGE.DEFAULT_NUM_ROWS;
        var url = tableService.constructUrl(tableService.API.GET_HOMEPAGE, [appId, tableId, offset, numRows]);
        tableService.getHomePage(appId, tableId, offset, numRows);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:{offset:offset, numRows:numRows}});
    });
});
