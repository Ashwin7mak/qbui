(function() {
    'use strict';
    var e2ePageBase = requirePO('./e2ePageBase');

    var loadingSpinner = Object.create(e2ePageBase, {
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
    });

    module.exports = new loadingSpinner();
}());
