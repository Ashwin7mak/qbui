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

                showBody = getConfig('showBody', false);

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
