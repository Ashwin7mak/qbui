// Test on CI specific configuration
// ===========================

(function() {
    'use strict';

    //var path = require('path');
    var dateUtils = require('../../components/utility/dateUtils');
    var envConsts = require('./environmentConstants');
    var routeGroups = require('../../routes/routeGroups');
    var clientConsts = require('./clientConsts');

    var client = clientConsts.REACT;

    //we need to determine dynamically what port was opened with route53 shell script in core during jenkins build
    //so we add 8080 + exectutor number (which is what the shell script does to ensure uniqueness)
    var javaHostPort = 8080 + Number(process.env.EXECUTOR_NUMBER);

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
        //javaHost: 'https://quickbase-dev.com:8443',
        javaHost: 'http://quickbase-dev.com:' + javaHostPort,

        //Express Server
        //DOMAIN: 'https://quickbase-dev.com:9443'
        DOMAIN: 'http://quickbase-dev.com:9000',

        //Node understanding of RuntimeEnvironment
        env       : envConsts.TEST,

        //Node's understanding of a grouping of routes to be enabled/disabled
        routeGroup: routeGroups.DEBUG,

        //set notHotLoad true to disable hotloading
        noHotLoad : true,

        // the client to use
        client: client,

        // walkme java script
        walkmeJSSnippet : 'https://cdn.walkme.com/users/897ca46385a543cbbeaffbc655cdf312/test/walkme_897ca46385a543cbbeaffbc655cdf312_https.js'

    };
}());
