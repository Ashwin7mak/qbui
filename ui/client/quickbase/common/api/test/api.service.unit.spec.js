'use strict';

describe('quickbase api service', function () {
    var scope, ApiService, $httpBackend;
    var appId = '1', tableId = '2', fieldId = '3', recordId = '4', reportId = '5';
    var offset = 0, rows = 10;

    beforeEach(function() {
        module('qbse.api','ngMockE2E');
    });

    beforeEach(inject(function ($rootScope, _ApiService_, _$httpBackend_, $q) {
        scope = $rootScope.$new();
        ApiService = _ApiService_;
        $httpBackend = _$httpBackend_;
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('Test getApp API call', function () {
        $httpBackend.expectGET('/api/v1/apps/' + appId).respond(200);
        ApiService.getApp(appId);
        $httpBackend.flush();
    });

    it('Test getFields API call', function () {
        $httpBackend.expectGET('/api/v1/apps/' + appId + '/tables/' + tableId + '/fields').respond(200);
        ApiService.getFields(appId, tableId);
        $httpBackend.flush();
    });

    it('Test getField API call', function () {
        $httpBackend.expectGET('/api/v1/apps/' + appId + '/tables/' + tableId + '/fields/' + fieldId, function(headers) {
            return !headers.ticket;
        }).respond(200);
        ApiService.getField(appId, tableId, fieldId);
        $httpBackend.flush();
    });

    it('Test getRecords API call', function () {
        var queryParams = '?numRows=10&offset=0';
        $httpBackend.expectGET('/api/v1/apps/' + appId + '/tables/' + tableId + '/records' + queryParams).respond(200);
        ApiService.getRecords(appId, tableId, offset, rows);
        $httpBackend.flush();
    });

    it('Test formatted getRecords API call', function () {
        var queryParams = '?format=display&numRows=10&offset=0';
        $httpBackend.expectGET('/api/v1/apps/' + appId + '/tables/' + tableId + '/records' + queryParams).respond(200);
        ApiService.getFormattedRecords(appId, tableId, offset, rows);
        $httpBackend.flush();
    });

    it('Test getReport API call', function () {
        $httpBackend.expectGET('/api/v1/apps/' + appId + '/tables/' + tableId + '/reports/' + reportId).respond(200);
        ApiService.getReport(appId, tableId, reportId);
        $httpBackend.flush();
    });

    it('Test getReports API call', function () {
        $httpBackend.expectGET('/api/v1/apps/' + appId + '/tables/' + tableId + '/reports').respond(200);
        ApiService.getReports(appId, tableId);
        $httpBackend.flush();
    });

    it('Test runReport API call', function () {
        var queryParams = '?numRows=10&offset=0';
        $httpBackend.expectGET('/api/v1/apps/' + appId + '/tables/' + tableId + '/reports/' + reportId + '/results' + queryParams).respond(200);
        ApiService.runReport(appId, tableId, reportId, offset, rows);
        $httpBackend.flush();
    });

    it('Test formatted runReport API call', function () {
        var queryParams = '?format=display&numRows=10&offset=0';
        $httpBackend.expectGET('/api/v1/apps/' + appId + '/tables/' + tableId + '/reports/' + reportId + '/results' + queryParams).respond(200);
        ApiService.runFormattedReport(appId, tableId, reportId, offset, rows);
        $httpBackend.flush();
    });
});
