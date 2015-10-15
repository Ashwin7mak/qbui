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
            var hotPort = config.webpackDevServerPort || 3000;
            var webpackConfig = require('../webpack.config.js');

            webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
            webpackConfig.entry = [
                    // WebpackDevServer host and port
                    'webpack-dev-server/client?http://0.0.0.0:' + hotPort,
                    //'webpack-dev-server/client?http://localhost:' + hotPort,
                    // "only-dev-server" prevents reload on syntax errors
                    'webpack/hot/only-dev-server'
            ].concat(webpackConfig.entry);

            webpackConfig.output.publicPath = 'http://localhost:' + hotPort + webpackConfig.output.publicPath;
           // webpackConfig.output.publicPath = "/dist/";

            var compiler = webpack(webpackConfig);
            // we start a webpack-dev-server with our config

            var devServerConfig = {
                // webpack-dev-server will capture http refs to this and turn into
                // it's in mem bundle's location
                // Note that we are not actually outputting any files when running the
                // webpack-dev workflow, but we want the 'in-memory' files to be fetched from
                // this path  e.g http://localhost:3000/dist/
                publicPath : '/dist/',
                //publicPath        : "http://localhost:" + hotPort + webpackConfig.output.publicPath,

                //contentBase        : webpackConfig.contentBase,
                // hot -  Enable special support for Hot Module Replacement (HMR)
                // Page is not updated, but a "webpackHotUpdate" message is send to the content
                // Use "webpack/hot/dev-server" as additional module in your entry point
                // Note: Since this does _not_ add the `HotModuleReplacementPlugin`
                // like the CLI option does. It is added above
                hot: true,

                // inline - doesn't use iframe for HMR
                inline             : true,

                progress: true,

                //debug: true,

                // historyApiFallback -  to access dev server from arbitrary url.
                historyApiFallback: true,

                // Config for minimal console.log output.
                no_stats: {
                    assets      : true,
                    cached      : true,
                    chunkModules: false,
                    chunkOrigins: true,
                    chunks      : true,
                    colors      : true,
                    hash        : false,
                    modules     : false,
                    reasons     : true,
                    timings     : true, //false
                    version     : true
                }
            };
            log.info('webpackConfig Settings :' + JSON.stringify(webpackConfig));
            log.info('devServerConfig Settings :' + JSON.stringify(devServerConfig));

            var hotServer = new WebpackDevServer(compiler, devServerConfig);
            log.info('Hot webpack-dev-server Settings :' + JSON.stringify(hotServer));
            hotServer.listen(hotPort, config.ip, function(err) {
                  if (err) {
                      log.fatal(err);
                  }
                  log.info('Hot webpack-dev-server Listening at ' + config.ip + ' port:' + hotPort);
              });
            //console.log('\nwebpackConfig Settings :' + JSON.stringify(webpackConfig, null, 2));

        }

    };
}());
