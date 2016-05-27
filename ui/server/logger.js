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

    //  custom request serializer to include on all messages.  For example, log.info({req:req}, 'some message') will
    //  trigger the serializer and include the custom output on the message.
    function reqSerializer(req) {
        if (!req) {
            return {};
        }

        var headers = req.headers || {};
        var agent = req.useragent || {};
        var body = req.body || {};
        var ip;

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

        var obj = {};

        //  only include in log message if defined
        addElement(obj, 'method', req.method);
        addElement(obj, 'url', req.url);
        addElement(obj, 'host', headers.host);
        addElement(obj, 'sid', headers.sid);
        addElement(obj, 'tid', headers.tid);
        addElement(obj, 'browser', agent.source);
        addElement(obj, 'platform', agent.platform);
        addElement(obj, 'ip', ip);

        if (body) {
            obj.body = body;
        }

        return obj;
    }

    function addElement(obj, objName, value) {
        if (value) {
            obj[objName] = value;
        }
    }

    //  custom response serializer to include on all messages.  For example, log.info({res:res}, 'some message') will
    //  trigger the serializer and include the custom output on the message.
    function resSerializer(res) {
        return {
            statusCode: res.statusCode,
            statusMessage: res.statusMessage
        };
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
                var name = getConfig('name', 'qbse-node');
                var level = getConfig('level', 'info');
                var src = getConfig('src', false);
                var stream = getStream();

                var logger = bunyan.createLogger({
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
                });

            }

            return appLogger;

        }

    };

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

}());
