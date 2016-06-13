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
                    done();
                },
                function(error) {
                    done(new Error("Unexpected promise error returned with test success"));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve test success: ' + JSON.stringify(errorMsg)));
            });
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
                    done();
                },
                function(error) {
                    done(new Error("Unexpected promise error returned with test facets url"));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve test facets url: ' + JSON.stringify(errorMsg)));
            });
        });
        it('Test failure ', function(done) {
            var requestStub = sinon.stub();
            requestHelper.setRequestObject(requestStub);
            requestStub.yields(new Error("error"));
            var promise = reportsApi.fetchFacetResults(req);
            promise.then(
                function(response) {
                    done();
                    assert.deepEqual(response, {statusCode: 200});
                    assert(executeReqSpy.called);
                    var opts = executeReqSpy.args[0][1];
                    assert.equal(opts.headers['Content-Type'], 'application/json');
                },
                function(response) {
                    done();
                    assert.deepEqual(response, new Error("error"));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve test failure: ' + JSON.stringify(errorMsg)));
            });
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
        var getRecordsStub;
        beforeEach(function() {
            getRecordsStub = sinon.stub(recordsApi, "fetchRecordsAndFields");
            reportsApi.setRecordsApi(recordsApi);
        });
        afterEach(function() {
            getRecordsStub.restore();
        });
        it('Test success ', function(done) {
            getRecordsStub.returns(Promise.resolve({
                records: [],
                fields: []
            }));
            var promise = reportsApi.fetchReportResults(req);
            promise.then(
                function(response) {
                    assert.deepEqual(response, {
                        records: [],
                        fields: []
                    });
                    done();
                },
                function(error) {
                    done(new Error('Failure promise unexpectedly returned testing fetchReportResults success'));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchReportResults success: ' + JSON.stringify(errorMsg)));
            });
        });
        it('Test failure ', function(done) {
            getRecordsStub.returns(Promise.reject(new Error("error")));
            var promise = reportsApi.fetchReportResults(req);
            promise.then(
                function(response) {
                    done(new Error('Success promise unexpectedly return testing fetchReportResults failure'));
                },
                function(error) {
                    assert.deepEqual(error, new Error("error"));
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchReportResults failure: ' + JSON.stringify(errorMsg)));
            });
        });
    });

    /**
     * Unit test fetchReportResults api
     */
    describe('validate fetchReportTableHomepage api', function() {
        var req = {
            headers: {
                'tid': 'tid'
            },
            'Content-Type': 'content-type',
            'url': 'apps/123/tables/456/homepagereportid',
            'method': 'get'
        };

        var reportObj = {
            reportMetaData: {
                data: ''
            },
            reportData: {
                data: ''
            }
        };

        var getExecuteRequestStub;
        var fetchReportComponentsStub;
        beforeEach(function() {
            getExecuteRequestStub = sinon.stub(requestHelper, "executeRequest");
            fetchReportComponentsStub = sinon.stub(reportsApi, "fetchReportComponents");
        });
        afterEach(function() {
            getExecuteRequestStub.restore();
            fetchReportComponentsStub.restore();
        });
        it('Test success ', function(done) {
            getExecuteRequestStub.returns(Promise.resolve({body:'1'}));
            fetchReportComponentsStub.returns(Promise.resolve('reportData'));

            var promise = reportsApi.fetchTableHomePageReport(req);
            promise.then(
                function(response) {
                    reportObj.reportMetaData.data = '1';
                    reportObj.reportData.data = 'reportData';
                    assert.deepEqual(response, reportObj);
                    done();
                },
                function(error) {
                    done(new Error("promise error response return unexpectely"));
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchTableHomePageReport success: ' + JSON.stringify(errorMsg)));
            });
        });
        it('Test failure on fetchReportComponent', function(done) {
            getExecuteRequestStub.returns(Promise.resolve({body:'1'}));
            fetchReportComponentsStub.returns(Promise.reject(new Error("error")));
            var promise = reportsApi.fetchTableHomePageReport(req);
            promise.then(
                function(response) {
                    done(new Error("promise success response return unexpectely"));
                },
                function(error) {
                    assert.deepEqual(error, new Error("error"));
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetchReportComponent failure: ' + JSON.stringify(errorMsg)));
            });
        });

        it('Test failure on fetch table homepage report id and error body', function(done) {
            var errorObj = {
                body: 'error body'
            };
            getExecuteRequestStub.returns(Promise.reject(errorObj));
            fetchReportComponentsStub.returns(Promise.reject(new Error("report component error")));
            var promise = reportsApi.fetchTableHomePageReport(req);
            promise.then(
                function(response) {
                    done(new Error("promise success response return unexpectely"));
                },
                function(error) {
                    assert.deepEqual(error, errorObj);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetch table homepage failure: ' + JSON.stringify(errorMsg)));
            });
        });

        it('Test failure on fetch table homepage report id with error status message', function(done) {
            var errorObj = {
                statusMessage: 'error statusMessage'
            };
            getExecuteRequestStub.returns(Promise.reject(errorObj));
            fetchReportComponentsStub.returns(Promise.reject(new Error("report component error")));
            var promise = reportsApi.fetchTableHomePageReport(req);
            promise.then(
                function(response) {
                    done(new Error("promise success response return unexpectely"));
                },
                function(error) {
                    assert.deepEqual(error, errorObj);
                    done();
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetch table homepage failure: ' + JSON.stringify(errorMsg)));
            });
        });

        it('Test unexpected error on fetch table homepage report id', function(done) {
            getExecuteRequestStub.returns(Promise.resolve({body:'1'}));
            fetchReportComponentsStub.returns(Promise.reject('report component error'));
            var promise = reportsApi.fetchTableHomePageReport(req);
            promise.then(
                function(response) {
                    done(new Error("promise success response return unexpectely"));
                },
                function(error) {
                    //  an error was thrown
                    done();
                    assert.ok(error);
                }
            ).catch(function(errorMsg) {
                done(new Error('unable to resolve fetch table homepage unexpected failure: ' + JSON.stringify(errorMsg)));
            });
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
            facets: [{id: null, errorCode: errorCodes.UNKNOWN}]
        };
        var fetchReportResultsPromise = Promise.resolve({records: [], fields: []});
        var fetchFacetsPromise = Promise.resolve({body:'[[[{"id":142,"value":"2015-08-13"}],[{"id":142,"value":"2015-09-10"}]],[[{"id":7,"value":"Email Received"}],[{"id":7,"value":"Email Sent"}]]]'});
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
                    done();
                    assert.deepEqual(response, expectedSuccessResponse);
                },
                function(error) {
                    done(new Error("error"));
                }
            );
        });
        it('Test error from reportResults', function(done) {
            var getReportResults = sinon.stub(reportsApi, "fetchReportResults");
            var getFacetsStub = sinon.stub(reportsApi, "fetchFacetResults");
            getReportResults.returns(Promise.reject(new Error("error")));
            getFacetsStub.returns(fetchFacetsPromise);
            var promise = reportsApi.fetchReportComponents(req);
            promise.then(
                function(response) {
                    done(new Error("Unexpected success promise return with test error from reportResults"));
                },
                function(error) {
                    done();
                    assert.deepEqual(error, new Error("error"));
                }
            );
        });
        it('Test error from fetchFacets', function(done) {
            var getReportResults = sinon.stub(reportsApi, "fetchReportResults");
            var getFacetsStub = sinon.stub(reportsApi, "fetchFacetResults");
            getReportResults.returns(fetchReportResultsPromise);
            getFacetsStub.returns(Promise.reject(new Error("error")));
            var promise = reportsApi.fetchReportComponents(req);
            promise.then(
                function(response) {
                    done();
                    assert.deepEqual(response, expectedUnknownErrorResponse);
                },
                function(error) {
                    done(new Error("unexpected failure promise returned with fetch facets"));
                }
            );
        });
        it('Test 10K error from fetchFacets', function(done) {
            var getReportResults = sinon.stub(reportsApi, "fetchReportResults");
            var fetchFacetsErrorPromise = Promise.reject({body:'[{"code":' + errorCodes.UNKNOWN + '}]'});
            var getFacetsErrorStub = sinon.stub(reportsApi, "fetchFacetResults");
            getReportResults.returns(fetchReportResultsPromise);
            getFacetsErrorStub.returns(fetchFacetsErrorPromise);

            var errorExpectedResponse = {
                records: [],
                fields: [],
                facets: [{id: null, errorCode: errorCodes.UNKNOWN}]
            };
            var promise = reportsApi.fetchReportComponents(req);
            promise.then(
                function(response) {
                    done();
                    assert.deepEqual(response, errorExpectedResponse);
                },
                function(error) {
                    done(new Error("unexpected failure promise returned with 10k fetch facets"));
                }
            );
        });
    });
});
