(function() {

    'use strict';
    var log = require('./logger').getLogger();

    /**
     * Simple wrapper class for performance monitoring to log
     * the duration (in ms) of an event as a consistent info message
     *
     * @returns {{init: function(msg), setMsg: function(msg), log: function log()}}
     * @constructor
     */
    function PerfLogger() {
        let perfStartTime = null;
        let perfMessage = '';

        return {
            // init the start time.  Provide option to set the log message
            init: function(msg) {
                perfStartTime = new Date();
                if (msg) {
                    this.setMessage(msg);
                }
            },

            // Set the event message
            setMessage: function(msg) {
                if (msg && typeof msg === 'string') {
                    perfMessage = msg;
                } else {
                    perfMessage = '';
                }
            },

            //  Log an event with the elapsed time from when the init function was last called.
            log: function() {
                if (perfStartTime) {
                    let elapsedTime = new Date().getTime() - perfStartTime.getTime();

                    //  log as info message
                    let params = {
                        type: 'PERF',
                        elapsedTime: elapsedTime + 'ms'
                    };
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

