const log = require('./logger').getLogger();
const request = require('request');
const tracing = require('./tracingProvider');

function RequestClient(requestClientConfig) {
    return {
        /**
         * Centralized request provider that will provide either a tracing (instrumented)
         * request client or a standard request client to the caller based on the provided
         * configuration.
         *
         * Client modules can choose to either continue to directly require the
         * standard request module where tracing is not needed (during test calls,
         * for instance) or to instead require this module and pass in config that
         * will explicitly enable or disable tracing for external HTTP requests.
         *
         * @returns {*|request} - http client
         */
        provideClient() {
            let client;
            const tracingEnabled = require('./utility/configUtils').parseBooleanConfigValue(requestClientConfig.tracingEnabled);

            if (tracingEnabled) {
                client = tracing.getTracingRequestClient();
                log.info("Tracing client enabled");
            } else {
                client = request;
                log.info("Standard request client enabled");
            }

            return client;
        }
    };
}

module.exports = {
    /**
     * Read in the provided configuration and provide back a request client.
     *
     * @param config - provided configuration, typically from the app environment
     *
     * @returns {*|request} - standard or instrumented HTTP client, depending on configuration
     */
    getClient(config) {
        const requestClient = new RequestClient(config);

        return requestClient.provideClient();
    }
};
