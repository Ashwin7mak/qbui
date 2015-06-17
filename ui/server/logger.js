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
    *      suppressConsole: suppress console logging.
    */

    'use strict';

    var bunyan = require('bunyan');
    var config = require('./config/environment');
    var fs = require('fs');

    module.exports = {

        getLogger: function(callFunc) {

            //  setup the logger configuration
            var name = getConfig('name', 'qbse');
            var level = getConfig('level', 'info');
            var src = getConfig('src', false);
            var stream = getStream();

            //  do we want to suppress console logging
            if (getConfig('suppressConsole') === true) {
                console.log = function () {
                };
            }

            var logger = bunyan.createLogger({
                name: name,
                streams: [stream],
                level: level,
                src: src,
                serializers: bunyan.stdSerializers
            });

            // add custom qbse specific properties
            var appLogger = logger.child({
                callFunc: getCallFunc(callFunc)
            });

             //  add some custom functions
            appLogger.logRequest = function (req) {
                if (req) {
                    appLogger.info({req: req});
                }
                else {
                    appLogger.info('No request object supplied when trying to log request information.');
                }
            };
            appLogger.logResponse = function (res) {
                //  Use cautiously, as the amount of data returned could be significant..
                if (res) {
                    appLogger.debug({res: res});                         //  debug mode only
                }
                else {
                    appLogger.debug('No response object supplied when trying to log response information.');
                }
            };

            return appLogger;

        }
    };

    /**
     * Return the configuration setting for the given key.
     * If the key is not defined, the default value is returned.
     *
     * @param logkey
     * @param defaultValue
     * @returns {*}
     */
    function getConfig(logkey, defaultValue) {
        var value = defaultValue;
        if (config && config.LOG) {
            value = config.LOG[logkey] || defaultValue;
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

        return {type: 'stream', stream: process.stdout};
    }

    function getCallFunc(callFunc) {
        if (callFunc) {
            var offset = callFunc.indexOf('/server/');
            if (offset === -1) {
                offset = callFunc.indexOf('/public/');
                if (offset === -1) {
                    offset = callFunc.indexOf('/client/');
                }
            }
            if (offset !== -1) {
                return callFunc.substr(offset);
            }
        }
        return '';
    }


}());
