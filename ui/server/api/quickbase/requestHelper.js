(function () {
    'use strict';

    var fs = require('fs');

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
                    opts.body = JSON.stringify(req.body);
                }
                return opts;
            },

            setOptions: function (req) {
                var opts = {
                    url: this.getRequestUrl(req),
                    method: req.method,
                    agentOptions: this.getAgentOptions(req),
                    headers: this.getHeaders(req)
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
