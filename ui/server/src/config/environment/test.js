// Test on CI specific configuration. Currently used in CI try jobs.
// ===========================

(function() {
    'use strict';

    //var path = require('path');
    const dateUtils = require('../../utility/dateUtils');
    const envConsts = require('./environmentConstants');
    const routeGroups = require('../../routes/routeGroups');
    const clientConsts = require('./clientConsts');
    const random = require('lodash').random;

    const client = clientConsts.REACT;

    // we need to determine dynamically what port was opened with route53 shell script in core during jenkins build
    // so we add 8080 + executor number (which is what the shell script does to ensure uniqueness)
    let javaHost = 'http://quickbase-dev.com';
    let eeHost = 'http://quickbase-dev.com';
    // same thing with node so we don't have colliding ports
    let nodeHostPort = 9000 + random(0, 99);
    let nodeHost = 'http://quickbase-dev.com:' + nodeHostPort;
    let eeHostEnable = true;
    let automationsHost = 'http://quickbase-dev.com';

    // For the e2e try job we want to connect to an integration instance of Tomcat. If we set the env var in Jenkins
    // then use that otherwise default to the above
    if (process.env.JAVA_HOST) {
        javaHost = process.env.JAVA_HOST;
    }
    if (process.env.EE_HOST) {
        eeHost = process.env.EE_HOST;
    }
    if (process.env.WE_HOST) {
        automationsHost = process.env.WE_HOST;
    }

    if (!eeHostEnable) {
        eeHost = javaHost;
    }

    const baseConfig = {

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

        //host for Workflow Engine service
        automationHost: automationsHost,

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


        /**
         * Override master.featureSwitches by overriding specific features in
         * ci.override.featureSwitches.json.
         * Note: Feature Switches are overridden based on their names, ensure overrides
         * have same name including spacing.
         */
        // featureSwitchConfigOverride: '../../config/environment/featureSwitch/ci.override.featureSwitches.json',
        // masterOverrideTurnFeaturesOn:true,

        // A shared secret for hitting private APIs on Core. Used for running dataGen and E2E tests locally.
        sharedSecret: null, // Key should be generated and set as part of the jenkins job
    };

    module.exports = Object.assign({}, baseConfig, process.env);

}());
