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
