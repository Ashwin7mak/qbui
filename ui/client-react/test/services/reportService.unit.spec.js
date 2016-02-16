import BaseService from '../../src/services/baseService';
import ReportService from '../../src/services/reportService';
import constants from '../../src/services/constants';

describe('ReportService functions', () => {
    'use strict';
    var reportService;

    beforeEach(() => {
        spyOn(BaseService.prototype, 'setRequestInterceptor');
        spyOn(BaseService.prototype, 'setResponseInterceptor');
        spyOn(BaseService.prototype, 'get');

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

        var formatted = true;
        var offset = 0;
        var rows = 10;
        reportService.getReportData(appId, tblId, rptId, formatted, offset, rows);

        var params = {format:'display', offset:offset, numRows:rows};
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport Results function with no formatting', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_RESULTS, [appId, tblId, rptId]);

        var formatted = false;
        var offset = 0;
        var rows = 10;
        reportService.getReportData(appId, tblId, rptId, formatted, offset, rows);

        var params = {offset:offset, numRows:rows};
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport Results function with invalid offset', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_RESULTS, [appId, tblId, rptId]);

        var formatted = true;
        var offset = [];
        var rows = 10;
        reportService.getReportData(appId, tblId, rptId, formatted, offset, rows);

        var params = {format:'display'};
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport Results function with no rows specified', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_RESULTS, [appId, tblId, rptId]);

        var formatted = true;
        var offset = 0;
        reportService.getReportData(appId, tblId, rptId, formatted, offset);

        var params = {format:'display'};
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
        var url = reportService.constructUrl(reportService.API.GET_REPORT_AND_FACETS, [appId, tblId, rptId]);

        var formatted = true;
        var offset = 0;
        var rows = 10;
        reportService.getReportDataAndFacets(appId, tblId, rptId, formatted, offset, rows);

        var params = {format:'display', offset:offset, numRows:rows};
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport and facets function with no formatting', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_AND_FACETS, [appId, tblId, rptId]);

        var formatted = false;
        var offset = 0;
        var rows = 10;
        reportService.getReportDataAndFacets(appId, tblId, rptId, formatted, offset, rows);

        var params = {offset:offset, numRows:rows};
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport and facets function with invalid offset', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_AND_FACETS, [appId, tblId, rptId]);

        var formatted = true;
        var offset = [];
        var rows = 10;
        reportService.getReportDataAndFacets(appId, tblId, rptId, formatted, offset, rows);

        var params = {format:'display'};
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport and facets function with no rows specified', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_AND_FACETS, [appId, tblId, rptId]);

        var formatted = true;
        var offset = 0;
        reportService.getReportDataAndFacets(appId, tblId, rptId, formatted, offset);

        var params = {format:'display'};
        expect(BaseService.prototype.get).toHaveBeenCalledWith(url, {params:params});
    });

    it('test getReport and facets function with no parameters', () => {
        var appId = 1;
        var tblId = 2;
        var rptId = 3;
        var url = reportService.constructUrl(reportService.API.GET_REPORT_AND_FACETS, [appId, tblId, rptId]);

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

        var params = {facetexpression: facetExp};
        expect(BaseService.prototype.get).toHaveBeenCalledWith(reportService.API.PARSE_FACET_EXPR,  {params: params});
    });

});
