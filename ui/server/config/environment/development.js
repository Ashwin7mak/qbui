
// Development specific configuration
// ===========================

(function () {
    'use strict';

    //var path = require('path');

    module.exports = {

        // to run using ssl, copy the private key and cert for
        // your development host to ../server/config/environment/keys
        // folder...no keys defined equates to no SSL support.
        SSL_KEY: {
            private: '',
            cert: ''
        },

        // allow for override of default ports
        port: 9000,
        sslPort: 9443,

        //DEV REST endpoint (protocol,server,port)
        javaHost: '',

        //DEV Express Server
        DOMAIN: ''

    };
}());
