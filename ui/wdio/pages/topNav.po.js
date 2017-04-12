(function() {
    'use strict';

    module.exports = Object.create(e2ePageBase, {
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
