/**
 * This file uses the Page Object pattern to define topNav page for test
 * cperikal 4/18/2017
 */
(function() {
    'use strict';
    // Import the base page object
    var e2ePageBase = requirePO('./e2ePageBase');
    let loadingSpinner = requirePO('/common/loadingSpinner');

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
                return browser.element('.topNav .right .iconUISturdy-settings');
            }
        },
        // Feedback button topNav
        feedbackBtn: {
            get: function() {
                return browser.element('.topNav .userFeedBack .dropdownToggle .iconUISturdy-feedback');
            }
        },
        //Give feedback option in Feedback button
        feedbackMenuButton: {
            get: function() {
                return browser.element('.userFeedBack .dropdown-menu .feedbackMenuButton a');
            }
        },
        modifyThisForm: {
            get: function() {
                return browser.element('a.modifyForm');
            }
        },
        //Report issue option in Feedback button
        reportFeedBackButton: {
            get: function() {
                return browser.element('.userFeedBack .dropdown-menu .reportFeedBackButton a');
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
                return browser.element('.topNav .userDropDown .navLabel');
            }
        },
        userDropdownAppName: {
            get: function() {
                return browser.element('.dropdown-menu .appMenuHeader');

            }
        },
        signOutButton: {
            get: function() {
                return browser.element('.dropdown-menu .signOutButton');

            }
        },
        //Help button topNav
        helpButton: {
            get: function() {
                return browser.element('.topNav .right .reHelpButton');
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
                return browser.element('.topNav .left .iconUISturdy-hamburger');
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

        /**
         * Method to verify settings drop down
         */
        clickOnSettingsBtn : {value: function() {
            this.settingsBtn.waitForVisible();
            //Click on settings gear Icon on table global actions
            return this.settingsBtn.click();
        }},

        /**
         * Method to click on table settings and properties link under tables gear icon in global actions
         */
        clickOnModifyFormLink : {value: function() {
            this.clickOnSettingsBtn();
            //Need this for container to slide down
            browser.pause(e2eConsts.shortWaitTimeMs);
            //Click on table properties and settings link
            this.modifyThisForm.waitForVisible();
            this.modifyThisForm.click();
            loadingSpinner.waitUntilLoadingSpinnerGoesAway();
            return browser.element('.formTable .formElement.field').waitForVisible();
        }},

        /**
         * Method to verify hamburger
         */
        verifyTopNavHamburger : {value: function() {
            //Verify topNav hamburger
            this.topNavToggleHamburgerEl.waitForVisible();
            expect(this.topNavToggleHamburgerEl.isEnabled()).toBe(true);
        }},

        /**
         * Method to verify feedback drop down
         */
        verifyTopNavFeedback : {value: function() {
            //Verify the presence of Feedback and Report issue buttons
            this.feedbackBtn.waitForVisible();
            this.feedbackBtn.click();
            //Need this for container to slide down
            browser.pause(e2eConsts.shortWaitTimeMs);
            //verify Give feedback
            expect(this.feedbackMenuButton.getAttribute('textContent')).toContain('Give feedback');
            expect(this.feedbackMenuButton.isEnabled()).toBe(true);
            //Verify Report an issue
            expect(this.reportFeedBackButton.getAttribute('textContent')).toContain('Report an issue');
            return expect(this.reportFeedBackButton.isEnabled()).toBe(true);
        }},

        /**
         * Method to verify user dropdown
         */
        verifyTopNavUserMenu : {value: function(app) {
            let userMenuList = [];
            this.usersButton.click();
            //Need this for container to slide down
            browser.pause(e2eConsts.shortWaitTimeMs);
            //Verify app name link is available and is disabled
            expect(this.userDropdownAppName.getAttribute('textContent')).toEqual(app.name);
            expect(this.userDropdownAppName.isEnabled()).toBe(true);
            //Verify signout button is enabled
            expect(this.signOutButton.isEnabled()).toBe(true);
            //Verify locale links present
            browser.elements('.userDropDown .dropdown-menu .localeLink').value.map(function(elm) {
                expect(elm.isEnabled()).toBe(true);
                userMenuList.push(elm.getAttribute('textContent'));
                return userMenuList;
            });
            expect(userMenuList.includes('English')).toBe(true);
            expect(userMenuList.includes('German')).toBe(true);
            expect(userMenuList.includes('French')).toBe(true);
        }},

        /**
         * Method to verify settings drop down
         */
        verifySettingsDropDown : {value: function(isAppPage, isTablePage, isReportPage, isUsersPage) {
            let liElements = [];
            this.settingsBtn.waitForVisible();
            //Click on settings gear Icon on table global actions
            this.settingsBtn.click();
            //Need this for container to slide down
            browser.pause(e2eConsts.shortWaitTimeMs);

            expect(browser.element('.menuHeader').getAttribute('textContent')).toContain('Settings');

            browser.elements('.configMenu li').value.map(function(elm) {
                liElements.push(elm.getAttribute('textContent'));
            });

            if (isAppPage === true) {
                return expect(liElements).toEqual(['App', 'Automations']);
            }
            if (isTablePage === true) {
                return expect(liElements).toEqual(['App', 'Automations', 'Table', 'Table properties & settings', 'Report', 'Modify this report']);
            }
            if (isReportPage === true) {
                return expect(liElements).toEqual(['App', 'Automations', 'Table', 'Table properties & settings', 'Report', 'Modify this report']);
            }
            if (isUsersPage === true) {
                return expect(liElements).toEqual(['App', 'Automations']);
            }
        }},

        /**
         * Method to verify topNav in all pages
         */
        verifyTopNav : {value: function(app, isAppPage, isTablePage, isReportPage, isUsersPage) {
            //Verify the no.of global action icons
            expect(this.topNavGlobalActionsListEl.value.length).toBe(4);
            //Verify hamburger functionality
            this.verifyTopNavHamburger();

            //Verify Feedback
            this.verifyTopNavFeedback();

            //Verify setting drop down
            this.verifySettingsDropDown(isAppPage, isTablePage, isReportPage, isUsersPage);

            //Verify that Users drop down
            this.verifyTopNavUserMenu(app);

            //Verify the help button is enabled
            expect(this.helpButton.isEnabled()).toBe(true);
        }},

    });
}());
