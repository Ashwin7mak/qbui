(function() {
    'use strict';

    const dateUtils = require('../../utility/dateUtils');
    const envConsts = require('./environmentConstants');
    const routeGroups = require('../../routes/routeGroups');
    const clientConsts = require('./clientConsts');
    const client = clientConsts.REACT;

    const baseConfig = {
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
        sharedSecret: 'e4d1d39f-3352-474e-83bb-74dda6c4d8d7', // This is the dev key. A different key is generated in prod/int
    };

    module.exports = Object.assign({}, baseConfig, process.env);
}());
