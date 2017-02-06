var baseConf = require('./wdioSauce.conf');
var config = {
    capabilities: [
        {
            platform: 'Windows 10',
            browserName: 'MicrosoftEdge',
            version: '14.14393',
            tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
            name: process.env.SAUCE_JOB_NAME + '_Win10_MicrosoftEdge',
            screenResolution: '1600x1200',
            //Timeout in seconds for Sauce Labs to wait for another command (bumped this for sleeps in tests)
            idleTimeout: '280',
            maxDuration: 10800,
            breakpointSize: 'xlarge',
            // These two values enable parallel testing which will run a spec file per instance
            shardTestFiles: true,
            maxInstances: 2
        }
    ]
};
var exportConfig = Object.assign(baseConf.config, config);
exports.config = exportConfig;
