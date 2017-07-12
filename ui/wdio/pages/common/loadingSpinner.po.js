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
                browser.waitForExist('.loader .spinner', e2eConsts.extraLongWaitTimeMs, true);
                //Need this to stabilize DOM
                return browser.pause(e2eConsts.mediumWaitTimeMs);
            }},
    });
}());
