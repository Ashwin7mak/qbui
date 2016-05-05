(function() {

    'use strict';
    var log = require('./logger').getLogger();

    /**
     * Simple implementation for performance monitoring to log
     * the duration (in ms) of an event as an info message
     *
     * @returns {{start: function(event), log: log(skipInit}}
     * @constructor
     */
    function PerfLogger() {
        let perfStartTime = null;
        let perfEvent = '';

        return {
            // Start the perf event by setting a start time.  Can override/reset the event message
            start: function(event) {
                perfStartTime = new Date();
                if (event) {
                    this.setEvent(event);
                }
            },

            // Set the message event
            setEvent: function(event) {
                if (event && typeof event === 'string') {
                    perfEvent = event;
                } else {
                    perfEvent = '';
                }
            },

            //  Log an event with the elapsed time from when the start function was called and
            //  by default, clear the start time and perfEvent message.  Set the skipStop parameter
            //  to true to NOT clear out the start time and perfEvent.
            logAndStop: function(skipStop) {
                if (perfStartTime) {
                    let elapsedTime = new Date().getTime() - perfStartTime.getTime();

                    //  log as info message
                    let params = {
                        type: 'PERF',
                        elapsedTime: elapsedTime + 'ms'
                    };
                    log.info(params, perfEvent);

                    //  initialize the perf info unless optional skipInit parameter is set to true
                    if (skipStop !== true) {
                        perfStartTime = null;
                        perfEvent = '';
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

}());

