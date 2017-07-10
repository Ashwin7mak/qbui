var baseConf = require('./wdioSauce.conf');

var buildNumber = (process.env.BUILD_NUMBER ? process.env.BUILD_NUMBER : '123');
var gitBranch = (process.env.GIT_UIBRANCH ? process.env.GIT_UIBRANCH : 'localDevRun');

var defaultCapabilitySettings = {
    platform: 'OS X 10.12',
    browserName: 'chrome',
    tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
    screenResolution: '2048x1536',
    // Timeout in seconds for Sauce Labs to wait for another command (bumped this for sleeps in tests)
    idleTimeout: '180',
    maxDuration: 10800,
    breakpointSize: 'xlarge',
    // These two values enable parallel testing which will run a spec file per instance
    shardTestFiles: true,
    maxInstances: 10
};

function slugifyTag(tag) {
    return tag.replace(/[\s.]/g, '_');
}

module.exports = {
    /**
     * Creates a SauceLabs configuration for a particular browser.
     * @param customCapabilitySettings - See defaultCapabilitySettings in this file as an example.
     * You can override any of those values or add additional values.
     * @returns {*}
     */
    createConfigForBrowser: (customCapabilitySettings = {browserName: 'chrome'}) => {
        var capability = Object.assign({}, defaultCapabilitySettings, customCapabilitySettings);

        // Mobile tests use platformName and browser tests use platform
        var platform = capability.platformName || capability.platform;

        // Without device name example: 'OS X 10.12 chrome'
        // With device name example: 'iOS iPad Air 2 safari'
        var customBuildName = ` - ${platform}${capability.deviceName ? ` ${capability.deviceName}` : ''} ${capability.browserName}`;

        // Without device name example: '_OS_X_10_12_chrome'
        // With device name example: '_iOS_iPad_Air_2_safari'
        var platformFullName = slugifyTag(`_${platform}${capability.deviceName ? `_${capability.deviceName}` : ''}_${capability.browserName}`);

        capability.build = 'WebdriverIO Jenkins Try Build #' + buildNumber + ' - Git branch: ' + gitBranch + customBuildName;
        capability.tags = [process.env.SAUCE_JOB_NAME + platformFullName, 'try', platform, capability.browserName, buildNumber, gitBranch];

        return Object.assign({}, baseConf.config, {capabilities: [capability]});
    }
};
