
// Local configuration to use only when running Protractor E2E tests
// ===========================

(function() {
    'use strict';

    // Use local.js for environment variables that grunt will set when the server starts locally.
    // The local.js should not be tracked by git.

    //var path = require('path');
    var dateUtils = require('../../utility/dateUtils');
    var envConsts = require('./environmentConstants');
    var routeGroups = require('../../routes/routeGroups');
    var clientConsts = require('./clientConsts');

    var client = clientConsts.REACT;

    module.exports = {

        //  Logging configuration
        LOG: {
            name: 'qbse-local',
            level: 'debug',
            stream: {
                type: 'console',         //  file or console
                file: {
                    dir: './logs',
                    name: 'qbse-local-' + dateUtils.formatDate(new Date(), '%Y-%M-%D-%h.%m.%s') + '.log'
                }
            },
            src: true               // this is slow...do not use in prod
        },

        // to run using ssl, copy the private key and cert for
        // your host(ie:localhost.intuit.com) to ../server/config/keys
        // folder.. comment this out if don't want to offer ssl support.

        //SSL_KEY: {
        //    private: path.normalize(__dirname + '/keys/private.pem'),
        //    cert: path.normalize(__dirname + '/keys/cert.pem'),
        //    requireCert: false  // set to false for self signed certs
        //},

        // allow for override of default ports
        port: 9001,
        sslPort: 9443,

        ip : 'localhost', // replace with your host or machine name user use (that is in your hosts file i.e.'CMBL13XXXXXX' for mobile testing)


        //Java REST endpoint (protocol,server,port)
        //javaHost: 'https://localhost.intuit.com:8443',
        javaHost: 'http://localhost:8080',
        //javaHost: 'http://localhost:8080',

        //Express Server
        //DOMAIN: 'https://localhost.intuit.com:9443',
        DOMAIN: 'http://localhost:9001',
        //DOMAIN  : 'http://localhost:9000',

        //Node understanding of RuntimeEnvironment
        env: envConsts.LOCAL,

        //Node's understanding of a grouping of routes to be enabled/disabled
        routeGroup: routeGroups.DEBUG,

        //set notHotLoad true to disable hotloading
        noHotLoad : true,

        // the client to use
        client: clientConsts.REACT,

        // walkme java script
        walkmeJSSnippet : ''
    };
}());
