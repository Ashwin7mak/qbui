/**
 * This file uses the Page Object pattern to define topNav page for test
 * cperikal 4/18/2017
 */
(function() {
    'use strict';
    //var Page = require('./page')
    //class topNav extends Page {
    module.exports = Object.create(e2ePageBase, {
        formBuilderBtn: {
            get: function() {
                return browser.element('.topNav .formBuilder');
            }
        },

        // get forBuilderBtn() { return browser.element('.topNav .formBuilder');}

        modifyThisForm: {
            get: function() {
                return browser.element('.topNav #modifyForm');
            }
        },

        navMenuEl: {
            get: function() {
                return browser.elements('.leftNav');
            }
        },
        topNavDivEl: {
            get: function() {
                return browser.element('.topNav');
            }
        },
        topNavToggleHamburgerEl: {
            get: function() {
                return browser.element('.topNav .iconLink');
            }
        },
        // Center div (containing harmony icons)
        topNavCenterDivEl: {
            get: function() {
                return this.topNavDivEl.element('.navGroup.center');
            }
        },
        topNavHarButtonsListEl: {
            get: function() {
                return this.topNavCenterDivEl.elements('button');
            }
        },
        // Global actions
        topNavRightDivEl: {
            get: function() {
                return this.topNavDivEl.element('.navGroup.right');
            }
        },
        topNavGlobalActDivEl: {
            get: function() {
                return this.topNavRightDivEl.element('.globalActions');
            }
        },
        topNavGlobalActionsListUlEl: {
            get: function() {
                return this.topNavRightDivEl.element('.globalActionsList');
            }
        },
        topNavGlobalActionsListEl: {
            get: function() {
                return this.topNavGlobalActionsListUlEl.elements('.link');
            }
        },
        topNavUserGlobActEl: {
            get: function() {
                return this.topNavGlobalActionsListEl.get(0);
            }
        },
        topNavHelpGlobActEl: {
            get: function() {
                return this.topNavGlobalActionsListEl.get(1);
            }
        },

        leftNavGlobActsDivEl: {
            get: function() {
                this.navMenuEl.element('.globalActions');
            }
        },
        leftNavGlobActsUlEl: {
            get: function() {
                return this.leftNavGlobActsDivEl.elements('.globalActionsList');
            }
        },
        clickTopNavHamburger: {
            get: function() {
                this.topNavDivEl.waitForVisible();
                this.topNavToggleHamburgerEl.click();
                this.navMenuEl.waitForVisible();
            }
        },
        // Assert that global actions are present in the Left Nav
        assertGlobalActsNotDisplayedInLeftNav: {
            get: function() {
                expect(this.leftNavGlobActsUlEl.isExisting()).toBeTruthy();
                expect(this.leftNavGlobActsUlEl.getAttribute('clientWidth')).toBe('0');
                expect(this.leftNavGlobActsUlEl.getAttribute('offsetWidth')).toBe('0');
            }
        },
    });
}());
