var createConfigForBrowser = require('./helpers').createConfigForBrowser;

exports.config = createConfigForBrowser({
    browserName: 'safari',
    screenResolution: '1600x1200',
});
