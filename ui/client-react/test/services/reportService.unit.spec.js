import BaseService from '../../src/services/baseService';
import ReportService, {cachedReportRequest} from '../../src/services/reportService';
import constants from '../../src/services/constants';
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

    it('test getReport function', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT, [appId, tblId, rptId]);

        reportService.getReport(appId, tblId, rptId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url);
    });

    it('test getReport where it finds it in cache', (done) => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT, [appId, tblId, rptId]);
        var deferred;

        getSpy.and.callFake(function() {
            deferred = Promise.resolve("CachedVal");
            return deferred;
        });

        reportService.getReport(appId, tblId, rptId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url);
        getSpy.calls.reset();
        reportService.getReport(appId, tblId, rptId);
        expect(BaseService.prototype.get).not.toHaveBeenCalledWith(url);
        deferred.then(function() {
            getSpy.calls.reset();
            getSpy.and.stub();
            done();
        });
    });

    it('test getReports function', () => {
        var appId = 1;
        var tblId = 2;
        var url = reportService.constructUrl(reportService.API.GET_REPORTS, [appId, tblId]);

        reportService.getReports(appId, tblId);
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url);
    });

    it('test getReport Results function', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_RESULTS, [appId, tblId, rptId]);

        var queryParams = {};
        queryParams[query.FORMAT_PARAM] = true;
        queryParams[query.OFFSET_PARAM] = 0;
        queryParams[query.NUMROWS_PARAM] = 10;
        queryParams[query.GLIST_PARAM] = ['1', '2:V'].join('.');
        reportService.getReportData(appId, tblId, rptId, queryParams);

        var params = {};
        params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
        params[query.OFFSET_PARAM] = queryParams[query.OFFSET_PARAM];
        params[query.NUMROWS_PARAM] = queryParams[query.NUMROWS_PARAM];
        params[query.GLIST_PARAM] = queryParams[query.GLIST_PARAM];
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport Results function with no formatting', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_RESULTS, [appId, tblId, rptId]);

        var queryParams = {};
        queryParams[query.FORMAT_PARAM] = false;
        queryParams[query.OFFSET_PARAM] = 0;
        queryParams[query.NUMROWS_PARAM] = 10;
        reportService.getReportData(appId, tblId, rptId, queryParams);

        var params = {};
        params[query.OFFSET_PARAM] = queryParams[query.OFFSET_PARAM];
        params[query.NUMROWS_PARAM] = queryParams[query.NUMROWS_PARAM];
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport Results function with invalid offset', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_RESULTS, [appId, tblId, rptId]);

        var queryParams = {};
        queryParams[query.FORMAT_PARAM] = true;
        queryParams[query.OFFSET_PARAM] = [];
        queryParams[query.NUMROWS_PARAM] = 10;
        reportService.getReportData(appId, tblId, rptId, queryParams);

        var params = {};
        params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport Results function with no rows specified', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_RESULTS, [appId, tblId, rptId]);

        var queryParams = {};
        queryParams[query.FORMAT_PARAM] = true;
        queryParams[query.OFFSET_PARAM] = 0;
        reportService.getReportData(appId, tblId, rptId, queryParams);

        var params = {};
        params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport Results function with no parameters', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_RESULTS, [appId, tblId, rptId]);

        reportService.getReportData(appId, tblId, rptId);

        var params = {};
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport and facets function', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_COMPONENTS, [appId, tblId, rptId]);

        var queryParams = {};
        queryParams[query.FORMAT_PARAM] = true;
        queryParams[query.OFFSET_PARAM] = 0;
        queryParams[query.NUMROWS_PARAM] = 10;
        reportService.getReportDataAndFacets(appId, tblId, rptId, queryParams);

        var params = {};
        params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
        params[query.OFFSET_PARAM] = queryParams[query.OFFSET_PARAM];
        params[query.NUMROWS_PARAM] = queryParams[query.NUMROWS_PARAM];
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport and facets function with no formatting', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_COMPONENTS, [appId, tblId, rptId]);

        var queryParams = {};
        queryParams[query.OFFSET_PARAM] = 0;
        queryParams[query.NUMROWS_PARAM] = 10;
        reportService.getReportDataAndFacets(appId, tblId, rptId, queryParams);

        var params = {};
        params[query.OFFSET_PARAM] = queryParams[query.OFFSET_PARAM];
        params[query.NUMROWS_PARAM] = queryParams[query.NUMROWS_PARAM];
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport and facets function with no formatting and raw display set explicitly', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_COMPONENTS, [appId, tblId, rptId]);

        var queryParams = {};
        queryParams[query.FORMAT_PARAM] = false;
        queryParams[query.OFFSET_PARAM] = 0;
        queryParams[query.NUMROWS_PARAM] = 10;
        reportService.getReportDataAndFacets(appId, tblId, rptId, queryParams);

        var params = {};
        params[query.OFFSET_PARAM] = queryParams[query.OFFSET_PARAM];
        params[query.NUMROWS_PARAM] = queryParams[query.NUMROWS_PARAM];
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport and facets function with invalid offset', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_COMPONENTS, [appId, tblId, rptId]);

        var queryParams = {};
        queryParams[query.FORMAT_PARAM] = true;
        queryParams[query.OFFSET_PARAM] = [];
        queryParams[query.NUMROWS_PARAM] = 10;
        reportService.getReportDataAndFacets(appId, tblId, rptId, queryParams);

        var params = {};
        params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport and facets function with no rows specified', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_COMPONENTS, [appId, tblId, rptId]);

        var queryParams = {};
        queryParams[query.FORMAT_PARAM] = true;
        queryParams[query.OFFSET_PARAM] = 0;
        reportService.getReportDataAndFacets(appId, tblId, rptId, queryParams);

        var params = {};
        params[query.FORMAT_PARAM] = query.DISPLAY_FORMAT;
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport and facets function with sortlist', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_COMPONENTS, [appId, tblId, rptId]);

        var queryParams = {};
        queryParams[query.SORT_LIST_PARAM] = "6:V";
        reportService.getReportDataAndFacets(appId, tblId, rptId, queryParams);

        var params = {};
        params[query.SORT_LIST_PARAM] = queryParams[query.SORT_LIST_PARAM];
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport and facets function with invalid sortlist', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_COMPONENTS, [appId, tblId, rptId]);

        var queryParams = {};
        queryParams[query.SORT_LIST_PARAM] = null;
        reportService.getReportDataAndFacets(appId, tblId, rptId, queryParams);

        var params = {};
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport and facets function with columns', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_COMPONENTS, [appId, tblId, rptId]);

        var queryParams = {};
        queryParams[query.COLUMNS_PARAM] = "6.7";
        reportService.getReportDataAndFacets(appId, tblId, rptId, queryParams);

        var params = {};
        params[query.COLUMNS_PARAM] = queryParams[query.COLUMNS_PARAM];
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport and facets function with invalid columns', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_COMPONENTS, [appId, tblId, rptId]);

        var queryParams = {};
        queryParams[query.COLUMNS_PARAM] = "";
        reportService.getReportDataAndFacets(appId, tblId, rptId, queryParams);

        var params = {};
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport and facets function with query', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_COMPONENTS, [appId, tblId, rptId]);

        var queryParams = {};
        queryParams[query.QUERY_PARAM] = "'6'.EX.'7'";
        reportService.getReportDataAndFacets(appId, tblId, rptId, queryParams);

        var params = {};
        params[query.QUERY_PARAM] = queryParams[query.QUERY_PARAM];
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport and facets function with invalid query', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_COMPONENTS, [appId, tblId, rptId]);

        var queryParams = {};
        queryParams[query.QUERY_PARAM] = [];
        reportService.getReportDataAndFacets(appId, tblId, rptId, queryParams);

        var params = {};
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport and facets function with no parameters', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_COMPONENTS, [appId, tblId, rptId]);

        reportService.getReportDataAndFacets(appId, tblId, rptId);

        var params = {};
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

    describe('Test Cache of a report fetch', () => {

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
