const request = require('request');
const promise = require('bluebird');
const assert = require('assert');
const url = require('url');
const log = require('../../../server/src/logger').getLogger();
const config = require('../../../server/src/config/environment/');
const userDefVars = require('../config/userDefVars');
const sysDefVars = require('../config/sysDefVars');
const utils = require('./utils');
const requestUtils = require('../../../server/src/utility/requestUtils');


module.exports = {
    /**
     * Legacy HTTP client: postRequest
     * @param hostname - realm/subdomain name
     * @param app - app type: main or app
     * @param action - api method
     * @param body - request body
     * @param urlParams - extra parameters
     * @param userCredentials - JSON object
     * @param isJSON - is the response in JSON
     * @returns HTTP response
     */
    postRequest(hostname = 'www', app = 'app', action = '', body = null, urlParams = '', userCredentials = '', isJSON = false) {
        let tries = userDefVars.NUM_RETRIES;
        if (action === '') {
            throw ("No action was passed in. Could not continue the postRequest.");
        }
        let opts = {
            url: utils.constructURL(hostname, app, action, urlParams, userCredentials),
            method: 'POST',
            body: body ? utils.constructBody(body) : '',
            headers: {'Content-Type': isJSON ? 'application/json' : 'application/xml'}
        };
        return new promise((resolve, reject) => {
            try {
                request(opts, (error, response) => {
                    if (error || !(requestUtils.wasRequestSuccessful(response.statusCode))) {
                        // These specific errors were due to an environment issue in Jenkins that we needed to check for and retry
                        if (tries > 1 && this.shouldRetry(error)) {
                            tries--;
                            log.debug('Attempting a retry: ' + JSON.stringify(opts) + ' Tries remaining: ' + tries);
                            legaceHTTPClient(opts, tries).then(response2 => {
                                log.debug('Success following retry/retries');
                                resolve(response2);
                            }).catch(err2 => {
                                log.debug('Failure after retries');
                                reject(err2);
                            });
                        } else {
                            this.logError(error, response);
                        }
                    } else {
                        resolve(response);
                    }
                });
            } catch (ex) {
                log.debug(ex);
            }
        });
    },
    /**
     * Check the error code to determine if should retry
     * @param error
     * @returns {boolean}
     */
    shouldRetry(error) {
        return error && (error.code === sysDefVars.ERROR_HPE_INVALID_CONSTANT || error.code === sysDefVars.ERROR_ENOTFOUND);
    },
    /**
     * Log pretty error message if retry fails
     * @param error
     * @param response
     * @returns {*}
     */
    logError(error, response) {
        // We need to handle if we get an error back from the network call (for example a 'ECONNREFUSED 127.0.0.1:8081' error)
        // Or if we get an API response back but with a non 200 status code
        let errorMsg = error ? JSON.stringify(error) : '';
        let responseMsg = response ? 'Response statusCode: ' + response.statusCode + ', body: ' + response.body : '';

        // Nice logging for Node output
        log.error(`Network request failed, no retries left or an unsupported error for retry found ${JSON.stringify(opts)}`);
        log.error(`Unknown failure mode. ${errorMsg} ${responseMsg}`);

        // Return whatever kind of object we get back for the test frameworks to do validation with
        if (error) {
            return reject(error);
        } else {
            return reject(response);
        }
    }
};

