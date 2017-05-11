/**
 * Created by cperikal on 5/8/17.
 */

var localConf;
exports.config = {
    debug: true,

    specs: [
        // REPORTS
        // './ui/wdio/tests/reports/reportTable.e2e.spec.js',
        // './ui/wdio/tests/reports/reportSearch.e2e.spec.js',
        // './ui/wdio/tests/reports/reportTopNav.e2e.spec.js',
        // './ui/wdio/tests/reports/reportDeleteRecord.e2e.spec.js',
        //'./ui/wdio/tests/reports/grouping/reportGroupingViaContainer.e2e.spec.js',
        //'./ui/wdio/tests/reports/sorting/reportSortingViaContainer.e2e.spec.js'
        //'./ui/wdio/tests/reports/reportNavigation.e2e.spec.js',
        // Bugs
        //'./ui/wdio/tests/reports/reportEditRecord.e2e.spec.js',
        //'./ui/wdio/tests/reports/grouping/reportGroupingViaColumnHeader.e2e.spec.js',
        //'./ui/wdio/tests/reports/sorting/reportSortingViaColumnHeader.e2e.spec.js',
        // TABLES
        //'./ui/wdio/tests/tables/tableHomePage.e2e.spec.js',
        //'./ui/wdio/tests/tables/tableCreate.e2e.spec.js',
        //'./ui/wdio/tests/tables/tableEdit.e2e.spec.js',
        // USERS
        //'./ui/wdio/tests/users/usersTable.e2e.spec.js',
        //'./ui/wdio/tests/forms/formBuilder.e2e.spec.js',
        // './ui/wdio/tests/forms/cardViewTests/formCardView.e2e.spec.js',
        // MOBILE
        // './ui/wdio/tests/mobile/reportSortingViaContainer.e2e.spec.js'
        './ui/wdio/tests/mobile/reportTopNav.e2e.spec.js',
    ],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    host: 'localhost',
    port: 4723,
    maxInstances: 10,
    capabilities: [{
        maxInstances: 1,

        //For IPHONE capabilities
        platformName: 'iOS',
        browserName: 'safari',
        deviceName: 'iPhone 5s',

        //For IPAD capabilities
        // platformName: 'iOS',
        // browserName: 'safari',
        // deviceName: 'iPad 2',
        // deviceOrientation: 'landscape',
        // automationName: 'Appium'

        // browserName: 'Chrome',
        // 'appium-version': '1.6',
        // platformName: 'Android',
        // deviceName: 'Android',
        // app: undefined // will be set later
    }],
    sync: true,
    logLevel: 'verbose',
    coloredLogs: true,
    screenshotPath: './ui/wdio/screenshots/',
    baseUrl: 'http://localhost:9001',
    waitforTimeout: 30000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    services: ['appium', 'selenium-standalone', 'firefox-profile'],
    firefoxProfile: {
        'focusmanager.testmode': true
    },

    framework: 'jasmine',
    reporters: ['spec', 'junit'],
    reporterOptions: {
        junit: {
            outputDir: './ui/wdio/output'
        }
    },

    jasmineNodeOpts: {
        //
        // Jasmine default timeout
        defaultTimeoutInterval: 600000,
        expectationResultHandler: function(passed, assertion) {
            // do something
        }
    },

    onPrepare: function(config, capabilities) {
        // browser object has not been created yet so need to use console.log here
        console.log('onPrepare function hook - Starting up Node');
        //Have the tests start an instance of node
        require('../../server/src/app');
        if (process.env.E2E_CUSTOMCONFIG === 'true') {
            localConf = require('../../server/src/config/environment');
        }
    },
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
    after: function(result, capabilities, specs) {
        browser.logger.info('after function hook - Cleaning up the test realm');
        // return e2eBase.cleanup();
    }
};