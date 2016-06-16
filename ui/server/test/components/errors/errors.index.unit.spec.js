var sinon = require('sinon');

var error = require('../../../src/components/index');
var consts = require('../../../../common/src/constants');
var assert = require('assert');
var log = require('../../../src/logger').getLogger();

var mockReq = {};
var mockRes = {
    httpStatus: null,
    resultJson: null,
    status: function(status) {
        this.httpStatus = status;
    },
    json: function(result, status) {},
    render: function(path, callback) {}
};
var stubLog, stubMockJson, spyRender;

describe('Validate https response error functions', function() {

    beforeEach(function() {
        stubLog = sinon.stub(log, 'error').returns(true);
        stubMockJson = sinon.stub(mockRes, 'json').returns(true);
        spyRender = sinon.spy(mockRes, 'render');
    });
    afterEach(function() {
        stubLog.restore();
        stubMockJson.restore();
        spyRender.restore();
    });

    it('validate http response 403 json request', function() {
        mockReq.headers = {
            accept: consts.APPLICATION_JSON
        };

        error[403](mockReq, mockRes);

        // expect the http status to be 403, the json to be added to the response
        // and the logger to have been called
        assert.equal(mockRes.httpStatus, 403);
        assert(stubLog.calledOnce);
        assert(stubMockJson.calledOnce);
        assert(spyRender.callCount === 0, true);
    });

    it('validate http response 403 xml request', function() {
        mockReq.headers = {
            accept: consts.APPLICATION_XML
        };

        error[403](mockReq, mockRes);

        // expect the http status to be 403, the json to be added to the response
        // and the logger to have been called
        assert.equal(mockRes.httpStatus, 403);
        assert(stubLog.calledOnce);
        assert(stubMockJson.callCount === 0, true);
        assert(spyRender.calledOnce);
    });

    it('validate http response 404 json request', function() {
        mockReq.headers = {
            accept: consts.APPLICATION_JSON
        };

        error[404](mockReq, mockRes);

        // expect the http status to be 404, the json to be added to the response
        // and the logger to have been called
        assert.equal(mockRes.httpStatus, 404);
        assert(stubLog.calledOnce);
        assert(stubMockJson.calledOnce);
        assert(spyRender.callCount === 0, true);
    });

    it('validate http response 500 json request', function() {
        mockReq.headers = {
            accept: consts.APPLICATION_JSON
        };

        error[500](mockReq, mockRes);

        // expect the http status to be 400, the json to be added to the response
        // and the logger to have been called
        assert.equal(mockRes.httpStatus, 500);
        assert(stubLog.calledOnce);
        assert(stubMockJson.calledOnce);
        assert(spyRender.callCount === 0, true);
    });

});
