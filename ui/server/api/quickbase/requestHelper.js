(function() {
    'use strict';

    var fs = require('fs');
    var uuid = require('uuid');

    module.exports = function(config) {

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
                var opts = {
                    url         : this.getRequestUrl(req),
                    method      : req.method,
                    agentOptions: this.getAgentOptions(req),
                    headers     : req.headers
                };

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
             * If the request header does not include a transactionId (TID),
             * generate a transaction ID (uuid.v1) and set on the request header.
             *
             * @param req
             * @returns req
             */
            setTidHeader: function(req) {
                var headers = {};
                if (req && req.headers) {
                    headers = req.headers;
                }
                //  if no tid, generate one
                if (!headers.tid) {
                    headers.tid = uuid.v1();
                }
                req.headers = headers;
                return req;
            }

        };

        return helper;
    };

}());
