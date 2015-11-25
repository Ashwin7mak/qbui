var assert = require('assert');
var sinon = require('sinon');
var WebpackDevServer = require('webpack-dev-server');
var log = require('../logger').getLogger();

/**
 * Unit tests for app generator
 */
describe('HotDevServer Unit Test', function() {

    var stubLog;
    var webpackDevServerStub;

    function HotServerMock(compiler, option) {
        this.compiler = compiler;
        this.option = option;
    }
    HotServerMock.prototype.listen = function() {
        console.log('listen mock');
    };

    beforeEach(function() {
        stubLog = sinon.stub(log, 'logRequest').returns(true);
        webpackDevServerStub = sinon.stub(WebpackDevServer.prototype, 'listen').returns(true);
    });
    afterEach(function() {
        stubLog.restore();
        webpackDevServerStub.restore();
    });

    it('validate hot reload is not available in production', function() {

        var mockConfig = {
            isProduction: true,
            noHotLoad: false
        };
        require('../hotDevServer')(mockConfig);
        assert(webpackDevServerStub.callCount === 0, true);
    });

    it('validate hot reload is not available in production and noHotLoad is true', function() {

        var mockConfig = {
            isProduction: true,
            noHotLoad: true
        };
        require('../hotDevServer')(mockConfig);
        assert(webpackDevServerStub.callCount === 0, true);
    });

    it('validate hot reload is not available if noHotLoad is true', function() {

        var mockConfig = {
            isProduction: false,
            noHotLoad: true
        };
        require('../hotDevServer')(mockConfig);
        assert(webpackDevServerStub.callCount === 0, true);
    });

    it('validate hot reload is available in non-prod environment', function() {

        var mockConfig = {
            isProduction: false,
            noHotLoad: false,
            hotServer: HotServerMock
        };
        var hotServerStub = sinon.stub(HotServerMock.prototype, 'listen').returns(true);

        require('../hotDevServer')(mockConfig);
        assert(webpackDevServerStub.callCount === 0, true);
        assert(hotServerStub.callCount === 1, true);
    });

});
