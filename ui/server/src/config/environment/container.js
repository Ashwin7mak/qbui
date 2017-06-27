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
        DOMAIN: 'https://localhost:9443',
        SSL_KEY: {
            private: '/dev/shm/secrets/nodejs.key',
            cert: '/dev/shm/secrets/nodejs.crt'
        },
        ip: 'localhost',
        javaHost: 'https://localhost.int1-ecs.newstack.quickbaserocks.com',
        eeHost: 'https://api.int1-ecs.newstack.quickbaserocks.com',
        eeHostEnable: true,
        isMockServer: false,
        legacyBase: '.currentstack-int.quickbaserocks.com',
        env: envConsts.PRODUCTION,
        isClientPerfTrackingEnabled: true,
        routeGroup: routeGroups.LH_V1,
        noHotLoad: true,
        client: client,
        wistiaScriptPart1: 'https://fast.wistia.com/embed/medias/zl4za7cf5e.jsonp',
        wistiaScriptPart2: 'https://fast.wistia.com/assets/external/E-v1.js',
    };

    module.exports = Object.assign({}, baseVars, process.env);
}());
