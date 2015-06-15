/**
 * Express configuration
 */
(function () {
    'use strict';

    var express = require('express'),
        favicon = require('serve-favicon'),
        morgan = require('morgan'),
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

            //  configure to output to a file...combine out with bunyan?
            app.use(morgan(':date[iso] :remote-addr :req :status :method :url :response-time ms'));

            //  Error handler - has to be last.
            //  Do not activate in production as full error stack traces are outputted
            if ('test' === env || 'development' === env) {
                app.use(errorHandler());
            }
        }

        if ('local' === env) {
            app.use(express.static(path.join(config.root, '.tmp')));
            app.use(express.static(path.join(config.root, 'client')));
            app.set('appPath', config.root + '/client');

            //  configure to output to a file...combine out with bunyan?
            app.use(morgan(':date[iso] :remote-addr :req :status :method :url :response-time ms'));
            //"ROUTE: " + req.route.path + "; URL: " + this.getRequestUrl(req)
        }

    };
}());
