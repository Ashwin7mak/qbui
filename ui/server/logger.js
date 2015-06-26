(function () {
    /*
    * Setup Bunyan logging configuration.
    *
    * The following environment configurations are available:
    *      name:   logger name
    *      level:  log level
    *      src:    include reference to source file in log message..FOR DEBUGGING PURPOSES...DO NOT SET TO TRUE IN PROD
    *      stream: output to std.out or a file. If sending to a file, define the path.
    *      In addition, if outputting to a file, can also setup to rotate the files per schedule.
    *          See: https://github.com/trentm/node-bunyan#stream-type-rotating-file
    */

    'use strict';

    var bunyan = require('bunyan');
    var config = require('./config/environment');
    var fs = require('fs');

    module.exports = {

        getLogger: function(callFunc) {

            //  setup the logger configuration.  Default configurations:
            //      name: qbse
            //      level: info
            //      src: false
            //      stream: console
            //
            var name = getConfig('name', 'qbse-node');
            var level = getConfig('level', 'info');
            var src = getConfig('src', false);
            var stream = getStream();

            var logger = bunyan.createLogger({
                name: name,
                streams: [stream],
                level: level,
                src: src,
                serializers: bunyan.stdSerializers
            });

            // add custom qbse specific properties
            var appLogger = logger.child({
                callingFunc: getCallFunc(callFunc)
            });

            //  custom functions for logging request and response info
            appLogger.logRequest = function (req) {
                try {
                    appLogger.info({Request: getReqInfo(req)}, 'Log Request');
                }
                catch (e) {} // don't want logging to stop the app
            };

            appLogger.logResponse = function (req, res) {
                try {
                    appLogger.info({Request: getReqInfo(req), Response: getResInfo(res)}, 'Log Response');
                }
                catch (e) {} // don't want logging to stop the app
            };

            return appLogger;

        }
    };

    /**
     * Extract from the request a standard set of information to display in a log message.
     * Currently, the request path, request method, cid(client id) and tid(transaction id) is extracted.
     *
     * @param req
     */
    function getReqInfo(req) {
        var r = {};
        if (req) {
            r.path = req.path;

            var url = req.url;
            var indx = url.indexOf('?');
            r.params = indx > 0 ? url.substr(indx+1) : '';

            r.method = req.method;

            //  extract tid and sid from request header
            if (req.headers) {
                //  individual transaction id
                if (req.headers.tid) { r.tid = req.headers.tid; }
                //  client session id
                if (req.headers.cid) { r.cid = req.headers.cid; }
            }

            //  extract browser info
            if (req.useragent) {
                r.useragent = req.useragent.browser + ' ' + req.useragent.version + ' - ' + req.useragent.os;
            }
        }
        return r;
    }

    /**
     * Extract from the response a standard set of information to display in a log message.
     * Currently, the response http status is extracted.
     *
     * @param req
     */
    function getResInfo(res) {
        var r = {};
        if (res) {
            r.status = res.statusCode;
        }
        return r;
    }

    /**
     * Return the bunyan configuration setting for the given key. If the key
     * is not defined, a default value(if any) is returned.
     *
     * @param logkey
     * @param defaultValue
     * @returns {*}
     */
    function getConfig(logkey, defaultValue) {
        var value = defaultValue;
        if (config && config.LOG) {
            if (typeof config.LOG[logkey] !== 'undefined') {
                value = config.LOG[logkey];
            }
        }
        return value;
    }

    /**
     * Return the configuration for how the log output is streamed (file vs. console)
     * @returns {*}
     */
    function getStream() {
        var stream = getConfig('stream');
        if (stream) {
            //  if of type file, setup to stream the output to a file
            if (stream.type === 'file' && stream.file) {
                var s = {};
                s.path = stream.file.dir ? stream.file.dir + '/' + stream.file.name : stream.file.name;
                if (stream.file.rotating) {
                    s.type = 'rotating-file';
                    s.period = stream.file.rotating.period;
                    s.count = stream.file.rotating.count;
                }
                else {
                    s.type = 'file';
                }

                //  ensure the logs directory exists
                if (stream.file.dir) {
                    if (!fs.existsSync(stream.file.dir)) {
                        fs.mkdirSync(stream.file.dir);
                    }
                }

                return s;
            }
        }

        //  no stream configuration...will default to console
        return {type: 'stream', stream: process.stdout};
    }

    /**
     * Returns the name of the function that is calling the loger to output a log
     * message.  Try to trim off the front portion of the file spec for readability.
     *
     * @param callFunc
     * @returns {*}
     */
    function getCallFunc(callFunc) {
        if (callFunc) {
            //  look for public(dist), client(dist/local) and server(local) folders
            var offset = callFunc.indexOf('/server/');
            if (offset === -1) {
                offset = callFunc.indexOf('/public/');
                if (offset === -1) {
                    offset = callFunc.indexOf('/client/');
                }
            }
            //  do we have something to trim
            if (offset !== -1) {
                return callFunc.substr(offset);
            }
        }
        return '';
    }


}());
