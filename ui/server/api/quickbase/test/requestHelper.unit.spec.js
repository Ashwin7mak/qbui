'use strict';

var config = {
    javaHost: 'http://javaHost',
    SSL_KEY: {
        private: 'privateKey',
        cert: 'cert',
        requireCert: true
    }
};

var requestHelper = require('./../requestHelper')(config);
var should = require('should');
var assert = require('assert');
var sinon = require('sinon');

/**
 * Unit tests for User field formatting
 */
describe('Validate RequestHelper unit tests', function () {

    /**
     * Unit test the helper methods
     */
    describe('validate the http request methods',function() {

        var reqMethods = ['GET','POST','PUT','PATCH','DELETE'];
        reqMethods.forEach(function(reqMethod, idx) {
            var req = {};
            req.method = reqMethod;
            it('Test request method: ' + reqMethod, function(done) {
                //  make sure the order of the tests match the array order
                should( requestHelper.isGet(req)).be.exactly( idx===0 );
                should( requestHelper.isPost(req)).be.exactly( idx===1 );
                should( requestHelper.isPut(req)).be.exactly( idx===2 );
                should( requestHelper.isPatch(req)).be.exactly( idx===3 );
                should( requestHelper.isDelete(req)).be.exactly( idx===4 );
                done();
            });
        });
    });

    describe('validate the http protocol',function() {
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

    describe('validate the request url',function() {
        var req = {};
        req.url = '/someurl.com';
        it('Test request url method', function(done) {
            var request = requestHelper.getRequestUrl(req);
            should(request).be.exactly(config.javaHost + req.url);
            done();
        });
    });

    describe('validate agent options',function() {
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
            var stub = sinon.stub(fs, 'readFileSync', function() { return 'file'; });

            var agentOptions = requestHelper.getAgentOptions(req);

            agentOptions.strictSSL.should.equal(true);
            agentOptions.rejectUnauthorized.should.equal(true);
            assert(stub.calledTwice);

            stub.restore();
            done();
        });


    });

    describe('validate copy headers to response method',function() {
        var res = {header0:'header0'};
        var headers = {header1:'header1',header2:'header2'};

        it('validate copy', function(done) {
            requestHelper.copyHeadersToResponse(res, headers);
            res.should.have.property('header0');
            res.should.have.property('header1');
            res.should.have.property('header2');
            done();
        });
    });

    describe('validate setting options',function() {
        var req = {};
        req.url = '/someurl.com';
        req.headers = {tid:'tid'};
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

    });

    describe('validate setting the TID on the header with other headers',function() {
        var req = {};
        req.protocol = 'https';
        req.method = 'POST';
        req.headers = {someOtherid:'some-other-header'};

        it('Test adding the TID header field', function(done) {
            var newReq = requestHelper.setTidHeader(req);
            req.headers.should.have.property('tid');
            req.headers.should.have.property('someOtherid');
            assert.deepEqual(newReq, req, 'request object != input request after adding TID');
            done();
        });

    });

    describe('validate setting the TID on the header',function() {
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

});
