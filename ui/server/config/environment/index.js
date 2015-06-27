(function () {
    'use strict';

    // Environment specific configurations extend these defaults
    var _ = require('lodash'),
        path = require('path'),
        fs = require('fs'),
        all = {
            env: process.env.NODE_ENV,

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

    //  Need to have a run-time environment configured
    if (!all.env) {
        throw new Error('Missing environment configuration.  You must set a run-time environment variable(i.e. NODE_ENV=local).');
    }

    /**
     * Method to determine if ssl properties are configured
     * returns true if there is an SSL_KEY in the configuration
     * and that has non-zero lenght vales for SSL_KEY.private
     * and SSL_KEY.cert
     *
     * if they are not configured SSL won't be forced
     * useful for development mode, the SSL info will be
     * configured for production/aws
     *
    **/
    all.hasSslOptions = function() {
        var answer = false;
        var sslCfg = this.SSL_KEY;
        if (sslCfg &&
            sslCfg.private && sslCfg.private.length &&
            sslCfg.cert && sslCfg.cert.length) {
            answer = true;
        }
        return answer;
    };

    // Export the config object based on the NODE_ENV
    // ==============================================
    var config = all;

    // if there is a config file for the NODE_ENV
    // merge in its properties to the defaults in all
    if (fs.existsSync('./' + process.env.NODE_ENV + '.js') ) {
       config =  _.merge(
            all,
            require('./' + process.env.NODE_ENV + '.js') || {}
        );
    }

    module.exports = config;

}());
