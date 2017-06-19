var baseConf = require('./wdioSauce.conf');
var config = {
    capabilities: [
        {
            platform: 'Windows 10',
            browserName: 'MicrosoftEdge',
            tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
            build           : 'WebdriverIO Jenkins Try Build #' + process.env.BUILD_NUMBER + ' - Git branch: ' + process.env.GIT_UIBRANCH + ' - Windows 10 Edge Browser',
            tags            : [process.env.SAUCE_JOB_NAME + '_Win10_Edge', 'try', 'Win10', 'Edge', process.env.BUILD_NUMBER, process.env.GIT_UIBRANCH],
            screenResolution: '2560x1600',
            // Timeout in seconds for Sauce Labs to wait for another command (bumped this for sleeps in tests)
            idleTimeout: '180',
            maxDuration: 10800,
            breakpointSize: 'xlarge',
            // These two values enable parallel testing which will run a spec file per instance
            shardTestFiles: true,
            maxInstances: 10
        }
    ]
};
var exportConfig = Object.assign(baseConf.config, config);
exports.config = exportConfig;
