var assert = require('assert');
var sinon = require('sinon');
var WebpackDevServer = require('webpack-dev-server');
var log = require('../logger').getLogger();

/**
 * Unit tests for Hot Dev Server
 */
describe('HotDevServer Unit Test', function() {

    var stubLog;
    var hotServerMockStub;
    var webpackDevServerStub;

    //  mock is included in config and passed to hotLoader...as we do not want to call the 'real' hot loader during test run
    function HotServerMock(compiler, option) {
        this.compiler = compiler;
        this.option = option;
    }
    HotServerMock.prototype.listen = function() {
        log.debug('listen mock');
    };

    beforeEach(function() {
        stubLog = sinon.stub(log, 'logRequest').returns(true);
        hotServerMockStub = sinon.stub(HotServerMock.prototype, 'listen').returns(true);
        webpackDevServerStub = sinon.stub(WebpackDevServer.prototype, 'listen').returns(true);
    });
    afterEach(function() {
        stubLog.restore();
        hotServerMockStub.restore();
        webpackDevServerStub.restore();
    });

    it('validate hot reload is not available if noHotLoad is false and production is true', function() {

        var mockConfig = {
            isProduction: true,
            noHotLoad: false,
            hotServer: HotServerMock
        };
        require('../hotDevServer')(mockConfig);

        assert(hotServerMockStub.callCount === 0, true);
        assert(webpackDevServerStub.callCount === 0, true);
    });

    it('validate hot reload is not available if noHotLoad is true and production is true', function() {

        var mockConfig = {
            isProduction: true,
            noHotLoad: true,
            hotServer: HotServerMock
        };
        require('../hotDevServer')(mockConfig);

        assert(hotServerMockStub.callCount === 0, true);
        assert(webpackDevServerStub.callCount === 0, true);
    });

    it('validate hot reload is not available if noHotLoad is true and production is false', function() {

        var mockConfig = {
            isProduction: false,
            noHotLoad: true,
            hotServer: HotServerMock
        };
        require('../hotDevServer')(mockConfig);

        assert(hotServerMockStub.callCount === 0, true);
        assert(webpackDevServerStub.callCount === 0, true);
    });

    it('validate hot reload is available if noHotLoad is false and production is false', function() {

        var mockConfig = {
            isProduction: false,
            noHotLoad: false,
            hotServer: HotServerMock
        };

        require('../hotDevServer')(mockConfig);

        assert(hotServerMockStub.callCount === 1, true);
        assert(webpackDevServerStub.callCount === 0, true);
    });

});
