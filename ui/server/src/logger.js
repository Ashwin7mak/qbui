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
     *
     *     The log levels in bunyan are as follows. The level descriptions are best practice opinions of the author.
     *
     *      "fatal" (60): The service/app is going to stop or become unusable now. An operator should definitely look into this soon.
     *      "error" (50): Fatal for a particular request, but the service/app continues servicing other requests. An operator should look at this soon(ish).
     *      "warn" (40): A note on something that should probably be looked at by an operator eventually.
     *      "info" (30): Detail on regular operation.
     *      "debug" (20): Anything else, i.e. too verbose to be included in "info" level.
     *      "trace" (10): Logging from external libraries used by your app or very detailed application logging.
     */

    'use strict';

    let bunyan = require('bunyan');
    let config = require('./config/environment');
    let fs = require('fs');

    //  one logger per node instance
    let appLogger;
    let showBody = false;

    //  custom request serializer to include on all messages.  For example, log.info({req:req}, 'some message') will
    //  trigger the serializer and include the custom output on the message.
    function reqSerializer(req) {
        if (!req) {
            return {};
        }

        let headers = req.headers || {};
        let agent = req.useragent || {};
        let ip;

        //  try to get the ip address
        if (req.headers) {
            ip = req.headers['x-forwarded-for'];
        }
        if (!ip) {
            if (req.connection) {
                ip = req.connection.remoteAddress;
                if (!ip && req.connection.socket) {
                    ip = req.connection.socket.remoteAddress;
                }
            }
            if (!ip && req.socket) {
                ip = req.socket.remoteAddress;
            }
        }

        let obj = {};

        //  only include in log message if defined
        addElement(obj, 'method', req.method);
        addElement(obj, 'url', req.url);
        addElement(obj, 'host', headers.host);
        addElement(obj, 'sid', headers.sid);
        addElement(obj, 'tid', headers.tid);
        addElement(obj, 'referer', headers.referer);
        addElement(obj, 'browser', agent.source);
        addElement(obj, 'platform', agent.platform);
        addElement(obj, 'ip', ip);
        addElement(obj, 'userId', req.userId);

        // displaying body content in log output is dictated by log configuration setting
        if (showBody === true) {
            addElement(obj, 'body', req.body);
        }

        return obj;
    }

    //  custom response serializer to include on all messages.  For example, log.info({res:res}, 'some message') will
    //  trigger the serializer and include the custom output on the message.
    function resSerializer(res) {
        let obj = {};

        addElement(obj, 'statusCode', res.statusCode);
        addElement(obj, 'statusMessage', res.statusMessage);
        addElement(obj, 'message', res.message);

        // displaying body content in log output is dictated by log configuration setting
        if (showBody === true) {
            addElement(obj, 'body', res.body);
        }
        return obj;
    }

    //  Helper method to add an element to the supplied array obj
    //  only when the element has content.
    function addElement(obj, objName, value) {
        if (value) {
            if (typeof value === 'string') {
                obj[objName] = value.replace(/"/g, "'");
            } else {
                obj[objName] = value;
            }
        }
    }

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
                let name = getConfig('name', 'qbse-node');
                let level = getConfig('level', 'info');
                let src = getConfig('src', false);
                let stream = getStream();

                let logger = bunyan.createLogger({
                    name       : name,
                    streams    : [stream],
                    level      : level,
                    src        : src,
                    serializers: {
                        req: reqSerializer,
                        res: resSerializer
                    }
                });

                appLogger = logger.child({
                    // custom logger attributes go here..
                    type: 'NODE'
                });

                //  for each supported Bunyan logging level, add custom log attributes
                //  to the argument list before logging the message.
                appLogger.debug = function() {
                    logger.debug.apply(logger, addCustomArgs(arguments, 'DEBUG'));
                };
                appLogger.error = function() {
                    logger.error.apply(logger, addCustomArgs(arguments, 'ERROR'));
                };
                appLogger.fatal = function() {
                    logger.fatal.apply(logger, addCustomArgs(arguments, 'FATAL'));
                };
                appLogger.info = function() {
                    logger.info.apply(logger, addCustomArgs(arguments, 'INFO'));
                };
                appLogger.trace = function() {
                    logger.trace.apply(logger, addCustomArgs(arguments, 'TRACE'));
                };
                appLogger.warn = function() {
                    logger.warn.apply(logger, addCustomArgs(arguments, 'WARN'));
                };

                showBody = getConfig('showBody', false);
            }

            return appLogger;

        }

    };

    /**
     * Apply custom arguments to the log entry.  Adding the following attributes to all messages:
     *
     * timestamp:  current time stamp
     * lvl:        log level text string
     *
     * @param args
     * @param lvl
     * @returns {Array}
     */
    function addCustomArgs(args, lvl) {

        const customArgs = {
            timestamp: new Date().toISOString(),
            lvl: lvl
        };

        let argList = [];
        if (args.length > 0) {
            // Bunyan expects all serializers to be the first argument when logging a message..otherwise
            // the serializers will not get called.  This is important to note as we have request and
            // response object serializers defined, which if not called, will result in the log output
            // getting cluttered with large req/res objects that include newline characters, making the
            // log difficult to read.
            //
            // Check if the first argument is an object.  If yes, then it most likely is a serializer, so
            // merge in the custom attributes to the existing object instead of pushing a new entry into
            // the argument list.
            if (typeof (args[0]) === 'object') {
                args[0] = Object.assign(args[0], customArgs);
            } else {
                argList.push(customArgs);
            }

            for (const arg of args) {
                argList.push(arg);
            }
        } else {
            //  calling bunyan logger without any arguments..just add the custom attributes
            argList.push(customArgs);
        }

        return argList;
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
        let value = defaultValue;
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
        let stream = getConfig('stream');
        if (stream) {
            //  if of type file, setup to stream the output to a file
            if (stream.type === 'file' && stream.file) {
                let s = {};
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

}());
