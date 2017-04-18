(function() {
    'use strict';

    module.exports = Object.create(e2ePageBase, {
        center: {
            get: function() {
                return browser.element('.topNav .center');
            }
        },
        formBuilderBtn: {
            get: function() {
                return browser.element('.topNav .dropdown');
            }
        },
        modifyThisForm: {
            get: function() {
                return browser.element('.topNav .modifyForm');
            }
        },
    });
}());
