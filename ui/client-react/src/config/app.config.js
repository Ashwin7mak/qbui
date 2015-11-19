import LogLevel from '../utils/logLevels';
//
// Application configuration settings per run-time environment.  The webpack configuration defines and sets
// these variables at build time.  The supported run-time environments include:  __QB_PROD__, __QB_TEST__
// and __QB_LOCAL__.  ONE and ONLY ONE variable is to be set to true.
//
// CODE COVERAGE: For the given if conditional variable blocks: __QB_PROD__, __QB_TEST__ and __QB_LOCAL__,
// the babel transpiler only includes the code inside of the condition block when the conditional statement
// is true.  When the if conditional block is false, the block code is NOT included in the outputted bundle file.
//
// For our tests, the webPack configuration in karam.conf is setup to run with __QB_PROD__ set to true (the others
// are false).  Because of this, our coverage reports need to ignore the 'false' conditional blocks by annotating
// the if statements of __QB_TEST__ and __QB_LOCAL__ with 'istanbul ignore if'.

let configuration = null;

if (__QB_PROD__) {
    configuration = {
        env: 'PROD',
        api: {
            version: 'v1'
        },
        locale: {
            supported:['en-us', 'de-de', 'fr-fr'],
            default: 'en-us',
        },
        logger: {
            logLevel: LogLevel.WARN,
            logToConsole: false,
            logToServer: true
        }
    };
}

/* istanbul ignore if */
if (__QB_TEST__) {
    configuration = {
        env: 'TEST',
        api: {
            version: 'v1'
        },
        locale: {
            supported: ['en-us', 'de-de', 'fr-fr'],
            default: 'en-us',
        },
        logger: {
            logLevel: LogLevel.DEBUG,
            logToConsole: true,
            logToServer: true
        }
    };
}

/* istanbul ignore if */
if (__QB_LOCAL__) {
    configuration = {
        env: 'LOCAL',
        api: {
            version: 'v1'
        },
        locale: {
            supported:['en-us', 'de-de', 'fr-fr'],
            default: 'en-us',
        },
        logger: {
            logLevel: LogLevel.DEBUG,
            logToConsole: true,
            logToServer: true
        }
    };
}

/* istanbul ignore if */
if (!configuration) {
    //  A run-time environment MUST be defined
    throw ("Run-time environment not defined....aborting!");
}

/* istanbul ignore if */
if (!__QB_PROD__) {
    /*eslint no-console:0 */
    // don't call the logger..you'll get into a race condition
    console.log("Run time configuration: " + configuration.env);
}

export default configuration;
