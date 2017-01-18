// Development specific configuration
// ===========================

(function() {
    'use strict';

    //var path = require('path');
    var dateUtils = require('../../utility/dateUtils');
    var envConsts = require('./environmentConstants');
    var routeGroups = require('../../routes/routeGroups');
    var clientConsts = require('./clientConsts');

    module.exports = {

        //  Logging configuration
        LOG: {
            name  : 'qbse-dev',
            level : 'debug',
            stream: {
                type: 'console',         //  file or console
                file: {
                    dir : './logs',
                    name: 'qbse-dev-' + dateUtils.formatDate(new Date(), '%Y-%M-%D-%h.%m.%s') + '.log'
                }
            },
            src   : true               // this is slow...do not use in prod
        },

        // to run using ssl, copy the private key and cert for
        // your development host to ../server/src/config/environment/keys
        // folder...no keys defined equates to no SSL support.
        SSL_KEY: {
            private: '',
            cert   : ''
        },

        // allow for override of default ports
        port   : 9000,
        sslPort: 9443,

        //DEV REST endpoint (protocol,server,port)
        javaHost: '',
        eeHost: '',
        eeHostEnable: false,

        legacyHost: '',

        //DEV Express Server
        DOMAIN: '',

        env       : envConsts.TEST,
        routeGroup: routeGroups.DEBUG,

        //set notHotLoad true to disable hotloading
        noHotLoad : true,

        // the client to use
        client: clientConsts.REACT,

        /**
         * Scripts for Wistia video popover
         * They load script from a video hosting service called Wistia and allow the walk-through video to load as a popover
         */
        wistiaScriptPart1: '',
        wistiaScriptPart2: '',

    };
}());
