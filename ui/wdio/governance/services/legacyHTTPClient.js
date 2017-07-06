/**
 * Legacy HTTP client api call
 */

let request = require('request');
let promise = require('bluebird');
let assert = require('assert');
let url = require('url');
// var legacyHTTPClient = require(./legacyHTTPClient);
let jsonBigNum = require('json-bignum');
let parser = require('xml2json');
// var config = require('../../server/src/config/environment');
let ERROR_HPE_INVALID_CONSTANT = 'HPE_INVALID_CONSTANT';
let ERROR_ENOTFOUND = 'ENOTFOUND';

module.exports = {
     postRequest(path, method, body, urlParameters, numRetries) {
        let tries = numRetries
        console.log('===> S1: in legaceHTTPClient, tries = ', tries);
        let opts = {
            url: path,
            method: 'POST',
            body: body,
            // headers: {'Content-Type':'text/plain'}
            headers: {'Content-Type': 'application/xml'}
        };
        return new promise(function (resolve, reject) {
            console.log('===> S2: in promise ***');
            try {
                request(opts, function (error, response) {
                    let statusCode = response.statusCode;
                    console.log('===> S3: in request ***');

                    if (error || !(statusCode >= 200 && statusCode < 300)) {
                        console.log('===> S3-2: in if (error)');
                        // These specific errors were due to an environment issue in Jenkins that we needed to check for and retry
                        if (tries > 1 && error && (error.code === ERROR_HPE_INVALID_CONSTANT || error.code === ERROR_ENOTFOUND)) {
                            tries--;
                            log.debug('Attempting a retry: ' + JSON.stringify(opts) + ' Tries remaining: ' + tries);
                            legaceHTTPClient(opts, tries).then(function (res2) {
                                log.debug('Success following retry/retries');
                                resolve(res2);
                            }).catch(function (err2) {
                                log.debug('Failure after retries');
                                reject(err2);
                            });
                        } else {
                            // We need to handle if we get an error back from the network call (for example a 'ECONNREFUSED 127.0.0.1:8081' error)
                            // Or if we get an API response back but with a non 200 status code
                            var errorMsg = error ? JSON.stringify(error) : '';
                            var responseMsg = response ? 'Response statusCode: ' + response.statusCode + ', body: ' + response.body : '';

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
                        console.log('===>  S3-1: in else (no error and 200OK) ****');
                        resolve(response);
                        // console.log('*****error:', error);
                        // console.log('*****statusCode:', statusCode);
                        // console.log('*****body:', response.body);
                    }
                });
            } catch (ex) {
                console.log(ex);
            }
        });
    }
}
// module.exports = new legaceHTTPClient();
