/*
 DEBUG	Detailed information on the flow through the system. Expect these to be written to logs only.
 INFO	Interesting runtime events (startup/shutdown).
 WARN	Use of deprecated APIs, poor use of API, 'almost' errors, other runtime situations that are undesirable or unexpected, but not necessarily "wrong".
 ERROR	Runtime errors or unexpected conditions.
 OFF	Turn off logging.
 */
import Configuration from '../config/app.config';
import LogLevel from './logLevels';
import LogService from '../services/logService';

class Logger {

    constructor() {
        // log levels are set based on the app run-time configuration
        this.logLevel = Configuration.logger.logLevel;
        this.logToConsole = Configuration.logger.logToConsole;
        this.logToServer = Configuration.logger.logToServer;

        this.logService = new LogService();
    }

    debug(msg) {
        if (LogLevel.DEBUG.id <= this.logLevel.id) {
            this.logTheMessage(LogLevel.DEBUG, msg);
        }
    }

    info(msg) {
        if (LogLevel.INFO.id <= this.logLevel.id) {
            this.logTheMessage(LogLevel.INFO, msg);
        }
    }

    warn(msg) {
        if (LogLevel.WARN.id <= this.logLevel.id) {
            this.logTheMessage(LogLevel.WARN, msg);
        }
    }

    error(msg) {
        if (LogLevel.ERROR.id <= this.logLevel.id) {
            this.logTheMessage(LogLevel.ERROR, msg);
        }
    }

    /**
     * Log a message to the console and/or server
     *
     * @param logging level
     * @param message to log
     */
    logTheMessage(level, msg) {
        /*eslint no-console:0 */
        try {
            if (this.logToConsole === true) {
                console.log(level.name + ': ' + msg);
            }
            if (this.logToServer === true) {
                this.sendMessageToServer(level, msg);
            }
        } catch (e) {
            if (typeof console !== 'undefined' && typeof console.log !== 'undefined') {
                console.log('An error occurred in the processing of a logging message. MSG::' + msg + '; ERROR::' + e);
            }
        }
    }

    /**
     * Log a message to the server.
     *
     * @param level - bunyan log level.  ie: info, warn, debug, error
     * @param msg - the message to log on the server
     */
    sendMessageToServer(level, msg) {
        let message = {
            level: level.bunyanLevel,
            msg: msg
        };
        this.logService.log(message);
    }
}

export default Logger;
