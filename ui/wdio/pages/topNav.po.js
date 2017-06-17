/**
 * This file uses the Page Object pattern to define topNav page for test
 * cperikal 4/18/2017
 */
(function() {
    'use strict';
    // Import the base page object
    var e2ePageBase = requirePO('./e2ePageBase');

    module.exports = Object.create(e2ePageBase, {
        center: {
            get: function() {
                return browser.element('.topNav .center');
            }
        },
        title: {
            get: function() {
                return browser.element('.topNav .topTitle');
            }
        },
        settingsBtn: {
            get: function() {
                return browser.element('.topNav .iconUISturdy-settings');
            }
        },
        // Feedback button topNav
        feedbackBtn: {
            get: function() {
                return browser.element('.topNav .userFeedBack .dropdownToggle .iconTableSturdy-Advertising');
            }
        },
        //Give feedback option in Feedback button
        feedbackMenuButton: {
            get: function() {
                return this.feedbackBtn.element('.feedbackMenuButton');
            }
        },
        modifyThisForm: {
            get: function() {
                browser.element('.configMenu .modifyForm').waitForVisible();
                return browser.element('.configMenu .modifyForm');
            }
        },
        //Report issue option in Feedback button
        reportFeedBackButton: {
            get: function() {
                return this.feedbackBtn.element('.reportFeedBackButton');
            }
        },
        settingsDropdownHeader: {
            get: function() {
                return browser.element('.dropdown-menu .menuHeader');
            }
        },
        //Users button topNav
        usersButton: {
            get: function() {
                return browser.element('.topNav .userDropDown .dropdownToggle .iconUISturdy-user');
            }
        },
        userDropdownAppName: {
            get: function() {
                return browser.element('.appMenuHeader');

            }
        },
        signOutButton: {
            get: function() {
                return browser.element('.signOutButton');

            }
        },
        //Help button topNav
        helpButton: {
            get: function() {
                return browser.element('.topNav .reHelpButton');
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
                return browser.element('.topNav .iconUISturdy-hamburger');
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
        // Top Nav Global Actions
        topNavGlobalActDivEl: {
            get: function() {
                return browser.element('.navGroup .globalActions');
            }
        },
        topNavGlobalActionsListUlEl: {
            get: function() {
                return browser.element('.navGroup.right .globalActionsList');
            }
        },
        topNavGlobalActionsListEl: {
            get: function() {
                return this.topNavGlobalActionsListUlEl.elements('.link');
            }
        },
        /**
        Page objects for topNav - small breakpoint
         */
        // Top Nav search element
        topNavSmallSearchEl: {
            get: function() {
                // return browser.element('.iconUISturdy-search');
                return browser.element('.smallHeader .right .iconLink');
            }
        },
        // Top Nav Title element
        topNavTitleEl: {
            get: function() {
                return browser.element('.smallHeader .title');
            }
        },
        // Top Nav search box element
        topNavSearchBoxEl: {
            get: function() {
                return browser.element('.smallHeader .center .searchInput');
            }
        },
        // Top Nav mini clear button
        topNavClearSearchEl: {
            get: function() {
                return browser.element('.smallHeader .searchIcon');
            }
        },
        // Top Nav cancel element
        topNavCancelEl: {
            get: function() {
                return browser.element('.smallHeader .cancelButton');
            }
        },
        /**
         * Function to click on topNavToggleHamburgerEl
         */
        clickTopNavToggleHamburgerEl: {
            value: function() {
                //wait for hamburger in the topNav
                this.topNavToggleHamburgerEl.waitForVisible();

                //click on the hamburger in the topNav
                return this.topNavToggleHamburgerEl.click();
            }
        },

    });
}());
