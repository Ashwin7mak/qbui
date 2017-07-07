// Development specific configuration
// ===========================

(function() {
    'use strict';

    //var path = require('path');
    const dateUtils = require('../../utility/dateUtils');
    const envConsts = require('./environmentConstants');
    const routeGroups = require('../../routes/routeGroups');
    const clientConsts = require('./clientConsts');

    const baseConfig = {

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

        legacyBase: '',

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


        /**
         * Override master.featureSwitches by overriding specific features in
         * local.override.featureSwitches.json.sample.
         * Note: Feature Switches are overridden based on their names, ensure overrides
         * have same name including spacing.
         */
        // featureSwitchConfigOverride: '../../config/environment/featureSwitch/local.override.featureSwitches.json.sample',
        //masterOverrideTurnFeaturesOn:true,

        // A shared secret for hitting private APIs on Core. Used for running dataGen and E2E tests locally
        sharedSecret: 'e4d1d39f-3352-474e-83bb-74dda6c4d8d7', // This is the dev key. A different key is generated in prod/int
    };

    module.exports = Object.assign({}, baseConfig, process.env);

}());
