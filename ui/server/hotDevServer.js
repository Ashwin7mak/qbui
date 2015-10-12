(function() {
    /**
     * Hot reload with Node.js server
     *  our webpack-dev-server listens to localhost:3000 and handle the hotness
     *  This server serves only as a proxy for the hot reloading.
     */
    'use strict';

    var log = require('./logger').getLogger();

    module.exports = function(config, app) {
        if (!config.isProduction) {
            var webpack = require('webpack');
            var WebpackDevServer = require('webpack-dev-server');
            var hotPort = config.webpackDevServerPort || 3000;
            var webpackConfig = require('../webpack.config.js');

            webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
            webpackConfig.entry = [
                    // WebpackDevServer host and port
                    //'webpack-dev-server/client?http://0.0.0.0:' + hotPort,
                    'webpack-dev-server/client?http://localhost:' + hotPort,
                    // "only-dev-server" prevents reload on syntax errors
                    'webpack/hot/only-dev-server'
            ].concat(webpackConfig.entry);

            //webpackConfig.output.publicPath = "http://localhost:" + hotPort + webpackConfig.output.publicPath;

            var compiler = webpack(webpackConfig);
            // we start a webpack-dev-server with our config

            var devServerConfig = {
                // webpack-dev-server will capture http refs to this and turn into
                // it's in mem bundle's location
                // Note that we are not actually outputting any files when running the
                // webpack-dev workflow, but we want the 'in-memory' files to be fetched from
                // this path  e.g http://localhost:3000/dist/
               // publicPath : '/dist/',
                publicPath        : "http://localhost:" + hotPort + webpackConfig.output.publicPath,

                // hot -  Enable special support for Hot Module Replacement (HMR)
                // Page is not updated, but a "webpackHotUpdate" message is send to the content
                // Use "webpack/hot/dev-server" as additional module in your entry point
                // Note: Since this does _not_ add the `HotModuleReplacementPlugin`
                // like the CLI option does. It is added above
                hot: true,

                // inline - doesn't use iframe for HMR
                //inline             : true,

                progress: true,

                // historyApiFallback -  to access dev server from arbitrary url.
                historyApiFallback: true,

                // Config for minimal console.log mess.
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
                    timings     : false,
                    version     : true
                }
                //,
                //proxy: [
                //    {
                //        // proxy all requests not containing "dist/*"
                //        path : /favico.ico/,
                //        target:  'http:' + config.ip +':' + config.port
                //    },
                //    {
                //        // proxy all requests not containing "dist/*"
                //        path : /^((?!(dist\/)).)*$/,
                //        target:  'http:' + config.ip +':' + config.port
                //    },
                //    {
                //        path:   /\/api(.*)/,
                //        target:  'http://' + config.ip +':' + config.port
                //    },
                //    {
                //        path:   /\/app*(.*)/,
                //        target:  'http://' + config.ip +':' + config.port
                //    }]
                //proxy: for webpack-dev-server to delegate a path to node server.
                //proxy: {
                //    '*':  'http://' + config.ip +':' + config.port
                //}
            };
            console.log('webpackConfig Settings :' + JSON.stringify(webpackConfig, null, 2));
            console.log('devServerConfig Settings :' + JSON.stringify(devServerConfig, null, 2));

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
