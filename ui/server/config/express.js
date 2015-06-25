/**
 * Express configuration
 */
(function () {
    'use strict';

    var express = require('express'),
        useragent = require('express-useragent'),
        favicon = require('serve-favicon'),
        compression = require('compression'),
        bodyParser = require('body-parser'),
        methodOverride = require('method-override'),
        cookieParser = require('cookie-parser'),
        errorHandler = require('errorhandler'),
        path = require('path'),
        config = require('./environment');

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
        app.use(useragent.express());

        //TODO: We need to figure out how we want to handle the environment config in aws
        if ('aws' === env || 'production' === env || 'test' === env || 'development' === env) {
            if ('development' === env) {
                app.use(require('connect-livereload')());
            }

            if ('aws' === env || 'production' === env) {
                app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
            }

            app.use(express.static(path.join(config.root, 'public')));
            app.set('appPath', config.root + '/public');

            //  Error handler - has to be last.  NON-PROD environment only
            if ('test' === env || 'development' === env) {
                app.use(errorHandler());
            }
        }

        if ('local' === env) {
            app.use(express.static(path.join(config.root, '.tmp')));
            app.use(express.static(path.join(config.root, 'client')));
            app.set('appPath', config.root + '/client');
            //  Error handler - has to be last.
            app.use(errorHandler());
        }

    };
}());
