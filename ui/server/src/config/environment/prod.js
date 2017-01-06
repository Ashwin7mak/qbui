
// Local configuration
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
            level: 'info',
            stream: {
                type: 'console',         //  file or console
                file: {
                    dir: './logs',
                    name: 'qbse-local-' + dateUtils.formatDate(new Date(), '%Y-%M-%D-%h.%m.%s') + '.log'
                }
            },
            src: false               // this is slow...do not use in prod
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
        port: 9000,
        sslPort: 9443,

        //Java REST endpoint (protocol,server,port)
        //javaHost: 'https://localhost.intuit.com:8443',
        //javaHost: 'http://localhost.intuit.com:8080',
        javaHost: 'http://localhost:8080',


        //Express Server
        //DOMAIN: 'https://localhost.intuit.com:9443',
        //DOMAIN: 'http://localhost.intuit.com:9000',
        DOMAIN  : 'http://localhost:9000',

        //  legacy quickbase host
        legacyHost: '',

        //Node understanding of RuntimeEnvironment
        env: envConsts.PRODUCTION,

        //enable to track performance stats to server/splunk
        isClientPerfTrackingEnabled: true,

        //Node's understanding of a grouping of routes to be enabled/disabled
        routeGroup: routeGroups.LH_V1,

        //set notHotLoad true to disable hotloading
        noHotLoad : true,

        // the client to use
        client : client,

        /**
         * Scripts for Wistia video popover
         * They load script from a video hosting service called Wistia and allow the walk-through video to load as a popover
         */
        wistiaScriptPart1: 'https://fast.wistia.com/embed/medias/zl4za7cf5e.jsonp',
        wistiaScriptPart2: 'https://fast.wistia.com/assets/external/E-v1.js',
    };
}());
