
// Test specific configuration
// ===========================

(function () {
    'use strict';

    //var path = require('path');
    var dateUtils = require('../../components/utility/dateUtils');
    var envConsts = require('./environmentConstants');
    var routeGroups = require('../../routes/routeGroups');
    module.exports = {

        //  Logging configuration
        LOG: {
            name: 'qbse-test',
            level: 'info',
            stream: {
                type: 'console',         //  file or console
                file: {
                    dir: './logs',
                    name: 'qbse-test-' + dateUtils.formatDate( new Date(), '%Y-%M-%D-%h.%m.%s') + '.log'
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
        javaHost: 'http://localhost:8080',

        //Express Server
        //DOMAIN: 'https://localhost.intuit.com:9443'
        DOMAIN  : 'http://localhost:9000',

        env: envConsts.TEST,
        routeGroup: envConsts.DEBUG

    };

}());
