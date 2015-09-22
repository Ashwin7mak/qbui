
var LOG_LEVEL = {
    DEBUG: 40,
    INFO: 30,
    WARN: 20,
    ERROR: 10,
    OFF: 99
};

class Logger {

    //  simple logging class..

    constructor(config) {
        if (config) {
            this.logLevel = config.logLevel || LOG_LEVEL.OFF;
            this.logToConsole = config.logToConsole || false;
            this.logToServer = config.logToServer || false;
        }
    }

    debug(msg) {
        if (this.logLevel <= LOG_LEVEL.DEBUG) {
            this.logTheMessage(LOG_LEVEL.DEBUG, msg);
        }
    }

    info(msg) {
        if (this.logLevel <= LOG_LEVEL.INFO) {
            this.logTheMessage(LOG_LEVEL.DEBUG, msg);
        }
    }

    warn(msg) {
        if (this.logLevel <= LOG_LEVEL.WARN) {
            this.logTheMessage(LOG_LEVEL.DEBUG, msg);
        }
    }

    error(msg) {
        if (this.logLevel <= LOG_LEVEL.ERROR) {
            this.logTheMessage(LOG_LEVEL.DEBUG, msg);
        }
    }

    //  todo: might want to move this to a private class..
    //  todo: xhr to node server to log server message...
    logTheMessage(level, msg) {
        if (this.logToConsole === true) {
            console.log(level + ': ' + msg);
        }
    }
}

export {Logger, LOG_LEVEL};