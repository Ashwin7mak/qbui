/**
 * Main application file
 */
(function() {
    'use strict';

    // if we have not set the NODE_ENV, then error out here
    if (!process.env.NODE_ENV) {
        throw new Error('No NODE_ENV was specified. You must set a run-time environment variable. Exiting');
    }

    var express = require('express'),
        http = require('http'),
        config = require('./config/environment'),
        _ = require('lodash');
    var fs = require('fs'),
        https = require('https');

    //  Configure the Bunyan logger
    var log = require('./logger').getLogger();

    // Setup the express server
    var app = module.exports = express();

    /*
     * Express automatically populates the req.body attribute with a JSON parsed object in the case
     * where Content-Type is application/json. Because there may be numeric values with greater precision
     * than the Javascript number data type supports, we need to cache the raw body as a string so that
     * we can parse this string without the default JSON.parse() behavior to capture 64 bit longs and decimal
     * precision that
     */
    app.use(function(req, res, next) {
        req.rawBody = '';
        req.on('data', function(chunk) {
            req.rawBody += chunk;
        });
        next();
    });


    /**
     * Express middleware function to force to use secure requests
     * If the request passed in is not secure redirects its as a secure (https)
     * removes port and adds the secure port from config
     *
     * If the secure port is the default 443 it does not append it https is sufficient
     *
     * NOTE:  That the process has to be running as root to listen on network ports less than 1024
     * so to use ssl 443 developer's would need to start this with sudo
     *
     * @param req the request
     * @param res the response to provide
     * @param next the next middleware function to process
     */
    app.requireHTTPS = function(req, res, next) {
        if (!req.secure) {
            var domain = 'https://' + req.get('host');
            var sslPort = config.sslPort;

            // remove non secure port from domain
            domain = domain.replace(/:\d+$/, '');
            if (sslPort && sslPort !== 443) {
                // add back on an sslport if it's not default of 443
                domain += ':' + sslPort;
            }
            log.debug('redirecting to: ' + domain + req.url);
            return res.redirect(domain + req.url);
        }
        next();
    };

    require('./config/expressConfig')(app);
    require('./routes')(app, config);
    //  log some server config info...but don't include the secrets configuration
    log.info('Express Server configuration:', JSON.stringify(_.omit(config, ['secrets', 'SESSION_SECRET'])));

    /**
     * only listen via a specific ip/hostname when not in production mode or when
     * running with dev hotloader, as the hotload server needs the ip for main express server
     ****/
    var hostnameToListenOn = undefined;
    if (!config.noHotLoad && !config.isProduction) {
        hostnameToListenOn = config.ip;
    }

    /**************
     * Start HTTP Server
     **************/
    app.httpServer = http.createServer(app);
    app.httpServer.listen(config.port, hostnameToListenOn, function() {
        if (hostnameToListenOn) {
            log.info('Http Server started. Listening %s on PORT: %d', hostnameToListenOn, app.httpServer.address().port);
        } else {
            log.info('Http Server started. Listening on PORT: %d', app.httpServer.address().port);
        }
    });

    /**************
     * Start HTTPS Server
     **************/
    if (config.hasSslOptions()) {

        var options = {
            key               : fs.readFileSync(config.SSL_KEY.private),
            cert              : fs.readFileSync(config.SSL_KEY.cert),
            rejectUnauthorized: false
        };

        app.httpsServer = https.createServer(options, app);
        app.httpsServer.listen(config.sslPort, hostnameToListenOn, function() {
            if (hostnameToListenOn) {
                log.info('Https Server started. Listening %s on PORT: %d', hostnameToListenOn, app.httpsServer.address().port);
            } else {
                log.info('Https Server started. Listening on PORT: %d', app.httpsServer.address().port);
            }
        });
    }

    //get the hot loader running for debugging, if not running production
    require('./hotDevServer')(config);

}());
