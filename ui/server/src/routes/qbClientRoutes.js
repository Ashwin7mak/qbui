var lodash = require('lodash');
var path = require('path');
var baseClientRoute = require('./baseClientRoute');
var basePath = require('../../../common/src/constants').ROUTES.BASE_CLIENT_ROUTE;

(function() {
    'use strict';

    var viewPath = path.join(__dirname, '/viewComponents');

    var HOT_BASE;
    var BASE_PROPS;

    function getBaseOpts(config) {
        // for hot loading we need to prefix the requests in the html wih the hot loader url
        HOT_BASE = 'http://' + config.ip + ':' + (config.webpackDevServerPort || 3000);
        BASE_PROPS = {
            title   : '',
            lang    : 'en-us',
            jsPath  : '/dist/',
            settings: {views: viewPath},
            hostBase: (config.isProduction || config.noHotLoad) ? '' : HOT_BASE,
            bundleFileName: config.isProduction ? 'bundle.min.js' : 'bundle.js',
            wistiaJs1: config.wistiaScriptPart1,
            wistiaJs2: config.wistiaScriptPart2,
            isClientPerfTrackingEnabled: config.isProduction || !!config.isClientPerfTrackingEnabled
        };
    }

    module.exports = function(app, config) {
        getBaseOpts(config);

        // Requires all paths set inside the 'clientRoutes' folder. See aClientRoutes.sample.js for more information.
        const normalizedPath = path.join(__dirname, 'clientRoutes');
        require("fs").readdirSync(normalizedPath).forEach(function(file) {
            if (file.indexOf('.sample') < 0) {
                require("./clientRoutes/" + file).addRoutes(app, BASE_PROPS, config);
            }
        });

        //  Default application dashboard
        app.route(`${basePath}/`).get(function(req, res) {
            res.redirect(`${basePath}/apps`);
        });
    };
}());
