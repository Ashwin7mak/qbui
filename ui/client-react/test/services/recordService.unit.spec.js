import BaseService from '../../src/services/baseService';
import RecordService from '../../src/services/recordService';
import constants from '../../src/services/constants';

describe('RecordService functions', () => {
    'use strict';
    var recordService;

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');
        spyOn(BaseService.prototype, 'get');

        recordService = new RecordService();
    });

    it('test getRecords function with reqd parameters', () => {
        var appId = 1;
        var tblId = 2;
        recordService.getRecords(appId, tblId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(constants.APPS + '/' + appId + '/' + constants.TABLES + '/' + tblId + '/' + constants.RECORDS, {params: {}});
    });

    it('test getRecords function with formatting', () => {
        var appId = 1;
        var tblId = 2;
        let formatted = true;
        recordService.getRecords(appId, tblId, formatted);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(constants.APPS + '/' + appId + '/' + constants.TABLES + '/' + tblId + '/' + constants.RECORDS, {params : {format : 'display'}});
    });

    it('test getRecords function with valid optional parameters', () => {
        var appId = 1;
        var tblId = 2;
        let params = {};
        params.query = "testQuery";
        params.clist = "testClist";
        params.slist = "testSlist";
        params.offset = 10;
        params.rows = 10;
        recordService.getRecords(appId, tblId, true, params);

        let expectedParams = {};
        expectedParams.format = "display";
        expectedParams.query = "testQuery";
        expectedParams.clist = "testClist";
        expectedParams.slist = "testSlist";
        expectedParams.offset = 10;
        expectedParams.numRows = 10;
        expect(BaseService.prototype.get).toHaveBeenCalledWith(constants.APPS + '/' + appId + '/' + constants.TABLES + '/' + tblId + '/' + constants.RECORDS, {params : expectedParams});
    });

    it('test getRecords function with invalid clist', () => {
        var appId = 1;
        var tblId = 2;
        let inputparams = {};
        inputparams.query = "testQuery";
        inputparams.clist = 123;
        inputparams.slist = "testSlist";
        recordService.getRecords(appId, tblId, true, inputparams);

        let expectedParams = {};
        expectedParams.format = "display";
        expectedParams.query = "testQuery";
        expectedParams.slist = "testSlist";
        expect(BaseService.prototype.get).toHaveBeenCalledWith(constants.APPS + '/' + appId + '/' + constants.TABLES + '/' + tblId + '/' + constants.RECORDS, {params : expectedParams});
    });

    it('test getRecords function with invalid slist', () => {
        var appId = 1;
        var tblId = 2;
        let inputparams = {};
        inputparams.query = "testQuery";
        inputparams.clist = "testClist";
        inputparams.slist = 123;
        recordService.getRecords(appId, tblId, false, inputparams);

        let expectedParams = {};
        expectedParams.query = "testQuery";
        expectedParams.clist = "testClist";
        expect(BaseService.prototype.get).toHaveBeenCalledWith(constants.APPS + '/' + appId + '/' + constants.TABLES + '/' + tblId + '/' + constants.RECORDS, {params : expectedParams});
    });

    it('test getRecords function with invalid query', () => {
        var appId = 1;
        var tblId = 2;
        let inputparams = {};
        inputparams.query = 123;
        inputparams.clist = "testClist";
        inputparams.slist = "testSlist";
        recordService.getRecords(appId, tblId, false, inputparams);

        let expectedParams = {};
        expectedParams.clist = "testClist";
        expectedParams.slist = "testSlist";
        expect(BaseService.prototype.get).toHaveBeenCalledWith(constants.APPS + '/' + appId + '/' + constants.TABLES + '/' + tblId + '/' + constants.RECORDS, {params : expectedParams});
    });

    it('test getRecords function with invalid offset', () => {
        var appId = 1;
        var tblId = 2;
        let inputparams = {};
        inputparams.query = "testQuery";
        inputparams.offset = "abc";
        inputparams.rows = 10;
        recordService.getRecords(appId, tblId, false, inputparams);

        let expectedParams = {};
        expectedParams.query = "testQuery";
        expect(BaseService.prototype.get).toHaveBeenCalledWith(constants.APPS + '/' + appId + '/' + constants.TABLES + '/' + tblId + '/' + constants.RECORDS, {params : expectedParams});
    });

    it('test getRecords function with invalid rows', () => {
        var appId = 1;
        var tblId = 2;
        let inputparams = {};
        inputparams.rows = "abc";
        inputparams.offset = 10;
        recordService.getRecords(appId, tblId, false, inputparams);

        expect(BaseService.prototype.get).toHaveBeenCalledWith(constants.APPS + '/' + appId + '/' + constants.TABLES + '/' + tblId + '/' + constants.RECORDS, {params : {}});
    });
});
