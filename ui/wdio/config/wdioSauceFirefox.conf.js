var createConfigForBrowser = require('./helpers').createConfigForBrowser;

exports.config = createConfigForBrowser({
    browserName: 'firefox',
    marionette: 'false',
    breakpointSize: 'large'
});
