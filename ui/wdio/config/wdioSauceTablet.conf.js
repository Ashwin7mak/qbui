var baseConf = require('./wdioSauce.conf');
var config = {
    capabilities: [
        {
            maxInstances: 5,
            //For Android
            browserName: 'Chrome',
            appiumVersion: '1.6.4',
            platformName: 'Android',
            deviceName: 'Android GoogleAPI Emulator',
            deviceType: 'tablet',
            deviceOrientation: 'landscape',
            platformVersion: '6.0',
            automationName: 'Appium',
            tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
            build           : 'WebdriverIO Jenkins Try Build #' + process.env.BUILD_NUMBER + ' - Git branch: ' + process.env.GIT_UIBRANCH + ' - Android Chrome Browser',
            tags            : [process.env.SAUCE_JOB_NAME + '_Android_Chrome', 'try', 'Android', 'Chrome', process.env.BUILD_NUMBER, process.env.GIT_UIBRANCH],
        },
        //{
        //    maxInstances: 5,
        //    //For iOS
        //    appiumVersion: '1.6.4',
        //    deviceName: 'iPad Air 2',
        //    deviceOrientation: 'landscape',
        //    platformVersion: '9.3',
        //    platformName: 'iOS',
        //    networkConnectionEnabled: 'true',
        //    browserName: 'safari',
        //    automationName: 'Appium',
        //    tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
        //    build           : 'WebdriverIO Jenkins Try Build #' + process.env.BUILD_NUMBER + ' - Git branch: ' + process.env.GIT_UIBRANCH + ' - iOS Safari Browser',
        //    tags            : [process.env.SAUCE_JOB_NAME + '_iOS_Safari', 'try', 'iOS', 'Safari', process.env.BUILD_NUMBER, process.env.GIT_UIBRANCH],
        //    exclude: [
        //        //TODO there are bugs associated with these in jira
        //        './wdio/tests/reports/reportDeleteRecord.e2e.spec.js',
        //        './wdio/tests/reports/reportEditRecord.e2e.spec.js',
        //        './wdio/tests/reports/grouping/reportGroupingViaColumnHeader.e2e.spec.js',
        //        './wdio/tests/reports/sorting/reportSortingViaColumnHeader.e2e.spec.js',
        //    ]
        //}
    ]
};
var exportConfig = Object.assign(baseConf.config, config);
exports.config = exportConfig;
