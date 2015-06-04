
// Local configuration
// ===========================

(function () {
    'use strict';

    // Use local.js for environment variables that grunt will set when the server starts locally.
    // The local.js should not be tracked by git.

    var path = require('path');

    module.exports = {

        // to run using ssl, copy the private key and cert for
        // your host(ie:localhost.intuit.com) to ../server/config/keys
        // folder.. comment this out if don't want to offer ssl support.

        //SSL_KEY: {
        //    private: path.normalize(__dirname + '/keys/private.pem'),
        //    cert: path.normalize(__dirname + '/keys/cert.pem')
        //    requireCert: false  // set to false for self signed certs
        //},

        // allow for override of default ports
        port: 9000,
        sslPort: 9443,

        //REST endpoint (protocol,server,port)
        //javaHost: 'https://localhost.intuit.com:8443',
        //javaHost: 'http://localhost.intuit.com:8080'
        javaHost: 'http://pppdc9prd2jx.corp.intuit.net:80',

        //Express Server
        //DOMAIN: 'https://localhost.intuit.com:9443'
        DOMAIN  : 'https://localhost.intuit.com:9000'

    };
}());
