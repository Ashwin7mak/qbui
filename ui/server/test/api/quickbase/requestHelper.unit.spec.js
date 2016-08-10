'use strict';

var config = {
    javaHost: 'http://javaHost',
    SSL_KEY : {
        private    : 'privateKey',
        cert       : 'cert',
        requireCert: true
    }
};

var requestHelper = require('./../../../src/api/quickbase/requestHelper')(config);
var should = require('should');
var assert = require('assert');
var sinon = require('sinon');
var log = require('./../../../src/logger').getLogger();

/**
 * Unit tests for User field formatting
 */
describe('Validate RequestHelper unit tests', function() {

    var stubLog;

    beforeEach(function() {
        stubLog = sinon.stub(log, 'error').returns(true);
    });
    afterEach(function() {
        stubLog.restore();
    });

    /**
     * Unit test the helper methods
     */
    describe('validate the http request methods', function() {

        var reqMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
        reqMethods.forEach(function(reqMethod, idx) {
            var req = {};
            req.method = reqMethod;
            it('Test request method: ' + reqMethod, function(done) {
                //  make sure the order of the tests match the array order
                should(requestHelper.isGet(req)).be.exactly(idx === 0);
                should(requestHelper.isPost(req)).be.exactly(idx === 1);
                should(requestHelper.isPut(req)).be.exactly(idx === 2);
                should(requestHelper.isPatch(req)).be.exactly(idx === 3);
                should(requestHelper.isDelete(req)).be.exactly(idx === 4);
                done();
            });
        });
    });

    describe('validate the http protocol', function() {
        var req = {};
        it('Test secure protocol method', function(done) {
            req.protocol = 'https';
            should(requestHelper.isSecure(req)).be.exactly(true);
            done();
        });
        it('Test non-secure protocol method', function(done) {
            req.protocol = 'http';
            should(requestHelper.isSecure(req)).be.exactly(false);
            done();
        });
    });

    describe('validate the request url', function() {
        var req = {};
        req.url = '/someurl.com';
        it('Test request url method', function(done) {
            var request = requestHelper.getRequestUrl(req);
            should(request).be.exactly(config.javaHost + req.url);
            done();
        });
    });

    describe('validate agent options', function() {
        var req = {};

        it('validate getting agent options on non-secure protocol', function(done) {
            req.protocol = 'http';
            var agentOptions = requestHelper.getAgentOptions(req);
            agentOptions.rejectUnauthorized.should.equal(false);
            done();
        });

        it('validate getting agent options on secure protocol', function(done) {
            req.protocol = 'https';

            var fs = require('fs');
            var stub = sinon.stub(fs, 'readFileSync', function() {return 'file';});

            var agentOptions = requestHelper.getAgentOptions(req);

            agentOptions.strictSSL.should.equal(true);
            agentOptions.rejectUnauthorized.should.equal(true);
            assert(stub.calledTwice);

            stub.restore();
            done();
        });


    });

    describe('validate copy headers to response method', function() {
        var res = {header0: 'header0'};
        var headers = {header1: 'header1', header2: 'header2'};

        it('validate copy', function(done) {
            requestHelper.copyHeadersToResponse(res, headers);
            res.should.have.property('header0');
            res.should.have.property('header1');
            res.should.have.property('header2');
            done();
        });
    });

    describe('validate setting options', function() {
        var req = {};
        req.url = '/someurl.com';
        req.headers = {tid: 'tid'};
        req.protocol = 'http';
        req.rawBody = 'test';

        it('Test setOptions with GET method', function(done) {
            req.method = 'GET';
            var request = requestHelper.setOptions(req);
            should(request.url).be.exactly(config.javaHost + req.url);
            should.not.exist(request.body);
            should(request.method).be.exactly(req.method);
            done();
        });

        it('Test setOptions with POST method', function(done) {
            req.method = 'POST';
            var request = requestHelper.setOptions(req);
            should(request.url).be.exactly(config.javaHost + req.url);
            should(request.body).be.exactly(req.rawBody);
            should(request.method).be.exactly(req.method);
            done();
        });

        it('Test setOptions with PUT method', function(done) {
            req.method = 'PUT';
            var request = requestHelper.setOptions(req);
            should(request.url).be.exactly(config.javaHost + req.url);
            should(request.body).be.exactly(req.rawBody);
            should(request.method).be.exactly(req.method);
            done();
        });

        it('Test setOptions with PATCH method', function(done) {
            req.method = 'PATCH';
            var request = requestHelper.setOptions(req);
            should(request.url).be.exactly(config.javaHost + req.url);
            should(request.body).be.exactly(req.rawBody);
            should(request.method).be.exactly(req.method);
            done();
        });

        it('Test setOptions with DELETE method', function(done) {
            req.method = 'DELETE';
            var request = requestHelper.setOptions(req);
            should(request.url).be.exactly(config.javaHost + req.url);
            should(request.body).be.exactly(req.rawBody);
            should(request.method).be.exactly(req.method);
            done();
        });

    });

    describe('validate setting the TID on the header with other headers', function() {
        var req = {};
        req.protocol = 'https';
        req.method = 'POST';
        req.headers = {someOtherid: 'some-other-header'};

        it('Test adding the TID header field', function(done) {
            var newReq = requestHelper.setTidHeader(req);
            req.headers.should.have.property('tid');
            req.headers.should.have.property('someOtherid');
            assert.deepEqual(newReq, req, 'request object != input request after adding TID');
            done();
        });

    });

    describe('validate setting the TID on the header', function() {
        var req = {};
        req.protocol = 'https';
        req.method = 'POST';

        it('Test adding the TID header field', function(done) {
            var newReq = requestHelper.setTidHeader(req);
            req.headers.should.have.property('tid');
            assert.deepEqual(newReq, req, 'request object != input request after adding TID');
            done();
        });

    });

    describe('validate setting the TID on the header with an initialized req object', function() {
        var tid = 'tid';
        var method = 'post';

        var req = {
            headers: {
                tid: tid
            }
        };
        req.method = method;

        it('Test the TID header field does change', function(done) {
            var newReq = requestHelper.setTidHeader(req);

            //  new tid should always get generated
            assert.notEqual(req.headers.tid, tid);
            assert.notEqual(newReq.headers.tid, tid);
            assert.equal(newReq.method, method);
            done();
        });

    });

    describe('validate executeRequest method with TID', function() {
        var tid = 'tid';

        var req = {
            headers: {
                tid: tid
            }
        };
        var requestStub = sinon.stub();
        requestHelper.setRequestObject(requestStub);
        it('Test executeRequest with immediateResolve ', function(done) {
            var promise = requestHelper.executeRequest(req, {}, true);
            promise.then(
                function(response) {
                    assert.equal(req.headers.tid, tid);
                    assert.equal(response, null);
                }
            );
            done();
        });
        it('Test executeRequest success', function(done) {
            requestStub.yields(null, {statusCode: 200}, {}); // override the params (error, response, body)
            var promise = requestHelper.executeRequest(req, {}, false);
            promise.then(
                function(response) {
                    assert.equal(req.headers.tid, tid);
                    assert.deepEqual(response, {statusCode: 200});
                }
            );
            done();
        });
        it('Test executeRequest error', function(done) {
            var errorResponse = new Error('error');
            requestStub.yields(errorResponse, {}, {}); // override the params (error, response, body)
            var promise = requestHelper.executeRequest(req, {}, false);
            promise.then(
                function(response) {
                    assert.equal(req.headers.tid, tid);
                },
                function(error) {
                    assert.deepEqual(error, errorResponse);
                }
            );
            done();
        });
        it('Test executeRequest status not OK', function(done) {
            requestStub.yields(null, {statusCode: 400}, {}); // override the params (error, response, body)
            var promise = requestHelper.executeRequest(req, {}, false);
            promise.then(
                function(response) {
                    assert.equal(req.headers.tid, tid);
                },
                function(error) {
                    assert.deepEqual(error, {statusCode: 400});
                }
            );
            done();
        });
    });

    describe('validate executeRequest method with out TID', function() {

        var requestStub = sinon.stub();
        requestHelper.setRequestObject(requestStub);

        it('Test executeRequest', function(done) {
            var req = {
                headers: {}
            };

            requestStub.yields(null, {statusCode: 200}, {}); // override the params (error, response, body)
            var promise = requestHelper.executeRequest(req, {}, false);
            promise.then(
                function(response) {
                    assert.ok(req.headers.tid, 'Tid not defined');
                    assert.deepEqual(response, {statusCode: 200});
                }
            );
            done();
        });

        it('Test executeRequest with immediateResolve ', function(done) {
            var req = {};

            var promise = requestHelper.executeRequest(req, {}, true);
            promise.then(
                function(response) {
                    assert.ok(req.headers.tid, 'Tid not defined');
                    assert.equal(response, null);
                }
            );
            done();
        });
    });

    describe('validate logUnexpected Error function', function() {
        var error = {
            message: 'error message',
            stack: 'stack trace'
        };

        var testCases = [
            {name: 'log standard error exception', func: 'function name', error: error, includeStackTrace: true},
            {name: 'log standard error exception -- null input', func: 'function name', error: null, includeStackTrace: null},
            {name: 'log standard error exception -- no error obj', func: 'function name', error: '', includeStackTrace: false},
            {name: 'missing error block', function: 'function name', error: null, includeStackTrace: true}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                requestHelper.logUnexpectedError(testCase.func, testCase.error, testCase.includeStackTrace);
                assert(stubLog.called, 'Error logging unexpected error message.');
                done();
            });
        });

    });

    describe('validate addQueryParameter function', function() {

        var req = {
            url: '',
            params: {}
        };
        var testCases = [
            {name: 'test valid use case with no query parameters', url: 'apps/123/tables/456', parameterName: 'clist', parameterValue: '1.2.3', urlExpectation: 'apps/123/tables/456?clist=1.2.3'},
            {name: 'test missing parameter name', url: 'apps/123/tables/456', parameterName: '', parameterValue: '1.2.3', urlExpectation: 'apps/123/tables/456'},
            {name: 'test valid use case with no query parameter value', url: 'apps/123/tables/456?param1=one&param2=two', parameterName: 'clist', parameterValue: '', urlExpectation: 'apps/123/tables/456?param1=one&param2=two&clist='},
            {name: 'test valid use case with 1 query parameter', url: 'apps/123/tables/456?param1=one', parameterName: 'clist', parameterValue: '1.2.3', urlExpectation: 'apps/123/tables/456?param1=one&clist=1.2.3'},
            {name: 'test valid use case with multiple query parameters', url: 'apps/123/tables/456?param1=one&param2=two', parameterName: 'clist', parameterValue: '1.2.3', urlExpectation: 'apps/123/tables/456?param1=one&param2=two&clist=1.2.3'}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                req.url = testCase.url;
                requestHelper.addQueryParameter(req, testCase.parameterName, testCase.parameterValue);

                //  test that the url has the parameters appended as a query parameter
                assert.equal(req.url, testCase.urlExpectation);

                if (testCase.parameterName) {
                    //  test that the parameter is in the params list
                    assert.equal(req.params[testCase.parameterName], testCase.parameterValue);
                } else {
                    //  if no parameter name, then that parameter is not defined
                    assert.equal(req.params[testCase.parameterName], undefined);
                }
                done();
            });
        });

    });

});
