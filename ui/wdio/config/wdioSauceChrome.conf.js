const baseConf = require('./wdioSauce.conf');
const config = {
    capabilities: [
        {
            platform : 'OS X 10.11',
            browserName     : 'chrome',
            version: '55.0',
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
        }
    ]
};

let exportConfig = Object.assign(baseConf.config, config);
exports.config = exportConfig;
