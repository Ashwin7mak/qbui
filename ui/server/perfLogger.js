(function() {
    /*
     * Simple implementation for performance monitoring to log
     * the duration (in ms) of an event as an info message.
     */

    'use strict';

    var logger = require('./logger').getLogger();

    /**
     * Simple implementation for performance monitoring to log
     * the duration (in ms) of an event as an info message.
     *
     * @param tag
     * @returns {{start: function(ev), log: log(skipTimerInit}}
     * @constructor
     */
    function PerfLogger(ev) {
        var perfTimer;
        var perfEvent = setEvent(ev);

        function setEvent(event) {
            if (event && event instanceof String) {
                perfEvent = event;
            }
        }

        return {
            // start the timer.  Can override/reset the tag
            start: function(e) {
                perfTimer = new Date();
                setEvent(e);
            },

            //  log an event with the elapsed time from when the start function was called
            log: function(skipInit) {
                if (perfTimer) {
                    let ms = new Date().getTime() - perfTimer.getTime();

                    //  log as info message
                    var msg = {
                        type: 'PERF',
                        event: perfEvent,
                        elapsedTime: ms + 'ms'
                    };
                    appLogger.info(msg);

                    //  initialize the timer unless optional skipTimerInit is set to true
                    if (skipInit !== true) {
                        perfTimer = null;
                    }
                }
            }
        };
    }

    module.exports = {
        getInstance: function(tag) {
            return new PerfLogger(tag);
        }
    };

    //module.exports = {
    //
    //    perfStart: null,
    //
    //    /**
    //     * Start the perf timer and set the event tag(if supplied)
    //     */
    //    start: function() {
    //        this.perfStart = new Date();
    //    },
    //
    //    /**
    //     * log an event with the elapsed time from when the perf timer was set
    //     *
    //     * @param event - string event to log with the info log message
    //     * @param skipInit - set to true to not initialize the timer
    //     */
    //    log: function(event, skipInit) {
    //        if (this.perfStart && this.perfStart instanceof Date) {
    //
    //            let ms = new Date().getTime() - this.perfStart.getTime();
    //
    //            //  log as info message
    //            var msg = {
    //                type: 'PERF',
    //                event: (event && event instanceof String ? event : ''),
    //                elapsedTime: ms + 'ms'
    //            };
    //            logger.info(msg);
    //
    //            //  initialize the timer unless optional skipTimerInit is set to true
    //            if (skipInit !== true) {
    //                this.perfStart = null;
    //            }
    //        }
    //    }
    //};

}());

