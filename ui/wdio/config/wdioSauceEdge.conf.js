var createConfigForBrowser = require('./helpers').createConfigForBrowser;

exports.config = createConfigForBrowser({
    platform: 'Windows 10',
    browserName: 'MicrosoftEdge',
    screenResolution: '2560x1600',
});
