
var LOG_LEVEL = {
    DEBUG: 10,
    INFO: 20,
    WARN: 30,
    ERROR: 40,
    OFF: -99
};

class Logger {

    //  simple logging class..
    // todo: xhr to node server to log message...

    constructor(logLevel) {
        if (logLevel) {
            this.logLevel = logLevel;
        }
    }

    debug(msg) {
        if (LOG_LEVEL.DEBUG >= this.logLevel) {
            console.log(msg);
        }
    }

    info(msg) {
        if (LOG_LEVEL.INFO >= this.logLevel) {
            console.log(msg);
        }
    }

    warn(msg) {
        if (LOG_LEVEL.WARN >= this.logLevel) {
            console.log(msg);
        }
    }

    error(msg) {
        if (LOG_LEVEL.ERROR >= this.logLevel) {
            console.log(msg);
        }
    }
}

export {Logger, LOG_LEVEL};