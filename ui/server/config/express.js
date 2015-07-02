/**
 * Express configuration
 */
(function () {
    'use strict';

    var express = require('express'),
        favicon = require('serve-favicon'),
        compression = require('compression'),
        bodyParser = require('body-parser'),
        methodOverride = require('method-override'),
        cookieParser = require('cookie-parser'),
        errorHandler = require('errorhandler'),
        path = require('path'),
        config = require('./environment'),
        envConsts = require('./environment/valid_environments');


        module.exports = function (app) {

        // This config.env refers to the node env - it is the way in which we know what routes to enable versus disable,
        // and configure anything environment specific.
        // This differs from runtime env which corresponds to process.env.NODE_ENV. This is the way node knows which
        // file to load when creating the express server. We don't want to use this variable as it makes us dependent
        // on generated config in aws. For this reason, the node code maintains it's own notion of environment independent
        // of the config file name loaded on startup
        var env = config.env;

        //  Need to have a run-time environment configured
        if (config.env === undefined) {
            throw new Error('Missing environment configuration.  You must set a configuration environment variable. Under ' + process.env.NODE_ENV + '.js, make sure you have env: envConsts.ENVIRONMENT. Look at local.js.sample for an example.');
        }

        app.set('views', config.root + '/server/views');
        app.engine('html', require('ejs').renderFile);
        app.set('view engine', 'html');
        app.use(compression());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());
        app.use(methodOverride());
        app.use(cookieParser());

        if (envConsts.PRODUCTION === env || envConsts.PRE_PROD === env || envConsts.INTEGRATION === env || envConsts.DEVELOPMENT === env || envConsts.TEST === env) {

            if (envConsts.DEVELOPMENT === env) {
                app.use(require('connect-livereload')());
            }

            if (envConsts.PRODUCTION === env || envConsts.PRE_PROD === env) {
                app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
            }

            app.use(express.static(path.join(config.root, 'public')));
            app.set('appPath', config.root + '/public');

            //  Error handler - has to be last.  NON-PROD environment only
            if (envConsts.TEST === env || envConsts.DEVELOPMENT === env) {
                app.use(errorHandler());
            }
        }

        if (envConsts.LOCAL === env) {
            app.use(express.static(path.join(config.root, '.tmp')));
            app.use(express.static(path.join(config.root, 'client')));
            app.set('appPath', config.root + '/client');
            //  Error handler - has to be last.
            app.use(errorHandler());
        }

    };
}());
