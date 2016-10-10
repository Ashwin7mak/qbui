// Test on CI specific configuration. Currently used in CI try jobs.
// ===========================

(function() {
    'use strict';

    //var path = require('path');
    var dateUtils = require('../../utility/dateUtils');
    var envConsts = require('./environmentConstants');
    var routeGroups = require('../../routes/routeGroups');
    var clientConsts = require('./clientConsts');

    var client = clientConsts.REACT;

    // we need to determine dynamically what port was opened with route53 shell script in core during jenkins build
    // so we add 8080 + executor number (which is what the shell script does to ensure uniqueness)
    var javaHostPort = 8080 + Number(process.env.EXECUTOR_NUMBER);
    var javaHost = 'http://quickbase-dev.com:' + javaHostPort;
    // same thing with node so we don't have colliding ports
    var nodeHostPort = 9000 + Number(process.env.EXECUTOR_NUMBER);
    var nodeHost = 'http://quickbase-dev.com:' + nodeHostPort;

    // For the e2e try job we want to connect to an integration instance of Tomcat. If we set the env var in Jenkins
    // then use that otherwise default to the above
    if (process.env.JAVA_HOST) {
        javaHost = process.env.JAVA_HOST;
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

        //Express Server
        //DOMAIN: 'https://quickbase-dev.com:9443'
        DOMAIN: nodeHost,

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

        // walkme java script
        walkmeJSSnippet : ''

    };
}());
