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

    console.log('app.js...starting server.');

    // Setup server
    var app = module.exports = express();

    require('./config/express')(app);
    require('./routes')(app, config);

    /**************
     * Start HTTP Server
     **************/
    var server = http.createServer(app);
    server.listen(config.port, config.ip, function () {
        console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
    });

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

        var serverHttp = https.createServer(options, app);
        serverHttp.listen(config.sslPort, config.ip, function () {
            console.log('Express server listening on %d, in %s mode', config.sslPort, app.get('env'));
        });
    }
}());
