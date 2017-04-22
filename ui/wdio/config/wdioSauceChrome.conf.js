var baseConf = require('./wdioSauce.conf');
var config = {
    capabilities: [
        //{
        //    platform : 'OS X 10.11',
        //    browserName     : 'chrome',
        //    version: '57.0',
        //    tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
        //    build           : 'WebdriverIO Jenkins Try Build #' + process.env.BUILD_NUMBER + ' - Git branch: ' + process.env.GIT_UIBRANCH + ' - OSX Chrome Browser',
        //    tags            : [process.env.SAUCE_JOB_NAME + '_OSX_Chrome', 'try', 'OSX', 'Chrome', process.env.BUILD_NUMBER, process.env.GIT_UIBRANCH],
        //    screenResolution : '2048x1536',
        //    // Timeout in seconds for Sauce Labs to wait for another command (bumped this for sleeps in tests)
        //    idleTimeout: '180',
        //    maxDuration: 10800,
        //    breakpointSize: 'xlarge',
        //    // These two values enable parallel testing which will run a spec file per instance
        //    shardTestFiles: true,
        //    maxInstances: 4
        //}
        //{
        //    browserName: 'safari',
        //    appiumVersion: '1.5.3',
        //    deviceName: 'iPhone 6 Device',
        //    deviceOrientation: 'portrait',
        //    platformVersion: '9.3',
        //    platformName: 'iOS',
        //    tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
        //    build           : 'WebdriverIO Jenkins Try Build #' + process.env.BUILD_NUMBER + ' - Git branch: ' + process.env.GIT_UIBRANCH + ' - OSX iPhone Browser',
        //    tags            : [process.env.SAUCE_JOB_NAME + '_OSX_iPhone', 'try', 'OSX', 'iPhone', process.env.BUILD_NUMBER, process.env.GIT_UIBRANCH],
        //}
        {
            iOSClient: {
                port: 4723,
                desiredCapabilities: {
                    maxInstances: 1,
                    browserName: 'Safari',
                    appiumVersion: '1.5.3',
                    platformName: 'iOS',
                    deviceName: 'iPad Pro Device',
                    platformVersion: '9.3',
                    tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
                    build           : 'WebdriverIO Jenkins Try Build #' + process.env.BUILD_NUMBER + ' - Git branch: ' + process.env.GIT_UIBRANCH + ' - OSX iPad Browser',
                    tags            : [process.env.SAUCE_JOB_NAME + '_OSX_iPad', 'try', 'OSX', 'iPad', process.env.BUILD_NUMBER, process.env.GIT_UIBRANCH],
                }
            }
        }
    ]
};
var exportConfig = Object.assign(baseConf.config, config);
exports.config = exportConfig;
