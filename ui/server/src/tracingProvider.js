(function() {
    const log = require('./logger').getLogger();
    const Promise = require('bluebird');
    const dns = require('dns');
    const asyncDns = Promise.promisifyAll(dns);

    function TracingProvider(tracingConfig) {
        return {
            /**
             * Given a hostname, perform a DNS lookup and return an IP for the tracing forwarder (typically an
             * X-Ray container). This is here to work around a bug with the AWS X-Ray SDK in which it will only
             * accept IPv4-formatted addresses to set the tracing forwarder's destination for our app.
             *
             * This may be removed in the future if their SDK is re-designed to be more permissive toward configuring
             * the tracing forwarder.
             *
             * @param hostname
             * @returns {*|AWSXRay}
             */
            initTracingMiddleware() {
                const xray = require('aws-xray-sdk');

                try {
                    asyncDns.resolve4Async(tracingConfig.tracingHost).then(function(addresses) {
                        xray.setDaemonAddress(addresses[0]);
                    }).catch(error => {
                        log.error(error, "DNS didn't resolve during X-Ray middleware setup");
                    });

                    xray.setLogger(log);
                    xray.setContextMissingStrategy("LOG_ERROR");
                } catch (e) {
                    log.error(e, "X-Ray middleware failed to initialize");
                }

                return xray;
            },

            /**
             * Configures the X-Ray SDK middleware.
             *
             * This is module-private so that the tracing implementation is kept separate from the
             * provider of the tracing middleware.
             *
             * @returns {*|AWSXRay} - configured AWS X-Ray middlware
             */
            provideTracingMiddleware() {
                const filter = this.initTracingMiddleware();

                return filter;
            }
        };
    }

    module.exports = {
        /**
         * Configure and return tracing middleware.
         *
         * @param config - provided configuration, typically from the app environment
         *
         * @returns {*|AWSXRay|*} Express middleware
         */
        getTracingMiddleware(config) {
            return new TracingProvider(config).provideTracingMiddleware();
        },

        /**
         * Return a custom request object that has been instrumented to trace all outgoing HTTP requests.
         * This workaround and the custom fork of the request module's entrypoint is necessary given current
         * constraints in the AWS X-Ray instrumentation that require the standard lib's http module
         * to be wrapped directly by their SDK.
         *
         * @returns {*|request} - instrumented HTTP client
         */
        getTracingRequestClient() {
            return require('../../qb_lib/request');
        }
    };
}());
