(function() {
    'use strict';

    let fs = require('fs');
    let uuid = require('uuid');
    let Promise = require('bluebird');
    let defaultRequest = require('request');
    let log = require('../../logger').getLogger();
    let perfLogger = require('../../perfLogger');
    let url = require('url');

    module.exports = function(config) {
        let request = defaultRequest;
        /**
         * Set of common methods used to parse out information from the http request object
         */
        var helper = {

            isGet          : function(req) {
                return req.method.toLowerCase() === 'get';
            },
            isPost         : function(req) {
                return req.method.toLowerCase() === 'post';
            },
            isPut          : function(req) {
                return req.method.toLowerCase() === 'put';
            },
            isPatch        : function(req) {
                return req.method.toLowerCase() === 'patch';
            },
            isDelete       : function(req) {
                return req.method.toLowerCase() === 'delete';
            },
            isSecure       : function(req) {
                return req.protocol ? req.protocol.toLowerCase() === 'https' : false;
            },
            getRequestJavaHost: function() {
                return config ? config.javaHost : '';
            },
            getRequestUrl  : function(req) {
                return config ? config.javaHost + req.url : '';
            },
            getAgentOptions: function(req) {
                var agentOptions = {
                    rejectUnauthorized: false
                };

                if (this.isSecure(req) && config) {
                    //  we're on https..include the certs
                    agentOptions = {
                        strictSSL         : true,
                        key               : fs.readFileSync(config.SSL_KEY.private),
                        cert              : fs.readFileSync(config.SSL_KEY.cert),
                        rejectUnauthorized: config.SSL_KEY.requireCert
                    };
                }
                return agentOptions;
            },

            /**
             * Given an express response object and POJO, copy POJO attributes to the response headers object
             *
             * @param res
             * @param headers
             */
            copyHeadersToResponse: function(res, headers) {
                for (var key in headers) {
                    if (headers.hasOwnProperty(key)) {
                        res[key] = headers[key];
                    }
                }
            },

            /**
             * Add rawBody data to the submitted options object for put, post, patch and delete requests
             *
             * @param req
             * @param opts
             * @returns {*}
             */
            setBodyOption: function(req, opts) {
                //  body header option valid for all verbs EXCEPT 'get'.
                if (!this.isGet(req)) {
                    opts.body = req.rawBody;
                }
                return opts;
            },

            /**
             * Set common shared request attributes on the server request
             *
             * @param req
             * @returns request object used when submitting a server request
             */
            setOptions: function(req) {

                this.setTidHeader(req);

                var opts = {
                    url         : this.getRequestUrl(req),
                    method      : req.method,
                    agentOptions: this.getAgentOptions(req),
                    headers     : req.headers
                };

                if (config) {
                    if (config.isMockServer) {
                        opts.gzip = false;
                        opts.headers["accept-encoding"] = "";
                    }
                    if (config.proxyHost) {
                        opts.host = config.proxyHost;
                        if (config.proxyPort) {
                            opts.port = config.proxyPort;
                        }
                    }
                }

                this.setBodyOption(req, opts);

                return opts;
            },

            /**
             * Generate a transaction ID (uuid.v1) and set on the request header.
             *
             * @param req
             * @returns req
             */
            setTidHeader: function(req) {
                var headers = {};
                if (req && req.headers) {
                    headers = req.headers;
                }
                headers.tid = uuid.v1();

                req.headers = headers;
                return req;
            },

            /**
             * Allows you to override the
             * @param requestOverride
             */
            setRequestObject: function(requestOverride) {
                request = requestOverride;
            },

            /**
             * Executes the http request. If the immediately resolve flag is set, resolve the deferred without making a call
             * @param req
             * @param opts
             * @param immediatelyResolve
             * @returns {*}
             */
            executeRequest: function(req, opts, immediatelyResolve) {

                //  if no tid on the header, add it now
                if (req) {
                    if (req.headers) {
                        if (!req.headers.tid) {
                            this.setTidHeader(req);
                        }
                    } else {
                        this.setTidHeader(req);
                    }
                }

                return new Promise((resolve, reject) =>{
                    if (immediatelyResolve) {
                        resolve();
                    } else {
                        let perfLog = perfLogger.getInstance();
                        perfLog.init("Execute Request", {req:opts});
                        request(opts, function(error, response) {
                            if (error) {
                                reject(new Error(error));
                            } else if (response.statusCode !== 200) {
                                reject(response);
                            } else {
                                resolve(response);
                            }
                            perfLog.log();
                        });
                    }
                });
            },

            /**
             * Log unexpected errors.
             *
             * @param func
             * @param error
             * @param includeStackTrace
             */
            logUnexpectedError: function(func, error, includeStackTrace) {
                if (error) {
                    log.error("Caught unexpected error in " + func + "; Error Message: " + error.message + (includeStackTrace ? "; Stack Trace:" + error.stack : ''));
                } else {
                    log.error("Caught unexpected error in " + func + "\nError Message: Unknown error...no error object defined");
                }
            },

            /**
             * Method to take a parameter value and name and add to the request.
             *
             * A parameter is appended only if both a parameter name and value are defined
             * and it is not already on the request with the exact value.
             *
             * @param req
             * @param parameterName
             * @param parameterValue
             */
            addQueryParameter: function(req, parameterName, parameterValue) {

                if (parameterName) {
                    //  does the parameter already exist
                    if (this.hasQueryParameter(req, parameterName)) {
                        // nothing to do if the parameter is already on the request
                        if (this.getQueryParameterValue(req, parameterName) === parameterValue) {
                            return;
                        } else {
                            // have a different value to use; remove the one on the request
                            this.removeRequestParameter(req, parameterName);
                        }
                    }

                    //  add the parameter
                    let search = url.parse(req.url).search;
                    if (search) {
                        req.url += '&';
                    } else {
                        req.url += '?';
                    }

                    //  append the query parameter to the url
                    req.url += parameterName + '=' + parameterValue;
                }
            },

            hasQueryParameter: function(req, parameterName) {
                if (!req || !parameterName) {
                    return false;
                }
                let query = url.parse(req.url, true).query;
                return (query && query.hasOwnProperty(parameterName));
            },

            getQueryParameterValue: function(req, parameterName) {
                if (!req || !parameterName) {
                    return null;
                }
                let query = url.parse(req.url, true).query;
                return (query && query.hasOwnProperty(parameterName)) ? query[parameterName] : null;
            },

            removeRequestParameter: function(req, parameterName) {
                if (this.hasQueryParameter(req, parameterName)) {
                    let startingIndex = req.url.indexOf(parameterName);
                    let endingIndex = req.url.indexOf('&', startingIndex);
                    if (endingIndex === -1) {
                        req.url = req.url.substr(0, startingIndex);
                    } else {
                        req.url = req.url.substr(0, startingIndex) + req.url.substr(endingIndex + 1);
                    }
                }
            }

        };

        return helper;
    };

}());
