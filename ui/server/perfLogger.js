(function() {

    'use strict';
    var log = require('./logger').getLogger();

    /**
     * Simple wrapper class to be used to log elapsed time of a performance event
     * in a consistent manner.
     *
     * To use:
     *   - import/require this module
     *   - get an instance
     *   - call init(msg) to set a time stamp.  The msg parameter to identify the log event
     *     is optional.  You can elect to call setMessage(msg) instead.
     *   - call log() to output the message to the log.
     *
     * Example usage to log a performance message:
     *
     *   let perfLogger = require('../../perfLogger');
     *
     *   function getReportMetaData() {
     *
     *     let perfLog = perfLogger.getInstance();
     *     perfLog.init('Fetch meta data for a report');
     *
     *       < ..perform the fetch meta data work..>
     *
     *     perfLog.log();
     *   }
     *
     * Example log output:
     *
     *    { ... ,"level":30,"type":"PERF","elapsedTime":"9ms","msg":"Fetch meta data for a report","time":"2016-05-06T11:20:32.051Z", ... }
     *
     *
     * @returns {{init: function(msg), setMessage: function(msg), log: function log()}}
     * @constructor
     */
    function PerfLogger() {
        let perfStartTime = null;
        let perfMessage = '';
        let req = {};

        return {

            /**
             *  Init the start time.
             *
             *  Provide option to set the log message and reqInfo.  If no
             *  parameter is supplied, the message and reqInfo remains unchanged
             *  from its prior state.
             *
             *  @param msg
             *  @param reqInfo
             */
            init: function(msg, reqInfo) {
                perfStartTime = new Date();
                if (msg) {
                    this.setMessage(msg);
                }

                if (reqInfo) {
                    this.setReqInfo(reqInfo);
                }
            },

            /**
             * Set the log message.  Input must be a string.  If invalid input, the
             * log message is set to an empty string.
             *
             * @param msg
             */
            setMessage: function(msg) {
                perfMessage = '';
                if (msg && typeof msg === 'string') {
                    perfMessage = msg;
                }
            },

            /**
             * Set the request information to include in the perf message.
             *
             * @param reqInfo
             * @param idsOnly
             */
            setReqInfo: function(reqInfo, idsOnly) {
                req = {};
                if (reqInfo) {
                    if (idsOnly === true) {
                        if (reqInfo.headers) {
                            req.headers = {};
                            if (reqInfo.headers.sid) {
                                req.headers.sid = reqInfo.headers.sid;
                            }
                            if (reqInfo.headers.tid) {
                                req.headers.tid = reqInfo.headers.tid;
                            }
                        }
                    } else {
                        req = reqInfo;
                    }
                }
            },

            /**
             * Log an info message, calculating the elapsed time from when the init function
             * was last called.
             */
            log: function() {
                //  if the perfStartTime is not set, then the init method has not
                //  been called...don't log as message.
                if (perfStartTime) {
                    let elapsedTime = new Date().getTime() - perfStartTime.getTime();

                    //  log as info message
                    let params = {
                        type: 'PERF',
                        ms: elapsedTime + 'ms'
                    };
                    if (req) {
                        params.req = req;
                    }
                    log.info(params, perfMessage);
                }
            }
        };
    }

    module.exports = {
        // instantiate a PerfLogger instance
        getInstance: function() {
            return new PerfLogger();
        }
    };

}());

