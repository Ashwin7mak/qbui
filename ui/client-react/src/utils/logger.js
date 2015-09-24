
/*
 DEBUG	Detailed information on the flow through the system. Expect these to be written to logs only.
 INFO	Interesting runtime events (startup/shutdown).
 WARN	Use of deprecated APIs, poor use of API, 'almost' errors, other runtime situations that are undesirable or unexpected, but not necessarily "wrong".
 ERROR	Runtime errors or unexpected conditions.
 OFF	Turn off logging.
 */
import Configuration from '../config/app.config';
import LogLevel from './logLevels';

class Logger {

    constructor(config) {
        // Set to what we'd expect we'd want for production, in case there's an issue with the config
        this.logLevel = LogLevel.ERROR;
        this.logToConsole = false;
        this.logToServer = true;

        //  allow for override of application level settings
        if (config) {
            this.logLevel = config.logger.logLevel || LogLevel.ERROR;
            this.logToConsole = config.logger.logToConsole || false;
            this.logToServer = config.logger.logToServer || true;
        }
        else if (Configuration.logger) {
            this.logLevel = Configuration.logger.logLevel || LogLevel.ERROR;
            this.logToConsole = Configuration.logger.logToConsole || false;
            this.logToServer = Configuration.logger.logToServer || true;
        }
    }

    debug(msg) {
        if (LogLevel.DEBUG.id <= this.logLevel.id) {
            this.logTheMessage(this.logLevel, msg);
        }
    }

    info(msg) {
        if (LogLevel.INFO.id <= this.logLevel.id) {
            this.logTheMessage(this.logLevel, msg);
        }
    }

    warn(msg) {
        if (LogLevel.WARN.id <= this.logLevel.id) {
            this.logTheMessage(this.logLevel, msg);
        }
    }

    error(msg) {
        if (LogLevel.ERROR.id <= this.logLevel.id) {
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
                // TODO: make xhr call to server to log on node
                // TODO: include uuid on the request
            }
        }
        catch (e) {
            if (typeof window.console !== 'undefined' && typeof window.console.log !== 'undefined') {
                window.console.log('An error occurred in the processing of a logging message. ERROR::' + e);
            }
        }
    }
}

export default Logger;