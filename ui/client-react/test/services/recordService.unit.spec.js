import BaseService from '../../src/services/baseService';
import RecordService from '../../src/services/recordService';
import * as query from '../../src/constants/query';

describe('RecordService functions', () => {
    'use strict';
    var recordService;

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');
        spyOn(BaseService.prototype, 'get');
        spyOn(BaseService.prototype, 'post');
        spyOn(BaseService.prototype, 'patch');
        spyOn(BaseService.prototype, 'delete');
        spyOn(BaseService.prototype, 'deleteBulk');

        recordService = new RecordService();
    });

    it('test getRecords function with reqd parameters', () => {
        var appId = 1;
        var tblId = 2;
        var url = recordService.constructUrl(recordService.API.GET_RECORD, [appId, tblId]);
        recordService.getRecords(appId, tblId);

        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params: {}});
    });

    it('test getRecords function with formatting', () => {
        var appId = 1;
        var tblId = 2;
        let params = {};
        params[query.FORMAT_PARAM] = true;

        var url = recordService.constructUrl(recordService.API.GET_RECORD, [appId, tblId]);
        recordService.getRecords(appId, tblId, params);

        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params: {format : query.DISPLAY_FORMAT}});
    });

    it('test getRecords function with valid optional parameters', () => {
        var appId = 1;
        var tblId = 2;
        var url = recordService.constructUrl(recordService.API.GET_RECORD, [appId, tblId]);

        let params = {};
        params[query.FORMAT_PARAM] = true;
        params[query.QUERY_PARAM] = "testQuery";
        params[query.COLUMNS_PARAM] = "testClist";
        params[query.SORT_LIST_PARAM] = "testSlist";
        params[query.OFFSET_PARAM] = 10;
        params[query.NUMROWS_PARAM] = 10;
        recordService.getRecords(appId, tblId, params);

        let expectedParams = {};
        expectedParams[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
        expectedParams[query.QUERY_PARAM] = params[query.QUERY_PARAM];
        expectedParams[query.COLUMNS_PARAM] = params[query.COLUMNS_PARAM];
        expectedParams[query.SORT_LIST_PARAM] = params[query.SORT_LIST_PARAM];
        expectedParams[query.OFFSET_PARAM] = params[query.OFFSET_PARAM];
        expectedParams[query.NUMROWS_PARAM] = params[query.NUMROWS_PARAM];
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params : expectedParams});
    });

    it('test getRecords function with invalid clist', () => {
        var appId = 1;
        var tblId = 2;
        var url = recordService.constructUrl(recordService.API.GET_RECORD, [appId, tblId]);

        let inputparams = {};
        inputparams[query.FORMAT_PARAM] = true;
        inputparams[query.QUERY_PARAM] = "testQuery";
        inputparams[query.COLUMNS_PARAM] = 123;
        inputparams[query.SORT_LIST_PARAM] = "testSlist";
        recordService.getRecords(appId, tblId, inputparams);

        let expectedParams = {};
        expectedParams[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
        expectedParams[query.QUERY_PARAM] = inputparams[query.QUERY_PARAM];
        expectedParams[query.SORT_LIST_PARAM] = inputparams[query.SORT_LIST_PARAM];
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params : expectedParams});
    });

    it('test getRecords function with invalid slist', () => {
        var appId = 1;
        var tblId = 2;
        var url = recordService.constructUrl(recordService.API.GET_RECORD, [appId, tblId]);

        let inputparams = {};
        inputparams[query.FORMAT_PARAM] = true;
        inputparams[query.QUERY_PARAM] = "testQuery";
        inputparams[query.COLUMNS_PARAM] = "testClist";
        inputparams[query.SORT_LIST_PARAM] = 123;
        recordService.getRecords(appId, tblId, inputparams);

        let expectedParams = {};
        expectedParams[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
        expectedParams[query.QUERY_PARAM] = inputparams[query.QUERY_PARAM];
        expectedParams[query.COLUMNS_PARAM] = inputparams[query.COLUMNS_PARAM];
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params : expectedParams});
    });

    it('test getRecords function with invalid query', () => {
        var appId = 1;
        var tblId = 2;
        var url = recordService.constructUrl(recordService.API.GET_RECORD, [appId, tblId]);

        let inputparams = {};
        inputparams[query.FORMAT_PARAM] = false;
        inputparams[query.QUERY_PARAM] = 123;
        inputparams[query.COLUMNS_PARAM] = "testClist";
        inputparams[query.SORT_LIST_PARAM] = "testSlist";

        recordService.getRecords(appId, tblId, inputparams);

        let expectedParams = {};
        expectedParams[query.COLUMNS_PARAM] = inputparams[query.COLUMNS_PARAM];
        expectedParams[query.SORT_LIST_PARAM] = inputparams[query.SORT_LIST_PARAM];
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params : expectedParams});
    });

    it('test getRecords function with invalid offset', () => {
        var appId = 1;
        var tblId = 2;
        var url = recordService.constructUrl(recordService.API.GET_RECORD, [appId, tblId]);

        let inputparams = {};
        inputparams[query.FORMAT_PARAM] = false;
        inputparams[query.QUERY_PARAM] = "testQuery";
        inputparams[query.OFFSET_PARAM] = "abc";
        inputparams[query.NUMROWS_PARAM] = 10;
        recordService.getRecords(appId, tblId, inputparams);

        let expectedParams = {};
        expectedParams[query.QUERY_PARAM] = inputparams[query.QUERY_PARAM];
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params : expectedParams});
    });

    it('test getRecords function with invalid rows', () => {
        var appId = 1;
        var tblId = 2;
        var url = recordService.constructUrl(recordService.API.GET_RECORD, [appId, tblId]);

        let inputparams = {};
        inputparams[query.FORMAT_PARAM] = false;
        inputparams[query.OFFSET_PARAM] = 10;
        inputparams[query.NUMROWS_PARAM] = "abc";
        recordService.getRecords(appId, tblId, inputparams);

        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params : {}});
    });

    it('test createRecord function', () => {
        var appId = 1;
        var tblId = 2;
        var url = recordService.constructUrl(recordService.API.CREATE_RECORD, [appId, tblId]);
        recordService.createRecord(appId, tblId, {});

        expect(BaseService.prototype.post).toHaveBeenCalledWith(url, {});
    });

    it('test saveRecord function', () => {
        var appId = 1;
        var tblId = 2;
        var recId = 3;
        var url = recordService.constructUrl(recordService.API.PATCH_RECORD, [appId, tblId, recId]);
        recordService.saveRecord(appId, tblId, recId, {});

        expect(BaseService.prototype.patch).toHaveBeenCalledWith(url, {});
    });

    it('test deleteRecord function', () => {
        var appId = 1;
        var tblId = 2;
        var recId = 3;
        var url = recordService.constructUrl(recordService.API.DELETE_RECORD, [appId, tblId, recId]);
        recordService.deleteRecord(appId, tblId, recId);

        expect(BaseService.prototype.delete).toHaveBeenCalledWith(url);
    });

    it('test deleteRecordBulk function', () => {
        var appId = 1;
        var tblId = 2;
        var recIds = [1, 2, 3];
        var url = recordService.constructUrl(recordService.API.DELETE_RECORD_BULK, [appId, tblId]);
        recordService.deleteRecordBulk(appId, tblId, recIds);

        expect(BaseService.prototype.deleteBulk).toHaveBeenCalledWith(url, {data: recIds});
    });
});
