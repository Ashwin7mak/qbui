var createConfigForBrowser = require('./helpers').createConfigForBrowser;

exports.config = createConfigForBrowser({
    //For Android
    browserName: 'Chrome',
    appiumVersion: '1.6.4',
    platformName: 'Android',
    platformVersion: '6.0',
    deviceName: 'Android GoogleAPI Emulator',
    deviceType: 'tablet',
    deviceOrientation: 'landscape',
    automationName: 'Appium',
    exclude: [
        //TODO: in-line edit there is no functionality for touch devices at least for now
        './wdio/tests/reports/reportEditRecord.e2e.spec.js',
        //TODO: forms tests fail due to MC-1820
        './wdio/tests/forms/formAdd.e2e.spec.js',
        './wdio/tests/forms/formAddValidation.e2e.spec.js',
        './wdio/tests/forms/formEdit.e2e.spec.js',
        './wdio/tests/forms/formEditValidation.e2e.spec.js'
    ]
});
