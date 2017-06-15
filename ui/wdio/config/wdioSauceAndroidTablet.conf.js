var baseConf = require('./wdioSauce.conf');
var config = {
    capabilities: [
        {
            maxInstances: 5,
            //For Android
            browserName: 'Chrome',
            appiumVersion: '1.6.4',
            platformName: 'Android',
            platformVersion: '6.0',
            deviceName: 'Android GoogleAPI Emulator',
            deviceType: 'tablet',
            deviceOrientation: 'landscape',
            automationName: 'Appium',
            tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
            build           : 'WebdriverIO Jenkins Try Build #' + process.env.BUILD_NUMBER + ' - Git branch: ' + process.env.GIT_UIBRANCH + ' - Android Tablet Chrome Browser',
            tags            : [process.env.SAUCE_JOB_NAME + '_Android_Tablet_Chrome', 'try', 'Android_Tablet', 'Chrome', process.env.BUILD_NUMBER, process.env.GIT_UIBRANCH],
            exclude: [
                //TODO: in-line edit there is no functionality for touch devices at least for now
                './wdio/tests/reports/reportEditRecord.e2e.spec.js',
                //TODO: forms tests fail due to MC-1820
                './wdio/tests/forms/formAdd.e2e.spec.js',
                './wdio/tests/forms/formAddValidation.e2e.spec.js',
                './wdio/tests/forms/formEdit.e2e.spec.js',
                './wdio/tests/forms/formEditValidation.e2e.spec.js'
            ]
        }
    ]
};
var exportConfig = Object.assign(baseConf.config, config);
exports.config = exportConfig;
