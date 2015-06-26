/**
 * Express configuration
 */
(function () {
    'use strict';

    var express = require('express');
    var favicon = require('serve-favicon');
    var compression = require('compression');
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var cookieParser = require('cookie-parser');
    var errorHandler = require('errorhandler');
    var path = require('path');
    var log = require('../logger').getLogger(module.filename);
    var config = require('./environment');

    function requireHTTPS(req, res, next) {
        // if the request is not secure redirect as a secure
        if (!req.secure) {
            var domain = "https://" + req.get("host");
            var sslPort = config.sslPort;
            if (sslPort) {
                domain = domain.replace(/:\d+$/, "");
                domain += ":" + sslPort;
            }
            return res.redirect(domain + req.url);
        }
        next();
    }

    module.exports = function (app) {

        // use ssl when there's a cert
        if (config.SSL_KEY && config.SSL_KEY.private && config.SSL_KEY.private.length)  {
            log.info("always auto https");
            app.use(requireHTTPS);
        } else {
            log.info("not auto https");
        }

        var env = app.get('env');

        app.set('views', config.root + '/server/views');
        app.engine('html', require('ejs').renderFile);
        app.set('view engine', 'html');
        app.use(compression());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());
        app.use(methodOverride());
        app.use(cookieParser());

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
        return config;
    };
}());
