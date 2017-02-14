import Logger, {__RewireAPI__ as LoggerRewireAPI} from '../../src/utils/logger.js';
import LogLevel from '../../src/utils/logLevels.js';

describe('Logger', () => {
    /*eslint no-console:0 */

    'use strict';

    let logMsg = 'debug message';
    class mockLogService {
        constructor() { }
        log(msg) {
            return msg;
        }
        error(msg) {
            return msg;
        }
        debug(msg) {
            return msg;
        }
        warn(msg) {
            return msg;
        }
        info(msg) {
            return msg;
        }
    }
    beforeEach(() => {
        LoggerRewireAPI.__Rewire__('LogService', mockLogService);
    });

    afterEach(() => {
        LoggerRewireAPI.__ResetDependency__('LogService');
    });

    it('test instantiation of Logger with default environment settings(PROD)', () => {
        let logger = new Logger();

        //  defined in config/app.config.js...for tests we are running with PROD
        expect(logger.logLevel).toBe(LogLevel.WARN);
        expect(logger.logToConsole).toBeFalsy();
        expect(logger.logToServer).toBeTruthy();
    });

    it('test exception is handled properly', () => {
        let mockConfig = {
            logger: {
                logToConsole: false,
                logToServer: true,
                logLevel: LogLevel.DEBUG
            }
        };

        LoggerRewireAPI.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        spyOn(console, 'log');
        spyOn(logger, 'sendMessageToServer').and.throwError('myTestError');

        logger.debug(logMsg);

        expect(logger.sendMessageToServer).toHaveBeenCalled();
        expect(console.log.calls.count()).toEqual(1);   // exception handling will output message to console

        LoggerRewireAPI.__ResetDependency__('Configuration');
    });

    it('test parseAndLogError function with error object', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: true,
                logLevel: LogLevel.DEBUG
            }
        };

        LoggerRewireAPI.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        spyOn(logger, 'error');

        let error = {
            status: 500,
            statusText: 'error message text',
            data: {
                body: 'error body'
            }
        };

        logger.parseAndLogError(LogLevel.ERROR, error, 'prefix');
        expect(logger.error).toHaveBeenCalled();

        LoggerRewireAPI.__ResetDependency__('Configuration');
    });

    it('test parseAndLogError function with no body in error object', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: true,
                logLevel: LogLevel.DEBUG
            }
        };

        LoggerRewireAPI.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        spyOn(logger, 'error');

        let error = {
            status: 500,
            statusText: 'error message text',
            data: {
                noBody: ''
            }
        };

        logger.parseAndLogError(LogLevel.ERROR, error, 'prefix');
        expect(logger.error).toHaveBeenCalled();

        LoggerRewireAPI.__ResetDependency__('Configuration');
    });

    it('test parseAndLogError function with parsing exception', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: true,
                logLevel: LogLevel.DEBUG
            }
        };

        LoggerRewireAPI.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        spyOn(logger, 'error');

        let error = {
            status: 500,
            statusText: 'error message text',
            data: {
                body: function() {}
            }
        };

        logger.parseAndLogError(LogLevel.ERROR, error, 'prefix');
        expect(logger.error).toHaveBeenCalled();

        LoggerRewireAPI.__ResetDependency__('Configuration');
    });

    it('test logException function', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: true,
                logLevel: LogLevel.DEBUG
            }
        };

        LoggerRewireAPI.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        spyOn(logger, 'error');

        let ex = {
            stack: 'stack',
            name: 'name'
        };
        logger.logException(ex);
        expect(logger.error).toHaveBeenCalled();

        LoggerRewireAPI.__ResetDependency__('Configuration');
    });

    it('test debug handling of error stack', () => {
        const mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: true,
                logLevel: LogLevel.DEBUG
            }
        };

        LoggerRewireAPI.__Rewire__('Configuration', mockConfig);
        const logger = new Logger();

        spyOn(console, 'debug');

        const ex = {
            stack: 'fakestack',
            name: 'name'
        };
        const errorMessage = `I make the best error messages, the best ones, they're great. Ask all my fiends. All my fiends agree I make the best.`;
        logger.debug(errorMessage, ex);

        let consoleDebugArg = console.debug.calls.argsFor(0)[0];
        expect(console.debug).toHaveBeenCalled();
        expect(consoleDebugArg.indexOf(errorMessage) > -1).toBeTruthy();
        expect(consoleDebugArg.indexOf(ex.stack) > -1).toBeTruthy();

        LoggerRewireAPI.__ResetDependency__('Configuration');
    });

    it('test Logger with console and server logging', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: true,
                logLevel: LogLevel.DEBUG
            }
        };

        LoggerRewireAPI.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        expect(logger.logToConsole).toBeTruthy();
        expect(logger.logToServer).toBeTruthy();

        spyOn(logger, 'logTheMessage').and.callThrough();
        spyOn(console, 'debug').and.returnValue('message logged to console');
        spyOn(logger, 'sendMessageToServer');

        logger.debug(logMsg);

        expect(logger.logTheMessage).toHaveBeenCalled();
        expect(console.debug).toHaveBeenCalled();
        expect(logger.sendMessageToServer).toHaveBeenCalled();

        LoggerRewireAPI.__ResetDependency__('Configuration');
    });

    it('test Logger with console only logging debug level', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: false,
                logLevel: LogLevel.DEBUG
            }
        };

        LoggerRewireAPI.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        expect(logger.logToConsole).toBeTruthy();
        expect(logger.logToServer).toBeFalsy();

        spyOn(logger, 'logTheMessage').and.callThrough();
        spyOn(console, 'debug').and.returnValue('message logged to console');
        spyOn(logger, 'sendMessageToServer');

        logger.debug(logMsg);

        expect(logger.logTheMessage).toHaveBeenCalled();
        expect(console.debug).toHaveBeenCalled();
        expect(logger.sendMessageToServer).not.toHaveBeenCalled();

        LoggerRewireAPI.__ResetDependency__('Configuration');
    });
    it('test Logger with console only logging error level', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: false,
                logLevel: LogLevel.ERROR
            }
        };

        LoggerRewireAPI.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        expect(logger.logToConsole).toBeTruthy();
        expect(logger.logToServer).toBeFalsy();

        spyOn(logger, 'logTheMessage').and.callThrough();
        spyOn(console, 'error').and.returnValue('message logged to console');
        spyOn(logger, 'sendMessageToServer');

        logger.error(logMsg);

        expect(logger.logTheMessage).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
        expect(logger.sendMessageToServer).not.toHaveBeenCalled();

        LoggerRewireAPI.__ResetDependency__('Configuration');
    });
    it('test Logger with console only logging warn level', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: false,
                logLevel: LogLevel.WARN
            }
        };

        LoggerRewireAPI.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        expect(logger.logToConsole).toBeTruthy();
        expect(logger.logToServer).toBeFalsy();

        spyOn(logger, 'logTheMessage').and.callThrough();
        spyOn(console, 'warn').and.returnValue('message logged to console');
        spyOn(logger, 'sendMessageToServer');

        logger.warn(logMsg);

        expect(logger.logTheMessage).toHaveBeenCalled();
        expect(console.warn).toHaveBeenCalled();
        expect(logger.sendMessageToServer).not.toHaveBeenCalled();

        LoggerRewireAPI.__ResetDependency__('Configuration');
    });
    it('test Logger with console only logging info level', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: false,
                logLevel: LogLevel.INFO
            }
        };

        LoggerRewireAPI.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        expect(logger.logToConsole).toBeTruthy();
        expect(logger.logToServer).toBeFalsy();

        spyOn(logger, 'logTheMessage').and.callThrough();
        spyOn(console, 'info').and.returnValue('message logged to console');
        spyOn(logger, 'sendMessageToServer');

        logger.info(logMsg);

        expect(logger.logTheMessage).toHaveBeenCalled();
        expect(console.info).toHaveBeenCalled();
        expect(logger.sendMessageToServer).not.toHaveBeenCalled();

        LoggerRewireAPI.__ResetDependency__('Configuration');
    });

    it('test Logger with server only logging', () => {
        let mockConfig = {
            logger: {
                logToConsole: false,
                logToServer: true,
                logLevel: LogLevel.DEBUG
            }
        };

        LoggerRewireAPI.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        expect(logger.logToConsole).toBeFalsy();
        expect(logger.logToServer).toBeTruthy();

        spyOn(logger, 'logTheMessage').and.callThrough();
        spyOn(console, 'log').and.returnValue('message logged to console');
        spyOn(logger, 'sendMessageToServer');

        logger.debug(logMsg);

        expect(logger.logTheMessage).toHaveBeenCalled();
        expect(console.log).not.toHaveBeenCalled();
        expect(logger.sendMessageToServer).toHaveBeenCalled();

        LoggerRewireAPI.__ResetDependency__('Configuration');
    });

    it('test Logger with no console and server logging', () => {
        let mockConfig = {
            logger: {
                logToConsole: false,
                logToServer: false,
                logLevel: LogLevel.DEBUG
            }
        };

        LoggerRewireAPI.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        spyOn(logger, 'logTheMessage').and.callThrough();
        spyOn(console, 'log').and.returnValue('message logged to console');
        spyOn(logger, 'sendMessageToServer');

        logger.debug(logMsg);

        expect(logger.logTheMessage).toHaveBeenCalled();
        expect(console.log).not.toHaveBeenCalled();
        expect(logger.sendMessageToServer).not.toHaveBeenCalled();

        LoggerRewireAPI.__ResetDependency__('Configuration');
    });

    it('test debug level logging', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: true,
                logLevel: LogLevel.DEBUG
            }
        };

        LoggerRewireAPI.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        spyOn(logger, 'logTheMessage').and.returnValue('logTheMessage');

        expect(logger.logLevel).toBe(LogLevel.DEBUG);

        logger.debug(logMsg);
        expect(logger.logTheMessage).toHaveBeenCalled();

        logger.info(logMsg);
        expect(logger.logTheMessage).toHaveBeenCalled();

        logger.warn(logMsg);
        expect(logger.logTheMessage).toHaveBeenCalled();

        logger.error(logMsg);
        expect(logger.logTheMessage).toHaveBeenCalled();

        LoggerRewireAPI.__ResetDependency__('Configuration');
    });

    it('test info level logging', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: true,
                logLevel: LogLevel.INFO
            }
        };

        LoggerRewireAPI.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        spyOn(logger, 'logTheMessage').and.returnValue('logTheMessage');

        expect(logger.logLevel).toBe(LogLevel.INFO);

        logger.debug(logMsg);
        expect(logger.logTheMessage).not.toHaveBeenCalled();

        logger.info(logMsg);
        expect(logger.logTheMessage).toHaveBeenCalled();

        logger.warn(logMsg);
        expect(logger.logTheMessage).toHaveBeenCalled();

        logger.error(logMsg);
        expect(logger.logTheMessage).toHaveBeenCalled();

        LoggerRewireAPI.__ResetDependency__('Configuration');
    });

    it('test warn level logging', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: true,
                logLevel: LogLevel.WARN
            }
        };

        LoggerRewireAPI.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        spyOn(logger, 'logTheMessage').and.returnValue('logTheMessage');

        expect(logger.logLevel).toBe(LogLevel.WARN);

        logger.debug(logMsg);
        expect(logger.logTheMessage).not.toHaveBeenCalled();

        logger.info(logMsg);
        expect(logger.logTheMessage).not.toHaveBeenCalled();

        logger.warn(logMsg);
        expect(logger.logTheMessage).toHaveBeenCalled();

        logger.error(logMsg);
        expect(logger.logTheMessage).toHaveBeenCalled();

        LoggerRewireAPI.__ResetDependency__('Configuration');
    });

    it('test error level logging', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: true,
                logLevel: LogLevel.ERROR
            }
        };

        LoggerRewireAPI.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        spyOn(logger, 'logTheMessage').and.returnValue('logTheMessage');

        expect(logger.logLevel).toBe(LogLevel.ERROR);

        logger.debug(logMsg);
        expect(logger.logTheMessage).not.toHaveBeenCalled();

        logger.info(logMsg);
        expect(logger.logTheMessage).not.toHaveBeenCalled();

        logger.warn(logMsg);
        expect(logger.logTheMessage).not.toHaveBeenCalled();

        logger.error(logMsg);
        expect(logger.logTheMessage).toHaveBeenCalled();

        LoggerRewireAPI.__ResetDependency__('Configuration');
    });

    it('test no logging', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: true,
                logLevel: LogLevel.OFF
            }
        };

        LoggerRewireAPI.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();
        spyOn(logger, 'logTheMessage').and.returnValue('logTheMessage');

        expect(logger.logLevel).toBe(LogLevel.OFF);

        logger.debug(logMsg);
        expect(logger.logTheMessage).not.toHaveBeenCalled();

        logger.info(logMsg);
        expect(logger.logTheMessage).not.toHaveBeenCalled();

        logger.warn(logMsg);
        expect(logger.logTheMessage).not.toHaveBeenCalled();

        logger.error(logMsg);
        expect(logger.logTheMessage).not.toHaveBeenCalled();
        LoggerRewireAPI.__ResetDependency__('Configuration');
    });

    it('test logging service is called', () => {
        let mockConfig = {
            logger: {
                logToConsole: false,
                logToServer: true,
                logLevel: LogLevel.DEBUG
            }
        };
        LoggerRewireAPI.__Rewire__('Configuration', mockConfig);

        let logger = new Logger();

        spyOn(logger.logService, 'log');

        logger.debug(logMsg);
        expect(logger.logService.log).toHaveBeenCalled();

        LoggerRewireAPI.__ResetDependency__('Configuration');

    });

    it('test parseAndLogError method', () => {
        let mockConfig = {
            logger: {
                logToConsole: false,
                logToServer: true,
                logLevel: LogLevel.DEBUG
            }
        };
        LoggerRewireAPI.__Rewire__('Configuration', mockConfig);

        let logger = new Logger();

        spyOn(logger, 'warn');
        spyOn(logger, 'error');
        spyOn(logger, 'info');
        spyOn(logger, 'debug');

        let msg = {
            data: {
                person: 'person',
                place: 'place',
                thing: 'thing'
            }
        };

        logger.parseAndLogError(LogLevel.DEBUG, msg);
        expect(logger.debug).toHaveBeenCalledWith(JSON.stringify(msg.data));
        expect(logger.info).not.toHaveBeenCalled();
        expect(logger.warn).not.toHaveBeenCalled();
        expect(logger.error).not.toHaveBeenCalled();

        resetSpyCounter(logger);

        logger.parseAndLogError(LogLevel.INFO, msg);
        expect(logger.debug).not.toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalledWith(JSON.stringify(msg.data));
        expect(logger.warn).not.toHaveBeenCalledWith();
        expect(logger.error).not.toHaveBeenCalled();

        resetSpyCounter(logger);

        logger.parseAndLogError(LogLevel.WARN, msg);
        expect(logger.debug).not.toHaveBeenCalled();
        expect(logger.info).not.toHaveBeenCalled();
        expect(logger.warn).toHaveBeenCalledWith(JSON.stringify(msg.data));
        expect(logger.error).not.toHaveBeenCalled();

        resetSpyCounter(logger);

        logger.parseAndLogError(LogLevel.ERROR, msg);
        expect(logger.debug).not.toHaveBeenCalled();
        expect(logger.info).not.toHaveBeenCalled();
        expect(logger.warn).not.toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledWith(JSON.stringify(msg.data));

        resetSpyCounter(logger);

        logger.parseAndLogError(null, msg, 'prefix:');
        expect(logger.debug).not.toHaveBeenCalled();
        expect(logger.info).not.toHaveBeenCalled();
        expect(logger.warn).not.toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledWith('prefix:' + JSON.stringify(msg.data));

        LoggerRewireAPI.__ResetDependency__('Configuration');

    });

    function resetSpyCounter(logger) {
        logger.warn.calls.reset();
        logger.error.calls.reset();
        logger.info.calls.reset();
        logger.debug.calls.reset();
    }

});
