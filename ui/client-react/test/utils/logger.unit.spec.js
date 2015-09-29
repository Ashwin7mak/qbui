import Logger from '../../src/utils/logger.js';
import LogLevel from '../../src/utils/logLevels.js';

describe('Logger', () => {
    'use strict';

    let logMsg = 'debug message';

    // TODO: this is a PLACEHOLDER...need to explicitly call with TEST configuration..
    it('test instantiation of Logger with default test environment settings', () => {
        let logger = new Logger();

        //  defined in config/app.config.js
        expect(logger.logLevel).toBe(LogLevel.DEBUG);
        expect(logger.logToConsole).toBeTruthy();
        expect(logger.logToServer).toBeFalsy();
    });

    it('test instantiation of Logger with application level settings', () => {
        let config = {
            logToConsole: false,
            logToServer: true,
            logLevel: LogLevel.DEBUG
        };
        let logger = new Logger(config);

        expect(logger.logLevel).toBe(LogLevel.DEBUG);
        expect(logger.logToConsole).toBeFalsy();
        expect(logger.logToServer).toBeTruthy();
    });

    it('test Logger with console and server logging', () => {
        let config = {
            logToConsole: true,
            logToServer: true,
            logLevel: LogLevel.DEBUG
        };

        let logger = new Logger(config);
        spyOn(logger, 'logTheMessage').and.callThrough();
        spyOn(console, 'log').and.returnValue('message logged to console');
        spyOn(logger, 'sendMessageToServer');

        logger.debug(logMsg);

        expect(logger.logTheMessage).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalled();
        expect(logger.sendMessageToServer).toHaveBeenCalled();
    });

    it('test Logger with no console and server logging', () => {
        let config = {
            logToConsole: false,
            logToServer: false,
            logLevel: LogLevel.DEBUG
        };

        let logger = new Logger(config);
        spyOn(logger, 'logTheMessage').and.callThrough();
        spyOn(console, 'log').and.returnValue('message logged to console');
        spyOn(logger, 'sendMessageToServer');

        logger.debug(logMsg);

        expect(logger.logTheMessage).toHaveBeenCalled();
        expect(console.log).not.toHaveBeenCalled();
        expect(logger.sendMessageToServer).not.toHaveBeenCalled();
    });

    it('test debug level logging', () => {
        let config = {
            logToConsole: false,
            logToServer: false,
            logLevel: LogLevel.DEBUG
        };

        let logger = new Logger(config);
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
    });

    it('test info level logging', () => {
        let config = {
            logToConsole: false,
            logToServer: false,
            logLevel: LogLevel.INFO
        };

        let logger = new Logger(config);
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
    });

    it('test info level logging', () => {
        let config = {
            logToConsole: false,
            logToServer: false,
            logLevel: LogLevel.WARN
        };

        let logger = new Logger(config);
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
    });

    it('test info level logging', () => {
        let config = {
            logToConsole: false,
            logToServer: false,
            logLevel: LogLevel.ERROR
        };

        let logger = new Logger(config);
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
    });

    it('test info level logging', () => {
        let config = {
            logToConsole: false,
            logToServer: false,
            logLevel: LogLevel.OFF
        };

        let logger = new Logger(config);
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
    });

});