
var localConf;
exports.config = {
    // ============
    // Debug config
    // ============
    // Change this option to true if you want to run tests in debug mode either using IntelliJ breakpoints
    // or WebdriverIO's browser.debug() command within your spec files
    // See http://webdriver.io/guide/testrunner/debugging.html for more info.
    debug: true,

    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called. Notice that, if you are calling `wdio` from an
    // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
    // directory is where your package.json resides, so `wdio` will be called from there.
    //
    specs: [
        './ui/wdio/tests/mobile/reportSortingViaContainer.e2e.spec.js'
    ],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],

    //appium server listens on this server and port when you run tests locally
    host: 'localhost',
    port: 4723,

    maxInstances: 10,

    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://docs.saucelabs.com/reference/platforms-configurator
    //
    capabilities: [{
        maxInstances: 1,
        platformName: 'iOS',
        browserName: 'safari',
        deviceName: 'iPhone 5s',
    }],
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // By default WebdriverIO commands are executed in a synchronous way using
    // the wdio-sync package. If you still want to run your tests in an async way
    // e.g. using promises you can set the sync option to false.
    sync: true,

    // Level of logging verbosity: silent | verbose | command | data | result | error
    logLevel: 'verbose',

    // Enables colors for log output.
    coloredLogs: true,

    // Saves a screenshot to a given path if a command fails.
    screenshotPath: './ui/wdio/screenshots/',

    // Set a base URL in order to shorten url command calls. If your url parameter starts
    // with "/", then the base url gets prepended.
    baseUrl: 'http://localhost:9001',

    // Default timeout for all waitFor* commands.
    waitforTimeout: 30000,

    // Default timeout in milliseconds for request
    // if Selenium Grid doesn't send response
    connectionRetryTimeout: 90000,

    // Default request retries count
    connectionRetryCount: 3,

    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    services: ['appium', 'selenium-standalone', 'firefox-profile'],

    // Firefox profile enabled by wdio-firefox-profile-service
    // Firefox does not fire certain blur events when Firefox window does not have OS level focus. The following
    // setting enable blur events to fire during e2e tests even when the window does not have OS level focus.
    firefoxProfile: {
        'focusmanager.testmode': true
    },

    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: http://webdriver.io/guide/testrunner/frameworks.html
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'jasmine',

    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: http://webdriver.io/guide/testrunner/reporters.html
    reporters: ['spec', 'junit'],
    reporterOptions: {
        junit: {
            outputDir: './ui/wdio/output'
        }
    },

    // Options to be passed to Jasmine.
    jasmineNodeOpts: {
        //
        // Jasmine default timeout
        defaultTimeoutInterval: 120000,
        expectationResultHandler: function(passed, assertion) {
            // do something
        }
    },

    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    //
    // Gets executed once before all workers get launched.
    onPrepare: function(config, capabilities) {
        // browser object has not been created yet so need to use console.log here
        console.log('onPrepare function hook - Starting up Node');
        //Have the tests start an instance of node
        require('../../server/src/app');
        if (process.env.E2E_CUSTOMCONFIG === 'true') {
            localConf = require('../../server/src/config/environment');
        }
    },

    // Gets executed before test execution begins. At this point you can access all global
    // variables, such as `browser`. It is the perfect place to define custom commands.
    before: function(capabilities, specs) {
        browser.logger.info('before function hook - Setting up e2eBase, services and utilities');
        var baseE2EPath = '../../wdio/';
        var e2eUtils = require('../common/e2eUtils')();
        global.requirePO = function(relativePath) {
            return require(baseE2EPath + 'pages/' + relativePath + '.po.js');
        };

        global.requireMobilePO = function(relativePath) {
            return require(baseE2EPath + 'pages/mobile/' + relativePath + '.po.js');
        };

        global.requireCommon = function(relativePath) {
            return require(baseE2EPath + relativePath + '.js');
        };

        if (localConf) {
            global.e2eBase = requireCommon('common/e2eBase')(localConf);
        } else {
            global.e2eBase = requireCommon('common/e2eBase')();

            global.e2eBase.setBaseUrl(this.baseUrl);
        }
        global.e2eConsts = requireCommon('common/e2eConsts');
        global.e2eUtils = requireCommon('common/e2eUtils')();
        global.consts = require('../../common/src/constants');
        global.e2ePageBase = require('../pages/e2ePageBase.po');
        global.browserName = browser.desiredCapabilities.browserName;
        return e2eBase.initialize();
    },

    // Gets executed after all tests are done. You still have access to all global variables from
    // the test.
    after: function(result, capabilities, specs) {
        browser.logger.info('after function hook - Cleaning up the test realm');
        // return e2eBase.cleanup();
    }
};
