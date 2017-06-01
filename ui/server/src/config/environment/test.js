// Test on CI specific configuration. Currently used in CI try jobs.
// ===========================

(function() {
    'use strict';

    //var path = require('path');
    var dateUtils = require('../../utility/dateUtils');
    var envConsts = require('./environmentConstants');
    var routeGroups = require('../../routes/routeGroups');
    var clientConsts = require('./clientConsts');
    var random = require('lodash').random;

    var client = clientConsts.REACT;

    // we need to determine dynamically what port was opened with route53 shell script in core during jenkins build
    // so we add 8080 + executor number (which is what the shell script does to ensure uniqueness)
    var javaHost = 'http://quickbase-dev.com';
    var eeHost = 'http://quickbase-dev.com';
    // same thing with node so we don't have colliding ports
    var nodeHostPort = 9000 + random(0, 99);
    var nodeHost = 'http://quickbase-dev.com:' + nodeHostPort;
    var eeHostEnable = true;

    // For the e2e try job we want to connect to an integration instance of Tomcat. If we set the env var in Jenkins
    // then use that otherwise default to the above
    if (process.env.JAVA_HOST) {
        javaHost = process.env.JAVA_HOST;
    }
    if (process.env.EE_HOST) {
        eeHost = process.env.EE_HOST;
    }

    if (!eeHostEnable) {
        eeHost = javaHost;
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
        // your test host to ../server/src/config/environment/keys
        // folder...no keys defined equates to no SSL support.
        //SSL_KEY: {
        //    private: '',
        //    cert: ''
        //},

        // allow for override of default ports
        port   : nodeHostPort,
        sslPort: 9443,

        //REST endpoint (protocol,server,port)
        //javaHost: 'https://quickbase-dev.com:8443',
        javaHost: javaHost,

        eeHost: eeHost,
        eeHostEnable: true,

        //Express Server
        //DOMAIN: 'https://quickbase-dev.com:9443'
        DOMAIN: nodeHost,

        //  legacy quickbase host
        legacyBase: '.quickbaserocks.com',

        //Node understanding of RuntimeEnvironment
        env       : envConsts.TEST,

        //Node's understanding of a grouping of routes to be enabled/disabled
        routeGroup: routeGroups.DEBUG,

        //enable to track performance stats to server/splunk
        isClientPerfTrackingEnabled: false,

        //set notHotLoad true to disable hotloading
        noHotLoad : true,

        // the client to use
        client: client,

        /**
         * Scripts for Wistia video popover
         * They load script from a video hosting service called Wistia and allow the walk-through video to load as a popover
         */
        wistiaScriptPart1: '',
        wistiaScriptPart2: '',
    };
}());
