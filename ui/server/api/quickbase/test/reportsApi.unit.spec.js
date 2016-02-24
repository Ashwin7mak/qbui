'use strict';

var config = {
    javaHost: 'http://javaHost',
    SSL_KEY : {
        private    : 'privateKey',
        cert       : 'cert',
        requireCert: true
    }
};
var sinon = require('sinon');
var assert = require('assert');
var requestHelper = require('./../requestHelper')(config);
var reportsApi = require('../reportsApi')(config);
var recordsApi = require('../recordsApi')(config);
let errorCodes = require('../../errorCodes');
/**
 * Unit tests for report apis
 */
describe('Validate ReportsApi unit tests', function() {

    /**
     * Unit test fetchFacets api
     */
    describe('validate fetchFacets api', function() {
        var executeReqSpy = null;
        var req = {
            headers: {
                'tid': 'tid'
            },
            'Content-Type': 'content-type',
            'url': '/testurl.com',
            'method': 'get'
        };
        beforeEach(function() {
            reportsApi.setRequestHelper(requestHelper);
            executeReqSpy = sinon.spy(requestHelper, "executeRequest");
        });
        afterEach(function() {
            executeReqSpy.restore();
        });
        it('Test success ', function(done) {
            var requestStub = sinon.stub();
            requestHelper.setRequestObject(requestStub);
            requestStub.yields(null, {statusCode: 200}, {'body': 'body'});
            var promise = reportsApi.fetchFacetResults(req);
            promise.then(
                function(response) {
                    assert.deepEqual(response, {statusCode: 200});
                    assert(executeReqSpy.called);
                    var opts = executeReqSpy.args[0][1];
                    assert.equal(opts.headers['Content-Type'], 'application/json');
                }
            );
            done();
        });
        it('Test facets url ', function(done) {
            req.url = "/reports/2/reportComponents";
            var requestStub = sinon.stub();
            requestHelper.setRequestObject(requestStub);
            requestStub.yields(null, {statusCode: 200}, {'body': 'body'});
            var promise = reportsApi.fetchFacetResults(req);
            promise.then(
                function(response) {
                    assert.deepEqual(response, {statusCode: 200});
                    assert(executeReqSpy.called);
                    var opts = executeReqSpy.args[0][1];
                    assert.equal(opts.headers['Content-Type'], 'application/json');
                    var indexOfFacetsURL = opts.url.indexOf('reports/2/facets/results');
                    assert.notEqual(indexOfFacetsURL, -1);
                }
            );
            done();
        });
        it('Test failure ', function(done) {
            var requestStub = sinon.stub();
            requestHelper.setRequestObject(requestStub);
            requestStub.yields(new Error("error"));
            var promise = reportsApi.fetchFacetResults(req);
            promise.then(
                function(response) {
                    assert.deepEqual(response, {statusCode: 200});
                    assert(executeReqSpy.called);
                    var opts = executeReqSpy.args[0][1];
                    assert.equal(opts.headers['Content-Type'], 'application/json');
                },
                function(response) {
                    assert.deepEqual(response, new Error("error"));
                }
            );
            done();
        });
    });

    /**
     * Unit test fetchReportResults api
     */
    describe('validate fetchReportResults api', function() {
        var req = {
            headers: {
                'tid': 'tid'
            },
            'Content-Type': 'content-type',
            'url': '/testurl.com',
            'method': 'get'
        };
        beforeEach(function() {
            reportsApi.setRecordsApi(recordsApi);
        });
        afterEach(function() {
            recordsApi.fetchRecordsAndFields.restore();
        });
        it('Test success ', function(done) {
            var getRecordsStub = sinon.stub(recordsApi, "fetchRecordsAndFields");
            getRecordsStub.returns({
                records: [],
                fields: []
            });
            var response = reportsApi.fetchReportResults(req);
            assert.deepEqual(response, {
                records: [],
                fields: []
            });
            done();
        });
        it('Test failure ', function(done) {
            var getRecordsStub = sinon.stub(recordsApi, "fetchRecordsAndFields");
            getRecordsStub.returns(new Error("error"));
            var response = reportsApi.fetchReportResults(req);
            assert.deepEqual(response, new Error("error"));
            done();
        });
    });

    /**
     * Unit test fetchReportComponents api
     */
    describe('validate fetchReportComponents api', function() {
        var req = {
            headers: {
                'tid': 'tid'
            },
            'Content-Type': 'content-type',
            'url': '/testurl.com',
            'method': 'get'
        };
        reportsApi.setRecordsApi(recordsApi);
        var expectedSuccessResponse = {
            records: [],
            fields: [],
            facets: []
        };
        var expectedUnknownErrorResponse = {
            records: [],
            fields: [],
            facets: [{id: null, errorMessage: 'unknownError'}]
        };
        var fetchReportResultsPromise = Promise.resolve({records: [], fields: []});
        var fetchFacetsPromise = Promise.resolve({facets: []});
        afterEach(function() {
            reportsApi.fetchFacetResults.restore();
            reportsApi.fetchReportResults.restore();
        });
        it('Test success', function(done) {
            var getReportResults = sinon.stub(reportsApi, "fetchReportResults");
            var getFacetsStub = sinon.stub(reportsApi, "fetchFacetResults");
            getReportResults.returns(fetchReportResultsPromise);
            getFacetsStub.returns(fetchFacetsPromise);
            var promise = reportsApi.fetchReportComponents(req);
            promise.then(
                function(response) {
                    assert.deepEqual(response, expectedSuccessResponse);
                }
            );
            done();
        });
        it('Test error from reportResults', function(done) {
            var getReportResults = sinon.stub(reportsApi, "fetchReportResults");
            var getFacetsStub = sinon.stub(reportsApi, "fetchFacetResults");
            getReportResults.returns(Promise.reject(new Error("error")));
            getFacetsStub.returns(fetchFacetsPromise);
            var promise = reportsApi.fetchReportComponents(req);
            promise.then(
                function(response) {
                },
                function(error) {
                    assert.deepEqual(error, new Error("error"));
                }
            );
            done();
        });
        it('Test error from fetchFacets', function(done) {
            var getReportResults = sinon.stub(reportsApi, "fetchReportResults");
            var getFacetsStub = sinon.stub(reportsApi, "fetchFacetResults");
            getReportResults.returns(fetchReportResultsPromise);
            getFacetsStub.returns(Promise.reject(new Error("error")));
            var promise = reportsApi.fetchReportComponents(req);
            promise.then(
                function(response) {
                    assert.deepEqual(response, expectedUnknownErrorResponse);
                }
            );
            done();
        });
        it('Test 10K error from fetchFacets', function(done) {
            var getReportResults = sinon.stub(reportsApi, "fetchReportResults");
            var fetchFacetsErrorPromise = Promise.reject({body:'[{"code":' + errorCodes.ERROR_CODE.FACET.REPORT_TOO_BIG + '}]'});
            var getFacetsErrorStub = sinon.stub(reportsApi, "fetchFacetResults");
            getReportResults.returns(fetchReportResultsPromise);
            getFacetsErrorStub.returns(fetchFacetsErrorPromise);

            var errorExpectedResponse = {
                records: [],
                fields: [],
                facets: [{id: null, errorMessage: errorCodes.ERROR_MSG_KEY.FACET.REPORT_TOO_BIG}]
            };
            var promise = reportsApi.fetchReportComponents(req);
            promise.then(
                function(response) {
                    assert.deepEqual(response, errorExpectedResponse);
                }
            );
            done();
        });
    });
});
