(function() {
    'use strict';

    let fs = require('fs');
    let uuid = require('uuid');
    let Promise = require('bluebird');
    let defaultRequest = require('request');
    let log = require('../../logger').getLogger();
    let perfLogger = require('../../perfLogger');
    let url = require('url');
    let consts = require('../../../../common/src/constants');

    module.exports = function(config) {
        let request = defaultRequest;
        /**
         * Set of common methods used to parse out information from the http request object
         */
        let helper = {

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
            getRequestEeHost: function() {
                return config ? config.eeHost : '';
            },
            getRequestAWSHost: function() {
                return config ? config.awsHost : '';
            },
            getRequestEeHostEnable: function() {
                return config ? config.eeHostEnable : '';
            },
            getRequestUrl  : function(req) {
                return config ? config.javaHost + req.url : '';
            },
            getRequestEEUrl  : function(req) {
                return config ? config.eeHost + req.url : '';
            },
            getLegacyHost : function() {
                return config ? config.legacyHost : '';
            },
            getAgentOptions: function(req) {
                let agentOptions = {
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
             * Construct a host reference from the req.header.host value.  This is
             * used when referencing a Quickbase legacy JBI endpoint.
             *
             * @param req
             * @param removePort
             * @param addSecureProtocol
             * @returns {*}
             */
            getRequestHost: function(req, removePort, addSecureProtocol) {
                let host = req && req.headers ? req.headers.host : '';
                if (host) {
                    // if requested, remove port if one is included
                    if (removePort) {
                        let portOffset = host.indexOf(':');
                        if (portOffset !== -1) {
                            host = host.substring(0, portOffset);
                        }
                    }
                    //  protocol is not included in the header.host, so if requested,
                    //  prepend https to the host.
                    if (addSecureProtocol) {
                        host = consts.PROTOCOL.HTTPS + host;
                    }
                }
                return host;
            },

            /**
             * Given an express response object and POJO, copy POJO attributes to the response headers object
             *
             * @param res
             * @param headers
             */
            copyHeadersToResponse: function(res, headers) {
                for (let key in headers) {
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
                if (!this.isGet(req) && !this.isGet(opts)) {
                    opts.body = req.rawBody;
                }
                return opts;
            },

            /**
             * Set the request attributes for an experience engine server request
             *
             * @param req
             * @param forceGet - Regardless of req method setting, always set to a get request
             * @returns request object used when submitting a server request
             */
            setExperienceEngineOptions: function(req, forceGet) {
                //  set the default request options
                let opts = this.setOptions(req, forceGet);

                //  override the url to use the experience engine
                opts.url = this.getRequestEEUrl(req);
                return opts;
            },

            /**
             * Set the request attributes for a core server request
             *
             * @param req
             * @param forceGet - Regardless of req method setting, always set to a get request
             * @returns request object used when submitting a server request
             */
            setOptions: function(req, forceGet) {

                this.setTidHeader(req);

                let opts = {
                    url         : this.getRequestUrl(req),
                    method      : (forceGet === true ? 'GET' : req.method),
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
                let headers = {};
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

                //get back json unless already specified
                if (typeof opts === 'undefined') {
                    opts = {};
                }
                if (typeof opts.headers === 'undefined') {
                    opts.headers = {};
                }
                if (typeof opts.headers[consts.ACCEPT] === 'undefined') {

                    opts.headers[consts.ACCEPT] = consts.APPLICATION_JSON;
                }

                req.headers = Object.assign({}, req.headers);
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

            /**
             * Does the request query have the supplied query parameter.  Return
             * true if found; otherwise false.
             *
             * @param req
             * @param parameterName
             * @returns {*}
             */
            hasQueryParameter: function(req, parameterName) {
                if (!req || !parameterName) {
                    return false;
                }
                let query = url.parse(req.url, true).query;
                return (query && Object.prototype.hasOwnProperty.call(query, parameterName));
            },

            /**
             * Examine the request url for the supplied query parameter name and
             * return the value if found.  If not found, null is returned.
             *
             * @param req
             * @param parameterName
             * @returns {*}
             */
            getQueryParameterValue: function(req, parameterName) {
                if (!req || !parameterName) {
                    return null;
                }
                let query = url.parse(req.url, true).query;
                return (query && Object.prototype.hasOwnProperty.call(query, parameterName)) ? query[parameterName] : null;
            },

            /**
             * Remove the parameter from the request.  If the parameter is not found, the
             * url is unchanged.
             *
             * @param req
             * @param parameterName
             */
            removeRequestParameter: function(req, parameterName) {
                if (this.hasQueryParameter(req, parameterName)) {
                    let startingIndex = req.url.indexOf(parameterName);
                    let endingIndex = req.url.indexOf('&', startingIndex);
                    if (endingIndex === -1) {
                        req.url = req.url.substr(0, startingIndex - 1);
                    } else {
                        req.url = req.url.substr(0, startingIndex) + req.url.substr(endingIndex + 1);
                    }
                }
            },

            isDisplayFormat: function(req) {
                return this.getQueryParameterValue(req, consts.REQUEST_PARAMETER.FORMAT) === consts.FORMAT.DISPLAY;
            },

            isRawFormat: function(req) {
                return this.getQueryParameterValue(req, consts.REQUEST_PARAMETER.FORMAT) === consts.FORMAT.RAW;
            }
        };

        return helper;
    };

}());
