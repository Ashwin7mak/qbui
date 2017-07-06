var createConfigForBrowser = require('./helpers').createConfigForBrowser;

exports.config = createConfigForBrowser({
    //For iOS
    appiumVersion: '1.6.4',
    deviceName: 'iPad Air 2',
    deviceOrientation: 'landscape',
    platformVersion: '10.2',
    platformName: 'iOS',
    networkConnectionEnabled: 'true',
    browserName: 'safari',
    automationName: 'Appium',
    exclude: [
        './wdio/tests/reports/reportDeleteRecord.e2e.spec.js',
        //TODO inLineedit there is no functionality for touch devices atleast for now
        './wdio/tests/reports/reportEditRecord.e2e.spec.js',
        //TODO sortingGrouping tests fail due to MC-2463(column header dropdown flashes only on medium BP)
        './wdio/tests/reports/grouping/reportGroupingViaColumnHeader.e2e.spec.js',
        './wdio/tests/reports/sorting/reportSortingViaColumnHeader.e2e.spec.js'
    ]
});
