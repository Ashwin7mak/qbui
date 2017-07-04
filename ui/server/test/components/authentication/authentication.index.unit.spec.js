var sinon = require('sinon');

var config = require('../../../src/config/environment');
var authentication = require('../../../src/components/authentication/index')(config);
var consts = require('../../../../common/src/constants');
var assert = require('assert');
var log = require('../../../src/logger').getLogger();
var routeHelper = require('../../../src/routes/routeHelper');

var mockReq = {};
var mockRes = {
    httpStatus: null,
    resultJson: null,
    cookies: {},
    status: function(status) {
        this.httpStatus = status;
    },
    json: function(result, status) {},
    render: function(path, callback) {},
    clearCookie: function(name, options) {},
    cookie: function(name, value, options) {
        this.cookies[name] = {value: value, options: options};
    },
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

    it('validate federated users are redirected to   legacy', function() {

        mockReq.headers = {
            host: 'localhost'
        };

        mockReq.cookies = {
            ISFEDERATED : true
        };
        authentication.signout(mockReq, mockRes);
        assert(spyRedirect.calledOnce, 'should redirect');
        assert(spyRedirect.getCall(0).args[0].includes(routeHelper.getSignoutLegacyStackRoute()), true,
            'should redirect to legacy stack signout');
        assert(spyClearCookie.callCount === 4, true);
        assert(spyCookie.callCount === 4, true);
        assert(stubLog.calledOnce);
        assert.equal(mockRes.cookies.ISFEDERATED.value, "",
            'the team_TICKET cookie value should be set as the TICKET cookie in the response');
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

    describe('federation endpoint', function() {
        // Copy this mock request and edit the copy with what you need for your test
        const validMockFederationRequest = {
            query: {
                "url" : "https://team.mercury.quickbase.com/qbase/governance/12/users"
            },
            headers : {
                host: "team.mercury.quickbase.com"
            },
            cookies : {
                "team_TICKET": `8_bmnicwvzd_aaaaaa_aaa_a_aaaaaaa`
            }
        };

        it('validate http response 302 and TICKET cookie redirect for federation', function() {
            const con = Object.assign({}, config, {legacyBase: '.quickbase.com'});
            const auth = require('../../../src/components/authentication/index')(con);
            auth.federation(Object.assign({}, validMockFederationRequest), mockRes);
            assert(spyRedirect.calledOnce, 'redirect should be called once');
            assert.equal(validMockFederationRequest.query.url, spyRedirect.getCall(0).args[0],
                'redirect should be set based on url specified in query parameters of the request');
            assert.equal(mockRes.cookies.TICKET.value, validMockFederationRequest.cookies.team_TICKET,
                'the team_TICKET cookie value should be set as the TICKET cookie in the response');
            assert.equal(mockRes.cookies.TICKET.options.expires, 0,
                'the expiration on the new stack cookie should be zero (session cookie)');
            assert.equal(mockRes.cookies.TICKET.options.domain, validMockFederationRequest.headers.host,
                'the domain of the new stack cookie should use the hostname defined in the request');
            assert.equal(mockRes.cookies.team_TICKET.value, "",
                'the realm specific cookie should be empty after federation');
            assert.equal(mockRes.cookies.team_TICKET.options.expires.getTime(), 0,
                'the realm specific cookie should be set to expire after federation');
            assert.equal(mockRes.cookies.team_TICKET.options.domain, con.legacyBase.substring(1),
                'the realm specific cookie should have the domain specified in config.legacyBase');
        });

        it('validate http response 302 and TICKET cookie redirect with a non-production hostname for federation', function() {
            const con = Object.assign({}, config, {legacyBase: '.currentstack-int.quickbaserocks.com'});
            const auth = require('../../../src/components/authentication/index')(con);
            const mockFederationReq = Object.assign({}, validMockFederationRequest,
                {
                    query: {
                        "url" : "https://team.mercury.quickbaserocks.com/qbase/governance/12/users"
                    },
                    headers : {
                        host: "team.mercury.quickbaserocks.com"
                    }
                });

            auth.federation(mockFederationReq, mockRes);
            assert(spyRedirect.calledOnce, 'redirect should be called once');
            assert.equal(mockFederationReq.query.url, spyRedirect.getCall(0).args[0],
                'redirect should be set based on url specified in query parameters of the request');
            assert.equal(mockRes.cookies.TICKET.value, mockFederationReq.cookies.team_TICKET,
                'the team_TICKET cookie value should be set as the TICKET cookie in the response');
            assert.equal(mockRes.cookies.TICKET.options.expires, 0,
                'the expiration on the new stack cookie should be zero (session cookie)');
            assert.equal(mockRes.cookies.TICKET.options.domain, mockFederationReq.headers.host,
                'the domain of the new stack cookie should use the hostname defined in the request');
            assert.equal(mockRes.cookies.team_TICKET.value, "",
                'the realm specific cookie should be empty after federation');
            assert.equal(mockRes.cookies.team_TICKET.options.expires.getTime(), 0,
                'the realm specific cookie should be set to expire after federation');
            assert.equal(mockRes.cookies.team_TICKET.options.domain, con.legacyBase.substring(1),
                'the realm specific cookie should have the domain specified in config.legacyBase');
        });

        it('validate http response 302 redirect to /db/main?a=myqb when no redirect url is provided for federation', function() {
            const mockFederationReq = Object.assign({}, validMockFederationRequest, {query: {}});
            authentication.federation(mockFederationReq, mockRes);
            assert.equal(`https://team${config.legacyBase}/db/main?a=myqb`, spyRedirect.getCall(0).args[0],
                'redirect should go to legacy stack my apps page');
        });

        it('validate http response 401 when the realm prefix in the cookie and realmhost mismatch for federation', function() {
            const mockFederationReq = Object.assign({}, validMockFederationRequest, {cookies: {"someotherrealm_TICKET": "someticketvalue"}});

            authentication.federation(mockFederationReq, mockRes);
            assert.equal(mockRes.httpStatus, 401,
                'should error when we are missing the realm-specific cookie');
            assert(spyRedirect.callCount === 0, ' should not redirect');
            assert(spyRender.calledOnce, 'should render the error page');
        });

        it('validate http response 401 when realm ticket is null for federation', function() {
            const mockFederationReq = Object.assign({}, validMockFederationRequest, {cookies : {"team_TICKET": null}});

            authentication.federation(mockFederationReq, mockRes);
            assert.equal(mockRes.httpStatus, 401,
                'should error when we are missing the realm-specific cookie');
            assert(spyRedirect.callCount === 0, ' should not redirect');
            assert(spyRender.calledOnce, 'should render the error page');
        });

        it('validate http 302 redirect to legacy stack if redirect url does not go to a quickbase domain', function() {
            const con = Object.assign({}, config, {legacyBase: '.quickbase.com'});
            const auth = require('../../../src/components/authentication/index')(con);
            const mockFederationReq = Object.assign({}, validMockFederationRequest, {query: {"url": "https://google.com"}});

            auth.federation(mockFederationReq, mockRes);
            assert.equal(`https://team${con.legacyBase}/db/main?a=myqb`, spyRedirect.getCall(0).args[0],
                'redirect should be back to legacy stack');
        });

        it('validate http 302 redirect to legacy stack if redirect url is not a valid url', function() {
            const con = Object.assign({}, config, {legacyBase: '.quickbase.com'});
            const auth = require('../../../src/components/authentication/index')(con);
            const mockFederationReq = Object.assign({}, validMockFederationRequest, {query: {"url": "TOTALLY_NOT_A_URL"}});

            auth.federation(mockFederationReq, mockRes);
            assert.equal(`https://team${con.legacyBase}/db/main?a=myqb`, spyRedirect.getCall(0).args[0],
                'redirect should be back to legacy stack');
        });

        it('validate http 302 redirect to redirect url for int environment when domain matches legacyBase', function() {
            const auth = require('../../../src/components/authentication/index')(Object.assign({}, config, {legacyBase: '.currentstack-int.quickbaserocks.com'}));
            const mockFederationReq = Object.assign({}, validMockFederationRequest, {query: {"url": "https://team.mercury.quickbaserocks.com/qbase/governance/12/users"}});

            auth.federation(mockFederationReq, mockRes);
            assert.equal(mockFederationReq.query.url, spyRedirect.getCall(0).args[0],
                'redirect should be set based on url specified in query parameters of the request');
        });
    });
});
