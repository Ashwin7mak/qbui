(function () {
    'use strict';

    // Environment specific configurations extend these defaults
    var _ = require('lodash'),
        path = require('path'),
        envConsts = require('./environmentConstants'),
        all = {
            // Root path of server
            root: path.normalize(__dirname + '/../../..'),

            // Server port
            port: 9000,
            sslPort: 9443,

            //  configure to empty...require explicit environment override to offer ssl
            SSL_KEY: {
                private: '',
                cert: '',
                requireCert: false
            },

            // Secret for session, you will want to change this and make it an environment variable
            secrets: {
                session: 'projects-secret'
            },

            // api rest server endpoints...environments must configure
            javaHost: '',

            // when starting up express server, fork as many listener forks as there are cpu cores.
            forkWorkers: false
        };


    // Export the config object based on the NODE_ENV
    // ==============================================
    module.exports = _.merge(
        all,
        require('./' + process.env.NODE_ENV + '.js') || {}
    );

}());
