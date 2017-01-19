const baseConf = require('./wdioSauce.conf');
const config = {
    capabilities: [
        {
            platform: 'OS X 10.11',
            browserName: 'firefox',
            version: '46.0',
            tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
            name: process.env.SAUCE_JOB_NAME + '_OSX_Firefox',
            screenResolution : '1600x1200',
            //Timeout in seconds for Sauce Labs to wait for another command (bumped this for sleeps in tests)
            idleTimeout: '180',
            maxDuration: 10800,
            breakpointSize: 'large',
            shardTestFiles: true,
            maxInstances: 2
        }
    ]
};

let exportConfig = Object.assign(baseConf.config, config);
exports.config = exportConfig;