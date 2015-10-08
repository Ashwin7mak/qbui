// Test on CI specific configuration
// ===========================

(function() {
    'use strict';

    //var path = require('path');
    var dateUtils = require('../../components/utility/dateUtils');
    var envConsts = require('./environmentConstants');
    var routeGroups = require('../../routes/routeGroups');
    var clientConsts = require('./clientConsts');

    //Temporary support CLIENT=ANGULAR
    // default is CLIENT=REACT for ci which we'll deploy
    var client = clientConsts.REACT;
    if (process.env.CLIENT) {
        client = process.env.CLIENT;
    }

    module.exports = {

        //  Logging configuration
        LOG: {
            name  : 'qbse-test',
            level : 'info',
            stream: {
                type: 'console',         //  file or console
                file: {
                    dir : './logs',
                    name: 'qbse-test-' + dateUtils.formatDate(new Date(), '%Y-%M-%D-%h.%m.%s') + '.log'
                }
            },
            src   : true               // this is slow...do not use in prod
        },

        // to run using ssl, copy the private key and cert for
        // your test host to ../server/config/environment/keys
        // folder...no keys defined equates to no SSL support.
        //SSL_KEY: {
        //    private: '',
        //    cert: ''
        //},

        // allow for override of default ports
        port   : 9000,
        sslPort: 9443,

        //REST endpoint (protocol,server,port)
        //javaHost: 'https://localhost.intuit.com:8443',
        //javaHost: 'http://localhost.intuit.com:8080'
        javaHost: 'http://localhost:8080',

        //Express Server
        //DOMAIN: 'https://localhost.intuit.com:9443'
        DOMAIN: 'http://localhost:9000',

        //Node understanding of RuntimeEnvironment
        env       : envConsts.TEST,

        //Node's understanding of a grouping of routes to be enabled/disabled
        routeGroup: routeGroups.DEBUG,

        // the client to use
        client: client

    };
}());
