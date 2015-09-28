import Logger from '../../src/utils/logger';
import LogLevel from '../../src/utils/logLevels';

describe('Logger', function() {
    'use strict';

    it ('test default instantiation of Logger', function() {
        let config = {};
        let logger = new Logger(config);
        expect (logger.logLevel).toBe(LogLevel.ERROR);
        expect (logger.logToConsole).toBeFalsy();
        expect (logger.logToServer).toBeFalsy();
    });
    /*
     it ('test non-default instantiation of Logger', () => {
     let config = {
     logToConsole: true,
     logToServer: true,
     logLevel: LogLevel.DEBUG
     };
     let logger = new Logger(config);

     expect (logger.logLevel).toBe(LogLevel.ERROR);
     expect (logger.logToConsole).toBeFalsy();
     expect (logger.logToServer).toBeTruthy();
     });

     it ('test Logger set to DEBUG', () => {
     let config = {
     logToConsole: true,
     logToServer: true,
     logLevel: LogLevel.DEBUG
     };

     let logger = new Logger(config);

     expect (logger.logLevel).toBe(LogLevel.DEBUG);

     spyOn(logger, 'logTheMessage').andReturn();
     let logMsg = 'debug message';
     logger.debug(logMsg);
     expect(logger.logTheMessage).toHaveBeenCalledWIth(LogLevel.DEBUG, logMsg);

     logger.info(logMsg);
     expect(logger.logTheMessage).toHaveBeenCalledWIth(LogLevel.INFO, logMsg);

     logger.warn(logMsg);
     expect(logger.logTheMessage).toHavaeBeenCalledWIth(LogLevel.WARN, logMsg);

     logger.error(logMsg);
     expect(logger.logTheMessage).toHaveBeenCalledWIth(LogLevel.ERROR, logMsg);
     });

     it ('test Logger set to INFO', () => {
     let config = {
     logToConsole: true,
     logToServer: true,
     logLevel: LogLevel.INFO
     };

     let logger = new Logger(config);

     expect (logger.logLevel).toBe(LogLevel.INFO);

     spyOn(logger, 'logTheMessage').andReturn();
     let logMsg = 'info message';
     logger.debug(logMsg);
     expect(logger.logTheMessage).not.toHaveBeenCalledWIth(LogLevel.DEBUG, logMsg);

     logger.info(logMsg);
     expect(logger.logTheMessage).toHaveBeenCalledWIth(LogLevel.INFO, logMsg);

     logger.warn(logMsg);
     expect(logger.logTheMessage).toHaveBeenCalledWIth(LogLevel.WARN, logMsg);

     logger.error(logMsg);
     expect(logger.logTheMessage).toHaveBeenCalledWIth(LogLevel.ERROR, logMsg);
     });

     it ('test Logger set to WARN', () => {
     let config = {
     logToConsole: true,
     logToServer: true,
     logLevel: LogLevel.WARN
     };

     let logger = new Logger(config);

     expect (logger.logLevel).toBe(LogLevel.WARN);

     spyOn(logger, 'logTheMessage').andReturn();
     let logMsg = 'warn message';
     logger.debug(logMsg);
     expect(logger.logTheMessage).not.toHaveBeenCalledWIth(LogLevel.DEBUG, logMsg);

     logger.info(logMsg);
     expect(logger.logTheMessage).not.toHaveBeenCalledWIth(LogLevel.INFO, logMsg);

     logger.warn(logMsg);
     expect(logger.logTheMessage).toHaveBeenCalledWIth(LogLevel.WARN, logMsg);

     logger.error(logMsg);
     expect(logger.logTheMessage).toHaveBeenCalledWIth(LogLevel.ERROR, logMsg);
     });

     it ('test Logger set to ERROR', () => {
     let config = {
     logToConsole: true,
     logToServer: true,
     logLevel: LogLevel.ERROR
     };

     let logger = new Logger(config);

     expect (logger.logLevel).toBe(LogLevel.ERROR);

     spyOn(logger, 'logTheMessage').andReturn();
     let logMsg = 'error message';
     logger.debug(logMsg);
     expect(logger.logTheMessage).not.toHaveBeenCalledWIth(LogLevel.DEBUG, logMsg);

     logger.info(logMsg);
     expect(logger.logTheMessage).not.toHaveBeenCalledWIth(LogLevel.INFO, logMsg);

     logger.warn(logMsg);
     expect(logger.logTheMessage).not.toHaveBeenCalledWIth(LogLevel.WARN, logMsg);

     logger.error(logMsg);
     expect(logger.logTheMessage).toHaveBeenCalledWIth(LogLevel.ERROR, logMsg);
     });

     it ('test Logger set to OFF', () => {
     let config = {
     logToConsole: true,
     logToServer: true,
     logLevel: LogLevel.OFF
     };

     let logger = new Logger(config);

     expect (logger.logLevel).toBe(LogLevel.OFF);

     spyOn(logger, 'logTheMessage').andReturn();
     let logMsg = 'no error message logging';
     logger.debug(logMsg);
     expect(logger.logTheMessage).not.toHaveBeenCalledWIth(LogLevel.DEBUG, logMsg);

     logger.info(logMsg);
     expect(logger.logTheMessage).not.toHaveBeenCalledWIth(LogLevel.INFO, logMsg);

     logger.warn(logMsg);
     expect(logger.logTheMessage).not.toHaveBeenCalledWIth(LogLevel.WARN, logMsg);

     logger.error(logMsg);
     expect(logger.logTheMessage).not.toHaveBeenCalledWIth(LogLevel.ERROR, logMsg);
     });

     it ('test logging of message to console only', () => {
     let config = {
     logToConsole: true,
     logToServer: false,
     logLevel: LogLevel.DEBUG
     };

     let logger = new Logger(config);

     spyOn(window.console, 'log').andReturn();
     let logMsg = 'no error message logging';
     logger.debug(logMsg);

     expect(logger.logTheMessage).toHaveBeenCalledWIth(LogLevel.DEBUG, logMsg);
     expect(window.console.log).toHaveBeenCalled();

     // TODO add test to ensure server xhr is not called

     });
     */
});