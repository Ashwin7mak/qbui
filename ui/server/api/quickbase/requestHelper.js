(function () {
    'use strict';

    var fs = require('fs');
    /*
     * We can't use JSON.parse() with records because it is possible to lose decimal precision as a
     * result of the JavaScript implementation of its single numeric data type. In JS, all numbers are
     * 64 bit floating points where bits 0-51 store values, bits 52-62 store the exponent and
     * bit 63 is the sign bit. This is the IEEE 754 standard. Practically speaking, this means
     * that a java Long, which uses all bits 0-62 to store values, cannot be expressed in a JS
     * number without a loss of precision.  For this reason, we use a special implementation of
     * JSON.parse/stringify that depends on an implementation of BigDecimal, which is capable of
     * expressing all the precision of numeric values we expect to get from the java capabilities
     * APIs.  This is slower than using JSON.parse/stringify, but is necessary to avoid the loss
     * of precision. For more info, google it!
     */
    var jsonBigNum = require('json-bignum');
    module.exports = function (config) {

        var helper = {
            isGet: function (req) {
                return req.method.toLowerCase() === "get";
            },
            isPost: function (req) {
                return req.method.toLowerCase() === "post";
            },
            isPut: function (req) {
                return req.method.toLowerCase() === "put";
            },
            isDelete: function (req) {
                return req.method.toLowerCase() === "delete";
            },
            isSecure: function (req) {
                return req.protocol.toLowerCase() === "https";
            },
            getRequestUrl: function (req) {
                return config.javaHost + req.url;
            },

            getAgentOptions: function (req) {
                var agentOptions = {
                    rejectUnauthorized: false
                };

                if (this.isSecure(req)) {
                    //  we're on https..include the certs
                    // TODO: verify a signed certificate works as expected
                    agentOptions = {
                        strictSSL: true,
                        key: fs.readFileSync(config.SSL_KEY.private),
                        cert: fs.readFileSync(config.SSL_KEY.cert),
                        rejectUnauthorized: config.SSL_KEY.requireCert
                    };
                }
                return agentOptions;
            },

            //Given an express response object and POJO, copy POJO attributes to the response headers object
            copyHeadersToResponse: function (res, headers) {
                for(var key in headers) {
                    if(headers.hasOwnProperty(key)) {
                        res.set(key, headers[key]);
                    }
                }
            },

            //TODO: remove this
            getHeaders: function (req) {
                // unit tests currently fail if passing in headers on get..
                // TODO: this shouldn't be a restriction..understand why and fix??
                var headers = {};
                if (!this.isGet(req) && !this.isDelete(req)) {
                    headers = req.headers;
                }
                return headers;
            },

            setBodyOption: function (req, opts) {
                //  body header option only valid for put and post
                if (this.isPut(req) || this.isPost(req)) {
                    opts.body = req.rawBody;
                }
                return opts;
            },

            setOptions: function (req) {
                var opts = {
                    url: this.getRequestUrl(req),
                    method: req.method,
                    agentOptions: this.getAgentOptions(req),
                    headers: req.headers
                };

                this.setBodyOption(req, opts);

                return opts;
            },

            logRoute: function (req) {
                // TODO: move to a server logging class
                console.log("ROUTE: " + req.route.path + "; URL: " + this.getRequestUrl(req) + "; METHOD: " + req.method);
            }

        };

        return helper;
    };

}());
