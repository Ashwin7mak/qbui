/**
 * `grunt-sauce-connect-launcher`
 *
 * Grunt task utilizing [sauce-connect-launcher](https://github.com/bermi/sauce-connect-launcher) to download and launch Sauce Labs [Sauce Connect](https://saucelabs.com/docs/connect).
 *
 * Copyright (c) 2014 Steffen Eckardt
 * Licensed under the MIT license.
 *
 * @see https://github.com/seckardt/grunt-sauce-connect-launcher
 * @see https://github.com/bermi/sauce-connect-launcher
 */
(function (grunt) {
    'use strict';
    var launcher = require('sauce-connect-launcher');
    var tunnel = {};
    var options = {};

    module.exports = {
        setOptions: function (ops) {
            options = ops;
        },
        open: function (callback) {
            tunnel.tid = options.tunnelIdentifier;
            var tunnelId = tunnel.tid,
                userName = options.username;
            console.log('Open'.cyan + ' Sauce Connect tunnel: ' + tunnelId.cyan);

            // Create base URL for Sauce Labs REST API calls
            tunnel.baseUrl = ['https://', userName, ':', options.accessKey, '@saucelabs.com', '/rest/v1/', userName].join('');

            launcher(options, function (err, process) {
                if (err) {
                    launcher.kill(function () {
                        err = err.error || (err.message || String(err));
                        return console.warn('Failed to open Sauce Connect tunnel: ' + err);
                    });
                }

                console.log('Opened'.green + ' Sauce Connect tunnel: ' + tunnelId.cyan);
                tunnel.process = process;
                callback();
            });
        },


        close: function (callback) {
            var request = require('request').defaults({jar: false, json: true}),
                _ = require('lodash'),
                q = require('q');

            function obtainMachine() {
                var deferred = q.defer();
                request.get(tunnel.baseUrl + '/tunnels?full=1', function (err, resp, body) {
                    if (err) {
                        return deferred.reject(err);
                    }

                    _.every(body, function (tunnelData) {
                        if (tunnelData && tunnelData.tunnel_identifier === tunnel.tid) {
                            deferred.resolve(tunnelData);
                            return false;
                        }
                        return true;
                    });

                    deferred.reject();
                });
                return deferred.promise;
            }

            function killMachine(tunnelData) {
                var deferred = q.defer(),
                    tunnelId = tunnelData.id || tunnel.tid;

                console.log('Stop'.cyan + ' Sauce Connect machine: ' + tunnelId.cyan);

                request.del(tunnel.baseUrl + '/tunnels/' + tunnelId, function (err, resp, body) {
                    if (err || !body || body.result !== true) {
                        console.log('Failed'.red + ' to stop Sauce Connect machine: ' + tunnelId.cyan);
                    } else {
                        console.log('Stopped'.green + ' Sauce Connect machine: ' + tunnelId.cyan);
                    }
                    deferred.resolve();
                });

                return deferred.promise;
            }

            function closeTunnel(proc) {
                return function () {
                    var deferred = q.defer();
                    proc.close(function () {
                        console.log('Closed'.green + ' Sauce Connect tunnel: ' + tunnel.tid.cyan);
                        deferred.resolve();
                    });
                    return deferred.promise;
                };
            }

            if (tunnel.process) {
                // Prevent double closing of the current tunnel process
                var proc = tunnel.process;
                delete tunnel.process;

                console.log('Close'.cyan + ' Sauce Connect tunnel: ' + tunnel.tid.cyan);

                obtainMachine()
                    .then(killMachine)
                    .then(closeTunnel(proc))
                    .fin(function () {
                        callback();
                    });
            } else {
                console.log('Close'.cyan + ' current Sauce Connect tunnel');
                launcher.kill(function () {
                    console.log('Closed'.green + ' current Sauce Connect tunnel');
                    callback();
                });
            }
        }
    }
}());