
// Development specific configuration
// ===========================

(function () {
    'use strict';

    //var path = require('path');

    module.exports = {

        //  Logging configuration
        LOG: {
            name: 'qbse-dev',
            level: 'debug',
            stream : {
                type: 'file',         //  file or console
                file: {
                    dir: './logs',
                    name: 'qbse-dev.log'
                },
                rotating: {
                    period: '1d',
                    count: 7
                }
            },
            src: true,              // this is slow...do not use in prod
            suppressConsole: false  // suppress console logging
        },

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
