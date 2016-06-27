(function() {
    /**
     * Hot reload with Node.js server
     *  our webpack-dev-server listens to localhost:3000 and handle the hotness
     *  This server serves only as a proxy for the hot reloading.
     */
    'use strict';

    var log = require('./logger').getLogger();

    module.exports = function(config) {
        if (!config.isProduction && !config.noHotLoad) {

            var webpack = require('webpack');
            var WebpackDevServer = require('webpack-dev-server');
            var webpackConfig = require('../../webpack.config.js');
            var hotPort = config.webpackDevServerPort || 3000;

            webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

            for (var entryItem in webpackConfig.entry) {
                webpackConfig.entry[entryItem].unshift('webpack-dev-server/client?http://0.0.0.0:' + hotPort);
                webpackConfig.entry[entryItem].unshift('webpack/hot/only-dev-server');
            }

            webpackConfig.output.publicPath = 'http://' + config.ip + ':' + hotPort + webpackConfig.output.publicPath;

            var compiler = webpack(webpackConfig);
            // we start a webpack-dev-server with our config

            var devServerConfig = {
                // webpack-dev-server will capture http refs to this and turn into
                // it's in mem bundle's location
                // Note that we are not actually outputting any files when running the
                // webpack-dev workflow, but we want the 'in-memory' files to be fetched from
                // this path  e.g http://localhost:3000/dist/
                publicPath : '/dist/',

                // hot -  Enable special support for Hot Module Replacement (HMR)
                // Page is not updated, but a 'webpackHotUpdate' message is send to the content
                // Use 'webpack/hot/dev-server' as additional module in your entry point
                // Note: Since this does _not_ add the `HotModuleReplacementPlugin`
                // like the CLI option does. It is added above
                hot: true,

                // inline - doesn't use iframe for HMR
                inline             : true,

                progress: true,

                // historyApiFallback -  to access dev server from arbitrary url.
                historyApiFallback: true,

                // Config for minimal console.log output.
                stats: {
                    assets      : true,
                    cached      : true,
                    chunkModules: false,
                    chunkOrigins: true,
                    chunks      : true,
                    colors      : true,
                    hash        : false,
                    modules     : false,
                    reasons     : true,
                    timings     : true,
                    version     : true
                }
            };
            log.info('webpackConfig Settings :' + JSON.stringify(webpackConfig));
            log.info('devServerConfig Settings :' + JSON.stringify(devServerConfig));

            var hotServer =  config.hotServer ?
                new config.hotServer(compiler, devServerConfig) :
                new WebpackDevServer(compiler, devServerConfig);
            log.info('Hot webpack-dev-server Settings :' + JSON.stringify(hotServer));
            hotServer.listen(hotPort, config.ip, function(err) {
                if (err) {
                    log.fatal(err);
                }
                log.info('Hot webpack-dev-server Listening at ' + config.ip + ' port:' + hotPort);
            });
        }

    };
}());
