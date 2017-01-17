// Global variable that allows you to set wdio to use a realm defined in your node config file
// (see onPrepare hook below)
var localConf;

exports.config = {
    //
    // ========================
    // Sauce Labs Configuration
    // ========================
    // Define all options that are relevant for connecting WebdriverIO to Sauce Labs via Sauce Connect here
    //
    protocol: 'http',
    user: 'QuickBaseNS',
    key: process.env.SAUCE_KEY,
    sauceConnect: true,
    sauceConnectOpts: {
        tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
        verbose         : true,
        logger          : console.log
        // Uncomment this if you are running Sauce against your local dev
        //dns             : '127.0.0.1',
        //TODO: Figure out how to use custom Selenium port (see TODO below)
        //port            : 4400
    },
    //
    //
    // =============================
    // Selenium Server Configuration
    // =============================
    // Define all options that are relevant for connecting WebdriverIO to a Sauce Labs Selenium Server here
    //
    //host: '127.0.0.1',
    //TODO: Figure out how to use custom Selenium port
    //Known issue here (wdio team currently fixing): https://github.com/webdriverio/webdriverio/issues/1683
    //port: 4400,
    //path: '/wd/hub',
    //
    // ============
    // Debug config
    // ============
    // Change this option to true if you want to run tests in debug mode either using IntelliJ breakpoints
    // or WebdriverIO's browser.debug() command within your spec files
    // See http://webdriver.io/guide/testrunner/debugging.html for more info.
    //
    debug: false,
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
        // specs to run are overwritten by the wdio grunt plugin. See Gruntfile.js 'webdriver' task
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
    capabilities: [
        //TODO Chrome is not stable in sauce labs . So will deal this as seperate PR.
        {
            platform : 'OS X 10.11',
            browserName     : 'chrome',
            version: '54.0',
            tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
            name            : process.env.SAUCE_JOB_NAME + '_OSX_Chrome',
           //Timeout in seconds for Sauce Labs to wait for another command (bumped this for sleeps in tests)
            idleTimeout: '120',
            screenResolution : '1600x1200',
            maxDuration: 10800,
            breakpointSize: 'xlarge',
           // These two values enable parallel testing which will run a spec file per instance
            shardTestFiles: true,
            maxInstances: 2
         },
        // {
        //     platform: 'OS X 10.11',
        //     browserName: 'safari',
        //     version: '10.0',
        //     tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
        //     name: process.env.SAUCE_JOB_NAME + '_OSX_Safari',
        //     screenResolution : '1600x1200',
        //     //Timeout in seconds for Sauce Labs to wait for another command (bumped this for sleeps in tests)
        //     idleTimeout: '180',
        //     maxDuration: 10800,
        //     breakpointSize: 'large',
        //     shardTestFiles: true,
        //     maxInstances: 2
        // },
        //TODO firefox setValue not triggering onChange or blur for muneric and duration fields. Will work as seperate PR
        // {
        //     platform: 'OS X 10.11',
        //     browserName: 'firefox',
        //     version: '46.0',
        //     tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
        //     name: process.env.SAUCE_JOB_NAME + '_OSX_Firefox',
        //     screenResolution : '1600x1200',
        //    //Timeout in seconds for Sauce Labs to wait for another command (bumped this for sleeps in tests)
        //     idleTimeout: '180',
        //     maxDuration: 10800,
        //     breakpointSize: 'large',
        //     shardTestFiles: true,
        //     maxInstances: 2
        // },
        // {
        //     platform: 'Windows 10',
        //     browserName: 'MicrosoftEdge',
        //     version: '14.14393',
        //     tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
        //     name: process.env.SAUCE_JOB_NAME + '_Win10_MicrosoftEdge',
        //     screenResolution : '1600x1200',
        //     //Timeout in seconds for Sauce Labs to wait for another command (bumped this for sleeps in tests)
        //     idleTimeout: '280',
        //     maxDuration: 10800,
        //     breakpointSize: 'xlarge',
        //     shardTestFiles: true,
        //     maxInstances: 2
        // }
    ],
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
    screenshotPath: './wdio/screenshots/',
    //
    // Set a base URL in order to shorten url command calls. If your url parameter starts
    // with "/", then the base url gets prepended.
    baseUrl: process.env.SAUCE_DOMAIN,
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 60000,
    //
    // Default timeout in milliseconds for request
    // if Selenium Grid doesn't send response
    connectionRetryTimeout: 130000,
    //
    // Default request retries count
    connectionRetryCount: 6,
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
    services: ['sauce'],
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
    reporters: ['spec', 'junit'],
    reporterOptions: {
        junit: {
            outputDir: './ui/wdio/junitOutput'
        }
    },
    //
    // Options to be passed to Jasmine.
    jasmineNodeOpts: {
        //
        // Jasmine default timeout
        defaultTimeoutInterval: 1200000,
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
        console.log('onPrepare function - Starting up Node');
        //Have the tests start an instance of node
        require('../../server/src/app');

        // This setting allow devs to gendata / e2etest to a single known realm not random as needed for testing
        // by setting realmToUse in e2e.conf file and then supplying the E2E_CUSTOMCONFIG env var
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
        browser.logger.info('after function - Cleaning up the test realm');
        return e2eBase.cleanup();
    }
    //
    // Gets executed after all workers got shut down and the process is about to exit. It is not
    // possible to defer the end of the process using a promise.
    // onComplete: function(exitCode) {
    // }
};
