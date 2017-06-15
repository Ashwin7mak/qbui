(function() {
    'use strict';

    var dateUtils = require('../../utility/dateUtils');
    var envConsts = require('./environmentConstants');
    var routeGroups = require('../../routes/routeGroups');
    var clientConsts = require('./clientConsts');
    var client = clientConsts.REACT;

    var baseVars = {
        LOG: {
            name: 'UI',
            level: 'info',
            stream: {
                type: 'file',
                file: {
                    dir: '/var/log/qbase',
                    name: 'ui-sys.log'
                }
            },
            src: false
        },
        DOMAIN: 'https://ui:9443',
        SSL_KEY: {
            private: '/dev/shm/secrets/nodejs.key',
            cert: '/dev/shm/secrets/nodejs.crt'
        },
        javaHost: 'https://core:8443',
        eeHost: 'https://ee:8443',
        eeHostEnable: true,
        isMockServer: false,
        legacyBase: '.currentstack-int.quickbaserocks.com',
        env: envConsts.PRODUCTION,
        isClientPerfTrackingEnabled: true,
        routeGroup: routeGroups.LH_V1,
        noHotLoad: true,
        client: client,
        wistiaScriptPart1: '',
        wistiaScriptPart2: '',
    };

    module.exports = Object.assign({}, baseVars, process.env);
}());
