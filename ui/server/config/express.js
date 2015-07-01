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
        envConsts = require('./valid_environments');


        module.exports = function (app) {

        var env = app.get('env');

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

            if (envConsts.PRODUCTION === env || envConsts.PRE_PROD) {
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
