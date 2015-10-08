(function() {
    /**
     * Hot reload with Node.js server
     */
    'use strict';

    var log = require('./logger').getLogger();

    module.exports = function(config) {
        if (!config.isProduction) {
            var webpack = require('webpack');
            var WebpackDevServer = require('webpack-dev-server');
            var webpackConfig = require('../webpack.config.js');

            var hotPort = config.devServerPort || 3000;
            var compiler = webpack(webpackConfig);

            // we start a webpack-dev-server with our config
            var hotServer = new WebpackDevServer(compiler, {
                // webpack-dev-server options

                publicPath        : webpackConfig.output.publicPath,

                // hot -  Enable special support for Hot Module Replacement
                // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
                // Use "webpack/hot/dev-server" as additional module in your entry point
                // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.
                hot               : true,

                // inline - doesn't use iframe for HMR
                inline             : true,

                // historyApiFallback -  to access dev server from arbitrary url.
                historyApiFallback: true

                // proxy: for webpack-dev-server to delegate a single path to an arbitrary server.
                //proxy             : {
                //    "api": config.ip + ":" + nodeServerPort
                //}
            });
            log.info('Hotserver Settings :' + JSON.stringify(hotServer));
            hotServer.listen(hotPort, config.ip, function(err) {
                  if (err) {
                      log.fatal(err);
                  }
                  log.info('Hotserver Listening at ' + config.ip + ' port:' + hotPort);
              });

        }

    };
}());
