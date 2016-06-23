(function() {
    'use strict';

    let fs = require('fs');
    let uuid = require('uuid');
    let Promise = require('bluebird');
    let defaultRequest = require('request');
    let log = require('../../logger').getLogger();
    let perfLogger = require('../../perfLogger');

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
            getRequestUrl  : function(req) {
                return config.javaHost + req.url;
            },
            getAgentOptions: function(req) {
                var agentOptions = {
                    rejectUnauthorized: false
                };

                if (this.isSecure(req)) {
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
             * Add rawBody data to the submitted options object for put and post requests
             *
             * @param req
             * @param opts
             * @returns {*}
             */
            setBodyOption: function(req, opts) {
                //  body header option only valid for put and post
                if (this.isPut(req) || this.isPatch(req) || this.isPost(req)) {
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

                this.setUserIdHeader(req);

                if (config.isMockServer) {
                    opts.gzip = false;
                    opts.headers["accept-encoding"] = "";
                }
                if (config.proxyHost) {
                    opts.host = config.proxyHost;
                    if (config.proxyPort) {
                        opts.port  = config.proxyPort;
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
             * Get the user ID from our ticket and set on the request object for logging.
             *
             * @param req
             * @returns req
             */
            setUserIdHeader: function(req) {
                var userId = "";
                if (req && req.headers.cookie && !req.userId) {
                    userId = this.ob32decoder(this.breakTicketDown(req.headers.cookie, 2));
                }
                req.userId = userId;
                return req;
            },

            /**  final String ticket = this.currentTicketVersion + "_" + ob32When + "_" + ob32UserID + "_" + ob32RealmID + "_" + ob32UserTicketVersion + "_" + digest;
             * A ticket is made up of 6 sections
             * 0) current ticket version
             * 1) ob32 encoded time in milliseconds when ticket expires
             * 2) ob32 encoded userId
             * 3) ob32 encoded realmId
             * 4) ob32 encoded user Ticket Version
             * 5) sha256 digest value (refer to createTicket in QBTicket.java for more information)
             *
             * @param fullTicket: the complete ticket as stored in the req.headers object
             * @param section: the section of the ticket you want to return
             * @returns {*}
             */
            breakTicketDown: function(fullTicket, section) {
                var ticket = fullTicket.replace("ticket=","");
                var ticketSections = ticket.split("_");
                return ticketSections[section];
            },

            /**
             * Decode a ob32 encoded string
             *
             * @param ticket
             * @return userId
             */
            ob32decoder: function(ob32string) {
                var ob32Characters = "abcdefghijkmnpqrstuvwxyz23456789";
                var decoded = 0;
                var place = 1;
                for (var counter = ob32string.length -1; counter >= 0; counter--) {
                    var oneChar = ob32string.charAt(counter);
                    var oneDigit = ob32Characters.indexOf(oneChar);
                    decoded += (oneDigit * place);
                    place = place*32;
                }
                return decoded;
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
                            this.setUserIdHeader(req);
                        }
                    } else {
                        this.setTidHeader(req);
                        this.setUserIdHeader(req);
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
            }
        };

        return helper;
    };

}());
