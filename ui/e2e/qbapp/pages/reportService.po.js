/**
 * This file uses the Page Object pattern to define the reportService page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 *
 * Created by klabak on 4/10/15
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');

    var e2ePageBase = require('./../../common/e2ePageBase');
    var SHOW_POPUP_LIST_LIMIT = 5;

    var ReportServicePage = function() {
        // Page Elements using Locators
        // Left Nav
        this.navMenuBodyEl = element(by.tagName('body'));
        this.navMenuShellEl = element(by.className('navShell'));
        this.navMenuEl = element(by.className('leftNav'));
        this.navStackedEl = element(by.className('nav-stacked'));
        this.navLinksElList = this.navStackedEl.all(by.className('leftNavLink'));
        this.appsHomeLinkEl = this.navLinksElList.first();
        // Apps List
        this.appToggleDivEl = element(by.className('appsToggle'));
        this.appsListDivEl = element(by.className('appsList'));
        this.appSearchHeadingEl = this.appsListDivEl.element(by.className('heading'));
        this.appsSearchIconEl = this.appSearchHeadingEl.element(by.className('qbIcon'));
        this.appLinksElList = this.appsListDivEl.all(by.className('leftNavLink'));
        // App Search
        this.searchAppsDivEl = this.appsListDivEl.element(by.className('search'));
        this.searchAppsInputEl = this.searchAppsDivEl.element(by.tagName('input'));
        // Tables List
        this.tablesListDivEl = element(by.className('tablesList'));
        this.tableLinksElList = this.tablesListDivEl.all(by.className('link'));
        // Reports List
        this.reportHamburgersElList = this.tablesListDivEl.all(by.className('right'));
        this.reportsListDivEl = element(by.className('reportsList'));
        this.reportsTopDivEl = this.reportsListDivEl.element(by.className('reportsTop'));
        this.reportGroupsDivEl = this.reportsListDivEl.element(by.className('reportGroups'));
        this.reportGroupElList = this.reportsListDivEl.all(by.className('reportGroup'));
        // Global Actions (only displayed on smallest breakpoint)
        this.leftNavGlobActsDivEl = this.navMenuEl.element(by.className('globalActions'));
        this.leftNavGlobActsUlEl = this.leftNavGlobActsDivEl.element(by.className('globalActionsList'));
        this.leftNavGlobActsListEl = this.leftNavGlobActsUlEl.all(by.className('link'));
        this.leftNavHelpGlobActEl = this.leftNavGlobActsListEl.get(0);
        this.leftNavUserGlobActEl = this.leftNavGlobActsListEl.get(1);
        this.leftNavUserGlobActLabelEl = this.leftNavUserGlobActEl.element(by.className('navLabel'));

        // Top Nav
        this.topNavDivEl = element(by.className('topNav'));
        // Top Nav on small breakpoint
        this.reportHeaderEl = element(by.className('reportHeader'));
        this.reportHeaderLeftEl = this.reportHeaderEl.element(by.className('left'));
        this.reportHeaderToggleHamburgerEl = this.reportHeaderLeftEl.element(by.className('iconLink'));
        // Left div (containing leftNav toggle hamburger)
        this.topNavToggleHamburgerEl = this.topNavDivEl.element(by.className('iconLink'));
        this.topNavLeftDivEl = this.topNavDivEl.element(by.className('left'));
        // Center div (containing harmony icons)
        this.topNavCenterDivEl = this.topNavDivEl.element(by.className('center'));
        this.topNavHarButtonsListEl = this.topNavCenterDivEl.all(by.tagName('button'));
        // Right div (containing global actions and right dropdown)
        // Global actions
        this.topNavRightDivEl = this.topNavDivEl.element(by.className('right'));
        this.topNavGlobalActDivEl = this.topNavRightDivEl.element(by.className('globalActions'));
        this.topNavGlobalActionsListUlEl = this.topNavGlobalActDivEl.element(by.className('globalActionsList'));
        this.topNavGlobalActionsListEl = this.topNavGlobalActionsListUlEl.all(by.className('link'));
        this.topNavUserGlobActEl = this.topNavGlobalActionsListEl.get(0);
        this.topNavHelpGlobActEl = this.topNavGlobalActionsListEl.get(1);
        this.topNavElipsesGlobActEl = this.topNavGlobalActionsListEl.get(2);

        // Report Container
        this.mainContentEl = element(by.className('mainContent'));
        this.reportContainerEl = element(by.className('reportContainer'));
        // Report Stage
        this.reportStageContentEl = this.reportContainerEl.element(by.className('layout-stage '));
        this.reportStageBtn = this.reportContainerEl.element(by.className('toggleStage'));
        this.reportStageArea = this.reportStageContentEl.element(by.className('collapse'));

        // Report tools and content container
        this.reportToolsAndContentEl = this.reportContainerEl.element(by.className('reportToolsAndContentContainer'));
        // Loaded Content Div
        this.loadedContentEl = this.reportToolsAndContentEl.all(by.className('loadedContent')).first();
        // report table
        this.reportTable = this.loadedContentEl.element(by.className('reportTable'));
        // Table actions container
        this.reportActionsContainerEl = this.reportTable.element(by.className('tableActionsContainer'));
        // Report toolbar
        this.reportsToolBar = this.reportActionsContainerEl.element(by.className('reportToolbar'));
        // Report records count
        this.reportRecordsCount = this.reportsToolBar.element(by.className('recordsCount'));
        // Report filter search Box
        this.reportFilterSearchBox = this.reportsToolBar.element(by.className('filterSearchBox'));

        // Loaded Content Div
        this.loadedContentEl = this.reportContainerEl.all(by.className('loadedContent')).first();
        // Table actions container
        this.tableActionsContainerEl = this.loadedContentEl.element(by.className('tableActionsContainer'));
        // agGrid table
        this.griddleWrapperEl = this.loadedContentEl.element(by.className('griddleWrapper'));
        this.agGridContainerEl = this.griddleWrapperEl.all(by.className('agGrid')).first();
        this.agGridBodyEl = this.agGridContainerEl.element(by.className('ag-body-container'));
        this.agGridHeaderEl = this.agGridContainerEl.element(by.className('ag-header-container'));
        // All column headers from agGrid including first checkbox and last hidden actions column
        this.agGridColHeaderElList = this.agGridHeaderEl.all(by.className('ag-header-cell'));
        this.agGridLastColHeaderEl = this.agGridColHeaderElList.last();
        this.agGridRecordElList = this.agGridBodyEl.all(by.className('ag-row'));

        /**
         * Given a table link element in the leftNav, open the reports menu for that table
         * @param tableLinkEl
         */
        this.openReportsMenu = function(tableLinkEl) {
            e2ePageBase.waitForElement(tableLinkEl).then(function() {
                var hamburgerEl = tableLinkEl.all(by.className('right')).first();
                return hamburgerEl.click();
            });
        };

        /**
         * Function that will open the report group and load the report specified by name
         * @param reportGroup
         * @param reportName
         */
        this.selectReport = function(reportGroup, reportName) {
            // Let the trowser animate
            e2eBase.sleep(browser.params.smallSleep);

            // Expand the Report group
            this.reportGroupElList.filter(function(elem) {
                // Return the element or elements
                return elem.element(by.className('qbPanelHeaderTitleText')).getText().then(function(text) {
                    // Match the text
                    return text === reportGroup;
                });
            }).then(function(filteredElements) {
                // filteredElements is the list of filtered elements (in this case the Report Group div)
                // Check to see if the report group is already expanded (functionality is sticky from prior tests)
                return e2ePageBase.hasClass(filteredElements[0].element(by.className('qbPanelHeaderIcon')), 'rotateUp').then(function(result) {
                    if (result === true) {
                        return filteredElements[0].element(by.className('qbPanelHeaderIcon')).click();
                    }
                });
            });

            // Find and select the report based on name
            //TODO: Break this filter out into a separate function
            this.reportGroupElList.filter(function(elem) {
                // Return the element or elements
                return elem.element(by.className('qbPanelHeaderTitleText')).getText().then(function(text) {
                    // Match the text
                    return text === reportGroup;
                });
            }).then(function(reportGroupElements) {
                reportGroupElements[0].all(by.className('reportLink')).filter(function(elem) {
                    // Return the element or elements
                    return elem.getText().then(function(text) {
                        // Match the text
                        return text === reportName;
                    });
                }).then(function(reportLinkElements) {
                    return reportLinkElements[0].click();
                });
            });
        };

        /**
        * Helper function that will get all of the field column headers from the report. Returns an array of strings.
        */
        this.getReportColumnHeaders = function() {
            var deferred = Promise.pending();
            this.agGridColHeaderElList.then(function(elements) {
                var fetchTextPromises = [];
                for (var i = 0; i < elements.length; i++) {
                    // Firefox has innerHTML instead of innerText so use that instead
                    if (browser.browserName === 'firefox') {
                        fetchTextPromises.push(elements[i].getAttribute('innerHTML'));
                    } else {
                        fetchTextPromises.push(elements[i].getAttribute('innerText'));
                    }
                }
                return Promise.all(fetchTextPromises);
            }).then(function(colHeaders) {
                var fieldColHeaders = [];
                // Remove the first column header (record select column) and the last (hidden record actions)
                // Remove the select all checkbox column header
                colHeaders.shift();
                // Remove the actions column header
                colHeaders.pop();
                colHeaders.forEach(function(headerText) {
                    if (!headerText) {
                        throw Error('Did not find text for column header');
                    }
                    // The getText call above is returning the text value with a new line char on the end, need to remove it
                    var subText = headerText.replace(/(\r\n|\n|\r)/gm, '');
                    if (subText !== 'actions') {
                        fieldColHeaders.push(subText.trim());
                    }
                });
                return fieldColHeaders;
            }).then(function(fieldColHeaders) {
                return deferred.resolve(fieldColHeaders);
            }).then(null, function(error) {
                deferred.reject(error);
                throw error;
            });
            return deferred.promise;
        };

        /**
         * Assertion function that will test the properties of the leftNav
         */
        this.assertNavProperties = function(breakpointSize, open, offsetWidth) {
            var self = this;

            return browser.controlFlow().execute(function() {
                // Check properties of nav bar
                // First subclass of leftNav deals with the small BP - either open or closed
                // Second subclass is for the other BPs - either collapsed or expanded
                if (open && breakpointSize === 'small') {
                    expect(self.navMenuEl.getAttribute('class')).toContain('open');
                    expect(self.navMenuEl.getAttribute('offsetWidth')).toMatch(offsetWidth);
                } else if (open && breakpointSize !== 'small') {
                    expect(self.navMenuEl.getAttribute('class')).toContain('expanded');
                    expect(self.navMenuEl.getAttribute('offsetWidth')).toMatch(offsetWidth);
                } else if (!open && breakpointSize === 'small') {
                    expect(self.navMenuEl.getAttribute('class')).toContain('closed');
                    expect(self.navMenuEl.getAttribute('offsetWidth')).toMatch(offsetWidth);
                } else {
                    expect(self.navMenuEl.getAttribute('class')).toContain('collapsed');
                    expect(self.navMenuEl.getAttribute('offsetWidth')).toMatch(offsetWidth);
                }
            });

        };

        // Click the app list toggle in the leftNav
        this.clickAppToggle = function() {
            var deferred = Promise.pending();
            try {
                this.appToggleDivEl.click().then(function() {
                    // Sleep for a second to allow toggle animation to finish (and the DOM to refresh)
                    e2eBase.sleep(1000);
                    deferred.resolve();
                });
            } catch (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            }
            return deferred.promise;
        };

        // Click the app search toggle in the leftNav
        this.clickAppSearchToggle = function() {
            var deferred = Promise.pending();
            try {
                this.appsSearchIconEl.click().then(function() {
                    // Sleep for a second to allow toggle animation to finish (and the DOM to refresh)
                    e2eBase.sleep(1000);
                    deferred.resolve();
                });
            } catch (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            }
            return deferred.promise;
        };

        // Click the topNav hamburger icon (need to be on a dashboard page or loaded report not on small)
        this.clickTopNavHamburger = function() {
            var self = this;
            return e2ePageBase.waitForElement(self.topNavDivEl).then(function() {
                self.topNavToggleHamburgerEl.click().then(function() {
                    e2ePageBase.waitForElement(self.navMenuEl);
                });
            });
        };

        // Click the reportHeader hamburger icon (need to be on a loaded report on small)
        this.clickReportHeaderHamburger = function() {
            var self = this;
            return e2ePageBase.waitForElement(self.reportHeaderEl).then(function() {
                self.reportHeaderToggleHamburgerEl.click().then(function() {
                    e2ePageBase.waitForElement(self.navMenuEl);
                });
            });
        };

        // For small breakpoint only, use expand / collapse for other BPs
        this.openLeftNav = function() {
            var self = this;
            var fetchTextPromises = [];

            // LeftNav
            fetchTextPromises.push(this.navMenuEl.getAttribute('class'));
            // Shows if you are on a dashboard page
            fetchTextPromises.push(this.topNavToggleHamburgerEl.isPresent());
            // Shows if you are on a loaded report
            fetchTextPromises.push(this.reportHeaderToggleHamburgerEl.isPresent());

            return Promise.all(fetchTextPromises).then(function(promises) {
                // LeftNav is closed
                if (promises[0].includes('closed')) {
                    // Must be on a dashboard page
                    if (promises[1] && !promises[2]) {
                        // Click the hamburger and wait for the leftNav to be displayed
                        return self.topNavToggleHamburgerEl.click().then(function() {
                            return e2ePageBase.waitForElement(self.navMenuEl);
                        }).then(function() {
                            // Sleep for animation of the leftNav
                            return e2eBase.sleep(browser.params.tinySleep);
                        });
                        // Must be on a loaded report
                    } else if (promises[1] && promises[2]) {
                        // Click the hamburger and wait for the leftNav to be displayed
                        return self.reportHeaderToggleHamburgerEl.click().then(function() {
                            return e2ePageBase.waitForElement(self.navMenuEl);
                        }).then(function() {
                            // Sleep for animation of the leftNav
                            return e2eBase.sleep(browser.params.tinySleep);
                        });
                    } else {
                        throw Error('Error trying to open the leftNav');
                    }
                } else if (promises[0].includes('open')) {
                    // LeftNav is already open so do nothing
                    return promises[0];
                } else {
                    throw Error('Error getting leftNav state');
                }
            });
        };

        // For small breakpoint only. Use expand / collapse for other BPs
        this.closeLeftNav = function() {
            var self = this;
            var fetchTextPromises = [];

            // LeftNav
            fetchTextPromises.push(this.navMenuEl.getAttribute('class'));
            // Shows if you are on a dashboard page
            fetchTextPromises.push(this.topNavToggleHamburgerEl.isPresent());
            // Shows if you are on a loaded report
            fetchTextPromises.push(this.reportHeaderToggleHamburgerEl.isPresent());

            return Promise.all(fetchTextPromises).then(function(promises) {
                // LeftNav is open
                if (promises[0].includes('open')) {
                    // Must be on a dashboard page
                    if (promises[1] && !promises[2]) {
                        // Click the hamburger and wait for the leftNav to be closed
                        return self.topNavToggleHamburgerEl.click().then(function() {
                            return e2ePageBase.waitForElementToBeInvisible(self.navMenuEl);
                        }).then(function() {
                            // Sleep for animation of the leftNav
                            return e2eBase.sleep(browser.params.tinySleep);
                        });
                        // Must be on a loaded report
                    } else if (promises[1] && promises[2]) {
                        // Click the hamburger and wait for the leftNav to be closed
                        return self.reportHeaderToggleHamburgerEl.click().then(function() {
                            return e2ePageBase.waitForElementToBeInvisible(self.navMenuEl);
                        }).then(function() {
                            // Sleep for animation of the leftNav
                            return e2eBase.sleep(browser.params.tinySleep);
                        });
                    } else {
                        throw Error('Error trying to close the leftNav');
                    }
                } else if (promises[0].includes('closed')) {
                    // LeftNav is already closed so do nothing
                    return promises[0];
                } else {
                    throw Error('Error getting leftNav state');
                }
            });
        };


        // Gets text from the topNav
        this.getGlobalNavTextEl = function(globalNavEl) {
            var textEl = globalNavEl.all(by.tagName('span')).last();
            return textEl;
        };

        // Does element show up on the Left Nav bar.
        this.isElementInLeftNav = function(element, clientWidth) {
            expect(element.isDisplayed()).toBeTruthy();
            expect(element.getAttribute('offsetLeft')).toBe('0');
            expect(element.getAttribute('offsetWidth')).toBe(clientWidth);
        };

        // Assert that global actions are present in the Left Nav
        this.assertGlobalActsDisplayedInLeftNav = function() {
            expect(this.leftNavGlobActsUlEl.isPresent()).toBeTruthy();
            // We can't use Protractor's isDisplayed method in this case because dev implementation is not using
            // display value or the hidden property to hide the element from view, it is changing the widths of the elements
            expect(this.leftNavGlobActsUlEl.getAttribute('clientWidth')).toBeGreaterThan('0');
            expect(this.leftNavGlobActsUlEl.getAttribute('offsetWidth')).toBeGreaterThan('0');
        };

        // Assert that global actions are present in the Left Nav
        this.assertGlobalActsNotDisplayedInLeftNav = function() {
            expect(this.leftNavGlobActsUlEl.isPresent()).toBeTruthy();
            expect(this.leftNavGlobActsUlEl.getAttribute('clientWidth')).toBe('0');
            expect(this.leftNavGlobActsUlEl.getAttribute('offsetWidth')).toBe('0');
        };


        // Assert that global actions are present in the Top Nav bar
        this.assertGlobalActsDisplayedInTopNav = function() {
            expect(this.topNavGlobalActionsListUlEl.isPresent()).toBeTruthy();
            expect(this.topNavGlobalActionsListUlEl.getAttribute('clientWidth')).toBeGreaterThan('0');
            expect(this.topNavGlobalActionsListUlEl.getAttribute('offsetWidth')).toBeGreaterThan('0');
        };

        // Assert that global actions are present in the Top Nav bar
        this.assertGlobalActsNotDisplayedInTopNav = function() {
            expect(this.topNavGlobalActionsListUlEl.isPresent()).toBeTruthy();
            expect(this.topNavGlobalActionsListUlEl.getAttribute('clientWidth')).toBe('0');
            expect(this.topNavGlobalActionsListUlEl.getAttribute('offsetWidth')).toBe('0');
        };
    };
    ReportServicePage.prototype = e2ePageBase;
    module.exports = ReportServicePage;
}());
