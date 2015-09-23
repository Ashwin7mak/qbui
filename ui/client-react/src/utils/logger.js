
/*
 DEBUG	Detailed information on the flow through the system. Expect these to be written to logs only.
 INFO	Interesting runtime events (startup/shutdown).
 WARN	Use of deprecated APIs, poor use of API, 'almost' errors, other runtime situations that are undesirable or unexpected, but not necessarily "wrong".
 ERROR	Runtime errors or unexpected conditions.
 OFF	Turn off logging.
 */
var LOG_LEVEL = {
    DEBUG: {id:40,name:'DEBUG'},
    INFO: {id:30,name:'INFO'},
    WARN: {id:20,name:'WARN'},
    ERROR: {id:10,name:'ERROR'},
    OFF: {id:0,name:'OFF'},
};

class Logger {

    //  simple logging class..

    constructor(config) {
        // Set to what we'd expect we'd want for production, in case there's an issue with the config
        this.logLevel = LOG_LEVEL.ERROR;
        this.logToConsole = false;
        this.logToServer = true;

        if (config) {
            this.logLevel = config.logLevel || LOG_LEVEL.ERROR;
            this.logToConsole = config.logToConsole || false;
            this.logToServer = config.logToServer || true;
        }
    }

    debug(msg) {
        if (LOG_LEVEL.DEBUG.id <= this.logLevel.id) {
            this.logTheMessage(this.logLevel, msg);
        }
    }

    info(msg) {
        if (LOG_LEVEL.INFO.id <= this.logLevel.id) {
            this.logTheMessage(this.logLevel, msg);
        }
    }

    warn(msg) {
        if (LOG_LEVEL.WARN.id <= this.logLevel.id) {
            this.logTheMessage(this.logLevel, msg);
        }
    }

    error(msg) {
        if (LOG_LEVEL.ERROR.id <= this.logLevel.id) {
            this.logTheMessage(this.logLevel, msg);
        }
    }

    //  todo: xhr to node server to log server message...
    logTheMessage(level, msg) {
        try {
            if (this.logToConsole === true) {
                window.console.log(level.name + ': ' + msg);
            }
            if (this.logToServer === true) {
                // make xhr call to server to log on node
            }
        }
        catch (e) {
            if (typeof window.console !== 'undefined' && typeof window.console.log !== 'undefined') {
                console.log('An error occurred in the processing of a logging message. ERROR::' + e);
            }
        }
    }
}

export {Logger, LOG_LEVEL};