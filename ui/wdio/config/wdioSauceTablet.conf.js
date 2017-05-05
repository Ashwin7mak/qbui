var baseConf = require('./wdioSauce.conf');
var config = {
    capabilities: [
        {
            maxInstances: 1,
            //For tablet capabilities
            appiumVersion: '1.6.4',
            platformName: 'Android',
            platformVersion: '6.0',
            browserName: 'Browser',
            deviceName: 'Samsung Galaxy S7 Device',
            deviceOrientation: 'landscape',
            tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
            build           : 'WebdriverIO Jenkins Try Build #' + process.env.BUILD_NUMBER + ' - Git branch: ' + process.env.GIT_UIBRANCH + ' - Android Chrome Browser',
            tags            : [process.env.SAUCE_JOB_NAME + '_Android_Safari', 'try', 'Android', 'Chrome', process.env.BUILD_NUMBER, process.env.GIT_UIBRANCH],
        }
        //{
        //    maxInstances: 5,
        //    //For IPAD capabilities
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
        //}
    ]
};
var exportConfig = Object.assign(baseConf.config, config);
exports.config = exportConfig;
