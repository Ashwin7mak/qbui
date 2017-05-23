var baseConf = require('./wdioSauce.conf');
var config = {
    capabilities: [
        {
            platform : 'OS X 10.12',
            browserName     : 'chrome',
            tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
            build           : 'WebdriverIO Jenkins Try Build #' + process.env.BUILD_NUMBER + ' - Git branch: ' + process.env.GIT_UIBRANCH + ' - OSX Chrome Browser',
            tags            : [process.env.SAUCE_JOB_NAME + '_OSX_Chrome', 'try', 'OSX', 'Chrome', process.env.BUILD_NUMBER, process.env.GIT_UIBRANCH],
            screenResolution : '2048x1536',
            // Timeout in seconds for Sauce Labs to wait for another command (bumped this for sleeps in tests)
            idleTimeout: '180',
            maxDuration: 10800,
            breakpointSize: 'xlarge',
            // These two values enable parallel testing which will run a spec file per instance
            shardTestFiles: true,
            maxInstances: 5
        }
    ]
};
var exportConfig = Object.assign(baseConf.config, config);
exports.config = exportConfig;
