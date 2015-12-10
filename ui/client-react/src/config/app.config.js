import LogLevel from '../utils/logLevels';
import uuid from 'uuid';

//
// Set application configuration settings per run-time environment.  The webpack configuration defines and sets
// the variables __QB_PROD__, __QB_TEST__ and __QB_LOCAL__ at build time in the webpack.conf and karam.conf files.
// Please reference these files for more information on the details of how these values are defined and set.
//
// A note about the generated transpiled file:  babel will include only the code inside of the condition block
// when the conditional statement evaluates to true.  This means when the if conditional statement is false,
// the conditional block code is NOT included in the outputted bundle file.
//
// CODE COVERAGE: For our tests, the webPack configuration in karma.conf is setup to run with __QB_PROD__ set to
// true (the others are false).  Because of this, our coverage reports need to ignore the 'false' conditional
// blocks because that code is NOT included in the evaluated bundle, and therefore not testable.  This is
// accomplished by annotating the if statements that evaluate to false with /* istanbul ignore if */
//
let configuration = null;

if (__QB_PROD__) {
    configuration = {
        env: 'PROD',
        sid: uuid.v1(),
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
        sid: uuid.v1(),
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
        sid: uuid.v1(),
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
    console.log("Run time configuration: " + configuration.env + '; SID: ' + configuration.sid);
}

export default configuration;
