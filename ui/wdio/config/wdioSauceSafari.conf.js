var baseConf = require('./wdioSauce.conf');
var config = {
    capabilities: [
        {
            platform: 'OS X 10.12',
            browserName: 'safari',
            tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
            build           : 'WebdriverIO Jenkins Try Build #' + process.env.BUILD_NUMBER + ' - Git branch: ' + process.env.GIT_UIBRANCH + ' - OSX Safari Browser',
            tags            : [process.env.SAUCE_JOB_NAME + '_OSX_Safari', 'try', 'OSX', 'Safari', process.env.BUILD_NUMBER, process.env.GIT_UIBRANCH],
            screenResolution: '1600x1200',
            // Timeout in seconds for Sauce Labs to wait for another command (bumped this for sleeps in tests)
            idleTimeout: '180',
            maxDuration: 10800,
            breakpointSize: 'xlarge',
            // These two values enable parallel testing which will run a spec file per instance
            shardTestFiles: true,
            maxInstances: 10,
            exclude: [
                //mouseMove not working in firefox and edge
                './ui/wdio/tests/relationships/relationshipAddChildRecord.e2e.spec.js',
                './ui/wdio/tests/relationships/createSingleRelationship.e2e.spec.js',
                './ui/wdio/tests/relationships/createMultiRelationship.e2e.spec.js',
                './ui/wdio/tests/relationships/verifyCreateRelationshipDialog.e2e.spec.js',
                './ui/wdio/tests/relationships/createRelationshipWithUniqueRequiredField.e2e.spec.js',
            ]
        }
    ]
};
var exportConfig = Object.assign(baseConf.config, config);
exports.config = exportConfig;
