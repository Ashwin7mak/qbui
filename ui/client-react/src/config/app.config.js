
import LogLevel from '../utils/logLevels';

//
// Application configuration settings per run-time environment.
// Supported run-time environments include PRODUCTION, TEST and LOCAL.
//

let configuration = null;

//  set the run-time environment..these values are set in webpack...one and only one should be true
if (__QB_PROD__) {
    configuration = {
        env: 'PROD',
        locale: {
            supported:['en-us', 'de-de', 'fr-fr'],
            default: 'en-us',
        },
        logger: {
            logLevel: LogLevel.WARN,
            logToConsole: false,
            logToServer: true
        },
        api: {
            version: 'v1'
        }
    };
}

if (__QB_TEST__) {
    configuration = {
        env: 'TEST',
        locale: {
            supported: ['en-us', 'de-de', 'fr-fr'],
            default: 'en-us',
        },
        logger: {
            logLevel: LogLevel.DEBUG,
            logToConsole: true,
            logToServer: true
        },
        api: {
            version: 'v1'
        }
    };
}

if (__QB_LOCAL__) {
    configuration = {
        env: 'LOCAL',
        locale: {
            supported:['en-us', 'de-de', 'fr-fr'],
            default: 'en-us',
        },
        logger: {
            logLevel: LogLevel.DEBUG,
            logToConsole: true,
            logToServer: true
        },
        api: {
            version: 'v1'
        }
    };
}

//  A run-time environment MUST be defined
if (!configuration) {
    throw ("Run-time environment not defined....aborting!");
}

//  don't call the logger...you'll get into a race condition...instead, directly check
//  if the configuration allows for console logging
if (configuration.logger.logToConsole) {
    /*eslint no-console:0 */
    console.log("Run time configuration: " + configuration.env);
}

export default configuration;
