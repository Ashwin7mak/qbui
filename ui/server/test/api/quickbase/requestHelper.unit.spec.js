'use strict';

let config = {
    javaHost: 'http://javaHost',
    SSL_KEY : {
        private    : 'privateKey',
        cert       : 'cert',
        requireCert: true
    }
};

let requestHelper = require('./../../../src/api/quickbase/requestHelper')(config);
let should = require('should');
let assert = require('assert');
let sinon = require('sinon');
let log = require('./../../../src/logger').getLogger();
let consts = require('./../../../../common/src/constants');

/**
 * Unit tests for User field formatting
 */
describe('Validate RequestHelper unit tests', function() {

    let stubLog;

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

        let reqMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
        reqMethods.forEach(function(reqMethod, idx) {
            let req = {};
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
        let req = {};
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
        let req = {};
        req.url = '/someurl.com';
        it('Test request url method', function(done) {
            let request = requestHelper.getRequestUrl(req);
            should(request).be.exactly(config.javaHost + req.url);
            done();
        });
    });

    describe('validate agent options', function() {
        let req = {};

        it('validate getting agent options on non-secure protocol', function(done) {
            req.protocol = 'http';
            let agentOptions = requestHelper.getAgentOptions(req);
            agentOptions.rejectUnauthorized.should.equal(false);
            done();
        });

        it('validate getting agent options on secure protocol', function(done) {
            req.protocol = 'https';

            let fs = require('fs');
            let stub = sinon.stub(fs, 'readFileSync', function() {return 'file';});

            let agentOptions = requestHelper.getAgentOptions(req);

            agentOptions.strictSSL.should.equal(true);
            agentOptions.rejectUnauthorized.should.equal(true);
            assert(stub.calledTwice);

            stub.restore();
            done();
        });


    });

    describe('validate copy headers to response method', function() {
        let res = {header0: 'header0'};
        let headers = {header1: 'header1', header2: 'header2'};

        it('validate copy', function(done) {
            requestHelper.copyHeadersToResponse(res, headers);
            res.should.have.property('header0');
            res.should.have.property('header1');
            res.should.have.property('header2');
            done();
        });
    });

    describe('validate setting options', function() {
        let req = {};
        req.url = '/someurl.com';
        req.headers = {tid: 'tid'};
        req.protocol = 'http';
        req.rawBody = 'test';

        it('Test setOptions with GET method', function(done) {
            req.method = 'GET';
            let request = requestHelper.setOptions(req);
            should(request.url).be.exactly(config.javaHost + req.url);
            should.not.exist(request.body);
            should(request.method).be.exactly(req.method);
            done();
        });

        it('Test setOptions with POST method', function(done) {
            req.method = 'POST';
            let request = requestHelper.setOptions(req);
            should(request.url).be.exactly(config.javaHost + req.url);
            should(request.body).be.exactly(req.rawBody);
            should(request.method).be.exactly(req.method);
            done();
        });

        it('Test setOptions with PUT method', function(done) {
            req.method = 'PUT';
            let request = requestHelper.setOptions(req);
            should(request.url).be.exactly(config.javaHost + req.url);
            should(request.body).be.exactly(req.rawBody);
            should(request.method).be.exactly(req.method);
            done();
        });

        it('Test setOptions with PATCH method', function(done) {
            req.method = 'PATCH';
            let request = requestHelper.setOptions(req);
            should(request.url).be.exactly(config.javaHost + req.url);
            should(request.body).be.exactly(req.rawBody);
            should(request.method).be.exactly(req.method);
            done();
        });

        it('Test setOptions with DELETE method', function(done) {
            req.method = 'DELETE';
            let request = requestHelper.setOptions(req);
            should(request.url).be.exactly(config.javaHost + req.url);
            should(request.body).be.exactly(req.rawBody);
            should(request.method).be.exactly(req.method);
            done();
        });

    });

    describe('validate setting the TID on the header with other headers', function() {
        let req = {};
        req.protocol = 'https';
        req.method = 'POST';
        req.headers = {someOtherid: 'some-other-header'};

        it('Test adding the TID header field', function(done) {
            let newReq = requestHelper.setTidHeader(req);
            req.headers.should.have.property('tid');
            req.headers.should.have.property('someOtherid');
            assert.deepEqual(newReq, req, 'request object != input request after adding TID');
            done();
        });

    });

    describe('validate setting the TID on the header', function() {
        let req = {};
        req.protocol = 'https';
        req.method = 'POST';

        it('Test adding the TID header field', function(done) {
            let newReq = requestHelper.setTidHeader(req);
            req.headers.should.have.property('tid');
            assert.deepEqual(newReq, req, 'request object != input request after adding TID');
            done();
        });

    });

    describe('validate setting the TID on the header with an initialized req object', function() {
        let tid = 'tid';
        let method = 'post';

        let req = {
            headers: {
                tid: tid
            }
        };
        req.method = method;

        it('Test the TID header field does change', function(done) {
            let newReq = requestHelper.setTidHeader(req);

            //  new tid should always get generated
            assert.notEqual(req.headers.tid, tid);
            assert.notEqual(newReq.headers.tid, tid);
            assert.equal(newReq.method, method);
            done();
        });

    });

    describe('validate executeRequest method with TID', function() {
        let tid = 'tid';

        let req = {
            headers: {
                tid: tid
            }
        };
        let requestStub = sinon.stub();
        requestHelper.setRequestObject(requestStub);
        it('Test executeRequest with immediateResolve ', function(done) {
            let promise = requestHelper.executeRequest(req, {}, true);
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
            let promise = requestHelper.executeRequest(req, {}, false);
            promise.then(
                function(response) {
                    assert.equal(req.headers.tid, tid);
                    assert.deepEqual(response, {statusCode: 200});
                }
            );
            done();
        });
        it('Test executeRequest error', function(done) {
            let errorResponse = new Error('error');
            requestStub.yields(errorResponse, {}, {}); // override the params (error, response, body)
            let promise = requestHelper.executeRequest(req, {}, false);
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
            let promise = requestHelper.executeRequest(req, {}, false);
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

        let requestStub = sinon.stub();
        requestHelper.setRequestObject(requestStub);

        it('Test executeRequest', function(done) {
            let req = {
                headers: {}
            };

            requestStub.yields(null, {statusCode: 200}, {}); // override the params (error, response, body)
            let promise = requestHelper.executeRequest(req, {}, false);
            promise.then(
                function(response) {
                    assert.ok(req.headers.tid, 'Tid not defined');
                    assert.deepEqual(response, {statusCode: 200});
                }
            );
            done();
        });

        it('Test executeRequest with immediateResolve ', function(done) {
            let req = {};

            let promise = requestHelper.executeRequest(req, {}, true);
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
        let error = {
            message: 'error message',
            stack: 'stack trace'
        };

        let testCases = [
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
        let req = {
            url: '',
            params: {}
        };
        let testCases = [
            {name: 'test valid use case with no query parameters', url: 'apps/123/tables/456', parameterName: 'clist', parameterValue: '1.2.3', urlExpectation: 'apps/123/tables/456?clist=1.2.3'},
            {name: 'test missing parameter name', url: 'apps/123/tables/456', parameterName: '', parameterValue: '1.2.3', urlExpectation: 'apps/123/tables/456'},
            {name: 'test valid use case with no query parameter value', url: 'apps/123/tables/456?param1=one&param2=two', parameterName: 'clist', parameterValue: '', urlExpectation: 'apps/123/tables/456?param1=one&param2=two&clist='},
            {name: 'test valid use case with 1 query parameter', url: 'apps/123/tables/456?param1=one', parameterName: 'clist', parameterValue: '1.2.3', urlExpectation: 'apps/123/tables/456?param1=one&clist=1.2.3'},
            {name: 'test valid use case with multiple query parameters', url: 'apps/123/tables/456?param1=one&param2=two', parameterName: 'clist', parameterValue: '1.2.3', urlExpectation: 'apps/123/tables/456?param1=one&param2=two&clist=1.2.3'},
            {name: 'test valid use case with multiple query parameters and duplicate cList', url: 'apps/123/tables/456?param1=one&clist=1.2.4', parameterName: 'clist', parameterValue: '1.2.3', urlExpectation: 'apps/123/tables/456?param1=one&clist=1.2.3'}
        ];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                req.url = testCase.url;
                requestHelper.addQueryParameter(req, testCase.parameterName, testCase.parameterValue);

                //  test that the url has the parameters appended as a query parameter
                assert.equal(req.url, testCase.urlExpectation);

                if (testCase.parameterName) {
                    //  test that the parameter is in the params list
                    assert.equal(requestHelper.getQueryParameterValue(req, testCase.parameterName), testCase.parameterValue);
                } else {
                    //  if no parameter name, then that parameter is not defined
                    assert.equal(requestHelper.getQueryParameterValue(req, testCase.parameterName), undefined);
                }
                done();
            });
        });
    });

    describe('validate addQueryParameter function', function() {
        let req = {
            url: '',
            params: {}
        };
        let testCases = [
            {name: 'test valid use case with no query parameters', url: 'apps/123/tables/456', parameterName: '', expectation: false},
            {name: 'test parameter name in url', url: 'apps/123/tables/456?clist=9', parameterName: 'clist', expectation: true},
            {name: 'test parameter name not found in url', url: 'apps/123/tables/456?param1=one&param2=two', parameterName: 'clist', expectation: false}];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                req.url = testCase.url;
                let result = requestHelper.hasQueryParameter(req, testCase.parameterName);

                //  test that the url has the parameters appended as a query parameter
                assert.equal(result, testCase.expectation);

                done();
            });
        });
    });

    describe('validate getQueryParameter function', function() {
        let req = {
            url: '',
            params: {}
        };
        let testCases = [
            {name: 'test valid use case with no query parameters', url: 'apps/123/tables/456', parameterName: '', expectation: null},
            {name: 'test parameter name in url', url: 'apps/123/tables/456?clist=9', parameterName: 'clist', expectation: '9'},
            {name: 'test parameter name in url that is empty', url: 'apps/123/tables/456?clist=9&param1=&param2=blah', parameterName: 'param1', expectation: ''},
            {name: 'test parameter name not found in url', url: 'apps/123/tables/456?param1=one&param2=two', parameterName: 'clist', expectation: null}];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                req.url = testCase.url;
                let result = requestHelper.getQueryParameterValue(req, testCase.parameterName);
                assert.equal(result, testCase.expectation);

                done();
            });
        });
    });

    describe('validate removeRequestParameter function', function() {
        let req = {
            url: '',
            params: {}
        };
        let testCases = [
            {name: 'test valid use case with no query parameters', url: 'apps/123/tables/456', parameterName: '', expectation: 'apps/123/tables/456'},
            {name: 'test parameter name in url - test 0', url: 'apps/123/tables/456?clist=9', parameterName: 'clist', expectation: 'apps/123/tables/456'},
            {name: 'test parameter name in url - test 1', url: 'apps/123/tables/456?param1=one&param2=two', parameterName: 'param2', expectation: 'apps/123/tables/456?param1=one'},
            {name: 'test parameter name in url - test 1a', url: 'apps/123/tables/456?param1=one&param2=two&&', parameterName: 'param2', expectation: 'apps/123/tables/456?param1=one&&'},
            {name: 'test parameter name in url - test 2', url: 'apps/123/tables/456?param1=one&param2=two', parameterName: 'param1', expectation: 'apps/123/tables/456?param2=two'},
            {name: 'test parameter name in url - test 2a', url: 'apps/123/tables/456?param1=one&param2=two&', parameterName: 'param1', expectation: 'apps/123/tables/456?param2=two&'},
            {name: 'test parameter name not found in url', url: 'apps/123/tables/456?param1=one&param2=two', parameterName: 'clist', expectation: 'apps/123/tables/456?param1=one&param2=two'}];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                req.url = testCase.url;
                requestHelper.removeRequestParameter(req, testCase.parameterName);
                assert.equal(req.url, testCase.expectation);

                done();
            });
        });
    });

    describe('validate isRawFormat function', function() {
        let req = {
            url: '',
            params: {}
        };

        beforeEach(function() {
            req.url = 'app/1/tables/2';
        });

        let testCases = [
            {name: 'test format = raw is true', format: consts.FORMAT.RAW, expectation: true},
            {name: 'test format = raw is false empty', format: '', expectation: false},
            {name: 'test format = raw is false', format: consts.FORMAT.DISPLAY, expectation: false}];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                if (testCase.format) {
                    req.url += '?' + consts.REQUEST_PARAMETER.FORMAT + '=' + testCase.format;
                }
                assert.equal(requestHelper.isRawFormat(req), testCase.expectation);
                done();
            });
        });
    });

    describe('validate isDisplayFormat function', function() {
        let req = {
            url: '',
            params: {}
        };

        beforeEach(function() {
            req.url = 'app/1/tables/2';
        });

        let testCases = [
            {name: 'test format = display is true', format: consts.FORMAT.DISPLAY, expectation: true},
            {name: 'test format = display is false empty', format: '', expectation: false},
            {name: 'test format = display is false', format: consts.FORMAT.RAW, expectation: false}];

        testCases.forEach(function(testCase) {
            it('Test case: ' + testCase.name, function(done) {
                if (testCase.format) {
                    req.url += '?' + consts.REQUEST_PARAMETER.FORMAT + '=' + testCase.format;
                }
                assert.equal(requestHelper.isDisplayFormat(req), testCase.expectation);
                done();
            });
        });
    });
});
