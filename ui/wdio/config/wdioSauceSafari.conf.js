var baseConf = require('./wdioSauce.conf');
var config = {
    capabilities: [
        //{
        //    platform: 'OS X 10.11',
        //    browserName: 'safari',
        //    version: '10.0',
        //    tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
        //    build           : 'WebdriverIO Jenkins Try Build #' + process.env.BUILD_NUMBER + ' - Git branch: ' + process.env.GIT_UIBRANCH + ' - OSX Safari Browser',
        //    tags            : [process.env.SAUCE_JOB_NAME + '_OSX_Safari', 'try', 'OSX', 'Safari', process.env.BUILD_NUMBER, process.env.GIT_UIBRANCH],
        //    screenResolution: '1600x1200',
        //    // Timeout in seconds for Sauce Labs to wait for another command (bumped this for sleeps in tests)
        //    idleTimeout: '180',
        //    maxDuration: 10800,
        //    breakpointSize: 'xlarge',
        //    // These two values enable parallel testing which will run a spec file per instance
        //    shardTestFiles: true,
        //    maxInstances: 5
        //}
        //{
        //    maxInstances: 1,
        //    //For tablet capabilities
        //    appiumVersion: '1.6.4',
        //    platformName: 'Android',
        //    platformVersion: '4.4',
        //    browserName: 'Browser',
        //    deviceName: 'Samsung Galaxy Nexus Emulator',
        //    deviceOrientation: 'landscape',
        //    tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
        //    build           : 'WebdriverIO Jenkins Try Build #' + process.env.BUILD_NUMBER + ' - Git branch: ' + process.env.GIT_UIBRANCH + ' - Android Chrome Browser',
        //    tags            : [process.env.SAUCE_JOB_NAME + '_Android_Safari', 'try', 'Android', 'Chrome', process.env.BUILD_NUMBER, process.env.GIT_UIBRANCH],
        //}
        {
            maxInstances: 1,
            //For IPAD capabilities
            appiumVersion: '1.6.4',
            deviceName: 'iPad Air 2',
            deviceOrientation: 'landscape',
            platformVersion: '9.3',
            platformName: 'iOS',
            networkConnectionEnabled: 'true',
            browserName: 'safari',
            automationName: 'Appium',
            tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
            build           : 'WebdriverIO Jenkins Try Build #' + process.env.BUILD_NUMBER + ' - Git branch: ' + process.env.GIT_UIBRANCH + ' - iOS Safari Browser',
            tags            : [process.env.SAUCE_JOB_NAME + '_iOS_Safari', 'try', 'iOS', 'Safari', process.env.BUILD_NUMBER, process.env.GIT_UIBRANCH],
        }
    ]
};
var exportConfig = Object.assign(baseConf.config, config);
exports.config = exportConfig;
