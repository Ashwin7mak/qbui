/**
 * Main application file
 */
(function () {
    'use strict';

    // Set default node environment to local
    // TODO: should remove default to force environment and avoid potential mis-configuration
    process.env.NODE_ENV = process.env.NODE_ENV || 'local';

    var express = require('express'),
        http = require('http'),
        config = require('./config/environment');

    // Setup server
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

    require('./config/express')(app);
    require('./routes')(app, config);

    console.log('Starting express server');
    console.log('ENVIRONMENT: %s', app.get('env'));

    /**************
     * Start HTTP Server
     **************/
    var server = http.createServer(app);
    server.listen(config.port, config.ip, function () {
        console.log('Server started. Listening on PORT: %d', server.address().port);
    });

    //TODO - determine if we need to redirect all server traffic over https on production

    /**************
     * Start HTTPS Server
     **************/
    if (config.SSL_KEY.private && config.SSL_KEY.cert) {
        var fs = require('fs'),
            https = require('https');

        var options = {
            key: fs.readFileSync(config.SSL_KEY.private),
            cert: fs.readFileSync(config.SSL_KEY.cert),
            rejectUnauthorized: false
        };

        var serverHttps = https.createServer(options, app);
        serverHttps.listen(config.sslPort, config.ip, function () {
            console.log('Server started. Listening on PORT: %d', serverHttps.address().port);
        });
    }
}());
