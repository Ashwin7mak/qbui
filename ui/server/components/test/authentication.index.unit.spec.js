var sinon = require('sinon');

var authentication = require('../authentication/index');
var consts = require('../../../common/src/constants');
var assert = require('assert');
var log = require('./../../logger').getLogger();

var mockReq = {};
var mockRes = {
    httpStatus: null,
    resultJson: null,
    status: function(status) {
        this.httpStatus = status;
    },
    json: function(result, status) {},
    render: function(path, callback) {},
    clearCookie: function(name, options) {},
    cookie: function(name, value, options) {}
};
var stubLog, stubMockJson, spyRender;

describe('Validate https response authentication functions', function() {

    beforeEach(function() {
        stubLog = sinon.stub(log, 'info').returns(true);
        stubMockJson = sinon.stub(mockRes, 'json').returns(true);
        spyRender = sinon.spy(mockRes, 'render');
    });
    afterEach(function() {
        stubLog.restore();
        stubMockJson.restore();
        spyRender.restore();
    });

    it('validate http response 200 json request for signout', function() {
        mockReq.headers = {
            accept: consts.APPLICATION_JSON
        };

        authentication.signout(mockReq, mockRes);

        // expect the http status to be 200, the json to be added to the response
        // and the logger to have been called
        assert.equal(mockRes.httpStatus, 200);
        assert(stubLog.calledOnce);
        assert(stubMockJson.calledOnce);
        assert(spyRender.callCount === 0, true);
    });

    it('validate http response 200 xml request for signout', function() {
        mockReq.headers = {
            accept: consts.APPLICATION_XML
        };

        authentication.signout(mockReq, mockRes);

        // expect the http status to be 200, the json to be added to the response
        // and the logger to have been called
        assert.equal(mockRes.httpStatus, 200);
        assert(stubLog.calledOnce);
        assert(stubMockJson.callCount === 0, true);
        assert(spyRender.calledOnce);
    });

    it('validate http response 200 json request for signin', function() {
        mockReq.headers = {
            accept: consts.APPLICATION_JSON
        };

        authentication.signin(mockReq, mockRes);

        // expect the http status to be 200, the json to be added to the response
        // and the logger to have been called
        assert.equal(mockRes.httpStatus, 200);
        assert(stubLog.calledOnce);
        assert(stubMockJson.calledOnce);
        assert(spyRender.callCount === 0, true);
    });

    it('validate http response 200 xml request for signin', function() {
        mockReq.headers = {
            accept: consts.APPLICATION_XML
        };

        authentication.signin(mockReq, mockRes);

        // expect the http status to be 200, the json to be added to the response
        // and the logger to have been called
        assert.equal(mockRes.httpStatus, 200);
        assert(stubLog.calledOnce);
        assert(stubMockJson.callCount === 0, true);
        assert(spyRender.calledOnce);
    });

});
