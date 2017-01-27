// Global variable that allows you to set wdio to use a realm defined in your node config file
// (see onPrepare hook below)
var localConf;

exports.config = {
    // ============
    // Debug config
    // ============
    // Change this option to true if you want to run tests in debug mode either using IntelliJ breakpoints
    // or WebdriverIO's browser.debug() command within your spec files
    // See http://webdriver.io/guide/testrunner/debugging.html for more info.
    //
    debug: true,
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called. Notice that, if you are calling `wdio` from an
    // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
    // directory is where your package.json resides, so `wdio` will be called from there.
    //
    specs: [
        './ui/wdio/tests/reports/reportInlineReloadPageWithoutSaving.e2e.spec.js',
        './ui/wdio/tests/reports/reportEditRecord.e2e.spec.js',
        './qbui/ui/wdio/tests/reports/reportAddRecord.e2e.spec.js',
        //TODO: All form tests need to be refactored to work for qbGrid
        // '/Users/bstookey/Desktop/qbui/ui/wdio/tests/forms/*.e2e.spec.js'
    ],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    maxInstances: 10,
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://docs.saucelabs.com/reference/platforms-configurator
    //
    capabilities: [{
        // maxInstances can get overwritten per capability. So if you have an in-house Selenium
        // grid with only 5 firefox instances available you can make sure that not more than
        // 5 instances get started at a time.
        maxInstances: 1,
        // what browser instance you want to launch
        browserName: 'firefox',
        // Custom variable we use to set the size of the browser
        breakpointSize: 'large'
    }],
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // By default WebdriverIO commands are executed in a synchronous way using
    // the wdio-sync package. If you still want to run your tests in an async way
    // e.g. using promises you can set the sync option to false.
    sync: true,
    //
    // Level of logging verbosity: silent | verbose | command | data | result | error
    logLevel: 'verbose',
    //
    // Enables colors for log output.
    coloredLogs: true,
    //
    // Saves a screenshot to a given path if a command fails.
    screenshotPath: './ui/wdio/screenshots/',
    //
    // Set a base URL in order to shorten url command calls. If your url parameter starts
    // with "/", then the base url gets prepended.
    baseUrl: 'http://localhost:9001',
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 30000,
    //
    // Default timeout in milliseconds for request
    // if Selenium Grid doesn't send response
    connectionRetryTimeout: 90000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Initialize the browser instance with a WebdriverIO plugin. The object should have the
    // plugin name as key and the desired plugin options as properties. Make sure you have
    // the plugin installed before running any tests. The following plugins are currently
    // available:
    // WebdriverCSS: https://github.com/webdriverio/webdrivercss
    // WebdriverRTC: https://github.com/webdriverio/webdriverrtc
    // Browserevent: https://github.com/webdriverio/browserevent
    // plugins: {
    //     webdrivercss: {
    //         screenshotRoot: 'my-shots',
    //         failedComparisonsRoot: 'diffs',
    //         misMatchTolerance: 0.05,
    //         screenWidth: [320,480,640,1024]
    //     },
    //     webdriverrtc: {},
    //     browserevent: {}
    // },
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    services: ['selenium-standalone', 'firefox-profile'],
    // Firefox profile enabled by wdio-firefox-profile-service
    // Firefox does not fire certain blur events when Firefox window does not have OS level focus. The following
    // setting enable blur events to fire during e2e tests even when the window does not have OS level focus.
    firefoxProfile: {
        'focusmanager.testmode': true
    },
    //
    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: http://webdriver.io/guide/testrunner/frameworks.html
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'jasmine',
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: http://webdriver.io/guide/testrunner/reporters.html
    reporters: ['spec'],
    //
    // Options to be passed to Jasmine.
    jasmineNodeOpts: {
        //
        // Jasmine default timeout
        // defaultTimeoutInterval: 120000,
        defaultTimeoutInterval: 600000,
        //
        // The Jasmine framework allows interception of each assertion in order to log the state of the application
        // or website depending on the result. For example, it is pretty handy to take a screenshot every time
        // an assertion fails.
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

        // This setting allow devs to gendata / e2etest to a single known realm not random as needed for testing
        // by setting realmToUse in e2e.conf file and then supplying the E2E_CUSTOMCONFIG env var when running wdio
        if (process.env.E2E_CUSTOMCONFIG === 'true') {
            localConf = require('../../server/src/config/environment');
        }
    },
    //
    // Gets executed before test execution begins. At this point you can access all global
    // variables, such as `browser`. It is the perfect place to define custom commands.
    before: function(capabilities, specs) {
        browser.logger.info('before function hook - Setting up e2eBase, services and utilities');
        var baseE2EPath = '../../wdio/';
        var e2eUtils = require('../common/e2eUtils')();

        // Initialize all Page Objects
        global.requirePO = function(relativePath) {
            return require(baseE2EPath + 'pages/' + relativePath + '.po.js');
        };

        // Initialize all Common Files
        global.requireCommon = function(relativePath) {
            return require(baseE2EPath + relativePath + '.js');
        };

        // Initialize the base classes
        if (localConf) {
            // Pass down your config object to e2eBase -> recordApi.base -> api.base
            // api.base will use the DOMAIN param set in your config as the baseUrl if you pass a config object down through the stack
            global.e2eBase = requireCommon('common/e2eBase')(localConf);
        } else {
            // Get an instance of e2eBase (which gives you an instance of recordApi.base and api.base)
            // e2eBase then uses the instance of recordApi.base and initializes the services classes with this instance
            global.e2eBase = requireCommon('common/e2eBase')();
            // browser is a global object setup by protractor. baseUrl is a param that can be passed in via IntelliJ config or via grunt
            // since we aren't passing a config object set it here
            global.e2eBase.setBaseUrl(this.baseUrl);
        }
        global.e2eConsts = requireCommon('common/e2eConsts');
        global.e2eUtils = requireCommon('common/e2eUtils')();
        global.consts = require('../../common/src/constants');
        global.e2ePageBase = require('../pages/e2ePageBase.po');

        // Grab the browser name to use in spec files
        // See http://webdriver.io/guide/testrunner/browserobject.html for working with config file variables
        global.browserName = browser.desiredCapabilities.browserName;

        // Grab the browser settings from the capabilities object and set the browser size
        var browserDimensions = e2eUtils.getBrowserBreakpointDimensions(browser.desiredCapabilities.breakpointSize);
        global.breakpointSize = browserDimensions.breakpointSize;
        global.browserWidth = browserDimensions.browserWidth;
        global.browserHeight = browserDimensions.browserHeight;

        browser.logger.info('Setting browser size to ' + global.breakpointSize + ' breakpoint (' + global.browserWidth + ', ' + global.browserHeight + ')');
        browser.windowHandleSize({width: global.browserWidth, height: global.browserHeight});

        // recordApi.base (and api.base) will not initialize itself if you don't pass in a config object
        // This call creates a your test realm down in api.base
        return e2eBase.initialize();
    },
    //
    // Hook that gets executed before the suite starts
    // beforeSuite: function (suite) {
    // },
    //
    // Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
    // beforeEach in Mocha)
    // beforeHook: function () {
    // },
    //
    // Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
    // afterEach in Mocha)
    // afterHook: function () {
    // },
    //
    // Function to be executed before a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
    // beforeTest: function (test) {
    // },
    //
    // Runs before a WebdriverIO command gets executed.
    // beforeCommand: function (commandName, args) {
    // },
    //
    // Runs after a WebdriverIO command gets executed
    // afterCommand: function (commandName, args, result, error) {
    // },
    //
    // Function to be executed after a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
    // afterTest: function (test) {
    // },
    //
    // Hook that gets executed after the suite has ended
    // afterSuite: function (suite) {
    // },
    //
    // Gets executed after all tests are done. You still have access to all global variables from
    // the test.
    after: function(result, capabilities, specs) {
        browser.logger.info('after function hook - Cleaning up the test realm');
        return e2eBase.cleanup();
    }
    //
    // Gets executed after all workers got shut down and the process is about to exit. It is not
    // possible to defer the end of the process using a promise.
    // onComplete: function(exitCode) {
    // }
};
