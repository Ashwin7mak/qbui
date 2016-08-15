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

    error(msg, exception) {
        if (LogLevel.ERROR.id <= this.logLevel.id) {
            this.logTheMessage(LogLevel.ERROR, msg, exception);
        }
    }

    /**
     * Helper method to examine the error object, extract
     * the message from the response body and consistently
     * log an error message.
     *
     * @param error
     * @param prefixTxt
     */
    parseAndLogError(error, prefixTxt) {
        let msg = '';

        if (error) {
            try {
                if (error.data) {
                    if (error.data.body) {
                        //  if their is a body object, it's coming from node as json so parse it..
                        msg = JSON.parse(error.data.body);
                    } else if (Array.isArray(error.data)) {
                        msg = error.data[0];
                    } else {
                        msg = error.data;
                    }
                }
            } catch (e) {
                this.warn(e);
            }
            if (!msg) {
                msg = 'Status:' + error.status + ';Msg:' + error.statusText;
            }
        }

        this.error(prefixTxt + JSON.stringify(msg));
    }

    /**
     * Helper method to consistently log an unexpected exception.
     *
     * @param ex
     * @param prefix
     */
    logException(ex, prefix) {
        this.error(prefix + JSON.stringify(ex), ex);
    }

    /**
     * Log a message to the console and/or server
     *
     * @param logging level
     * @param message to log
     * @param exception to log (optional)
     */
    logTheMessage(level, msg, exception) {
        /*eslint no-console:0 */
        try {
            //output the exception / stack trace
            var exceptionMessage = "";
            if (exception) {
                exceptionMessage += exception.toString ? exception.toString() : (exception.name + " " + exception.message);
                exceptionMessage += exception.stack && exception.stack.toString() ? (" StackTrace:" + exception.stack.toString()) : "";
            }

            if (this.logToConsole === true) {
                console.log(level.name + ': ' + msg + exceptionMessage);
            }
            if (this.logToServer === true) {
                if (exception) {
                    msg += exceptionMessage;
                }
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
