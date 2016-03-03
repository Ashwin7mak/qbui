/**
 * Express configuration
 */
var config = require('./environment');

(function() {
    'use strict';

    var express = require('express');
    var useragent = require('express-useragent');
    var favicon = require('serve-favicon');
    var compression = require('compression');
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var cookieParser = require('cookie-parser');
    var errorHandler = require('errorhandler');
    var path = require('path');
    var log = require('../logger').getLogger();

    var envConsts = require('./environment/environmentConstants');
    var routeGroups = require('../routes/routeGroups');
    var clientConsts = require('./environment/clientConsts');

    module.exports = function(app) {

        // use ssl when there's a cert and we have the method to implement it
        if (config.hasSslOptions() && app.requireHTTPS) {
            log.info('..redirecting all http requests over https');
            app.use(app.requireHTTPS);
        } else {
            log.info('..not redirecting requests over https');
        }

        // This config.env refers to the node env - it is the way in which we know what routes to enable versus disable,
        // and configure anything environment specific.
        // This differs from runtime env which corresponds to process.env.NODE_ENV. This is the way node knows which
        // file to load when creating the express server. We don't want to use this variable as it makes us dependent
        // on generated config in aws. For this reason, the node code maintains it's own notion of environment independent
        // of the config file name loaded on startup
        var env = config.env;

        //  Need to have a run-time environment configured
        if (!config.env) {
            throw new Error('Missing environment configuration.  You must set a configuration environment variable. Under ' + process.env.NODE_ENV + '.js, make sure you have env: envConsts.ENVIRONMENT. Look at local.js.sample for an example.');
        }

        //  Need to have a routeGroup enabled here - if none was provided, we will use the DEFAULT which will be the most
        // restrictive version of routing we have out there.
        if (config.routeGroup === undefined) {
            log.warn('Did not find a route group specified in env.js file. Defaulting to ' + routeGroups.DEFAULT);
            config.routeGroup = routeGroups.DEFAULT;
        }

        log.info('env : %s, client: %s, routegroup: %s', config.env, config.client, config.routeGroup);

        app.set('views', config.root + '/server/views');
        app.engine('html', require('ejs').renderFile);
        app.set('view engine', 'html');

        app.use(compression());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());
        app.use(methodOverride());
        app.use(cookieParser());
        app.use(useragent.express());

        config.isProduction = false;
        if (envConsts.PRODUCTION === env || envConsts.PRE_PROD === env || envConsts.INTEGRATION === env || envConsts.DEVELOPMENT === env || envConsts.TEST === env) {

            if (envConsts.DEVELOPMENT === env) {
                app.use(require('connect-livereload')());
            }

            if (envConsts.PRODUCTION === env || envConsts.PRE_PROD === env) {
                var fs = require('fs');
                config.isProduction = true;
                var faviconFile = path.join(config.root, 'dist', 'public', 'favicon.ico');
                if (fs.existsSync(faviconFile)) {
                    app.use(favicon(faviconFile));
                }
            }

            app.use(express.static(path.join(config.root, 'public')));
            app.set('appPath', config.root + '/public');

            //  Error handler - has to be last.  NON-PROD environment only
            if (envConsts.TEST === env || envConsts.DEVELOPMENT === env) {
                app.use(errorHandler());
            }
        }

        if (!config.ip) {
            if (config.DOMAIN) {
                var url = require('url');
                config.ip = url.parse(config.DOMAIN).hostname;
            } else {
                config.ip = 'localhost';
            }
        }
        //   allows for ability to run multiple clients...right now only REACT
        var client = config.client;

        //  LOAD THE REACT CLIENT
        app.use(express.static(path.join(config.root, 'client-react')));
        app.set('appPath', config.root + '/client-react');
        //  Error handler - has to be last.
        app.use(errorHandler());

        return config;
    };
}());
