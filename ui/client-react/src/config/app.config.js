import LogLevel from "../utils/logLevels";
import uuid from "uuid";
import _ from "lodash";


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

let defaultConfig = {
    uid: uuid.v1(),
    api: {
        qbVersion: 'v1',
        eeVersion: 'v1',
        automationVersion: 'v1',
        nodeVersion: 'v1',
        legacyVersion: 'v1'
    },
    locale: {
        supported: ['en-us', 'de-de', 'fr-fr'],
        default: 'en-us'
    },
};

if (__QB_PROD__) {

    configuration = _.assign({}, defaultConfig, {
        env: 'PROD',
        logger: {
            logLevel: LogLevel.WARN,
            logToConsole: false,
            logToServer: true
        },
        unauthorizedRedirect: null,
        // walkme java script
        walkmeJSSnippet : 'https://cdn.walkme.com/users/897ca46385a543cbbeaffbc655cdf312/walkme_897ca46385a543cbbeaffbc655cdf312_https.js',
        evergageDataset: 'test'
    });
}

/* istanbul ignore if */
if (__QB_TEST__) {
    configuration = _.assign({}, defaultConfig, {
        env: 'TEST',
        logger: {
            logLevel: LogLevel.DEBUG,
            logToConsole: false,
            logToServer: false
        },
        unauthorizedRedirect: null,
        // walkme java script
        walkmeJSSnippet : '',
        evergageDataset: null
    });
}

/* istanbul ignore if */
if (__QB_LOCAL__) {
    configuration = _.assign({}, defaultConfig, {
        env: 'LOCAL',
        logger: {
            logLevel: LogLevel.DEBUG,
            logToConsole: true,
            logToServer: false
        },
        detectInvalidMutations: false, /* use redux-immutable-state-invariant middleware? */
        unauthorizedRedirect: '/qbase/unauthorized',
        // walkme java script
        walkmeJSSnippet : '',
        evergageDataset: null,
    });
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
    console.log("Run time configuration: " + configuration.env + '; UID: ' + configuration.uid);
}

export default configuration;
