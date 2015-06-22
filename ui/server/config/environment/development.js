
// Development specific configuration
// ===========================

(function () {
    'use strict';

    //var path = require('path');
    var dateUtils = require('../../components/utility/dateUtils');

    module.exports = {

        //  Logging configuration
        LOG: {
            name: 'qbse-dev',
            level: 'debug',
            stream: {
                type: 'console',         //  file or console
                file: {
                    dir: './logs',
                    name: 'qbse-dev-' + dateUtils.formatDate( new Date(), '%Y-%M-%D-%h.%m.%s') + '.log'
                },
                rotating: {
                    period: '1d',
                    count: 7
                }
            },
            src: true,               // this is slow...do not use in prod
            suppressConsole: false,  // suppress console logging
            maxResponseSize: 1024*2  // max number of characters logged per response
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
