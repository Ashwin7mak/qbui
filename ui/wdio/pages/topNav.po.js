/**
 * This file uses the Page Object pattern to define topNav page for test
 * cperikal 4/18/2017
 */
(function() {
    'use strict';
    module.exports = Object.create(e2ePageBase, {
        formBuilderBtn: {
            get: function() {
                return browser.element('.topNav .formBuilder');
            }
        },
        modifyThisForm: {
            get: function() {
                return browser.element('.topNav #modifyForm');
            }
        },
        // Left Nav menu elements
        navMenuEl: {
            get: function() {
                return browser.elements('.leftNav');
            }
        },
        // Top Nav elements
        topNavDivEl: {
            get: function() {
                return browser.element('.topNav');
            }
        },
        // Top Nav Hamburger element
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
        // Top Nav Harmony buttons
        topNavHarButtonsListEl: {
            get: function() {
                return this.topNavCenterDivEl.elements('button');
            }
        },
        // Top Nav Right elements
        topNavRightDivEl: {
            get: function() {
                return this.topNavDivEl.element('.navGroup.right');
            }
        },
        // Top Nav Global Actions
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
        // Top Nav User Global element
        topNavUserGlobActEl: {
            get: function() {
                return this.topNavGlobalActionsListEl.get(0);
            }
        },
        // Top Nav Help Global element
        topNavHelpGlobActEl: {
            get: function() {
                return this.topNavGlobalActionsListEl.get(1);
            }
        },
        // Left Nav Global Actions
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
        // Click on top nav Hamburger menu
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
