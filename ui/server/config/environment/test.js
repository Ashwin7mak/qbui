
// Test specific configuration
// ===========================

(function () {
    'use strict';

    //var path = require('path');

    module.exports = {

        // to run using ssl, copy the private key and cert for
        // your test host to ../server/config/environment/keys
        // folder...no keys defined equates to no SSL support.
        SSL_KEY: {
            private: '',
            cert: ''
        },

        // allow for override of default ports
        port: 9000,
        sslPort: 9443,

        //REST endpoint (protocol,server,port)
        //javaHost: 'https://localhost.intuit.com:8443',
        //javaHost: 'http://localhost.intuit.com:8080'
        javaHost: 'http://localhost:8085/api',

        //Express Server
        //DOMAIN: 'https://localhost.intuit.com:9443'
        DOMAIN  : 'https://localhost.intuit.com:9000'

    };

}());
