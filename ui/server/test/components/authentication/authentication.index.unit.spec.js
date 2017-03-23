var sinon = require('sinon');

var authentication = require('../../../src/components/authentication/index');
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
    render: function(path, callback) {},
    clearCookie: function(name, options) {},
    cookie: function(name, value, options) {},
    redirect : function(path) {}
};
var stubLog, stubMockJson, spyRender, spyCookie, spyClearCookie, spyRedirect;

describe('Validate https response authentication functions', function() {

    beforeEach(function() {
        stubLog = sinon.stub(log, 'info').returns(true);
        stubMockJson = sinon.stub(mockRes, 'json').returns(true);
        spyRender = sinon.spy(mockRes, 'render');
        spyCookie = sinon.spy(mockRes, 'cookie');
        spyClearCookie = sinon.spy(mockRes, 'clearCookie');
        spyRedirect = sinon.spy(mockRes, 'redirect');
    });
    afterEach(function() {
        stubLog.restore();
        stubMockJson.restore();
        spyRender.restore();
        spyCookie.restore();
        spyClearCookie.restore();
        spyRedirect.restore();
    });

    it('validate http response 200 json request for signout', function() {
        mockReq.headers = {
            accept: consts.APPLICATION_JSON,
            host: 'localhost'
        };

        authentication.signout(mockReq, mockRes);

        // expect the http status to be 200, the json to be added to the response
        // and the logger to have been called
        assert.equal(mockRes.httpStatus, 200);
        assert(stubLog.calledOnce);
        assert(stubMockJson.calledOnce);
        assert(spyCookie.callCount === 3, true);
        assert(spyClearCookie.callCount === 3, true);
        assert(spyRender.callCount === 0, true);
    });

    it('validate http response 200 xml request for signout', function() {
        mockReq.headers = {
            accept: consts.APPLICATION_XML,
            host: 'localhost'
        };

        authentication.signout(mockReq, mockRes);

        // expect the http status to be 200, the json to be added to the response
        // and the logger to have been called
        assert.equal(mockRes.httpStatus, 200);
        assert(stubLog.calledOnce);
        assert(stubMockJson.callCount === 0, true);
        assert(spyCookie.callCount === 3, true);
        assert(spyClearCookie.callCount === 3, true);
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

    it('validate http response 302 redirect when federating the ticket', function() {
        var mockFederationReq = {
            query: {
                "url" : "team.ns.quickbase.com/qbase/governance/12/users"
            },
            headers : {
                host: "team.quickbase.com"
            },
            cookies : {
                "team_TICKET": "someticketvalue"
            }
        };

        authentication.federation(mockFederationReq, mockRes);
        assert(spyRedirect.calledOnce);
        assert(spyRedirect.calledWith(mockFederationReq.query.url));
    });

    it('validate http response 401 when realm ticket is null', function() {
        var mockFederationReq = {
            query: {
                "url" : "team.ns.quickbase.com/qbase/governance/12/users"
            },
            headers : {
                host: "team.quickbase.com"
            },
            cookies : {
                "team_TICKET": null
            }
        };

        authentication.federation(mockFederationReq, mockRes);
        assert.equal(mockRes.httpStatus, 401);
        assert(spyRedirect.callCount === 0);
        assert(spyRender.calledOnce);
    });
});
