(function() {
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

    //  one logger per node instance
    var appLogger;

    module.exports = {

        /**
         *  Initialize the Bunyan logger.
         */
        initLogger: function() {
            appLogger = undefined;
        },

        /**
         * Return a Bunyan logger based on the environment configuration.
         *
         * @returns {*}
         */
        getLogger: function() {

            //  Return the configured Bunyan logger.  A new logger will be configured if one is not
            //  found, otherwise the existing configured logger is returned.
            if (!appLogger) {
                var name = getConfig('name', 'qbse-node');
                var level = getConfig('level', 'info');
                var src = getConfig('src', false);
                var stream = getStream();

                var logger = bunyan.createLogger({
                    name       : name,
                    streams    : [stream],
                    level      : level,
                    src        : src,
                    serializers: bunyan.stdSerializers
                });

                // add custom qbse specific properties
                appLogger = logger.child({
                    //  put properties here..
                });

                /**
                 * Custom functions for logging request info
                 *
                 * @param req - http request object
                 * @param callingFunc -- optional parameter to identify the calling function/src file
                 */
                appLogger.logRequest = function(req, callingFunc) {
                    if (callingFunc) {
                        appLogger.info({Request: getReqInfo(req), CallFunc: getCallFunc(callingFunc)});
                    } else {
                        appLogger.info({Request: getReqInfo(req)});
                    }

                };

                /**
                 * Custom functions for logging request and response info
                 *
                 * @param req - http request object
                 * @param res - http response object
                 * @param callingFunc -- optional parameter to identify the calling function/src file
                 */
                appLogger.logResponse = function(req, res, callingFunc) {
                    if (callingFunc) {
                        appLogger.info({Request: getReqInfo(req), Response: getResInfo(res), CallFunc: getCallFunc(callingFunc)});
                    } else {
                        appLogger.info({Request: getReqInfo(req), Response: getResInfo(res)});
                    }
                };
            }

            return appLogger;

        }
    };

    /**
     * Extract from the request a standard set of information to display in a log message.
     * Currently, the request path, request method, sid(session id) and tid(transaction id) is extracted.
     *
     * @param req
     */
    function getReqInfo(req) {
        var r = {};
        try {
            if (req) {
                r.path = req.path;

                var url = req.url;
                var indx = url.indexOf('?');
                r.params = indx > 0 ? url.substr(indx + 1) : '';

                r.method = req.method;

                //  extract tid and bsid from request header
                if (req.headers) {
                    //  individual transaction id
                    if (req.headers.tid) {
                        r.tid = req.headers.tid;
                    }
                    //  session id
                    if (req.headers.sid) {
                        r.sid = req.headers.sid;
                    }
                }

                //  extract browser info
                if (req.useragent) {
                    r.useragent = req.useragent.browser + ' ' + req.useragent.version + ' - ' + req.useragent.os;
                }
            }
        } catch (e) {
            //  catch exception and move on..
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
        try {
            if (res) {
                r.status = res.statusCode;
            }
        } catch (e) {
            // catch exception and move on..
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
                } else {
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

        //  it's not in one of the expected folders..
        return '';
    }


}());
