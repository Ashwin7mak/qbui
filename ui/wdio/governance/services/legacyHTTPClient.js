const request = require('request');
const promise = require('bluebird');
const assert = require('assert');
const url = require('url');
const log = require('../../../server/src/logger').getLogger();
const config = require('../../../server/src/config/environment/');
const userDefVars = require('../config/userDefVars');
const utils = require('./utils');
let ERROR_HPE_INVALID_CONSTANT = 'HPE_INVALID_CONSTANT';
let ERROR_ENOTFOUND = 'ENOTFOUND';
let server = '.currentstack-int.quickbaserocks.com';

/**
 * Legacy HTTP client: postRequest
 * @param hostname - reaml name
 * @param app - app type: main or app
 * @param action - api method
 * @param body - request body
 * @param urlParams - extra paramenters
 * @param username - username
 * @param password - password
 * @param isJSON - is the response in JSON
 * @returns HTTP response
 */
module.exports = {
    postRequest(hostname, app, action, body, urlParams, username, password, isJSON) {
        let tries = userDefVars.NUM_RETRIES;
        let reqURL = "";
        let contTypeValue = 'application/xml';
        if (isJSON) {
            contTypeValue = 'application/json';
        }
        if (body) {
            body = utils.constructBody(body);
        }
        reqURL = utils.constructURL(hostname, app, action, urlParams, username, password);
        let opts = {
            url: reqURL,
            method: 'POST',
            body: body,
            headers: {'Content-Type': contTypeValue}
        };
        return new promise((resolve, reject) => {
            try {
                request(opts, (error, response) => {
                    let statusCode = response.statusCode;
                    if (error || !(statusCode >= 200 && statusCode < 300)) {
                        // These specific errors were due to an environment issue in Jenkins that we needed to check for and retry
                        if (tries > 1 && error && (error.code === ERROR_HPE_INVALID_CONSTANT || error.code === ERROR_ENOTFOUND)) {
                            tries--;
                            log.debug('Attempting a retry: ' + JSON.stringify(opts) + ' Tries remaining: ' + tries);
                            legaceHTTPClient(opts, tries).then(res2 => {
                                log.debug('Success following retry/retries');
                                resolve(res2);
                            }).catch(err2 => {
                                log.debug('Failure after retries');
                                reject(err2);
                            });
                        } else {
                            // We need to handle if we get an error back from the network call (for example a 'ECONNREFUSED 127.0.0.1:8081' error)
                            // Or if we get an API response back but with a non 200 status code
                            let errorMsg = error ? JSON.stringify(error) : '';
                            let responseMsg = response ? 'Response statusCode: ' + response.statusCode + ', body: ' + response.body : '';

                            // Nice logging for Node output
                            log.error('Network request failed, no retries left or an unsupported error for retry found ' + JSON.stringify(opts));
                            log.error(`Unknown failure mode. ${errorMsg} ${responseMsg}`);

                            // Return whatever kind of object we get back for the test frameworks to do validation with
                            if (error) {
                                return reject(error);
                            } else {
                                return reject(response);
                            }
                        }
                    } else {
                        resolve(response);
                    }
                });
            } catch (ex) {
                log.debug(ex);
                console.log(ex);
            }
        });
    }
}

