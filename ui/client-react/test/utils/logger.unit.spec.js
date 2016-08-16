import Logger from '../../src/utils/logger.js';
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
    }
    beforeEach(() => {
        Logger.__Rewire__('LogService', mockLogService);
    });

    afterEach(() => {
        Logger.__ResetDependency__('LogService');
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

        Logger.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        spyOn(console, 'log');
        spyOn(logger, 'sendMessageToServer').and.throwError('myTestError');

        logger.debug(logMsg);

        expect(logger.sendMessageToServer).toHaveBeenCalled();
        expect(console.log.calls.count()).toEqual(1);   // exception handling will output message to console

        Logger.__ResetDependency__('Configuration');
    });

    it('test parseAndLog function with error object', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: true,
                logLevel: LogLevel.DEBUG
            }
        };

        Logger.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        spyOn(logger, 'error');

        let error = {
            status: 500,
            statusText: 'error message text',
            data: {
                body: 'error body'
            }
        };

        logger.parseAndLog(LogLevel.ERROR, error, 'prefix');
        expect(logger.error).toHaveBeenCalled();

        Logger.__ResetDependency__('Configuration');
    });

    it('test parseAndLog function with no body in error object', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: true,
                logLevel: LogLevel.DEBUG
            }
        };

        Logger.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        spyOn(logger, 'error');

        let error = {
            status: 500,
            statusText: 'error message text',
            data: {
                noBody: ''
            }
        };

        logger.parseAndLog(LogLevel.ERROR, error, 'prefix');
        expect(logger.error).toHaveBeenCalled();

        Logger.__ResetDependency__('Configuration');
    });

    it('test parseAndLog function with parsing exception', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: true,
                logLevel: LogLevel.DEBUG
            }
        };

        Logger.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        spyOn(logger, 'error');

        let error = {
            status: 500,
            statusText: 'error message text',
            data: {
                body: function() {}
            }
        };

        logger.parseAndLog(LogLevel.ERROR, error, 'prefix');
        expect(logger.error).toHaveBeenCalled();

        Logger.__ResetDependency__('Configuration');
    });

    it('test logException function', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: true,
                logLevel: LogLevel.DEBUG
            }
        };

        Logger.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        spyOn(logger, 'error');

        let ex = {
            stack: 'stack',
            name: 'name'
        };
        logger.logException(ex);
        expect(logger.error).toHaveBeenCalled();

        Logger.__ResetDependency__('Configuration');
    });

    it('test Logger with console and server logging', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: true,
                logLevel: LogLevel.DEBUG
            }
        };

        Logger.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        expect(logger.logToConsole).toBeTruthy();
        expect(logger.logToServer).toBeTruthy();

        spyOn(logger, 'logTheMessage').and.callThrough();
        spyOn(console, 'log').and.returnValue('message logged to console');
        spyOn(logger, 'sendMessageToServer');

        logger.debug(logMsg);

        expect(logger.logTheMessage).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalled();
        expect(logger.sendMessageToServer).toHaveBeenCalled();

        Logger.__ResetDependency__('Configuration');
    });

    it('test Logger with console only logging', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: false,
                logLevel: LogLevel.DEBUG
            }
        };

        Logger.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        expect(logger.logToConsole).toBeTruthy();
        expect(logger.logToServer).toBeFalsy();

        spyOn(logger, 'logTheMessage').and.callThrough();
        spyOn(console, 'log').and.returnValue('message logged to console');
        spyOn(logger, 'sendMessageToServer');

        logger.debug(logMsg);

        expect(logger.logTheMessage).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalled();
        expect(logger.sendMessageToServer).not.toHaveBeenCalled();

        Logger.__ResetDependency__('Configuration');
    });

    it('test Logger with server only logging', () => {
        let mockConfig = {
            logger: {
                logToConsole: false,
                logToServer: true,
                logLevel: LogLevel.DEBUG
            }
        };

        Logger.__Rewire__('Configuration', mockConfig);
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

        Logger.__ResetDependency__('Configuration');
    });

    it('test Logger with no console and server logging', () => {
        let mockConfig = {
            logger: {
                logToConsole: false,
                logToServer: false,
                logLevel: LogLevel.DEBUG
            }
        };

        Logger.__Rewire__('Configuration', mockConfig);
        let logger = new Logger();

        spyOn(logger, 'logTheMessage').and.callThrough();
        spyOn(console, 'log').and.returnValue('message logged to console');
        spyOn(logger, 'sendMessageToServer');

        logger.debug(logMsg);

        expect(logger.logTheMessage).toHaveBeenCalled();
        expect(console.log).not.toHaveBeenCalled();
        expect(logger.sendMessageToServer).not.toHaveBeenCalled();

        Logger.__ResetDependency__('Configuration');
    });

    it('test debug level logging', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: true,
                logLevel: LogLevel.DEBUG
            }
        };

        Logger.__Rewire__('Configuration', mockConfig);
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

        Logger.__ResetDependency__('Configuration');
    });

    it('test info level logging', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: true,
                logLevel: LogLevel.INFO
            }
        };

        Logger.__Rewire__('Configuration', mockConfig);
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

        Logger.__ResetDependency__('Configuration');
    });

    it('test warn level logging', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: true,
                logLevel: LogLevel.WARN
            }
        };

        Logger.__Rewire__('Configuration', mockConfig);
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

        Logger.__ResetDependency__('Configuration');
    });

    it('test error level logging', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: true,
                logLevel: LogLevel.ERROR
            }
        };

        Logger.__Rewire__('Configuration', mockConfig);
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

        Logger.__ResetDependency__('Configuration');
    });

    it('test no logging', () => {
        let mockConfig = {
            logger: {
                logToConsole: true,
                logToServer: true,
                logLevel: LogLevel.OFF
            }
        };

        Logger.__Rewire__('Configuration', mockConfig);
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
        Logger.__ResetDependency__('Configuration');
    });

    it('test logging service is called', () => {
        let mockConfig = {
            logger: {
                logToConsole: false,
                logToServer: true,
                logLevel: LogLevel.DEBUG
            }
        };
        Logger.__Rewire__('Configuration', mockConfig);

        let logger = new Logger();

        spyOn(logger.logService, 'log');

        logger.debug(logMsg);
        expect(logger.logService.log).toHaveBeenCalled();

        Logger.__ResetDependency__('Configuration');

    });

});
