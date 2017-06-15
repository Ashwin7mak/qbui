var baseConf = require('./wdioSauce.conf');

var buildNumber = (process.env.BUILD_NUMBER ? process.env.BUILD_NUMBER : '123');
var gitBranch = (process.env.GIT_UIBRANCH ? process.env.GIT_UIBRANCH : 'localDevRun');

var defaultSettings = {
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
    maxInstances: 5
};

module.exports = {
    createConfigForBrowser: (customSettings = {browserName: 'chrome', platform: 'OS X 10.12'}) => {
        var settings = Object.assign({}, defaultSettings, customSettings);

        var platform = settings.platformName || settings.platform;

        // Without device name example: 'OS X 10.12 chrome'
        // With device name example: 'iOS iPad Air 2 safari'
        var customBuildName = ` - ${platform}${settings.deviceName ? ` ${settings.deviceName}` : ''} ${settings.browserName}`;

        // Without device name example: '_OS_X_10_12_chrome'
        // With device name example: '_iOS_iPad_Air_2_safari'
        var platformFullName = `_${platform.replace(/[/s.]/, '_')}${settings.deviceName ? `_${settings.deviceName.replace(/[/s.]/, '_')}` : ''}_${settings.browserName}`;

        var customTagAndBuildInfo = {
            build: 'WebdriverIO Jenkins Try Build #' + buildNumber + ' - Git branch: ' + gitBranch + customBuildName,
            tags: [process.env.SAUCE_JOB_NAME + platformFullName, 'try', platform, settings.browserName, buildNumber, gitBranch],
        };

        return Object.assign({}, baseConf.config, settings, customTagAndBuildInfo);
    }
};
