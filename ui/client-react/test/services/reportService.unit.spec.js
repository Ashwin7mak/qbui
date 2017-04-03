import BaseService from '../../src/services/baseService';
import ReportService, {cachedReportRequest} from '../../src/services/reportService';
import Constants from '../../../common/src/constants';
import * as query from '../../src/constants/query';

describe('ReportService functions', () => {
    'use strict';
    var reportService;
    var getSpy;

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');
        getSpy = spyOn(BaseService.prototype, 'get');

        reportService = new ReportService();
    });

    it('test getReportMetaData function', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_META, [appId, tblId, rptId]);

        reportService.getReportMetaData(appId, tblId, rptId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url);
    });

    it('test getReportMetaData where it finds it in cache', (done) => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_META, [appId, tblId, rptId]);
        var deferred;

        getSpy.and.callFake(function() {
            deferred = Promise.resolve("CachedVal");
            return deferred;
        });

        reportService.getReportMetaData(appId, tblId, rptId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url);
        getSpy.calls.reset();
        reportService.getReportMetaData(appId, tblId, rptId);
        expect(BaseService.prototype.get).not.toHaveBeenCalledWith(url);
        deferred.then(function() {
            getSpy.calls.reset();
            getSpy.and.stub();
            done();
        });
    });

    it('test getReportRecordsCount function', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_RECORDS_COUNT, [appId, tblId, rptId]);

        reportService.getReportRecordsCount(appId, tblId, rptId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params: {}});
    });

    it('test getReports function', () => {
        var appId = 1;
        var tblId = 2;
        var url = reportService.constructUrl(reportService.API.GET_REPORTS, [appId, tblId]);

        reportService.getReports(appId, tblId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url);
    });

    it('test getReportResults function with no query parameters or formatting', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_RESULTS, [appId, tblId, rptId]);

        var params = {};
        params[query.OFFSET_PARAM] = Constants.PAGE.DEFAULT_OFFSET;
        params[query.NUMROWS_PARAM] = Constants.PAGE.DEFAULT_NUM_ROWS;

        reportService.getReportResults(appId, tblId, rptId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getDynamicReportResults function with no query parameters or formatting', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_INVOKE_RESULTS, [appId, tblId, rptId]);

        var params = {};
        params[query.OFFSET_PARAM] = Constants.PAGE.DEFAULT_OFFSET;
        params[query.NUMROWS_PARAM] = Constants.PAGE.DEFAULT_NUM_ROWS;

        reportService.getDynamicReportResults(appId, tblId, rptId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReportResults function with formatting but no query parameters ', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_RESULTS, [appId, tblId, rptId]);

        var params = {};
        params[query.FORMAT_PARAM] = Constants.FORMAT.DISPLAY;
        params[query.OFFSET_PARAM] = Constants.PAGE.DEFAULT_OFFSET;
        params[query.NUMROWS_PARAM] = Constants.PAGE.DEFAULT_NUM_ROWS;

        reportService.getReportResults(appId, tblId, rptId, null, true);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getDynamicReportResults function with formatting but no query parameters ', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_INVOKE_RESULTS, [appId, tblId, rptId]);

        var params = {};
        params[query.FORMAT_PARAM] = Constants.FORMAT.DISPLAY;
        params[query.OFFSET_PARAM] = Constants.PAGE.DEFAULT_OFFSET;
        params[query.NUMROWS_PARAM] = Constants.PAGE.DEFAULT_NUM_ROWS;

        reportService.getDynamicReportResults(appId, tblId, rptId, null, true);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReportResults function with query parameters and formatting', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;

        var queryParams = {};
        queryParams[query.OFFSET_PARAM] = 10;
        queryParams[query.NUMROWS_PARAM] = 20;
        queryParams[query.SORT_LIST_PARAM] = '1:EQUALS';

        var url = reportService.constructUrl(reportService.API.GET_REPORT_RESULTS, [appId, tblId, rptId]);

        var params = {};
        params[query.OFFSET_PARAM] = queryParams.offset;
        params[query.NUMROWS_PARAM] = queryParams.numRows;
        params[query.SORT_LIST_PARAM] = '1:EQUALS';
        params[query.FORMAT_PARAM] = Constants.FORMAT.DISPLAY;

        reportService.getReportResults(appId, tblId, rptId, queryParams, true);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getDynamicReportResults function with query parameters and formatting', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;

        var queryParams = {};
        queryParams[query.OFFSET_PARAM] = 10;
        queryParams[query.NUMROWS_PARAM] = 20;
        queryParams[query.SORT_LIST_PARAM] = '1:EQUALS';

        var url = reportService.constructUrl(reportService.API.GET_INVOKE_RESULTS, [appId, tblId, rptId]);

        var params = {};
        params[query.OFFSET_PARAM] = queryParams.offset;
        params[query.NUMROWS_PARAM] = queryParams.numRows;
        params[query.SORT_LIST_PARAM] = '1:EQUALS';
        params[query.FORMAT_PARAM] = Constants.FORMAT.DISPLAY;

        reportService.getDynamicReportResults(appId, tblId, rptId, queryParams, true);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReportResults function with invalid query parameters and formatting', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var pagingParams = {
            offset: [],
            numRows: 20
        };
        var url = reportService.constructUrl(reportService.API.GET_REPORT_RESULTS, [appId, tblId, rptId]);

        var params = {};
        params[query.OFFSET_PARAM] = Constants.PAGE.DEFAULT_OFFSET;
        params[query.NUMROWS_PARAM] = Constants.PAGE.DEFAULT_NUM_ROWS;
        params[query.FORMAT_PARAM] = Constants.FORMAT.DISPLAY;

        reportService.getReportResults(appId, tblId, rptId, pagingParams, true);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getDynamicReportResults function with invalid query parameters and formatting', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var pagingParams = {
            offset: [],
            numRows: 20
        };
        var url = reportService.constructUrl(reportService.API.GET_INVOKE_RESULTS, [appId, tblId, rptId]);

        var params = {};
        params[query.OFFSET_PARAM] = Constants.PAGE.DEFAULT_OFFSET;
        params[query.NUMROWS_PARAM] = Constants.PAGE.DEFAULT_NUM_ROWS;
        params[query.FORMAT_PARAM] = Constants.FORMAT.DISPLAY;

        reportService.getDynamicReportResults(appId, tblId, rptId, pagingParams, true);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test resolveFacets function with no parameters', () => {
        reportService.parseFacetExpression();

        var params = {};
        expect(BaseService.prototype.get).toHaveBeenCalledWith(reportService.API.PARSE_FACET_EXPR,  {params: params});
    });

    it('test resolveFacets function with parameters', () => {
        var facetExp = [{fid: 3, values: [1, 2]}];
        reportService.parseFacetExpression(facetExp);

        var params = {};
        params[query.FACET_EXPRESSION] = facetExp;
        expect(BaseService.prototype.get).toHaveBeenCalledWith(reportService.API.PARSE_FACET_EXPR,  {params: params});
    });

    describe('Test Cache of a fetch by key', () => {

        beforeEach(() => {
            reportService._clear();
        });
        afterEach(() => {
            reportService._clear();
        });

        it('should clear the cache', () => {
            let x = reportService._getCache();
            x.a = 1;
            reportService._clear();
            expect(reportService._getCache()).toEqual({});
        });

        it('should make uniq keys', () => {
            let args1 = ["a", "b", "c"];
            let args2 = ["a", "c", "b"];
            expect(reportService._key(args1)).not.toEqual(reportService._key(args2));
        });

        it('should make same keys', () => {
            let args1 = ["a", "b", "c"];
            let args2 = ["a", "c", "b"];
            expect(reportService._key(args1)).toEqual(reportService._key(args1));
            expect(reportService._key(args2)).toEqual(reportService._key(args2));
        });

        it('should add to cache and find it in cache', () => {
            let args1 = ["a", "b", "c"];
            let expectedValue = "claire";
            let signature = reportService._key(args1);
            reportService._cache(expectedValue, signature);
            expect(reportService._getCache()).not.toEqual({});
            let cachedValue = reportService._cached(signature);
            expect(cachedValue).toEqual(expectedValue);
        });

        it('should overwrite cache with diff entry', () => {
            let args1 = "A";
            let value1 = "setA";
            let args2 = "Z";
            let value2 = "setZ";

            let signature1 = reportService._key(args1);
            reportService._cache(value1, signature1);
            expect(reportService._cached(signature1)).toEqual(value1);

            let signature2 = reportService._key(args2);
            reportService._cache(value2, signature2);
            expect(reportService._cached(signature2)).toEqual(value2);

            expect(reportService._cached(signature1)).toEqual(undefined);
        });
    });

});
