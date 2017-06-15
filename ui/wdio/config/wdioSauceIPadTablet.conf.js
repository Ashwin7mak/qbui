var baseConf = require('./wdioSauce.conf');
var config = {
    capabilities: [
        {
            maxInstances: 5,
            //For iOS
            appiumVersion: '1.6.4',
            deviceName: 'iPad Air 2',
            deviceOrientation: 'landscape',
            platformVersion: '10.2',
            platformName: 'iOS',
            networkConnectionEnabled: 'true',
            browserName: 'safari',
            automationName: 'Appium',
            tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
            build           : 'WebdriverIO Jenkins Try Build #' + process.env.BUILD_NUMBER + ' - Git branch: ' + process.env.GIT_UIBRANCH + ' - iPad Safari Browser',
            tags            : [process.env.SAUCE_JOB_NAME + '_iOS_iPad', 'try', 'iOS', 'iPad', process.env.BUILD_NUMBER, process.env.GIT_UIBRANCH],
            exclude: [
                './wdio/tests/reports/reportDeleteRecord.e2e.spec.js',
                //TODO inLineedit there is no functionality for touch devices atleast for now
                './wdio/tests/reports/reportEditRecord.e2e.spec.js',
                //TODO sortingGrouping tests fail due to MC-2463(column header dropdown flashes only on medium BP)
                './wdio/tests/reports/grouping/reportGroupingViaColumnHeader.e2e.spec.js',
                './wdio/tests/reports/sorting/reportSortingViaColumnHeader.e2e.spec.js'
            ]
        }
    ]
};
var exportConfig = Object.assign(baseConf.config, config);
exports.config = exportConfig;
