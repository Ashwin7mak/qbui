(function() {
    'use strict';
    var e2ePageBase = requirePO('./e2ePageBase');

    module.exports = Object.create(e2ePageBase, {
        /**
         * Method for spinner to dissaper
         */
        waitUntilLoadingSpinnerGoesAway: {
            value: function() {
                //wait until loading screen disappear
                browser.waitForExist('.loading .loader .spinner', e2eConsts.extraLongWaitTimeMs, true);
                //Need this to stabilize DOM
                return browser.pause(e2eConsts.shortWaitTimeMs);
            }},

        /**
         * Method for spinner to dissaper in leftNav
         */
        waitUntilLeftNavSpinnerGoesAway: {
            value: function() {
                //wait until loading screen disappear
                browser.waitForVisible('.leftNav .loader .spinner', e2eConsts.longWaitTimeMs, true);
                //Need this to wait for leftNav labels to load
                return browser.pause(e2eConsts.shortWaitTimeMs);
            }},

        /**
         * Method for spinner to dissaper in report content
         */
        waitUntilReportLoadingSpinnerGoesAway: {
            value: function() {
                //wait until report loading screen disappear
                browser.waitForVisible('.reportContent .loader .spinner', e2eConsts.longWaitTimeMs, true);
                //Need this to stabilize DOM
                return browser.pause(e2eConsts.shortWaitTimeMs);
            }},

        /**
         * Method for spinner to dissaper in record content
         */
        waitUntilRecordLoadingSpinnerGoesAway: {
            value: function() {
                //wait until report loading screen disappear
                browser.waitForVisible('.recordContainer .loader .spinner', e2eConsts.longWaitTimeMs, true);
                //Need this to stabilize DOM
                return browser.pause(e2eConsts.shortWaitTimeMs);
            }},
    });
}());
